-- ─────────────────────────────────────────────────────────────────────────────
-- Portfolio — Supabase schema
-- Run this in: supabase.com → your project → SQL Editor → New query
-- Safe to re-run: all statements use IF NOT EXISTS / DO NOTHING guards.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Contact form submissions ──────────────────────────────────────────────────
create table if not exists contact_submissions (
  id           uuid        primary key default gen_random_uuid(),
  name         text        not null,
  email        text        not null,
  project_type text,
  message      text        not null,
  created_at   timestamptz default now()
);

alter table contact_submissions enable row level security;

drop policy if exists "Service role only" on contact_submissions;
create policy "Service role only"
  on contact_submissions
  for all
  using (false);


-- ── Journal posts ─────────────────────────────────────────────────────────────
create table if not exists posts (
  id           uuid        primary key default gen_random_uuid(),
  slug         text        unique not null,
  title        text        not null,
  excerpt      text,
  content      text,                          -- full body in Markdown
  year         int,
  reading_time int,
  tags         text[]      default '{}',
  topic_prompt text,                          -- the exact prompt used for generation (deduplication)
  published_at timestamptz,
  status       text        not null default 'draft',  -- 'draft' | 'published' | 'rejected'
  created_at   timestamptz default now()
);

-- Add topic_prompt to existing tables (safe migration — no-op if column exists)
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'posts' and column_name = 'topic_prompt'
  ) then
    alter table posts add column topic_prompt text;
  end if;
end $$;

-- Row-level security: public can read published posts; all writes go through service role
alter table posts enable row level security;

-- Drop old policy if it exists, then recreate (idempotent)
drop policy if exists "Anyone can read published posts" on posts;
create policy "Anyone can read published posts"
  on posts
  for select
  using (status = 'published');


-- ── social_posts: add image_prompt + image_urls (safe migration) ─────────────
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name='social_posts' and column_name='image_prompt') then
    alter table social_posts add column image_prompt text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='social_posts' and column_name='image_urls') then
    alter table social_posts add column image_urls text[] default '{}';
  end if;
end $$;

-- ── Supabase Storage: social-images bucket ───────────────────────────────────
-- Public bucket for uploaded social post images. Safe to re-run (on conflict skip).
insert into storage.buckets (id, name, public)
values ('social-images', 'social-images', true)
on conflict (id) do nothing;

-- Allow anyone to read public images (the bucket is already public, this covers the objects policy)
drop policy if exists "Public read social images" on storage.objects;
create policy "Public read social images"
  on storage.objects for select
  using (bucket_id = 'social-images');

-- Service role writes/deletes (admin only)
drop policy if exists "Service role write social images" on storage.objects;
create policy "Service role write social images"
  on storage.objects for insert
  with check (bucket_id = 'social-images');

-- ── posts: add niche column (safe migration) ─────────────────────────────────
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'posts' and column_name = 'niche'
  ) then
    alter table posts add column niche text not null default 'general';
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- SOCIAL MEDIA CONTENT SYSTEM
-- ─────────────────────────────────────────────────────────────────────────────

-- ── topic_funnels ─────────────────────────────────────────────────────────────
-- One funnel per approved blog post. Tracks the 10-day rolling content cycle.
-- Each funnel spawns ~25 social_posts across all platforms.
create table if not exists topic_funnels (
  id            uuid        primary key default gen_random_uuid(),
  post_id       uuid        not null references posts(id) on delete cascade,
  niche         text        not null default 'general',
  -- 'home' | 'living' | 'technology' | 'ai' | 'pet-supplies' | 'general'
  current_stage text        not null default 'awareness',
  -- 'awareness' | 'education' | 'engagement' | 'conversion'
  start_date    date        not null default current_date,
  end_date      date        not null,            -- start_date + 10 days
  schedule      jsonb       not null default '{}', -- full generated schedule keyed by day
  status        text        not null default 'active',
  -- 'active' | 'completed' | 'paused'
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table topic_funnels enable row level security;
drop policy if exists "Service role only" on topic_funnels;
create policy "Service role only" on topic_funnels for all using (false);

create index if not exists idx_topic_funnels_post_id  on topic_funnels(post_id);
create index if not exists idx_topic_funnels_status   on topic_funnels(status);
create index if not exists idx_topic_funnels_niche    on topic_funnels(niche);


-- ── social_posts ──────────────────────────────────────────────────────────────
-- Individual content pieces generated within a funnel.
-- Each row = one post on one platform on one day of the funnel.
create table if not exists social_posts (
  id               uuid        primary key default gen_random_uuid(),
  funnel_id        uuid        not null references topic_funnels(id) on delete cascade,
  post_id          uuid        not null references posts(id) on delete cascade,
  niche            text        not null default 'general',

  -- Platform + format
  platform         text        not null,
  -- 'instagram' | 'facebook' | 'tiktok' | 'youtube'
  content_type     text        not null,
  -- 'video_script' | 'carousel' | 'image_caption' | 'text_post'
  -- 'story' | 'reel_script' | 'shorts_script' | 'community_post'

  -- Funnel position
  funnel_stage     text        not null,
  -- 'awareness' | 'education' | 'engagement' | 'conversion'
  scheduled_day    int         not null,   -- 1–10 (day within the funnel)
  scheduled_date   date,                   -- actual calendar date

  -- Core content
  hook             text,                   -- opening line / scroll-stopper
  caption          text,                   -- main post caption / body text
  hashtags         text[]      default '{}',
  cta              text,                   -- call-to-action line

  -- Carousel (instagram / facebook)
  slide_content    jsonb,
  -- array of { slide: int, headline: text, body: text, image_prompt: text }

  -- Video / Reel / Shorts / TikTok
  script           text,                   -- full spoken script
  shot_list        jsonb,
  -- array of { shot: int, type: text, description: text, duration_sec: int }
  is_personal_video boolean    default false,
  -- true = "record this yourself" flag (BOFU personal CTA)

  -- Virality scoring
  virality_score   numeric(4,2),           -- 0.00–10.00 weighted average
  virality_breakdown jsonb,
  -- { hook: 8, value: 7, emotion: 9, shareability: 6, purchase_intent: 5 }
  virality_snippet text,                   -- 2–3 sentence score explanation

  -- Affiliate links
  affiliate_link_ids uuid[]    default '{}',  -- references affiliate_links.id

  -- Approval workflow
  status           text        not null default 'pending',
  -- 'pending' | 'approved' | 'rejected' | 'posted' | 'edit_requested'
  edit_request     text,                   -- user's typed edit instructions
  edit_count       int         not null default 0,
  approved_at      timestamptz,
  posted_at        timestamptz,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

alter table social_posts enable row level security;
drop policy if exists "Service role only" on social_posts;
create policy "Service role only" on social_posts for all using (false);

create index if not exists idx_social_posts_funnel_id      on social_posts(funnel_id);
create index if not exists idx_social_posts_post_id        on social_posts(post_id);
create index if not exists idx_social_posts_platform       on social_posts(platform);
create index if not exists idx_social_posts_status         on social_posts(status);
create index if not exists idx_social_posts_scheduled_date on social_posts(scheduled_date);
create index if not exists idx_social_posts_stage          on social_posts(funnel_stage);
create index if not exists idx_social_posts_niche          on social_posts(niche);


-- ── affiliate_links ───────────────────────────────────────────────────────────
-- Library of affiliate links. Claude auto-matches by niche + keywords.
-- User manually adds links; system attaches them to social_posts.
create table if not exists affiliate_links (
  id              uuid        primary key default gen_random_uuid(),
  product_name    text        not null,
  niche           text        not null,
  -- 'home' | 'living' | 'technology' | 'ai' | 'pet-supplies' | 'general'
  affiliate_platform text     not null default 'amazon',
  -- 'amazon' | 'tiktok-shop' | 'facebook' | 'instagram' | 'other'
  url             text        not null,
  commission_type text,                   -- 'percentage' | 'flat'
  commission_rate numeric(5,2),           -- e.g. 8.50 for 8.5%
  keywords        text[]      default '{}',
  -- keywords Claude uses for auto-matching to posts (e.g. 'robot vacuum','smart home')
  is_active       boolean     not null default true,
  notes           text,                   -- optional internal notes
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table affiliate_links enable row level security;
drop policy if exists "Service role only" on affiliate_links;
create policy "Service role only" on affiliate_links for all using (false);

create index if not exists idx_affiliate_links_niche    on affiliate_links(niche);
create index if not exists idx_affiliate_links_platform on affiliate_links(affiliate_platform);
create index if not exists idx_affiliate_links_active   on affiliate_links(is_active);


-- ── content_schedule ──────────────────────────────────────────────────────────
-- Calendar view: one row per social_post scheduled date + platform.
-- Source of truth for the content calendar in the admin dashboard.
create table if not exists content_schedule (
  id             uuid        primary key default gen_random_uuid(),
  social_post_id uuid        not null references social_posts(id) on delete cascade,
  funnel_id      uuid        not null references topic_funnels(id) on delete cascade,
  platform       text        not null,
  niche          text        not null default 'general',
  scheduled_date date        not null,
  scheduled_time time,                    -- optional: specific post time
  status         text        not null default 'scheduled',
  -- 'scheduled' | 'approved' | 'posted' | 'skipped'
  created_at     timestamptz default now()
);

alter table content_schedule enable row level security;
drop policy if exists "Service role only" on content_schedule;
create policy "Service role only" on content_schedule for all using (false);

create index if not exists idx_content_schedule_date     on content_schedule(scheduled_date);
create index if not exists idx_content_schedule_platform on content_schedule(platform);
create index if not exists idx_content_schedule_status   on content_schedule(status);
create index if not exists idx_content_schedule_funnel   on content_schedule(funnel_id);


-- ── Seed posts (run only once — on conflict skip) ─────────────────────────────
insert into posts (slug, title, excerpt, year, reading_time, tags, published_at, status, topic_prompt) values
  (
    'schema-as-contract',
    'Schema as Contract',
    'On treating every Postgres schema decision as a published interface.',
    2025, 6,
    array['Databases'],
    '2025-03-12'::timestamptz,
    'published',
    'How I think about Postgres schema design as a contract with future-you'
  ),
  (
    'content-systems-thinking',
    'Content Systems Thinking',
    'Why your CMS is probably a database problem in disguise.',
    2025, 8,
    array['Content'],
    '2025-01-28'::timestamptz,
    'published',
    'The content system problem: why most CMSs are really database problems in disguise'
  ),
  (
    'ai-automation-signal-noise',
    'AI Automation: Signal vs Noise',
    'Separating durable automation patterns from the hype cycle.',
    2024, 10,
    array['AI'],
    '2024-11-05'::timestamptz,
    'published',
    'AI automation patterns that will still matter in five years'
  )
on conflict (slug) do nothing;

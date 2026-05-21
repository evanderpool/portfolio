-- Migration: Phased social content generation
-- Adds generation phase tracking to topic_funnels so content is generated
-- in three batches (Days 1-4, 5-7, 8-10) instead of all at once.
--
-- generation_phase values:
--   0 = nothing generated yet  (shouldn't stay here long)
--   1 = Phase 1 done (awareness + education, Days 1-4)
--   2 = Phase 2 done (engagement, Days 5-7)
--   3 = Phase 3 done (conversion, Days 8-10) — fully complete

ALTER TABLE topic_funnels
  ADD COLUMN IF NOT EXISTS generation_phase smallint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS phase1_at        timestamptz,
  ADD COLUMN IF NOT EXISTS phase2_at        timestamptz,
  ADD COLUMN IF NOT EXISTS phase3_at        timestamptz;

-- Existing funnels already have all content generated — mark them complete.
UPDATE topic_funnels
SET generation_phase = 3
WHERE generation_phase = 0;

-- Index for the cron query (filters by phase + status + start_date)
CREATE INDEX IF NOT EXISTS idx_topic_funnels_phase_status
  ON topic_funnels (generation_phase, status, start_date);

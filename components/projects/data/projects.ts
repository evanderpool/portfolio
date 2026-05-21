export type ProjectCategory = 'engineering' | 'content' | 'databases' | 'experiments'
export type ProjectStatus = 'live' | 'in-progress' | 'archived'

export type Project = {
  id: string
  slug: string            // URL segment — /work/[slug]
  title: string
  subtitle: string        // tagline shown on card
  description?: string    // full prose — case study page
  keyResult?: string      // single-sentence outcome — case study callout
  year: number
  role: string
  tags: string[]          // 3-5 items shown on card
  techStack?: string[]    // full tech list shown on case study page
  cover: string
  accent: string
  gridCol: number
  gridColStart?: number
  gridRowStart?: number
  category: ProjectCategory
  status?: ProjectStatus
  featured?: boolean
  liveUrl?: string
  githubUrl?: string
}

export const projects: Project[] = [
  // ── ROW 1 (cols 7 + 5 = 12) ───────────────────────────────────────────────
  {
    id: '01',
    slug: 'artificial-management',
    title: 'Artificial Management',
    subtitle: 'An enterprise AI operating system built from scratch — 10 agents, 8 skills, zero undocumented workflows.',
    description: 'A Fortune 500-style AI business operating system designed and built as a solo engineering project. Ten specialized agents run in parallel across departments — each with formal specs, defined I/O contracts, and audit trails. A cron-automated weekly executive briefing pulls from 52 live source files, generates a structured HTML summary, and delivers it to Gmail every Friday without a single manual step.',
    keyResult: '10-agent OS with 8 production skills, 6 MCP integrations, cron-automated weekly briefing, and a 52-file confidence-scored integrity audit — 18 corrections surfaced in the first run.',
    year: 2026,
    role: 'AI Architect & Engineer',
    tags: ['Claude API', 'MCP', 'Python', 'Node.js'],
    techStack: ['Claude Code', 'Claude API', 'MCP', 'GitHub MCP', 'Gmail MCP', 'Google Calendar MCP', 'Google Drive MCP', 'Microsoft 365 MCP', 'Python', 'Node.js', 'Git', 'Google Workspace'],
    cover: '/projects/artmgmt.jpg',
    accent: '#C8553D',
    gridCol: 7,
    gridRowStart: 1,
    category: 'engineering',
    status: 'in-progress',
    featured: true,
    githubUrl: 'https://github.com/evanderpool/artificial-management',
  },
  {
    id: '02',
    slug: 'multi-agent-research',
    title: 'Multi-Agent Research Workflow',
    subtitle: 'One question in. Three agents running in parallel. A structured research report out.',
    description: 'A stateful LangGraph multi-agent system where a Planner agent decomposes a research question into sub-questions, parallel Researcher nodes execute simultaneous web searches via the Send API fan-out pattern, and a Synthesizer agent compiles all findings into a structured markdown report. Built to demonstrate production-safe parallel agent state management with race-condition-free result accumulation.',
    keyResult: 'Parallel agent graph with race-condition-safe state accumulation using Annotated reducers — live execution updates streamed to a Streamlit UI as the graph runs.',
    year: 2026,
    role: 'AI Engineer',
    tags: ['LangGraph', 'LangChain', 'Claude AI', 'Streamlit'],
    techStack: ['LangGraph', 'LangChain', 'Claude Haiku', 'Tavily Search API', 'Streamlit', 'Python 3.12'],
    cover: '/projects/research-agent.jpg',
    accent: '#B89B5E',
    gridCol: 5,
    gridRowStart: 1,
    category: 'engineering',
    status: 'live',
    featured: true,
    githubUrl: 'https://github.com/evanderpool/langchain-research-agent',
  },

  // ── ROW 2 (cols 5 + 7 = 12) ───────────────────────────────────────────────
  {
    id: '03',
    slug: 'rag-knowledge-base',
    title: 'RAG Knowledge Base Builder',
    subtitle: 'Upload any PDF, ask anything — grounded answers with source citations, deployed live.',
    description: "An end-to-end RAG pipeline built in Python from document ingestion to LLM-grounded answer generation. Uses PyMuPDF for page-preserving extraction, ChromaDB for vector storage, HuggingFace embeddings for semantic search, and Groq's Llama 3.3 70B for citation-aware responses. A shared core pipeline powers both a CLI for technical users and a Streamlit web UI for everyone else.",
    keyResult: 'Production RAG pipeline with 1,000-char chunking, file-hash deduplication, token-budget controls, and semantic retrieval — deployed publicly on HuggingFace Spaces.',
    year: 2026,
    role: 'AI Engineer',
    tags: ['ChromaDB', 'HuggingFace', 'Groq', 'FastAPI'],
    techStack: ['Python', 'ChromaDB', 'HuggingFace sentence-transformers', 'PyMuPDF', 'Groq API', 'Llama 3.3 70B', 'Streamlit', 'FastAPI'],
    cover: '/projects/rag-builder.jpg',
    accent: '#4A5D49',
    gridCol: 5,
    gridRowStart: 2,
    category: 'engineering',
    status: 'live',
    featured: true,
    liveUrl: 'https://huggingface.co/spaces/evanderpool/rag-knowledge-base',
    githubUrl: 'https://github.com/evanderpool',
  },
  {
    id: '04',
    slug: 'portfolio-3d',
    title: '3D Portfolio Website',
    subtitle: 'Performance-engineered 3D portfolio — WebGL shaders, R3F scenes, and IO-gated rendering throughout.',
    description: 'A production-grade personal portfolio built with Next.js 16, React Three Fiber, GSAP, and Framer Motion. Every WebGL canvas is gated by IntersectionObserver to prevent off-screen GPU load. R3F canvases run frameloop="demand" where possible, a scrub-driven GSAP camera travels a CatmullRom spline through milestone markers, and seven discrete performance optimizations ship by default. TypeScript strict throughout.',
    keyResult: 'Fully performant 3D site with IO-gated WebGL, demand-rendered R3F canvases, animated pill nav, page-transition curtain system, and a custom scroll-driven spline camera.',
    year: 2026,
    role: 'Full-Stack Engineer & Designer',
    tags: ['React Three Fiber', 'GSAP', 'WebGL', 'Next.js'],
    techStack: ['Next.js 16', 'React 19', 'TypeScript', 'React Three Fiber', 'Three.js', 'GSAP', 'Framer Motion', 'Lenis', 'Tailwind CSS v4', 'WebGL / GLSL', 'Zustand', 'shadcn/ui', 'Vercel'],
    cover: '/projects/portfolio-3d.jpg',
    accent: '#C8553D',
    gridCol: 7,
    gridRowStart: 2,
    category: 'engineering',
    status: 'in-progress',
    featured: true,
  },

  // ── ROW 3 (cols 6 + 3 + 3 = 12) ──────────────────────────────────────────
  {
    id: '05',
    slug: 'enterprise-database-automation',
    title: 'Enterprise Database Automation',
    subtitle: 'Automated resident data-cleaning for 100+ live security systems — replaced a fully manual process end-to-end.',
    description: 'As Database Analyst at Envera Systems, managed data operations for 100+ gated-community security systems covering access control records, alarm data, resident information, and safety workflows. Collaborated with the Del Mar division and IT team to engineer a data automation tool that replaced a fully manual resident data-cleaning process, reducing errors and operational overhead across live production systems.',
    keyResult: 'Data automation tool eliminated manual data-cleaning for 100+ gated-community security systems in production — error rate reduced, workflow converted from fully manual to automated.',
    year: 2024,
    role: 'Database Analyst & Automation Engineer',
    tags: ['SQL', 'SSMS', 'Automation', 'Data Ops'],
    techStack: ['SQL', 'SQL Server Management Studio', 'Data Automation Tooling', 'Microsoft Excel', 'Access Control Systems'],
    cover: '/projects/envera-dataops.jpg',
    accent: '#B89B5E',
    gridCol: 6,
    gridRowStart: 3,
    category: 'databases',
    status: 'live',
    featured: true,
  },
  {
    id: '06',
    slug: 'covid-data-analysis',
    title: 'COVID-19 Data Analysis',
    subtitle: '330,000+ records. CTEs, JOINs, and Tableau dashboards revealing global pandemic patterns.',
    description: 'Analyzed over 330,000 COVID-19 records in SQL Server Management Studio using CTEs, JOINs, regex extraction, and aggregate functions to surface country-level infection, mortality, and vaccination trends. Turned the cleaned dataset into interactive Tableau Public dashboards for visual storytelling across time and geography.',
    keyResult: 'Country-level pandemic trends surfaced from 330,000+ records, published as interactive Tableau dashboards.',
    year: 2023,
    role: 'Data Analyst',
    tags: ['T-SQL', 'SSMS', 'Tableau'],
    techStack: ['SQL Server Management Studio', 'T-SQL', 'Tableau Public'],
    cover: '/projects/covid-analysis.jpg',
    accent: '#4A5D49',
    gridCol: 3,
    gridRowStart: 3,
    category: 'databases',
    status: 'archived',
    featured: false,
    githubUrl: 'https://github.com/evanderpool',
  },
  {
    id: '07',
    slug: 'nashville-housing',
    title: 'Nashville Housing Data Cleaning',
    subtitle: 'Raw housing data transformed into clean, analysis-ready records — SQL Server, no shortcuts.',
    description: 'Cleaned a Nashville housing dataset in SQL Server Management Studio by standardizing address formats, sale date fields, and data types across thousands of records. Used temp tables, aggregate functions, and data type conversions to produce a reproducible clean dataset with documented transformation logic for downstream reporting and analysis.',
    keyResult: 'Fully standardized housing dataset with documented transformation logic — reproducible and ready for downstream reporting.',
    year: 2023,
    role: 'Data Analyst',
    tags: ['T-SQL', 'SSMS', 'Data Cleaning'],
    techStack: ['SQL Server Management Studio', 'T-SQL'],
    cover: '/projects/nashville-sql.jpg',
    accent: '#C8553D',
    gridCol: 3,
    gridRowStart: 3,
    category: 'databases',
    status: 'archived',
    featured: false,
    githubUrl: 'https://github.com/evanderpool',
  },
]

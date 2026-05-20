export type MilestoneShape =
  | 'icosahedron'
  | 'torus'
  | 'octahedron'
  | 'cylinder'
  | 'dodecahedron'

export type Milestone = {
  year: number
  title: string
  body: string
  shape: MilestoneShape
  color: string
  fogColor: string
  cameraOffset: [number, number, number]
}

export const milestones: Milestone[] = [
  {
    year: 2019,
    title: 'First production database',
    body: 'Shipped my first Postgres-backed app — a content tracker for a small editorial team. Started taking schema design seriously.',
    shape: 'icosahedron',
    color: '#C8553D',
    fogColor: '#0f1a0d',
    cameraOffset: [0, 0.4, 0],
  },
  {
    year: 2020,
    title: 'Going full-stack',
    body: 'Built my first end-to-end feature: auth, API, and UI shipped together. Learned that the seams between layers matter more than the layers themselves.',
    shape: 'torus',
    color: '#B89B5E',
    fogColor: '#131a11',
    cameraOffset: [0, 0.2, 0],
  },
  {
    year: 2021,
    title: 'Content meets code',
    body: 'Started writing technical long-form alongside shipping features. Found that explaining a system forces you to understand it.',
    shape: 'octahedron',
    color: '#D67358',
    fogColor: '#160f0c',
    cameraOffset: [0, 0.5, 0],
  },
  {
    year: 2023,
    title: 'Leading the stack',
    body: 'Took ownership of architecture decisions: database schemas, API contracts, CI pipelines. Scope expanded, speed held.',
    shape: 'cylinder',
    color: '#D9CDB5',
    fogColor: '#0f150e',
    cameraOffset: [0, 0.3, 0],
  },
  {
    year: 2024,
    title: 'Building in public',
    body: 'Launched editorial projects alongside engineering work. An audience of engineers who care about both craft and clarity.',
    shape: 'dodecahedron',
    color: '#B89B5E',
    fogColor: '#0c100b',
    cameraOffset: [0, 0.4, 0],
  },
]

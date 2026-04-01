export type WindowId =
  | 'profile'
  | 'experience'
  | 'projects'
  | 'contact'
  | 'resume'
  | 'terminal'
  | 'uses'
  | 'notes'

export const internalMenu: Array<{ id: WindowId; label: string; icon: string }> = [
  { id: 'profile', label: 'Profile', icon: 'profile' },
  { id: 'experience', label: 'Experience', icon: 'experience' },
  { id: 'projects', label: 'Projects', icon: 'projects' },
  { id: 'contact', label: 'Contact', icon: 'contact' },
  { id: 'resume', label: 'Resume', icon: 'resume' },
  { id: 'terminal', label: 'Terminal', icon: 'terminal' },
  { id: 'uses', label: 'Uses', icon: 'uses' },
  { id: 'notes', label: 'Notes', icon: 'notes' },
]

export const externalLinks = {
  github: 'https://github.com/vinnugollakoti/',
  twitter: 'https://x.com/VinnuGollakoti',
  linkedin: 'https://www.linkedin.com/in/vinay-reddy-a1aa7024b/',
  whatsapp: 'https://wa.me/916301181244?text=Hi%2C%20want%20to%20connect%20with%20you',
}

export type ThemeId = 'default' | 'logic' | 'weeknd' | 'radiohead'

export const desktopWindows: Record<
  WindowId,
  {
    label: string
    width: number
    height: number
    x: number
    y: number
    defaultOpen: boolean
  }
> = {
  profile: {
    label: 'About',
    width: 500,
    height: 390,
    x: 250,
    y: 30,
    defaultOpen: true,
  },
  experience: {
    label: 'Experience',
    width: 600,
    height: 500,
    x: 370,
    y: 118,
    defaultOpen: false,
  },
  projects: {
    label: 'Projects',
    width: 640,
    height: 510,
    x: 470,
    y: 150,
    defaultOpen: false,
  },
  contact: {
    label: 'Contact',
    width: 410,
    height: 290,
    x: 180,
    y: 365,
    defaultOpen: false,
  },
  resume: {
    label: 'Resume',
    width: 500,
    height: 340,
    x: 560,
    y: 280,
    defaultOpen: false,
  },
  terminal: {
    label: 'Terminal',
    width: 430,
    height: 310,
    x: 620,
    y: 345,
    defaultOpen: false,
  },
  uses: {
    label: 'Uses',
    width: 360,
    height: 330,
    x: 790,
    y: 150,
    defaultOpen: false,
  },
  notes: {
    label: 'Notes',
    width: 450,
    height: 430,
    x: 760,
    y: 90,
    defaultOpen: false,
  },
}

export const profileSummary = {
  quote: "If you're going through hell, KEEP GOING 🚀",
  bio: 'Full stack developer with strong experience across modern Web2 apps and Sui-focused Web3 products.',
  focus:
    'I build scalable interfaces, backend systems, smart contract integrations, and recruiter-friendly product experiences with a strong visual eye.',
}

export const experiences = [
  {
    company: '2RK Capital',
    role: 'DeFi Smart Contract Engineer • Remote',
    period: 'Recent',
    summary:
      'Built Web3 systems around a DeFi protocol on the Sui blockchain, working on smart-contract-driven flows, protocol-facing features, and product experiences that connected onchain logic with usable interfaces.',
    stack: ['Sui', 'DeFi', 'Smart Contracts', 'Web3 Systems'],
  },
  {
    company: 'GeeksforGeeks Students Club, Kalasalingam University',
    role: 'Web Developer Lead',
    period: '1 year',
    summary:
      'Led web development efforts for the student club, guiding projects, supporting peers, and helping shape practical frontend work across events, initiatives, and campus-driven builds.',
    stack: ['Leadership', 'Web Development', 'Frontend', 'Community'],
  },
]

export const resumes = [
  {
    label: 'Web2 Resume',
    url: 'https://drive.google.com/file/d/1RTDglnJZDKG1vhTLnLeIbdk2WSbslSMj/view',
    description: 'For frontend, backend, and full stack product engineering roles.',
  },
  {
    label: 'Web3 Resume',
    url: 'https://drive.google.com/file/d/1K94NLhOGxfofASRKV4wPR7HHvBdhAuCE/view',
    description: 'For blockchain, protocol, and dApp-focused opportunities.',
  },
]

export const projects = [
  {
    name: 'IDPS',
    meta: 'School ERP System',
    description:
      'Full-stack school management platform covering admin workflows, student records, and operational dashboards, built with a PostgreSQL-backed TypeScript stack and linked here through the backend repository.',
    url: 'https://github.com/vinnugollakoti/IDPS-Backend',
    stack: ['PostgreSQL', 'TypeScript', 'Node.js', 'Full Stack'],
  },
  {
    name: 'WAY4TRACK',
    meta: 'Production E-commerce Build',
    description:
      'Production-level ecommerce website built for a company, focused on practical shopping flows, polished UI delivery, and a stable real-world product setup.',
    url: 'https://github.com/vinnugollakoti/WAY4TRACK',
    stack: ['E-commerce', 'Production', 'Frontend', 'Web App'],
  },
  {
    name: 'AQUADEX',
    meta: 'Sui DeFi Product',
    description:
      'DeFi product work around trading and onchain protocol interactions in the Sui ecosystem, combining Web3 product thinking with usable frontend flows.',
    url: 'https://github.com/vinnugollakoti/AQUADEX',
    stack: ['Sui', 'DeFi', 'Web3', 'Frontend'],
  },
  {
    name: 'AquaLend',
    meta: 'Sui Lending Product',
    description:
      'Lending-focused Sui project built around protocol interactions, product usability, and onchain financial flows.',
    url: 'https://github.com/vinnugollakoti/AquaLend',
    stack: ['Sui', 'Lending', 'Smart Contracts', 'Web3'],
  },
  {
    name: 'AquaIndex',
    meta: 'Sui Indexing Product',
    description:
      'Project centered on structured data visibility and protocol-facing insights, helping surface blockchain activity in a more usable way.',
    url: 'https://github.com/vinnugollakoti/AquaIndex',
    stack: ['Sui', 'Indexing', 'Data', 'Web3'],
  },
  {
    name: 'SuiProof',
    meta: 'Verification Tooling',
    description:
      'Sui-focused proof and verification oriented build exploring blockchain trust flows, product clarity, and developer-facing utility.',
    url: 'https://github.com/vinnugollakoti/SUIPROOF',
    stack: ['Sui', 'Verification', 'Web3', 'Tooling'],
  },
]

export const terminalCommands = [
  {
    command: 'whoami',
    output: 'Vinay Reddy\nFull Stack Developer | Blockchain Developer (Sui)',
  },
  {
    command: 'stack',
    output: 'React, TypeScript, Node.js, Prisma, MongoDB, PostgreSQL, Tailwind, Sui',
  },
  {
    command: 'status',
    output: 'Open to internships, full-time roles, freelance work, and interesting Web3 collaborations.',
  },
]

export const uses = [
  {
    title: 'Frontend',
    items: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    title: 'Backend',
    items: ['Node.js', 'Prisma', 'Mongoose', 'PostgreSQL'],
  },
  {
    title: 'Web3',
    items: ['Sui', 'Smart Contracts', 'dApps', 'Blockchain Fundamentals'],
  },
]

export const notes = [
  {
    month: 'Mar 2026',
    lines: [
      'Building things that feel sharp, calm, and intentional matters just as much as writing code that works.',
      'I want products to be understandable at first glance and impressive after deeper use.',
    ],
  },
  {
    month: 'Feb 2026',
    lines: [
      'Hackathons keep teaching me that speed matters, but clarity matters more.',
      'The best technical work still needs a human-friendly story around it.',
    ],
  },
]

export const featuredLinks = [
  {
    title: 'The Zen of Erlang',
    meta: 'Fred Hebert • systems',
    url: 'https://ferd.ca/the-zen-of-erlang.html',
  },
  {
    title: 'Fearless Concurrency',
    meta: 'The Rust Book • rust',
    url: 'https://doc.rust-lang.org/book/ch16-00-concurrency.html',
  },
  {
    title: 'Meditations',
    meta: 'Marcus Aurelius • philosophy',
    url: 'https://www.gutenberg.org/ebooks/2680',
  },
]

export const openToWork = [
  {
    label: 'Building',
    value: 'Modern portfolios, web apps, and Sui-first dApp ideas',
  },
  {
    label: 'Reading',
    value: 'Developer tooling, product design, and systems thinking',
  },
  {
    label: 'Writing',
    value: 'Notes on learning, shipping, and improving as a builder',
  },
]

export const themePresets = [
  {
    id: 'default' as ThemeId,
    label: 'DEFAULT',
    subtitle: 'DEFAULT',
    accent: 'Calm focus',
    preview:
      'radial-gradient(circle at 65% 70%, rgba(255,255,255,0.12), transparent 12%), linear-gradient(180deg, #111111 0%, #181818 100%)',
    surface:
      'linear-gradient(180deg, rgba(20,20,20,0.95), rgba(15,15,15,0.9))',
    widget:
      'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
    page:
      'radial-gradient(circle at top, rgba(255,255,255,0.06), transparent 38%), linear-gradient(180deg, #080808 0%, #090909 42%, #060606 100%)',
    accentGlow:
      'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.05), transparent 45%)',
    border: 'rgba(255,255,255,0.08)',
    dock: 'rgba(255,255,255,0.06)',
  },
  {
    id: 'logic' as ThemeId,
    label: 'LOGIC',
    subtitle: 'NO PRESSURE',
    accent: 'Amber haze',
    preview:
      'linear-gradient(135deg, rgba(120,63,11,0.95), rgba(226,138,42,0.75)), radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 40%)',
    surface:
      'linear-gradient(180deg, rgba(35,22,18,0.92), rgba(22,16,14,0.9))',
    widget:
      'linear-gradient(180deg, rgba(85,51,18,0.24), rgba(26,18,14,0.28))',
    page:
      'radial-gradient(circle at 60% 12%, rgba(244,139,32,0.28), transparent 28%), radial-gradient(circle at 50% 85%, rgba(67,126,56,0.18), transparent 20%), linear-gradient(180deg, #0b0a08 0%, #14100d 50%, #0a0907 100%)',
    accentGlow:
      'radial-gradient(circle at 50% 40%, rgba(255,168,66,0.18), transparent 42%)',
    border: 'rgba(255,176,84,0.16)',
    dock: 'rgba(61,39,20,0.38)',
  },
  {
    id: 'weeknd' as ThemeId,
    label: 'THE WEEKND',
    subtitle: 'AFTER HOURS',
    accent: 'Crimson noir',
    preview:
      'radial-gradient(circle at 45% 35%, rgba(255,255,255,0.14), transparent 16%), linear-gradient(135deg, rgba(47,14,17,0.95), rgba(111,20,28,0.88))',
    surface:
      'linear-gradient(180deg, rgba(33,12,15,0.92), rgba(18,10,12,0.88))',
    widget:
      'linear-gradient(180deg, rgba(97,18,24,0.2), rgba(28,10,14,0.28))',
    page:
      'radial-gradient(circle at 62% 12%, rgba(255,107,56,0.22), transparent 26%), radial-gradient(circle at 20% 70%, rgba(120,18,41,0.14), transparent 20%), linear-gradient(180deg, #090707 0%, #120b0d 48%, #090808 100%)',
    accentGlow:
      'radial-gradient(circle at 55% 40%, rgba(174,34,39,0.16), transparent 42%)',
    border: 'rgba(180,46,58,0.16)',
    dock: 'rgba(55,16,20,0.34)',
  },
  {
    id: 'radiohead' as ThemeId,
    label: 'RADIOHEAD',
    subtitle: 'IN RAINBOWS',
    accent: 'Color drift',
    preview:
      'linear-gradient(135deg, rgba(36,24,13,0.95), rgba(245,142,43,0.85), rgba(82,128,47,0.6), rgba(38,41,98,0.75))',
    surface:
      'linear-gradient(180deg, rgba(38,24,12,0.9), rgba(19,14,10,0.9))',
    widget:
      'linear-gradient(180deg, rgba(122,77,29,0.18), rgba(24,18,14,0.26))',
    page:
      'radial-gradient(circle at 55% 18%, rgba(255,121,48,0.28), transparent 28%), radial-gradient(circle at 18% 82%, rgba(24,97,117,0.18), transparent 20%), radial-gradient(circle at 85% 75%, rgba(89,133,42,0.18), transparent 16%), linear-gradient(180deg, #0a0907 0%, #15110d 48%, #090806 100%)',
    accentGlow:
      'radial-gradient(circle at 52% 36%, rgba(233,135,53,0.18), transparent 44%)',
    border: 'rgba(210,128,49,0.16)',
    dock: 'rgba(70,44,20,0.34)',
  },
]

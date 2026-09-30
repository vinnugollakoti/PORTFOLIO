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
  { id: 'uses', label: 'Skills', icon: 'uses' },
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
    width: 620,
    height: 520,
    x: 370,
    y: 118,
    defaultOpen: false,
  },
  projects: {
    label: 'Projects',
    width: 660,
    height: 520,
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
    label: 'Skills',
    width: 420,
    height: 400,
    x: 790,
    y: 150,
    defaultOpen: false,
  },
  notes: {
    label: 'Notes & Bio',
    width: 470,
    height: 450,
    x: 760,
    y: 90,
    defaultOpen: false,
  },
}

export const profileSummary = {
  quote: "If you're going through hell, KEEP GOING 🚀",
  bio: 'Associate AI Engineer at Lowe’s India and Full-Stack & Blockchain Developer with hands-on experience in AI systems, MERN stack, and smart contract engineering on Ethereum and Sui.',
  focus:
    'I build production-grade AI & backend microservices (Spring Boot, MCPs, Kafka, Elasticsearch), scalable full-stack applications, and high-performance Web3/DeFi products.',
}

export const experiences = [
  {
    company: "Lowe's India",
    role: 'Associate AI Engineer',
    period: 'May 2026 - Present',
    summary:
      'Working as a Full-Stack & AI Engineer building Model Context Protocol (MCP) servers for Lowe’s internal systems and developing production-oriented Spring Boot backend microservices with Apache Camel for the EDI sector.',
    stack: ['Python', 'Java', 'Spring Boot', 'Apache Camel', 'Elasticsearch', 'OracleDB', 'PostgreSQL', 'Kafka', 'RabbitMQ', 'MCPs'],
  },
  {
    company: '2RK Capital',
    role: 'DeFi Developer • Remote',
    period: 'Mar 2025 - Mar 2026',
    summary:
      'Developed and deployed production-grade smart contracts on the Sui blockchain, contributing to cross-chain architecture and DeFi pool management in active production environments.',
    stack: ['Sui Blockchain', 'Pysui', 'Sui SDKs', 'Solidity', 'Move Contracts', 'DeFi Protocols'],
  },
  {
    company: 'Freelance',
    role: 'Full-Stack Web Developer',
    period: 'Jun 2025 - Nov 2025',
    summary:
      'Built and delivered end-to-end production web platforms including Way4Track, managing both responsive frontend interfaces and backend API integrations aligned with business requirements.',
    stack: ['React.js', 'Tailwind CSS', 'SQL', 'Node.js', 'API Management'],
  },
  {
    company: 'GeeksforGeeks Students Club, Kalasalingam University',
    role: 'Web Developer Lead',
    period: '1 Year',
    summary:
      'Led web development efforts for the student club, guiding technical initiatives, mentoring peers, and organizing hackathon teams.',
    stack: ['Leadership', 'Full-Stack Web', 'Community', 'Mentorship'],
  },
]

export const resumes = [
  {
    label: 'Web2 Resume',
    url: 'https://drive.google.com/file/d/1RTDglnJZDKG1vhTLnLeIbdk2WSbslSMj/view',
    description: 'For AI engineering, full-stack, backend, and product engineering roles.',
  },
  {
    label: 'Web3 Resume',
    url: 'https://drive.google.com/file/d/1K94NLhOGxfofASRKV4wPR7HHvBdhAuCE/view',
    description: 'For blockchain, DeFi protocol, and smart contract developer opportunities.',
  },
]

export const projects = [
  {
    name: 'Lioric',
    meta: 'AI RAG Chatbot SDK & NPM Package',
    description:
      'Complete AI-Powered RAG Chatbot solution enabling developers to embed document-aware AI assistants into websites in minutes. Published as lioric-react on NPM with an interactive dashboard, ChromaDB vector search, and custom document processing.',
    url: 'https://dev.to/vinnugollakoti/lioric-architecture-explained-how-the-lightweight-ai-chat-widget-really-works-50ab',
    stack: ['React.js', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'ChromaDB', 'RAG Pipeline'],
  },
  {
    name: 'IDPS Backend',
    meta: 'Production School ERP Backend',
    description:
      'Production-grade centralized backend powering a complete school ERP system across Parent, Teacher, and Admin applications. Features relational schema design with Prisma, secure JWT authentication, and serverless AWS Lambda email triggers.',
    url: 'https://github.com/vinnugollakoti/IDPS-Backend',
    stack: ['Node.js', 'TypeScript', 'Express', 'PostgreSQL', 'Prisma ORM', 'AWS Lambda', 'JWT'],
  },
  {
    name: 'WAY4TRACK',
    meta: 'Production E-Commerce Platform',
    description:
      'Full production-ready e-commerce platform built for a commercial client, focused on reliable shopping flows, responsive product catalogs, and optimized client delivery.',
    url: 'https://github.com/vinnugollakoti/WAY4TRACK',
    stack: ['React.js', 'Tailwind CSS', 'SQL', 'Node.js', 'REST API'],
  },
  {
    name: 'AQUADEX',
    meta: 'Sui DeFi DEX Protocol',
    description:
      'Decentralized exchange protocol and trading interface built on the Sui blockchain, combining onchain liquidity pools, automated market making flows, and seamless Web3 wallet interactions.',
    url: 'https://github.com/vinnugollakoti/AQUADEX',
    stack: ['Sui', 'Move', 'DeFi', 'Web3', 'React.js'],
  },
  {
    name: 'AquaLend',
    meta: 'Sui Lending Protocol',
    description:
      'Lending and borrowing DeFi protocol built on Sui smart contracts, featuring algorithmic interest curves, collateralized loans, and real-time protocol analytics.',
    url: 'https://github.com/vinnugollakoti/AquaLend',
    stack: ['Sui', 'Move', 'Lending', 'Smart Contracts', 'Web3'],
  },
  {
    name: 'AquaIndex',
    meta: 'Sui Blockchain Indexer',
    description:
      'High-speed structured data indexer designed to capture, transform, and expose real-time Sui onchain events and transaction telemetry for dApps and analytics dashboards.',
    url: 'https://github.com/vinnugollakoti/AquaIndex',
    stack: ['Sui', 'Indexing', 'TypeScript', 'Data Pipeline'],
  },
  {
    name: 'SuiProof',
    meta: 'Verification & Trust Tooling',
    description:
      'Sui-focused proof and verification tool exploring decentralized identity trust flows, cryptographic assertions, and developer-first utility.',
    url: 'https://github.com/vinnugollakoti/SUIPROOF',
    stack: ['Sui', 'Move', 'Verification', 'Cryptography'],
  },
]

export const terminalCommands = [
  {
    command: 'whoami',
    output: 'G Vinay Reddy\nAssociate AI Engineer at Lowe’s India | Full Stack & Blockchain Engineer (Sui & ETH)',
  },
  {
    command: 'stack',
    output: 'Python, Java (Spring Boot, Apache Camel), React, TypeScript, Node.js, PostgreSQL, Kafka, Elasticsearch, ChromaDB, Sui (Move), Solidity',
  },
  {
    command: 'education',
    output: 'Kalvium UG Program in CS (Software Product Engineering) | Kalasalingam University (BTech, 2023-2027)',
  },
  {
    command: 'status',
    output: 'Building production AI MCPs, backend microservices, and Web3 products.',
  },
]

export const uses = [
  {
    title: 'Languages',
    items: ['Python (Advanced)', 'JavaScript (Intermediate)', 'Java (Intermediate)', 'TypeScript', 'C++', 'Rust', 'SQL'],
  },
  {
    title: 'AI & Engineering',
    items: ['Model Context Protocol (MCP)', 'RAG Pipelines', 'ChromaDB (VectorDB)', 'Elasticsearch', 'LLM Response Optimization'],
  },
  {
    title: 'Backend & Microservices',
    items: ['Java Spring Boot', 'Apache Camel', 'Node.js', 'Express.js', 'AWS Lambda', 'JWT Auth', 'RESTful APIs'],
  },
  {
    title: 'Databases & Message Queues',
    items: ['PostgreSQL', 'MongoDB', 'OracleDB', 'Apache Kafka', 'RabbitMQ', 'Prisma ORM', 'Mongoose'],
  },
  {
    title: 'Frontend',
    items: ['React.js', 'Redux', 'Tailwind CSS', 'HTML5', 'CSS3', 'Framer Motion', 'Vite'],
  },
  {
    title: 'Web3 & Blockchain',
    items: ['Sui Blockchain', 'Move Contracts (Pysui, Sui SDKs)', 'Solidity', 'Ethereum', 'Hardhat', 'Truffle', 'Web3.js', 'Ganache'],
  },
  {
    title: 'Tools & DevOps',
    items: ['Git', 'GitHub', 'Bitbucket', 'Jira', 'Postman', 'Docker', 'Linux/macOS'],
  },
]

export const notes = [
  {
    month: 'Sep 2026',
    lines: [
      'Currently at Lowe’s India as an Associate AI Engineer, where I develop Model Context Protocol (MCP) servers for in-house enterprise systems and build high-throughput Spring Boot backend microservices with Apache Camel for EDI workflows.',
      'Working across Python, Java Spring Boot, Elasticsearch, Kafka, and relational databases has solidified my ability to architect robust, production-grade distributed systems.',
    ],
  },
  {
    month: 'Mar 2026',
    lines: [
      'At 2RK Capital, I built production-grade DeFi smart contracts and pool management logic on the Sui blockchain using Move, Pysui, and Sui SDKs, alongside Solidity contracts for cross-chain mechanisms.',
      'This hands-on protocol work led me to build my testnet DEX (AquaDex), AquaLend, and indexing tooling, sharpening both my protocol-level design and intuitive Web3 UX instincts.',
    ],
  },
  {
    month: 'Hackathons & Community',
    lines: [
      'Passionate hackathon competitor: participated in three ETHGlobal hackathons (and preparing for the fourth) and won prizes in multiple college hackathons through technical clubs.',
      'Pursuing BTech in Computer Science via Kalvium’s Software Product Engineering program at Kalasalingam University (2023–2027).',
    ],
  },
]

export const featuredLinks = [
  {
    title: 'Architecture of Lioric',
    meta: 'System architecture & RAG',
    url: 'https://dev.to/vinnugollakoti/lioric-architecture-explained-how-the-lightweight-ai-chat-widget-really-works-50ab',
  },
  {
    title: 'Lioric AI Chatbot Widget',
    meta: 'AI chat widget',
    url: 'https://dev.to/vinnugollakoti/best-ai-chatbot-widget-2026-3598',
  },
  {
    title: 'Gpushx',
    meta: 'GPU cloud platform',
    url: 'https://dev.to/vinnugollakoti/gpushx-3n38',
  },
]

export const openToWork = [
  {
    label: 'Building',
    value: 'Enterprise MCPs, AI RAG systems, and Sui/Web3 DeFi protocols',
  },
  {
    label: 'Reading',
    value: 'Distributed systems, event streaming with Kafka, and protocol architecture',
  },
  {
    label: 'Writing',
    value: 'Technical deep-dives on RAG architecture and scalable backend engineering',
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

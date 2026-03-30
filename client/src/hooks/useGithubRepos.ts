import { useEffect, useState } from 'react'

export type PortfolioRepo = {
  name: string
  description: string
  url: string
  stack: string[]
  source: string
  stars: number
  updatedAtLabel: string
}

type GithubRepo = {
  name: string
  html_url: string
  description: string | null
  stargazers_count: number
  updated_at: string
  language: string | null
  fork: boolean
  topics?: string[]
}

const fallbackProjects: PortfolioRepo[] = [
  {
    name: 'sui dapp starter',
    description: 'Sui-flavored full stack dApp setup with wallet-aware UX and clean frontend structure.',
    url: 'https://github.com/vinnugollakoti/',
    stack: ['Sui', 'React', 'TypeScript'],
    source: 'Fallback',
    stars: 0,
    updatedAtLabel: 'recent',
  },
  {
    name: 'web product build',
    description: 'Modern React and Node-based product work with strong UI polish and practical backend wiring.',
    url: 'https://github.com/vinnugollakoti/',
    stack: ['React', 'Node.js', 'Prisma'],
    source: 'Fallback',
    stars: 0,
    updatedAtLabel: 'recent',
  },
  {
    name: 'hackathon prototype',
    description: 'Fast-moving experiments built under time pressure with Web3 product instincts in mind.',
    url: 'https://github.com/vinnugollakoti/',
    stack: ['Web3', 'Hackathon', 'Frontend'],
    source: 'Fallback',
    stars: 0,
    updatedAtLabel: 'recent',
  },
]

const formatUpdatedAt = (value: string) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    year: '2-digit',
  }).format(new Date(value))

const deriveStack = (repo: GithubRepo) => {
  const tags = new Set<string>()

  if (repo.language) {
    tags.add(repo.language)
  }

  repo.topics?.slice(0, 3).forEach((topic) => tags.add(topic.replace(/-/g, ' ')))

  const raw = `${repo.name} ${repo.description ?? ''}`.toLowerCase()

  if (raw.includes('sui')) tags.add('Sui')
  if (raw.includes('react')) tags.add('React')
  if (raw.includes('node')) tags.add('Node.js')
  if (raw.includes('prisma')) tags.add('Prisma')
  if (raw.includes('mongo')) tags.add('MongoDB')
  if (raw.includes('post')) tags.add('PostgreSQL')
  if (raw.includes('blockchain') || raw.includes('web3')) tags.add('Web3')

  return Array.from(tags).slice(0, 4)
}

export function useGithubRepos() {
  const [repos, setRepos] = useState<PortfolioRepo[]>(fallbackProjects)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadRepos = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/users/vinnugollakoti/repos?sort=updated&per_page=100',
          {
            headers: {
              Accept: 'application/vnd.github+json',
            },
          },
        )

        if (!response.ok) {
          throw new Error('Failed to load repositories')
        }

        const data = (await response.json()) as GithubRepo[]
        const nextRepos = data
          .filter((repo) => !repo.fork)
          .sort((a, b) => {
            const scoreA = a.stargazers_count * 8 + new Date(a.updated_at).getTime()
            const scoreB = b.stargazers_count * 8 + new Date(b.updated_at).getTime()
            return scoreB - scoreA
          })
          .slice(0, 6)
          .map((repo) => ({
            name: repo.name.replace(/[-_]/g, ' '),
            description:
              repo.description ?? 'Public repository showcasing active development and engineering interests.',
            url: repo.html_url,
            stack: deriveStack(repo),
            source: 'GitHub API',
            stars: repo.stargazers_count,
            updatedAtLabel: formatUpdatedAt(repo.updated_at),
          }))

        if (isMounted && nextRepos.length > 0) {
          setRepos(nextRepos)
        }
      } catch {
        if (isMounted) {
          setRepos(fallbackProjects)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadRepos()

    return () => {
      isMounted = false
    }
  }, [])

  return { repos, isLoading }
}

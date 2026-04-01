type ContributionCalendarDay = {
  color: string
  contributionCount: number
  date: string
  weekday: number
}

type ContributionCalendarWeek = {
  firstDay: string
  contributionDays: ContributionCalendarDay[]
}

type ContributionCalendarMonth = {
  firstDay: string
  name: string
  totalWeeks: number
  year: number
}

type GraphQLResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar: {
          totalContributions: number
          weeks: ContributionCalendarWeek[]
          months: ContributionCalendarMonth[]
        }
      }
    }
  }
  errors?: Array<{ message: string }>
}

const query = `
  query ContributionCalendar($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          months {
            firstDay
            name
            totalWeeks
            year
          }
          weeks {
            firstDay
            contributionDays {
              color
              contributionCount
              date
              weekday
            }
          }
        }
      }
    }
  }
`

export default async function handler(req: any, res: any) {
  const token = process.env.GITHUB_TOKEN
  const login = typeof req.query?.username === 'string' ? req.query.username : 'vinnugollakoti'

  if (!token) {
    res.status(500).json({ error: 'Missing GITHUB_TOKEN environment variable.' })
    return
  }

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github+json',
      },
      body: JSON.stringify({
        query,
        variables: { login },
      }),
    })

    const payload = (await response.json()) as GraphQLResponse

    if (!response.ok || payload.errors?.length) {
      res.status(502).json({
        error: payload.errors?.[0]?.message ?? 'Failed to load contribution calendar from GitHub.',
      })
      return
    }

    const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar

    if (!calendar) {
      res.status(404).json({ error: 'Contribution calendar not found.' })
      return
    }

    res.setHeader('Cache-Control', 'no-store, max-age=0')
    res.status(200).json(calendar)
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown GitHub calendar error.',
    })
  }
}

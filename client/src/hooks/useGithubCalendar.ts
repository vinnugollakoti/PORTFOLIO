import { useEffect, useState } from 'react'

type Contribution = {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

type ContributionApiResponse = {
  contributions: Contribution[]
}

type CalendarCell = Contribution

const fallbackCells = Array.from({ length: 18 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => ({
    date: `week-${week}-day-${day}`,
    count: (week + day) % 5 === 0 ? 2 : 0,
    level: (((week + day) % 5) as 0 | 1 | 2 | 3 | 4),
  })),
)

export function useGithubCalendar() {
  const [cells, setCells] = useState<CalendarCell[][]>(fallbackCells)
  const [total, setTotal] = useState(0)
  const [monthLabels, setMonthLabels] = useState<Array<{ label: string; index: number; width: number }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const buildColumns = (contributions: Contribution[]) => {
      const recent = contributions.slice(-126)
      const padded = [...recent]

      while (padded.length % 7 !== 0) {
        padded.unshift({
          date: `pad-${padded.length}`,
          count: 0,
          level: 0,
        })
      }

      const weeks = Array.from({ length: padded.length / 7 }, (_, index) =>
        padded.slice(index * 7, index * 7 + 7),
      )

      const labels: Array<{ label: string; index: number; width: number }> = []

      weeks.forEach((week, index) => {
        const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(
          new Date(week[0].date),
        )
        const previous = labels[labels.length - 1]

        if (!previous || previous.label !== month) {
          labels.push({ label: month, index, width: 24 })
        }
      })

      return {
        weeks,
        total: recent.reduce((sum, item) => sum + item.count, 0),
        labels,
      }
    }

    const load = async () => {
      try {
        const response = await fetch(
          'https://github-contributions-api.jogruber.de/v4/vinnugollakoti?y=last',
        )

        if (!response.ok) {
          throw new Error('Failed to fetch contributions')
        }

        const data = (await response.json()) as ContributionApiResponse
        const next = buildColumns(data.contributions)

        if (isMounted) {
          setCells(next.weeks)
          setTotal(next.total)
          setMonthLabels(next.labels)
        }
      } catch {
        if (isMounted) {
          setCells(fallbackCells)
          setTotal(225)
          setMonthLabels([
            { label: 'Oct', index: 0, width: 42 },
            { label: 'Nov', index: 4, width: 42 },
            { label: 'Dec', index: 8, width: 42 },
            { label: 'Jan', index: 12, width: 42 },
            { label: 'Feb', index: 15, width: 42 },
          ])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void load()

    return () => {
      isMounted = false
    }
  }, [])

  return { cells, total, monthLabels, isLoading }
}

import { useEffect, useState } from 'react'

type Contribution = {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
  color?: string
}

type ContributionApiResponse = {
  contributions: Contribution[]
}

type GithubCalendarResponse = {
  totalContributions: number
  months: Array<{
    firstDay: string
    name: string
    totalWeeks: number
    year: number
  }>
  weeks: Array<{
    firstDay: string
    contributionDays: Array<{
      color: string
      contributionCount: number
      date: string
      weekday: number
    }>
  }>
}

type CalendarCell = Contribution

type CalendarSnapshot = {
  cells: CalendarCell[][]
  total: number
  monthLabels: Array<{ label: string; index: number; width: number }>
}

const WEEK_COLUMN_WIDTH = 11
const DAYS_IN_YEAR_VIEW = 365

const buildMonthLabels = (weeks: CalendarCell[][]) => {
  const rawLabels = weeks.reduce<Array<{ label: string; index: number }>>((labels, week, index) => {
    const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(week[0].date))
    const previous = labels[labels.length - 1]

    if (!previous || previous.label !== month) {
      labels.push({ label: month, index })
    }

    return labels
  }, [])

  return rawLabels.map((label, index) => {
    const next = rawLabels[index + 1]
    const span = (next?.index ?? weeks.length) - label.index

    return {
      ...label,
      width: Math.max(20, span * WEEK_COLUMN_WIDTH),
    }
  })
}

const buildMonthLabelsFromGithub = (
  months: GithubCalendarResponse['months'],
  weeksLength: number,
) =>
  months.map((month, index) => {
    const usedWeeks = months.slice(0, index).reduce((sum, item) => sum + item.totalWeeks, 0)
    const remainingWeeks = weeksLength - usedWeeks

    return {
      label: month.name.slice(0, 3),
      index: usedWeeks,
      width: Math.max(20, Math.min(month.totalWeeks, remainingWeeks) * WEEK_COLUMN_WIDTH),
    }
  })

const buildFallbackWeeks = () => {
  const today = new Date()
  const start = new Date(today)
  start.setDate(today.getDate() - (DAYS_IN_YEAR_VIEW - 1))

  const contributions = Array.from({ length: DAYS_IN_YEAR_VIEW }, (_, index) => {
    const current = new Date(start)
    current.setDate(start.getDate() + index)

    return {
      date: current.toISOString().slice(0, 10),
      count: index % 9 === 0 ? 3 : index % 5 === 0 ? 1 : 0,
      level: ((index % 5 === 0 ? 2 : index % 9 === 0 ? 3 : 0) as 0 | 1 | 2 | 3 | 4),
    }
  })

  const padded = [...contributions]

  while (padded.length % 7 !== 0) {
    const firstDate = new Date(padded[0].date)
    firstDate.setDate(firstDate.getDate() - 1)
    padded.unshift({
      date: firstDate.toISOString().slice(0, 10),
      count: 0,
      level: 0,
    })
  }

  return Array.from({ length: padded.length / 7 }, (_, index) => padded.slice(index * 7, index * 7 + 7))
}

const fallbackCells = buildFallbackWeeks()

const fallbackSnapshot: CalendarSnapshot = {
  cells: fallbackCells,
  total: fallbackCells.flat().reduce((sum, item) => sum + item.count, 0),
  monthLabels: buildMonthLabels(fallbackCells),
}

const getDayKey = () =>
  new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())

export function useGithubCalendar() {
  const [cells, setCells] = useState<CalendarCell[][]>(fallbackCells)
  const [total, setTotal] = useState(0)
  const [monthLabels, setMonthLabels] = useState<Array<{ label: string; index: number; width: number }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const toLevelFromColor = (color: string): 0 | 1 | 2 | 3 | 4 => {
      if (color === '#161b22' || color === '#ebedf0') return 0
      return 4
    }

    const buildColumns = (contributions: Contribution[]) => {
      const end = new Date()
      const start = new Date(end)
      start.setDate(end.getDate() - (DAYS_IN_YEAR_VIEW - 1))

      const recent = contributions.filter((item) => {
        const date = new Date(item.date)
        return date >= start && date <= end
      })
      const padded = [...recent]

      while (padded.length % 7 !== 0) {
        const firstDate = new Date(padded[0].date)
        firstDate.setDate(firstDate.getDate() - 1)
        padded.unshift({
          date: firstDate.toISOString().slice(0, 10),
          count: 0,
          level: 0,
        })
      }

      const weeks = Array.from({ length: padded.length / 7 }, (_, index) =>
        padded.slice(index * 7, index * 7 + 7),
      )

      return {
        weeks,
        total: recent.reduce((sum, item) => sum + item.count, 0),
        labels: buildMonthLabels(weeks),
      }
    }

    const buildFromGithubCalendar = (calendar: GithubCalendarResponse): CalendarSnapshot => {
      const weeks = calendar.weeks.map((week) =>
        week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount,
          level: toLevelFromColor(day.color),
          color: day.color,
        })),
      )

      return {
        cells: weeks,
        total: calendar.totalContributions,
        monthLabels: buildMonthLabelsFromGithub(calendar.months, weeks.length),
      }
    }

    const applySnapshot = (snapshot: CalendarSnapshot) => {
      setCells(snapshot.cells)
      setTotal(snapshot.total)
      setMonthLabels(snapshot.monthLabels)
    }

    const load = async () => {
      try {
        const response = await fetch(`/api/github-calendar?username=vinnugollakoti&t=${Date.now()}`, {
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error('Primary GitHub calendar endpoint unavailable')
        }

        const calendar = (await response.json()) as GithubCalendarResponse

        if (isMounted) {
          applySnapshot(buildFromGithubCalendar(calendar))
        }
      } catch {
        const dayKey = getDayKey()

        try {
          const response = await fetch(
            `https://github-contributions-api.jogruber.de/v4/vinnugollakoti?y=last&refresh=${dayKey}&t=${Date.now()}`,
            {
              cache: 'no-store',
            },
          )

          if (!response.ok) {
            throw new Error('Failed to fetch contributions')
          }

          const data = (await response.json()) as ContributionApiResponse
          const built = buildColumns(data.contributions)
          const snapshot: CalendarSnapshot = {
            cells: built.weeks,
            total: built.total,
            monthLabels: built.labels,
          }

          if (isMounted) {
            applySnapshot(snapshot)
          }
        } catch {
          if (isMounted) {
            applySnapshot(fallbackSnapshot)
          }
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

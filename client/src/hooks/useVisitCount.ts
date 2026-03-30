import { useEffect, useState } from 'react'

const fallbackKey = 'vg-portfolio-visit-count'

export function useVisitCount() {
  const [count, setCount] = useState(2256)

  useEffect(() => {
    let isMounted = true

    const loadCount = async () => {
      try {
        const response = await fetch(
          'https://api.countapi.xyz/hit/vinnugollakoti/portfolio-desktop',
        )

        if (!response.ok) {
          throw new Error('Failed to load visitor count')
        }

        const data = (await response.json()) as { value?: number }

        if (isMounted && typeof data.value === 'number') {
          setCount(data.value)
          window.localStorage.setItem(fallbackKey, String(data.value))
        }
      } catch {
        const stored = Number(window.localStorage.getItem(fallbackKey) ?? '2256')
        const next = Number.isFinite(stored) ? stored + 1 : 2256

        if (isMounted) {
          setCount(next)
          window.localStorage.setItem(fallbackKey, String(next))
        }
      }
    }

    void loadCount()

    return () => {
      isMounted = false
    }
  }, [])

  return { count }
}

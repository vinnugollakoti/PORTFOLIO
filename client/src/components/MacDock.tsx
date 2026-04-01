import type { PointerEvent as ReactPointerEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'

export type MacDockItem = {
  id: string
  label: string
  icon: string
  active?: boolean
  href?: string
  onClick?: () => void
  dividerBefore?: boolean
}

type MacDockProps = {
  items: MacDockItem[]
}

type PointerState = {
  active: boolean
  x: number
}

const EFFECT_RADIUS = 150
const MAX_SCALE = 1.18
const MIN_SCALE = 1
const LERP = 0.32
const BASE_GAP = 10
const HOVER_GAP_EXPANSION = 10
const BASE_SIDE_PADDING = 14
const HOVER_SIDE_PADDING_EXPANSION = 8

export function MacDock({ items }: MacDockProps) {
  const dockRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | HTMLAnchorElement | null>>([])
  const frameRef = useRef<number | null>(null)
  const pointerRef = useRef<PointerState>({ active: false, x: 0 })
  const scalesRef = useRef<number[]>(items.map(() => 1))
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    itemRefs.current.length = items.length
    scalesRef.current = items.map((_, index) => scalesRef.current[index] ?? 1)
  }, [items])

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  const runAnimation = () => {
    const dockRect = dockRef.current?.getBoundingClientRect()
    const pointer = pointerRef.current
    let shouldContinue = pointer.active
    let maxScale = 1

    itemRefs.current.forEach((element, index) => {
      if (!element || !dockRect) {
        return
      }

      const rect = element.getBoundingClientRect()
      const centerX = rect.left - dockRect.left + rect.width / 2
      let targetScale = MIN_SCALE

      if (pointer.active) {
        const distance = Math.abs(pointer.x - centerX)

        if (distance < EFFECT_RADIUS) {
          const normalized = distance / EFFECT_RADIUS
          const eased = (Math.cos(normalized * Math.PI) + 1) / 2
          targetScale = MIN_SCALE + eased * (MAX_SCALE - MIN_SCALE)
        }
      }

      const current = scalesRef.current[index] ?? 1
      const next = current + (targetScale - current) * LERP
      scalesRef.current[index] = next
      maxScale = Math.max(maxScale, next)

      const lift = (next - 1) * -18
      const iconScale = 1 + (next - 1) * 0.22
      element.style.setProperty('--dock-scale', next.toFixed(4))
      element.style.setProperty('--dock-lift', `${lift.toFixed(2)}px`)
      element.style.setProperty('--dock-icon-scale', iconScale.toFixed(4))

      if (Math.abs(next - targetScale) > 0.01 || Math.abs(next - 1) > 0.01) {
        shouldContinue = true
      }
    })

    if (dockRef.current) {
      const hoverProgress = Math.max(0, (maxScale - 1) / (MAX_SCALE - 1))
      const nextGap = BASE_GAP + hoverProgress * HOVER_GAP_EXPANSION
      const nextSidePadding = BASE_SIDE_PADDING + hoverProgress * HOVER_SIDE_PADDING_EXPANSION
      dockRef.current.style.setProperty('--dock-gap', `${nextGap.toFixed(2)}px`)
      dockRef.current.style.setProperty('--dock-padding-x', `${nextSidePadding.toFixed(2)}px`)
    }

    if (shouldContinue) {
      frameRef.current = requestAnimationFrame(runAnimation)
      return
    }

    if (dockRef.current) {
      dockRef.current.style.setProperty('--dock-gap', `${BASE_GAP}px`)
      dockRef.current.style.setProperty('--dock-padding-x', `${BASE_SIDE_PADDING}px`)
    }

    frameRef.current = null
  }

  const ensureAnimation = () => {
    if (frameRef.current === null) {
      frameRef.current = requestAnimationFrame(runAnimation)
    }
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = dockRef.current?.getBoundingClientRect()

    if (!rect) {
      return
    }

    pointerRef.current.active = true
    pointerRef.current.x = event.clientX - rect.left
    ensureAnimation()
  }

  const handlePointerLeave = () => {
    pointerRef.current.active = false
    setHoveredIndex(null)
    ensureAnimation()
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[160] flex justify-center">
      <div
        ref={dockRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="mac-dock pointer-events-auto"
      >
        {items.map((item, index) => {
          const sharedProps = {
            ref: (node: HTMLButtonElement | HTMLAnchorElement | null) => {
              itemRefs.current[index] = node
            },
            className: `mac-dock-item${item.active ? ' is-active' : ''}`,
            onPointerEnter: () => setHoveredIndex(index),
            onPointerLeave: () => setHoveredIndex((current) => (current === index ? null : current)),
            'aria-label': item.label,
          }

          const content = (
            <>
              {hoveredIndex === index ? (
                <span className="mac-dock-tooltip">{item.label.toUpperCase()}</span>
              ) : null}
              <span className="mac-dock-tile">
                <span className="mac-dock-icon">
                  <Icon name={item.icon} className="h-[23px] w-[23px]" />
                </span>
              </span>
              <span className="mac-dock-indicator" />
            </>
          )

          return (
            <div key={item.id} className="flex items-center">
              {item.dividerBefore ? <span className="mac-dock-divider" aria-hidden="true" /> : null}
              {item.href ? (
                <a {...sharedProps} href={item.href} target="_blank" rel="noreferrer">
                  {content}
                </a>
              ) : (
                <button {...sharedProps} type="button" onClick={item.onClick}>
                  {content}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

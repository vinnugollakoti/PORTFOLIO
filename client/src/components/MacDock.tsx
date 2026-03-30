import type { PointerEvent as ReactPointerEvent } from 'react'
import { useEffect, useRef } from 'react'
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
  speed: number
  lastX: number
  lastTime: number
}

const MIN_SCALE = 1
const MAX_SCALE = 1.42
const EFFECT_RADIUS = 168
const BASE_LERP = 0.22
const BASE_GAP = 12
const BASE_SIDE_PADDING = 24

export function MacDock({ items }: MacDockProps) {
  const dockRef = useRef<HTMLDivElement | null>(null)
  const shellRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<Array<HTMLElement | null>>([])
  const tileRefs = useRef<Array<HTMLSpanElement | null>>([])
  const iconRefs = useRef<Array<HTMLSpanElement | null>>([])
  const labelRefs = useRef<Array<HTMLSpanElement | null>>([])
  const animationFrameRef = useRef<number | null>(null)
  const pointerRef = useRef<PointerState>({
    active: false,
    x: 0,
    speed: 0,
    lastX: 0,
    lastTime: 0,
  })
  const scalesRef = useRef<number[]>(items.map(() => 1))

  useEffect(() => {
    scalesRef.current = items.map((_, index) => scalesRef.current[index] ?? 1)
    itemRefs.current.length = items.length
    tileRefs.current.length = items.length
    iconRefs.current.length = items.length
    labelRefs.current.length = items.length
  }, [items])

  const resetLabelStyles = () => {
    labelRefs.current.forEach((label) => {
      if (!label) {
        return
      }

      label.style.opacity = '0'
      label.style.transform = 'translate3d(-50%, 6px, 0) scale(0.96)'
    })
  }

  const updateDock = () => {
    const pointer = pointerRef.current
    const currentScales = scalesRef.current
    let maxCurrentScale = 1
    let highlightedIndex = -1
    let highlightedTarget = 1
    const dockRect = dockRef.current?.getBoundingClientRect()

    itemRefs.current.forEach((element, index) => {
      const tile = tileRefs.current[index]
      const icon = iconRefs.current[index]

      if (!element || !tile || !icon || !dockRect) {
        return
      }

      const elementRect = element.getBoundingClientRect()
      const centerX = elementRect.left - dockRect.left + elementRect.width / 2
      let targetScale = 1

      if (pointer.active) {
        const distance = Math.abs(pointer.x - centerX)
        if (distance < EFFECT_RADIUS) {
          const normalized = distance / EFFECT_RADIUS
          const eased = (Math.cos(normalized * Math.PI) + 1) / 2
          targetScale = MIN_SCALE + eased * (MAX_SCALE - MIN_SCALE)
        }
      }

      if (targetScale > highlightedTarget) {
        highlightedTarget = targetScale
        highlightedIndex = index
      }

      const lerpAmount = Math.min(0.52, BASE_LERP + pointer.speed * 0.24)
      const nextScale = currentScales[index] + (targetScale - currentScales[index]) * lerpAmount

      currentScales[index] = nextScale
      maxCurrentScale = Math.max(maxCurrentScale, nextScale)

      const translateY = -(nextScale - 1) * 22
      const direction = Math.sign(centerX - pointer.x) || 0
      const translateX = pointer.active ? direction * (nextScale - 1) * 16 : 0

      tile.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${nextScale})`
      icon.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`
    })

    labelRefs.current.forEach((label, index) => {
      if (!label) {
        return
      }

      if (pointer.active && index === highlightedIndex && highlightedTarget > 1.08) {
        label.style.opacity = '1'
        label.style.transform = 'translate3d(-50%, 0, 0) scale(1)'
      } else {
        label.style.opacity = '0'
        label.style.transform = 'translate3d(-50%, 6px, 0) scale(0.96)'
      }
    })

    if (shellRef.current) {
      const growY = 1 + (maxCurrentScale - 1) * 0.2
      const growX = 1 + (maxCurrentScale - 1) * 0.13
      const lift = -(maxCurrentScale - 1) * 7
      shellRef.current.style.transform = `translate3d(0, ${lift}px, 0) scale(${growX}, ${growY})`
    }

    if (dockRef.current) {
      const gap = BASE_GAP + (maxCurrentScale - 1) * 18
      const sidePadding = BASE_SIDE_PADDING + (maxCurrentScale - 1) * 26
      dockRef.current.style.gap = `${gap}px`
      dockRef.current.style.paddingLeft = `${sidePadding}px`
      dockRef.current.style.paddingRight = `${sidePadding}px`
    }

    pointer.speed *= 0.82

    const shouldContinue =
      pointer.active || currentScales.some((scale) => Math.abs(scale - 1) > 0.01)

    if (shouldContinue) {
      animationFrameRef.current = window.requestAnimationFrame(updateDock)
    } else {
      animationFrameRef.current = null
      if (shellRef.current) {
        shellRef.current.style.transform = 'translate3d(0, 0, 0) scale(1, 1)'
      }
      if (dockRef.current) {
        dockRef.current.style.gap = `${BASE_GAP}px`
        dockRef.current.style.paddingLeft = `${BASE_SIDE_PADDING}px`
        dockRef.current.style.paddingRight = `${BASE_SIDE_PADDING}px`
      }
      resetLabelStyles()
    }
  }

  const ensureAnimationLoop = () => {
    if (animationFrameRef.current !== null) {
      return
    }

    animationFrameRef.current = window.requestAnimationFrame(updateDock)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = dockRef.current?.getBoundingClientRect()
    if (!rect) {
      return
    }

    const now = performance.now()
    const pointer = pointerRef.current
    const nextX = event.clientX - rect.left

    if (pointer.lastTime > 0) {
      const deltaX = Math.abs(nextX - pointer.lastX)
      const deltaTime = Math.max(now - pointer.lastTime, 1)
      pointer.speed = Math.min(deltaX / deltaTime, 1.4)
    }

    pointer.active = true
    pointer.x = nextX
    pointer.lastX = nextX
    pointer.lastTime = now

    ensureAnimationLoop()
  }

  const handlePointerLeave = () => {
    pointerRef.current.active = false
    pointerRef.current.speed = 0
    pointerRef.current.lastTime = 0
    ensureAnimationLoop()
  }

  const handlePress = (index: number) => {
    const tile = tileRefs.current[index]

    if (!tile) {
      return
    }

    tile.classList.remove('mac-dock-bounce')
    void tile.offsetWidth
    tile.classList.add('mac-dock-bounce')
  }

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div className="fixed inset-x-0 bottom-6 z-[150] flex justify-center">
      <div
        ref={dockRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative flex items-end py-3.5"
      >
        <div
          ref={shellRef}
          className="pointer-events-none absolute inset-0 rounded-[32px] border bg-[var(--dock-background)] shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-2xl transition-transform duration-150 ease-out"
          style={{ borderColor: 'var(--surface-border)', transformOrigin: 'center bottom' }}
        />

        {items.map((item, index) => {
          const tile = (
            <span className="relative flex h-[54px] w-[54px] items-center justify-center text-white/72">
              <span
                ref={(node) => {
                  tileRefs.current[index] = node
                }}
                className="mac-dock-tile absolute inset-0 rounded-[18px] border"
                style={{
                  borderColor: 'var(--surface-border)',
                  background: 'rgba(255,255,255,0.04)',
                }}
              />
              <span
                ref={(node) => {
                  iconRefs.current[index] = node
                }}
                className="relative z-10 flex h-6 w-6 items-center justify-center"
              >
                <Icon name={item.icon} className="h-6 w-6" />
              </span>
            </span>
          )

          const content = (
            <>
              <span
                ref={(node) => {
                  labelRefs.current[index] = node
                }}
                className="mac-dock-label pointer-events-none absolute bottom-full left-1/2 mb-4 whitespace-nowrap rounded-[14px] border border-white/10 bg-[rgba(34,34,34,0.96)] px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/92 shadow-[0_10px_24px_rgba(0,0,0,0.34)]"
              >
                {item.label}
              </span>
              {tile}
              <span
                className={`mt-2 h-1.5 w-1.5 rounded-full ${
                  item.active ? 'bg-white/90' : 'bg-transparent'
                }`}
              />
            </>
          )

          return (
            <div key={item.id} className="relative z-10 flex items-end gap-2">
              {item.dividerBefore ? (
                <div className="mx-2 h-12 w-px self-center bg-white/10" />
              ) : null}

              {item.href ? (
                <a
                  ref={(node) => {
                    itemRefs.current[index] = node
                  }}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  onPointerDown={() => handlePress(index)}
                  className="relative flex w-[56px] flex-col items-center justify-end"
                >
                  {content}
                </a>
              ) : (
                <button
                  ref={(node) => {
                    itemRefs.current[index] = node
                  }}
                  type="button"
                  onClick={item.onClick}
                  onPointerDown={() => handlePress(index)}
                  className="relative flex w-[56px] flex-col items-center justify-end"
                >
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

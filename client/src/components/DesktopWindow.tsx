import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

type DesktopWindowProps = {
  title: string
  width: number
  height: number
  x: number
  y: number
  zIndex: number
  introDelay?: number
  isDesktop: boolean
  onFocus: () => void
  onClose: () => void
  onDragEnd: (offsetX: number, offsetY: number) => void
  children: ReactNode
}

export function DesktopWindow({
  title,
  width,
  height,
  x,
  y,
  zIndex,
  introDelay = 0,
  isDesktop,
  onFocus,
  onClose,
  onDragEnd,
  children,
}: DesktopWindowProps) {
  return (
    <motion.section
      drag={isDesktop}
      dragMomentum={false}
      dragElastic={0.04}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 28 }}
      initial={isDesktop ? { opacity: 0, scale: 0.992 } : false}
      animate={isDesktop ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.22, delay: introDelay, ease: [0.22, 1, 0.36, 1] }}
      onPointerDown={onFocus}
      onDragEnd={(_, info) => onDragEnd(info.offset.x, info.offset.y)}
      className={`transform-gpu overflow-hidden rounded-[22px] border shadow-[0_28px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl will-change-transform ${
        isDesktop ? 'absolute' : 'relative mt-4 w-full'
      }`}
      style={
        isDesktop
          ? {
              left: 0,
              top: 0,
              x,
              y,
              width,
              height,
              zIndex,
              background: 'var(--surface-background)',
              borderColor: 'var(--surface-border)',
            }
          : {
              background: 'var(--surface-background)',
              borderColor: 'var(--surface-border)',
            }
      }
    >
      <div className="flex h-11 items-center border-b border-white/8 px-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Close window"
            onClick={onClose}
            className="h-3 w-3 rounded-full bg-[#ff6b5f]"
          />
          <span className="h-3 w-3 rounded-full bg-white/12" />
          <span className="h-3 w-3 rounded-full bg-white/12" />
        </div>
        <div className="mx-auto pr-8 font-mono text-[11px] uppercase tracking-[0.25em] text-white/28">
          {title}
        </div>
      </div>
      <div className="panel-scroll h-[calc(100%-44px)] overflow-auto p-5">{children}</div>
    </motion.section>
  )
}

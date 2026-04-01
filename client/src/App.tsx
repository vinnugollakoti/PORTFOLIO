import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import theme2Image from './assets/theme2.jpeg'
import theme3Image from './assets/theme3.jpg'
import theme4Image from './assets/theme4.png'
import { DesktopWindow } from './components/DesktopWindow'
import { Icon } from './components/Icon'
import { MacDock } from './components/MacDock'
import {
  desktopWindows,
  experiences,
  externalLinks,
  featuredLinks,
  internalMenu,
  notes,
  openToWork,
  profileSummary,
  resumes,
  terminalCommands,
  themePresets,
  uses,
  type ThemeId,
  type WindowId,
} from './data/portfolio'
import { useGithubCalendar } from './hooks/useGithubCalendar'
import { useGithubRepos } from './hooks/useGithubRepos'
import { useVisitCount } from './hooks/useVisitCount'

type WindowState = Record<
  WindowId,
  {
    isOpen: boolean
    x: number
    y: number
    z: number
  }
>

type WidgetId =
  | 'quote'
  | 'links'
  | 'status'
  | 'themes'
  | 'calendar'
  | 'player'
  | 'visitors'
  | 'github'

type WidgetState = Record<
  WidgetId,
  {
    x: number
    y: number
    z: number
  }
>

const weekdayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const widgetDimensions: Record<WidgetId, { width: number; height: number }> = {
  quote: { width: 220, height: 112 },
  links: { width: 220, height: 252 },
  status: { width: 208, height: 156 },
  themes: { width: 392, height: 264 },
  calendar: { width: 180, height: 214 },
  player: { width: 248, height: 70 },
  visitors: { width: 142, height: 126 },
  github: { width: 584, height: 166 },
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const getViewportScene = (width: number, height: number) => {
  const safeWidth = Math.max(width, 1280)
  const safeHeight = Math.max(height, 860)
  const gutter = 16
  const top = 52

  const profile = desktopWindows.profile
  const profileX = Math.round((safeWidth - profile.width) / 2)
  const profileY = 34

  const statusX = safeWidth - widgetDimensions.status.width - gutter
  const calendarX = safeWidth - widgetDimensions.calendar.width - gutter
  const themesX = clamp(
    Math.round(profileX + profile.width / 2 - widgetDimensions.themes.width / 2 + 240),
    540,
    statusX - widgetDimensions.themes.width - 32,
  )
  const themesY = 122

  const githubX = safeWidth - widgetDimensions.github.width - 88
  const githubY = clamp(safeHeight - widgetDimensions.github.height - 132, 350, 620)

  const playerY = safeHeight - widgetDimensions.player.height - 120
  const visitorsX = 280
  const visitorsY = safeHeight - widgetDimensions.visitors.height - 98

  const widgetState: WidgetState = {
    quote: { x: gutter, y: top, z: 2 },
    links: { x: gutter, y: 182, z: 2 },
    status: { x: statusX, y: 44, z: 2 },
    themes: { x: themesX, y: themesY, z: 2 },
    calendar: { x: calendarX, y: 212, z: 2 },
    player: { x: gutter, y: playerY, z: 2 },
    visitors: { x: visitorsX, y: visitorsY, z: 2 },
    github: { x: githubX, y: githubY, z: 2 },
  }

  const windowState = (Object.keys(desktopWindows) as WindowId[]).reduce(
    (accumulator, id, index) => {
      const config = desktopWindows[id]
      const defaults: Record<WindowId, { x: number; y: number }> = {
        profile: { x: profileX, y: profileY },
        experience: { x: profileX + 120, y: 138 },
        projects: { x: Math.max(420, safeWidth * 0.34), y: 132 },
        contact: { x: 176, y: 385 },
        resume: { x: Math.max(520, safeWidth * 0.42), y: 312 },
        terminal: { x: Math.max(600, safeWidth * 0.47), y: 382 },
        uses: { x: Math.max(760, safeWidth * 0.56), y: 180 },
        notes: { x: Math.max(760, safeWidth * 0.57), y: 110 },
      }

      accumulator[id] = {
        isOpen: config.defaultOpen,
        x: clamp(defaults[id].x, 12, safeWidth - config.width - 12),
        y: clamp(defaults[id].y, 12, safeHeight - config.height - 24),
        z: index + 3,
      }
      return accumulator
    },
    {} as WindowState,
  )

  return { windowState, widgetState }
}

function App() {
  const initialScene =
    typeof window === 'undefined'
      ? getViewportScene(1440, 900)
      : getViewportScene(window.innerWidth, window.innerHeight)

  const [windowState, setWindowState] = useState<WindowState>(initialScene.windowState)
  const [widgetState, setWidgetState] = useState<WidgetState>(initialScene.widgetState)
  const [activeWindow, setActiveWindow] = useState<WindowId>('profile')
  const [themeId, setThemeId] = useState<ThemeId>('default')
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window === 'undefined'
      ? true
      : window.matchMedia('(min-width: 1024px)').matches,
  )
  const [showBootAnimation, setShowBootAnimation] = useState(true)
  const desktopRef = useRef<HTMLDivElement | null>(null)
  const hasInteractedRef = useRef(false)

  const { repos, isLoading: reposLoading } = useGithubRepos()
  const { cells, total, monthLabels, isLoading: calendarLoading } =
    useGithubCalendar()
  const { count: visitorCount } = useVisitCount()

  const activeTheme = useMemo(
    () => themePresets.find((theme) => theme.id === themeId) ?? themePresets[0],
    [themeId],
  )
  const themeButtonPreviews: Record<ThemeId, string> = useMemo(
    () => ({
      default:
        'radial-gradient(circle at 72% 78%, rgba(255,255,255,0.95), rgba(255,255,255,0.15) 12%, transparent 14%), linear-gradient(180deg, #0f0f0f 0%, #161616 100%)',
      logic: `url(${theme2Image})`,
      weeknd: `url(${theme3Image})`,
      radiohead: `url(${theme4Image})`,
    }),
    [],
  )

  useEffect(() => {
    const timer = window.setTimeout(() => setShowBootAnimation(false), 1350)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const listener = (event: MediaQueryListEvent) => setIsDesktop(event.matches)
    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])

  useEffect(() => {
    const syncScene = () => {
      if (!isDesktop || hasInteractedRef.current) {
        return
      }

      const scene = getViewportScene(window.innerWidth, window.innerHeight)
      setWindowState(scene.windowState)
      setWidgetState(scene.widgetState)
    }

    syncScene()
    window.addEventListener('resize', syncScene)
    return () => window.removeEventListener('resize', syncScene)
  }, [isDesktop])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--page-background', activeTheme.page)
    root.style.setProperty('--page-glow', activeTheme.accentGlow)
    root.style.setProperty('--surface-background', activeTheme.surface)
    root.style.setProperty('--widget-background', activeTheme.widget)
    root.style.setProperty('--surface-border', activeTheme.border)
    root.style.setProperty('--dock-background', activeTheme.dock)
    root.style.setProperty('--preview-outline', activeTheme.border)
  }, [activeTheme])

  const activeTitle = desktopWindows[activeWindow].label

  const dockItems = [
    ...internalMenu.map((item) => ({
      id: item.id,
      label: desktopWindows[item.id].label,
      icon: item.icon,
      active: windowState[item.id].isOpen,
      onClick: () => bringToFront(item.id),
    })),
    {
      id: 'github-external',
      label: 'GitHub',
      icon: 'github',
      active: false,
      href: externalLinks.github,
      dividerBefore: true,
    },
    {
      id: 'twitter-external',
      label: 'X',
      icon: 'twitter',
      active: false,
      href: externalLinks.twitter,
    },
  ]

  const calendarMatrix = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const leadingEmpty = firstDay.getDay()
    const days = Array.from({ length: lastDay.getDate() }, (_, index) => index + 1)
    const padded = [...Array.from({ length: leadingEmpty }, () => null), ...days]

    while (padded.length % 7 !== 0) {
      padded.push(null)
    }

    return {
      month: new Intl.DateTimeFormat('en', { month: 'long' }).format(now),
      year,
      weeks: Array.from({ length: padded.length / 7 }, (_, index) =>
        padded.slice(index * 7, index * 7 + 7),
      ),
      today: now.getDate(),
    }
  }, [])

  const registerInteraction = () => {
    hasInteractedRef.current = true
  }

  const bringToFront = (id: WindowId) => {
    registerInteraction()
    setWindowState((current) => {
      const maxZ = Math.max(...Object.values(current).map((item) => item.z))
      return {
        ...current,
        [id]: {
          ...current[id],
          isOpen: true,
          z: maxZ + 1,
        },
      }
    })
    setActiveWindow(id)
  }

  const bringWidgetToFront = (id: WidgetId) => {
    registerInteraction()
    setWidgetState((current) => {
      const maxZ = Math.max(...Object.values(current).map((item) => item.z))
      return {
        ...current,
        [id]: {
          ...current[id],
          z: maxZ + 1,
        },
      }
    })
  }

  const closeWindow = (id: WindowId) => {
    setWindowState((current) => ({
      ...current,
      [id]: {
        ...current[id],
        isOpen: false,
      },
    }))

    if (activeWindow === id) {
      setActiveWindow('profile')
    }
  }

  const updateWindowPosition = (id: WindowId, offsetX: number, offsetY: number) => {
    registerInteraction()
    const config = desktopWindows[id]
    const width = desktopRef.current?.clientWidth ?? window.innerWidth
    const height = desktopRef.current?.clientHeight ?? window.innerHeight

    setWindowState((current) => ({
      ...current,
      [id]: {
        ...current[id],
        x: clamp(current[id].x + offsetX, 12, width - config.width - 12),
        y: clamp(current[id].y + offsetY, 12, height - config.height - 28),
      },
    }))
  }

  const updateWidgetPosition = (id: WidgetId, offsetX: number, offsetY: number) => {
    registerInteraction()
    const config = widgetDimensions[id]
    const width = desktopRef.current?.clientWidth ?? window.innerWidth
    const height = desktopRef.current?.clientHeight ?? window.innerHeight

    setWidgetState((current) => ({
      ...current,
      [id]: {
        ...current[id],
        x: clamp(current[id].x + offsetX, 12, width - config.width - 12),
        y: clamp(current[id].y + offsetY, 12, height - config.height - 28),
      },
    }))
  }

  const windowContent = (id: WindowId) => {
    if (id === 'profile') {
      return (
        <div className="flex h-full flex-col justify-between">
          <div>
            <h1 className="max-w-sm text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-white">
              Vinay
              <br />
              Reddy
            </h1>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.35em] text-white/42">
              Full Stack / Sui / Web3 Engineer
            </p>
            <div className="mt-5 border-t border-white/8 pt-5 text-[15px] leading-8 text-white/62">
              <p>{profileSummary.bio}</p>
              <p className="mt-4">{profileSummary.focus}</p>
            </div>
          </div>

          <div className="mt-8 border-t border-white/8 pt-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/6 text-sm font-semibold text-white/80">
                  VG
                </div>
                <div>
                  <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-white/55">
                    vinnugollakoti
                  </p>
                  <p className="text-xs text-white/35">India • Builder</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-white/45">
                <a href={externalLinks.twitter} target="_blank" rel="noreferrer">
                  <Icon name="twitter" className="h-4 w-4" />
                </a>
                <a href={externalLinks.github} target="_blank" rel="noreferrer">
                  <Icon name="github" className="h-4 w-4" />
                </a>
                <a href="mailto:vinnugollakoti289@gmail.com">
                  <Icon name="contact" className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (id === 'experience') {
      return (
        <div className="space-y-7">
          {experiences.map((experience) => (
            <article
              key={`${experience.company}-${experience.period}`}
              className="border-b border-white/8 pb-5 last:border-none last:pb-0"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-white">
                    {experience.company}
                    <span className="ml-2 text-sm font-medium text-white/38">
                      {experience.role}
                    </span>
                  </h3>
                  <p className="mt-2 text-[15px] text-white/60">
                    {experience.summary}
                  </p>
                </div>
                <p className="shrink-0 font-mono text-[11px] uppercase tracking-[0.2em] text-white/28">
                  {experience.period}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {experience.stack.map((item) => (
                  <span
                    key={item}
                    className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/28"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      )
    }

    if (id === 'projects') {
      return (
        <div>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/30">
                GitHub Repositories
              </p>
              <p className="mt-2 text-sm text-white/45">
                Dynamic tiles from GitHub API with graceful fallback.
              </p>
            </div>
            <a
              href={externalLinks.github}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45 transition hover:text-white"
            >
              Open GitHub
            </a>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {reposLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-36 animate-pulse rounded-2xl border border-white/8 bg-white/[0.03]"
                  />
                ))
              : repos.map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group rounded-2xl border border-white/8 bg-white/[0.03] p-4 transition hover:border-white/18 hover:bg-white/[0.045]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold capitalize text-white">
                        {repo.name}
                      </h3>
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/32">
                        {repo.stars}★
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-white/56">
                      {repo.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {repo.stack.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/8 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/35"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </a>
                ))}
          </div>
        </div>
      )
    }

    if (id === 'contact') {
      return (
        <div>
          <h2 className="text-4xl font-semibold tracking-[-0.05em] text-white">
            Let&apos;s Connect
          </h2>
          <p className="mt-3 text-[15px] text-white/55">
            Open to collaborations, freelance work, or just a conversation.
          </p>
          <div className="mt-6 border-t border-white/8">
            {[
              ['Email', 'mailto:vinnugollakoti289@gmail.com', 'vinnugollakoti289@gmail.com'],
              ['LinkedIn', externalLinks.linkedin, 'vinay-reddy-a1aa7024b'],
              ['X / Twitter', externalLinks.twitter, '@VinnuGollakoti'],
              ['WhatsApp', externalLinks.whatsapp, 'Quick direct reach-out'],
            ].map(([label, href, value]) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                className="flex items-center justify-between border-b border-white/8 py-4 text-sm text-white/62 transition hover:text-white"
              >
                <span>{label}</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/28">
                  {value}
                </span>
              </a>
            ))}
          </div>
        </div>
      )
    }

    if (id === 'resume') {
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {resumes.map((resume) => (
            <a
              key={resume.label}
              href={resume.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition hover:border-white/18"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
                Resume
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                {resume.label}
              </h3>
              <p className="mt-2 text-sm leading-7 text-white/55">
                {resume.description}
              </p>
            </a>
          ))}
        </div>
      )
    }

    if (id === 'terminal') {
      return (
        <div className="space-y-4 font-mono text-[13px] text-white/62">
          {terminalCommands.map((line) => (
            <div
              key={line.command}
              className="rounded-2xl border border-white/8 bg-black/16 p-4"
            >
              <p className="text-white/32">$ {line.command}</p>
              <p className="mt-2 whitespace-pre-line text-white/68">{line.output}</p>
            </div>
          ))}
        </div>
      )
    }

    if (id === 'uses') {
      return (
        <div className="space-y-5">
          {uses.map((group) => (
            <div key={group.title}>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/28">
                {group.title}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/8 px-3 py-1.5 text-sm text-white/62"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {notes.map((entry) => (
          <article
            key={entry.month}
            className="border-b border-white/8 pb-5 last:border-none last:pb-0"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/28">
              {entry.month}
            </p>
            <div className="mt-3 space-y-3 text-[15px] leading-8 text-white/58">
              {entry.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <div
        className="pointer-events-none fixed inset-0"
        style={{ background: 'var(--page-background)' }}
      />
      <div
        className="pointer-events-none fixed inset-0 opacity-90"
        style={{ background: 'var(--page-glow)' }}
      />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:18px_18px] opacity-30" />

      <AnimatePresence>
        {showBootAnimation ? (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.45 } }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{
                scale: [0.4, 1.08, 1],
                opacity: 1,
                boxShadow: [
                  '0 0 0 rgba(255,255,255,0.0)',
                  '0 0 120px rgba(255,255,255,0.18)',
                  '0 0 40px rgba(255,255,255,0.10)',
                ],
              }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="flex h-32 w-32 items-center justify-center rounded-full border border-white/12 bg-white/6"
            >
              <div className="text-center">
                <p className="text-2xl font-semibold tracking-[0.2em] text-white">VG</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
                  Booting desktop
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <header
        className="fixed inset-x-0 top-0 z-[140] h-10 border-b backdrop-blur-xl"
        style={{
          background: 'rgba(0,0,0,0.5)',
          borderColor: 'var(--surface-border)',
        }}
      >
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <p className="font-semibold tracking-[0.2em] text-white/92">VG</p>
            <p className="hidden text-xs text-white/30 lg:block">| {activeTitle}</p>
          </div>
          <a
            href={externalLinks.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-white/55 transition hover:text-white"
          >
            Contact
          </a>
        </div>
      </header>

      <div
        ref={desktopRef}
        className="relative hidden min-h-screen overflow-hidden px-4 pb-32 pt-14 lg:block"
      >
        <FloatingWidget
          width={widgetDimensions.quote.width}
          x={widgetState.quote.x}
          y={widgetState.quote.y}
          zIndex={widgetState.quote.z}
          onFocus={() => bringWidgetToFront('quote')}
          onDragEnd={(offsetX, offsetY) => updateWidgetPosition('quote', offsetX, offsetY)}
        >
          <p className="text-[22px] leading-9 text-white/64">“{profileSummary.quote}”</p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/25">
            VG • writing
          </p>
        </FloatingWidget>

        <FloatingWidget
          width={widgetDimensions.links.width}
          x={widgetState.links.x}
          y={widgetState.links.y}
          zIndex={widgetState.links.z}
          onFocus={() => bringWidgetToFront('links')}
          onDragEnd={(offsetX, offsetY) => updateWidgetPosition('links', offsetX, offsetY)}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/24">
            Links • Worth Reading
          </p>
          <div className="mt-4 space-y-3">
            {featuredLinks.map((link) => (
              <a
                key={link.title}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="block border-t border-white/8 pt-3 text-white/62 transition hover:text-white"
              >
                <p className="text-sm">{link.title}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-white/25">
                  {link.meta}
                </p>
              </a>
            ))}
          </div>
        </FloatingWidget>

        <FloatingWidget
          width={widgetDimensions.status.width}
          x={widgetState.status.x}
          y={widgetState.status.y}
          zIndex={widgetState.status.z}
          onFocus={() => bringWidgetToFront('status')}
          onDragEnd={(offsetX, offsetY) => updateWidgetPosition('status', offsetX, offsetY)}
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/62">
              Open to work
            </p>
          </div>
          <div className="mt-5 space-y-4">
            {openToWork.map((item) => (
              <div key={item.label} className="border-t border-white/8 pt-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/24">
                  {item.label}
                </p>
                <p className="mt-2 text-sm text-white/62">{item.value}</p>
              </div>
            ))}
          </div>
        </FloatingWidget>

        <FloatingWidget
          width={widgetDimensions.themes.width}
          x={widgetState.themes.x}
          y={widgetState.themes.y}
          zIndex={widgetState.themes.z}
          onFocus={() => bringWidgetToFront('themes')}
          onDragEnd={(offsetX, offsetY) => updateWidgetPosition('themes', offsetX, offsetY)}
        >
          <div className="border-b border-white/8 pb-5">
            <div className="mb-5 flex justify-center">
              <span className="h-1.5 w-20 rounded-full bg-white/10" />
            </div>
            <div className="flex items-start justify-between">
              <p className="pt-1 font-mono text-[14px] uppercase tracking-[0.32em] text-white/46">
                Theme
              </p>
              <div className="text-right">
                <p className="font-mono text-[14px] uppercase tracking-[0.22em] text-white/52">
                  {activeTheme.label}
                </p>
                <p className="mt-1 font-mono text-[13px] uppercase tracking-[0.2em] text-white/28">
                  {activeTheme.subtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-4 gap-4">
            {themePresets.map((theme) => {
              const selected = theme.id === themeId
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setThemeId(theme.id)}
                  className="text-left"
                >
                  <div
                    className={`relative h-[98px] overflow-hidden rounded-[18px] border transition ${
                      selected
                        ? 'border-white/85 shadow-[0_0_0_1px_rgba(255,255,255,0.38),0_8px_30px_rgba(0,0,0,0.28)]'
                        : 'border-white/10'
                    }`}
                    style={{
                      backgroundImage: themeButtonPreviews[theme.id],
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {theme.id === 'default' ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/14 text-white/16">
                          <Icon name="search" className="h-5 w-5" />
                        </div>
                      </div>
                    ) : null}
                    {selected ? (
                      <span className="absolute bottom-3 right-3 h-3.5 w-3.5 rounded-full bg-white/92 shadow-[0_0_18px_rgba(255,255,255,0.5)]" />
                    ) : null}
                  </div>
                  <p className="mt-3 text-center font-mono text-[12px] uppercase tracking-[0.18em] text-white/38">
                    {theme.label}
                  </p>
                </button>
              )
            })}
          </div>
        </FloatingWidget>

        <FloatingWidget
          width={widgetDimensions.calendar.width}
          x={widgetState.calendar.x}
          y={widgetState.calendar.y}
          zIndex={widgetState.calendar.z}
          onFocus={() => bringWidgetToFront('calendar')}
          onDragEnd={(offsetX, offsetY) => updateWidgetPosition('calendar', offsetX, offsetY)}
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-semibold text-white">{calendarMatrix.month}</p>
              <p className="text-sm text-white/26">{calendarMatrix.year}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-2 text-center">
            {weekdayLabels.map((day) => (
              <span key={day} className="font-mono text-[10px] text-white/20">
                {day}
              </span>
            ))}
            {calendarMatrix.weeks.flat().map((day, index) => (
              <span
                key={`${day}-${index}`}
                className={`flex h-6 items-center justify-center rounded-md text-xs ${
                  day === calendarMatrix.today
                    ? 'border border-white/25 text-white'
                    : 'text-white/40'
                }`}
              >
                {day ?? ''}
              </span>
            ))}
          </div>
        </FloatingWidget>

        <FloatingWidget
          width={widgetDimensions.player.width}
          x={widgetState.player.x}
          y={widgetState.player.y}
          zIndex={widgetState.player.z}
          onFocus={() => bringWidgetToFront('player')}
          onDragEnd={(offsetX, offsetY) => updateWidgetPosition('player', offsetX, offsetY)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-white/[0.04] text-white/25">
                <Icon name="disc" className="h-4 w-4" />
              </div>
              <p className="text-sm text-white/38">not playing</p>
            </div>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </div>
        </FloatingWidget>

        <FloatingWidget
          width={widgetDimensions.visitors.width}
          x={widgetState.visitors.x}
          y={widgetState.visitors.y}
          zIndex={widgetState.visitors.z}
          onFocus={() => bringWidgetToFront('visitors')}
          onDragEnd={(offsetX, offsetY) => updateWidgetPosition('visitors', offsetX, offsetY)}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/24">
            Visitors
          </p>
          <p className="mt-3 text-5xl font-semibold tracking-[-0.05em] text-white">
            {visitorCount.toLocaleString('en-US')}
          </p>
          <p className="mt-2 text-sm text-white/26">total visits</p>
        </FloatingWidget>

        <FloatingWidget
          width={widgetDimensions.github.width}
          x={widgetState.github.x}
          y={widgetState.github.y}
          zIndex={widgetState.github.z}
          onFocus={() => bringWidgetToFront('github')}
          onDragEnd={(offsetX, offsetY) => updateWidgetPosition('github', offsetX, offsetY)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/35">
              <Icon name="github" className="h-4 w-4" />
              <p className="text-xs">vinnugollakoti</p>
            </div>
            <p className="text-xs text-white/28">
              {calendarLoading ? 'Loading contributions...' : `${total} contributions this year`}
            </p>
          </div>

          <div className="mt-3 flex gap-3">
            {monthLabels.map((month) => (
              <span
                key={month.index}
                className="text-[10px] text-white/22"
                style={{ width: month.width }}
              >
                {month.label}
              </span>
            ))}
          </div>

          <div className="mt-2 flex gap-[3px]">
            {cells.map((column, columnIndex) => (
              <div key={columnIndex} className="grid grid-rows-7 gap-[3px]">
                {column.map((cell) => (
                  <div
                    key={cell.date}
                    title={`${cell.date}: ${cell.count} contributions`}
                    className="h-3 w-3 rounded-[2px]"
                    style={{
                      background:
                        cell.level === 0
                          ? 'rgba(255,255,255,0.06)'
                          : ['#10351d', '#174f2b', '#246f3d', '#35a253'][cell.level - 1],
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </FloatingWidget>

        {(Object.keys(desktopWindows) as WindowId[]).map((id, index) => {
          const config = desktopWindows[id]
          const state = windowState[id]

          if (!state.isOpen) {
            return null
          }

          return (
            <DesktopWindow
              key={`${id}-content`}
              title={config.label}
              width={config.width}
              height={config.height}
              x={state.x}
              y={state.y}
              zIndex={state.z}
              introDelay={0.18 + index * 0.05}
              onFocus={() => bringToFront(id)}
              onClose={() => closeWindow(id)}
              onDragEnd={(offsetX, offsetY) => updateWindowPosition(id, offsetX, offsetY)}
              isDesktop={isDesktop}
            >
              {windowContent(id)}
            </DesktopWindow>
          )
        })}

        <MacDock items={dockItems} />
      </div>

      <div className="px-4 pb-28 pt-14 lg:hidden">
        <div
          className="rounded-[22px] border p-5 backdrop-blur-xl"
          style={{
            background: 'var(--surface-background)',
            borderColor: 'var(--surface-border)',
          }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
            Vinay Reddy
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">
            Full Stack Developer
            <br />
            Blockchain Developer (Sui)
          </h1>
          <p className="mt-4 text-sm leading-7 text-white/58">{profileSummary.bio}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {internalMenu.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => bringToFront(item.id)}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/62"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {internalMenu
            .filter((item) => windowState[item.id].isOpen)
            .map((item) => (
              <div
                key={item.id}
                className="rounded-[22px] border p-5 backdrop-blur-xl"
                style={{
                  background: 'var(--surface-background)',
                  borderColor: 'var(--surface-border)',
                }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/32">
                    {desktopWindows[item.id].label}
                  </p>
                  <button
                    type="button"
                    onClick={() => closeWindow(item.id)}
                    className="text-white/35"
                  >
                    <Icon name="close" className="h-4 w-4" />
                  </button>
                </div>
                {windowContent(item.id)}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

function FloatingWidget({
  width,
  x,
  y,
  zIndex,
  onFocus,
  onDragEnd,
  children,
}: {
  width: number
  x: number
  y: number
  zIndex: number
  onFocus: () => void
  onDragEnd: (offsetX: number, offsetY: number) => void
  children: ReactNode
}) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.04}
      dragTransition={{ bounceStiffness: 520, bounceDamping: 30 }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      onPointerDown={onFocus}
      onDragEnd={(_, info) => onDragEnd(info.offset.x, info.offset.y)}
      className="absolute rounded-[18px] border p-4 shadow-[0_20px_60px_rgba(0,0,0,0.32)] backdrop-blur-xl"
      style={{
        left: 0,
        top: 0,
        x,
        y,
        zIndex,
        width,
        background: 'var(--widget-background)',
        borderColor: 'var(--surface-border)',
      }}
    >
      <div className="mb-3 flex justify-center">
        <span className="h-1 w-10 rounded-full bg-white/8" />
      </div>
      {children}
    </motion.div>
  )
}

export default App

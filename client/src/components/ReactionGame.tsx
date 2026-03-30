import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

type GameState = 'idle' | 'waiting' | 'ready' | 'result' | 'tooSoon'

export function ReactionGame() {
  const [gameState, setGameState] = useState<GameState>('idle')
  const [message, setMessage] = useState(
    'Press start, wait for the glow, then click as fast as you can.',
  )
  const [bestTime, setBestTime] = useState<number | null>(null)
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const resetTimer = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = null
    startTimeRef.current = null
  }

  const beginGame = () => {
    resetTimer()
    setGameState('waiting')
    setReactionTime(null)
    setMessage('Wait for the cyan pulse. Clicking early resets the run.')

    const delay = 1400 + Math.floor(Math.random() * 2400)
    timeoutRef.current = window.setTimeout(() => {
      startTimeRef.current = window.performance.now()
      setGameState('ready')
      setMessage('Click now!')
    }, delay)
  }

  const handleZoneClick = () => {
    if (gameState === 'waiting') {
      resetTimer()
      setGameState('tooSoon')
      setReactionTime(null)
      setMessage('Too early. Reset and trust the glow.')
      return
    }

    if (gameState !== 'ready' || !startTimeRef.current) {
      return
    }

    const elapsed = Math.round(window.performance.now() - startTimeRef.current)
    resetTimer()
    setReactionTime(elapsed)
    setBestTime((currentBest) => {
      if (currentBest === null || elapsed < currentBest) {
        return elapsed
      }

      return currentBest
    })
    setGameState('result')
    setMessage(elapsed < 260 ? 'Sharp reflexes.' : 'Nice run. Want another?')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[2rem] border border-white/10 bg-white/6 p-5 backdrop-blur-xl sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/70">
              Reaction Test
            </p>
            <h3 className="mt-2 font-heading text-3xl font-semibold text-white">
              Beat the glow
            </h3>
          </div>

          <button
            type="button"
            onClick={beginGame}
            className="rounded-full bg-[linear-gradient(135deg,#63d4ff,#7c5cff)] px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
          >
            {gameState === 'waiting' ? 'Restart' : 'Start Game'}
          </button>
        </div>

        <motion.button
          type="button"
          onClick={handleZoneClick}
          animate={
            gameState === 'ready'
              ? {
                  boxShadow: [
                    '0 0 0 rgba(56, 189, 248, 0.15)',
                    '0 0 60px rgba(56, 189, 248, 0.4)',
                    '0 0 0 rgba(56, 189, 248, 0.15)',
                  ],
                  scale: [1, 1.01, 1],
                }
              : {
                  boxShadow: '0 0 0 rgba(56, 189, 248, 0.12)',
                  scale: 1,
                }
          }
          transition={
            gameState === 'ready'
              ? { duration: 1.2, repeat: Number.POSITIVE_INFINITY }
              : { duration: 0.3 }
          }
          className={`flex min-h-72 w-full items-center justify-center rounded-[1.75rem] border text-center transition ${
            gameState === 'ready'
              ? 'border-cyan-300/50 bg-cyan-300/12 text-cyan-100'
              : 'border-white/10 bg-slate-950/75 text-white/60'
          }`}
        >
          <div className="max-w-sm px-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">
              {gameState === 'ready' ? 'Go' : gameState}
            </p>
            <p className="mt-4 font-heading text-3xl font-semibold text-white">
              {message}
            </p>
          </div>
        </motion.button>
      </div>

      <div className="grid gap-4">
        <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/75 p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/70">
            Latest
          </p>
          <p className="mt-3 font-heading text-4xl font-semibold text-white">
            {reactionTime ? `${reactionTime} ms` : '--'}
          </p>
          <p className="mt-3 text-sm text-white/60">
            Your most recent recorded click.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/70">
            Best Score
          </p>
          <p className="mt-3 font-heading text-4xl font-semibold text-white">
            {bestTime ? `${bestTime} ms` : '--'}
          </p>
          <p className="mt-3 text-sm text-white/60">
            Faster than 260 ms already looks excellent.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/70">
            How It Works
          </p>
          <p className="mt-3 text-sm leading-7 text-white/60">
            Start the game, wait for the panel to glow cyan, then click
            immediately. If you click before the glow, the attempt resets.
          </p>
        </div>
      </div>
    </div>
  )
}

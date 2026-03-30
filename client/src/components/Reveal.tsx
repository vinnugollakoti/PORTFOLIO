import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type RevealProps = {
  children: ReactNode
  delay?: number
  className?: string
}

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

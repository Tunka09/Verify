'use client'

import { motion } from 'framer-motion'

interface ShimmerTextProps {
  text: string
  className?: string
}

export default function ShimmerText({ text, className = '' }: ShimmerTextProps) {
  const letters = text.split('')

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.04 * i },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 10,
    },
  }

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, i) => (
        <motion.span
          key={`${letter}-${i}`}
          variants={child}
          className="inline-block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.div>
  )
}

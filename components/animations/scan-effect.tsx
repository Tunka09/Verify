'use client'

import { motion } from 'framer-motion'

interface ScanEffectProps {
  className?: string
}

export default function ScanEffect({ className = '' }: ScanEffectProps) {
  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none ${className}`}
      initial={{ top: '-100%' }}
      animate={{ top: '100%' }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <div className="h-1 bg-gradient-to-b from-transparent via-primary to-transparent shadow-lg shadow-primary/50"></div>
    </motion.div>
  )
}

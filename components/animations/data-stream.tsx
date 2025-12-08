'use client'

import { motion } from 'framer-motion'

interface DataStreamProps {
  data: string[]
  className?: string
}

export default function DataStream({ data, className = '' }: DataStreamProps) {
  return (
    <div className={`relative overflow-hidden h-32 ${className}`}>
      <motion.div
        animate={{ y: '100%' }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="space-y-4"
      >
        {data.concat(data).map((item, i) => (
          <div
            key={i}
            className="text-sm font-mono text-primary/50 hover:text-accent transition-colors"
          >
            {'> '} {item}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

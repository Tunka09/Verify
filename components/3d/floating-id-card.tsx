'use client'

import { motion } from 'framer-motion'
import HolographicCard from './holographic-card'

interface FloatingIDCardProps {
  front?: string
  back?: string
}

export default function FloatingIDCard({ front, back }: FloatingIDCardProps) {
  return (
    <motion.div
      className="flex gap-8 justify-center items-center perspective"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {/* Front Card */}
      {front && (
        <HolographicCard className="w-80 h-48">
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="relative w-full h-full rounded-xl overflow-hidden border-2 border-primary/30 shadow-2xl"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <img
              src={front || "/placeholder.svg"}
              alt="ID Front"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 border-2 border-primary/30 rounded-xl pointer-events-none neon-border"></div>
          </motion.div>
        </HolographicCard>
      )}

      {/* Back Card */}
      {back && (
        <HolographicCard className="w-80 h-48">
          <motion.div
            animate={{ rotateY: [0, -360] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="relative w-full h-full rounded-xl overflow-hidden border-2 border-secondary/30 shadow-2xl"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <img
              src={back || "/placeholder.svg"}
              alt="ID Back"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-accent/10 to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 border-2 border-secondary/30 rounded-xl pointer-events-none neon-border"></div>
          </motion.div>
        </HolographicCard>
      )}
    </motion.div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface HolographicCardProps {
  children: React.ReactNode
  className?: string
}

export default function HolographicCard({
  children,
  className = '',
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || !isHovering) return

      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setMousePosition({ x, y })

      // Apply perspective transform based on mouse position
      const xPercent = x / rect.width
      const yPercent = y / rect.height
      const xRotation = (yPercent - 0.5) * 10
      const yRotation = (xPercent - 0.5) * -10

      cardRef.current.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`
    }

    const handleMouseLeave = () => {
      if (cardRef.current) {
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)'
      }
      setIsHovering(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    cardRef.current?.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      cardRef.current?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isHovering])

  return (
    <motion.div
      ref={cardRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`relative transition-transform duration-300 ${className}`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Holographic overlay */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 240, 255, 0.2) 0%, transparent 50%)`,
        }}
      ></div>

      {/* Content */}
      <div
        className="relative"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>

      {/* Light reflection effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-20 transition-opacity duration-300 bg-gradient-to-br from-white via-transparent to-transparent pointer-events-none"></div>
    </motion.div>
  )
}

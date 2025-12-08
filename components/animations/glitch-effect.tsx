'use client'

import { useEffect, useState } from 'react'

interface GlitchEffectProps {
  text: string
  className?: string
}

export default function GlitchEffect({ text, className = '' }: GlitchEffectProps) {
  const [glitching, setGlitching] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(Math.random() > 0.7)
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`relative ${className}`}>
      <div className="text-foreground font-bold">{text}</div>

      {glitching && (
        <>
          <div
            className="absolute inset-0 text-primary font-bold"
            style={{
              clipPath: `inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0)`,
              transform: `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`,
            }}
          >
            {text}
          </div>
          <div
            className="absolute inset-0 text-accent font-bold"
            style={{
              clipPath: `inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0)`,
              transform: `translate(${Math.random() * -4 + 2}px, ${Math.random() * -4 + 2}px)`,
            }}
          >
            {text}
          </div>
        </>
      )}
    </div>
  )
}

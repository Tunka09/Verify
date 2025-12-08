'use client'

import { useEffect, useRef } from 'react'

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Particle system
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
      size: number
    }> = []

    const createParticles = () => {
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          life: 1,
          maxLife: Math.random() * 3 + 2,
          size: Math.random() * 1.5 + 0.5,
        })
      }
    }
    createParticles()

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 15, 35, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 1 / 60

        if (p.life <= 0) {
          particles.splice(i, 1)
        }

        const opacity = Math.min(p.life / 0.5, 1) * 0.8
        ctx.fillStyle = `rgba(0, 240, 255, ${opacity})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      if (Math.random() > 0.98) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 1,
          maxLife: Math.random() * 3 + 2,
          size: Math.random() * 1.5 + 0.5,
        })
      }

      requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  )
}

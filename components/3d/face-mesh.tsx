'use client'

import { useEffect, useRef } from 'react'

interface FaceMeshProps {
  isAnimating?: boolean
}

export default function FaceMesh({ isAnimating = true }: FaceMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()

    window.addEventListener('resize', resizeCanvas)

    let time = 0
    let animationId: number

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 15, 35, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (!isAnimating) {
        animationId = requestAnimationFrame(animate)
        return
      }

      // Draw animated mesh grid
      const gridSize = 50
      const waveAmplitude = 20
      const waveFrequency = 0.05

      ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)'
      ctx.lineWidth = 1

      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const offsetX = Math.sin((y + time) * waveFrequency) * waveAmplitude
          const offsetY = Math.cos((x + time) * waveFrequency) * waveAmplitude

          // Draw grid lines
          if (x < canvas.width - gridSize) {
            ctx.beginPath()
            ctx.moveTo(x + offsetX, y + offsetY)
            ctx.lineTo(x + gridSize + offsetX, y + offsetY)
            ctx.stroke()
          }

          if (y < canvas.height - gridSize) {
            ctx.beginPath()
            ctx.moveTo(x + offsetX, y + offsetY)
            ctx.lineTo(x + offsetX, y + gridSize + offsetY)
            ctx.stroke()
          }
        }
      }

      // Draw nodes at intersections
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const offsetX = Math.sin((y + time) * waveFrequency) * waveAmplitude
          const offsetY = Math.cos((x + time) * waveFrequency) * waveAmplitude

          ctx.fillStyle = `rgba(0, 240, 255, ${0.3 + Math.sin(time * 0.05) * 0.2})`
          ctx.beginPath()
          ctx.arc(x + offsetX, y + offsetY, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      time += 1

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [isAnimating])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.4 }}
    />
  )
}

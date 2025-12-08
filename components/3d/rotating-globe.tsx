'use client'

import { useEffect, useRef } from 'react'

export default function RotatingGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let rotation = 0

    const drawGlobe = () => {
      // Clear with semi-transparent background for trail effect
      ctx.fillStyle = 'rgba(5, 15, 35, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(canvas.width, canvas.height) / 4

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(rotation)

      // Draw globe outline
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(0, 0, radius, 0, Math.PI * 2)
      ctx.stroke()

      // Draw grid lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)'
      ctx.lineWidth = 1
      for (let lat = -80; lat <= 80; lat += 20) {
        const y = (lat / 90) * radius
        ctx.beginPath()
        ctx.ellipse(0, y, radius * Math.cos((lat * Math.PI) / 180), 2, 0, 0, Math.PI * 2)
        ctx.stroke()
      }

      for (let lon = 0; lon < 360; lon += 30) {
        ctx.beginPath()
        for (let lat = -90; lat <= 90; lat += 5) {
          const x = Math.cos((lon * Math.PI) / 180) * (lat / 90) * radius
          const y = (lat / 90) * radius
          if (lat === -90) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      // Draw data points
      const dataPoints = [
        { lat: 40, lon: -74 },
        { lat: 51, lon: 0 },
        { lat: 35, lon: 139 },
      ]

      dataPoints.forEach((point) => {
        const x = Math.cos((point.lon * Math.PI) / 180) * ((90 - point.lat) / 90) * radius
        const y = ((90 - point.lat) / 90) * radius

        // Glow effect
        ctx.fillStyle = 'rgba(255, 0, 110, 0.3)'
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fill()

        // Point
        ctx.fillStyle = 'rgba(255, 0, 110, 1)'
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.restore()

      rotation += 0.0005

      animationId = requestAnimationFrame(drawGlobe)
    }

    drawGlobe()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-30" />
}

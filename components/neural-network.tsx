'use client'

import { useEffect, useRef } from 'react'

export default function NeuralNetwork() {
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

    interface Node {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
    }

    const nodes: Node[] = []
    const nodeCount = 40

    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      })
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 15, 35, 0)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw nodes
      nodes.forEach((node) => {
        node.x += node.vx
        node.y += node.vy

        // Bounce off walls
        if (node.x - node.radius < 0 || node.x + node.radius > canvas.width) {
          node.vx *= -1
        }
        if (node.y - node.radius < 0 || node.y + node.radius > canvas.height) {
          node.vy *= -1
        }

        node.x = Math.max(node.radius, Math.min(canvas.width - node.radius, node.x))
        node.y = Math.max(node.radius, Math.min(canvas.height - node.radius, node.y))

        // Draw node
        ctx.fillStyle = 'rgba(0, 240, 255, 0.6)'
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 200) {
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.2 * (1 - distance / 200)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
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
      className="fixed inset-0 z-0 pointer-events-none opacity-40"
    />
  )
}

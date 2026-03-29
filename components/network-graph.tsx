"use client"

import { useEffect, useRef } from "react"

export function NetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const nodes: { x: number; y: number; vx: number; vy: number }[] = []
    const numNodes = 15

    // Initialize nodes
    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      })
    }

    const animate = () => {
      ctx.fillStyle = "#0d1117"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Update position
        node.x += node.vx
        node.y += node.vy

        // Bounce off walls
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        // Draw connections
        nodes.forEach((other, j) => {
          if (i === j) return
          const dx = other.x - node.x
          const dy = other.y - node.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 80) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(0, 255, 65, ${1 - dist / 80})`
            ctx.lineWidth = 0.5
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(other.x, other.y)
            ctx.stroke()
          }
        })

        // Draw node
        ctx.beginPath()
        ctx.fillStyle = "#00ff41"
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2)
        ctx.fill()

        // Glow effect
        ctx.beginPath()
        ctx.fillStyle = "rgba(0, 255, 65, 0.2)"
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <div className="relative border border-[#00ff4133] bg-[#0d1117] p-4">
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00ff41]" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00ff41]" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ff41]" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ff41]" />

      <div className="flex items-center justify-between mb-3 text-xs">
        <span className="text-[#4a9f5a]">// Network Topology</span>
        <span className="text-[#00ff41]">NODES: 15</span>
      </div>
      
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={150}
        className="w-full h-auto bg-[#0a0a0a] border border-[#00ff4133]"
      />
      
      <div className="flex items-center justify-between mt-3 text-[10px] text-[#4a9f5a]">
        <span>LATENCY: 12ms</span>
        <span>PACKETS: 1.2K/s</span>
        <span>STATUS: ACTIVE</span>
      </div>
    </div>
  )
}

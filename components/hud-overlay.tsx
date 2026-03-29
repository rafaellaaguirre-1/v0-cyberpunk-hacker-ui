"use client"

import { useState, useEffect } from "react"

export function HudOverlay() {
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Top left HUD */}
      <div className="absolute top-4 left-4 text-[10px] text-[#4a9f5a] space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#00ff41] animate-pulse" />
          <span>SYS_ACTIVE</span>
        </div>
        <div>LAT: 37.7749° N</div>
        <div>LON: 122.4194° W</div>
      </div>

      {/* Top right HUD */}
      <div className="absolute top-4 right-4 text-[10px] text-[#4a9f5a] text-right space-y-1">
        <div>NODE: PRIMARY</div>
        <div>ENCRYPTION: AES-256</div>
        <div>SECURE_CHANNEL: ACTIVE</div>
      </div>

      {/* Bottom left HUD */}
      <div className="absolute bottom-4 left-4 text-[10px] text-[#4a9f5a]">
        <div>CURSOR: X:{coords.x} Y:{coords.y}</div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-16 h-1 bg-[#1a1a2e]">
            <div className="w-3/4 h-full bg-[#00ff41]" />
          </div>
          <span>BUFFER: 75%</span>
        </div>
      </div>

      {/* Bottom right HUD */}
      <div className="absolute bottom-4 right-4 text-[10px] text-[#4a9f5a] text-right">
        <div>PROTOCOL: v2.4.1</div>
        <div>BUILD: 2026.03.29</div>
      </div>

      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-16 h-16">
        <div className="absolute top-2 left-2 w-8 h-px bg-[#00ff4150]" />
        <div className="absolute top-2 left-2 w-px h-8 bg-[#00ff4150]" />
      </div>
      <div className="absolute top-0 right-0 w-16 h-16">
        <div className="absolute top-2 right-2 w-8 h-px bg-[#00ff4150]" />
        <div className="absolute top-2 right-2 w-px h-8 bg-[#00ff4150]" />
      </div>
      <div className="absolute bottom-0 left-0 w-16 h-16">
        <div className="absolute bottom-2 left-2 w-8 h-px bg-[#00ff4150]" />
        <div className="absolute bottom-2 left-2 w-px h-8 bg-[#00ff4150]" />
      </div>
      <div className="absolute bottom-0 right-0 w-16 h-16">
        <div className="absolute bottom-2 right-2 w-8 h-px bg-[#00ff4150]" />
        <div className="absolute bottom-2 right-2 w-px h-8 bg-[#00ff4150]" />
      </div>

      {/* Decorative grid lines */}
      <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00ff4110] to-transparent" />
      <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00ff4110] to-transparent" />
      <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#00ff4110] to-transparent" />
      <div className="absolute right-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#00ff4110] to-transparent" />
    </div>
  )
}

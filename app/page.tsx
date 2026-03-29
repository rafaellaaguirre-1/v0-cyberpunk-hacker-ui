"use client"

import { useState, useEffect } from "react"
import { HeroSection } from "@/components/hero-section"
import { FingerprintScanner } from "@/components/fingerprint-scanner"
import { TerminalPanel } from "@/components/terminal-panel"
import { NetworkGraph } from "@/components/network-graph"
import { SystemStatus } from "@/components/system-status"
import { DataStream } from "@/components/data-stream"
import { HudOverlay } from "@/components/hud-overlay"

export default function CyberpunkUI() {
  const [bootComplete, setBootComplete] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setBootComplete(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (bootComplete) {
      const interval = setInterval(() => {
        setScanProgress((prev) => (prev >= 100 ? 0 : prev + 1))
      }, 100)
      return () => clearInterval(interval)
    }
  }, [bootComplete])

  if (!bootComplete) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,65,0.03)_50%)] bg-[length:100%_4px] pointer-events-none" />
        <div className="text-center space-y-4">
          <div className="text-[#00ff41] text-2xl font-mono neon-text animate-pulse">
            INITIALIZING SYSTEM...
          </div>
          <div className="w-64 h-1 bg-[#1a1a2e] overflow-hidden">
            <div className="h-full bg-[#00ff41] animate-pulse" style={{ width: "60%" }} />
          </div>
          <div className="text-[#4a9f5a] text-sm font-mono">
            &gt; Loading kernel modules...
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      <HudOverlay />
      
      <div className="relative z-10 p-4 lg:p-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-6 pb-4 border-b border-[#00ff4133]">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-[#00ff41] animate-pulse-glow" />
            <h1 className="text-xl lg:text-2xl font-[family-name:var(--font-display)] tracking-wider neon-text">
              NEXUS<span className="text-[#4a9f5a]">//</span>TERMINAL
            </h1>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <span className="text-[#4a9f5a]">&lt;STATUS: ONLINE/&gt;</span>
            <span className="text-[#00ff41]">NODE_ID: 0x7F3A</span>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-[#00d4aa]" />
              <div className="w-2 h-2 rounded-full bg-[#4a9f5a]" />
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {/* Left Panel - Hero & Portfolio */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <HeroSection />
            <TerminalPanel />
          </div>

          {/* Center Panel - Fingerprint Scanner */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <FingerprintScanner progress={scanProgress} />
            <NetworkGraph />
          </div>

          {/* Right Panel - System Status & Data */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <SystemStatus />
            <DataStream />
          </div>
        </div>
      </div>
    </main>
  )
}

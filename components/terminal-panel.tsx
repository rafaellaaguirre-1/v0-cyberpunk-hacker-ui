"use client"

import { useState, useEffect } from "react"

const portfolioItems = [
  {
    title: "NEURAL.IO",
    description: "AI-powered neural interface platform for accelerated data processing.",
    role: "LEAD DEVELOPER"
  },
  {
    title: "CIPHER_NET",
    description: "Decentralized encryption network for secure communications.",
    role: "ARCHITECT"
  },
  {
    title: "QUANTUM_LINK",
    description: "Quantum computing integration for enterprise systems.",
    role: "CONSULTANT"
  }
]

export function TerminalPanel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [terminalLines, setTerminalLines] = useState<string[]>([])

  useEffect(() => {
    const lines = [
      "> Initializing portfolio module...",
      "> Loading project data...",
      "> Rendering interface...",
      "> READY"
    ]
    
    lines.forEach((line, index) => {
      setTimeout(() => {
        setTerminalLines(prev => [...prev, line])
      }, index * 500)
    })
  }, [])

  return (
    <div className="relative border border-[#00ff4133] bg-[#0d1117] p-6">
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00ff41]" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00ff41]" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ff41]" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ff41]" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-[family-name:var(--font-display)] tracking-wider">
            My Portfolio
          </h3>
          <div className="text-[#4a9f5a] text-xs">&lt;/&gt;</div>
        </div>

        {/* Terminal output */}
        <div className="bg-[#0a0a0a] border border-[#00ff4133] p-3 text-xs space-y-1 h-20 overflow-hidden">
          {terminalLines.map((line, index) => (
            <div key={index} className="text-[#4a9f5a]">
              {line}
            </div>
          ))}
        </div>

        {/* Portfolio items */}
        <div className="space-y-3">
          {portfolioItems.map((item, index) => (
            <div 
              key={index}
              className={`p-3 border cursor-pointer transition-all duration-300 ${
                activeIndex === index 
                  ? "border-[#00ff41] bg-[#00ff4110] neon-border" 
                  : "border-[#00ff4133] hover:border-[#00ff4180]"
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[#00ff41] font-[family-name:var(--font-display)] text-sm">
                  {item.title}
                </h4>
                <span className="text-[10px] text-[#4a9f5a]">{item.role}</span>
              </div>
              <p className="text-xs text-[#4a9f5a] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Decorative elements */}
        <div className="flex items-center gap-2 pt-2">
          <div className="w-2 h-2 bg-[#00ff41]" />
          <div className="flex-1 h-px bg-gradient-to-r from-[#00ff41] to-transparent" />
          <span className="text-[10px] text-[#4a9f5a]">EOF</span>
        </div>
      </div>
    </div>
  )
}

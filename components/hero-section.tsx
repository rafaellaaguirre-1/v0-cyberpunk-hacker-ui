"use client"

import { useState, useEffect } from "react"

export function HeroSection() {
  const [typedText, setTypedText] = useState("")
  const fullText = "CYBER_NEXUS"

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 150)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative border border-[#00ff4133] bg-[#0d1117] p-6">
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00ff41]" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00ff41]" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ff41]" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ff41]" />

      <div className="space-y-4">
        <div className="text-[#4a9f5a] text-xs">
          //01. &lt;Home/&gt;
        </div>
        
        <div className="text-[#4a9f5a] text-sm">
          &lt;p&gt;This is&lt;/p&gt;
        </div>

        <h2 className="text-4xl lg:text-5xl font-[family-name:var(--font-display)] tracking-wider neon-text leading-tight">
          {typedText}
          <span className="animate-pulse">_</span>
        </h2>

        <div className="text-[#4a9f5a] text-sm">
          &lt;p&gt;Neural Interface Developer&lt;/p&gt;
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button className="px-4 py-2 border border-[#00ff41] text-[#00ff41] text-sm hover:bg-[#00ff41] hover:text-[#0a0a0a] transition-all duration-300 neon-border">
            &lt;/&gt; DOWNLOAD CV
          </button>
          <div className="text-[#4a9f5a] text-xs">
            &lt;/&gt;
          </div>
        </div>

        {/* Decorative line */}
        <div className="flex items-center gap-2 pt-4">
          <div className="w-8 h-px bg-[#00ff41]" />
          <div className="w-2 h-2 border border-[#00ff41] rotate-45" />
          <div className="flex-1 h-px bg-[#00ff4133]" />
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-2 text-xs text-[#4a9f5a] pt-2">
          <div className="hover:text-[#00ff41] cursor-pointer">//01. &lt;Home/&gt;</div>
          <div className="hover:text-[#00ff41] cursor-pointer">//03. &lt;Press/&gt;</div>
          <div className="hover:text-[#00ff41] cursor-pointer">//02. &lt;Portfolio/&gt;</div>
          <div className="hover:text-[#00ff41] cursor-pointer">//04. &lt;Contact/&gt;</div>
        </div>
      </div>
    </div>
  )
}

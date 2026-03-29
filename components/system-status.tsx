"use client"

import { useState, useEffect } from "react"

const pressItems = [
  { name: "California Herald", date: "June 23, 2026", active: true },
  { name: "Yahoo! Finance", date: "May 15, 2026", active: false },
  { name: "Medium", date: "April 8, 2026", active: false },
  { name: "Thrive Global", date: "March 20, 2026", active: false }
]

const socialLinks = [
  { name: "LinkedIn", icon: "in" },
  { name: "Instagram", icon: "ig" },
  { name: "Gmail", icon: "@" },
  { name: "Twitter", icon: "X" }
]

export function SystemStatus() {
  const [time, setTime] = useState("00:00:00")
  const [activePress, setActivePress] = useState(0)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString("en-US", { hour12: false }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative border border-[#00ff4133] bg-[#0d1117] p-6">
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00ff41]" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00ff41]" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ff41]" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ff41]" />

      <div className="space-y-6">
        {/* Time Display */}
        <div className="text-center">
          <div className="text-[#4a9f5a] text-xs mb-2">// TIME</div>
          <div className="text-3xl font-[family-name:var(--font-display)] tracking-widest neon-text">
            {time}
          </div>
        </div>

        {/* Press Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-[family-name:var(--font-display)] tracking-wider">
              My Press
            </h3>
            <div className="w-8 h-px bg-[#00ff41]" />
          </div>

          {pressItems.map((item, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between p-3 border cursor-pointer transition-all ${
                activePress === index 
                  ? "border-[#00ff41] bg-[#00ff4110]" 
                  : "border-[#00ff4133] hover:border-[#00ff4180]"
              }`}
              onClick={() => setActivePress(index)}
            >
              <div>
                <div className="text-[#00ff41] text-sm">{item.name}</div>
                <div className="text-[#4a9f5a] text-xs">{item.date}</div>
              </div>
              <div className="text-[#00ff41]">→</div>
            </div>
          ))}
        </div>

        {/* Connect Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-[family-name:var(--font-display)] tracking-wider text-center">
            Connect with me
          </h3>

          <div className="flex justify-center gap-4">
            {socialLinks.map((link, index) => (
              <div 
                key={index}
                className="group relative w-12 h-12 flex items-center justify-center cursor-pointer"
              >
                {/* Outer ring */}
                <div className="absolute inset-0 border border-[#00ff4150] rounded-full group-hover:border-[#00ff41] transition-colors" />
                
                {/* Inner content */}
                <div className="text-center">
                  <div className="text-[10px] text-[#4a9f5a]">&lt;&gt;</div>
                  <div className="text-xs text-[#00ff41] group-hover:neon-text transition-all">
                    {link.name.slice(0, 4)}
                  </div>
                  <div className="text-[10px] text-[#4a9f5a]">&lt;/&gt;</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

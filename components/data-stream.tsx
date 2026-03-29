"use client"

import { useState, useEffect } from "react"

const generateHex = () => {
  return Array.from({ length: 8 }, () => 
    Math.floor(Math.random() * 16).toString(16).toUpperCase()
  ).join("")
}

const systemMetrics = [
  { label: "CPU USAGE", value: 47, max: 100 },
  { label: "MEMORY", value: 68, max: 100 },
  { label: "NETWORK", value: 23, max: 100 },
  { label: "DISK I/O", value: 12, max: 100 }
]

export function DataStream() {
  const [hexData, setHexData] = useState<string[]>([])
  const [metrics, setMetrics] = useState(systemMetrics)

  useEffect(() => {
    // Generate initial hex data
    setHexData(Array.from({ length: 6 }, generateHex))

    // Update hex data periodically
    const hexInterval = setInterval(() => {
      setHexData(prev => {
        const newData = [...prev.slice(1), generateHex()]
        return newData
      })
    }, 500)

    // Update metrics periodically
    const metricsInterval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(5, Math.min(95, metric.value + (Math.random() - 0.5) * 10))
      })))
    }, 2000)

    return () => {
      clearInterval(hexInterval)
      clearInterval(metricsInterval)
    }
  }, [])

  return (
    <div className="relative border border-[#00ff4133] bg-[#0d1117] p-6">
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00ff41]" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00ff41]" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ff41]" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ff41]" />

      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#4a9f5a]">// System Monitor</span>
          <span className="text-[#00ff41] animate-pulse">● LIVE</span>
        </div>

        {/* Hex data stream */}
        <div className="bg-[#0a0a0a] border border-[#00ff4133] p-3 font-mono text-xs space-y-1 overflow-hidden">
          {hexData.map((hex, index) => (
            <div 
              key={index} 
              className="text-[#00ff41] opacity-100"
              style={{ opacity: 0.3 + (index * 0.12) }}
            >
              0x{hex} :: {Math.random() > 0.5 ? "READ" : "WRITE"} :: {Math.floor(Math.random() * 1024)}KB
            </div>
          ))}
        </div>

        {/* System metrics */}
        <div className="space-y-3">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#4a9f5a]">{metric.label}</span>
                <span className="text-[#00ff41]">{Math.round(metric.value)}%</span>
              </div>
              <div className="h-1 bg-[#1a1a2e] overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    metric.value > 80 ? "bg-[#ff0040]" :
                    metric.value > 60 ? "bg-[#ffaa00]" :
                    "bg-[#00ff41]"
                  }`}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer stats */}
        <div className="flex items-center justify-between text-[10px] text-[#4a9f5a] pt-2 border-t border-[#00ff4133]">
          <span>UPTIME: 47:23:12</span>
          <span>TEMP: 42°C</span>
          <span>LOAD: 2.4</span>
        </div>
      </div>
    </div>
  )
}

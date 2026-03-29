"use client"

import { useState, useEffect } from "react"

interface CountdownTimerProps {
  targetDate: Date
}

function CountdownDisplay({ targetDate }: CountdownTimerProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getTimeRemaining = () => {
    const now = currentTime.getTime()
    const total = targetDate.getTime() - now
    
    if (total <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
    }
    
    return {
      days: Math.floor(total / (1000 * 60 * 60 * 24)),
      hours: Math.floor((total / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((total / 1000 / 60) % 60),
      seconds: Math.floor((total / 1000) % 60),
      expired: false
    }
  }

  const timeRemaining = getTimeRemaining()

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {[
          { label: "DÍAS", value: timeRemaining.days },
          { label: "HORAS", value: timeRemaining.hours },
          { label: "MIN", value: timeRemaining.minutes },
          { label: "SEG", value: timeRemaining.seconds },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div className="border border-[#00ff4150] bg-[#0a0a0a] px-4 py-2 min-w-[70px]">
              <div className="text-2xl md:text-3xl font-bold text-[#00ff41] neon-text font-mono">
                {String(item.value).padStart(2, "0")}
              </div>
            </div>
            <div className="text-[8px] text-[#4a9f5a] mt-1 tracking-widest">{item.label}</div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-4 text-xs text-[#4a9f5a]">
        <span className="text-[#00ff4150]">{'<time>'}</span>
        {currentTime.toLocaleString("es-CL", {
          dateStyle: "full",
          timeStyle: "medium"
        })}
        <span className="text-[#00ff4150]">{'</time>'}</span>
      </div>
    </>
  )
}

function CountdownPlaceholder() {
  return (
    <>
      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {["DÍAS", "HORAS", "MIN", "SEG"].map((label) => (
          <div key={label} className="text-center">
            <div className="border border-[#00ff4150] bg-[#0a0a0a] px-4 py-2 min-w-[70px]">
              <div className="text-2xl md:text-3xl font-bold text-[#00ff41] neon-text font-mono">
                --
              </div>
            </div>
            <div className="text-[8px] text-[#4a9f5a] mt-1 tracking-widest">{label}</div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-4 text-xs text-[#4a9f5a]">
        <span className="text-[#00ff4150]">{'<time>'}</span>
        Cargando...
        <span className="text-[#00ff4150]">{'</time>'}</span>
      </div>
    </>
  )
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <CountdownPlaceholder />
  }

  return <CountdownDisplay targetDate={targetDate} />
}

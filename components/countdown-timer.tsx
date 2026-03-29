"use client"

import { useState, useEffect } from "react"

export default function CountdownTimer() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  const getTimeRemaining = () => {
    if (!isMounted || !currentTime) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: false }
    }
    const targetDate = new Date("2026-04-17T23:59:59")
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
      expired: false,
    }
  }

  const timeRemaining = getTimeRemaining()

  useEffect(() => {
    setCurrentTime(new Date())
    setIsMounted(true)
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="mb-8">
      <div className="border border-[#00ff4133] bg-[#0d1117] p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-[#00ff41] animate-pulse" />
          <span className="text-[10px] text-[#4a9f5a] tracking-widest">TIEMPO_RESTANTE</span>
        </div>

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
                  {isMounted ? String(item.value).padStart(2, "0") : "--"}
                </div>
              </div>
              <div className="text-[8px] text-[#4a9f5a] mt-1 tracking-widest">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="text-center mt-4 text-xs text-[#4a9f5a]">
          <span className="text-[#00ff4150]">{"<time>"}</span>
          {isMounted && currentTime
            ? currentTime.toLocaleString("es-CL", {
                dateStyle: "full",
                timeStyle: "medium",
              })
            : "Cargando..."}
          <span className="text-[#00ff4150]">{"</time>"}</span>
        </div>

        <div className="text-center mt-2 text-[10px] text-[#4a9f5a]">
          Período de inscripción: 01 Abril - 17 Abril, 2026
        </div>
      </div>
    </section>
  )
}

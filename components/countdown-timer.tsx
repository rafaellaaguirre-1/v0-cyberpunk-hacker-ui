"use client"

import { useState, useEffect } from "react"

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
}

export default function CountdownTimer() {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null)
  const [currentTime, setCurrentTime] = useState<string>("")

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date()
      const targetDate = new Date("2026-04-17T23:59:59")
      const total = targetDate.getTime() - now.getTime()

      if (total <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true })
      } else {
        setTimeRemaining({
          days: Math.floor(total / (1000 * 60 * 60 * 24)),
          hours: Math.floor((total / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((total / 1000 / 60) % 60),
          seconds: Math.floor((total / 1000) % 60),
          expired: false,
        })
      }

      setCurrentTime(now.toLocaleString("es-CL", {
        dateStyle: "full",
        timeStyle: "medium",
      }))
    }

    calculateTime()
    const timer = setInterval(calculateTime, 1000)
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
            { label: "DÍAS", value: timeRemaining?.days ?? 0 },
            { label: "HORAS", value: timeRemaining?.hours ?? 0 },
            { label: "MIN", value: timeRemaining?.minutes ?? 0 },
            { label: "SEG", value: timeRemaining?.seconds ?? 0 },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="border border-[#00ff4150] bg-[#0a0a0a] px-4 py-2 min-w-[70px]">
                <div className="text-2xl md:text-3xl font-bold text-[#00ff41] neon-text font-mono">
                  {timeRemaining ? String(item.value).padStart(2, "0") : "--"}
                </div>
              </div>
              <div className="text-[8px] text-[#4a9f5a] mt-1 tracking-widest">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="text-center mt-4 text-xs text-[#4a9f5a]">
          <span className="text-[#00ff4150]">{"<time>"}</span>
          {currentTime || "Cargando..."}
          <span className="text-[#00ff4150]">{"</time>"}</span>
        </div>

        <div className="text-center mt-2 text-[10px] text-[#4a9f5a]">
          Período de inscripción: 01 Abril - 17 Abril, 2026
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState, useEffect } from "react"

interface CountdownTimerProps {
  targetDate: Date
}

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
}

function calculateTimeRemaining(target: Date): TimeRemaining {
  const now = Date.now()
  const total = target.getTime() - now

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

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [mounted, setMounted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  })

  useEffect(() => {
    setMounted(true)
    setTimeRemaining(calculateTimeRemaining(targetDate))

    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(targetDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const timeUnits = [
    { label: "DIAS", value: timeRemaining.days },
    { label: "HORAS", value: timeRemaining.hours },
    { label: "MIN", value: timeRemaining.minutes },
    { label: "SEG", value: timeRemaining.seconds },
  ]

  return (
    <div className="text-center space-y-4">
      <div className="text-xs text-[#4a9f5a] tracking-widest">
        <span className="text-[#00ff4150]">{"// "}</span>
        TIEMPO RESTANTE PARA INSCRIPCION
      </div>

      <div className="flex flex-wrap justify-center gap-4 md:gap-8" suppressHydrationWarning>
        {timeUnits.map((item) => (
          <div key={item.label} className="text-center">
            <div className="border border-[#00ff4150] bg-[#0a0a0a] px-4 py-2 min-w-[70px]">
              <div
                className="text-2xl md:text-3xl font-bold text-[#00ff41] neon-text font-mono"
                suppressHydrationWarning
              >
                {mounted ? String(item.value).padStart(2, "0") : "--"}
              </div>
            </div>
            <div className="text-[8px] text-[#4a9f5a] mt-1 tracking-widest">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {timeRemaining.expired && (
        <div className="text-[#ff0040] text-sm animate-pulse">
          PERIODO DE INSCRIPCION FINALIZADO
        </div>
      )}
    </div>
  )
}

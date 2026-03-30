"use client"

import { useEffect } from "react"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import type { NotificationType } from "@/types"

interface NotificationProps {
  type: NotificationType
  message: string
  onClose: () => void
  duration?: number
}

const notificationConfig: Record<NotificationType, { icon: typeof CheckCircle; color: string; bgColor: string }> = {
  success: {
    icon: CheckCircle,
    color: "text-[#00ff41]",
    bgColor: "bg-[#00ff4120] border-[#00ff4150]",
  },
  error: {
    icon: AlertCircle,
    color: "text-[#ff0040]",
    bgColor: "bg-[#ff004020] border-[#ff004050]",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-[#ffcc00]",
    bgColor: "bg-[#ffcc0020] border-[#ffcc0050]",
  },
  info: {
    icon: Info,
    color: "text-[#00ccff]",
    bgColor: "bg-[#00ccff20] border-[#00ccff50]",
  },
}

export function Notification({ type, message, onClose, duration = 5000 }: NotificationProps) {
  const config = notificationConfig[type]
  const Icon = config.icon

  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 border ${config.bgColor} shadow-lg animate-in slide-in-from-right`}
      role="alert"
    >
      <Icon className={`w-5 h-5 ${config.color}`} />
      <span className="text-sm font-mono text-[#e0e0e0]">{message}</span>
      <button
        onClick={onClose}
        className="p-1 hover:bg-[#ffffff10] transition-colors"
        aria-label="Cerrar notificacion"
      >
        <X className="w-4 h-4 text-[#808080]" />
      </button>
    </div>
  )
}

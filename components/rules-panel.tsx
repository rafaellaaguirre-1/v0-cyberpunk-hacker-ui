"use client"

import { AlertTriangle } from "lucide-react"

export function RulesPanel() {
  const rules = [
    { icon: "[!]", text: "Mínimo 3 integrantes requeridos (Presidente, Vicepresidente, Secretario)" },
    { icon: "[!]", text: "Máximo 7 integrantes en total" },
    { icon: "[!]", text: "Los roles adicionales deben especificar su función" },
    { icon: "[!]", text: "Deben ser estudiantes regulares sin restricciones académicas" },
  ]

  return (
    <div className="border border-[#ff0040] bg-[#ff004008] p-4 animate-red-flicker relative overflow-hidden">
      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ff004010] to-transparent h-[2px] animate-scan-line" />
      </div>

      <div className="flex items-center gap-2 text-[#ff0040] mb-4">
        <AlertTriangle className="w-5 h-5 animate-pulse" />
        <span className="text-sm font-mono tracking-wider font-bold">REGLAMENTO</span>
      </div>
      
      <ul className="space-y-3 text-sm">
        {rules.map((rule, index) => (
          <li key={index} className="flex items-start gap-2 text-[#ff6680]">
            <span className="text-[#ff0040] font-mono font-bold">{rule.icon}</span>
            <span>{rule.text}</span>
          </li>
        ))}
      </ul>

      {/* Warning notice */}
      <div className="mt-4 pt-4 border-t border-[#ff004030]">
        <p className="text-[#ffaa00] text-sm flex items-center gap-2">
          <span className="text-lg">⚠️</span>
          <span>Las listas oficiales serán publicadas después del 21 de Abril, 2026</span>
        </p>
      </div>
    </div>
  )
}

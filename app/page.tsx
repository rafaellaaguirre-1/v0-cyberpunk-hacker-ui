"use client"

import { useState, useEffect } from "react"
import { HudOverlay } from "@/components/hud-overlay"
import { CyberInput } from "@/components/cyber-input"
import { Plus, Trash2, Send, AlertTriangle, Instagram } from "lucide-react"

interface AdditionalMember {
  id: string
  position: string
  rut: string
  email: string
}

export default function RegistrationPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [additionalMembers, setAdditionalMembers] = useState<AdditionalMember[]>([])
  
  const [formData, setFormData] = useState({
    presidente: { nombre: "", rut: "", email: "" },
    vicepresidente: { nombre: "", rut: "", email: "" },
    secretario: { nombre: "", rut: "", email: "" },
  })

  const targetDate = new Date("2026-04-17T23:59:59")
  
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const addMember = () => {
    if (additionalMembers.length < 4) {
      setAdditionalMembers([
        ...additionalMembers,
        { id: crypto.randomUUID(), position: "", rut: "", email: "" }
      ])
    }
  }

  const removeMember = (id: string) => {
    setAdditionalMembers(additionalMembers.filter(m => m.id !== id))
  }

  const updateMember = (id: string, field: keyof AdditionalMember, value: string) => {
    setAdditionalMembers(
      additionalMembers.map(m => m.id === id ? { ...m, [field]: value } : m)
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", { formData, additionalMembers })
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] relative overflow-x-hidden">
      <HudOverlay />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <header className="mb-8">
          <div className="border border-[#00ff4133] bg-[#0d1117] p-6 relative">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00ff41]" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00ff41]" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ff41]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ff41]" />
            
            <div className="text-center space-y-2">
              <div className="text-[10px] text-[#4a9f5a] tracking-[0.3em]">{'// SISTEMA DE REGISTRO //'}</div>
              <h1 className="text-xl md:text-2xl font-bold text-[#00ff41] neon-text tracking-wide">
                Universidad Católica Silva Henríquez
              </h1>
              <h2 className="text-sm md:text-base text-[#00d4aa]">
                Ingeniería Civil en Computación e Informática
              </h2>
              <a 
                href="https://instagram.com/tricel.icci.2026" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-[#4a9f5a] hover:text-[#00ff41] transition-colors mt-2"
              >
                <Instagram size={14} />
                <span>@tricel.icci.2026</span>
                <span className="text-[#00ff4150]">{'// más detalles'}</span>
              </a>
            </div>
          </div>
        </header>

        {/* Countdown Timer */}
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
            
            <div className="text-center mt-2 text-[10px] text-[#4a9f5a]">
              Período de inscripción: 01 Abril - 17 Abril, 2026
            </div>
          </div>
        </section>

        {/* Main Form */}
        <form onSubmit={handleSubmit}>
          {/* Form Title */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#00ff4150] to-transparent" />
            <h2 className="text-lg text-[#00ff41] tracking-wider">
              {'<'} INSCRIPCIÓN DE CANDIDATURAS {'/>'} 
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#00ff4150] to-transparent" />
          </div>

          {/* Required Members Sections */}
          {[
            { key: "presidente", title: "PRESIDENTE/A", required: true },
            { key: "vicepresidente", title: "VICEPRESIDENTE/A", required: true },
            { key: "secretario", title: "SECRETARIO/A", required: true },
          ].map((section) => (
            <section key={section.key} className="mb-6">
              <div className="border border-[#00ff4133] bg-[#0d1117] relative">
                <div className="border-b border-[#00ff4133] px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-[#00ff41]" />
                    <span className="text-sm text-[#00ff41] tracking-wider">{section.title}</span>
                    {section.required && (
                      <span className="text-[8px] text-[#ff0040] border border-[#ff004050] px-1">REQUERIDO</span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#4a9f5a]">{'// módulo_' + section.key}</div>
                </div>
                
                <div className="p-4 grid gap-4">
                  <CyberInput
                    label="Nombre y Apellido"
                    placeholder="Ingrese nombre completo"
                    value={formData[section.key as keyof typeof formData].nombre}
                    onChange={(e) => setFormData({
                      ...formData,
                      [section.key]: { ...formData[section.key as keyof typeof formData], nombre: e.target.value }
                    })}
                    required
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <CyberInput
                      label="RUT"
                      placeholder="12.345.678-9"
                      value={formData[section.key as keyof typeof formData].rut}
                      onChange={(e) => setFormData({
                        ...formData,
                        [section.key]: { ...formData[section.key as keyof typeof formData], rut: e.target.value }
                      })}
                      required
                    />
                    <CyberInput
                      label="Correo Institucional"
                      type="email"
                      placeholder="usuario@ucsh.cl"
                      value={formData[section.key as keyof typeof formData].email}
                      onChange={(e) => setFormData({
                        ...formData,
                        [section.key]: { ...formData[section.key as keyof typeof formData], email: e.target.value }
                      })}
                      required
                    />
                  </div>
                </div>
              </div>
            </section>
          ))}

          {/* Additional Members Section */}
          <section className="mb-6">
            <div className="border border-[#00ff4133] bg-[#0d1117]">
              <div className="border-b border-[#00ff4133] px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-[#00d4aa]" />
                  <span className="text-sm text-[#00d4aa] tracking-wider">INTEGRANTES ADICIONALES</span>
                  <span className="text-[8px] text-[#4a9f5a] border border-[#4a9f5a50] px-1">OPCIONAL</span>
                </div>
                <div className="text-[10px] text-[#4a9f5a]">
                  {additionalMembers.length}/4 slots
                </div>
              </div>
              
              <div className="p-4">
                {additionalMembers.map((member, index) => (
                  <div key={member.id} className="mb-4 last:mb-0 border border-[#00ff4120] p-4 relative">
                    <div className="absolute top-2 right-2">
                      <button
                        type="button"
                        onClick={() => removeMember(member.id)}
                        className="text-[#ff0040] hover:text-[#ff0040] hover:bg-[#ff004020] p-1 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    
                    <div className="text-[10px] text-[#4a9f5a] mb-3">
                      {'// integrante_adicional_' + (index + 1)}
                    </div>
                    
                    <div className="grid gap-4">
                      <CyberInput
                        label="Posición / Rol"
                        placeholder="Ej: Tesorero, Vocal, etc."
                        value={member.position}
                        onChange={(e) => updateMember(member.id, "position", e.target.value)}
                      />
                      <div className="grid md:grid-cols-2 gap-4">
                        <CyberInput
                          label="RUT"
                          placeholder="12.345.678-9"
                          value={member.rut}
                          onChange={(e) => updateMember(member.id, "rut", e.target.value)}
                        />
                        <CyberInput
                          label="Correo Institucional"
                          type="email"
                          placeholder="usuario@ucsh.cl"
                          value={member.email}
                          onChange={(e) => updateMember(member.id, "email", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {additionalMembers.length < 4 && (
                  <button
                    type="button"
                    onClick={addMember}
                    className="w-full border border-dashed border-[#00ff4150] py-3 flex items-center justify-center gap-2 text-[#00ff41] text-sm hover:bg-[#00ff4110] hover:border-[#00ff41] transition-all group"
                  >
                    <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                    <span>Agregar Integrante</span>
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Rules Panel */}
          <section className="mb-8">
            <div className="border border-[#ffaa0050] bg-[#0d1117] relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ffaa00] via-[#ffaa0050] to-transparent" />
              
              <div className="border-b border-[#ffaa0030] px-4 py-2 flex items-center gap-2">
                <AlertTriangle size={14} className="text-[#ffaa00]" />
                <span className="text-sm text-[#ffaa00] tracking-wider">REGLAS Y REQUISITOS</span>
                <span className="text-[10px] text-[#4a9f5a] ml-auto">{'// sys_notice'}</span>
              </div>
              
              <div className="p-4 text-xs text-[#4a9f5a] space-y-2 font-mono">
                <div className="flex items-start gap-2">
                  <span className="text-[#00ff41]">{'>'}</span>
                  <span>Mínimo 3 integrantes requeridos (Presidente, Vicepresidente, Secretario)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00ff41]">{'>'}</span>
                  <span>Máximo 7 integrantes en total</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00ff41]">{'>'}</span>
                  <span>Los roles adicionales deben especificar su función</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00ff41]">{'>'}</span>
                  <span>Deben ser estudiantes regulares sin restricciones académicas</span>
                </div>
                <div className="flex items-start gap-2 pt-2 border-t border-[#ffaa0020]">
                  <span className="text-[#ffaa00]">{'!'}</span>
                  <span className="text-[#ffaa00]">Las listas oficiales serán publicadas después del 21 de Abril, 2026</span>
                </div>
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="relative group px-12 py-4 bg-transparent border-2 border-[#00ff41] text-[#00ff41] tracking-widest text-sm hover:bg-[#00ff41] hover:text-[#0a0a0a] transition-all duration-300 animate-pulse-glow"
            >
              <div className="absolute inset-0 bg-[#00ff41] opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-3">
                <Send size={16} />
                INITIATE REGISTRATION
              </span>
            </button>
            
            <p className="mt-4 text-[10px] text-[#ff0040]">
              * Campos obligatorios
            </p>
          </div>
        </form>

        {/* Footer decoration */}
        <footer className="mt-12 text-center">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#00ff4130] to-transparent mb-4" />
          <div className="text-[10px] text-[#4a9f5a] space-y-1">
            <div>{'// TRICEL ICCI 2026 //'}</div>
            <div className="text-[#00ff4150]">Sistema de Inscripción v1.0.0</div>
          </div>
        </footer>
      </div>
    </main>
  )
}

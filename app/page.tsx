"use client"

// EmailJS is loaded dynamically to avoid SSR issues
import { useState, useEffect, useCallback, useRef } from "react"
import { HudOverlay } from "@/components/hud-overlay"
import { CyberInput } from "@/components/cyber-input"
import { Plus, Trash2, Send, AlertTriangle, Instagram, CheckCircle, XCircle } from "lucide-react"
import { formatRut, validateRut, validateInstitutionalEmail } from "@/lib/rut-utils"

interface AdditionalMember {
  id: string
  nombre: string
  position: string
  rut: string
  email: string
}

interface MemberData {
  nombre: string
  rut: string
  email: string
}

interface FormErrors {
  presidente: { nombre?: string; rut?: string; email?: string }
  vicepresidente: { nombre?: string; rut?: string; email?: string }
  secretario: { nombre?: string; rut?: string; email?: string }
  additionalMembers: { [key: string]: { nombre?: string; position?: string; rut?: string; email?: string } }
}

type NotificationType = 'success' | 'error' | null

export default function RegistrationPage() {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [additionalMembers, setAdditionalMembers] = useState<AdditionalMember[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<{ type: NotificationType; message: string } | null>(null)
  
  const [formData, setFormData] = useState({
    listaNombre: "",
    presidente: { nombre: "", rut: "", email: "" },
    vicepresidente: { nombre: "", rut: "", email: "" },
    secretario: { nombre: "", rut: "", email: "" },
  })

  const [errors, setErrors] = useState<FormErrors>({
    presidente: {},
    vicepresidente: {},
    secretario: {},
    additionalMembers: {}
  })

  const targetDate = new Date("2026-04-17T23:59:59")
  
  const getTimeRemaining = () => {
    if (!currentTime) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: false }
    }
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
    setMounted(true)
    setCurrentTime(new Date())
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  // EmailJS ref for dynamic import
  const emailjsRef = useRef<typeof import('@emailjs/browser') | null>(null)

  // Initialize EmailJS dynamically
  useEffect(() => {
    import('@emailjs/browser').then((module) => {
      emailjsRef.current = module
      module.default.init('tiNAxu8G106cDsoCB')
    })
  }, [])

  const addMember = () => {
    if (additionalMembers.length < 4) {
      setAdditionalMembers([
        ...additionalMembers,
        { id: crypto.randomUUID(), nombre: "", position: "", rut: "", email: "" }
      ])
    }
  }

  const removeMember = (id: string) => {
    setAdditionalMembers(additionalMembers.filter(m => m.id !== id))
    setErrors(prev => {
      const newAdditionalErrors = { ...prev.additionalMembers }
      delete newAdditionalErrors[id]
      return { ...prev, additionalMembers: newAdditionalErrors }
    })
  }

  const updateMember = (id: string, field: keyof AdditionalMember, value: string) => {
    let processedValue = value
    
    if (field === 'rut') {
      processedValue = formatRut(value)
    }
    
    setAdditionalMembers(
      additionalMembers.map(m => m.id === id ? { ...m, [field]: processedValue } : m)
    )
  }

  const handleRutChange = (section: keyof typeof formData, value: string) => {
    const formattedRut = formatRut(value)
    setFormData({
      ...formData,
      [section]: { ...formData[section], rut: formattedRut }
    })
  }

  const validateField = useCallback((section: string, field: string, value: string): string | undefined => {
    if (field === 'nombre' && !value.trim()) {
      return 'Nombre es requerido'
    }
    if (field === 'rut') {
      const result = validateRut(value)
      return result.error
    }
    if (field === 'email') {
      const result = validateInstitutionalEmail(value)
      return result.error
    }
    if (field === 'position' && !value.trim()) {
      return 'Posición es requerida'
    }
    return undefined
  }, [])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      presidente: {},
      vicepresidente: {},
      secretario: {},
      additionalMembers: {}
    }

  let isValid = true

  // Validate list name
  if (!formData.listaNombre.trim()) {
    isValid = false
  }
  
  // Validate required members
  const sections: (keyof typeof formData)[] = ['presidente', 'vicepresidente', 'secretario']
    
    for (const section of sections) {
      const data = formData[section]
      
      const nombreError = validateField(section, 'nombre', data.nombre)
      if (nombreError) {
        newErrors[section].nombre = nombreError
        isValid = false
      }
      
      const rutError = validateField(section, 'rut', data.rut)
      if (rutError) {
        newErrors[section].rut = rutError
        isValid = false
      }
      
      const emailError = validateField(section, 'email', data.email)
      if (emailError) {
        newErrors[section].email = emailError
        isValid = false
      }
    }

    // Validate additional members
    for (const member of additionalMembers) {
      newErrors.additionalMembers[member.id] = {}
      
      if (member.nombre || member.position || member.rut || member.email) {
        const nombreError = validateField('additional', 'nombre', member.nombre)
        if (nombreError) {
          newErrors.additionalMembers[member.id].nombre = nombreError
          isValid = false
        }
        
        const positionError = validateField('additional', 'position', member.position)
        if (positionError) {
          newErrors.additionalMembers[member.id].position = positionError
          isValid = false
        }
        
        const rutError = validateField('additional', 'rut', member.rut)
        if (rutError) {
          newErrors.additionalMembers[member.id].rut = rutError
          isValid = false
        }
        
        const emailError = validateField('additional', 'email', member.email)
        if (emailError) {
          newErrors.additionalMembers[member.id].email = emailError
          isValid = false
        }
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const formatEmailContent = (): string => {
    const now = new Date()
    const fecha = now.toLocaleDateString('es-CL', { dateStyle: 'full' })
    const hora = now.toLocaleTimeString('es-CL', { timeStyle: 'medium' })

    let content = `Se ha inscrito una nueva lista\n\n`
    content += `═══════════════════════════════════════\n\n`
    
    content += `PRESIDENTE/A:\n`
    content += `- Nombre: ${formData.presidente.nombre}\n`
    content += `- RUT: ${formData.presidente.rut}\n`
    content += `- Correo: ${formData.presidente.email}\n\n`
    
    content += `VICEPRESIDENTE/A:\n`
    content += `- Nombre: ${formData.vicepresidente.nombre}\n`
    content += `- RUT: ${formData.vicepresidente.rut}\n`
    content += `- Correo: ${formData.vicepresidente.email}\n\n`
    
    content += `SECRETARIO/A:\n`
    content += `- Nombre: ${formData.secretario.nombre}\n`
    content += `- RUT: ${formData.secretario.rut}\n`
    content += `- Correo: ${formData.secretario.email}\n\n`
    
    if (additionalMembers.length > 0) {
      content += `INTEGRANTES ADICIONALES:\n`
      additionalMembers.forEach((member, index) => {
        if (member.nombre || member.position || member.rut || member.email) {
          content += `\nIntegrante Adicional ${index + 1}:\n`
          content += `- Nombre: ${member.nombre}\n`
          content += `- Rol: ${member.position}\n`
          content += `- RUT: ${member.rut}\n`
          content += `- Correo: ${member.email}\n`
        }
      })
      content += `\n`
    }
    
    content += `═══════════════════════════════════════\n\n`
    content += `Fecha de inscripción: ${fecha}\n`
    content += `Hora: ${hora}\n`

    return content
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setNotification({ type: 'error', message: 'Por favor, corrige los errores antes de enviar' })
      return
    }

    setIsSubmitting(true)

    try {
      const now = new Date()
      const fecha = now.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })
      const hora = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
      
      // Format additional members
      let integrantes_adicionales = ''
      if (additionalMembers.length > 0) {
        additionalMembers.forEach((member, index) => {
          if (member.nombre || member.position || member.rut || member.email) {
            integrantes_adicionales += `Integrante Adicional ${index + 1}:\n`
            integrantes_adicionales += `- Nombre: ${member.nombre}\n`
            integrantes_adicionales += `- Rol: ${member.position}\n`
            integrantes_adicionales += `- RUT: ${member.rut}\n`
            integrantes_adicionales += `- Correo: ${member.email}\n\n`
          }
        })
      } else {
        integrantes_adicionales = 'Sin integrantes adicionales'
      }

      // Create info_completa formatted string
      const info_completa = `
═══════════════════════════════════════
   INSCRIPCIÓN DE CANDIDATURA TRICEL ICCI 2026
═══════════════════════════════════════

NOMBRE DE LISTA: ${formData.listaNombre || 'No especificado'}

PRESIDENTE/A:
- Nombre: ${formData.presidente.nombre}
- RUT: ${formData.presidente.rut}
- Correo: ${formData.presidente.email}

VICEPRESIDENTE/A:
- Nombre: ${formData.vicepresidente.nombre}
- RUT: ${formData.vicepresidente.rut}
- Correo: ${formData.vicepresidente.email}

SECRETARIO/A:
- Nombre: ${formData.secretario.nombre}
- RUT: ${formData.secretario.rut}
- Correo: ${formData.secretario.email}

INTEGRANTES ADICIONALES:
${integrantes_adicionales}

═══════════════════════════════════════
Fecha de inscripción: ${fecha}
Hora: ${hora}
═══════════════════════════════════════
`

      const templateParams = {
        to_email: 'tricel.icc.2026@gmail.com',
        lista_nombre: formData.listaNombre || 'No especificado',
        presidente_nombre: formData.presidente.nombre,
        presidente_rut: formData.presidente.rut,
        presidente_email: formData.presidente.email,
        vice_nombre: formData.vicepresidente.nombre,
        vice_rut: formData.vicepresidente.rut,
        vice_email: formData.vicepresidente.email,
        secretario_nombre: formData.secretario.nombre,
        secretario_rut: formData.secretario.rut,
        secretario_email: formData.secretario.email,
        integrantes_adicionales: integrantes_adicionales,
        fecha: fecha,
        hora: hora,
        info_completa: info_completa,
      }

      if (!emailjsRef.current) {
        throw new Error('EmailJS not initialized')
      }
      
      await emailjsRef.current.default.send(
        'service_8g1h7y2',
        'template_a8wstg2',
        templateParams
      )

      setNotification({ type: 'success', message: 'Candidatura enviada correctamente' })
      
      // Reset form completely - no data reuse between submissions
      setFormData({
        listaNombre: "",
        presidente: { nombre: "", rut: "", email: "" },
        vicepresidente: { nombre: "", rut: "", email: "" },
        secretario: { nombre: "", rut: "", email: "" },
      })
      setAdditionalMembers([])
      setErrors({
        presidente: {},
        vicepresidente: {},
        secretario: {},
        additionalMembers: {}
      })
    } catch (error) {
      console.error('EmailJS error:', error)
      setNotification({ type: 'error', message: 'Error al enviar la candidatura. Por favor, intente nuevamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] relative overflow-x-hidden">
      <HudOverlay />
      
      {/* Corner GIFs */}
      <div className="fixed top-0 left-0 w-24 h-24 md:w-32 md:h-32 z-20 pointer-events-none">
        <img src="https://giffiles.alphacoders.com/360/36005.gif" alt="" className="w-full h-full object-cover opacity-70" />
      </div>
      <div className="fixed top-0 right-0 w-24 h-24 md:w-32 md:h-32 z-20 pointer-events-none">
        <img src="https://giffiles.alphacoders.com/360/36005.gif" alt="" className="w-full h-full object-cover opacity-70 scale-x-[-1]" />
      </div>
      <div className="fixed bottom-0 left-0 w-24 h-24 md:w-32 md:h-32 z-20 pointer-events-none">
        <img src="https://giffiles.alphacoders.com/360/36005.gif" alt="" className="w-full h-full object-cover opacity-70 scale-y-[-1]" />
      </div>
      <div className="fixed bottom-0 right-0 w-24 h-24 md:w-32 md:h-32 z-20 pointer-events-none">
        <img src="https://giffiles.alphacoders.com/360/36005.gif" alt="" className="w-full h-full object-cover opacity-70 scale-[-1]" />
      </div>
      
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-4 border ${
          notification.type === 'success' 
            ? 'bg-[#0d1117] border-[#00ff41] shadow-[0_0_20px_#00ff4180,inset_0_0_20px_#00ff4120]' 
            : 'bg-[#0d1117] border-[#ff0040] shadow-[0_0_20px_#ff004080,inset_0_0_20px_#ff004020]'
        } animate-pulse max-w-md`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? (
              <CheckCircle className="text-[#00ff41]" size={20} />
            ) : (
              <XCircle className="text-[#ff0040]" size={20} />
            )}
            <span className={`text-sm font-mono ${
              notification.type === 'success' ? 'text-[#00ff41]' : 'text-[#ff0040]'
            }`}>
              {notification.message}
            </span>
          </div>
        </div>
      )}
      
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
                { label: "DÍAS", key: "days" },
                { label: "HORAS", key: "hours" },
                { label: "MIN", key: "minutes" },
                { label: "SEG", key: "seconds" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="border border-[#00ff4150] bg-[#0a0a0a] px-4 py-2 min-w-[70px]">
                    <div className="text-2xl md:text-3xl font-bold text-[#00ff41] neon-text font-mono" suppressHydrationWarning>
                      {mounted ? String(timeRemaining[item.key as keyof typeof timeRemaining]).padStart(2, "0") : "--"}
                    </div>
                  </div>
                  <div className="text-[8px] text-[#4a9f5a] mt-1 tracking-widest">{item.label}</div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-4 text-xs text-[#4a9f5a]" suppressHydrationWarning>
              <span className="text-[#00ff4150]">{'<time>'}</span>
              {mounted && currentTime ? currentTime.toLocaleString("es-CL", {
                dateStyle: "full",
                timeStyle: "medium"
              }) : "Cargando..."}
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

          {/* List Name Section */}
          <section className="mb-6">
            <div className="border border-[#00ff4133] bg-[#0d1117] relative">
              <div className="border-b border-[#00ff4133] px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-[#00ff41]" />
                  <span className="text-sm text-[#00ff41] tracking-wider">NOMBRE DE LISTA</span>
                  <span className="text-[8px] text-[#ff0040] border border-[#ff004050] px-1">REQUERIDO</span>
                </div>
                <div className="text-[10px] text-[#4a9f5a]">{'// módulo_lista'}</div>
              </div>
              <div className="p-4">
                <CyberInput
                  label="Nombre de la Lista"
                  placeholder="Ingrese el nombre de su lista"
                  value={formData.listaNombre}
                  onChange={(e) => setFormData({ ...formData, listaNombre: e.target.value })}
                  required
                />
              </div>
            </div>
          </section>

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
                    error={errors[section.key as keyof typeof formData].nombre}
                    required
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <CyberInput
                      label="RUT"
                      placeholder="12.345.678-9"
                      value={formData[section.key as keyof typeof formData].rut}
                      onChange={(e) => handleRutChange(section.key as keyof typeof formData, e.target.value)}
                      error={errors[section.key as keyof typeof formData].rut}
                      required
                    />
                    <CyberInput
                      label="Correo Institucional"
                      type="email"
                      placeholder="usuario@miucsh.cl"
                      value={formData[section.key as keyof typeof formData].email}
                      onChange={(e) => setFormData({
                        ...formData,
                        [section.key]: { ...formData[section.key as keyof typeof formData], email: e.target.value }
                      })}
                      error={errors[section.key as keyof typeof formData].email}
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
                        label="Nombre y Apellido"
                        placeholder="Ingrese nombre completo"
                        value={member.nombre}
                        onChange={(e) => updateMember(member.id, "nombre", e.target.value)}
                        error={errors.additionalMembers[member.id]?.nombre}
                      />
                      <CyberInput
                        label="Posición / Rol"
                        placeholder="Ej: Tesorero, Vocal, etc."
                        value={member.position}
                        onChange={(e) => updateMember(member.id, "position", e.target.value)}
                        error={errors.additionalMembers[member.id]?.position}
                      />
                      <div className="grid md:grid-cols-2 gap-4">
                        <CyberInput
                          label="RUT"
                          placeholder="12.345.678-9"
                          value={member.rut}
                          onChange={(e) => updateMember(member.id, "rut", e.target.value)}
                          error={errors.additionalMembers[member.id]?.rut}
                        />
                        <CyberInput
                          label="Correo Institucional"
                          type="email"
                          placeholder="usuario@miucsh.cl"
                          value={member.email}
                          onChange={(e) => updateMember(member.id, "email", e.target.value)}
                          error={errors.additionalMembers[member.id]?.email}
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

          {/* Rules Panel - RED DANGER STYLE */}
          <section className="mb-8">
            <div className="border border-[#ff0040] bg-[#0d1117] relative overflow-hidden shadow-[0_0_20px_#ff004030,inset_0_0_30px_#ff004010]">
              {/* Animated top border */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff0040] to-transparent animate-pulse" />
              
              {/* Corner glow effects */}
              <div className="absolute top-0 left-0 w-8 h-8 bg-[#ff0040] opacity-20 blur-xl" />
              <div className="absolute top-0 right-0 w-8 h-8 bg-[#ff0040] opacity-20 blur-xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 bg-[#ff0040] opacity-20 blur-xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#ff0040] opacity-20 blur-xl" />
              
              <div className="border-b border-[#ff004050] px-4 py-3 flex items-center gap-2 bg-[#ff004010]">
                <AlertTriangle size={16} className="text-[#ff0040] animate-pulse" />
                <span className="text-sm text-[#ff0040] tracking-wider font-bold">REGLAS Y REQUISITOS</span>
                <span className="text-[10px] text-[#ff004080] ml-auto">{'// sys_warning'}</span>
              </div>
              
              <div className="p-4 text-xs space-y-3 font-mono relative">
                <div className="flex items-start gap-2">
                  <span className="text-[#ff0040]">{'[!]'}</span>
                  <span className="text-[#ff6b6b]">Mínimo 3 integrantes requeridos (Presidente, Vicepresidente, Secretario)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#ff0040]">{'[!]'}</span>
                  <span className="text-[#ff6b6b]">Máximo 7 integrantes en total</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#ff0040]">{'[!]'}</span>
                  <span className="text-[#ff6b6b]">Los roles adicionales deben especificar su función</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#ff0040]">{'[!]'}</span>
                  <span className="text-[#ff6b6b]">Deben ser estudiantes regulares sin restricciones académicas</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#ff0040]">{'[!]'}</span>
                  <span className="text-[#ff6b6b]">Solo se aceptan correos institucionales @miucsh.cl</span>
                </div>
                <div className="flex items-start gap-2 pt-3 mt-3 border-t border-[#ff004030]">
                  <span className="text-[#ff0040] text-lg">{'⚠'}</span>
                  <span className="text-[#ff0040] font-bold">Las listas oficiales serán publicadas después del 21 de Abril, 2026</span>
                </div>
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative group px-12 py-4 bg-transparent border-2 border-[#00ff41] text-[#00ff41] tracking-widest text-sm hover:bg-[#00ff41] hover:text-[#0a0a0a] transition-all duration-300 animate-pulse-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none"
            >
              <div className="absolute inset-0 bg-[#00ff41] opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-3">
                <Send size={16} className={isSubmitting ? 'animate-pulse' : ''} />
                {isSubmitting ? 'ENVIANDO...' : 'INSCRIBIR LISTA'}
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

"use client"

import { useEffect } from "react"
import { Send, Instagram } from "lucide-react"
import { HudOverlay } from "@/components/hud-overlay"
import { Header } from "@/components/layout/header"
import { CountdownTimer } from "@/components/countdown-timer"
import { CyberInput } from "@/components/cyber-input"
import { MemberFields } from "@/components/form/member-fields"
import { AdditionalMembers } from "@/components/form/additional-members"
import { RulesPanel } from "@/components/rules-panel"
import { Notification } from "@/components/notification"
import { useRegistrationForm } from "@/hooks/use-registration-form"
import { initEmailJS, sendRegistrationEmail } from "@/lib/email-service"

// Deadline for registration
const DEADLINE = new Date("2026-04-17T23:59:59")

export default function RegistrationPage() {
  const {
    listName,
    setListName,
    president,
    vicePresident,
    secretary,
    additionalMembers,
    errors,
    updateMember,
    addMember,
    removeMember,
    updateAdditionalMember,
    validateForm,
    getFormData,
    resetForm,
    isSubmitting,
    setIsSubmitting,
    notification,
    showNotification,
    clearNotification,
  } = useRegistrationForm()

  // Initialize EmailJS on mount
  useEffect(() => {
    initEmailJS()
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] handleSubmit called")

    if (!validateForm()) {
      showNotification("error", "Por favor, corrige los errores antes de enviar")
      return
    }

    setIsSubmitting(true)
    console.log("[v0] Form validated, submitting...")

    try {
      const formData = getFormData()
      console.log("[v0] Form data:", JSON.stringify(formData, null, 2))
      
      const result = await sendRegistrationEmail(formData)
      console.log("[v0] Email result:", result)

      if (result.success) {
        showNotification("success", "Candidatura enviada correctamente")
        resetForm()
      } else {
        console.log("[v0] Email failed with error:", result.error)
        showNotification("error", result.error || "Error al enviar la candidatura")
      }
    } catch (error) {
      console.error("[v0] Submit catch error:", error)
      showNotification("error", "Error al enviar la candidatura. Por favor, intente nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen matrix-bg relative overflow-x-hidden">
      {/* Dark overlay for readability */}
      <div className="fixed inset-0 bg-[#0a0a0a]/85 pointer-events-none" />
      
      <HudOverlay />

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={clearNotification}
        />
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <Header />

        {/* Countdown Timer */}
        <section className="my-8 border border-[#00ff4133] bg-[#0d1117]/90 p-6 backdrop-blur-sm">
          <CountdownTimer targetDate={DEADLINE} />
          <div className="text-center mt-4 text-[10px] text-[#4a9f5a]">
            Período de inscripción: 01 Abril - 17 Abril, 2026
          </div>
        </section>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Title */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#00ff4150] to-transparent" />
            <h2 className="text-lg text-[#00ff41] tracking-wider">
              {"<"} FORMULARIO DE INSCRIPCIÓN {"/>"}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#00ff4150] to-transparent" />
          </div>

          {/* List Name */}
          <section className="border border-[#00ff4133] bg-[#0d1117]/90 p-4 backdrop-blur-sm">
            <CyberInput
              label="Nombre de la Lista"
              placeholder="Ingrese el nombre de su lista"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              error={errors.listName}
              required
            />
          </section>

          {/* President Section */}
          <section className="border border-[#00ff4133] bg-[#0d1117]/90 p-4 backdrop-blur-sm">
            <MemberFields
              title="PRESIDENTE/A"
              member={president}
              errors={errors.president}
              onChange={(field, value) => updateMember("president", field, value)}
            />
          </section>

          {/* Vice President Section */}
          <section className="border border-[#00ff4133] bg-[#0d1117]/90 p-4 backdrop-blur-sm">
            <MemberFields
              title="VICEPRESIDENTE/A"
              member={vicePresident}
              errors={errors.vicePresident}
              onChange={(field, value) => updateMember("vicePresident", field, value)}
            />
          </section>

          {/* Secretary Section */}
          <section className="border border-[#00ff4133] bg-[#0d1117]/90 p-4 backdrop-blur-sm">
            <MemberFields
              title="SECRETARIO/A"
              member={secretary}
              errors={errors.secretary}
              onChange={(field, value) => updateMember("secretary", field, value)}
            />
          </section>

          {/* Additional Members Section */}
          <section className="border border-[#00ff4133] bg-[#0d1117]/90 p-4 backdrop-blur-sm">
            <AdditionalMembers
              members={additionalMembers}
              errors={errors.additionalMembers}
              onAdd={addMember}
              onRemove={removeMember}
              onChange={updateAdditionalMember}
            />
          </section>

          {/* Rules Panel */}
          <RulesPanel />

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                group relative flex items-center gap-3 px-8 py-4 
                border-2 border-[#00ff41] bg-[#0a0a0a]/80
                text-[#00ff41] font-mono text-sm tracking-wider
                transition-all duration-300
                hover:bg-[#00ff4120] 
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:hover:bg-transparent
                ${!isSubmitting ? 'animate-green-flicker' : ''}
              `}
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00ff41]" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00ff41]" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00ff41]" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00ff41]" />

              <Send className={`w-5 h-5 ${isSubmitting ? "animate-pulse" : "group-hover:translate-x-1"} transition-transform`} />
              <span>{isSubmitting ? "ENVIANDO..." : "ENVIAR LISTA"}</span>
            </button>
          </div>
        </form>

        {/* Footer with Instagram */}
        <footer className="mt-12 pt-6 border-t border-[#00ff4130]">
          {/* Instagram Section */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <p className="text-xs text-[#4a9f5a]">Síguenos en Instagram</p>
            <a
              href="https://www.instagram.com/tricel.icci.2026?igsh=MW8yeTNiejV4MmFiZQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 border border-[#00ff4150] hover:border-[#00ff41] hover:bg-[#00ff4110] transition-all text-[#00ff41] group"
            >
              <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-sm">@tricel.icci.2026</span>
            </a>
          </div>

          {/* Credits */}
          <div className="text-center">
            <p className="text-[10px] text-[#4a9f5a]">
              <span className="text-[#00ff4150]">{"// "}</span>
              TRICEL ICCI 2026 - Universidad Católica Silva Henríquez
              <span className="text-[#00ff4150]">{" //"}</span>
            </p>
            <p className="text-[8px] text-[#4a9f5a50] mt-1">
              Sistema de Inscripción de Candidaturas v2.0
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}

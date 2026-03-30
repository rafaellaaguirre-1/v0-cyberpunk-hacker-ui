import type { RegistrationFormData, EmailTemplateParams } from "@/types"

// EmailJS configuration from environment variables
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ""
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || ""
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || ""
const RECIPIENT_EMAIL = process.env.NEXT_PUBLIC_RECIPIENT_EMAIL || "tricel.icc.2026@gmail.com"

let emailjsModule: typeof import("@emailjs/browser") | null = null

// Initialize EmailJS (call this once on mount)
export async function initEmailJS(): Promise<boolean> {
  if (!EMAILJS_PUBLIC_KEY) {
    console.error("[EmailJS] Public key not configured")
    return false
  }
  
  try {
    emailjsModule = await import("@emailjs/browser")
    emailjsModule.default.init(EMAILJS_PUBLIC_KEY)
    return true
  } catch (error) {
    console.error("[EmailJS] Failed to initialize:", error)
    return false
  }
}

// Format form data for email template
function formatEmailParams(data: RegistrationFormData): EmailTemplateParams {
  const additionalMembersText = data.additionalMembers.length > 0
    ? data.additionalMembers
        .map((m, i) => `Integrante ${i + 1}: ${m.name} | Rol: ${m.role} | RUT: ${m.rut} | Email: ${m.email}`)
        .join("\n")
    : "Sin integrantes adicionales"

  return {
    to_email: RECIPIENT_EMAIL,
    list_name: data.listName,
    president_name: data.president.name,
    president_rut: data.president.rut,
    president_email: data.president.email,
    vice_president_name: data.vicePresident.name,
    vice_president_rut: data.vicePresident.rut,
    vice_president_email: data.vicePresident.email,
    secretary_name: data.secretary.name,
    secretary_rut: data.secretary.rut,
    secretary_email: data.secretary.email,
    additional_members: additionalMembersText,
    submission_date: new Date().toLocaleString("es-CL", {
      dateStyle: "full",
      timeStyle: "medium",
    }),
  }
}

// Send registration email
export async function sendRegistrationEmail(
  data: RegistrationFormData
): Promise<{ success: boolean; error?: string }> {
  if (!emailjsModule) {
    return { success: false, error: "EmailJS no está inicializado" }
  }

  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
    return { success: false, error: "Configuración de email incompleta" }
  }

  try {
    const templateParams = formatEmailParams(data)
    
    await emailjsModule.default.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams as unknown as Record<string, unknown>
    )
    
    return { success: true }
  } catch (error) {
    console.error("[EmailJS] Failed to send:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error al enviar email" 
    }
  }
}

import type { RegistrationFormData, EmailTemplateParams } from "@/types"

// EmailJS configuration from environment variables
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ""
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || ""
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || ""
const RECIPIENT_EMAIL = process.env.NEXT_PUBLIC_RECIPIENT_EMAIL || "tricel.icc.2026@gmail.com"

let emailjsModule: typeof import("@emailjs/browser") | null = null
let isInitialized = false

// Initialize EmailJS (call this once on mount)
export async function initEmailJS(): Promise<boolean> {
  console.log("[v0] EmailJS init starting...")
  console.log("[v0] EMAILJS_PUBLIC_KEY exists:", !!EMAILJS_PUBLIC_KEY)
  console.log("[v0] EMAILJS_SERVICE_ID exists:", !!EMAILJS_SERVICE_ID)
  console.log("[v0] EMAILJS_TEMPLATE_ID exists:", !!EMAILJS_TEMPLATE_ID)
  
  if (!EMAILJS_PUBLIC_KEY) {
    console.error("[v0] EmailJS Public key not configured - check NEXT_PUBLIC_EMAILJS_PUBLIC_KEY")
    return false
  }
  
  if (!EMAILJS_SERVICE_ID) {
    console.error("[v0] EmailJS Service ID not configured - check NEXT_PUBLIC_EMAILJS_SERVICE_ID")
    return false
  }
  
  if (!EMAILJS_TEMPLATE_ID) {
    console.error("[v0] EmailJS Template ID not configured - check NEXT_PUBLIC_EMAILJS_TEMPLATE_ID")
    return false
  }
  
  try {
    emailjsModule = await import("@emailjs/browser")
    emailjsModule.default.init(EMAILJS_PUBLIC_KEY)
    isInitialized = true
    console.log("[v0] EmailJS initialized successfully!")
    return true
  } catch (error) {
    console.error("[v0] EmailJS failed to initialize:", error)
    return false
  }
}

// Check if EmailJS is ready
export function isEmailJSReady(): boolean {
  return isInitialized && emailjsModule !== null
}

// Format form data for email template - simplified version
function formatEmailParams(data: RegistrationFormData): Record<string, string> {
  // Build simple string directly
  let info_completa = "LISTA: " + String(data.listName || "")
  info_completa += "\n\nPRESIDENTE:"
  info_completa += "\n- Nombre: " + String(data.president?.name || "")
  info_completa += "\n- RUT: " + String(data.president?.rut || "")
  info_completa += "\n- Correo: " + String(data.president?.email || "")
  info_completa += "\n\nVICEPRESIDENTE:"
  info_completa += "\n- Nombre: " + String(data.vicePresident?.name || "")
  info_completa += "\n- RUT: " + String(data.vicePresident?.rut || "")
  info_completa += "\n- Correo: " + String(data.vicePresident?.email || "")
  info_completa += "\n\nSECRETARIO:"
  info_completa += "\n- Nombre: " + String(data.secretary?.name || "")
  info_completa += "\n- RUT: " + String(data.secretary?.rut || "")
  info_completa += "\n- Correo: " + String(data.secretary?.email || "")
  
  if (data.additionalMembers && data.additionalMembers.length > 0) {
    info_completa += "\n\nMIEMBROS ADICIONALES:"
    for (let i = 0; i < data.additionalMembers.length; i++) {
      const m = data.additionalMembers[i]
      info_completa += "\n- " + String(m.role || "") + ": " + String(m.name || "") + " | RUT: " + String(m.rut || "") + " | Correo: " + String(m.email || "")
    }
  }
  
  console.log("INFO_COMPLETA FINAL:", info_completa)
  
  const result = { info_completa: info_completa }
  console.log("OBJETO ENVIADO:", JSON.stringify(result))
  
  return result
}

// Send registration email
export async function sendRegistrationEmail(
  data: RegistrationFormData
): Promise<{ success: boolean; error?: string }> {
  console.log("[v0] sendRegistrationEmail called")
  console.log("[v0] emailjsModule exists:", !!emailjsModule)
  console.log("[v0] isInitialized:", isInitialized)
  
  if (!emailjsModule || !isInitialized) {
    console.error("[v0] EmailJS not initialized - attempting to initialize now...")
    const initialized = await initEmailJS()
    if (!initialized) {
      return { success: false, error: "EmailJS no está inicializado. Verifica las variables de entorno." }
    }
  }

  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
    console.error("[v0] Missing config - SERVICE_ID:", !!EMAILJS_SERVICE_ID, "TEMPLATE_ID:", !!EMAILJS_TEMPLATE_ID)
    return { success: false, error: "Configuración de email incompleta" }
  }

  try {
    const params = formatEmailParams(data)
    
    console.log("ENVIANDO A EMAILJS:", params)
    
    const response = await emailjsModule!.default.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      params
    )
    
    console.log("RESPUESTA EMAILJS:", response)
    return { success: true }
  } catch (error) {
    console.error("[v0] EmailJS failed to send:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return { 
      success: false, 
      error: `Error al enviar email: ${errorMessage}` 
    }
  }
}

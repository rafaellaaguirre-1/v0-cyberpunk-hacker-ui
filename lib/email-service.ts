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

// Format form data for email template
function formatEmailParams(data: RegistrationFormData): EmailTemplateParams {
  console.log("[v0] formatEmailParams received data:", JSON.stringify(data, null, 2))
  // Build the complete info string for {{info_completa}}
  let infoCompleta = `Nombre de la Lista: ${data.listName}

Presidente/a:
Nombre: ${data.president.name}
RUT: ${data.president.rut}
Correo: ${data.president.email}

Vicepresidente/a:
Nombre: ${data.vicePresident.name}
RUT: ${data.vicePresident.rut}
Correo: ${data.vicePresident.email}

Secretario/a:
Nombre: ${data.secretary.name}
RUT: ${data.secretary.rut}
Correo: ${data.secretary.email}`

  // Add additional members dynamically if present
  if (data.additionalMembers && data.additionalMembers.length > 0) {
    infoCompleta += "\n\nMiembros adicionales:"
    data.additionalMembers.forEach((member) => {
      infoCompleta += `

Rol: ${member.role}
Nombre: ${member.name}
RUT: ${member.rut}
Correo: ${member.email}`
    })
  }

  console.log("[v0] info_completa value:", infoCompleta)

  return {
    to_email: RECIPIENT_EMAIL,
    nombre_lista: data.listName,
    info_completa: infoCompleta,
    presidente_nombre: data.president.name,
    presidente_rut: data.president.rut,
    presidente_correo: data.president.email,
    vicepresidente_nombre: data.vicePresident.name,
    vicepresidente_rut: data.vicePresident.rut,
    vicepresidente_correo: data.vicePresident.email,
    secretario_nombre: data.secretary.name,
    secretario_rut: data.secretary.rut,
    secretario_correo: data.secretary.email,
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
    const templateParams = formatEmailParams(data)
    console.log("[v0] Sending email with params:", JSON.stringify(templateParams, null, 2))
    
    const response = await emailjsModule!.default.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams as unknown as Record<string, unknown>
    )
    
    console.log("[v0] EmailJS response:", response)
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

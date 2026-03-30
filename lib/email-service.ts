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
function formatEmailParams(data: RegistrationFormData): Record<string, string> {
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
  if (data.additionalMembers.length > 0) {
    infoCompleta += "\n\nMiembros adicionales:"
    data.additionalMembers.forEach((member) => {
      infoCompleta += `

Rol: ${member.role}
Nombre: ${member.name}
RUT: ${member.rut}
Correo: ${member.email}`
    })
  }

  // Return params matching EXACTLY the EmailJS template variables
  return {
    // Recipient - will be overridden when sending
    to_email: "",
    // Complete info block
    info_completa: infoCompleta,
    // Individual fields for flexibility
    nombre_lista: data.listName,
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

// Send registration email to tricel only
export async function sendRegistrationEmail(
  data: RegistrationFormData
): Promise<{ success: boolean; error?: string }> {
  console.log("[v0] sendRegistrationEmail called")
  console.log("[v0] emailjsModule loaded:", !!emailjsModule)
  console.log("[v0] SERVICE_ID:", EMAILJS_SERVICE_ID)
  console.log("[v0] TEMPLATE_ID:", EMAILJS_TEMPLATE_ID)
  
  if (!emailjsModule) {
    console.log("[v0] Error: EmailJS not initialized")
    return { success: false, error: "EmailJS no está inicializado" }
  }

  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
    console.log("[v0] Error: Missing config")
    return { success: false, error: "Configuración de email incompleta" }
  }

  try {
    const templateParams = formatEmailParams(data)
    templateParams.to_email = "tricel.icc.2026@gmail.com"
    
    console.log("[v0] Sending with params:", JSON.stringify(templateParams, null, 2))
    
    const result = await emailjsModule.default.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    )
    
    console.log("[v0] EmailJS result:", result)
    return { success: true }
  } catch (error) {
    console.error("[v0] EmailJS Failed:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.log("[v0] Error message:", errorMessage)
    return { 
      success: false, 
      error: errorMessage
    }
  }
}

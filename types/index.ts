// Member data structure
export interface Member {
  name: string
  rut: string
  email: string
}

// Additional member with role field
export interface AdditionalMember extends Member {
  id: string
  role: string
}

// Form data structure
export interface RegistrationFormData {
  listName: string
  president: Member
  vicePresident: Member
  secretary: Member
  additionalMembers: AdditionalMember[]
}

// Notification types
export type NotificationType = "success" | "error" | "warning" | "info"

export interface Notification {
  type: NotificationType
  message: string
}

// Email template params matching EmailJS template variables
export interface EmailTemplateParams {
  to_email: string
  nombre_lista: string
  info_completa: string
  presidente_nombre: string
  presidente_rut: string
  presidente_correo: string
  vicepresidente_nombre: string
  vicepresidente_rut: string
  vicepresidente_correo: string
  secretario_nombre: string
  secretario_rut: string
  secretario_correo: string
  submission_date: string
}

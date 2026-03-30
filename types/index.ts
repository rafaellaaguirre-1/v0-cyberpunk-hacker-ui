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

// Email template params
export interface EmailTemplateParams {
  to_email: string
  list_name: string
  president_name: string
  president_rut: string
  president_email: string
  vice_president_name: string
  vice_president_rut: string
  vice_president_email: string
  secretary_name: string
  secretary_rut: string
  secretary_email: string
  additional_members: string
  submission_date: string
}

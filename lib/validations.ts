import { z } from "zod"
import { validateRutCheckDigit } from "./rut-utils"

// Custom RUT validation
const rutSchema = z.string()
  .min(1, "RUT es requerido")
  .refine((val) => {
    const clean = val.replace(/[^0-9kK]/g, '')
    return clean.length >= 8 && clean.length <= 9
  }, "RUT debe tener entre 8 y 9 caracteres")
  .refine((val) => validateRutCheckDigit(val), "Dígito verificador inválido")

// Institutional email validation
const emailSchema = z.string()
  .min(1, "Correo es requerido")
  .email("Formato de correo inválido")
  .refine((val) => val.toLowerCase().endsWith("@miucsh.cl"), "Solo se permiten correos @miucsh.cl")

// Member schema
export const memberSchema = z.object({
  name: z.string().min(1, "Nombre es requerido").min(3, "Nombre debe tener al menos 3 caracteres"),
  rut: rutSchema,
  email: emailSchema,
})

// Additional member schema (with id)
export const additionalMemberSchema = memberSchema.extend({
  id: z.string(),
})

// Full registration form schema
export const registrationSchema = z.object({
  listName: z.string()
    .min(1, "Nombre de lista es requerido")
    .min(3, "Nombre de lista debe tener al menos 3 caracteres")
    .max(50, "Nombre de lista no puede exceder 50 caracteres"),
  president: memberSchema,
  vicePresident: memberSchema,
  secretary: memberSchema,
  additionalMembers: z.array(additionalMemberSchema).max(4, "Máximo 4 integrantes adicionales"),
})

export type RegistrationFormValues = z.infer<typeof registrationSchema>

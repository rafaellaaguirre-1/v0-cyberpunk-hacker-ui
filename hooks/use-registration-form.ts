"use client"

import { useState, useCallback } from "react"
import { validateRut, validateInstitutionalEmail } from "@/lib/rut-utils"
import type { Member, AdditionalMember, Notification, RegistrationFormData } from "@/types"

// Initial empty member
const emptyMember: Member = { name: "", rut: "", email: "" }

// Field type for additional members (includes role)
type AdditionalMemberField = keyof Member | "role"

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9)

export function useRegistrationForm() {
  // Form state
  const [listName, setListName] = useState("")
  const [president, setPresident] = useState<Member>({ ...emptyMember })
  const [vicePresident, setVicePresident] = useState<Member>({ ...emptyMember })
  const [secretary, setSecretary] = useState<Member>({ ...emptyMember })
  const [additionalMembers, setAdditionalMembers] = useState<AdditionalMember[]>([])
  
  // Error state
  const [errors, setErrors] = useState<{
    listName?: string
    president: Partial<Record<keyof Member, string>>
    vicePresident: Partial<Record<keyof Member, string>>
    secretary: Partial<Record<keyof Member, string>>
    additionalMembers: Record<string, Partial<Record<keyof Member, string>>>
  }>({
    president: {},
    vicePresident: {},
    secretary: {},
    additionalMembers: {},
  })

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<Notification | null>(null)

  // Update member field
  const updateMember = useCallback(
    (role: "president" | "vicePresident" | "secretary", field: keyof Member, value: string) => {
      const setters = { president: setPresident, vicePresident: setVicePresident, secretary: setSecretary }
      setters[role]((prev) => ({ ...prev, [field]: value }))
      
      // Clear error when user types
      setErrors((prev) => ({
        ...prev,
        [role]: { ...prev[role], [field]: undefined },
      }))
    },
    []
  )

  // Additional members management
  const addMember = useCallback(() => {
    if (additionalMembers.length >= 4) return
    setAdditionalMembers((prev) => [...prev, { id: generateId(), ...emptyMember, role: "" }])
  }, [additionalMembers.length])

  const removeMember = useCallback((id: string) => {
    setAdditionalMembers((prev) => prev.filter((m) => m.id !== id))
    setErrors((prev) => {
      const { [id]: _, ...rest } = prev.additionalMembers
      return { ...prev, additionalMembers: rest }
    })
  }, [])

  const updateAdditionalMember = useCallback((id: string, field: AdditionalMemberField, value: string) => {
    setAdditionalMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    )
    setErrors((prev) => ({
      ...prev,
      additionalMembers: {
        ...prev.additionalMembers,
        [id]: { ...prev.additionalMembers[id], [field]: undefined },
      },
    }))
  }, [])

  // Validate a single member
  const validateMember = (member: Member): Partial<Record<keyof Member, string>> => {
    const memberErrors: Partial<Record<keyof Member, string>> = {}

    if (!member.name.trim()) {
      memberErrors.name = "Nombre es requerido"
    } else if (member.name.trim().length < 3) {
      memberErrors.name = "Nombre debe tener al menos 3 caracteres"
    }

    const rutValidation = validateRut(member.rut)
    if (!rutValidation.valid) {
      memberErrors.rut = rutValidation.error
    }

    const emailValidation = validateInstitutionalEmail(member.email)
    if (!emailValidation.valid) {
      memberErrors.email = emailValidation.error
    }

    return memberErrors
  }

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    const newErrors = {
      listName: undefined as string | undefined,
      president: validateMember(president),
      vicePresident: validateMember(vicePresident),
      secretary: validateMember(secretary),
      additionalMembers: {} as Record<string, Partial<Record<keyof Member, string>>>,
    }

    // Validate list name
    if (!listName.trim()) {
      newErrors.listName = "Nombre de lista es requerido"
    } else if (listName.trim().length < 3) {
      newErrors.listName = "Nombre de lista debe tener al menos 3 caracteres"
    }

    // Validate additional members (including role)
    additionalMembers.forEach((member) => {
      const memberErrors: Record<string, string> = { ...validateMember(member) }
      // Validate role for additional members
      if (!member.role || !member.role.trim()) {
        memberErrors.role = "Rol es requerido"
      } else if (member.role.trim().length < 2) {
        memberErrors.role = "Rol debe tener al menos 2 caracteres"
      }
      if (Object.keys(memberErrors).length > 0) {
        newErrors.additionalMembers[member.id] = memberErrors
      }
    })

    setErrors(newErrors)

    // Check if there are any errors
    const hasErrors =
      !!newErrors.listName ||
      Object.keys(newErrors.president).length > 0 ||
      Object.keys(newErrors.vicePresident).length > 0 ||
      Object.keys(newErrors.secretary).length > 0 ||
      Object.keys(newErrors.additionalMembers).length > 0

    return !hasErrors
  }, [listName, president, vicePresident, secretary, additionalMembers])

  // Get form data
  const getFormData = useCallback((): RegistrationFormData => ({
    listName,
    president,
    vicePresident,
    secretary,
    additionalMembers,
  }), [listName, president, vicePresident, secretary, additionalMembers])

  // Reset form
  const resetForm = useCallback(() => {
    setListName("")
    setPresident({ ...emptyMember })
    setVicePresident({ ...emptyMember })
    setSecretary({ ...emptyMember })
    setAdditionalMembers([])
    setErrors({
      president: {},
      vicePresident: {},
      secretary: {},
      additionalMembers: {},
    })
  }, [])

  // Show notification
  const showNotification = useCallback((type: Notification["type"], message: string) => {
    setNotification({ type, message })
  }, [])

  const clearNotification = useCallback(() => {
    setNotification(null)
  }, [])

  return {
    // Form values
    listName,
    setListName,
    president,
    vicePresident,
    secretary,
    additionalMembers,
    
    // Errors
    errors,
    
    // Actions
    updateMember,
    addMember,
    removeMember,
    updateAdditionalMember,
    validateForm,
    getFormData,
    resetForm,
    
    // UI state
    isSubmitting,
    setIsSubmitting,
    notification,
    showNotification,
    clearNotification,
  }
}

"use client"

import { CyberInput } from "@/components/cyber-input"
import { formatRut } from "@/lib/rut-utils"
import type { Member } from "@/types"

interface MemberFieldsProps {
  title: string
  member: Member
  errors: Partial<Record<keyof Member, string>>
  onChange: (field: keyof Member, value: string) => void
}

export function MemberFields({ title, member, errors, onChange }: MemberFieldsProps) {
  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value)
    onChange("rut", formatted)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm text-[#00ff41] border-b border-[#00ff4130] pb-2">
        <span className="text-[#00ff4150]">{"// "}</span>
        {title}
      </h3>
      
      <div className="grid gap-4 md:grid-cols-3">
        <CyberInput
          label="Nombre Completo"
          placeholder="Ingresa nombre completo"
          value={member.name}
          onChange={(e) => onChange("name", e.target.value)}
          error={errors.name}
          required
        />
        
        <CyberInput
          label="RUT"
          placeholder="12.345.678-9"
          value={member.rut}
          onChange={handleRutChange}
          error={errors.rut}
          maxLength={12}
          required
        />
        
        <CyberInput
          label="Correo Institucional"
          placeholder="usuario@miucsh.cl"
          type="email"
          value={member.email}
          onChange={(e) => onChange("email", e.target.value)}
          error={errors.email}
          required
        />
      </div>
    </div>
  )
}

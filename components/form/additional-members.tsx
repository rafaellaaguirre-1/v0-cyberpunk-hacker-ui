"use client"

import { Plus, Trash2 } from "lucide-react"
import { CyberInput } from "@/components/cyber-input"
import { formatRut } from "@/lib/rut-utils"
import type { AdditionalMember } from "@/types"

type MemberField = "name" | "role" | "rut" | "email"

interface AdditionalMembersProps {
  members: AdditionalMember[]
  errors: Record<string, Partial<Record<MemberField, string>>>
  onAdd: () => void
  onRemove: (id: string) => void
  onChange: (id: string, field: MemberField, value: string) => void
  maxMembers?: number
}

export function AdditionalMembers({
  members,
  errors,
  onAdd,
  onRemove,
  onChange,
  maxMembers = 4,
}: AdditionalMembersProps) {
  const handleRutChange = (id: string, value: string) => {
    const formatted = formatRut(value)
    onChange(id, "rut", formatted)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-[#00ff41]">
          <span className="text-[#00ff4150]">{"// "}</span>
          Integrantes Adicionales
          <span className="text-[#4a9f5a] text-xs ml-2">(opcional, máx. {maxMembers})</span>
        </h3>
        
        {members.length < maxMembers && (
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#00ff41] border border-[#00ff4150] hover:border-[#00ff41] hover:bg-[#00ff4110] transition-all"
          >
            <Plus className="w-3 h-3" />
            <span>Agregar</span>
          </button>
        )}
      </div>

      {members.length === 0 ? (
        <div className="text-center py-6 text-[#4a9f5a] text-sm border border-dashed border-[#00ff4130]">
          <span className="text-[#00ff4150]">{"["}</span>
          Sin integrantes adicionales
          <span className="text-[#00ff4150]">{"]"}</span>
        </div>
      ) : (
        <div className="space-y-4">
          {members.map((member, index) => (
            <div key={member.id} className="relative border border-[#00ff4130] p-4 bg-[#0a0a0a50]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-[#4a9f5a]">
                  <span className="text-[#00ff4150]">{">"}</span> Integrante {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(member.id)}
                  className="p-1.5 text-[#ff0040] hover:bg-[#ff004020] transition-colors"
                  aria-label="Eliminar integrante"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <CyberInput
                  label="Nombre Completo"
                  placeholder="Ingresa nombre completo"
                  value={member.name}
                  onChange={(e) => onChange(member.id, "name", e.target.value)}
                  error={errors[member.id]?.name}
                  required
                />
                
                <CyberInput
                  label="Rol"
                  placeholder="Ej: Tesorero, Vocal, Delegado"
                  value={member.role}
                  onChange={(e) => onChange(member.id, "role", e.target.value)}
                  error={errors[member.id]?.role}
                  required
                />
                
                <CyberInput
                  label="RUT"
                  placeholder="12.345.678-9"
                  value={member.rut}
                  onChange={(e) => handleRutChange(member.id, e.target.value)}
                  error={errors[member.id]?.rut}
                  maxLength={12}
                  required
                />
                
                <CyberInput
                  label="Correo Institucional"
                  placeholder="usuario@miucsh.cl"
                  type="email"
                  value={member.email}
                  onChange={(e) => onChange(member.id, "email", e.target.value)}
                  error={errors[member.id]?.email}
                  required
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

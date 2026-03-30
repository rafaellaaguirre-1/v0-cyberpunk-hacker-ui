import { AlertTriangle } from "lucide-react"

export function RulesPanel() {
  const rules = [
    "Solo se permiten correos institucionales (@miucsh.cl)",
    "Cada lista debe tener un minimo de 3 integrantes (Presidente, Vicepresidente, Secretario)",
    "Se permite un maximo de 4 integrantes adicionales por lista",
    "Solo pueden participar estudiantes regulares de Ingenieria Civil en Computacion e Informatica",
    "Solo se permite una inscripcion por lista",
  ]

  return (
    <div className="border border-[#ff004050] bg-[#ff004008] p-4">
      <div className="flex items-center gap-2 text-[#ff0040] mb-3">
        <AlertTriangle className="w-4 h-4" />
        <span className="text-sm font-mono tracking-wider">REGLAMENTO</span>
      </div>
      
      <ul className="space-y-2 text-xs text-[#ff6680]">
        {rules.map((rule, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-[#ff004080]">[{String(index + 1).padStart(2, "0")}]</span>
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

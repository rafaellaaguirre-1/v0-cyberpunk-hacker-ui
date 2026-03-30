import { Instagram, Shield } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-[#00ff4130] pb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 border border-[#00ff4150] flex items-center justify-center bg-[#0a0a0a]">
            <Shield className="w-8 h-8 text-[#00ff41]" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-[#00ff41] neon-text tracking-wide">
              TRICEL ICCI 2026
            </h1>
            <p className="text-[10px] text-[#4a9f5a] tracking-widest">
              UNIVERSIDAD CATOLICA SILVA HENRIQUEZ
            </p>
          </div>
        </div>

        {/* Social Links */}
        <a
          href="https://instagram.com/tricel.icci"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 border border-[#00ff4150] hover:border-[#00ff41] hover:bg-[#00ff4110] transition-all text-[#00ff41] text-xs"
        >
          <Instagram className="w-4 h-4" />
          <span>@tricel.icci</span>
        </a>
      </div>

      {/* Subtitle */}
      <div className="mt-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#00ff41] neon-text tracking-wider">
          <span className="text-[#00ff4150]">{"<"}</span>
          INSCRIPCION DE CANDIDATURAS
          <span className="text-[#00ff4150]">{"/>"}</span>
        </h2>
        <p className="text-[#4a9f5a] text-sm mt-2 tracking-wide">
          Sistema de Registro Electoral Estudiantil
        </p>
      </div>
    </header>
  )
}

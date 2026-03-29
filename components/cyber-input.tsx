"use client"

import { InputHTMLAttributes } from "react"

interface CyberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function CyberInput({ label, className, ...props }: CyberInputProps) {
  return (
    <div className="relative group">
      <label className="block text-[10px] text-[#4a9f5a] mb-1 tracking-wider uppercase">
        <span className="text-[#00ff4150]">{'> '}</span>
        {label}
        {props.required && <span className="text-[#ff0040] ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          {...props}
          className={`
            w-full bg-[#0a0a0a] border border-[#00ff4133] px-3 py-2.5
            text-[#00ff41] text-sm font-mono placeholder:text-[#4a9f5a50]
            focus:outline-none focus:border-[#00ff41] focus:shadow-[0_0_10px_#00ff4150,inset_0_0_10px_#00ff4110]
            hover:border-[#00ff4180]
            transition-all duration-200
            ${className || ""}
          `}
        />
        {/* Corner accents on focus */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-transparent group-focus-within:border-[#00ff41] transition-colors" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-transparent group-focus-within:border-[#00ff41] transition-colors" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-transparent group-focus-within:border-[#00ff41] transition-colors" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-transparent group-focus-within:border-[#00ff41] transition-colors" />
      </div>
    </div>
  )
}

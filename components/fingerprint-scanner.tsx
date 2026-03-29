"use client"

import { useState } from "react"

interface FingerprintScannerProps {
  progress: number
}

export function FingerprintScanner({ progress }: FingerprintScannerProps) {
  const [scanning, setScanning] = useState(false)
  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "error">("idle")

  const handleScan = () => {
    setScanning(true)
    setStatus("scanning")
    
    setTimeout(() => {
      const success = Math.random() > 0.3
      setStatus(success ? "success" : "error")
      setScanning(false)
      
      setTimeout(() => setStatus("idle"), 3000)
    }, 3000)
  }

  return (
    <div className="relative border border-[#00ff4133] bg-[#0d1117] p-6">
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00ff41]" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00ff41]" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ff41]" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ff41]" />

      <div className="text-center space-y-6">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#4a9f5a]">// Fingerprint</span>
          <span className="text-[#00ff41]">BIOMETRIC_SCAN</span>
        </div>

        {/* Scanner container */}
        <div 
          className="relative w-48 h-48 mx-auto cursor-pointer group"
          onClick={handleScan}
        >
          {/* Outer rotating ring */}
          <div className="absolute inset-0 border-2 border-[#00ff4133] rounded-full animate-rotate-scanner" />
          
          {/* Second ring */}
          <div className="absolute inset-4 border border-[#00ff4150] rounded-full" />
          
          {/* Inner glow ring */}
          <div className={`absolute inset-8 border-2 rounded-full transition-all duration-500 ${
            status === "success" ? "border-[#00ff41] neon-border" :
            status === "error" ? "border-[#ff0040] shadow-[0_0_20px_#ff0040]" :
            scanning ? "border-[#00ff41] animate-pulse-glow" :
            "border-[#00ff4150]"
          }`} />

          {/* Fingerprint SVG */}
          <div className="absolute inset-12 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className={`w-full h-full transition-all duration-300 ${
              status === "success" ? "text-[#00ff41]" :
              status === "error" ? "text-[#ff0040]" :
              scanning ? "text-[#00ff41] animate-pulse" :
              "text-[#00ff4180]"
            }`}>
              <g fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M50,10 Q70,10 80,30 Q90,50 80,70 Q70,90 50,90 Q30,90 20,70 Q10,50 20,30 Q30,10 50,10" opacity="0.3"/>
                <path d="M50,20 Q65,20 72,35 Q80,50 72,65 Q65,80 50,80 Q35,80 28,65 Q20,50 28,35 Q35,20 50,20" opacity="0.5"/>
                <path d="M50,30 Q60,30 65,40 Q70,50 65,60 Q60,70 50,70 Q40,70 35,60 Q30,50 35,40 Q40,30 50,30" opacity="0.7"/>
                <path d="M50,40 Q55,40 58,45 Q60,50 58,55 Q55,60 50,60 Q45,60 42,55 Q40,50 42,45 Q45,40 50,40"/>
                <circle cx="50" cy="50" r="5" fill="currentColor" opacity="0.8"/>
              </g>
            </svg>
          </div>

          {/* Scan line */}
          {scanning && (
            <div className="absolute inset-12 overflow-hidden rounded-full">
              <div className="absolute inset-x-0 h-1 bg-gradient-to-b from-transparent via-[#00ff41] to-transparent animate-scan-line" />
            </div>
          )}

          {/* Corner markers */}
          <div className="absolute top-6 left-6 w-3 h-3 border-t border-l border-[#00ff41]" />
          <div className="absolute top-6 right-6 w-3 h-3 border-t border-r border-[#00ff41]" />
          <div className="absolute bottom-6 left-6 w-3 h-3 border-b border-l border-[#00ff41]" />
          <div className="absolute bottom-6 right-6 w-3 h-3 border-b border-r border-[#00ff41]" />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <div className={`text-sm font-[family-name:var(--font-display)] ${
            status === "success" ? "text-[#00ff41] neon-text" :
            status === "error" ? "text-[#ff0040]" :
            "text-[#4a9f5a]"
          }`}>
            {status === "idle" && "AWAITING SCAN"}
            {status === "scanning" && "ANALYZING BIOMETRICS..."}
            {status === "success" && "ACCESS GRANTED"}
            {status === "error" && "ACCESS DENIED"}
          </div>
          
          {/* Progress bar */}
          <div className="w-full h-1 bg-[#1a1a2e] overflow-hidden">
            <div 
              className={`h-full transition-all duration-100 ${
                status === "error" ? "bg-[#ff0040]" : "bg-[#00ff41]"
              }`}
              style={{ width: scanning ? `${progress}%` : status === "success" ? "100%" : "0%" }}
            />
          </div>
        </div>

        <div className="text-xs text-[#4a9f5a]">
          [ CLICK TO INITIATE SCAN ]
        </div>
      </div>
    </div>
  )
}

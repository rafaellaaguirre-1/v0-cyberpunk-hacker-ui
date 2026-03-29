import type { Metadata } from 'next'
import { Share_Tech_Mono, Orbitron } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const shareTechMono = Share_Tech_Mono({ 
  weight: '400',
  subsets: ["latin"],
  variable: '--font-mono'
});

const orbitron = Orbitron({ 
  subsets: ["latin"],
  variable: '--font-display'
});

export const metadata: Metadata = {
  title: 'Formulario Listas ICCI UCSH',
  description: 'Formulario de Inscripción de Listas - Ingeniería Civil en Computación e Informática - UCSH',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${shareTechMono.variable} ${orbitron.variable} font-mono antialiased bg-[#0a0a0a] text-[#00ff41]`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

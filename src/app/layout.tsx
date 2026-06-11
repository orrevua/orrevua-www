import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { siteMetadata } from "@/config/metadata"
import { TerminalWrapper } from "@/components/terminal/terminal-wrapper"
import { ThemeInitializer } from "@/components/theme-initializer"
import { themes } from "@/lib/themes"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = siteMetadata

const bootPalettes: Record<string, Record<string, string>> = {}
for (const t of themes) {
  if (t.id !== "midnight") {
    bootPalettes[t.id] = t.palette
  }
}
const themeBootScript = `(function(){try{var t=${JSON.stringify(bootPalettes)};var id=localStorage.getItem("orrevua-theme");if(id&&t[id]){var p=t[id];var r=document.documentElement;for(var k in p)r.style.setProperty(k,p[k])}}catch(e){}})()`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <ThemeInitializer />
        <TerminalWrapper>
          {children}
        </TerminalWrapper>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

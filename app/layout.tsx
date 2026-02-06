import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Space_Mono } from "next/font/google"

import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
})

export const metadata: Metadata = {
  title: "Bear Capital Market Forum",
  description:
    "The most bearish forum on the internet. Post your doom takes and get scored on how bearish you really are.",
}

export const viewport: Viewport = {
  themeColor: "#0a0c10",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}

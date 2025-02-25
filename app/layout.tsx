import type React from "react"
import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { RootLayoutContent } from "@/components/RootLayoutContent"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AI Content Platform",
  description: "Analyze and optimize your AI-generated content",
  generator: 'v0dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootLayoutContent>
          {children}
        </RootLayoutContent>
      </body>
    </html>
  )
}
import type React from "react"
import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Header from '../components/Header'

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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="container mx-auto py-4">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

import './globals.css'
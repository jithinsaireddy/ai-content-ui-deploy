import type React from "react"
import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Header from '../components/Header'
import { MainNav } from "@/components/MainNav"

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
          <div className="flex min-h-screen">
            <aside className="hidden w-64 border-r bg-muted/40 lg:block">
              <MainNav />
            </aside>
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

import './globals.css'
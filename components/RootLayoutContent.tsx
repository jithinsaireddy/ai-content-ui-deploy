"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/MainNav"
import Header from './Header'
import { ThemeProvider } from "@/components/theme-provider"

export function RootLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const isLandingPage = pathname === '/home'

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {!isLandingPage && (
        <>
          <Header />
          <div className="flex min-h-screen">
            <aside className={`relative border-r bg-muted/40 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-3 top-3 z-10 h-6 w-6 rounded-full border bg-background"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
              <MainNav isCollapsed={isCollapsed} />
            </aside>
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </>
      )}
      {isLandingPage && children}
    </ThemeProvider>
  )
}

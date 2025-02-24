"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  TrendingUp,
  Settings,
  PlusCircle,
  Globe,
} from "lucide-react"

const navItems = [
  {
    title: "Content Generation",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Trending Topics",
    href: "/trends",
    icon: TrendingUp,
  },
  {
    title: "Content Localization",
    href: "/localization",
    icon: Globe,
  },
  // Add more pages here as needed
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <ScrollArea className="flex-1">
      <div className="flex w-full flex-col gap-2 p-2">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2",
              pathname === item.href && "bg-muted"
            )}
            asChild
          >
            <Link href={item.href}>
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}

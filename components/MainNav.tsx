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
  Lightbulb,
  Brain,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
    title: "Content Strategy",
    href: "/content-strategy",
    icon: Lightbulb,
  },
  {
    title: "Community Model",
    href: "/community-model",
    icon: Brain,
  },
  {
    title: "Content Localization",
    href: "/localization",
    icon: Globe,
  },
  // Add more pages here as needed
]

interface MainNavProps {
  isCollapsed: boolean
}

export function MainNav({ isCollapsed }: MainNavProps) {
  const pathname = usePathname()

  return (
    <ScrollArea className="flex-1">
      <div className="flex w-full flex-col gap-2 p-2">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => {
            const NavItem = (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  pathname === item.href && "bg-muted",
                  isCollapsed && "justify-center"
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              </Button>
            )

            if (isCollapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{NavItem}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return NavItem
          })}
        </TooltipProvider>
      </div>
    </ScrollArea>
  )
}

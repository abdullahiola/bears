"use client"

import { TrendingDown, Search, Bell, MessageCircle } from "lucide-react"
import { SolanaTicker } from "./solana-ticker"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function ForumHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Left: Logo + Search */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
              <TrendingDown className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="hidden text-lg font-bold tracking-tight text-foreground sm:block">
              Bear Capital
            </span>
          </div>
          <div className="relative ml-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search bearish takes..."
              className="h-9 w-48 rounded-full bg-secondary pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary md:w-64"
            />
          </div>
        </div>

        {/* Center: SOL ticker + market status */}
        <div className="hidden items-center gap-3 md:flex">
          <SolanaTicker />
          <div className="flex items-center gap-1.5 rounded-full bg-bear-crimson/10 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-bear-crimson animate-pulse" />
            <span className="font-mono text-xs font-medium text-bear-crimson">
              MARKETS DOWN
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
            aria-label="Messages"
          >
            <MessageCircle className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-bear-crimson" />
          </button>
          <Avatar className="ml-1 h-8 w-8 cursor-pointer">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
              AB
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

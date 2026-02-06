"use client"

import {
  Home,
  Flame,
  Trophy,
  TrendingDown,
  BarChart3,
  Bookmark,
  Users,
  Settings,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export type View =
  | "feed"
  | "reels"
  | "leaderboard"
  | "markets"
  | "predictions"
  | "saved"
  | "groups"
  | "settings"

const NAV_ITEMS: { icon: typeof Home; label: string; view: View }[] = [
  { icon: Home, label: "Feed", view: "feed" },
  { icon: Flame, label: "Reels", view: "reels" },
  { icon: Trophy, label: "Leaderboard", view: "leaderboard" },
  { icon: TrendingDown, label: "Markets", view: "markets" },
  { icon: BarChart3, label: "Predictions", view: "predictions" },
  { icon: Bookmark, label: "Saved", view: "saved" },
  { icon: Users, label: "Bear Groups", view: "groups" },
  { icon: Settings, label: "Settings", view: "settings" },
]

interface LeftSidebarProps {
  activeView: View
  onViewChange: (view: View) => void
}

export function LeftSidebar({ activeView, onViewChange }: LeftSidebarProps) {
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 flex-col gap-1 overflow-y-auto py-4 pr-2 lg:flex">
      {/* User profile */}
      <button
        type="button"
        onClick={() => onViewChange("feed")}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-foreground transition-colors hover:bg-secondary"
      >
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
            AB
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">AnonBear</span>
      </button>

      {/* Nav items */}
      {NAV_ITEMS.map((item) => (
        <button
          key={item.view}
          type="button"
          onClick={() => onViewChange(item.view)}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
            activeView === item.view
              ? "bg-secondary text-foreground font-medium"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
        >
          <item.icon
            className={cn(
              "h-5 w-5",
              activeView === item.view && "text-primary",
            )}
          />
          {item.label}
        </button>
      ))}

      {/* Bottom section */}
      <div className="mt-auto border-t border-border pt-4">
        <div className="rounded-lg border border-border bg-card p-3">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Bear Ranks
          </h3>
          <div className="flex flex-col gap-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">0-30</span>
              <span className="text-muted-foreground">Baby Bear</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">31-50</span>
              <span className="text-muted-foreground">Grizzly</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">51-70</span>
              <span className="text-bear-gold">Polar Bear</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">71-89</span>
              <span className="text-primary">Kodiak</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">90-100</span>
              <span className="font-bold text-bear-crimson">Apocalypse</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

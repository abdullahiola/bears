"use client"

import { useState } from "react"
import { Users, TrendingDown, MessageCircle, UserPlus, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Group {
  id: string
  name: string
  description: string
  members: number
  posts: number
  category: string
}

const GROUPS: Group[] = [
  {
    id: "1",
    name: "SPY Put Degens",
    description:
      "For bears who buy SPY puts every Monday. We lose money but we keep the faith.",
    members: 12400,
    posts: 892,
    category: "Options",
  },
  {
    id: "2",
    name: "Housing Crash 2.0",
    description:
      "Tracking every sign the housing market is about to implode. Again.",
    members: 8700,
    posts: 567,
    category: "Real Estate",
  },
  {
    id: "3",
    name: "Crypto Winters Club",
    description:
      "We called the top. We called the bottom (too early). Permanent bears welcome.",
    members: 21300,
    posts: 2341,
    category: "Crypto",
  },
  {
    id: "4",
    name: "Rate Hike Hawks",
    description: "Discussing Fed policy and why rates are going higher. Always higher.",
    members: 5600,
    posts: 423,
    category: "Macro",
  },
  {
    id: "5",
    name: "Short Sellers Anonymous",
    description:
      "Support group for serial short sellers. Share your wins, losses, and theses.",
    members: 9800,
    posts: 1102,
    category: "Equities",
  },
  {
    id: "6",
    name: "Recession Watchers",
    description:
      "Every economic indicator, charted and debated. The recession is always near.",
    members: 15200,
    posts: 1843,
    category: "Macro",
  },
  {
    id: "7",
    name: "Dollar Doom Preppers",
    description: "Gold bugs, silver stackers, and anyone betting against the USD.",
    members: 6300,
    posts: 478,
    category: "Commodities",
  },
  {
    id: "8",
    name: "VIX Enthusiasts",
    description:
      "For those who get excited when VIX spikes. The higher the better.",
    members: 4200,
    posts: 312,
    category: "Volatility",
  },
]

function formatMembers(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

export function GroupsView() {
  const [joined, setJoined] = useState<Set<string>>(new Set())

  function toggleJoin(id: string) {
    setJoined((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <Users className="h-6 w-6 text-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Bear Groups</h2>
            <p className="text-sm text-muted-foreground">
              Join bearish communities and discuss market doom
            </p>
          </div>
        </div>
      </div>

      {/* Your groups */}
      {joined.size > 0 && (
        <div>
          <h3 className="mb-2 px-1 text-sm font-semibold text-muted-foreground">
            Your Groups ({joined.size})
          </h3>
          <div className="flex flex-col gap-2">
            {GROUPS.filter((g) => joined.has(g.id)).map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                isJoined={true}
                onToggle={() => toggleJoin(group.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Discover groups */}
      <div>
        <h3 className="mb-2 px-1 text-sm font-semibold text-muted-foreground">
          Discover Groups
        </h3>
        <div className="flex flex-col gap-2">
          {GROUPS.filter((g) => !joined.has(g.id)).map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              isJoined={false}
              onToggle={() => toggleJoin(group.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function GroupCard({
  group,
  isJoined,
  onToggle,
}: {
  group: Group
  isJoined: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-bear-crimson/10">
        <TrendingDown className="h-5 w-5 text-bear-crimson" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-foreground">{group.name}</h4>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
            {group.category}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {group.description}
        </p>
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {formatMembers(group.members)} members
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            {group.posts} posts
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
          isJoined
            ? "bg-secondary text-foreground hover:bg-bear-crimson/10 hover:text-bear-crimson"
            : "bg-primary text-primary-foreground hover:bg-primary/80",
        )}
      >
        {isJoined ? (
          <>
            <Check className="h-3.5 w-3.5" />
            Joined
          </>
        ) : (
          <>
            <UserPlus className="h-3.5 w-3.5" />
            Join
          </>
        )}
      </button>
    </div>
  )
}

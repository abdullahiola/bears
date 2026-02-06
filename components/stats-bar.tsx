"use client"

import type { BearPost } from "@/lib/types"
import { BarChart3, TrendingDown, Users } from "lucide-react"

interface StatsBarProps {
  posts: BearPost[]
}

export function StatsBar({ posts }: StatsBarProps) {
  const totalPosts = posts.length
  const scoredPosts = posts.filter((p) => p.score !== null)
  const avgScore =
    scoredPosts.length > 0
      ? Math.round(
          scoredPosts.reduce((acc, p) => acc + (p.score ?? 0), 0) /
            scoredPosts.length
        )
      : 0
  const uniqueAuthors = new Set(posts.map((p) => p.author)).size

  const stats = [
    {
      label: "Total Posts",
      value: totalPosts,
      icon: BarChart3,
    },
    {
      label: "Avg Bearishness",
      value: avgScore,
      icon: TrendingDown,
    },
    {
      label: "Active Bears",
      value: uniqueAuthors,
      icon: Users,
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card px-3 py-3"
        >
          <stat.icon className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-lg font-bold text-foreground">
            {stat.value}
          </span>
          <span className="text-center text-xs text-muted-foreground">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  )
}

"use client"

import { Trophy } from "lucide-react"
import type { BearPost } from "@/lib/types"
import { cn } from "@/lib/utils"

interface LeaderboardProps {
  posts: BearPost[]
}

const RANK_STYLES = [
  "text-bear-gold",
  "text-muted-foreground",
  "text-bear-crimson/70",
]

export function Leaderboard({ posts }: LeaderboardProps) {
  const scoredPosts = posts
    .filter((p) => p.score !== null)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 10)

  if (scoredPosts.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-bear-gold" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Top Bears
          </h2>
        </div>
        <p className="text-center text-xs text-muted-foreground py-6">
          No bears ranked yet. Be the first.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Trophy className="h-4 w-4 text-bear-gold" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Top Bears
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        {scoredPosts.map((post, i) => (
          <div
            key={post.id}
            className="flex items-center gap-3 rounded-md border border-border bg-secondary/30 px-3 py-2"
          >
            <span
              className={cn(
                "font-mono text-sm font-bold w-5 text-center",
                RANK_STYLES[i] ?? "text-muted-foreground"
              )}
            >
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {post.author}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {post.statement}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-mono text-sm font-bold text-bear-crimson">
                {post.score}
              </span>
              <span className="text-xs text-muted-foreground">{post.rank}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

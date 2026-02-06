"use client"

import { Trophy, TrendingDown, Users, BarChart3, Flame } from "lucide-react"
import type { BearPost } from "@/lib/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface RightSidebarProps {
  posts: BearPost[]
}

const RANK_COLORS = ["text-bear-gold", "text-muted-foreground", "text-bear-crimson/70"]

const TRENDING_TOPICS = [
  { tag: "SPY Crash", posts: 142 },
  { tag: "Solana Dead", posts: 89 },
  { tag: "Housing Bubble", posts: 67 },
  { tag: "Rate Hikes", posts: 54 },
  { tag: "Bank Run", posts: 41 },
]

export function RightSidebar({ posts }: RightSidebarProps) {
  const totalPosts = posts.length
  const scoredPosts = posts.filter((p) => p.score !== null)
  const avgScore =
    scoredPosts.length > 0
      ? Math.round(
          scoredPosts.reduce((acc, p) => acc + (p.score ?? 0), 0) / scoredPosts.length
        )
      : 0
  const uniqueAuthors = new Set(posts.map((p) => p.author)).size

  const topBears = posts
    .filter((p) => p.score !== null)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 5)

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col gap-4 overflow-y-auto py-4 pl-2 xl:flex">
      {/* Stats cards */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Forum Stats</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="font-mono text-sm font-bold text-foreground">{totalPosts}</p>
              <p className="text-xs text-muted-foreground">Total Posts</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
              <TrendingDown className="h-4 w-4 text-bear-crimson" />
            </div>
            <div>
              <p className="font-mono text-sm font-bold text-foreground">{avgScore}</p>
              <p className="text-xs text-muted-foreground">Avg Bearishness</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="font-mono text-sm font-bold text-foreground">{uniqueAuthors}</p>
              <p className="text-xs text-muted-foreground">Active Bears</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trending topics */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <Flame className="h-4 w-4 text-bear-crimson" />
          <h3 className="text-sm font-semibold text-foreground">Trending Bearish</h3>
        </div>
        <div className="flex flex-col gap-2">
          {TRENDING_TOPICS.map((topic) => (
            <button
              key={topic.tag}
              type="button"
              className="flex items-center justify-between rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-secondary"
            >
              <span className="text-sm text-foreground">#{topic.tag}</span>
              <span className="text-xs text-muted-foreground">{topic.posts} posts</span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Top Bears Leaderboard */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-bear-gold" />
          <h3 className="text-sm font-semibold text-foreground">Top Bears</h3>
        </div>

        {topBears.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">
            No bears ranked yet
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {topBears.map((post, i) => (
              <div key={post.id} className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "w-4 text-center font-mono text-xs font-bold",
                    RANK_COLORS[i] ?? "text-muted-foreground"
                  )}
                >
                  {i + 1}
                </span>
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-secondary text-foreground text-[10px] font-bold">
                    {post.author.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-medium text-foreground">
                    {post.author}
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-bear-crimson">
                  {post.score}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}

"use client"

import { Trophy, TrendingDown, Medal, Crown, Award } from "lucide-react"
import type { BearPost } from "@/lib/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScoreBadge } from "@/components/score-badge"
import { cn } from "@/lib/utils"

interface LeaderboardViewProps {
  posts: BearPost[]
}

const PLACE_ICONS = [Crown, Medal, Award]
const PLACE_COLORS = [
  "text-bear-gold",
  "text-muted-foreground",
  "text-bear-crimson/70",
]

export function LeaderboardView({ posts }: LeaderboardViewProps) {
  const scoredPosts = posts
    .filter((p) => p.score !== null)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

  const totalPosts = posts.length
  const avgScore =
    scoredPosts.length > 0
      ? Math.round(
          scoredPosts.reduce((acc, p) => acc + (p.score ?? 0), 0) /
            scoredPosts.length,
        )
      : 0

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bear-gold/20">
            <Trophy className="h-6 w-6 text-bear-gold" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Bear Leaderboard</h2>
            <p className="text-sm text-muted-foreground">
              The most bearish takes ranked by AI
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-secondary p-3 text-center">
            <p className="font-mono text-lg font-bold text-foreground">{totalPosts}</p>
            <p className="text-xs text-muted-foreground">Total Posts</p>
          </div>
          <div className="rounded-lg bg-secondary p-3 text-center">
            <p className="font-mono text-lg font-bold text-bear-crimson">{avgScore}</p>
            <p className="text-xs text-muted-foreground">Avg Score</p>
          </div>
          <div className="rounded-lg bg-secondary p-3 text-center">
            <p className="font-mono text-lg font-bold text-foreground">
              {scoredPosts.length}
            </p>
            <p className="text-xs text-muted-foreground">Ranked</p>
          </div>
        </div>
      </div>

      {/* Podium top 3 */}
      {scoredPosts.length >= 3 && (
        <div className="grid grid-cols-3 gap-3">
          {[1, 0, 2].map((podiumIndex) => {
            const post = scoredPosts[podiumIndex]
            const Icon = PLACE_ICONS[podiumIndex]
            const color = PLACE_COLORS[podiumIndex]
            return (
              <div
                key={post.id}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4",
                  podiumIndex === 0 && "row-span-1 border-bear-gold/30",
                )}
              >
                <Icon className={cn("h-5 w-5", color)} />
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-secondary text-foreground font-bold">
                    {post.author.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-center text-sm font-semibold text-foreground truncate w-full">
                  {post.author}
                </p>
                <span className="font-mono text-2xl font-bold text-bear-crimson">
                  {post.score}
                </span>
                {post.rank && (
                  <span className="text-xs text-muted-foreground">{post.rank}</span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Full list */}
      {scoredPosts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card py-16">
          <TrendingDown className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No ranked posts yet. Be the first to post a bearish take!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {scoredPosts.map((post, i) => (
            <div
              key={post.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
            >
              <span
                className={cn(
                  "w-6 text-center font-mono text-sm font-bold",
                  i < 3
                    ? PLACE_COLORS[i]
                    : "text-muted-foreground",
                )}
              >
                #{i + 1}
              </span>
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-secondary text-foreground text-xs font-bold">
                  {post.author.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {post.author}
                  </span>
                  {post.score !== null && post.rank && (
                    <ScoreBadge score={post.score} rank={post.rank} />
                  )}
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {post.statement}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-mono text-lg font-bold text-bear-crimson">
                  {post.score}
                </span>
                <span className="text-xs text-muted-foreground">
                  {post.upvotes} upvotes
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

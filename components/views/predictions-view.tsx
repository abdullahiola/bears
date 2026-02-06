"use client"

import { useState } from "react"
import { BarChart3, ThumbsUp, ThumbsDown, Clock, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Prediction {
  id: string
  question: string
  category: string
  deadline: string
  yesVotes: number
  noVotes: number
  author: string
}

const INITIAL_PREDICTIONS: Prediction[] = [
  {
    id: "1",
    question: "Will SPY drop below $400 by Q3 2026?",
    category: "Equities",
    deadline: "Sep 30, 2026",
    yesVotes: 234,
    noVotes: 89,
    author: "DoomTrader99",
  },
  {
    id: "2",
    question: "Will Solana fall below $50 this year?",
    category: "Crypto",
    deadline: "Dec 31, 2026",
    yesVotes: 178,
    noVotes: 312,
    author: "CrashProphet",
  },
  {
    id: "3",
    question: "Will the Fed raise rates again before summer?",
    category: "Macro",
    deadline: "Jun 30, 2026",
    yesVotes: 156,
    noVotes: 201,
    author: "BearMomma",
  },
  {
    id: "4",
    question: "Will a major US bank fail in 2026?",
    category: "Banking",
    deadline: "Dec 31, 2026",
    yesVotes: 89,
    noVotes: 267,
    author: "ShortKing",
  },
  {
    id: "5",
    question: "Will housing prices drop 20% from ATH?",
    category: "Real Estate",
    deadline: "Dec 31, 2026",
    yesVotes: 198,
    noVotes: 142,
    author: "HousingBear",
  },
  {
    id: "6",
    question: "Will Bitcoin drop below $30K before year end?",
    category: "Crypto",
    deadline: "Dec 31, 2026",
    yesVotes: 67,
    noVotes: 389,
    author: "GoldBugBear",
  },
]

export function PredictionsView() {
  const [predictions, setPredictions] = useState<Prediction[]>(INITIAL_PREDICTIONS)
  const [voted, setVoted] = useState<Record<string, "yes" | "no">>({})
  const [filter, setFilter] = useState<string>("All")

  const categories = [
    "All",
    ...Array.from(new Set(predictions.map((p) => p.category))),
  ]

  const filtered =
    filter === "All"
      ? predictions
      : predictions.filter((p) => p.category === filter)

  function vote(id: string, type: "yes" | "no") {
    if (voted[id]) return
    setVoted((prev) => ({ ...prev, [id]: type }))
    setPredictions((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        return {
          ...p,
          yesVotes: type === "yes" ? p.yesVotes + 1 : p.yesVotes,
          noVotes: type === "no" ? p.noVotes + 1 : p.noVotes,
        }
      }),
    )
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Bear Predictions
            </h2>
            <p className="text-sm text-muted-foreground">
              Vote on bearish market predictions
            </p>
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
              filter === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Predictions list */}
      <div className="flex flex-col gap-3">
        {filtered.map((pred) => {
          const total = pred.yesVotes + pred.noVotes
          const yesPct = total > 0 ? (pred.yesVotes / total) * 100 : 50
          const userVote = voted[pred.id]

          return (
            <div
              key={pred.id}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <p className="text-sm font-semibold leading-snug text-foreground">
                  {pred.question}
                </p>
                <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {pred.category}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-bear-crimson transition-all duration-500"
                  style={{ width: `${yesPct}%` }}
                />
              </div>

              <div className="mb-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-bear-crimson">
                  Yes: {pred.yesVotes} ({yesPct.toFixed(0)}%)
                </span>
                <span className="font-semibold text-emerald-500">
                  No: {pred.noVotes} ({(100 - yesPct).toFixed(0)}%)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => vote(pred.id, "yes")}
                    disabled={!!userVote}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                      userVote === "yes"
                        ? "bg-bear-crimson/20 text-bear-crimson"
                        : userVote
                          ? "cursor-not-allowed bg-secondary text-muted-foreground opacity-50"
                          : "bg-secondary text-muted-foreground hover:bg-bear-crimson/10 hover:text-bear-crimson",
                    )}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    Yes (Bearish)
                  </button>
                  <button
                    type="button"
                    onClick={() => vote(pred.id, "no")}
                    disabled={!!userVote}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                      userVote === "no"
                        ? "bg-emerald-500/20 text-emerald-500"
                        : userVote
                          ? "cursor-not-allowed bg-secondary text-muted-foreground opacity-50"
                          : "bg-secondary text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-500",
                    )}
                  >
                    <ThumbsDown className="h-3.5 w-3.5" />
                    No (Bullish)
                  </button>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {pred.deadline}
                </div>
              </div>

              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingDown className="h-3 w-3" />
                by {pred.author} &middot; {total} votes
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

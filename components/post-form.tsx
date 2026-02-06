"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, TrendingDown, ImageIcon, BarChart3, Smile } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface PostFormProps {
  onSubmit: (author: string, statement: string) => Promise<void>
  isSubmitting: boolean
}

export function PostForm({ onSubmit, isSubmitting }: PostFormProps) {
  const [author, setAuthor] = useState("")
  const [statement, setStatement] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!author.trim() || !statement.trim()) return
    await onSubmit(author.trim(), statement.trim())
    setStatement("")
    setIsExpanded(false)
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <form onSubmit={handleSubmit}>
        {/* Top row: avatar + input */}
        <div className="flex items-start gap-3 p-4">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
              {author ? author.charAt(0).toUpperCase() : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col gap-2">
            {!isExpanded ? (
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="h-10 w-full rounded-full bg-secondary px-4 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary/80"
              >
                {"What's your bearish take today?"}
              </button>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Your bear alias..."
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  maxLength={30}
                  className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <textarea
                  placeholder="Write your most bearish market take... (the more doom, the higher your score)"
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  maxLength={500}
                  rows={4}
                  autoFocus
                  className="resize-none rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">
                    {statement.length}/500
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom action bar */}
        <Separator />
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary"
            >
              <TrendingDown className="h-4 w-4 text-bear-crimson" />
              <span className="hidden sm:inline">Bear Take</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary"
            >
              <ImageIcon className="h-4 w-4 text-emerald-500" />
              <span className="hidden sm:inline">Chart</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary"
            >
              <BarChart3 className="h-4 w-4 text-bear-gold" />
              <span className="hidden sm:inline">Poll</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary"
            >
              <Smile className="h-4 w-4 text-bear-gold" />
              <span className="hidden sm:inline">Feeling</span>
            </button>
          </div>

          {isExpanded && (
            <Button
              type="submit"
              disabled={!author.trim() || !statement.trim() || isSubmitting}
              size="sm"
              className="rounded-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Scoring...
                </>
              ) : (
                "Post & Score"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

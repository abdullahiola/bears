"use client"

import { Bookmark } from "lucide-react"
import type { BearPost } from "@/lib/types"
import { BearPostCard } from "@/components/bear-post-card"

interface SavedViewProps {
  savedPosts: BearPost[]
  onUpvote: (id: string) => void
  onUnsave: (id: string) => void
}

export function SavedView({ savedPosts, onUpvote, onUnsave }: SavedViewProps) {
  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bear-gold/20">
            <Bookmark className="h-6 w-6 text-bear-gold" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Saved Posts</h2>
            <p className="text-sm text-muted-foreground">
              Your bookmarked bearish takes ({savedPosts.length})
            </p>
          </div>
        </div>
      </div>

      {savedPosts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card py-16">
          <Bookmark className="h-8 w-8 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">No saved posts yet</p>
            <p className="text-xs text-muted-foreground">
              Bookmark posts from the feed to save them here
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {savedPosts.map((post) => (
            <div key={post.id} className="relative">
              <BearPostCard post={post} onUpvote={onUpvote} />
              <button
                type="button"
                onClick={() => onUnsave(post.id)}
                className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-bear-crimson/10 px-2 py-1 text-xs font-semibold text-bear-crimson transition-colors hover:bg-bear-crimson/20"
              >
                <Bookmark className="h-3 w-3 fill-current" />
                Unsave
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

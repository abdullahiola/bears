"use client"

import type { BearPost } from "@/lib/types"
import { BearPostCard } from "./bear-post-card"
import { MessageSquare } from "lucide-react"

interface PostFeedProps {
  posts: BearPost[]
  onUpvote: (id: string) => void
  onSave?: (id: string) => void
  savedIds?: Set<string>
}

export function PostFeed({ posts, onUpvote, onSave, savedIds }: PostFeedProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card py-16">
        <MessageSquare className="h-8 w-8 text-muted-foreground" />
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">No bearish takes yet</p>
          <p className="text-xs text-muted-foreground">
            Be the first to post your doom prediction
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <BearPostCard
          key={post.id}
          post={post}
          onUpvote={onUpvote}
          onSave={onSave}
          isSaved={savedIds?.has(post.id)}
        />
      ))}
    </div>
  )
}

"use client"

import React from "react"

import { useState, useEffect } from "react"
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Clock,
  Bookmark,
  Send,
  Copy,
  Check,
} from "lucide-react"
import type { BearPost, Comment } from "@/lib/types"
import { addComment, getComments } from "@/lib/store"
import { ScoreBadge } from "./score-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface BearPostCardProps {
  post: BearPost
  onUpvote: (id: string) => void
  onSave?: (id: string) => void
  isSaved?: boolean
}

export function BearPostCard({
  post,
  onUpvote,
  onSave,
  isSaved = false,
}: BearPostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState("")
  const [copied, setCopied] = useState(false)
  const [upvoted, setUpvoted] = useState(false)
  const [isLoadingComments, setIsLoadingComments] = useState(false)

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  })

  // Load comments from API when comments section is opened
  useEffect(() => {
    async function fetchComments() {
      if (showComments && comments.length === 0) {
        setIsLoadingComments(true)
        const data = await getComments(post.id)
        setComments(data)
        setIsLoadingComments(false)
      }
    }
    fetchComments()
  }, [showComments, post.id, comments.length])

  function handleUpvote() {
    if (upvoted) return
    setUpvoted(true)
    onUpvote(post.id)
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault()
    if (!commentText.trim()) return

    const newComment: Comment = {
      id: crypto.randomUUID(),
      author: "AnonBear",
      text: commentText.trim(),
      createdAt: new Date().toISOString(),
    }

    // Optimistic update
    setComments((prev) => [...prev, newComment])
    setCommentText("")

    // Save to API
    await addComment(post.id, newComment)
  }

  function handleShare() {
    const text = `[Bear Capital] ${post.author} says: "${post.statement}" (Bearishness: ${post.score ?? "unscored"})`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <article className="rounded-xl border border-border bg-card">
      {/* Post header */}
      <div className="flex items-start justify-between p-4 pb-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-secondary text-foreground text-sm font-bold">
              {post.author.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {post.author}
              </span>
              {post.score !== null && post.rank && (
                <ScoreBadge score={post.score} rank={post.rank} />
              )}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="text-xs">{timeAgo}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onSave && (
            <button
              type="button"
              onClick={() => onSave(post.id)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                isSaved
                  ? "text-bear-gold hover:bg-secondary"
                  : "text-muted-foreground hover:bg-secondary",
              )}
              aria-label={isSaved ? "Unsave post" : "Save post"}
            >
              <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
            </button>
          )}
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary"
            aria-label="More options"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Post content */}
      <div className="px-4 py-3">
        <p className="text-sm leading-relaxed text-foreground">{post.statement}</p>
      </div>

      {/* AI Analysis */}
      {post.reasoning && (
        <div className="mx-4 mb-3 rounded-lg border border-border bg-secondary/50 px-3 py-2.5">
          <p className="font-mono text-xs text-muted-foreground">
            <span className="font-semibold text-bear-crimson">AI ANALYSIS:</span>{" "}
            {post.reasoning}
          </p>
        </div>
      )}

      {/* Reaction counts */}
      <div className="flex items-center justify-between px-4 pb-2">
        <div className="flex items-center gap-1">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            {"<"}
          </span>
          <span className="text-xs text-muted-foreground">
            {post.upvotes} bears agree
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className="text-xs text-muted-foreground hover:underline"
        >
          {comments.length} comments
        </button>
      </div>

      {/* Action bar */}
      <Separator className="mx-4 w-auto" />
      <div className="flex items-center px-2 py-1">
        <button
          type="button"
          onClick={handleUpvote}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm transition-colors",
            upvoted
              ? "text-primary font-medium"
              : "text-muted-foreground hover:bg-secondary",
          )}
        >
          <ThumbsUp className={cn("h-4 w-4", upvoted && "fill-current")} />
          <span>Bearish</span>
        </button>
        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm transition-colors",
            showComments
              ? "text-primary font-medium"
              : "text-muted-foreground hover:bg-secondary",
          )}
        >
          <MessageCircle className="h-4 w-4" />
          <span>Comment</span>
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-500" />
              <span className="text-emerald-500">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="border-t border-border px-4 py-3">
          {/* Loading state */}
          {isLoadingComments && (
            <div className="mb-3 text-center text-xs text-muted-foreground">
              Loading comments...
            </div>
          )}

          {/* Existing comments */}
          {comments.length > 0 && (
            <div className="mb-3 flex flex-col gap-2">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className="bg-secondary text-foreground text-[10px] font-bold">
                      {comment.author.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg bg-secondary px-3 py-2">
                    <span className="text-xs font-semibold text-foreground">
                      {comment.author}
                    </span>
                    <p className="text-xs text-foreground">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment input */}
          <form onSubmit={handleComment} className="flex items-center gap-2">
            <Avatar className="h-7 w-7 shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                AB
              </AvatarFallback>
            </Avatar>
            <div className="relative flex-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="h-8 w-full rounded-full bg-secondary pl-3 pr-9 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-primary disabled:opacity-30"
                aria-label="Send comment"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </article>
  )
}

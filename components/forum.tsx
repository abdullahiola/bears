"use client"

import { useCallback, useEffect, useState } from "react"
import type { BearPost, ScoreResult } from "@/lib/types"
import { addPost, getPosts, updatePost, upvotePost } from "@/lib/store"
import { PostForm } from "./post-form"
import { PostFeed } from "./post-feed"
import { LeftSidebar } from "./left-sidebar"
import { RightSidebar } from "./right-sidebar"
import { BearReels } from "./bear-reels"

export function Forum() {
  const [posts, setPosts] = useState<BearPost[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setPosts(getPosts())
  }, [])

  const handleUpvote = useCallback((id: string) => {
    const updated = upvotePost(id)
    setPosts(updated)
  }, [])

  async function handleSubmit(author: string, statement: string) {
    setIsSubmitting(true)

    const newPost: BearPost = {
      id: crypto.randomUUID(),
      author,
      statement,
      score: null,
      rank: null,
      reasoning: null,
      createdAt: new Date().toISOString(),
      upvotes: 0,
    }

    const withNew = addPost(newPost)
    setPosts(withNew)

    try {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statement }),
      })

      if (response.ok) {
        const result: ScoreResult = await response.json()
        const updated = updatePost(newPost.id, {
          score: result.score,
          rank: result.rank,
          reasoning: result.reasoning,
        })
        setPosts(updated)
      }
    } catch {
      // Score failed, post still visible without score
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-7xl justify-center px-4">
      <LeftSidebar />

      {/* Center Feed */}
      <main className="flex w-full max-w-xl flex-col gap-4 py-4 lg:px-4">
        <BearReels />
        <PostForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        <PostFeed posts={posts} onUpvote={handleUpvote} />
      </main>

      <RightSidebar posts={posts} />
    </div>
  )
}

"use client"

import { useCallback, useEffect, useState } from "react"
import type { BearPost, ScoreResult } from "@/lib/types"
import { addPost, getPosts, savePosts, updatePost, upvotePost } from "@/lib/store"
import { PostForm } from "./post-form"
import { PostFeed } from "./post-feed"
import { LeftSidebar, type View } from "./left-sidebar"
import { RightSidebar } from "./right-sidebar"
import { BearReels } from "./bear-reels"
import { ReelsView } from "./views/reels-view"
import { LeaderboardView } from "./views/leaderboard-view"
import { MarketsView } from "./views/markets-view"
import { PredictionsView } from "./views/predictions-view"
import { SavedView } from "./views/saved-view"
import { GroupsView } from "./views/groups-view"
import { SettingsView } from "./views/settings-view"
import {
  Home,
  Flame,
  Trophy,
  TrendingDown,
  BarChart3,
  Bookmark,
  Users,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

const MOBILE_NAV: { icon: typeof Home; label: string; view: View }[] = [
  { icon: Home, label: "Feed", view: "feed" },
  { icon: Flame, label: "Reels", view: "reels" },
  { icon: Trophy, label: "Board", view: "leaderboard" },
  { icon: TrendingDown, label: "Markets", view: "markets" },
  { icon: BarChart3, label: "More", view: "predictions" },
]

export function Forum() {
  const [posts, setPosts] = useState<BearPost[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeView, setActiveView] = useState<View>("feed")
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    setPosts(getPosts())
  }, [])

  const handleUpvote = useCallback((id: string) => {
    const updated = upvotePost(id)
    setPosts(updated)
  }, [])

  const handleSave = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const handleClearData = useCallback(() => {
    savePosts([])
    setPosts([])
    setSavedIds(new Set())
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

  const savedPosts = posts.filter((p) => savedIds.has(p.id))

  function renderView() {
    switch (activeView) {
      case "feed":
        return (
          <>
            <BearReels />
            <PostForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            <PostFeed
              posts={posts}
              onUpvote={handleUpvote}
              onSave={handleSave}
              savedIds={savedIds}
            />
          </>
        )
      case "reels":
        return <ReelsView />
      case "leaderboard":
        return <LeaderboardView posts={posts} />
      case "markets":
        return <MarketsView />
      case "predictions":
        return <PredictionsView />
      case "saved":
        return (
          <SavedView
            savedPosts={savedPosts}
            onUpvote={handleUpvote}
            onUnsave={handleSave}
          />
        )
      case "groups":
        return <GroupsView />
      case "settings":
        return <SettingsView onClearData={handleClearData} />
      default:
        return null
    }
  }

  const showRightSidebar = activeView === "feed"

  return (
    <>
      <div className="mx-auto flex max-w-7xl justify-center px-4 pb-16 lg:pb-0">
        <LeftSidebar activeView={activeView} onViewChange={setActiveView} />

        {/* Center content */}
        <main className="flex w-full max-w-xl flex-col gap-4 py-4 lg:px-4">
          {renderView()}
        </main>

        {showRightSidebar && <RightSidebar posts={posts} />}
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm lg:hidden">
        <div className="flex items-center justify-around px-2 py-1">
          {MOBILE_NAV.map((item) => (
            <button
              key={item.view}
              type="button"
              onClick={() => setActiveView(item.view)}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] transition-colors",
                activeView === item.view
                  ? "text-primary font-semibold"
                  : "text-muted-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  activeView === item.view && "text-primary",
                )}
              />
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}

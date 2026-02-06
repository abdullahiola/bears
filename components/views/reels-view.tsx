"use client"

import React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  MessageCircle,
  Share2,
  TrendingDown,
  Eye,
  ChevronUp,
  ChevronDown,
  Upload,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getVideos, getVideoUrl } from "@/lib/store"

interface Reel {
  id: string
  author: string
  title: string
  views: string
  tag: string
  tagColor: string
  score: number
  videoUrl: string
}

const STOCK_REELS: Reel[] = [
  {
    id: "1",
    author: "DoomTrader99",
    title: "SPY to $200 by March - Here's my full thesis",
    views: "42.1K",
    tag: "MEGA BEAR",
    tagColor: "bg-bear-crimson text-primary-foreground",
    score: 97,
    videoUrl:
      "https://videos.pexels.com/video-files/7579968/7579968-uhd_1440_2560_25fps.mp4",
  },
  {
    id: "2",
    author: "CrashProphet",
    title: "Why the banking system collapses in Q2",
    views: "28.7K",
    tag: "FINANCIAL DOOM",
    tagColor: "bg-bear-blood text-primary-foreground",
    score: 91,
    videoUrl:
      "https://videos.pexels.com/video-files/7947464/7947464-uhd_1440_2560_25fps.mp4",
  },
  {
    id: "3",
    author: "ShortKing",
    title: "I shorted everything. Here's the chart.",
    views: "18.3K",
    tag: "ALL IN SHORT",
    tagColor: "bg-primary text-primary-foreground",
    score: 84,
    videoUrl:
      "https://videos.pexels.com/video-files/6801940/6801940-uhd_1440_2560_25fps.mp4",
  },
  {
    id: "4",
    author: "BearMomma",
    title: "Housing market 2008 x10 incoming",
    views: "33.9K",
    tag: "HOUSING",
    tagColor: "bg-bear-crimson text-primary-foreground",
    score: 88,
    videoUrl:
      "https://videos.pexels.com/video-files/6774204/6774204-uhd_1440_2560_25fps.mp4",
  },
  {
    id: "5",
    author: "VolatilityKing",
    title: "VIX to 80 - the math doesn't lie",
    views: "15.2K",
    tag: "VOLATILITY",
    tagColor: "bg-bear-blood text-primary-foreground",
    score: 79,
    videoUrl:
      "https://videos.pexels.com/video-files/7579554/7579554-uhd_1440_2560_25fps.mp4",
  },
  {
    id: "6",
    author: "GoldBugBear",
    title: "Dollar collapse timeline - my full DD",
    views: "51.4K",
    tag: "DOLLAR DEATH",
    tagColor: "bg-bear-crimson text-primary-foreground",
    score: 93,
    videoUrl:
      "https://videos.pexels.com/video-files/6801489/6801489-uhd_1440_2560_25fps.mp4",
  },
  {
    id: "7",
    author: "RecessionRadar",
    title: "Every indicator is screaming sell",
    views: "22.8K",
    tag: "RECESSION",
    tagColor: "bg-primary text-primary-foreground",
    score: 86,
    videoUrl:
      "https://videos.pexels.com/video-files/7947442/7947442-uhd_1440_2560_25fps.mp4",
  },
]

export function ReelsView() {
  const [reels, setReels] = useState<Reel[]>(STOCK_REELS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch videos from server on mount
  useEffect(() => {
    async function fetchVideos() {
      const serverVideos = await getVideos()
      if (serverVideos.length > 0) {
        const serverReels: Reel[] = serverVideos.map((v) => ({
          id: `server-${v.id}`,
          author: "Bear Capital",
          title: v.title,
          views: "0",
          tag: "LOCAL",
          tagColor: "bg-bear-gold text-background",
          score: 80 + Math.floor(Math.random() * 15),
          videoUrl: getVideoUrl(v.url),
        }))
        setReels([...serverReels, ...STOCK_REELS])
      }
    }
    fetchVideos()
  }, [])

  const reel = reels[currentIndex]

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i < reels.length - 1 ? i + 1 : 0))
    setProgress(0)
  }, [reels.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : reels.length - 1))
    setProgress(0)
  }, [reels.length])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault()
        goNext()
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault()
        goPrev()
      }
      if (e.key === " ") {
        e.preventDefault()
        togglePlayPause()
      }
      if (e.key === "m") {
        setIsMuted((p) => !p)
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [goNext, goPrev])

  useEffect(() => {
    if (!videoRef.current) return
    videoRef.current.load()
    videoRef.current.play().catch(() => { })
    setIsPlaying(true)
  }, [currentIndex])

  function togglePlayPause() {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => { })
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  function handleTimeUpdate() {
    if (!videoRef.current) return
    const pct =
      (videoRef.current.currentTime / (videoRef.current.duration || 1)) * 100
    setProgress(pct)
  }

  function toggleLike(id: string) {
    setLiked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith("video/")) return
    const url = URL.createObjectURL(file)
    const newReel: Reel = {
      id: crypto.randomUUID(),
      author: "You",
      title: file.name.replace(/\.[^/.]+$/, ""),
      views: "0",
      tag: "YOUR TAKE",
      tagColor: "bg-bear-gold text-background",
      score: 0,
      videoUrl: url,
    }
    setReels((prev) => [newReel, ...prev])
    setCurrentIndex(0)
    setProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  if (!reel) return null

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* Header */}
      <div className="flex w-full max-w-md items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Bear Reels</h2>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {currentIndex + 1} / {reels.length}
          </span>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-8 items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/80"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleUpload}
            className="hidden"
            aria-label="Upload a video reel"
          />
        </div>
      </div>

      {/* Reel player */}
      <div className="relative flex h-[75vh] max-h-[680px] w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Progress bar */}
        <div className="absolute left-0 right-0 top-0 z-30 h-1 bg-secondary">
          <div
            className="h-full bg-bear-crimson transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Video */}
        <div
          className="relative flex-1 cursor-pointer"
          onClick={togglePlayPause}
          onKeyDown={(e) => e.key === "Enter" && togglePlayPause()}
          role="button"
          tabIndex={0}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          <video
            ref={videoRef}
            src={reel.videoUrl}
            className="h-full w-full object-cover"
            muted={isMuted}
            loop
            playsInline
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            crossOrigin="anonymous"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/70" />

          {/* Pause indicator */}
          {!isPlaying && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background/40 backdrop-blur-sm">
                <Play className="h-8 w-8 fill-foreground text-foreground" />
              </div>
            </div>
          )}

          {/* Top info */}
          <div className="absolute left-0 right-0 top-4 z-20 flex items-center gap-2 px-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bear-crimson font-mono text-xs font-bold text-primary-foreground">
              {reel.author.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-bold text-foreground drop-shadow-lg">
              {reel.author}
            </span>
            <span
              className={cn(
                "ml-auto rounded px-2 py-0.5 text-[10px] font-bold",
                reel.tagColor,
              )}
            >
              {reel.tag}
            </span>
          </div>

          {/* Right side actions */}
          <div className="absolute bottom-24 right-3 z-20 flex flex-col items-center gap-5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                toggleLike(reel.id)
              }}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full bg-background/30 backdrop-blur-sm transition-colors",
                  liked.has(reel.id) && "bg-bear-crimson/80",
                )}
              >
                <Heart
                  className={cn(
                    "h-5 w-5 text-foreground",
                    liked.has(reel.id) && "fill-foreground",
                  )}
                />
              </div>
              <span className="text-[10px] font-semibold text-foreground drop-shadow-lg">
                {liked.has(reel.id) ? "1" : "0"}
              </span>
            </button>

            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center gap-1"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/30 backdrop-blur-sm">
                <MessageCircle className="h-5 w-5 text-foreground" />
              </div>
              <span className="text-[10px] font-semibold text-foreground drop-shadow-lg">
                0
              </span>
            </button>

            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center gap-1"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background/30 backdrop-blur-sm">
                <Share2 className="h-5 w-5 text-foreground" />
              </div>
              <span className="text-[10px] font-semibold text-foreground drop-shadow-lg">
                Share
              </span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsMuted(!isMuted)
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-background/30 backdrop-blur-sm"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5 text-foreground" />
              ) : (
                <Volume2 className="h-5 w-5 text-foreground" />
              )}
            </button>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-14 z-20 flex flex-col gap-2 p-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold text-bear-crimson drop-shadow-lg">
                {reel.score}
              </span>
              <TrendingDown className="h-4 w-4 text-bear-crimson" />
              <span className="text-xs text-muted-foreground drop-shadow-lg">
                bearish score
              </span>
            </div>
            <p className="text-sm font-semibold leading-snug text-foreground drop-shadow-lg">
              {reel.title}
            </p>
            <div className="flex items-center gap-2">
              <Eye className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{reel.views} views</span>
            </div>
          </div>
        </div>

        {/* Nav arrows on sides */}
        <div className="absolute left-2 top-1/2 z-30 -translate-y-1/2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-background/30 text-foreground backdrop-blur-sm transition-colors hover:bg-background/50"
            aria-label="Previous reel"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute right-2 top-1/2 z-30 -translate-y-1/2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-background/30 text-foreground backdrop-blur-sm transition-colors hover:bg-background/50"
            aria-label="Next reel"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Reel thumbnails */}
      <div className="flex w-full max-w-md gap-2 overflow-x-auto py-2 scrollbar-none">
        {reels.map((r, i) => (
          <button
            key={r.id}
            type="button"
            onClick={() => {
              setCurrentIndex(i)
              setProgress(0)
            }}
            className={cn(
              "relative h-16 w-12 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
              i === currentIndex
                ? "border-primary ring-1 ring-primary/30"
                : "border-border opacity-60 hover:opacity-100",
            )}
          >
            <video
              src={r.videoUrl}
              className="h-full w-full object-cover"
              muted
              playsInline
              preload="metadata"
              crossOrigin="anonymous"
            />
            <div className="pointer-events-none absolute inset-0 bg-background/30" />
            <span className="absolute bottom-0.5 right-0.5 font-mono text-[8px] font-bold text-bear-crimson drop-shadow-lg">
              {r.score}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

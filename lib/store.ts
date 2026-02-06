import type { BearPost } from "./types"

const STORAGE_KEY = "bear-capital-posts"

export function getPosts(): BearPost[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function savePosts(posts: BearPost[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}

export function addPost(post: BearPost): BearPost[] {
  const posts = getPosts()
  const updated = [post, ...posts]
  savePosts(updated)
  return updated
}

export function updatePost(id: string, updates: Partial<BearPost>): BearPost[] {
  const posts = getPosts()
  const updated = posts.map((p) => (p.id === id ? { ...p, ...updates } : p))
  savePosts(updated)
  return updated
}

export function upvotePost(id: string): BearPost[] {
  const posts = getPosts()
  const updated = posts.map((p) =>
    p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p
  )
  savePosts(updated)
  return updated
}

import type { BearPost } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"

// Headers to bypass ngrok browser warning
const fetchHeaders = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true'
}

export async function getPosts(): Promise<BearPost[]> {
  try {
    const response = await fetch(`${API_URL}/api/posts`, { headers: fetchHeaders })
    if (!response.ok) return []
    return await response.json()
  } catch {
    return []
  }
}

export async function addPost(post: BearPost): Promise<BearPost[]> {
  try {
    await fetch(`${API_URL}/api/posts`, {
      method: "POST",
      headers: fetchHeaders,
      body: JSON.stringify(post),
    })
    return await getPosts()
  } catch {
    return []
  }
}

export async function updatePost(id: string, updates: Partial<BearPost>): Promise<BearPost[]> {
  try {
    await fetch(`${API_URL}/api/posts/${id}`, {
      method: "PUT",
      headers: fetchHeaders,
      body: JSON.stringify(updates),
    })
    return await getPosts()
  } catch {
    return []
  }
}

export async function upvotePost(id: string): Promise<BearPost[]> {
  try {
    await fetch(`${API_URL}/api/posts/${id}/upvote`, {
      method: "POST",
      headers: fetchHeaders,
    })
    return await getPosts()
  } catch {
    return []
  }
}

export async function addComment(
  postId: string,
  comment: { id: string; author: string; text: string; createdAt: string }
): Promise<void> {
  try {
    await fetch(`${API_URL}/api/posts/${postId}/comments`, {
      method: "POST",
      headers: fetchHeaders,
      body: JSON.stringify(comment),
    })
  } catch {
    // Comment failed silently
  }
}

export async function getComments(
  postId: string
): Promise<{ id: string; author: string; text: string; createdAt: string }[]> {
  try {
    const response = await fetch(`${API_URL}/api/posts/${postId}/comments`, { headers: fetchHeaders })
    if (!response.ok) return []
    return await response.json()
  } catch {
    return []
  }
}

export interface VideoInfo {
  id: string
  filename: string
  title: string
  url: string
}

export async function getVideos(): Promise<VideoInfo[]> {
  try {
    const response = await fetch(`${API_URL}/api/videos`, { headers: fetchHeaders })
    if (!response.ok) return []
    return await response.json()
  } catch {
    return []
  }
}

export function getVideoUrl(path: string): string {
  return `${API_URL}${path}`
}

// Legacy function for compatibility (now a no-op since we use API)
export function savePosts(_posts: BearPost[]) {
  // No-op - data is now saved via API
}

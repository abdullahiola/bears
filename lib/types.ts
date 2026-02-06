export interface BearPost {
  id: string
  author: string
  statement: string
  score: number | null
  rank: string | null
  reasoning: string | null
  createdAt: string
  upvotes: number
}

export type BearRank =
  | "Baby Bear"
  | "Grizzly"
  | "Polar Bear"
  | "Kodiak"
  | "Apocalypse Bear"

export interface ScoreResult {
  score: number
  rank: BearRank
  reasoning: string
}

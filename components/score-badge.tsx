import { cn } from "@/lib/utils"

interface ScoreBadgeProps {
  score: number
  rank: string
}

function getScoreColor(score: number) {
  if (score >= 90) return "border-bear-crimson bg-bear-crimson/15 text-bear-crimson"
  if (score >= 70) return "border-primary bg-primary/15 text-primary"
  if (score >= 50) return "border-bear-gold/60 bg-bear-gold/10 text-bear-gold"
  return "border-muted-foreground/40 bg-muted text-muted-foreground"
}

export function ScoreBadge({ score, rank }: ScoreBadgeProps) {
  return (
    <div className={cn("flex items-center gap-1.5 rounded-full border px-2 py-0.5", getScoreColor(score))}>
      <span className="font-mono text-xs font-bold">{score}</span>
      <span className="text-xs">{rank}</span>
    </div>
  )
}

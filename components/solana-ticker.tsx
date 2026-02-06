"use client"

import { useEffect, useState } from "react"
import { TrendingDown, TrendingUp } from "lucide-react"

interface SolanaData {
  price: number
  change24h: number
}

export function SolanaTicker() {
  const [data, setData] = useState<SolanaData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true",
          { cache: "no-store" }
        )
        if (!res.ok) throw new Error("Failed to fetch")
        const json = await res.json()
        setData({
          price: json.solana.usd,
          change24h: json.solana.usd_24h_change,
        })
        setError(false)
      } catch {
        setError(true)
      }
    }

    fetchPrice()
    const interval = setInterval(fetchPrice, 30000)
    return () => clearInterval(interval)
  }, [])

  if (error || !data) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-1.5">
        <span className="font-mono text-xs text-muted-foreground">
          SOL {error ? "---" : "..."}
        </span>
      </div>
    )
  }

  const isDown = data.change24h < 0

  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-1.5">
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-xs font-bold text-foreground">SOL</span>
        <span className="font-mono text-xs text-foreground">
          ${data.price.toFixed(2)}
        </span>
      </div>
      <div
        className={`flex items-center gap-0.5 ${
          isDown ? "text-bear-crimson" : "text-emerald-500"
        }`}
      >
        {isDown ? (
          <TrendingDown className="h-3 w-3" />
        ) : (
          <TrendingUp className="h-3 w-3" />
        )}
        <span className="font-mono text-xs font-medium">
          {isDown ? "" : "+"}
          {data.change24h.toFixed(2)}%
        </span>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import {
  TrendingDown,
  TrendingUp,
  RefreshCw,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CoinData {
  id: string
  name: string
  symbol: string
  price: number
  change24h: number
  marketCap: number
  volume: number
}

const COIN_IDS = [
  "bitcoin",
  "ethereum",
  "solana",
  "binancecoin",
  "ripple",
  "cardano",
  "dogecoin",
  "polkadot",
]

const COIN_NAMES: Record<string, { name: string; symbol: string }> = {
  bitcoin: { name: "Bitcoin", symbol: "BTC" },
  ethereum: { name: "Ethereum", symbol: "ETH" },
  solana: { name: "Solana", symbol: "SOL" },
  binancecoin: { name: "BNB", symbol: "BNB" },
  ripple: { name: "XRP", symbol: "XRP" },
  cardano: { name: "Cardano", symbol: "ADA" },
  dogecoin: { name: "Dogecoin", symbol: "DOGE" },
  polkadot: { name: "Polkadot", symbol: "DOT" },
}

function formatMarketCap(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  return `$${n.toFixed(2)}`
}

export function MarketsView() {
  const [coins, setCoins] = useState<CoinData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  async function fetchMarkets() {
    setLoading(true)
    try {
      const ids = COIN_IDS.join(",")
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`,
        { cache: "no-store" },
      )
      if (!res.ok) throw new Error("Failed")
      const json = await res.json()

      const data: CoinData[] = COIN_IDS.map((id) => ({
        id,
        name: COIN_NAMES[id].name,
        symbol: COIN_NAMES[id].symbol,
        price: json[id]?.usd ?? 0,
        change24h: json[id]?.usd_24h_change ?? 0,
        marketCap: json[id]?.usd_market_cap ?? 0,
        volume: json[id]?.usd_24h_vol ?? 0,
      }))

      setCoins(data)
      setError(false)
      setLastUpdated(new Date())
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMarkets()
    const interval = setInterval(fetchMarkets, 60000)
    return () => clearInterval(interval)
  }, [])

  const bearishCount = coins.filter((c) => c.change24h < 0).length
  const totalChange =
    coins.length > 0
      ? coins.reduce((sum, c) => sum + c.change24h, 0) / coins.length
      : 0

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Market Overview</h2>
            <p className="text-sm text-muted-foreground">
              Live crypto prices from CoinGecko
            </p>
          </div>
          <button
            type="button"
            onClick={fetchMarkets}
            disabled={loading}
            className="flex h-9 items-center gap-2 rounded-lg bg-secondary px-3 text-sm text-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50"
          >
            <RefreshCw
              className={cn("h-4 w-4", loading && "animate-spin")}
            />
            Refresh
          </button>
        </div>

        {/* Market sentiment */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-secondary p-3 text-center">
            <p
              className={cn(
                "font-mono text-lg font-bold",
                totalChange < 0 ? "text-bear-crimson" : "text-emerald-500",
              )}
            >
              {totalChange < 0 ? "" : "+"}
              {totalChange.toFixed(2)}%
            </p>
            <p className="text-xs text-muted-foreground">Avg 24h Change</p>
          </div>
          <div className="rounded-lg bg-secondary p-3 text-center">
            <p className="font-mono text-lg font-bold text-bear-crimson">
              {bearishCount}/{coins.length}
            </p>
            <p className="text-xs text-muted-foreground">In the Red</p>
          </div>
          <div className="rounded-lg bg-secondary p-3 text-center">
            <p className="font-mono text-lg font-bold text-foreground">
              {coins.length}
            </p>
            <p className="text-xs text-muted-foreground">Tracking</p>
          </div>
        </div>

        {lastUpdated && (
          <p className="mt-3 text-right text-xs text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-bear-crimson/30 bg-bear-crimson/5 px-4 py-3 text-sm text-bear-crimson">
          Failed to fetch market data. Check your connection and try again.
        </div>
      )}

      {/* Coin list */}
      <div className="flex flex-col gap-2">
        {loading && coins.length === 0
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-4 animate-pulse"
              >
                <div className="h-10 w-10 rounded-full bg-secondary" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 rounded bg-secondary" />
                  <div className="h-2 w-16 rounded bg-secondary" />
                </div>
                <div className="space-y-2 text-right">
                  <div className="h-3 w-20 rounded bg-secondary" />
                  <div className="h-2 w-14 rounded bg-secondary" />
                </div>
              </div>
            ))
          : coins.map((coin) => {
              const isDown = coin.change24h < 0
              return (
                <div
                  key={coin.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:bg-card/80"
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold",
                      isDown
                        ? "bg-bear-crimson/10 text-bear-crimson"
                        : "bg-emerald-500/10 text-emerald-500",
                    )}
                  >
                    {coin.symbol.slice(0, 3)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {coin.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{coin.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-bold text-foreground">
                      ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <div
                      className={cn(
                        "flex items-center justify-end gap-1 text-xs font-medium",
                        isDown ? "text-bear-crimson" : "text-emerald-500",
                      )}
                    >
                      {isDown ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : (
                        <TrendingUp className="h-3 w-3" />
                      )}
                      {isDown ? "" : "+"}
                      {coin.change24h.toFixed(2)}%
                    </div>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-xs text-muted-foreground">
                      MCap: {formatMarketCap(coin.marketCap)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Vol: {formatMarketCap(coin.volume)}
                    </p>
                  </div>
                </div>
              )
            })}
      </div>

      {/* CoinGecko attribution */}
      <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
        Data from CoinGecko
        <ExternalLink className="h-3 w-3" />
      </p>
    </div>
  )
}

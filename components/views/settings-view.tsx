"use client"

import { useState } from "react"
import { Settings, User, Bell, Shield, Palette, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface ToggleProps {
  enabled: boolean
  onToggle: () => void
  label: string
  description: string
}

function Toggle({ enabled, onToggle, label, description }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          enabled ? "bg-primary" : "bg-secondary",
        )}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-foreground transition-transform",
            enabled ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  )
}

export function SettingsView({ onClearData }: { onClearData: () => void }) {
  const [notifications, setNotifications] = useState(true)
  const [bearAlerts, setBearAlerts] = useState(true)
  const [scoreNotifs, setScoreNotifs] = useState(false)
  const [showProfile, setShowProfile] = useState(true)
  const [showScore, setShowScore] = useState(true)

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <Settings className="h-6 w-6 text-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Settings</h2>
            <p className="text-sm text-muted-foreground">
              Manage your Bear Capital account
            </p>
          </div>
        </div>
      </div>

      {/* Profile section */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Profile</h3>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
              AB
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-base font-semibold text-foreground">AnonBear</p>
            <p className="text-sm text-muted-foreground">
              Anonymous bear since 2026
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-1 flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
        </div>
        <Toggle
          enabled={notifications}
          onToggle={() => setNotifications(!notifications)}
          label="Push Notifications"
          description="Receive notifications for new posts and replies"
        />
        <Separator />
        <Toggle
          enabled={bearAlerts}
          onToggle={() => setBearAlerts(!bearAlerts)}
          label="Bear Market Alerts"
          description="Get notified when market drops exceed 5%"
        />
        <Separator />
        <Toggle
          enabled={scoreNotifs}
          onToggle={() => setScoreNotifs(!scoreNotifs)}
          label="Score Updates"
          description="Get notified when your bearishness score changes"
        />
      </div>

      {/* Privacy */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-1 flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Privacy</h3>
        </div>
        <Toggle
          enabled={showProfile}
          onToggle={() => setShowProfile(!showProfile)}
          label="Public Profile"
          description="Allow other bears to see your profile"
        />
        <Separator />
        <Toggle
          enabled={showScore}
          onToggle={() => setShowScore(!showScore)}
          label="Show Bearishness Score"
          description="Display your score on the leaderboard"
        />
      </div>

      {/* Appearance */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Appearance</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Bear Capital runs in dark mode only. Because bears thrive in the dark.
        </p>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-bear-crimson/30 bg-bear-crimson/5 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Trash2 className="h-4 w-4 text-bear-crimson" />
          <h3 className="text-sm font-semibold text-bear-crimson">Danger Zone</h3>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          Clear all your posts and data. This action cannot be undone.
        </p>
        <button
          type="button"
          onClick={onClearData}
          className="rounded-lg bg-bear-crimson px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-bear-crimson/80"
        >
          Clear All Data
        </button>
      </div>
    </div>
  )
}

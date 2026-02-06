import { ForumHeader } from "@/components/forum-header"
import { Forum } from "@/components/forum"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <ForumHeader />
      <Forum />
    </div>
  )
}

import { Clock } from "lucide-react"

export default function Header() {
  return (
    <header className="flex items-center justify-end p-4 bg-opacity-20 bg-black backdrop-blur-sm">
      <div className="flex items-center space-x-2">
        <Clock className="h-5 w-5 text-white" />
        <span className="text-white font-medium">Last Rounds</span>
      </div>
    </header>
  )
} 
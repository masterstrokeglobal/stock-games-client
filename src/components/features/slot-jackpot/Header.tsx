import { MenuIcon, SearchIcon } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-[#0F1221] border-b border-[#2A2F42] px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <MenuIcon className="w-6 h-6 mr-3" />
          <div className="font-bold text-xl">TradeBet</div>
        </div>
        <div className="flex items-center">
          <button className="w-8 h-8 flex items-center justify-center">
            <SearchIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

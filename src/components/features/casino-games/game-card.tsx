import { Card } from "@/components/ui/card"
import type CasinoGames from "@/models/casino-games"
import Link from "next/link"

interface GameCardProps {
  game: CasinoGames
}

export default function GameCard({ game }: GameCardProps) {

  return (
    // tab active add border and shadow 
    <Link href={`/game/casino/${game.id}`} >
      <Card className="relative overflow-hidden aspect-square border-none rounded-xl group cursor-pointer transition-transform duration-300 hover:translate-y-[-10px]">
        {game.new && (
          <div className="absolute top-0 right-0  text-white  px-2 py-1 m-1 tracking-wide  gold-button text-sm">
            New
          </div>
        )}

        <img
          src={game.imageUrl || "/placeholder.svg?height=400&width=300"}
          alt={game.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/40 to-transparent md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end md:p-4 p-2">
          <h3 className="text-white font-semibold md:text-md text-sm tracking-wide">{game.name}</h3>
        </div>
      </Card>
    </Link>
  )
}


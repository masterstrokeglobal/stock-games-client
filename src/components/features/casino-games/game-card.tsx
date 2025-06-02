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
      <Card className="relative overflow-hidden aspect-[336/440] border-none rounded-xl group cursor-pointer transition-transform duration-300 hover:scale-105">

      <img
          src={game.imageUrl || "/placeholder.svg?height=400&width=300"}
          alt={game.name}
          className="w-full h-full object-cover blur-sm absolute z-0"
        />
        {game.new && (
          <div className="absolute top-0 right-0  text-white  px-2 py-1 m-1 tracking-wide  gold-button md:text-sm text-[10px]">
            New
          </div>
        )}

        <img
          src={game.imageUrl || "/placeholder.svg?height=400&width=300"}
          alt={game.name}
          className="w-full h-auto aspect-square z-20 relative"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/40 to-transparent md:opacity-0 md:flex hidden group-hover:opacity-100 transition-opacity duration-300 flex items-end md:p-4 p-2">
          <h3 className="text-white font-semibold md:text-md text-sm tracking-wide">{game.name}</h3>
        </div>
      </Card>
    </Link>
  )
}


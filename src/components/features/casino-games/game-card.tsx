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
          <div className="absolute top-0 right-0  text-white  px-2 py-1 m-1 tracking-wide  gold-button text-sm">
            New
          </div>
        )}
        <img
          src={game.imageUrl || "/placeholder.svg?height=400&width=300"}
          alt={game.name}
          className="w-full h-auto aspect-square z-20 relative"
        />
        <div className="absolute w-full  h-1/4 bg-black/100 z-20  bottom-0 to-transparent opacity-90 transition-opacity duration-300 flex items-center md:p-4 p-2">
          <h3 className="text-white font-semibold md:text-md sm:text-sm text-xs line-clamp-2  tracking-wide">{game.name}</h3>
        </div>
      </Card>
    </Link>
  )
}


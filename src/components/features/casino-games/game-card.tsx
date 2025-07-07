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
      <Card className="relative overflow-hidden aspect-square border border-[#4467CC] rounded-none group pb-1 cursor-pointer transition-transform duration-300 hover:scale-105">

      <img
          src={game.imageUrl || "/placeholder.svg?height=400&width=300"}
          alt={game.name}
          className="w-full h-full object-cover  absolute z-0"
        />
        {game.new && (
          <div className="absolute top-0 right-0  text-white  px-2 py-1 m-1 tracking-wide  gold-button md:text-sm text-[10px]">
            New
          </div>
        )}       
      </Card>
    </Link>
  )
}


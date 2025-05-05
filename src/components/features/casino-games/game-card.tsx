import { Card } from "@/components/ui/card"
import type CasinoGames from "@/models/casino-games"
import Link from "next/link"

interface GameCardProps {
  game: CasinoGames
}

export default function GameCard({ game }: GameCardProps) {


  return (
    <Link href={`/game/casino/${game.id}`}>
      <Card className="relative overflow-hidden aspect-[6/4] border-none rounded-xl group cursor-pointer transition-transform duration-300 hover:scale-105">
        <img
        src={game.imageUrl || "/placeholder.svg?height=400&width=300"}
        alt={game.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <h3 className="text-white font-bold text-lg">{game.name}</h3>
        </div>
      </Card>
    </Link>
  )
}


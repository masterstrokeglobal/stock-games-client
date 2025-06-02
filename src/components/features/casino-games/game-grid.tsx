import GameCard from "@/components/features/casino-games/game-card"
import type CasinoGames from "@/models/casino-games"

interface GameGridProps {
  games: CasinoGames[]
}

export default function GameGrid({ games }: GameGridProps) {
  if (games.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400 text-lg">No games found</p>
      </div>
    )
  }

  return (
    <div className="grid xs:grid-cols-3 grid-cols-1 md:grid-cols-4 lg:grid-cols-5  xl:grid-cols-6 md:gap-6 gap-2">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  )
}

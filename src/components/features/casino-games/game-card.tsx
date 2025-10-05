import { Card } from "@/components/ui/card"
import type CasinoGames from "@/models/casino-games"
import Link from "next/link"
import { useGetAllFavoriteGames, useAddFavoriteGame, useRemoveFavoriteGame } from "@/react-query/favorite-game"
import { useMemo } from "react"
import { Heart } from "lucide-react"
import { useAuthStore } from "@/context/auth-context"
import { cn } from "@/lib/utils"
interface GameCardProps {
  game: CasinoGames,
  className?: string,
  imageClassName?: string
}

export default function GameCard({ game, className, imageClassName }: GameCardProps) {
  const { data: favorites = [] } = useGetAllFavoriteGames();
  const addFavorite = useAddFavoriteGame();
  const { isLoggedIn } = useAuthStore();
  const removeFavorite = useRemoveFavoriteGame();

  // Check if current game is in favorites based on gameType (enum)
  const isFavorite = useMemo(() => {
    return favorites.some(favorite => favorite.gameId === game.id);
  }, [favorites, game.id]);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking heart
    e.stopPropagation();

    if (isFavorite) {
      // Remove from favorites using gameType
      removeFavorite.mutate({ gameId: game.id });
    } else {
      // Add to favorites using gameType
      addFavorite.mutate({ gameId: game.id });
    }
  };
  // Use local image for Mines game, otherwise encode the URL to handle special characters like +
  const getImageUrl = () => {
    if (game.name === "Mines") {
      return "/images/mines/mines.png";
    }
    return game.imageUrl 
      ? game.imageUrl.replace(/\+/g, '%2B')
      : "/placeholder.svg?height=400&width=300";
  };

  const encodedImageUrl = getImageUrl();

  return (
    // tab active add border and shadow 
    <Link href={`/game/casino/${game.id}`} >
      <Card className={cn("relative overflow-hidden aspect-square border border-[#4467CC] rounded-none group pb-1 cursor-pointer transition-transform duration-300 hover:scale-105", className)}>

        <img
          src={encodedImageUrl}
          alt={game.name}
          className={cn("w-full h-full object-cover  absolute z-0", imageClassName)}
        />
        {game.new && (
          <div className="absolute top-0 right-0  text-white  px-2 py-1 m-1 tracking-wide  gold-button md:text-sm text-[10px]">
            New
          </div>
        )}

        {/* Favorite Toggle Button */}
        {isLoggedIn &&
          <button
            onClick={handleFavoriteToggle}
            disabled={addFavorite.isPending || removeFavorite.isPending}
            className="absolute top-2 right-2 z-10 sm:p-2 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 disabled:opacity-50"
          >
            <Heart
              className={`sm:size-5 size-3 transition-all duration-200 ${isFavorite
                ? 'text-red-500 fill-red-500'
                : 'text-white hover:text-red-300'
                }`}
            />
          </button>}
      </Card>
    </Link>
  )
}


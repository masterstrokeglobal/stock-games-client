import { Card } from "@/components/ui/card"
import Link from "next/link"
import { StockGame } from "@/lib/utils"
import Image from "next/image"
import { Heart } from "lucide-react"
import { useGetAllFavoriteGames, useAddFavoriteGame, useRemoveFavoriteGame } from "@/react-query/favorite-game"
import { useMemo } from "react"
import { useAuthStore } from "@/context/auth-context"

const StockGameCard = ({ game }: { game: StockGame }) => {
    const { isLoggedIn } = useAuthStore();

    const { data: favorites = [] } = useGetAllFavoriteGames();
    const addFavorite = useAddFavoriteGame();
    const removeFavorite = useRemoveFavoriteGame();

    // Check if current game is in favorites based on gameType (enum)
    const isFavorite = useMemo(() => {
        return favorites.some(favorite => favorite.gameType === game.type);
    }, [favorites, game.type]);

    const handleFavoriteToggle = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation when clicking heart
        e.stopPropagation();

        if (isFavorite) {
            // Remove from favorites using gameType
            removeFavorite.mutate({ gameType: game.type });
        } else {
            // Add to favorites using gameType
            addFavorite.mutate({ gameType: game.type });
        }
    };

    return (
        <div className="w-full relative">
            <Link href={game.href} className="w-full">
                <Card className={`overflow-hidden rounded-none relative shadow-lg border border-[#4467CC] dark:border-none`} style={{ aspectRatio: '170/240' }}>
                    <Image
                        src={game.src}
                        alt={game.alt}
                        className="w-full h-full object-top"
                        width={500}
                        height={500}
                    />
                </Card>
            </Link>

          {isLoggedIn && (
            <button
                onClick={handleFavoriteToggle}
                disabled={addFavorite.isPending || removeFavorite.isPending}
                className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-200 disabled:opacity-50"
            >
                <Heart
                    className={`w-5 h-5 transition-all duration-200 ${isFavorite
                            ? 'text-red-500 fill-red-500'
                            : 'text-white hover:text-red-300'
                        }`}
                />
            </button>)}
        </div>
    )
}

export default StockGameCard

"use client"

import StockGameCard from "@/components/common/stock-game-card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { stockGames } from "@/lib/utils"
import { RoundRecordGameType } from "@/models/round-record"
import { useGetAllFavoriteGames } from "@/react-query/favorite-game"
import GameCard from "../casino-games/game-card"


export default function FavoriteGameCarousel() {
    const { data: favorites = [] , isLoading} = useGetAllFavoriteGames();

    const getStockGame = (round: RoundRecordGameType) => {
        return stockGames.find((game) => game.type === round);
    }

    if (isLoading || favorites.length === 0) {
        return null;
    }
    return (
        <Carousel opts={{ loop: false, startIndex: 0 }} className="w-full">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="md:text-2xl text-base text-platform-text font-bold">Favorite Games</h2>
                    <div className="flex gap-2">
                        <CarouselPrevious className="static translate-y-0 bg-background/20 hover:bg-background/40" />
                        <CarouselNext className="static translate-y-0 bg-background/20 hover:bg-background/40" />
                    </div>
                </div>
                <CarouselContent>
                    {favorites.map((game, index) => (
                        <CarouselItem key={index} className="xs:basis-1/3 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4">
                            {
                                game.gameType ? (
                                    <StockGameCard game={getStockGame(game.gameType)!} />
                                ) : (
                                    <GameCard game={game.game!} />
                                )
                            }                        </CarouselItem>
                    ))}
                </CarouselContent>
            </div>
        </Carousel>
    )
}

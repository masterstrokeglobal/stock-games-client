"use client";

import StockGameCard from "@/components/common/stock-game-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { stockGames } from "@/lib/utils";
import { RoundRecordGameType } from "@/models/round-record";
import { useGetAllFavoriteGames } from "@/react-query/favorite-game";
import GameCard from "../casino-games/game-card";
import { ProviderCompany } from "@/models/casino-games";
import useWindowSize from "@/hooks/use-window-size";

export default function FavoriteGameCarousel({
  providerCompany,
  title,
}: {
  providerCompany?: ProviderCompany;
  title?: string;
}) {
  const { data: favorites = [], isLoading } = useGetAllFavoriteGames();
  const { width } = useWindowSize();

  const getStockGame = (round: RoundRecordGameType) => {
    return stockGames.find((game) => game.type === round);
  };

  if (isLoading || favorites.length === 0) {
    return null;
  }

  const isLargeDesktop = width >= 1280;
  const filteredFavorites = providerCompany
    ? favorites.filter(
        (favorite) => favorite.game?.providerCompany === providerCompany
      )
    : favorites;

  if (filteredFavorites.length === 0) {
    return null;
  }

  return (
    <Carousel
      opts={{
        loop: false,
        startIndex: 0,
        slidesToScroll: isLargeDesktop ? 5 : 2,
      }}
      className="w-full pt-0.5"
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="md:text-2xl sm:text-base text-sm font-semibold text-platform-text">
            {title || "Favorite Games"}
          </h2>
          <div className="flex gap-2">
            <CarouselPrevious className="static translate-y-0 bg-background/20 hover:bg-background/40 md:w-8 md:h-8 w-6 h-6" />
            <CarouselNext className="static translate-y-0 bg-background/20 hover:bg-background/40 md:w-8 md:h-8 w-6 h-6" />
          </div>
        </div>
        <CarouselContent>
          {filteredFavorites.map((game, index) => (
            <CarouselItem
              key={index}
              className="xs:basis-1/3 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4"
            >
              {game.gameType ? (
                <StockGameCard game={getStockGame(game.gameType)!} />
              ) : (
                <GameCard
                  className={
                    providerCompany === ProviderCompany.GAP
                      ? "aspect-[5/3]"
                      : ""
                  }
                  game={game.game!}
                />
              )}{" "}
            </CarouselItem>
          ))}
        </CarouselContent>
      </div>
    </Carousel>
  );
}

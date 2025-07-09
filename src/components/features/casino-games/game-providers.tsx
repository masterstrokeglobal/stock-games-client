"use client";
import { ProviderEnum } from "@/models/casino-games";
import Link from "next/link";

const providers = [
  { alt: ProviderEnum.STOCK_GAMES, src: "/images/companies/stock-games.svg" },
  { alt: ProviderEnum.BetGames, src: "/images/companies/betgames.png" },
  { alt: ProviderEnum.Evoplay, src: "/images/companies/Evoplay.png" },
  { alt: ProviderEnum.Ezugi, src: "/images/companies/Ezugi.png" },
  { alt: ProviderEnum.Gamzix, src: "/images/companies/gamzix.png" },
  { alt: ProviderEnum.JILI, src: "/images/companies/jili.png" },
  { alt: ProviderEnum.Playtech_Casino, src: "/images/companies/playtech.png" },
  { alt: ProviderEnum.SmartSoft, src: "/images/companies/smartsoft.png" },
  { alt: ProviderEnum.spribe, src: "/images/companies/spribe.png" },
  { alt: ProviderEnum.Turbo_Games, src: "/images/companies/turbo-games.png" },
  { alt: ProviderEnum.Vivo_Gaming, src: "/images/companies/vg.png" },
];
const CasinoProviders = () => {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold mb-4">Game Providers</h2>
      <div className="casino-provider-ctn grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {providers.map((provider, index) => (
          <Link
            key={index}
            href={provider.alt == ProviderEnum.STOCK_GAMES ? "/game/platform/stock-games" : `/game/platform/casino?provider=${provider.alt}`}
            className=" rounded-lg  flex items-center justify-center h-24"
          >
            {/* new game will have a rotated tag */}

            <img
              className="home-casino-img object-contain w-full h-full"
              src={provider.src}
              alt={provider.alt}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CasinoProviders;

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import type { GameCategory } from "@/models/casino-games";

interface CategoryCarouselProps {
  categoryId?: GameCategory,
  popular?: boolean,
  new?: boolean,
  title: string
}

export function CasinoProvidersCarousel({ title }: CategoryCarouselProps) {
  return (
    <Carousel className="w-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="md:text-2xl text-base font-semibold text-platform-text">{title}</h2>
          <div className="flex gap-2">
            <CarouselPrevious className="static translate-y-0 bg-background/20 hover:bg-background/40" />
            <CarouselNext className="static translate-y-0 bg-background/20 hover:bg-background/40" />
          </div>
        </div>
        <CarouselContent className="-ml-2 md:-ml-4">
          {providers.map((provider, index) => (
            <CarouselItem key={provider.alt} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6">
              <Link
                key={index}
                href={provider.alt == ProviderEnum.STOCK_GAMES ? "/game/platform/stock-games" : `/game/platform/casino?provider=${provider.alt}`}
                className="flex items-center justify-center h-10 "
              >
                {/* new game will have a rotated tag */}

                <img
                  className="home-casino-img h-10 object-contain w-full"
                  src={provider.src}
                  alt={provider.alt}
                />
              </Link>                 
            </CarouselItem>
          ))}
        </CarouselContent>
      </div>
    </Carousel>
  )
}

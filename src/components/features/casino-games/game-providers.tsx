"use client";
import { ProviderEnum } from "@/models/casino-games";
import Link from "next/link";

const providers = [
  { alt: ProviderEnum.Evolution_Gaming, src: "/images/companies/evolution.svg" },
  { alt: ProviderEnum.Ezugi, src: "/images/companies/ezugi.svg" },
  { alt: ProviderEnum.spribe, src: "/images/companies/spribe.svg" },
  { alt: ProviderEnum.SmartSoft, src: "/images/companies/smartsoft.png" },
  { alt: ProviderEnum.Playtech_Casino, src: "/images/companies/playtech.svg" },
  { alt: ProviderEnum.BetGames, src: "/images/companies/betgames.png" },
  { alt: ProviderEnum.Evoplay, src: "/images/companies/evoplay.svg" },
  { alt: ProviderEnum.Turbo_Games, src: "/images/companies/turbo.svg" },
  { alt: ProviderEnum.Gamzix, src: "/images/companies/gamzix.png" },
  { alt: ProviderEnum.JILI, src: "/images/companies/jili.png" },
  { alt: ProviderEnum.Vivo_Gaming, src: "/images/companies/vivo.png" },
  { alt: ProviderEnum.SA_Gaming, src: "/images/companies/ae-sexy.png" },
];
const CasinoProviders = () => {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold mb-4">Game Providers</h2>
      <div className="casino-provider-ctn grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {providers.map((provider, index) => (
          <Link
            key={index}
            href={`/game/platform/casino?provider=${provider.alt}`}
            className="bg-background-secondary rounded-lg p-4 flex items-center justify-center h-24"
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
    <Carousel className="w-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="md:text-2xl text-base font-bold">{title}</h2>
          <div className="flex gap-2">
            <CarouselPrevious className="static translate-y-0 bg-background/20 hover:bg-background/40" />
            <CarouselNext className="static translate-y-0 bg-background/20 hover:bg-background/40" />
          </div>
        </div>
        <CarouselContent>
          {providers.map((provider, index) => (
            <CarouselItem key={provider.alt} className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-4">
              <Link
                key={index}
                href={`/game/platform/casino?provider=${provider.alt}`}
                className="bg-background-secondary rounded-lg p-4 flex items-center justify-center h-16"
              >
                {/* new game will have a rotated tag */}

                <img
                  className="home-casino-img h-12 object-contain w-full "
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

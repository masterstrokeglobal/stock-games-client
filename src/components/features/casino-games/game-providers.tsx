import Link from "next/link";
import React from "react";
import { ProviderEnum } from "@/models/casino-games";

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

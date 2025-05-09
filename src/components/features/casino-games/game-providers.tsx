import Link from "next/link";
import React from "react";
import { ProviderEnum } from "@/models/casino-games";

const providers = [
  { alt: ProviderEnum.EVOLUTION_GAMING, src: "/images/companies/evolution.svg" },
  { alt: ProviderEnum.EZUGI, src: "/images/companies/ezugi.svg" },
  { alt: ProviderEnum.SPRIBE, src: "/images/companies/spribe.svg" },
  { alt: ProviderEnum.SMARTSOFT_GAMING, src: "/images/companies/smartsoft.png" },
  { alt: ProviderEnum.PLAYTECH, src: "/images/companies/playtech.svg" },
  { alt: ProviderEnum.BETGAMES, src: "/images/companies/betgames.png" },
  { alt: ProviderEnum.EVOPLAY_ENTERTAINMENT, src: "/images/companies/evoplay.svg" },
  { alt: ProviderEnum.TURBO, src: "/images/companies/turbo.svg" },
  { alt: ProviderEnum.GAMZIX, src: "/images/companies/gamzix.png" },
  { alt: ProviderEnum.JILI, src: "/images/companies/jili.png" },
  { alt: ProviderEnum.VIVOGAMING, src: "/images/companies/vivo.png" },
  { alt: ProviderEnum.SEXYBCRT, src: "/images/companies/ae-sexy.png" },
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

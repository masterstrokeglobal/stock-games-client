"use client";

import FavoriteGameCarousel from "@/components/features/favorite-games/favorite-game-carousel";
import { useAuthStore } from "@/context/auth-context";
import { ProviderCompany } from "@/models/casino-games";

const Page = () => {
  const { isLoggedIn } = useAuthStore();

  return (
    <section className="space-y-2 font-inter">
      <div className="sm:space-y-4">
        {isLoggedIn && (
          <FavoriteGameCarousel
            title="Favorite MAC88"
            providerCompany={ProviderCompany.GAP}
          />
        )}
        {isLoggedIn && (
          <FavoriteGameCarousel
            title="Favorite Qtech"
            providerCompany={ProviderCompany.QTECH}
          />
        )}
      </div>
    </section>
  );
};

export default Page;

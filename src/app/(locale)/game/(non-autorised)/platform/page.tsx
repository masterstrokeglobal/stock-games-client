"use client";
import CategoryCarousel from "@/components/features/casino-games/category-carousel";
import { CasinoProvidersCarousel } from "@/components/features/casino-games/game-providers";
import AdMarquee from "@/components/features/platform/ad-marquee";
import StockGameCarousel from "@/components/features/stock-games.tsx/stock-game-carousel";
import ActiveTierCard from "@/components/features/tier/user-tier-card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/context/auth-context";
import { checkCasinoAllowed, COMPANYID } from "@/lib/utils";
import { GameTypeEnum } from "@/models/casino-games";
import User from "@/models/user";
import { useTranslations } from "next-intl";
import Link from "next/link";

const PlatformPage = () => {
    const t = useTranslations('wallet');
    const { isLoggedIn, userDetails } = useAuthStore();
    const user = userDetails as User;

    const isCasinoAllowed = checkCasinoAllowed(COMPANYID);

    return (
        <section className="space-y-4 md:space-y-8">
            <AdMarquee />
            {isLoggedIn && !user.isDemoUser && (
                <div className="flex gap-2">
                    <Link href="/game/wallet/deposit" className="flex-1" passHref>
                        <Button className="w-full  bg-accent-secondary text-accent-secondary-foreground gap-x-2 md:h-12">
                            {t('menu.deposit')}
                        </Button>
                    </Link>

                    <Link href="/game/wallet/withdrawl" className="flex-1" passHref>
                        <Button className="w-full gap-x-2 md:h-12 border border-accent-secondary text-accent-secondary bg-transparent tex">
                            {t('menu.withdraw')}
                        </Button>
                    </Link>

                </div>
            )}

            {isLoggedIn && <ActiveTierCard className="mt-12" />}

            <StockGameCarousel />
            {isCasinoAllowed && (
                <>
                    <CasinoProvidersCarousel title="Game Providers" />
                    <CategoryCarousel title="New Released" new={true} direction="backward" />
                    <CategoryCarousel title="Hot Games" popular={true} direction="forward" />
                    <CategoryCarousel title="Crash Games" type={GameTypeEnum.CRASH_GAME} direction="backward" />
                    <CategoryCarousel title="Game Show" type={GameTypeEnum.GAME_SHOW} direction="forward" />
                    <CategoryCarousel title="Instant Win" type={GameTypeEnum.INSTANT_WIN} direction="backward" />
                    <CategoryCarousel title="Live Dealer" type={GameTypeEnum.LIVE_DEALER} direction="forward" />
                    <CategoryCarousel title="Table Games" type={GameTypeEnum.TABLE_GAMES} direction="backward" />
                    <CategoryCarousel title="Slots" type={GameTypeEnum.SLOTS} direction="forward" />
                    <CategoryCarousel title="Shooting" type={GameTypeEnum.SHOOTING} direction="backward" />
                    <CategoryCarousel title="Lottery" type={GameTypeEnum.LOTTERY} direction="forward" />
                </>
            )}

        </section>
    )
}

export default PlatformPage;

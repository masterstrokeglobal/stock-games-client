"use client";
import { Marquee } from "@/components/common/marquee";
import CategoryCarousel from "@/components/features/casino-games/category-carousel";
import { CasinoProvidersCarousel } from "@/components/features/casino-games/game-providers";
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
            <Marquee pauseOnHover repeat={30} className="[--duration:5s] bg-[#256381] border-y-2 border-[#6d98ac] -mx-4 md:-mx-12" >
                <div className="flex items-center gap-2 ">
                    Welcome to Stock Games
                </div>
            </Marquee>
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
                    <CategoryCarousel title="Hot Games" popular={true} />
                    <CategoryCarousel title="Crash Games" type={GameTypeEnum.CRASH_GAME} />
                    <CategoryCarousel title="Game Show" type={GameTypeEnum.GAME_SHOW} />
                    <CategoryCarousel title="Instant Win" type={GameTypeEnum.INSTANT_WIN} />
                    <CategoryCarousel title="Live Dealer" type={GameTypeEnum.LIVE_DEALER} />
                    <CategoryCarousel title="Table Games" type={GameTypeEnum.TABLE_GAMES} />
                    <CategoryCarousel title="Slots" type={GameTypeEnum.SLOTS} />
                    <CategoryCarousel title="Shooting" type={GameTypeEnum.SHOOTING} />
                    <CategoryCarousel title="Lottery" type={GameTypeEnum.LOTTERY} />
                    <CategoryCarousel title="New Released" new={true} />
                </>
            )}

        </section>
    )
}

export default PlatformPage;

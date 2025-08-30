"use client";
import CategoryCarousel from "@/components/features/casino-games/category-carousel";
import { CasinoProvidersCarousel } from "@/components/features/casino-games/game-providers";
import GapGameCarousel from "@/components/features/casino-games/gap-game-carousel";
import FavoriteGameCarousel from "@/components/features/favorite-games/favorite-game-carousel";
import AdMarquee from "@/components/features/platform/ad-marquee";
import CtaSection from "@/components/features/platform/cta-section";
import WalletDialog from "@/components/features/platform/wallet-dialog";
import StockGameCarousel from "@/components/features/stock-games.tsx/stock-game-carousel";
import ActiveTierCard from "@/components/features/tier/user-tier-card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/context/auth-context";
import useCasinoAllowed from "@/hooks/use-is-casino-allowed";
import { isTawkEnabled, TAWK_PROPERTY_ID, TAWK_WIDGET_ID } from "@/lib/utils";
import { GameTypeEnum } from "@/models/casino-games";
import User from "@/models/user";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";
import { useTranslations } from "next-intl";

const PlatformPage = () => {
    const t = useTranslations('wallet');
    const tPlatform = useTranslations('platform.casino-games');
    const { isLoggedIn, userDetails } = useAuthStore();
    const user = userDetails as User;

    const { isCasinoAllowed } = useCasinoAllowed();

    return (
        <section className="space-y-4 md:space-y-8 font-inter">
            <AdMarquee />
            {isLoggedIn && !user.isDemoUser && (
                <div className="flex gap-2">
                    <WalletDialog activeTab="deposit">
                        <Button className="w-full  dark:bg-[linear-gradient(to_right,#AA5798_0%,#5065C6_100%)] bg-primary-game dark:text-white   dark:rounded-none gap-x-2 md:h-12">
                            {t('menu.deposit')}
                        </Button>
                    </WalletDialog>

                    <WalletDialog activeTab="withdraw">
                        <Button className="w-full gap-x-2 md:h-12 dark:bg-[linear-gradient(90deg,#02A2A0_32.81%,#4A66C9_100%)] bg-primary-game  dark:rounded-none dark:text-white">
                            {t('menu.withdraw')}
                        </Button>
                    </WalletDialog>

                </div>
            )}

            {isLoggedIn && <ActiveTierCard className="my-12" />}
            <StockGameCarousel />
            {isLoggedIn && <FavoriteGameCarousel />}
            {isCasinoAllowed && (
                <>
                <GapGameCarousel title="Gap Games" />
                    <CasinoProvidersCarousel title={tPlatform("game-providers")} />
                    <CategoryCarousel title={tPlatform("new-released")} new={true} direction="backward" />
                    <CategoryCarousel title={tPlatform("hot-games")} popular={true} direction="forward" />
                    <CategoryCarousel title={"Stock Game Choices"} stockGameChoice />
                    <CategoryCarousel title={"Provider of the Week"} providerOfWeek />
                    <CategoryCarousel title={tPlatform("crash-games")} type={GameTypeEnum.CRASH_GAME} direction="backward" />
                    <CategoryCarousel title={tPlatform("game-show")} type={GameTypeEnum.GAME_SHOW} direction="forward" />
                    <CategoryCarousel title={tPlatform("instant-win")} type={GameTypeEnum.INSTANT_WIN} direction="backward" />
                    <CategoryCarousel title={tPlatform("live-dealer")} type={GameTypeEnum.LIVE_DEALER} direction="forward" />
                    <CategoryCarousel title={tPlatform("table-games")} type={GameTypeEnum.TABLE_GAMES} direction="backward" />
                    <CategoryCarousel title={tPlatform("slots")} type={GameTypeEnum.SLOTS} direction="forward" />
                    <CategoryCarousel title={tPlatform("shooting")} type={GameTypeEnum.SHOOTING} direction="backward" />
                    <CategoryCarousel title={tPlatform("lottery")} type={GameTypeEnum.LOTTERY} direction="forward" />
                    <CategoryCarousel title={tPlatform("poker")} type={GameTypeEnum.POKER} direction="forward" />
                    <CategoryCarousel title={tPlatform("scratch_card")} type={GameTypeEnum.SCRATCH_CARD} direction="forward" />
                    <CategoryCarousel title={tPlatform("age_of_gods")} type={GameTypeEnum.AGE_OF_GODS} direction="forward" />
                    <CategoryCarousel title={tPlatform("summer_games")} type={GameTypeEnum.SUMMER_GAMES} direction="forward" />
                    <CategoryCarousel title={tPlatform("travel_adventure")} type={GameTypeEnum.TRAVEL_ADVENTURE} direction="forward" />
                    <CategoryCarousel title={tPlatform("virtual_sports")} type={GameTypeEnum.VIRTUAL_SPORTS} direction="forward" />
                </>
            )}

            <CtaSection />

            {isTawkEnabled && <TawkMessengerReact
                propertyId={TAWK_PROPERTY_ID}
                widgetId={TAWK_WIDGET_ID}
            />}

        </section>
    )
}

export default PlatformPage;

"use client";
import GameLoadingScreen from "@/components/common/game-loading-screen";
import AdvertismentDialog from "@/components/features/advertisement/advertismemnt-dialog";
import CurrentBets from "@/components/features/game/current-bets";
import LastWinners from "@/components/features/game/last-winners";
import LeaderBoard from "@/components/features/game/leaderboard";
import RouletteGame from "@/components/features/game/roulette-game";
import GameHeaderMobile from "@/components/features/game/roulette-mobile-header";
import HorseRace from "@/components/features/horse-animation/horse";
import { useHorseRaceSound } from "@/context/audio-context";
import { useCurrentGame, useIsPlaceOver } from "@/hooks/use-current-game";
import useWindowSize from "@/hooks/use-window-size";
import { cn } from "@/lib/utils";
import { RoundRecord } from "@/models/round-record";
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';
import ExternalUserNavbar from "@/components/features/game/external-user-navbar";

declare global {
    interface Window {
        Tawk_API: any;
    }
}


const GamePage = () => {
    const { roundRecord, isLoading } = useCurrentGame();
    const { isMobile } = useWindowSize();
    useHorseRaceSound(roundRecord);

    if (isLoading) return <GameLoadingScreen className="h-screen" />;
    return (<>
        <section className={cn("bg-background-game pt-20")}>
            <ExternalUserNavbar />
            {!isMobile && <main className="grid grid-cols-12 grid-rows-12  md:gap-4 gap-2 md:max-h-[1100px] py-4 pb-4">
                <div
                    className="lg:col-span-7 col-span-8 row-span-4 rounded-sm  overflow-hidden">
                    {roundRecord && <HorseRace roundRecord={roundRecord} />}
                </div>
                <div
                    className="lg:col-span-5 col-span-4 row-span-6 rounded-sm ">
                    {roundRecord && <LeaderBoard roundRecord={roundRecord} />}
                </div>
                <div
                    className="lg:col-span-7 col-span-8 bg-las relative  row-span-5 h-fit   rounded-sm overflow-y-auto game-gradient-card-parent">
                    {roundRecord && <RouletteGame roundRecord={roundRecord} />}
                </div>
                <div
                    className="lg:col-span-5 col-span-4 overflow-hidden row-span-6 rounded-sm ">
                    {roundRecord && <LastWinners className="h-full" />}
                </div>
                <div
                    className="lg:col-span-7 col-span-8 bg-las relative h-full  row-span-3">
                    {roundRecord && <CurrentBets round={roundRecord} />}
                </div>
            </main>}
            <AdvertismentDialog />
            <TawkMessengerReact
                propertyId="/67fcabcc5de05719072dd2b9"
                widgetId="1iopfu6mp"
                onLoad={() => console.log('Tawk loaded')}
            />
            {isMobile && roundRecord && <MobileGame roundRecord={roundRecord} />}
        </section>
    </>
    );
};

export default GamePage;


const MobileGame = ({ roundRecord }: { roundRecord: RoundRecord }) => {
    const isPlaceOver = useIsPlaceOver(roundRecord);

    return <section className="text-game-text">
        {
            roundRecord && <GameHeaderMobile roundRecord={roundRecord} />
        }
        <HorseRace roundRecord={roundRecord} />
        {!isPlaceOver && <main className="bg-[#0A1634]">
            <div className="md:px-2">
                {roundRecord && <RouletteGame className="mb-4" roundRecord={roundRecord} />}
                {roundRecord && <LastWinners className="h-96 mb-4 rounded-none" />}
                {roundRecord && <CurrentBets round={roundRecord} />}
            </div>
        </main>}
        {isPlaceOver && <LeaderBoard roundRecord={roundRecord} />}
        {isPlaceOver && <RouletteGame roundRecord={roundRecord} />}
        {isPlaceOver && <CurrentBets className="mb-4" round={roundRecord} />}
        {isPlaceOver && <LastWinners className="h-96 rounded-none" />}
    </section>
}


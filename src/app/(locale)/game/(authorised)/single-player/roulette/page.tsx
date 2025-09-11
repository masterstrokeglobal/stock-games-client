"use client";
import GameLoadingScreen from "@/components/common/game-loading-screen";
import AdvertismentDialog from "@/components/features/advertisement/advertismemnt-dialog";
import CurrentBets from "@/components/features/game/current-bets";
import LastWinners from "@/components/features/game/last-winners";
import LeaderBoard from "@/components/features/game/leaderboard";
import Navbar from "@/components/features/game/navbar";
import RouletteGame from "@/components/features/game/roulette-game";
import RouletteGameHeader from "@/components/features/game/roulette-game-header";
import GameHeaderMobile from "@/components/features/game/roulette-mobile-header";
import HorseRace from "@/components/features/horse-animation/horse";
import { useHorseRaceSound } from "@/context/audio-context";
import {
  useCurrentGame,
  useGameState,
  useIsPlaceOver,
} from "@/hooks/use-current-game";
import useWindowSize from "@/hooks/use-window-size";
import { cn } from "@/lib/utils";
import { RoundRecord } from "@/models/round-record";
import MarketSelector from "@/components/common/market-selector";
import { useMarketSelector } from "@/hooks/use-market-selector";
import { RoundRecordGameType } from "@/models/round-record";
import GameMaintenanceMarquee from "@/components/common/game-maintainaince-screen";
import useSchedularInactive from "@/hooks/use-schedular-inactive";
import { useGameType } from "@/hooks/use-game-type";

declare global {
  interface Window {
    Tawk_API: any;
  }
}

const Page = () => {
  const { marketSelected } = useMarketSelector();
  const { roundRecord, isLoading } = useCurrentGame(RoundRecordGameType.DERBY);
  const [gameType] = useGameType();
  const { isActive, isFetching } = useSchedularInactive(gameType);

  const { isMobile } = useWindowSize();
  useHorseRaceSound(roundRecord);
  const { isPlaceOver } = useGameState(roundRecord);

  if (!marketSelected)
    return (
      <MarketSelector
        className="min-h-[calc(100svh)]mx-auto"
        title="Stock Roulette Market"
      />
    );

  if (isLoading) return <GameLoadingScreen className="h-screen" />;

  return (
    <>
      <section className={cn("bg-background-game pt-14 md:min-h-screen")}>
        <Navbar />
        {isMobile && isPlaceOver &&  roundRecord && (
          <RouletteGameHeader title="Stock Roulette" roundRecord={roundRecord} isMobile/>
        )}
        {!isMobile && <RouletteGameHeader title="Stock Roulette" />}
        {!isActive && !isFetching && <GameMaintenanceMarquee />}
        {!isMobile && roundRecord && (
          <main className="grid grid-cols-12 mt-4 md:gap-4 gap-2 md:max-h-[1100px] px-4 pb-4">
            <div className="grid grid-cols-1 col-span-8 lg:col-span-7 gap-4">
              <div className="w-full">
                <HorseRace roundRecord={roundRecord} />
              </div>
              <div className=" bg-las relative h-fit rounded-sm overflow-y-auto game-gradient-card-parent w-full">
                <RouletteGame roundRecord={roundRecord} />
              </div>
              <div className=" bg-las relative h-fit w-full">
                <CurrentBets round={roundRecord} />
              </div>
            </div>
            <div className="grid grid-cols-1 col-span-4 lg:col-span-5 gap-4">
              <div className="w-full">
                <LeaderBoard roundRecord={roundRecord} />
              </div>
              <div className="w-full">
                <LastWinners className="h-full" />
              </div>
            </div>
          </main>
        )}
        <AdvertismentDialog />
        {isMobile && roundRecord && <MobileGame roundRecord={roundRecord} />}
      </section>
    </>
  );
};

export default Page;

const MobileGame = ({ roundRecord }: { roundRecord: RoundRecord }) => {
  const isPlaceOver = useIsPlaceOver(roundRecord);

  return (
    <section className="text-game-text">
      {isPlaceOver && (
        <div className="space-y-4">
          {/* <GameHeaderMobile roundRecord={roundRecord} /> */}
          <HorseRace roundRecord={roundRecord} />
        </div>
      )}
      {!isPlaceOver && roundRecord && (
        <main className="bg-[#0A1634]">
          <div className="space-y-4 md:px-4">
            <RouletteGame roundRecord={roundRecord} />
            <LastWinners className="h-96 rounded-none" />
            <CurrentBets round={roundRecord} />
          </div>
        </main>
      )}
      <div className="w-full md:px-4">
        <LeaderBoard className="mt-0" roundRecord={roundRecord} />
      </div>
      {isPlaceOver && roundRecord && (
        <div className="space-y-4 md:px-4">
          <RouletteGame roundRecord={roundRecord} />
          <CurrentBets round={roundRecord} />
          <LastWinners className="h-96 rounded-none " />
        </div>
      )}
    </section>
  );
};

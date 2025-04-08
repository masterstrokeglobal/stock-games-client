import { useGameState, useIsPlaceOver } from "@/hooks/use-current-game";
import MarketItem from "@/models/market-item";
import { RoundRecord } from "@/models/round-record";
import { useTranslations } from "next-intl";
import { MobileGameHeader } from "../roulette-header";
import HorseRace from "../../horse-animation/horse";

export const TimeLeft = ({ roundRecord }: { roundRecord: RoundRecord }) => {
    const gameState = useGameState(roundRecord);
    return gameState.placeTimeLeft.formatted;
}


export const MobileHeader = ({ roundRecord, filteredMarket }: { roundRecord: RoundRecord, filteredMarket?: MarketItem[]; }) => {
    const isPlaceOver = useIsPlaceOver(roundRecord);
    const t = useTranslations("game");
    if (isPlaceOver) return <>
        <MobileGameHeader roundRecord={roundRecord} />
        <div className="m-2 rounded-xl overflow-hidden">
            {(roundRecord && filteredMarket) && <HorseRace roundRecord={roundRecord} filteredMarket={filteredMarket} />}
        </div>
    </>


    return <header className="bg-[#1E2E57] mx-auto flex justify-center flex-col text-center min-h-[20vh]" >
        <h1>
            {t("round-starts-in")}
        </h1>
        <p className="jersey text-8xl leading-[5rem]">
            <TimeLeft roundRecord={roundRecord!} />
        </p>
    </header>
}
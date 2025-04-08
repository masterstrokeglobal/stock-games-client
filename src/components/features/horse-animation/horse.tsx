"use client";
import { useIsPlaceOver } from "@/hooks/use-current-game";
import { RoundRecord } from "@/models/round-record";
import { Canvas } from "@react-three/fiber";
import HorseRaceEnvironment from "./components/race-enviroment";
import { useTranslations } from "next-intl";
import MarketItem from "@/models/market-item";

type Props = {
  roundRecord: RoundRecord;
  filteredMarket?: MarketItem[];

};

export default function HorseRace({ roundRecord, filteredMarket }: Props) {

  const isPlaceOver = useIsPlaceOver(roundRecord);

  return isPlaceOver ? (
    <Canvas>
      <HorseRaceEnvironment roundRecord={roundRecord} filteredMarket={filteredMarket} />
    </Canvas>
  ) : (
    <RacePreparation />
  );
}


function RacePreparation() {
  const t = useTranslations("game");

  return (
    <div className="w-full  bg-secondary-game  relative text-game-text rounded-2xl h-full p-6 text-center shadow-2xl">
      <video src="/images/loading.mp4" autoPlay muted loop className="w-full h-auto absolute -top-1/4 left-0 object-cover" />
      <div className="rounded-xl p-4">
        <p className="text-white text-xl mb-2">{t('race-begin')}
        </p>
      </div>
    </div>
  );
}
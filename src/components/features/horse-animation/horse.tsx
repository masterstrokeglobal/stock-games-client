"use client";
import { useIsPlaceOver } from "@/hooks/use-current-game";
import { RoundRecord } from "@/models/round-record";
import { Canvas } from "@react-three/fiber";
import HorseRaceEnvironment from "./components/race-enviroment";
import { useTranslations } from "next-intl";

type Props = {
  roundRecord: RoundRecord;
};

export default function HorseRace({ roundRecord }: Props) {

  const isPlaceOver = useIsPlaceOver(roundRecord);

  return isPlaceOver ? (
    <Canvas>
      <HorseRaceEnvironment roundRecord={roundRecord} />
    </Canvas>
  ) : (
    <RacePreparation />
  );
}


function RacePreparation() {
  const t = useTranslations("game");

  return (
    <div className="w-full  bg-secondary-game  text-game-text rounded-2xl h-full p-6 text-center shadow-2xl">
      <div className="rounded-xl p-4">
        <p className="text-white text-xl mb-2">{t('race-begin')}
        </p>
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-200"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-500"></div>
        </div>
      </div>
    </div>
  );
}
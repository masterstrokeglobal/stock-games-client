"use client";
import { useIsPlaceOver } from "@/hooks/use-current-game";
import MarketItem from "@/models/market-item";
import { RoundRecord } from "@/models/round-record";
import { Canvas } from "@react-three/fiber";
import { useTranslations } from "next-intl";
import HorseRaceEnvironment from "./components/race-enviroment";

type Props = {
  roundRecord: RoundRecord;
  filteredMarket?: MarketItem[];

};

export default function HorseRace({ roundRecord, filteredMarket }: Props) {

  const isPlaceOver = useIsPlaceOver(roundRecord);

  return isPlaceOver ? (
    <Suspense fallback={<GameLoadingScreen className="h-96" loadingImageClassName="w-10 h-auto" />}>
      <div className="game-gradient-card-parent h-full">
        <Canvas className="bg-white h-full  md:rounded-sm">
          <PixelRatioManager />
          <HorseRaceEnvironment roundRecord={roundRecord} filteredMarket={filteredMarket} />
        </Canvas>
      </div>
    </Suspense>
  ) : (
    <RacePreparation />
  );
}


function RacePreparation() {
  const t = useTranslations("game");

  return (
    <div className="w-full  game-gradient-card-parent  overflow-hidden  relative text-game-text  h-full  text-center shadow-2xl">
      <img src="/images/roulette/game-prep.png" className="w-full h-full rounded-sm object-cover " />
        <div className="rounded-xl p-4 absolute top-0 left-0 right-0">
          <p className="text-white text-xl mb-2">{t('race-begin')}
          </p>
        </div>
    </div>
  );
}

import GameLoadingScreen from "@/components/common/game-loading-screen";
import useWindowSize from "@/hooks/use-window-size";
import { useThree } from "@react-three/fiber";
import { Suspense, useEffect } from "react";

const PixelRatioManager = () => {
  const { gl } = useThree();

  const { isMobile } = useWindowSize();
  useEffect(() => {
    gl.setPixelRatio(isMobile ? 1.3 : Math.min(window.devicePixelRatio, 1.5));
  }, [gl, isMobile]);

  return null;
};

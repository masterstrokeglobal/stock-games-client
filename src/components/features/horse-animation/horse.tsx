"use client";
import { useIsPlaceOver } from "@/hooks/use-current-game";
import { RoundRecord } from "@/models/round-record";
import { Canvas } from "@react-three/fiber";
import { useTranslations } from "next-intl";
import HorseRaceEnvironment from "./components/race-enviroment";

type Props = {
  roundRecord: RoundRecord;
};

export default function HorseRace({ roundRecord }: Props) {

  const isPlaceOver = useIsPlaceOver(roundRecord);

  return isPlaceOver ? (
    <Suspense fallback={<GameLoadingScreen className="h-96" loadingImageClassName="w-10 h-auto" />}>
      <Canvas>
        <PixelRatioManager />
        <HorseRaceEnvironment roundRecord={roundRecord} />
      </Canvas>
    </Suspense>
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

import useWindowSize from "@/hooks/use-window-size";
import { useThree } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import GameLoadingScreen from "@/components/common/game-loading-screen";

const PixelRatioManager = () => {
  const { gl } = useThree();

  const { isMobile } = useWindowSize();
  useEffect(() => {
    gl.setPixelRatio(isMobile ? 1.3 : Math.min(window.devicePixelRatio, 1.5));
  }, [gl, isMobile]);

  return null;
};

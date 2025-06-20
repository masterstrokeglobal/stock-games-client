"use client";
import { useGameState, useIsPlaceOver } from "@/hooks/use-current-game";
import MarketItem from "@/models/market-item";
import { RoundRecord } from "@/models/round-record";
import { Canvas } from "@react-three/fiber";
import { useTranslations } from "next-intl";
import HorseRaceEnvironment from "./components/race-enviroment";
import { cn } from "@/lib/utils";
import { Suspense, useEffect, useState } from "react";
import GameLoadingScreen from "@/components/common/game-loading-screen";
import useWindowSize from "@/hooks/use-window-size";
import { useThree } from "@react-three/fiber";

type Props = {
  roundRecord: RoundRecord;
  filteredMarket?: MarketItem[];
};

export default function HorseRace({ roundRecord, filteredMarket }: Props) {
  const [cameraView, setCameraView] = useState<'side' | 'top'>('side');
  const isPlaceOver = useIsPlaceOver(roundRecord);

  const handleCameraChange = () => {
    setCameraView(prev => prev === 'side' ? 'top' : 'side');
  };

  return isPlaceOver ? (
    <Suspense fallback={<GameLoadingScreen className="md:h-full h-[500px]" loadingImageClassName="w-10 h-auto" />}>
      <div className="game-gradient-card-parent md:h-full h-64 overflow-hidden relative">
        {/* Camera Change Button */}
        {/* <button
          onClick={handleCameraChange}
          className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-3 py-2 rounded-lg transition-all duration-200 border border-white/30"
        >
          {cameraView === 'side' ? 'Top View' : 'Side View'}
        </button> */}
        
        <Canvas className="bg-gradient-to-b from-sky-300   to-blue-400/85 md:rounded-sm">
          <PixelRatioManager />
          <HorseRaceEnvironment 
            roundRecord={roundRecord} 
            filteredMarket={filteredMarket} 
            changeCameraView={handleCameraChange}
            currentCameraView={cameraView}
          />
        </Canvas>
      </div>
    </Suspense>
  ) : (
    <RacePreparation roundRecord={roundRecord} />
  );
}


function RacePreparation( {className,roundRecord}: {className?: string,roundRecord:RoundRecord} ) {
  const t = useTranslations("game");
  const gameState = useGameState(roundRecord);

  return (
    <div className= {cn("w-full  game-gradient-card-parent overflow-hidden relative text-game-text md:h-full h-64 text-center shadow-2xl", className)}>
      <img src="/images/roulette/game-prep.png" className="w-full h-full rounded-sm object-cover " />
        <div className="rounded-xl p-4 absolute md:top-16  w-fit  md:left-0 md:w-1/2 md:translate-x-0 md:translate-y-0  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <p className="text-white text-xl mb-2">{t('race-begin')}</p>
          <div className="flex flex-col gap-2 text-white text-xl game-time-text"> {gameState.placeTimeLeft.formatted}</div>
        </div>
    </div>
  );
}

const PixelRatioManager = () => {
  const { gl } = useThree();

  const { isMobile } = useWindowSize();
  useEffect(() => {
    gl.setPixelRatio(isMobile ? 1.3 : Math.min(window.devicePixelRatio, 1.5));
  }, [gl, isMobile]);

  return null;
};

"use client";
import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import HorseAnimation from "./components/horse";
import { RoundRecord } from "@/models/round-record";
import {useIsPlaceOver } from "@/hooks/use-current-game";

type Props = {
  roundRecord: RoundRecord;
};

export default function HorseRace({ roundRecord }: Props) {

  const playSound = (audioFile: string) => {
    const audio = new Audio(audioFile);
    audio.play();
  };

  const isPlaceOver = useIsPlaceOver(roundRecord);

/*   const randomSounds = ["/horseNeigh1.mp3", "/horseNeigh2.mp3"];

  const playRandomSound = () => {
    const randomSound = randomSounds[Math.floor(Math.random() * randomSounds.length)];
    playSound(randomSound);
  };

  useEffect(() => {
    let footstepsInterval: NodeJS.Timeout | null = null;
    let randomSoundInterval: NodeJS.Timeout | null = null;

    if (roundRecord) {
      playSound("/raceStart.mp3");

      footstepsInterval = setInterval(() => {
        playSound("/horseSteps.mp3");
      }, 3000);

      randomSoundInterval = setInterval(() => {
        playRandomSound();
      }, Math.random() * (10000 - 5000) + 5000);
    }

    return () => {
      if (footstepsInterval) clearInterval(footstepsInterval);
      if (randomSoundInterval) clearInterval(randomSoundInterval);
    };
  }, [roundRecord]); */

  return isPlaceOver ? (
    <Canvas>
      <HorseAnimation roundRecord={roundRecord} />
    </Canvas>
  ) : (
    <RacePreparation />
  );
}


function RacePreparation() {
  return (
    <div className="w-full  bg-gradient-to-br from-[#1A2D58] to-[#0A1128] rounded-2xl h-full p-6 text-center shadow-2xl">
      <div className="bg-gradient-to-br from-[#101F44] to-[#0A1128] rounded-xl p-4">
        <p className="text-white text-xl mb-2">Race is about to begin</p>
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-200"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-500"></div>
        </div>
      </div>
    </div>
  );
}
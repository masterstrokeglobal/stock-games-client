"use client";
import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { RoundRecord } from "@/models/round-record";
import {useIsPlaceOver } from "@/hooks/use-current-game";
import HorseAnimation from "./components/horse-animation";

type Props = {
  roundRecord: RoundRecord;
};

export default function HorseRace({ roundRecord }: Props) {

  const isPlaceOver = useIsPlaceOver(roundRecord);

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
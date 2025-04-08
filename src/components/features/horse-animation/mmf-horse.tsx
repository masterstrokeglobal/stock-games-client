"use client";
import { useIsPlaceOver } from "@/hooks/use-current-game";
import { RoundRecord } from "@/models/round-record";
import { Canvas } from "@react-three/fiber";
import { useTranslations } from "next-intl";
import HorseRaceEnvironment from "./components/mmf-race-enviroment";

type Props = {
    roundRecord: RoundRecord;

};

export default function HorseRace({  roundRecord}: Props) {

    const isPlaceOver = useIsPlaceOver(roundRecord);

    return isPlaceOver ? (
        <Canvas>
            <HorseRaceEnvironment />
        </Canvas>
    ) : (
        <RacePreparation />
    );
}


function RacePreparation() {
    const t = useTranslations("game");

    return (
        <div className="w-full  bg-gradient-to-br from-[#1A2D58] to-[#0A1128] rounded-2xl h-full p-6 text-center shadow-2xl">
            <div className="bg-gradient-to-br from-[#101F44] to-[#0A1128] rounded-xl p-4">
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
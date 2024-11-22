import React from "react";
import { Physics } from "@react-three/rapier";
import { RoundRecord } from "@/models/round-record";
import HorseRaceEnvironment from "./race-enviroment";
import HorseRaceSimulation from "./horse-render";

type HorseRaceSceneProps = {
  roundRecord: RoundRecord;
};

const HorseRaceScene: React.FC<HorseRaceSceneProps> = ({ roundRecord }) => {
  return (
    <Physics gravity={[0, -30, 0]}>
      <HorseRaceEnvironment />
      <HorseRaceSimulation roundRecord={roundRecord} />
    </Physics>
  );
};

export default HorseRaceScene;
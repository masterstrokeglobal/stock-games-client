import React from "react";
import {
    PerspectiveCamera,
    Stats,
    Sky,
    OrbitControls
} from "@react-three/drei";
import { Ground } from "./Ground";
import FenceRow from "./fence-row";
import { Physics } from "@react-three/rapier";
import HorseAnimation from "./horse-animation";
import { RoundRecord } from "@/models/round-record";

type Props = {
    roundRecord: RoundRecord;
};
const HorseRaceEnvironment = ({
    roundRecord
}: Props) => {
    return (
        <>
            <PerspectiveCamera makeDefault fov={75} position={[0, 10, 60]} />
            <color attach="background" args={[0xf0f0f0]} />
            <Sky sunPosition={[100, 20, 100]} />
            <ambientLight intensity={0.3} />
            <OrbitControls />
            <directionalLight color={0xffffff} intensity={0.8} position={[0, 5, 5]} />
            <Physics gravity={[0, -30, 0]}>
                <Ground />
                <FenceRow x={-35} count={1000} spacing={16} />
                <FenceRow x={85} count={1000} spacing={16} />
                <HorseAnimation roundRecord={roundRecord} />
            </Physics>
            <Stats />
        </>
    );
};

export default HorseRaceEnvironment;
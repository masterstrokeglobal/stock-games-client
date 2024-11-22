import React from "react";
import {
    PerspectiveCamera,
    Stats,
    Sky
} from "@react-three/drei";
import { Ground } from "./Ground";
import FenceRow from "./fence-row";

const HorseRaceEnvironment: React.FC = () => {
    return (
        <>
            <PerspectiveCamera makeDefault fov={75} position={[0, 10, 60]} />
            <color attach="background" args={[0xf0f0f0]} />
            <Sky sunPosition={[100, 20, 100]} />
            <ambientLight intensity={0.3} />
            <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
            <directionalLight color={0xffffff} intensity={0.8} position={[0, 5, 5]} />

            <Ground />
            <FenceRow x={-35} count={1000} spacing={16} />
            <FenceRow x={85} count={1000} spacing={16} />

            <Stats />
        </>
    );
};

export default HorseRaceEnvironment;
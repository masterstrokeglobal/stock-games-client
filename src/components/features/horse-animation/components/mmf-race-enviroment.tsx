import {
    OrbitControls,
    PerspectiveCamera
} from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import TrafficConeRow from "./cone-row";
import HorseAnimation from "./mmf-horse-animation";
import { RaceTrack } from "./race-track";

const HorseRaceEnvironment = () => {
    return (
        <>
            <PerspectiveCamera makeDefault fov={70} zoom={13} position={[-220, 320, 20]} />            
            <OrbitControls 
                enableRotate={true}
                maxPolarAngle={Math.PI / 2 - 0.1 - .02}
                minPolarAngle={Math.PI / 2 - 0.1}
                maxDistance={1000}
            />
            
            {/* Enhanced lighting setup */}
            <directionalLight 
                color={0xffffff} 
                intensity={2} 
                position={[0, 10, 5]} 
                castShadow 
            />
            
            {/* Add ambient light to brighten dark areas */}
            <ambientLight intensity={0.8} />
            
            {/* Add hemisphere light for more natural lighting */}
            <hemisphereLight 
                color={0xffffbb} 
                groundColor={0x080820} 
                intensity={1} 
            />
            
            <Physics gravity={[0, -30, 0]}>
                <RaceTrack />
                <TrafficConeRow x={-150} count={1000} spacing={16} />
                <TrafficConeRow x={200} count={1000} spacing={16} />
                <HorseAnimation />
            </Physics>
        </>
    );
};

export default HorseRaceEnvironment;
import { RoundRecord } from "@/models/round-record";
import {
    OrbitControls,
    PerspectiveCamera,
    Sky
} from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Ground } from "./Ground";
import FenceRow from "./fence-row";
import HorseAnimation from "./horse-animation";

type Props = {
    roundRecord: RoundRecord;
};
const HorseRaceEnvironment = ({
    roundRecord
}: Props) => {
    return (
        <>
            <PerspectiveCamera makeDefault fov={70} zoom={13} position={[-250, 200, 250]} />
            <color attach="background" args={[0xf0f0f0]} />
            <Sky sunPosition={[100, 20, 100]} />
            <ambientLight intensity={0.3} />
            <OrbitControls enableRotate={true}
                maxPolarAngle={Math.PI / 2 - 0.1}
                minPolarAngle={Math.PI / 2 - 0.1}
                maxDistance={1000}
            />
            <directionalLight color={0xffffff} intensity={0.8} position={[0, 5, 5]} />
            <Physics gravity={[0, -30, 0]}>
                <Ground />
                <FenceRow x={-35} count={1000} spacing={16} />
                <FenceRow x={85} count={1000} spacing={16} />
                <HorseAnimation roundRecord={roundRecord} />
            </Physics>
        </>
    );
};

export default HorseRaceEnvironment;
import MovingCloud from "@/components/features/slot-game/moving-cloud";
import MarketItem from "@/models/market-item";
import { RoundRecord } from "@/models/round-record";
import {
  OrbitControls,
  PerspectiveCamera
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { useEffect } from "react";
import FenceRow from "./fence-row";
import { Ground } from "./Ground";
import HorseAnimation from "./horse-animation";
import MovingPeople from "./people-model";

type Props = {
  roundRecord: RoundRecord;
  filteredMarket?: MarketItem[];
  changeCameraView: () => void;
  currentCameraView: 'side' | 'top';
};


const HorseRaceEnvironment = ({
  roundRecord,
  filteredMarket,
  currentCameraView
}: Props) => {

  const { camera } = useThree();

  // Update camera position based on currentCameraView prop
  useEffect(() => {
    if (currentCameraView === 'side') {
      camera.position.set(-380, 70, 0);
      camera.lookAt(0, 15, 0);
    } else {
      camera.position.set(0, -200, 0);
      camera.lookAt(0, 0, 0);
    }
  }, [currentCameraView, camera]);

  return (
    <>
      <PerspectiveCamera makeDefault fov={80} zoom={9} position={[-380, 70, 0]} />
      <ambientLight intensity={1} />
      {/*  */}
      <OrbitControls
        maxPolarAngle={Math.PI / 2 - 0.1 - .02}
        minPolarAngle={Math.PI / 2 - 0.1}
        maxDistance={1000}
        enableRotate={false}
        enablePan={false}
        enableZoom={false}
        enableDamping={false}
        target={[0, 15, 0]} // <-- move this up to pan the view upward
      />
      <directionalLight
        color={0xffffff}
        position={[100, 200, 100]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Physics>
        <MovingPeople position={[120, -2, 0]} rotation={[0, 40.8, 0]} scale={[15, 15, 15]} />
        <FenceRow x={-35} count={1000} spacing={16} />
        <MovingCloud position={[700, 30, 0]} />
        <FenceRow x={85} count={1000} spacing={16} />
        <HorseAnimation roundRecord={roundRecord} filteredMarket={filteredMarket} />
        <Ground />
      </Physics>
    </>
  );
};

export default HorseRaceEnvironment;
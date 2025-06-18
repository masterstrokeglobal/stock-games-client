import MarketItem from "@/models/market-item";
import { RoundRecord } from "@/models/round-record";
import {
    OrbitControls,
    PerspectiveCamera,
    Sky
} from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import FenceRow from "./fence-row";
import { Ground } from "./Ground";
import HorseAnimation from "./horse-animation";
import MovingPeople from "./people-model";

type Props = {
    roundRecord: RoundRecord;
    filteredMarket?: MarketItem[];

};


const HorseRaceEnvironment = ({
    roundRecord,
    filteredMarket
}: Props) => {

    return (
        <>
        <PerspectiveCamera makeDefault fov={70} zoom={9} position={[-380, 70,0]} />
          
      <Sky sunPosition={[0, 20, 0]} azimuth={180} distance={1000}/>
      <ambientLight intensity={1} />
            <OrbitControls 
                enableRotate={true}
                maxPolarAngle={Math.PI / 2 - 0.1 - .02}
                minPolarAngle={Math.PI / 2 - 0.1}
                target={[0, 15, 0]} // <-- move this up to pan the view upward

                />
            <directionalLight
                color={0xffffff}
                position={[100, 200, 100]}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />  
            <Physics>
                <MovingPeople position={[120, -2, 0]} rotation={[0,40.8, 0]} scale={[15, 15, 15]} />
                <FenceRow x={-35} count={1000} spacing={16}   />
                <FenceRow x={85} count={1000} spacing={16}  />
                <HorseAnimation roundRecord={roundRecord} filteredMarket={filteredMarket} />
                <Ground />
            </Physics>
        </>
    );
};

export default HorseRaceEnvironment;
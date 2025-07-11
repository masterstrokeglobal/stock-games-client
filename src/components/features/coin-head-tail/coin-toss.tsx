"use client";

import { HeadTailPlacementType } from "@/models/head-tail";
import { Environment, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { useWindowSize } from "@/hooks/use-window-size";

// Constants
const COIN_RADIUS_DESKTOP =1 ; // Reduced from 0.7 for 80px equivalent
const COIN_RADIUS_MOBILE = 1; // Reduced from 0.7 for 40px equivalent
const COIN_THICKNESS = 0.05;
const TABLE_Y_SURFACE = -0.03;
const COIN_LANDED_Y_CENTER = TABLE_Y_SURFACE + COIN_THICKNESS / 2;

interface CoinComponentProps {
  isFlipping: boolean;
  resultOutcome?: HeadTailPlacementType;
}

const COIN_START_Y = COIN_LANDED_Y_CENTER + 1.2;

const Coin = ({ isFlipping, resultOutcome }: CoinComponentProps) => {
  const coinRef = useRef<THREE.Mesh>(null);
  const rotationXSpeed = useRef(0);
  const rotationYSpeed = useRef(0);
  const animState = useRef<'idle' | 'flipping' | 'settling' | 'result'>('idle');

  const hasSetResult = useRef(false);
  const hasSettledCallbackCalled = useRef(false);
  const [currentY, setCurrentY] = useState(COIN_START_Y); // Start with margin

  // New: scale state for animation
  const [currentScale, setCurrentScale] = useState(0.3); // Start small

  const { width } = useWindowSize();
  const isMobile = width < 768;
  const coinRadius = isMobile ? COIN_RADIUS_MOBILE : COIN_RADIUS_DESKTOP;

  const headTexture = useTexture("/images/coins/head.png");
  const tailTexture = useTexture("/images/coins/tail.png");

  const headMaterial = new THREE.MeshStandardMaterial({ map: headTexture });
  const tailMaterial = new THREE.MeshStandardMaterial({ map: tailTexture });
  const edgeMaterial = new THREE.MeshStandardMaterial({ color: "#FFBF00" });

  useEffect(() => {
    if (isFlipping) {
      animState.current = 'flipping';
      hasSetResult.current = false;
      hasSettledCallbackCalled.current = false;
      rotationXSpeed.current = 7;
      rotationYSpeed.current = 0.5 + Math.random();
      setCurrentY(COIN_START_Y + 1.5); // Start higher above
      setCurrentScale(0.3); // Start small
    } else if (animState.current === 'flipping') {
      animState.current = 'settling';
    }
  }, [isFlipping]);

  useFrame((_, delta) => {
    const coin = coinRef.current;
    if (!coin) return;

    if (animState.current === 'flipping') {
      coin.rotation.x += rotationXSpeed.current * delta;
      coin.rotation.y += rotationYSpeed.current * delta;

      // Animate Y from above to COIN_START_Y with bounce
      const targetY = COIN_START_Y + Math.sin(Date.now() * 0.01) * 0.05;
      setCurrentY(prev => THREE.MathUtils.lerp(prev, targetY, 0.12));

      // Animate scale from 0.3 to 1
      setCurrentScale(prev => THREE.MathUtils.lerp(prev, 1, 0.12));

      coin.position.y = currentY;
      coin.scale.set(currentScale, currentScale, currentScale);
    }

    if (animState.current === 'settling') {
      rotationXSpeed.current *= 0.85;
      rotationYSpeed.current *= 0.85;
      coin.rotation.x += rotationXSpeed.current * delta;
      coin.rotation.y += rotationYSpeed.current * delta;

      // Easing down to surface
      setCurrentY(prev => THREE.MathUtils.lerp(prev, COIN_LANDED_Y_CENTER, 0.08));
      setCurrentScale(prev => THREE.MathUtils.lerp(prev, 1, 0.15));
      coin.position.y = currentY;
      coin.scale.set(currentScale, currentScale, currentScale);

      if (rotationXSpeed.current < 0.2 && rotationYSpeed.current < 0.2) {
        animState.current = 'result';
      }
    }

    if (animState.current === 'result' && resultOutcome) {
      coin.rotation.x = THREE.MathUtils.lerp(
        coin.rotation.x,
        resultOutcome === HeadTailPlacementType.HEAD ? 0 : Math.PI,
        0.1
      );
      coin.rotation.y = THREE.MathUtils.lerp(coin.rotation.y, 0, 0.1);
      setCurrentY(prev => THREE.MathUtils.lerp(prev, COIN_LANDED_Y_CENTER, 0.08));
      setCurrentScale(prev => THREE.MathUtils.lerp(prev, 1, 0.15));
      coin.position.y = currentY;
      coin.scale.set(currentScale, currentScale, currentScale);

      if (
        Math.abs(
          coin.rotation.x -
            (resultOutcome === HeadTailPlacementType.HEAD ? 0 : Math.PI)
        ) < 0.01
      ) {
        if (!hasSetResult.current) {
          hasSetResult.current = true;
        }
        if (!hasSettledCallbackCalled.current) {
          hasSettledCallbackCalled.current = true;
        }
        animState.current = 'idle';
      }
    }

    // Ensure scale is always set (for idle state)
    if (animState.current === 'idle') {
      coin.scale.set(1, 1, 1);
    }
  });

  return (
    <mesh ref={coinRef} position={[0, currentY, 0]} castShadow>
      <cylinderGeometry args={[coinRadius, coinRadius, COIN_THICKNESS, 64]} />
      <meshStandardMaterial attach="material-0" {...edgeMaterial} />
      <meshStandardMaterial attach="material-1" {...headMaterial} />
      <meshStandardMaterial attach="material-2" {...tailMaterial} />
    </mesh>
  );
};

const Table = () => {
  return (
      <planeGeometry args={[30, 30]} />
  );
};

const CameraController = () => {
  const { camera } = useThree();
  const targetPosition = useRef<THREE.Vector3>(new THREE.Vector3(0, 5, 0));
  const lookTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
      camera.position.lerp(targetPosition.current, 0.05);
      camera.lookAt(lookTarget.current);
  });

  return null;
};

interface CoinTossContainerProps {
  isFlipping: boolean;
  resultOutcome?: HeadTailPlacementType;
  className?: string;
  style?: React.CSSProperties;
}

export default function CoinToss({ isFlipping, resultOutcome, className, style   }: CoinTossContainerProps) {
  return (
    <div className={cn("absolute  md:w-32 md:h-32 w-20 h-20", className)} style={style}>
      <Canvas 
        shadows 
        camera={{ position: [0, 5, 0], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[4, 5, 3]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={20}
          shadow-camera-left={-7}
          shadow-camera-right={7}
          shadow-camera-top={7}
          shadow-camera-bottom={-7}
        />
        <directionalLight position={[-4, 3, -3]} intensity={0.3} />
        <Table />
        <Coin
          isFlipping={isFlipping}
          resultOutcome={resultOutcome}
        />
        <Environment preset="sunset" />
        <CameraController />
      </Canvas>
    </div>
  );
}

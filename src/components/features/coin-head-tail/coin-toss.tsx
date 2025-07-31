"use client";

import { useWindowSize } from "@/hooks/use-window-size";
import { cn } from "@/lib/utils";
import { HeadTailPlacementType } from "@/models/head-tail";
import { Html } from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { TextureLoader } from "three";

// Constants
const COIN_RADIUS_DESKTOP = 1;
const COIN_RADIUS_MOBILE = 1;
const COIN_THICKNESS = 0.05;
const TABLE_Y_SURFACE = -0.03;
const COIN_LANDED_Y_CENTER = TABLE_Y_SURFACE + COIN_THICKNESS / 2;
const COIN_START_Y = COIN_LANDED_Y_CENTER + 1.2;

interface CoinComponentProps {
  isFlipping: boolean;
  resultOutcome?: HeadTailPlacementType;
}

const Coin = ({ isFlipping, resultOutcome }: CoinComponentProps) => {
  const coinRef = useRef<THREE.Mesh>(null);
  const rotationXSpeed = useRef(0);
  const rotationYSpeed = useRef(0);
  const animState = useRef<'idle' | 'flipping' | 'settling' | 'result'>('idle');
  const hasSetResult = useRef(false);
  const hasSettledCallbackCalled = useRef(false);
  const [currentY, setCurrentY] = useState(COIN_START_Y);
  const [currentScale, setCurrentScale] = useState(0.3);

  const { width } = useWindowSize();
  const isMobile = width < 768;
  const coinRadius = isMobile ? COIN_RADIUS_MOBILE : COIN_RADIUS_DESKTOP;

  // Load textures
  const [headTexture, tailTexture] = useLoader(TextureLoader, [
    "/images/coins/head.png",
    "/images/coins/tail.png",
  ]);

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
      setCurrentY(COIN_START_Y + 1.5);
      setCurrentScale(0.3);
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

      const targetY = COIN_START_Y + Math.sin(Date.now() * 0.01) * 0.05;
      setCurrentY(prev => THREE.MathUtils.lerp(prev, targetY, 0.12));
      setCurrentScale(prev => THREE.MathUtils.lerp(prev, 1, 0.12));

      coin.position.y = currentY;
      coin.scale.set(currentScale, currentScale, currentScale);
    }

    if (animState.current === 'settling') {
      rotationXSpeed.current *= 0.85;
      rotationYSpeed.current *= 0.85;
      coin.rotation.x += rotationXSpeed.current * delta;
      coin.rotation.y += rotationYSpeed.current * delta;

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
        Math.abs(coin.rotation.x - (resultOutcome === HeadTailPlacementType.HEAD ? 0 : Math.PI)) < 0.01
      ) {
        if (!hasSetResult.current) hasSetResult.current = true;
        if (!hasSettledCallbackCalled.current) hasSettledCallbackCalled.current = true;
        animState.current = 'idle';
      }
    }

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

export default function CoinToss({
  isFlipping,
  resultOutcome,
  className,
  style,
}: CoinTossContainerProps) {
  return (
    <div className={cn("absolute md:w-32 md:h-32 w-20 h-20", className)} style={style}>
      <Canvas
        shadows
        camera={{ position: [0, 5, 0], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        className="w-full h-full"
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={2} />
        
        <directionalLight position={[-4, 3, -3]} intensity={3} />
        <Suspense
          fallback={
            <Html center>
              <div className="text-white text-xs animate-pulse">Loading coin...</div>
            </Html>
          }
        >
          <Coin isFlipping={isFlipping} resultOutcome={resultOutcome} />
        </Suspense>
        <CameraController />
      </Canvas>
    </div>
  );
}

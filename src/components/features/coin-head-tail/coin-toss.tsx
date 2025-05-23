"use client";

import { HeadTailPlacementType } from "@/models/head-tail";
import { Environment, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Constants
const COIN_RADIUS = 0.7;
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

  const headTexture = useTexture("/images/coin-face/head.png");
  const tailTexture = useTexture("/images/coin-face/tail.png");

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
      setCurrentY(COIN_START_Y); // Reset to default margin height
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

      // Bounce around initial margin height
      const targetY = COIN_START_Y + Math.sin(Date.now() * 0.01) * 0.05;
      setCurrentY(prev => THREE.MathUtils.lerp(prev, targetY, 0.1));
      coin.position.y = currentY;
    }

    if (animState.current === 'settling') {
      rotationXSpeed.current *= 0.85;
      rotationYSpeed.current *= 0.85;
      coin.rotation.x += rotationXSpeed.current * delta;
      coin.rotation.y += rotationYSpeed.current * delta;

      // Easing down to surface
      setCurrentY(prev => THREE.MathUtils.lerp(prev, COIN_LANDED_Y_CENTER, 0.08));
      coin.position.y = currentY;

      if (rotationXSpeed.current < 0.2 && rotationYSpeed.current < 0.2) {
        animState.current = 'result';
      }
    }

    if (animState.current === 'result' && resultOutcome) {
      coin.rotation.x = THREE.MathUtils.lerp(coin.rotation.x, resultOutcome === HeadTailPlacementType.HEAD ? 0 : Math.PI, 0.1);
      coin.rotation.y = THREE.MathUtils.lerp(coin.rotation.y, 0, 0.1);
      setCurrentY(prev => THREE.MathUtils.lerp(prev, COIN_LANDED_Y_CENTER, 0.08));
      coin.position.y = currentY;

      if (Math.abs(coin.rotation.x - (resultOutcome === HeadTailPlacementType.HEAD ? 0 : Math.PI)) < 0.01) {
        if (!hasSetResult.current) {
          hasSetResult.current = true;
        }
        if (!hasSettledCallbackCalled.current) {
          hasSettledCallbackCalled.current = true;
        }
        animState.current = 'idle';
      }
    }
  });

  return (
    <mesh ref={coinRef} position={[0, currentY, 0]} castShadow>
      <cylinderGeometry args={[COIN_RADIUS, COIN_RADIUS, COIN_THICKNESS, 64]} />
      <meshStandardMaterial attach="material-0" {...edgeMaterial} />
      <meshStandardMaterial attach="material-1" {...headMaterial} />
      <meshStandardMaterial attach="material-2" {...tailMaterial} />
    </mesh>
  );
};

  
  
const Table = () => {
  const woodTexture = useTexture("/images/coin-face/wood.jpg");
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, TABLE_Y_SURFACE, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial map={woodTexture} />
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
}

export default function CoinToss({ isFlipping, resultOutcome }: CoinTossContainerProps) {
  return (
    <Canvas shadows camera={{ position: [0, 5, 0], fov: 45 }}>
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
  );
}

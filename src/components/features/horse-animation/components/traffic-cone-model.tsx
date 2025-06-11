
// In a separate file named fence-model.tsx
import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type FenceModelProps = {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
};

const TrafficConeModel: React.FC<FenceModelProps> = ({ position, rotation, scale }) => {
    const { scene } = useGLTF("/traffic_cone.glb");
    const modelRef = useRef<THREE.Group>(null);


    useEffect(() => {
        if (modelRef.current) {
            modelRef.current.position.set(...position);
            modelRef.current.rotation.set(...rotation);
            modelRef.current.scale.set(...scale);
        }
    }, [position, rotation, scale]);

    return <primitive object={scene.clone()} ref={modelRef} />;
};

export default TrafficConeModel;
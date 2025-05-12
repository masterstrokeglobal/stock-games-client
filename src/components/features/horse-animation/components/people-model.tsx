
// In a separate file named fence-model.tsx
import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type PeopleModelProps = {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
};

const PeopleModel: React.FC<PeopleModelProps> = ({position, rotation, scale }) => {
    const { scene } = useGLTF("/people3.glb");
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

export default PeopleModel;
import React, { useRef, useEffect, forwardRef, useMemo } from "react";
import { useFrame, useLoader, extend } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";


// Extend Three.js classes to make them available in JSX
extend({ GLTFLoader, DRACOLoader });

type FerrariModelProps = {
    position: [number, number, number];
    scale: [number, number, number];
    speed: number;
    bodyColor: string;
    detailsColor: string;
    glassColor: string;
    showShadow?: boolean;
};

const FerrariModel = forwardRef<THREE.Group, FerrariModelProps>(
    ({ position, scale, speed, bodyColor, detailsColor, glassColor, showShadow = true }, ref) => {
        const group = useRef<THREE.Group | null>(null);
        const wheels = useRef<THREE.Object3D[]>([]);

        // Create materials
        const materials = useMemo(() => {
            return {
                body: new THREE.MeshPhysicalMaterial({
                    color: new THREE.Color(bodyColor),
                    metalness: 1.0,
                    roughness: 0.5,
                    clearcoat: 1.0,
                    clearcoatRoughness: 0.03
                }),
                details: new THREE.MeshStandardMaterial({
                    color: new THREE.Color(detailsColor),
                    metalness: 1.0,
                    roughness: 0.5
                }),
                glass: new THREE.MeshPhysicalMaterial({
                    color: new THREE.Color(glassColor),
                    metalness: 0.25,
                    roughness: 0,
                    transmission: 1.0
                })
            };
        }, [bodyColor, detailsColor, glassColor]);

        // Load the model
        const gltf = useLoader(GLTFLoader, "/ferrari.glb", (loader) => {
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('https://raw.githubusercontent.com/mrdoob/three.js/refs/heads/master/examples/jsm/libs/draco/gltf/'); // use a full url path
            loader.setDRACOLoader(dracoLoader);
        });

        // Set up the car model with materials and components
        const carModel = useMemo(() => {
            if (!gltf) return null;

            const model = gltf.scene.children[0].clone();

            // Apply materials to respective parts
            const carBody = model.getObjectByName('body') as THREE.Mesh;
            if (carBody) {
                carBody.material = materials.body;
            }

            // Apply details material to rims and trim
            ['rim_fl', 'rim_fr', 'rim_rr', 'rim_rl', 'trim'].forEach(partName => {
                if (model.getObjectByName(partName)) {
                    (model.getObjectByName(partName) as any).material = materials.details;
                }
            });

            // Apply glass material
            const glass = model.getObjectByName('glass') as THREE.Mesh;
            if (glass) {
                glass.material = materials.glass;
            }

            // Collect wheels for animation
            wheels.current = [
                model.getObjectByName('wheel_fl'),
                model.getObjectByName('wheel_fr'),
                model.getObjectByName('wheel_rl'),
                model.getObjectByName('wheel_rr')
            ].filter((wheel): wheel is THREE.Object3D => wheel !== undefined);


            return model;
        }, [gltf, materials, showShadow]);

        // Update model when props change
        useEffect(() => {
            if (!group.current || !carModel) return;

            // Clear existing children
            while (group.current.children.length > 0) {
                group.current.remove(group.current.children[0]);
            }

            // Add the car model to the group
            group.current.add(carModel);

            // Set position and scale
            group.current.position.set(...position);
            group.current.scale.set(...scale);
            group.current.rotation.set(0, Math.PI, 0);
        }, [carModel, position, scale]);

        // Animation loop
        useFrame((_, delta) => {
            // Animate wheels rotation
            wheels.current.forEach(wheel => {
                if (wheel) {
                    wheel.rotation.x -= speed * delta * 10;
                }
            });
        });

        return (
            <group
                ref={(el: any) => {
                    group.current = el;
                    if (typeof ref === "function") ref(el);
                    else if (ref) ref.current = el;
                }}
            />
        );
    }
);

FerrariModel.displayName = "FerrariModel";

export default FerrariModel;
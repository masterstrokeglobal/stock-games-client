import { OrbitControls, useAnimations, useGLTF } from '@react-three/drei'
import { Canvas, PrimitiveProps } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'

function Model(props: Partial<PrimitiveProps>) {
    const group = useRef<THREE.Group>(null)
    const gltf = useGLTF("/models/dice/dance/scene.gltf")
    const { animations } = gltf
    const { actions } = useAnimations(animations, group)
    
    // Play all animations
    useEffect(() => {
        if (actions) {
            Object.values(actions).forEach((action) => {
                if (action) {
                    action.play()
                }
            })
        }
    }, [actions])
    
    return (
        <group ref={group}>
            <primitive 
                {...props} 
                object={gltf.scene} 
                position={[0,-3,0]}
                scale={[2, 2, 2]} // Increased scale by 2x
            />
        </group>
    )
}

export default function DancingGirl() {
    return (
        <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <OrbitControls/>
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Suspense fallback={null}>
                <Model />
            </Suspense>
        </Canvas>
    )
}
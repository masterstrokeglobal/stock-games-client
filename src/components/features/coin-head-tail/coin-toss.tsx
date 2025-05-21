"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, useTexture, Environment } from "@react-three/drei"
import * as THREE from "three"

interface CoinProps {
  isFlipping: boolean
  setResult: (result: string) => void
}

const Coin = ({ isFlipping, setResult }: CoinProps) => {
  const coinRef = useRef<THREE.Mesh>(null)
  const rotationAxisRef = useRef(new THREE.Vector3(1, 0.1, 0).normalize())
  const lastPositionRef = useRef({ isFlipping: false })

  // Load textures
  const headTexture = useTexture("/images/coin-face/head.png")
  const tailTexture = useTexture("/images/coin-face/tail.png")
  const edgeTexture = useTexture("/images/coin-face/head.png")

  // Create materials with proper mapping
  const headMaterial = new THREE.MeshStandardMaterial({
    map: headTexture,
    metalness: 0.8,
    roughness: 0.2,
    side: THREE.DoubleSide
  })

  const tailMaterial = new THREE.MeshStandardMaterial({
    map: tailTexture,
    metalness: 0.8,
    roughness: 0.2,
    side: THREE.DoubleSide
  })

  const edgeMaterial = new THREE.MeshStandardMaterial({
    map: edgeTexture,
    metalness: 0.9,
    roughness: 0.2,
    side: THREE.DoubleSide
  })

  // Animation logic
  useFrame((state, delta) => {
    if (!coinRef.current) return

    if (isFlipping) {
      // Continuous flipping with natural motion
      coinRef.current.rotation.x += rotationAxisRef.current.x * 10 * delta
      coinRef.current.rotation.y += rotationAxisRef.current.y * 10 * delta
    } else if (lastPositionRef.current.isFlipping) {
      // Just stopped flipping - snap to a flat position
      const currentRotation = coinRef.current.rotation.x % (Math.PI * 2)
      const targetRotation = Math.round(currentRotation / Math.PI) * Math.PI

      // Snap to either heads or tails position
      coinRef.current.rotation.x = targetRotation
      coinRef.current.rotation.y = 0

      // Determine result
      const isHeads =
        Math.abs(targetRotation) % (Math.PI * 2) < 0.1 || Math.abs((targetRotation % (Math.PI * 2)) - Math.PI * 2) < 0.1
      setResult(isHeads ? "heads" : "tails")
    }

    // Track last flipping state
    lastPositionRef.current.isFlipping = isFlipping
  })

  return (
    <group>
      <mesh ref={coinRef} position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 64]} />
        <primitive object={headMaterial} attach="material-0" />
        <primitive object={edgeMaterial} attach="material-1" />
        <primitive object={tailMaterial} attach="material-2" />
      </mesh>
    </group>
  )
}

export default function CoinToss({ isFlipping, setResult }: CoinProps) {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <Coin isFlipping={isFlipping} setResult={setResult} />
      <OrbitControls enableZoom={false} enablePan={false} />
      <Environment preset="studio" />
    </Canvas>
  )
}

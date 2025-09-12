import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { gsap } from 'gsap'
import { RoundRecord } from "@/models/round-record";

export const SlotCanvas = ({ time, stockStates, isPlaceOver, winningIdRoundRecord }: { time: string, stockStates: number[], isPlaceOver: boolean, winningIdRoundRecord: RoundRecord | null }) => {
    const mountRef = useRef<HTMLDivElement>(null)
    const cylindersRef = useRef<THREE.Mesh[]>([])

    useEffect(() => {
        if (!mountRef.current) return

        // Clear previous cylinders reference
        cylindersRef.current = []

        // Scene setup
        const scene = new THREE.Scene()
        
        // Orthographic camera setup
        const aspect = mountRef.current.offsetWidth / mountRef.current.offsetHeight
        const frustumSize = 17.5
        const camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,  // left
            frustumSize * aspect / 2,   // right
            frustumSize / 2,            // top
            frustumSize / -2,           // bottom
            1,                          // near
            1000                        // far
        )
        
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setPixelRatio(window.devicePixelRatio * 4)
        
        renderer.setSize(mountRef.current.offsetWidth, mountRef.current.offsetHeight)
        mountRef.current.appendChild(renderer.domElement)

        // Lighting - Enhanced setup for better brightness
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
        scene.add(ambientLight)

        // Main front directional light
        const frontDirectionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
        frontDirectionalLight.position.set(0, 5, 15)
        frontDirectionalLight.target.position.set(0, 0, 0)
        scene.add(frontDirectionalLight)
        scene.add(frontDirectionalLight.target)

        // Additional front lights for better illumination
        const leftFrontLight = new THREE.DirectionalLight(0xffffff, 0.8)
        leftFrontLight.position.set(-10, 5, 10)
        leftFrontLight.target.position.set(0, 0, 0)
        scene.add(leftFrontLight)
        scene.add(leftFrontLight.target)

        const rightFrontLight = new THREE.DirectionalLight(0xffffff, 0.8)
        rightFrontLight.position.set(10, 5, 10)
        rightFrontLight.target.position.set(0, 0, 0)
        scene.add(rightFrontLight)
        scene.add(rightFrontLight.target)

        // Top light for even coverage
        const topLight = new THREE.DirectionalLight(0xffffff, 0.6)
        topLight.position.set(0, 15, 5)
        topLight.target.position.set(0, 0, 0)
        scene.add(topLight)
        scene.add(topLight.target)

        const pointLight = new THREE.PointLight(0xffffff, 1, 100)
        pointLight.position.set(10, 10, 10)
        scene.add(pointLight)

        // Create 5 cylinders
        const colors = [0xFFD700, 0xC0C0C0, 0xCD7F32, 0xFF6B6B, 0x4ECDC4, 0x000000]
        const initialRotation= [
            {x: 0, y: 0, z: -Math.PI/2},
            {x: 0, y: 0, z: -Math.PI/2},
            {x: 0, y: 0, z: -Math.PI/2},
            {x: 0, y: 0, z: -Math.PI/2},
            {x: 0, y: 0, z: -Math.PI/2},
            {x: 0, y: 0, z: -Math.PI/2},
        ]
        
        // Load texture
        const textureLoader = new THREE.TextureLoader()
        const slotTexture = textureLoader.load('/texture/3.png')
        const slotTexture_emoji = textureLoader.load('/texture/emoji.png')
        
        // Configure texture wrapping and repeat
        slotTexture.wrapS = THREE.RepeatWrapping
        slotTexture.wrapT = THREE.RepeatWrapping
        slotTexture.repeat.set(1, 1)
        
        // Fix texture blurriness with filtering settings
        slotTexture.magFilter = THREE.LinearFilter
        slotTexture.minFilter = THREE.LinearMipmapLinearFilter
        slotTexture.generateMipmaps = false 
        slotTexture.anisotropy = renderer.capabilities.getMaxAnisotropy()
        
        // Rotate texture 18 degrees
        slotTexture.rotation = Math.PI / 2
        slotTexture.center.set(0.5, 0.5) // Set rotation center to middle of texture
        
        // Configure emoji texture
        slotTexture_emoji.wrapS = THREE.RepeatWrapping
        slotTexture_emoji.wrapT = THREE.RepeatWrapping
        slotTexture_emoji.repeat.set(1, 1)
        slotTexture_emoji.magFilter = THREE.LinearFilter
        slotTexture_emoji.minFilter = THREE.LinearMipmapLinearFilter
        slotTexture_emoji.generateMipmaps = false 
        slotTexture_emoji.anisotropy = renderer.capabilities.getMaxAnisotropy()
        slotTexture_emoji.rotation = Math.PI / 2
        slotTexture_emoji.center.set(0.5, 0.5)
        
        // CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded)
        const radius = 8
        const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, 2.7, 20, 1, true)
        const gap = 2.8
        const cylinders: THREE.Mesh[] = []

        colors.forEach((color, index) => {
            // Use emoji texture for the 6th wheel (index 5)
            const textureToUse = index === 5 ? slotTexture_emoji : slotTexture
            
            const material = new THREE.MeshStandardMaterial({
                map: textureToUse,
                color: new THREE.Color(0xffd700),
                metalness: 0.8,
                roughness: 0.3,
                envMapIntensity: 2.0
            })
            const cylinder = new THREE.Mesh(cylinderGeometry, material)
            cylinder.rotation.x = initialRotation[index].x
            cylinder.rotation.y = initialRotation[index].y
            cylinder.rotation.z = initialRotation[index].z

            cylinder.position.x = (index - 2.5) * gap
            cylinder.position.y = 0
            cylinder.position.z = 0

            scene.add(cylinder)
            cylinders.push(cylinder)
            cylindersRef.current.push(cylinder) // Store in ref for animation access
        })

        // Camera position
        camera.position.z = 10

        // Orbit Controls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableZoom = true
        controls.enablePan = true
        controls.enableRotate = true

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate)
            controls.update()
            renderer.render(scene, camera)
            const isPlaceOver_local_store = window.localStorage.getItem('isPlaceOver') || false
            if (isPlaceOver_local_store === 'true') {
                const speed = 0.05
                cylindersRef.current.forEach((cylinder, index) => {
                    if (index % 2 === 0) {
                        cylinder.rotation.x += speed
                    } else {
                        cylinder.rotation.x -= speed
                    }
                })
            }
        }
        animate()

        // Handle resize
        const handleResize = () => {
            if (!mountRef.current) return

            const newAspect = mountRef.current.offsetWidth / mountRef.current.offsetHeight
            camera.left = frustumSize * newAspect / -2
            camera.right = frustumSize * newAspect / 2
            camera.top = frustumSize / 2
            camera.bottom = frustumSize / -2
            camera.updateProjectionMatrix()
            renderer.setSize(mountRef.current.offsetWidth, mountRef.current.offsetHeight)
        }

        window.addEventListener('resize', handleResize)

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize)
            controls.dispose()
            renderer.dispose()
            cylinders.forEach(cylinder => {
                cylinder.geometry.dispose()
                if (cylinder.material instanceof THREE.Material) {
                    cylinder.material.dispose()
                }
            })
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement)
            }
        }
    }, [])

    // Animate wheels based on stockStates changes - ONLY when betting is closed
    useEffect(() => {
        if (cylindersRef.current.length === 0) return

        // Only animate when betting is closed (isPlaceOver is true)
        if (!isPlaceOver) {
            window.localStorage.setItem('isPlaceOver', 'false')
            return
        }

        if (winningIdRoundRecord !== null && isPlaceOver && time === "00" ) {
            console.log(`sarthak sharma winningIdRoundRecord 2`, winningIdRoundRecord )
            window.localStorage.setItem('isPlaceOver', 'false')

            stockStates.forEach((value, index) => {
                if (cylindersRef.current[index]) {
                    const targetRotation = - (Math.PI / 2 + (value * 36) * (Math.PI / 180)) + Math.PI / 2 + Math.PI / 16 // Add to initial rotation

                    gsap.to(cylindersRef.current[index].rotation, {
                        x: targetRotation, // Adding to the existing Math.PI/2 rotation
                        duration: 1,
                        ease: "power2.out",
                        onComplete: () => {
                            console.log("sarthak sharma onComplete")
                        }
                    })
                }
            })
            return;
        }


        if (isPlaceOver) {
            // make all the wheels spin 360 degrees please and then repeat the animation
            window.localStorage.setItem('isPlaceOver', 'true')
            return
        }

    }, [stockStates, isPlaceOver, winningIdRoundRecord])

    return (
        <div ref={mountRef} className="w-full aspect-square relative bg-red-501 flex items-center justify-center slot-canvas-container"></div>
    )
}
"use client"

import { gsap } from "gsap"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

interface AviatorCanvasProps {
  multiplier: number
  shouldStartTakeOffAnimation?: boolean
  opacity?: number
}

const AviatorCanvas = ({  shouldStartTakeOffAnimation = false, opacity = 1 }: AviatorCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    plane: THREE.Group | null
    mixer: THREE.AnimationMixer | null
    animations: THREE.AnimationClip[]
    actions: THREE.AnimationAction[]
    animationId: number | null
    isAnimationPlaying: boolean
    initialPosition: THREE.Vector3
    centerPosition: THREE.Vector3
    flyAwayPosition: THREE.Vector3
  } | null>(null)


  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    })

    renderer.setClearColor(0x000000, 0) // Transparent background
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // Enhanced tone mapping for HDR rendering
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    renderer.outputColorSpace = THREE.SRGBColorSpace

    // Professional Lighting Setup

    // 1. Key Light (Primary Directional Light)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5)
    keyLight.position.set(10, 15, 5)
    keyLight.castShadow = true

    // Enhanced shadow settings for key light
    keyLight.shadow.mapSize.width = 4096
    keyLight.shadow.mapSize.height = 4096
    keyLight.shadow.camera.near = 0.1
    keyLight.shadow.camera.far = 100
    keyLight.shadow.camera.left = -15
    keyLight.shadow.camera.right = 15
    keyLight.shadow.camera.top = 15
    keyLight.shadow.camera.bottom = -15
    keyLight.shadow.bias = -0.0001
    keyLight.shadow.normalBias = 0.02
    keyLight.shadow.radius = 8

    scene.add(keyLight)

    // 2. Fill Light (Secondary Directional Light)
    const fillLight = new THREE.DirectionalLight(0xffffff, 1.2)
    fillLight.position.set(-8, 5, -3)
    // Fill light typically doesn't cast shadows to avoid double shadows
    fillLight.castShadow = false
    scene.add(fillLight)

    // 3. Ambient Light (Base Illumination)
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3)
    scene.add(ambientLight)

    // Camera position
    camera.position.set(-3, 0.5, 0)
    camera.lookAt(0, 0, 0)

    // Define positions
    const centerPosition = new THREE.Vector3(0, 0, 0) // Current center position
    const initialPosition = new THREE.Vector3(-6, -3, -4) // Far away, bottom left
    const flyAwayPosition = new THREE.Vector3(8, 4, 6) // Far away from camera, top right

    // Handle resize function
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      camera.aspect = rect.width / rect.height
      camera.updateProjectionMatrix()
      renderer.setSize(rect.width, rect.height)
    }

    // Initial resize
    handleResize()

    // Load the airplane model with enhanced PBR support
    const loader = new GLTFLoader()
    let plane: THREE.Group | null = null
    let mixer: THREE.AnimationMixer | null = null
    let animations: THREE.AnimationClip[] = []
    const actions: THREE.AnimationAction[] = []

    loader.load(
      '/models/aviator/plane.glb',
      (gltf) => {
        plane = gltf.scene
        plane.scale.set(2, 2, 2)

        // Center the plane model
        const box = new THREE.Box3().setFromObject(plane)
        const center = box.getCenter(new THREE.Vector3())
        plane.position.sub(center)

        // Set initial position (far away, bottom left)
        plane.position.copy(centerPosition)

        // Setup animations if they exist
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(plane)
          animations = gltf.animations

          // Create actions for all animations
          animations.forEach((clip) => {
            const action = mixer!.clipAction(clip)
            action.setLoop(THREE.LoopRepeat, Infinity)
            // Start animations but pause them immediately
            action.play()
            action.paused = true
            actions.push(action)
          })

          console.log(`Loaded ${animations.length} animations:`, animations.map(clip => clip.name))
        } else {
          console.log('No animations found in the model')
        }

        // Enhanced material processing for PBR
        plane.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true

            // Enhanced PBR material properties
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                  if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
                    // Optimize for realistic rendering
                    mat.envMapIntensity = 1.0
                    mat.metalness = mat.metalness || 0.1
                    mat.roughness = mat.roughness || 0.5

                    // Enable proper color space
                    if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace
                    if (mat.emissiveMap) mat.emissiveMap.colorSpace = THREE.SRGBColorSpace
                  }
                })
              } else if (child.material instanceof THREE.MeshStandardMaterial || child.material instanceof THREE.MeshPhysicalMaterial) {
                child.material.envMapIntensity = 1.0
                child.material.metalness = child.material.metalness || 0.1
                child.material.roughness = child.material.roughness || 0.5

                if (child.material.map) child.material.map.colorSpace = THREE.SRGBColorSpace
                if (child.material.emissiveMap) child.material.emissiveMap.colorSpace = THREE.SRGBColorSpace
              }
            }
          }
        })

        scene.add(plane)

        if (sceneRef.current) {
          sceneRef.current.plane = plane
          sceneRef.current.mixer = mixer
          sceneRef.current.animations = animations
          sceneRef.current.actions = actions
          sceneRef.current.isAnimationPlaying = false // Start with animations paused
          sceneRef.current.initialPosition = initialPosition
          sceneRef.current.centerPosition = centerPosition
          sceneRef.current.flyAwayPosition = flyAwayPosition
        }
      },
      (progress) => {
        console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%')
      },
      (error) => {
        console.error('Error loading model:', error)
      }
    )

    // Store references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      plane,
      mixer,
      animations,
      actions,
      animationId: null,
      isAnimationPlaying: false,
      initialPosition,
      centerPosition,
      flyAwayPosition,
    }

    // Animation loop
    const clock = new THREE.Clock()
    const animate = () => {
      if (!sceneRef.current) return

      sceneRef.current.animationId = requestAnimationFrame(animate)

      const delta = clock.getDelta()

      // Update animation mixer
      if (sceneRef.current.mixer) {
        sceneRef.current.mixer.update(delta)
      }

      // Render the scene
      sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera)
    }

    animate()

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (sceneRef.current?.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId)
      }
      if (sceneRef.current?.mixer) {
        sceneRef.current.mixer.stopAllAction()
      }
      if (sceneRef.current?.renderer) {
        sceneRef.current.renderer.dispose()
      }
    }
  }, [])

  useEffect(() => {
    if (!sceneRef.current?.plane || !sceneRef.current?.actions) return

    if (shouldStartTakeOffAnimation) {
      // Find and play the "Take 001" animation
      const takeOffAction = sceneRef.current.actions.find(action => 
        action.getClip().name.toLowerCase().includes('take') || 
        action.getClip().name.includes('001')
      )

      if (takeOffAction) {
        console.log("🛫 Starting Take 001 animation")
        takeOffAction.reset()
        takeOffAction.paused = false
        takeOffAction.play()
      } else {
        console.log("⚠️ Take 001 animation not found. Available animations:", 
          sceneRef.current.animations.map(clip => clip.name))
      }
    } else {
      // Stop and reset all animations when shouldStartTakeOffAnimation becomes false
      if (sceneRef.current.actions.length > 0) {
        console.log("🛑 Stopping and resetting plane animations")
        sceneRef.current.actions.forEach(action => {
          action.stop()
          action.reset()
          action.paused = true
        })
      }
    }
  }, [shouldStartTakeOffAnimation])

  useEffect(() => {
    if (!canvasContainerRef.current) return

    if (shouldStartTakeOffAnimation) {
      // Scale up to full size and move to center when animation starts
      console.log("📈 Scaling canvas to full size and centering")
      gsap.to(canvasContainerRef.current, {
        // scale: 1,
        x: "0%",
        y: "0%",
        duration: 1,
        ease: "power2.out"
      })
    } else {
      // Scale down to half size and move to bottom-left initially or when resetting
      console.log("📉 Scaling canvas to half size and moving to bottom-left")
      gsap.to(canvasContainerRef.current, {
        // scale: 0.5,
        x: "-30%", // Move left
        y: "40%",  // Move down
        duration: 1,
        ease: "power2.out"
      })
    }
  }, [shouldStartTakeOffAnimation])

  return (
    <div ref={containerRef} className="absolute inset-0" style={{ pointerEvents: 'auto' }}>
      <div 
        ref={canvasContainerRef} 
        className="w-full h-full"
        data-canvas-container
        style={{ 
          transformOrigin: 'center center',
          transform: 'scale(1) translate(-30%, 40%)', // Initial scale and position
          opacity: opacity,
          transition: 'opacity 0.3s ease-in-out'
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{
            background: 'transparent',
            cursor: 'grab',
            touchAction: 'none'
          }}
          onMouseDown={(e) => e.currentTarget.style.cursor = 'grabbing'}
          onMouseUp={(e) => e.currentTarget.style.cursor = 'grab'}
          onMouseLeave={(e) => e.currentTarget.style.cursor = 'grab'}
        />
      </div>
    </div>
  )
}


AviatorCanvas.displayName = 'AviatorCanvas'

export default AviatorCanvas
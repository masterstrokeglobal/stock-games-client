"use client"

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import { gsap } from "gsap"

interface AviatorCanvasProps {
  multiplier: number
}

export interface AviatorCanvasRef {
  playAnimation: () => void
  pauseAnimation: () => void
  toggleAnimation: () => void
  isAnimationPlaying: () => boolean
  startFlyingSequence: () => void
  resetToInitialPosition: () => void
  flyAway: () => void
}

const AviatorCanvas = forwardRef<AviatorCanvasRef, AviatorCanvasProps>(
  (_, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
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

    useImperativeHandle(ref, () => ({
      playAnimation: () => {
        if (sceneRef.current?.actions) {
          sceneRef.current.actions.forEach(action => action.play())
          sceneRef.current.isAnimationPlaying = true
        }
      },
      pauseAnimation: () => {
        if (sceneRef.current?.actions) {
          sceneRef.current.actions.forEach(action => action.paused = true)
          sceneRef.current.isAnimationPlaying = false
        }
      },
      toggleAnimation: () => {
        if (sceneRef.current) {
          if (sceneRef.current.isAnimationPlaying) {
            sceneRef.current.actions.forEach(action => action.paused = true)
            sceneRef.current.isAnimationPlaying = false
          } else {
            sceneRef.current.actions.forEach(action => {
              action.paused = false
              action.play()
            })
            sceneRef.current.isAnimationPlaying = true
          }
        }
      },
      isAnimationPlaying: () => {
        return sceneRef.current?.isAnimationPlaying ?? false
      },
      startFlyingSequence: () => {
        if (sceneRef.current?.plane) {
          // Start plane animations by unpausing them
          sceneRef.current.actions.forEach(action => {
            action.paused = false
            if (!action.isRunning()) {
              action.play()
            }
          })
          sceneRef.current.isAnimationPlaying = true
          
          // Animate plane from initial position to fly away position over 2 seconds
          gsap.to(sceneRef.current.plane.position, {
            x: sceneRef.current.flyAwayPosition.x,
            y: sceneRef.current.flyAwayPosition.y,
            z: sceneRef.current.flyAwayPosition.z,
            duration: 2,
            ease: "power2.out"
          })
        }
      },
      resetToInitialPosition: () => {
        if (sceneRef.current?.plane) {
          // Stop and reset animations
          sceneRef.current.actions.forEach(action => {
            action.stop()
            action.reset()
            action.paused = true
          })
          sceneRef.current.isAnimationPlaying = false
          
          // Reset plane to initial position
          sceneRef.current.plane.position.copy(sceneRef.current.initialPosition)
          
          // Reset scale and visibility
          sceneRef.current.plane.scale.set(2, 2, 2) // Original scale
          sceneRef.current.plane.visible = true
          
          // Kill any ongoing GSAP animations on the plane
          gsap.killTweensOf(sceneRef.current.plane)
          gsap.killTweensOf(sceneRef.current.plane.position)
          gsap.killTweensOf(sceneRef.current.plane.scale)
        }
      },
      flyAway: () => {
        if (sceneRef.current?.plane && sceneRef.current?.camera) {
          // Calculate top-right corner position relative to camera view
          const camera = sceneRef.current.camera
          const distance = 15 // Distance from camera
          
          // Get screen space top-right corner in world coordinates
          const topRightPosition = new THREE.Vector3(
            camera.position.x + 8,  // Right side
            camera.position.y + 6,  // Top side  
            camera.position.z + distance // Away from camera
          )
          
          // Animate plane to top-right and scale down
          const plane = sceneRef.current.plane
          
          gsap.to(plane.position, {
            x: topRightPosition.x,
            y: topRightPosition.y,
            z: topRightPosition.z,
            duration: 3,
            ease: "power2.out"
          })
          
          gsap.to(plane.scale, {
            x: 0.1,
            y: 0.1,
            z: 0.1,
            duration: 3,
            ease: "power2.out"
          })
          
          // Fade out by reducing opacity
          gsap.to(plane, {
            opacity: 0,
            duration: 3,
            ease: "power2.out",
            onComplete: () => {
              // Make plane invisible
              plane.visible = false
            }
          })
        }
      }
    }))

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

      // 4. Environment Mapping Setup
      const rgbeLoader = new RGBELoader()
      

      // Try to load HDR environment map, fallback to procedural
      rgbeLoader.load(
        '/hdri/studio.hdr', // You can add an HDR file here
        (texture) => {
          const pmremGenerator = new THREE.PMREMGenerator(renderer)
          const envMap = pmremGenerator.fromEquirectangular(texture).texture
          
          scene.environment = envMap
          
          texture.dispose()
          pmremGenerator.dispose()
        },
        undefined,
        () => {
          console.log('HDR environment not found, using procedural environment')
        }
      )

      // Camera position
      camera.position.set(-3,0.5,0)
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
          plane.position.copy(initialPosition)
          
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

    return (
      <div ref={containerRef} className="absolute inset-0" style={{ pointerEvents: 'auto' }}>
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
    )
  }
)

AviatorCanvas.displayName = 'AviatorCanvas'

export default AviatorCanvas
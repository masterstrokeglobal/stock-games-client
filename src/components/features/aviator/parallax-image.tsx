import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import ParallaxObjectLayer from "./parallax-object-layer"
import { layerConfigs, generateLayerObjects } from "./parallax-layer-config"

interface ParallaxImageProps {
  multiplier: number
  isMoving?: boolean // Control whether the constant X movement is active
}

export default function ParallaxImage({ multiplier, isMoving = false }: ParallaxImageProps) {
  const imageRef = useRef<HTMLDivElement>(null)
  const imgContainerRef = useRef<HTMLDivElement>(null)

  // Create refs for all translate containers
  const translateContainerRef_0_5 = useRef<HTMLDivElement>(null)
  const translateContainerRef_0_7 = useRef<HTMLDivElement>(null)
  const translateContainerRef_1_2 = useRef<HTMLDivElement>(null)
  const translateContainerRef_1_3 = useRef<HTMLDivElement>(null)
  const translateContainerRef_1_4 = useRef<HTMLDivElement>(null)
  const translateContainerRef_1_5 = useRef<HTMLDivElement>(null)
  const translateContainerRef_1_8 = useRef<HTMLDivElement>(null)

  // Map refs by name for easy access
  const containerRefs = {
    translateContainerRef_0_5,
    translateContainerRef_0_7,
    translateContainerRef_1_2,
    translateContainerRef_1_3,
    translateContainerRef_1_4,
    translateContainerRef_1_5,
    translateContainerRef_1_8
  }

  // Store stable object positions - generated once when component mounts
  const [layerObjectsMap, setLayerObjectsMap] = useState<{ [key: string]: Array<{ src: string, x: number, y: number, scale: number }> }>({})

  // Generate object positions once when component mounts
  useEffect(() => {
    const objectsMap: { [key: string]: Array<{ src: string, x: number, y: number, scale: number }> } = {}

    layerConfigs.forEach(layer => {
      objectsMap[layer.ref] = generateLayerObjects(layer)
    })

    setLayerObjectsMap(objectsMap)
  }, []) // Empty dependency array - runs only once when component mounts

  useEffect(() => {
    if (!imageRef.current || !imgContainerRef.current) return

    if (isMoving) {
      // Start constant X-axis movement (horizontal scrolling)
      const imageWidth = 8000 * 32 // Total width of all tiles
      const containerWidth = imgContainerRef.current.clientWidth
      const maxMoveX = imageWidth - containerWidth

      // Create infinite horizontal movement for background
      gsap.set(imageRef.current, {
        x: 0,
      })
      gsap.to(imageRef.current, {
        x: -maxMoveX,
        duration: 500, // 30 seconds for full cycle
        ease: "none",
        repeat: -1, // Infinite repeat
      })

      // Animate each parallax layer with different speeds
      layerConfigs.forEach(layer => {
        const containerRef = containerRefs[layer.ref as keyof typeof containerRefs]
        if (containerRef.current) {
          gsap.set(containerRef.current, {
            x: 0,
          })
          gsap.to(containerRef.current, {
            x: -maxMoveX * layer.speed,
            duration: 500 / layer.speed,
            ease: "none",
            repeat: -1,
          })
        }
      })
    } else {
      // Immediately stop all X-axis animations when isMoving becomes false
      gsap.killTweensOf(imageRef.current, "x")

      // Stop all layer animations
      layerConfigs.forEach(layer => {
        const containerRef = containerRefs[layer.ref as keyof typeof containerRefs]
        if (containerRef.current) {
          gsap.killTweensOf(containerRef.current, "x")
        }
      })
    }

    return () => {
      gsap.killTweensOf(imageRef.current)
      layerConfigs.forEach(layer => {
        const containerRef = containerRefs[layer.ref as keyof typeof containerRefs]
        if (containerRef.current) {
          gsap.killTweensOf(containerRef.current)
        }
      })
    }
  }, [isMoving]) // Re-run when isMoving changes

  useEffect(() => {
    if (!imageRef.current || !imgContainerRef.current) return

    // Calculate the progress from 1x to 10x multiplier for Y-axis only
    const normalizedMultiplier = Math.max(1, Math.min(5, multiplier))
    const progress = (normalizedMultiplier - 1) / 4 // 0 to 1

    // Get container dimensions
    const imageHeight = 8000

    // Calculate how much we can move vertically
    const containerHeight = imgContainerRef.current.clientHeight
    const maxMoveY = imageHeight - containerHeight

    // Y-axis movement: 0% progress = -maxMoveY (bottom), 100% progress = 0px (top)
    const translateY = -(1 - progress) * maxMoveY

    // Animate only Y position with GSAP - smoother animation
    gsap.to(imageRef.current, {
      y: translateY,
      duration: 1.2,
      ease: "power1.out",
    })

    // Update each layer's Y position based on its altitude range with realistic movement
    layerConfigs.forEach(layer => {
      const containerRef = containerRefs[layer.ref as keyof typeof containerRefs]
      if (containerRef.current) {
        // Calculate layer-specific Y position based on altitude range
        const altitudeMin = layer.altitudeRange[0]
        const altitudeMax = layer.altitudeRange[1]
        const avgAltitude = (altitudeMin + altitudeMax) / 2
        
        // Higher altitude objects move much less (more distant)
        // Lower altitude objects move more (closer to camera)
        const altitudeMovementFactor = avgAltitude > 0.8 
          ? 1 - (avgAltitude * 0.9) // Very reduced movement for space/planets
          : 1 - (avgAltitude * 0.6) // Moderate reduction for other objects
        const layerProgress = altitudeMin + (altitudeMax - altitudeMin) * progress
        const layerTranslateY = -(1 - layerProgress) * maxMoveY * altitudeMovementFactor

        gsap.to(containerRef.current, {
          y: layerTranslateY,
          duration: 1.2,
          ease: "power1.out"
        })
      }
    })

  }, [multiplier, imgContainerRef.current])


  return (
    <div ref={imgContainerRef} className="absolute inset-0 overflow-hidden">
      <div ref={imageRef} className="min-w-[calc(8000px*32)] min-h-[8000px]  absolute flex">
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            className="w-[8000px] h-[8000px] absolute bg-[url('/images/aviator/scene.webp')] bg-cover bg-no-repeat flip-alter-image"
            style={{ left: `${i * 8000}px` }}
          />
        ))}
        <div
          className="bottom-0 left-0 w-[3520px] h-[563px] absolute bg-[url('/images/aviator/grass.png')] bg-cover bg-no-repeat flip-alter-image"
          style={{ zIndex: 100 }} // Ensure grass stays at ground level
        />
      </div>

      {/* Parallax Object Layers */}
      {layerConfigs.map((layer) => {
        const containerRef = containerRefs[layer.ref as keyof typeof containerRefs]
        const objects = layerObjectsMap[layer.ref] || [] // Use stable objects from state

        return (
          <ParallaxObjectLayer
            key={layer.ref}
            layerRef={layer.ref}
            containerRef={containerRef}
            objects={objects}
            speed={layer.speed}
          />
        )
      })}
    </div>
  )
}
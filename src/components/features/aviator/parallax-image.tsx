import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

interface ParallaxImageProps {
  multiplier: number
  isMoving?: boolean // Control whether the constant X movement is active
}

// Define layers with their speed multipliers and object configurations
const layerConfigs = [
  {
    ref: "translateContainerRef_0_5",
    speed: 0.5,
    altitudeRange: [0.8, 1.0],
    objects: [
      { src: "/images/aviator/objects/star1.png", scale: [0.3, 0.5], count: 50 },
      { src: "/images/aviator/objects/star2.png", scale: [0.3, 0.5], count: 50 },
      { src: "/images/aviator/objects/moon.png", scale: [0.4, 0.6], count: 12 }
    ]
  },
  {
    ref: "translateContainerRef_0_7",
    speed: 0.7,
    altitudeRange: [0.6, 0.8],
    objects: [
      { src: "/images/aviator/objects/planet1.png", scale: [0.2, 0.4], count: 20 },
      { src: "/images/aviator/objects/planet2.png", scale: [0.2, 0.4], count: 20 },
      { src: "/images/aviator/objects/planet3.png", scale: [0.2, 0.4], count: 20 },
      { src: "/images/aviator/objects/jupitor.png", scale: [0.3, 0.5], count: 15 }
    ]
  },
  {
    ref: "translateContainerRef_1_2",
    speed: 1.2,
    altitudeRange: [0.4, 0.6],
    objects: [
      { src: "/images/aviator/objects/cloud-1.png", scale: [0.6, 0.8], count: 60 },
      { src: "/images/aviator/objects/cloud-2.png", scale: [0.6, 0.8], count: 60 },
      { src: "/images/aviator/objects/cloud-3.png", scale: [0.6, 0.8], count: 60 }
    ]
  },
  {
    ref: "translateContainerRef_1_3",
    speed: 1.3,
    altitudeRange: [0.3, 0.5],
    objects: [
      { src: "/images/aviator/objects/cloud-4.png", scale: [0.7, 0.9], count: 70 },
      { src: "/images/aviator/objects/cloud-5.png", scale: [0.7, 0.9], count: 70 },
      { src: "/images/aviator/objects/cloud-6.png", scale: [0.7, 0.9], count: 70 }
    ]
  },
  {
    ref: "translateContainerRef_1_4",
    speed: 1.4,
    altitudeRange: [0.2, 0.4],
    objects: [
      { src: "/images/aviator/objects/birds.png", scale: [0.5, 0.7], count: 80 },
      { src: "/images/aviator/objects/birds2.png", scale: [0.5, 0.7], count: 60 }
    ]
  },
  {
    ref: "translateContainerRef_1_5",
    speed: 1.5,
    altitudeRange: [0.1, 0.3],
    objects: [
      { src: "/images/aviator/objects/plane.png", scale: [0.4, 0.5], count: 30 },
      { src: "/images/aviator/objects/plane2.png", scale: [0.08, 0.1], count: 25 },
      { src: "/images/aviator/objects/rocket.png", scale: [0.3, 0.4], count: 20 }
    ]
  },
  {
    ref: "translateContainerRef_1_8",
    speed: 1.8,
    altitudeRange: [0.0, 0.2],
    objects: [
      { src: "/images/aviator/objects/plane.png", scale: [0.5, 0.6], count: 20 },
      { src: "/images/aviator/objects/plane2.png", scale: [0.1, 0.12], count: 15 },
      { src: "/images/aviator/objects/rocket.png", scale: [0.4, 0.5], count: 12 }
    ]
  }
]

// Generate object positions for a layer (moved outside component to prevent re-generation)
const generateLayerObjects = (layer: typeof layerConfigs[0]) => {
  const allObjects: Array<{src: string, x: number, y: number, scale: number}> = []
  const totalWidth = 8000 * 16 // Match the container width
  
  layer.objects.forEach(objConfig => {
    for (let i = 0; i < objConfig.count; i++) {
      const scale = objConfig.scale[0] + Math.random() * (objConfig.scale[1] - objConfig.scale[0])
      const x = Math.random() * totalWidth
      const y = Math.random() * 6000 // Random Y within the layer height
      
      allObjects.push({
        src: objConfig.src,
        x,
        y,
        scale
      })
    }
  })
  
  return allObjects
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
  const [layerObjectsMap, setLayerObjectsMap] = useState<{[key: string]: Array<{src: string, x: number, y: number, scale: number}>}>({})

  // Generate object positions once when component mounts
  useEffect(() => {
    const objectsMap: {[key: string]: Array<{src: string, x: number, y: number, scale: number}>} = {}
    
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
      gsap.set(imageRef.current, { x: 0 })
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
          gsap.set(containerRef.current, { x: 0 })
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
    const containerHeight = imgContainerRef.current.clientHeight
    const imageHeight = 8000
    
    // Calculate how much we can move vertically
    const maxMoveY = imageHeight - containerHeight
    
    // Y-axis movement: 0% progress = -maxMoveY (bottom), 100% progress = 0px (top)
    const translateY = -(1 - progress) * maxMoveY
    
    // Animate only Y position with GSAP - smoother animation
    gsap.to(imageRef.current, {
      y: translateY,
      duration: 1.2,
      ease: "power1.out"
    })

    // Update each layer's Y position based on its altitude range
    layerConfigs.forEach(layer => {
      const containerRef = containerRefs[layer.ref as keyof typeof containerRefs]
      if (containerRef.current) {
        // Calculate layer-specific Y position based on altitude range
        const altitudeMin = layer.altitudeRange[0]
        const altitudeMax = layer.altitudeRange[1]
        const layerProgress = altitudeMin + (altitudeMax - altitudeMin) * progress
        const layerTranslateY = -(1 - layerProgress) * maxMoveY
        
        gsap.to(containerRef.current, {
          y: layerTranslateY,
          duration: 1.2,
          ease: "power1.out"
        })
      }
    })
    
  }, [multiplier])

  return (
    <div ref={imgContainerRef} className="absolute inset-0 overflow-hidden">
      <div ref={imageRef} className="min-w-[calc(8000px*16)] min-h-[8000px] absolute flex">
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            className="w-[8000px] h-[8000px] absolute bg-[url('/images/aviator/scene.webp')] bg-cover bg-no-repeat flip-alter-image"
            style={{ left: `${i * 8000}px` }}
          />
        ))}
        <div
          className="bottom-0 left-0 w-[3520px] h-[563px] absolute bg-[url('/images/aviator/grass.png')] bg-cover bg-no-repeat flip-alter-image"
        />
      </div>

      {/* Parallax Object Layers */}
      {layerConfigs.map((layer) => {
        const containerRef = containerRefs[layer.ref as keyof typeof containerRefs]
        const objects = layerObjectsMap[layer.ref] || [] // Use stable objects from state
        
        // Calculate z-index based on layer characteristics
        let baseZIndex = 1
        if (layer.speed < 0.8) baseZIndex = 1 // Far background (stars, planets)
        else if (layer.speed < 1.3) baseZIndex = 5 // Mid background (clouds)
        else baseZIndex = 10 // Foreground (birds, planes, rockets)
        
        return (
          <div 
            key={layer.ref}
            ref={containerRef} 
            className="absolute top-0 left-0 w-[calc(8000px*16)] h-[8000px]"
            style={{ 
              filter: layer.speed < 1 ? `brightness(${0.6 + layer.speed * 0.3}) opacity(${0.7 + layer.speed * 0.2})` : 'none'
            }}
          >
            {objects.map((obj, objIndex) => {
              // Dynamic z-index based on object type and scale
              let objectZIndex = baseZIndex
              
              // Large objects (planets, Jupiter) go to back
              if (obj.src.includes('planet') || obj.src.includes('jupitor')) {
                objectZIndex = baseZIndex - 2
              }
              // Both planes go to the back
              else if (obj.src.includes('plane')) {
                objectZIndex = baseZIndex - 1
              }
              // Medium objects (clouds) in middle
              else if (obj.src.includes('cloud')) {
                objectZIndex = baseZIndex + Math.floor(Math.random() * 3) - 1 // Random between baseZIndex-1 and baseZIndex+1
              }
              // Small objects (birds, rockets) can overlap and appear in front
              else if (obj.src.includes('birds') || obj.src.includes('rocket')) {
                objectZIndex = baseZIndex + Math.floor(Math.random() * 4) // Random between baseZIndex and baseZIndex+3
              }
              // Default
              else {
                objectZIndex = baseZIndex
              }
              
              return (
                <img
                  key={`${layer.ref}-${objIndex}`}
                  src={obj.src}
                  alt={`parallax-object-${layer.speed}`}
                  className="absolute object-contain"
                  style={{
                    left: `${obj.x}px`,
                    top: `${obj.y}px`,
                    transform: `scale(${obj.scale})`,
                    transformOrigin: 'center center',
                    zIndex: objectZIndex
                  }}
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
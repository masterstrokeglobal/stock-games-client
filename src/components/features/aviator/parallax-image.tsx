import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface ParallaxImageProps {
  multiplier: number
  isMoving?: boolean // Control whether the constant X movement is active
}

export default function ParallaxImage({ multiplier, isMoving = false }: ParallaxImageProps) {
  const imageRef = useRef<HTMLDivElement>(null)
  const imgContainerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!imageRef.current || !imgContainerRef.current) return
    
    if (isMoving) {
      // Start constant X-axis movement (horizontal scrolling)
      const imageWidth = 8000 * 32 // Total width of all tiles
      const containerWidth = imgContainerRef.current.clientWidth
      const maxMoveX = imageWidth - containerWidth
      
      // Create infinite horizontal movement
      gsap.set(imageRef.current, { x: 0 })
      gsap.to(imageRef.current, {
        x: -maxMoveX,
        duration: 500, // 30 seconds for full cycle
        ease: "none",
        repeat: -1, // Infinite repeat
      })
    } else {
      // Immediately stop all X-axis animations when isMoving becomes false
      gsap.killTweensOf(imageRef.current, "x")
    }
    
    return () => {
      gsap.killTweensOf(imageRef.current)
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
      </div>
    </div>
  )
}
import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export default function ParallaxImage({ multiplier }: { multiplier: number }) {
  const imageRef = useRef<HTMLDivElement>(null)
  const imgContainerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!imageRef.current) return
    
    // Calculate the progress from 1x to 10x multiplier
    const normalizedMultiplier = Math.max(1, Math.min(10, multiplier))
    const progress = (normalizedMultiplier - 1) / 5 // 0 to 1
    
    // Calculate positions for bottom-left to top-right movement
    // Bottom-left (0% progress): x: 0%, y: -100% (show bottom part)
    // Top-right (100% progress): x: -100%, y: 0% (show top part)
    // add an offset of container height / 2
    const containerHeight = imgContainerRef.current?.clientHeight || 0
    const containerHeightPercentOfImgHeight = containerHeight / 8000
    const translateX = (-progress * 100)  // 0% to -100%
    const translateY = (-(1 - progress) * 100) + (containerHeightPercentOfImgHeight * 100) // -100% to 0%
    
    // Calculate scale for zoom effect
    // const scale = 1 + (progress * 0.5) // 1x to 1.5x zoom
    
    // Animate with GSAP
    gsap.to(imageRef.current, {
      x: `${translateX}%`,
      y: `${translateY}%`,
    //   scale: scale,
      duration: 0.3,
      ease: "power2.out"
    })
    
  }, [multiplier])
  
  return (
    <div ref={imgContainerRef} className="absolute inset-0 overflow-hidden">
      <div
        ref={imageRef}
        className="w-[8000px] h-[8000px] absolute bg-[url('/images/aviator/scene_green.webp')] bg-cover bg-no-repeat"
        // style={{
        //   transformOrigin: 'top left'
        // }}
      />
    </div>
  )
}
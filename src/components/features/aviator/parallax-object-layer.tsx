import { RefObject } from "react"

interface ParallaxObject {
  src: string
  x: number
  y: number
  scale: number
}

interface ParallaxObjectLayerProps {
  layerRef: string
  containerRef: RefObject<HTMLDivElement>
  objects: ParallaxObject[]
  speed: number
}

const ParallaxObjectLayer = ({ layerRef, containerRef, objects, speed }: ParallaxObjectLayerProps) => {
  // Calculate z-index based on layer characteristics
  let baseZIndex = 1
  if (speed < 0.8) baseZIndex = 1 // Far background (stars, planets)
  else if (speed < 1.3) baseZIndex = 5 // Mid background (clouds)
  else baseZIndex = 10 // Foreground (birds, planes, rockets)

  return (
    <div 
      ref={containerRef} 
      className="absolute top-0 left-0 w-[calc(8000px*16)] h-[8000px]"
      style={{ 
        filter: speed < 1 ? `brightness(${0.6 + speed * 0.3}) opacity(${0.7 + speed * 0.2})` : 'none'
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
            key={`${layerRef}-${objIndex}`}
            src={obj.src}
            alt={`parallax-object-${speed}`}
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
}

export default ParallaxObjectLayer 
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
  // Calculate z-index based on layer characteristics (more refined layering)
  let baseZIndex = 1
  if (speed < 0.6) baseZIndex = 1 // Far background (stars, space objects)
  else if (speed < 0.8) baseZIndex = 3 // High background (planets)
  else if (speed < 1.3) baseZIndex = 5 // Mid background (high clouds)
  else if (speed < 1.4) baseZIndex = 8 // Mid-foreground (lower clouds)
  else if (speed < 1.6) baseZIndex = 15 // Foreground (birds, small aircraft)
  else baseZIndex = 20 // Near foreground (larger aircraft)

  return (
    <div 
      ref={containerRef} 
      className="absolute top-0 left-0 w-[calc(8000px*16)] h-[8000px]"
      style={{ 
        filter: speed < 1 ? `brightness(${0.6 + speed * 0.3}) opacity(${0.7 + speed * 0.2})` : 'none'
      }}
    >
      {objects.map((obj, objIndex) => {
        // Dynamic z-index based on object type and scale for realistic depth
        let objectZIndex = baseZIndex
        
        // Space objects (stars, planets) - far background
        if (obj.src.includes('star') || obj.src.includes('moon')) {
          objectZIndex = Math.max(1, baseZIndex - 1)
        }
        else if (obj.src.includes('planet') || obj.src.includes('jupitor')) {
          objectZIndex = Math.max(1, baseZIndex - 0.5)
        }
        // Clouds - layered by size and altitude
        else if (obj.src.includes('cloud')) {
          // Vary cloud z-index slightly based on scale for natural layering
          const scaleVariation = Math.floor((obj.scale - 0.6) * 10) // Scale-based offset
          objectZIndex = baseZIndex + scaleVariation
        }
        // Birds - natural flocking depth
        else if (obj.src.includes('birds')) {
          objectZIndex = baseZIndex + Math.floor(Math.random() * 3) // Slight variation for flocking
        }
        // Aircraft - larger planes closer, smaller planes farther
        else if (obj.src.includes('plane')) {
          // Larger scales appear closer (higher z-index)
          const scaleVariation = Math.floor((obj.scale - 0.1) * 20)
          objectZIndex = baseZIndex + scaleVariation
        }
        // Rockets - high altitude objects
        else if (obj.src.includes('rocket')) {
          objectZIndex = baseZIndex + Math.floor(Math.random() * 2)
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
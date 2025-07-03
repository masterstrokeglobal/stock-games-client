export interface LayerConfig {
  ref: string
  speed: number
  altitudeRange: [number, number]
  objects: Array<{
    src: string
    scale: [number, number]
    count: number
  }>
}

export const layerConfigs: LayerConfig[] = [
  {
    ref: "translateContainerRef_0_5",
    speed: 0.5,
    altitudeRange: [0.92, 1.0], // Highest altitude - space objects (top 8% - pure space)
    objects: [
      { src: "/images/aviator/objects/star1.png", scale: [0.3, 0.5], count: 50 },
      { src: "/images/aviator/objects/star2.png", scale: [0.3, 0.5], count: 50 },
      { src: "/images/aviator/objects/moon.png", scale: [0.4, 0.6], count: 12 },
      { src: "/images/aviator/objects/rocket.png", scale: [0.2, 0.3], count: 8 } // Rockets in space only
    ]
  },
  {
    ref: "translateContainerRef_0_7",
    speed: 0.7,
    altitudeRange: [0.85, 0.95], // Very high altitude - planets (upper space region)
    objects: [
      { src: "/images/aviator/objects/planet1.png", scale: [0.2, 0.4], count: 15 },
      { src: "/images/aviator/objects/planet2.png", scale: [0.2, 0.4], count: 15 },
      { src: "/images/aviator/objects/planet3.png", scale: [0.2, 0.4], count: 15 },
      { src: "/images/aviator/objects/jupitor.png", scale: [0.3, 0.5], count: 10 },
      { src: "/images/aviator/objects/rocket.png", scale: [0.25, 0.35], count: 6 } // More rockets in space
    ]
  },
  {
    ref: "translateContainerRef_1_2",
    speed: 1.2,
    altitudeRange: [0.6, 0.8], // High clouds altitude (upper atmosphere)
    objects: [
      { src: "/images/aviator/objects/cloud-1.png", scale: [0.6, 0.8], count: 60 },
      { src: "/images/aviator/objects/cloud-2.png", scale: [0.6, 0.8], count: 60 },
      { src: "/images/aviator/objects/cloud-3.png", scale: [0.6, 0.8], count: 60 }
    ]
  },
  {
    ref: "translateContainerRef_1_3",
    speed: 1.3,
    altitudeRange: [0.4, 0.6], // Medium-high clouds altitude (commercial flight level)
    objects: [
      { src: "/images/aviator/objects/cloud-4.png", scale: [0.7, 0.9], count: 70 },
      { src: "/images/aviator/objects/cloud-5.png", scale: [0.7, 0.9], count: 70 },
      { src: "/images/aviator/objects/cloud-6.png", scale: [0.7, 0.9], count: 70 }
    ]
  },
  {
    ref: "translateContainerRef_1_4",
    speed: 1.4,
    altitudeRange: [0.25, 0.45], // Medium altitude - birds (safe flying zone)
    objects: [
      { src: "/images/aviator/objects/birds.png", scale: [0.5, 0.7], count: 80 },
      { src: "/images/aviator/objects/birds2.png", scale: [0.5, 0.7], count: 60 }
    ]
  },
  {
    ref: "translateContainerRef_1_5",
    speed: 1.5,
    altitudeRange: [0.15, 0.35], // Lower altitude - small aircraft (low flying zone)
    objects: [
      { src: "/images/aviator/objects/plane.png", scale: [0.4, 0.5], count: 15 }, // Reduced from 30
      { src: "/images/aviator/objects/plane2.png", scale: [0.08, 0.1], count: 12 } // Reduced from 25
    ]
  },
  {
    ref: "translateContainerRef_1_8",
    speed: 1.8,
    altitudeRange: [0.1, 0.25], // Low altitude - larger aircraft (just above ground level)
    objects: [
      { src: "/images/aviator/objects/plane.png", scale: [0.5, 0.6], count: 8 }, // Reduced from 20
      { src: "/images/aviator/objects/plane2.png", scale: [0.1, 0.12], count: 6 } // Reduced from 15
    ]
  }
]

// Generate object positions for a layer with proper altitude-based positioning
export const generateLayerObjects = (layer: LayerConfig) => {
  const allObjects: Array<{src: string, x: number, y: number, scale: number}> = []
  const totalWidth = 8000 * 16 // Match the container width
  const totalHeight = 8000 // Match the actual container height (was 6000, now 8000)
  
  // Calculate the actual Y range based on altitude range
  // Note: Y=0 is top of screen, Y=8000 is bottom
  // altitudeRange [0, 1] maps to Y [8000, 0] (inverted because higher altitude = lower Y)
  const minAltitude = layer.altitudeRange[0]
  const maxAltitude = layer.altitudeRange[1]
  
  // Convert altitude to Y position (inverted)
  const maxY = totalHeight * (1 - minAltitude) // Higher Y for lower altitude
  const minY = totalHeight * (1 - maxAltitude) // Lower Y for higher altitude
  
  // Define category-specific ground safety zones
  const getCategorySafetyZone = () => {
    const avgAltitude = (minAltitude + maxAltitude) / 2
    if (avgAltitude > 0.8) return 400 // Space objects - minimal ground restriction
    if (avgAltitude > 0.5) return 1200 // Clouds - keep well above ground
    if (avgAltitude > 0.2) return 1000 // Birds and aircraft - flying safety zone
    return 800 // Low flying objects - minimum ground clearance
  }
  
  // Calculate safe positioning area
  const buffer = 100 // Boundary buffer
  const groundSafetyZone = getCategorySafetyZone()
  
  const safeMinY = Math.max(0, minY - buffer)
  const safeMaxY = Math.min(totalHeight - groundSafetyZone, maxY + buffer)
  
  // Ensure we have a valid range
  if (safeMaxY <= safeMinY) {
    console.warn(`Invalid range for layer ${layer.ref}: safeMinY=${safeMinY}, safeMaxY=${safeMaxY}`)
    return allObjects
  }
  
  layer.objects.forEach(objConfig => {
    for (let i = 0; i < objConfig.count; i++) {
      const scale = objConfig.scale[0] + Math.random() * (objConfig.scale[1] - objConfig.scale[0])
      const x = Math.random() * totalWidth
      
      // Position objects within their specific altitude range
      const y = safeMinY + Math.random() * (safeMaxY - safeMinY)
      
      // Additional check to ensure objects don't appear too low
      const finalY = Math.min(y, totalHeight - groundSafetyZone)
      
      allObjects.push({
        src: objConfig.src,
        x,
        y: finalY,
        scale
      })
    }
  })
  
  return allObjects
} 
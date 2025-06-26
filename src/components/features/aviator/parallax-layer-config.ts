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

// Generate object positions for a layer
export const generateLayerObjects = (layer: LayerConfig) => {
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
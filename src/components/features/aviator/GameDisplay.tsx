import { useEffect, useState } from "react"
import AviatorCanvas from "./aviator-canvas"
import BlastVideo from "./blast-video"
import ParallaxImage from "./parallax-image"


interface GameDisplayProps {
  multiplier: number
  shouldShowBlast?: boolean
  setShouldShowBlast?: (isPlaying: boolean) => void
  isParallaxMoving?: boolean
  shouldStartTakeOffAnimation?: boolean
  canvasOpacity?: number
}

const GameDisplay = ({ multiplier, shouldShowBlast = false, setShouldShowBlast, isParallaxMoving = false, canvasOpacity = 1 }: GameDisplayProps) => {

    const [isBlastPlaying, setIsBlastPlaying] = useState(false)

    // Control blast video from parent component
    useEffect(() => {
      if (shouldShowBlast) {
        setIsBlastPlaying(true)
      }
    }, [shouldShowBlast])

    // Handle blast video completion
    const handleBlastComplete = (isPlaying: boolean) => {
      setIsBlastPlaying(isPlaying)
      if (!isPlaying && setShouldShowBlast) {
        setShouldShowBlast(false)
      }
    }

    return (
      <div className="relative flex-1">
        <div className="absolute inset-0 ">
          <ParallaxImage multiplier={multiplier} isMoving={isParallaxMoving} />
          <AviatorCanvas multiplier={multiplier} shouldStartTakeOffAnimation={isParallaxMoving} opacity={canvasOpacity} />
          <BlastVideo isPlaying={isBlastPlaying} setIsBlastPlaying={handleBlastComplete} />
          
          <div className="absolute bottom-0 left-[50%] translate-x-[-50%] flex items-center justify-center pointer-events-none">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">{multiplier.toFixed(2)}x</h1>
          </div>
        </div>
      </div>
    )
  }

GameDisplay.displayName = 'GameDisplay'

export default GameDisplay 
import { useEffect, useState } from "react"
import AviatorCanvas from "./aviator-canvas"
import BlastVideo from "./blast-video"
import ParallaxImage from "./parallax-image"
import LoaderAviator from "./LoaderAviator"


interface GameDisplayProps {
  multiplier: number
  shouldShowBlast?: boolean
  setShouldShowBlast?: (isPlaying: boolean) => void
  isParallaxMoving?: boolean
  shouldStartTakeOffAnimation?: boolean
  canvasOpacity?: number
  stockName?: string
  planeStatus?: "active" | "crashed" | "flew_away"
}

const GameDisplay = ({ multiplier, shouldShowBlast = false, setShouldShowBlast, isParallaxMoving = false, canvasOpacity = 1, stockName, planeStatus }: GameDisplayProps) => {

  const [isBlastPlaying, setIsBlastPlaying] = useState(false)
  const [isCurrentPlaneCrashed, setIsCurrentPlaneCrashed] = useState(false)
  const [isParallaxVisible, setIsParallaxVisible] = useState(true)
  const [blastOpacity, setBlastOpacity] = useState(0)


  // Update crash state when plane status changes
  useEffect(() => {
    if (planeStatus === "crashed" || planeStatus === "flew_away") {
      setIsCurrentPlaneCrashed(true)
    } else {
      setIsCurrentPlaneCrashed(false)
    }
  }, [planeStatus])

  useEffect(() => {
    if (!isCurrentPlaneCrashed) {
      setIsParallaxVisible(true)
      setBlastOpacity(0)
    }
  }, [isCurrentPlaneCrashed])


  // Control blast video from parent component
  useEffect(() => {
    if (shouldShowBlast) {
      setIsBlastPlaying(true)
      setTimeout(() => {
        setIsParallaxVisible(false)
      }, 2000)
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
        <LoaderAviator />

        {isParallaxVisible && (
          <ParallaxImage multiplier={multiplier} isMoving={isParallaxMoving} />
        )}

        {!isCurrentPlaneCrashed && (<>
          <AviatorCanvas multiplier={multiplier} shouldStartTakeOffAnimation={isParallaxMoving} opacity={canvasOpacity} />
        </>)}

        {isParallaxVisible && (
          <BlastVideo blastOpacity={blastOpacity} setBlastOpacity={setBlastOpacity} isBlastPlaying={isBlastPlaying} setIsBlastPlaying={handleBlastComplete} />
        )}

        <div className="absolute bottom-[10px] left-[50%] translate-x-[-50%] flex flex-col items-center justify-center pointer-events-none">
          <div className="bg-gradient-to-r from-blue-900/90 via-purple-900/90 to-blue-900/90 backdrop-blur-md rounded-xl border border-blue-400/50 shadow-xl px-6 py-2 min-w-[180px] flex flex-col items-center">
            {/* Animated border glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-blue-400/20 rounded-xl blur-sm animate-pulse"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center">
              {stockName && (
                <div className="text-blue-200 text-xs font-medium uppercase tracking-wide mb-1 opacity-90">
                  {stockName}
                </div>
              )}
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-300 via-yellow-300 to-green-300 bg-clip-text text-transparent drop-shadow-xl">
                  {multiplier.toFixed(2)}x
                </h1>
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

GameDisplay.displayName = 'GameDisplay'

export default GameDisplay 
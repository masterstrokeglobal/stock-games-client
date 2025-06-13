import { useGameState } from "@/hooks/use-current-game"
import { cn } from "@/lib/utils"
import { RoundRecord } from "@/models/round-record"

const TimeDisplay = ({
  roundRecord,
  className,
  isAviator,
  currentStockName
}: {
  roundRecord: RoundRecord,
  className?: string,
  isAviator?: boolean,
  currentStockName?: string
}) => {
  const { gameTimeLeft, isPlaceOver, placeTimeLeft, isGameOver } = useGameState(roundRecord)
  const statusText = isPlaceOver ? isGameOver ? "Game Over" : "Betting Closed" : "Betting Open"

  return (<div className={cn(className)}>
    <div className={cn("bg-gradient-to-r h-14 rounded-b-full shadow-lg flex items-center justify-center relative overflow-hidden", isPlaceOver ? "from-red-800 to-red-900 via-red-800" : " from-emerald-800 to-emerald-900 px-4 via-emerald-800 ")}>
      {/* Inner content with highlight effect */}
      <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-ropacity-50", isPlaceOver ? "from-red-500 to bg-red-400" : "from-emerald-500 to-emerald-400 ")} />
      <div className={cn("absolute inset-x-8 bottom-0 h-1/2 rounded-b-full bg-gradient-to-r",isPlaceOver ?" from-red-900 via-red-700 to-red-900":" from-emerald-900 via-emerald-700 to-emerald-900")} />

      <div className="flex items-center justify-center gap-4">

        <div className="flex flex-col items-center justify-center">
          {/* Text content */}
          <span className="text-white font-bold tracking-wider relative z-10 mr-2">
            {statusText}
          </span>

          {/* Timer with fade animation */}
          <span
            className="text-white flex gap-8 font-bold text-xl tracking-wider relative z-10"
          >

            {/* Current Stock Name for Aviator */}
            {isAviator && currentStockName && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-200 text-sm font-medium">
                  {currentStockName}
                </span>
              </div>
            )}
            <div
              className="text-white flex gap-8 font-bold text-xl tracking-wider relative z-10 transition-opacity duration-500"
              style={{
                opacity: gameTimeLeft.raw % 2 === 0 ? 1 : 0.5
              }}
            >
              {!isPlaceOver ? placeTimeLeft.seconds : isAviator ? "--" : gameTimeLeft.seconds}
            </div>
          </span>
        </div>
      </div>
    </div>
  </div>
  )
}

export default TimeDisplay;


import { useGameState } from "@/hooks/use-current-game"
import { cn } from "@/lib/utils"
import { RoundRecord } from "@/models/round-record"

const TimeDisplay = ({ roundRecord, className ,isAviator}: { roundRecord: RoundRecord, className?: string ,isAviator?: boolean}) => {
  const { gameTimeLeft, isPlaceOver, placeTimeLeft, isGameOver } = useGameState(roundRecord)
  const statusText = isPlaceOver ? isGameOver ? "Game Over" : "Betting Closed" : "Betting Open"

  return (<div className={cn(className)}>
    <div className="bg-gradient-to-r from-blue-900 px-4 via-blue-800 to-blue-900 h-14 rounded-b-full shadow-lg flex items-center justify-center relative overflow-hidden">
      {/* Inner content with highlight effect */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-blue-400 opacity-50"></div>
      <div className="absolute inset-x-8 bottom-0 h-1/2 rounded-b-full bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900"></div>

      <div className="flex flex-col items-center justify-center">
        {/* Text content */}
        <span className="text-white font-bold tracking-wider relative z-10 mr-2">
          {statusText}
        </span>

        {/* Timer with fade animation */}
        <span
          className="text-white font-bold text-xl tracking-wider relative z-10 transition-opacity duration-500"
          style={{
            opacity: gameTimeLeft.raw % 2 === 0 ? 1 : 0.5
          }}
        >
          {!isPlaceOver ? placeTimeLeft.seconds : isAviator ? "--" : gameTimeLeft.seconds}
        </span>
      </div>
    </div>
  </div>
  )
}



export default TimeDisplay;


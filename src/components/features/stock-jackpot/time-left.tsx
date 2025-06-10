import { useGameState } from "@/hooks/use-current-game"
import { cn } from "@/lib/utils"
import { RoundRecord } from "@/models/round-record"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

const TimeDisplay = ({ roundRecord, className }: { roundRecord: RoundRecord, className?: string }) => {
  const { gameTimeLeft, isPlaceOver, placeTimeLeft } = useGameState(roundRecord)
  const statusText = isPlaceOver ? "Betting Closed" : "Betting Open"
  const [displayNumber, setDisplayNumber] = useState("")
  
  const timePercent = !isPlaceOver
    ? Math.min(100, Math.max(0, (placeTimeLeft.seconds / roundRecord.placementDuration) * 100))
    : Math.min(100, Math.max(0, (gameTimeLeft.seconds / roundRecord.gameDuration) * 100))

  useEffect(() => {
    const currentTime = !isPlaceOver ? placeTimeLeft.shortFormatNoMinutes : gameTimeLeft.shortFormatNoMinutes
    setDisplayNumber(currentTime)
  }, [isPlaceOver, placeTimeLeft, gameTimeLeft])

  const isUrgent = Number(displayNumber) <= 10

  return (
    <div className={cn(className)}>
      {/* Outer glow effect */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-yellow-500/30 rounded-b-3xl blur-lg" />
        
        <div className="relative bg-gradient-to-b from-amber-500 via-yellow-500 to-amber-600 h-18 rounded-b-3xl shadow-2xl flex items-center justify-center overflow-hidden border-2 border-amber-700">
          
          {/* Inner shadow for depth */}
          <div className="absolute inset-0 rounded-b-3xl shadow-inner shadow-amber-800/50" />

          {/* Progress bar with golden glow */}
          <motion.div
            className={cn(
              "absolute bottom-0 left-0 h-2 rounded-bl-3xl shadow-lg transition-all duration-300",
              isUrgent 
                ? "bg-gradient-to-r from-red-600 to-red-500 shadow-red-500/50" 
                : "bg-gradient-to-r from-red-900 to-red-800 shadow-red-900/50"
            )}
            initial={{ width: "0%" }}
            animate={{ width: `${timePercent}%` }}
            transition={{ duration: 0.5 }}
          />

          <div className="flex flex-col items-center justify-center gap-1 z-10">
            {/* Status text with golden styling */}
            <motion.span
              className={cn(
                "font-bold tracking-widest text-sm uppercase transition-colors duration-300",
                isPlaceOver 
                  ? "text-red-800" 
                  : "text-red-900"
              )}
              initial={{ opacity: 1, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {statusText}
            </motion.span>

            {/* Casino-style number with golden glow */}
            <div className="h-10 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={displayNumber}
                  initial={{ y: 50, opacity: 1 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 1 }}
                  transition={{
                    y: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className={cn(
                    "text-4xl font-black tracking-wider transition-all duration-300",
                    isUrgent 
                      ? "text-red-800" 
                      : "text-red-900"
                  )}
                >
                  {displayNumber}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Subtle corner accents */}
          <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-amber-700 opacity-60" />
          <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-700 opacity-60" />
        </div>
      </div>
    </div>
  )
}

export default TimeDisplay;
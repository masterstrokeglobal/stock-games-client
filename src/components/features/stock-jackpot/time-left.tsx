import { useGameState } from "@/hooks/use-current-game"
import { cn } from "@/lib/utils"
import { RoundRecord } from "@/models/round-record"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import ClockIcon from "@/components/common/icons/clock"

const TimeDisplay = ({ roundRecord, className }: { roundRecord: RoundRecord, className?: string }) => {
  const { gameTimeLeft, isPlaceOver, placeTimeLeft } = useGameState(roundRecord)
  const statusText = isPlaceOver ? "BETTING CLOSED" : "BETTING OPEN"
  const [displayNumber, setDisplayNumber] = useState("")

  useEffect(() => {
    const currentTime = !isPlaceOver ? placeTimeLeft.shortFormatNoMinutes : gameTimeLeft.shortFormatNoMinutes
    setDisplayNumber(currentTime)
  }, [isPlaceOver, placeTimeLeft, gameTimeLeft])

  return (
    <div className={cn(className)}>
      <div className="relative flex items-center justify-center">
        <div
          className={cn(
            "flex items-center sm:gap-4 px-3 sm:px-6 rounded-full border",
            "h-9 sm:h-12 min-w-[260px] sm:min-w-[330px] max-w-full",
            "bg-[#002C3ECC] border-[#FFFFFFB2]",
            "shadow-lg"
          )}
        >
          {/* Icon */}
          <ClockIcon className="text-white opacity-80 w-5 h-5 sm:w-6 sm:h-6" />
          {/* Status and Timer */}
          <div className="flex-1 flex flex-col font-orbitron items-center translate-y-1/2 -top-1/2 relative justify-center min-w-0">
            <span
              className={cn(
                "font-spacemono font-bold tracking-wider text-xs xs:text-base sm:text-lg uppercase",
                "text-white opacity-90"
              )}
              style={{ letterSpacing: "0.08em" }}
            >
              {statusText}
            </span>
            {/* Timer */}
            <div className="flex items-center justify-end min-w-[48px] sm:min-w-[80px]">
              <div className="h-7 sm:h-10 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={displayNumber}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      y: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                    className={cn(
                      "font-spacemono text-xl sm:text-3xl sm:text-4xl font-black tracking-wider transition-all duration-300"
                    )}
                    style={{ lineHeight: "1" }}
                  >
                    {displayNumber}s
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimeDisplay;
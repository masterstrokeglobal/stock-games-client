import { useGameState } from "@/hooks/use-current-game"
import { RoundRecord } from "@/models/round-record"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Timer } from "lucide-react"

const TimeDisplay = ({ roundRecord }: { roundRecord: RoundRecord }) => {
    const { gameTimeLeft, isPlaceOver, placeTimeLeft } = useGameState(roundRecord)
    const statusText = isPlaceOver ? "Betting Closed" : "Betting Open"
  
    return (
      <motion.div
        className="relative w-full h-[150px] bg-gray-900 rounded-xl mt-4 overflow-hidden border-2 border-primary-game"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 pointer-events-none bg-scanline opacity-10 z-10"></div>
  
        <div className="flex flex-col items-center justify-center h-full p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`status-${statusText}`}
              className="flex items-center mb-4 space-x-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ rotate: [-15, 0, 15] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {isPlaceOver ? (
                  <Timer className="w-5 h-5 text-amber-300" />
                ) : (
                  <Clock className="w-5 h-5 text-cyan-300" />
                )}
              </motion.div>
              <span
                className="text-sm font-medium uppercase tracking-wider text-cyan-300"
                style={{ textShadow: "0 0 3px currentColor" }}
              >
                {statusText}
              </span>
            </motion.div>
          </AnimatePresence>
  
          <AnimatePresence mode="wait">
            <motion.div
              key={`time-${isPlaceOver ? gameTimeLeft.shortFormat : placeTimeLeft.shortFormat}`}
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1,
                scale: [0.95, 1, 0.95],
                transition: {
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }
              }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="font-mono text-6xl font-bold text-cyan-300 pixel-text">
                {isPlaceOver ? gameTimeLeft.shortFormat : placeTimeLeft.shortFormat}
              </div>
            </motion.div>
          </AnimatePresence>
  
          <motion.div
            className="mt-4 text-xs text-gray-500 uppercase tracking-widest"
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {isPlaceOver ? "Game in Progress" : "Place Your Bets"}
          </motion.div>
        </div>
      </motion.div>
    )
}
  


export default TimeDisplay;
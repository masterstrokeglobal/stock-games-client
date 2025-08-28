import { useGameState } from "@/hooks/use-current-game";
import { cn } from "@/lib/utils";
import { RoundRecord } from "@/models/round-record";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import ClockIcon from "@/components/common/icons/clock";

const TimeDisplay = ({
  roundRecord,
  className,
}: {
  roundRecord: RoundRecord;
  className?: string;
}) => {
  const { gameTimeLeft, isPlaceOver, placeTimeLeft } =
    useGameState(roundRecord);
  const statusText = isPlaceOver ? "BETTING CLOSED" : "BETTING OPEN";
  const [displayNumber, setDisplayNumber] = useState("");

  useEffect(() => {
    const currentTime = !isPlaceOver
      ? placeTimeLeft.shortFormatNoMinutes
      : gameTimeLeft.shortFormatNoMinutes;
    setDisplayNumber(currentTime);
  }, [isPlaceOver, placeTimeLeft, gameTimeLeft]);

  return (
    <div className={cn(className)}>
      <div className="relative flex items-center justify-center">
        <div
          className={cn(
            "flex items-center gap-4 px-3 sm:px-6 rounded-full border",
            "h-fit w-fit sm:min-w-[260px] max-w-full",
            "border-[#FFFFFFB2] shadow-lg transition-all duration-500",
            // Dynamic background based on betting status
            isPlaceOver
              ? "bg-red-500/80 border-red-300/80" // Red when betting is closed
              : "bg-green-500/80 border-green-300/80" // Green when betting is open
          )}
        >
          {/* Status and Timer */}
          <div className="flex-1 flex flex-col font-orbitron items-center relative justify-center min-w-0">
            <span
              className={cn(
                "font-bold tracking-wider text-xs xs:text-sm  uppercase px-2",
                "text-white opacity-90"
              )}
              style={{ letterSpacing: "0.08em" }}
            >
              {statusText}
            </span>
            {/* Timer */}
            <div className="flex items-center justify-end min-w-[48px] sm:min-w-[80px] gap-3">
              {/* Icon */}
              <ClockIcon className="text-white opacity-80 w-5 h-5 sm:w-6 sm:h-6" />
              <div className="h-7 sm:h-10 flex items-center ">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={displayNumber}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      opacity: { duration: 0.15 },
                    }}
                    className={cn(
                      "text-xl sm:text-3xl  font-bold tracking-wider transition-all duration-300"
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
  );
};

export default TimeDisplay;

import { useGameState } from "@/hooks/use-current-game";
import { cn } from "@/lib/utils";
import { RoundRecord } from "@/models/round-record";

export const TimeBox = ({ time }: { time: any }) => {
  return (
    <div className=" rounded-[5px] font-quantico font-normal text-[20px] lg:text-lg bg-white/10 border border-white lg:w-[40px] lg:h-[40px] xl:w-[50px] xl:h-[50px] w-[37px] h-[30px] flex items-center justify-center">
      {time || 0}
    </div>
  );
};

export const NextRoundTimer = ({
  isAviator,
  roundRecord,
}: {
  isAviator: boolean;
  roundRecord: RoundRecord;
}) => {
  const { gameTimeLeft, isPlaceOver, placeTimeLeft, isGameOver } =
    useGameState(roundRecord);

  const statusText = isPlaceOver
    ? isGameOver
      ? "Game Over"
      : "The Next Round In"
    : "Betting Open";

  return (
    <>
      {/* Text content */}
      <span className="text-white tracking-wider relative z-10 text-sm lg:text-base xl:text-[20px] font-quantico">
        {statusText}
      </span>

      {/* Timer */}
      <div className="z-10 text-white flex lg:gap-4 gap-2 font-bold justify-center items-center">
        <TimeBox
          time={
            !isPlaceOver
              ? placeTimeLeft.formatted.slice(0, 1)
              : isAviator
              ? "--"
              : gameTimeLeft.formatted.slice(0, 1)
          }
        />
        :
        <TimeBox
          time={
            !isPlaceOver
              ? placeTimeLeft.formatted.slice(2, 3)
              : isAviator
              ? "--"
              : gameTimeLeft.formatted.slice(2, 3)
          }
        />
        <TimeBox
          time={
            !isPlaceOver
              ? placeTimeLeft.formatted.slice(3, 4)
              : isAviator
              ? "--"
              : gameTimeLeft.formatted.slice(3, 4)
          }
        />
      </div>
    </>
  );
};

const TimeDisplay = ({
  roundRecord,
  className,
  isAviator,
  multiplier,
  hasBet,
  hasCashedOut,
  betAmount,
  planeStatus,
}: {
  roundRecord: RoundRecord;
  className?: string;
  isAviator?: boolean;
  multiplier?: number;
  hasBet?: boolean;
  hasCashedOut?: boolean;
  betAmount?: number;
  planeStatus?: "active" | "crashed" | "flew_away";
}) => {
  const { isPlaceOver } = useGameState(roundRecord);

  return (
    <div
      className={cn(
        className,
        "flex flex-col items-center justify-center lg:gap-5 gap-[10px] z-20"
      )}
    >
      {/*  //?timer till betting is open */}
      {(!isPlaceOver || !hasBet) && (
        <NextRoundTimer
          isAviator={isAviator ?? false}
          roundRecord={roundRecord}
        />
      )}

      {/* //?multiplier when user has bet */}
      {isPlaceOver && planeStatus === "active" && hasBet && (
        <div className="text-white text-2xl font-medium text-center w-full flex flex-col items-center justify-center gap-2">
          <span className="text-white text-2xl font-medium text-center w-full">
            x{multiplier?.toFixed(2)}
          </span>
          {hasBet && betAmount && (
            <div
              className={`text-xs font-bold uppercase tracking-wide mb-2 px-2 py-0.5 rounded-full border shadow-lg ${
                hasCashedOut
                  ? "text-green-400 bg-green-500/20 border-green-400/30"
                  : "text-yellow-400 bg-yellow-500/20 border-yellow-400/30"
              }`}
            >
              {hasCashedOut ? "Cashed Out" : `Bet : ₹${betAmount}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeDisplay;

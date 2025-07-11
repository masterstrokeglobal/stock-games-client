import { useGameState } from "@/hooks/use-current-game";
import { cn } from "@/lib/utils";
import { RoundRecord } from "@/models/round-record";

export const GameTimer = ({ roundRecord, className }: { roundRecord: RoundRecord, className?: string }) => {
    const { gameTimeLeft, isPlaceOver, placeTimeLeft, isGameOver } = useGameState(roundRecord);
    const statusText = isPlaceOver ? (isGameOver ? "Game Over" : "Betting Closed") : "Betting Open";
    const timeLeft = !isPlaceOver ? placeTimeLeft : gameTimeLeft;

    return (
        <div
            className={cn(`
        flex items-center gap-1 justify-between
        bg-transparent
        w-fit
      `, className)}
        >
            <span
                className={`
          uppercase tracking-wider font-montserrat font-semibold text-nowrap text-sm sm:text-xl
          text-white
        `}>
                {statusText}
            </span>
            <span
                className={` font-montserrat font-semibold text-white px-2 sm:px-3 py-1 rounded text-nowrap text-sm sm:text-xl
        `}>
                {`${timeLeft.minutes.toString().padStart(2, '0')} : ${timeLeft.seconds.toString().padStart(2, '0')}`}
            </span>
        </div>
    );
};

import { useGameState } from "@/hooks/use-current-game";
import { RoundRecord, RoundRecordGameType } from "@/models/round-record";

const RoundTimings = ({ roundRecord }: { roundRecord: RoundRecord }) => {
    const { gameTimeLeft, isPlaceOver, placeTimeLeft, isGameOver } = useGameState(roundRecord)
    const statusText = isPlaceOver ? isGameOver ? "Game Over" : "Betting Closed" : "Betting Open";
    const isAviator = roundRecord.gameType === RoundRecordGameType.AVIATOR;

    return (
        <div className="p-1.5 rounded-md border-[#2C3682] border">
            <header className="text-white rounded-md text-2xl space-y-4 bg-[#0C309E] backdrop-blur-sm dice-header text-center  py-3 px-4 font-bold">
                <h2 className="font-bold tracking-wider relative z-10 ">
                    {statusText}
                </h2>
                <p
                    className="text-white font-bold tracking-wider relative z-10 transition-opacity duration-500"
                    style={{
                        opacity: gameTimeLeft.raw % 2 === 0 ? 1 : 0.5
                    }}
                >
                    {!isPlaceOver ? placeTimeLeft.seconds : isAviator ? "--" : gameTimeLeft.seconds}
                </p>
            </header>
        </div>
    );
};

export default RoundTimings;




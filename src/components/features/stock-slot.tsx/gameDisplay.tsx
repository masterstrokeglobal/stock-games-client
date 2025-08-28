import { useGameState, useShowResults } from "@/hooks/use-current-game";
import { RoundRecord } from "@/models/round-record";
import { useGetMySlotGamePlacement } from "@/react-query/slot-game-queries";
import React from "react";
import BettingPanel from "./BettingPanel";
import ResultDialog from "./dialogs/ResultDialog";
import GameBoard from "./GameBoard";
import { StockListMobile } from "./StocksList";

interface GameDisplayProps {
  isGameActive: boolean;
  winningIdRoundRecord?: any;
  isPlaceOver?: boolean;
  betAmount: number;
  setBetAmount: (amount: number) => void;
  roundRecord: RoundRecord;
  currentStocks: any[];
  stockPrice: any;
}

const GameDisplay: React.FC<GameDisplayProps> = ({
  isGameActive,
  winningIdRoundRecord,
  isPlaceOver,
  betAmount,
  setBetAmount,
  roundRecord,
  currentStocks,
  stockPrice,
}) => {
  const { gameTimeLeft, placeTimeLeft, isGameOver } = useGameState(roundRecord);
  const { data: myPlacementData } = useGetMySlotGamePlacement(roundRecord.id);
  const { showResults, previousRoundId } = useShowResults(
    roundRecord,
    myPlacementData?.data ?? []
  );

  // Calculate the display time and status
  const displayTime = !isPlaceOver
    ? placeTimeLeft.formatted
    : gameTimeLeft.formatted;

  const statusText = isPlaceOver ? "Betting Closed" : "Betting Open";

  return (
    <>
      {/* //? bet status and timer  */}
      <div className=" w-full lg:w-auto lg:absolute lg:top-0 z-[80] flex flex-col items-center justify-center">
        <h1 className={`text-xl lg:text-4xl xl:text-5xl font-bold text-white`}>
          {statusText}
        </h1>

        <div
          style={{
            backgroundImage: "url('/images/slot-machine/clock.png')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
          className=" translate-y-1/3 lg:translate-y-0 lg:h-[80px] h-[43px] lg:w-[209px] w-[112px] flex items-center justify-center"
        >
          <span className="text-white translate-x-[40%] text-[15px] lg:text-2xl xl:text-[40px] font-bold">
            {displayTime}
          </span>
        </div>
      </div>

      {/* //? game board  */}
      <div className="w-full lg:absolute lg:max-w-[80%] top-6 h-[calc(100%-130px)] z-[70]">
        <GameBoard
          isGameActive={isGameActive}
          winningIdRoundRecord={winningIdRoundRecord}
          isPlaceOver={isPlaceOver}
          isGameOver={isGameOver}
          roundRecord={roundRecord}
        />
      </div>

      {/* //? betting panel  */}
      <BettingPanel
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        roundRecord={roundRecord}
      />

      {/* //? stock list only for mobile  */}
      <StockListMobile currentStocks={currentStocks} stockPrice={stockPrice} />

      {/* //? result dialog  */}
      {previousRoundId && (
        <ResultDialog
          key={String(showResults)}
          open={showResults}
          roundRecordId={previousRoundId}
        />
      )}
    </>
  );
};

export default GameDisplay;

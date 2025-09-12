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
  imgRef: React.RefObject<HTMLImageElement>;
  // getBackgroundStyle: (src: string) => React.CSSProperties;
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
  imgRef,
  // getBackgroundStyle,
}) => {
  const { isGameOver, placeTimeLeft } = useGameState(roundRecord);
  const { data: myPlacementData } = useGetMySlotGamePlacement(roundRecord.id);
  const { showResults, previousRoundId } = useShowResults(
    roundRecord,
    myPlacementData?.data ?? []
  );

  return (
    <>
      {/* //? game board  */}
      <div className="w-full h-full flex flex-1 justify-center relative pointer-events-none ">
        
        <GameBoard
          isGameActive={isGameActive}
          winningIdRoundRecord={winningIdRoundRecord}
          isPlaceOver={isPlaceOver}
          isGameOver={isGameOver}
          roundRecord={roundRecord}
          // getBackgroundStyle={getBackgroundStyle}
          imgRef={imgRef}
        />
      </div>

      {/* //? betting panel  */}
      <BettingPanel
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        roundRecord={roundRecord}
        // getBackgroundStyle={getBackgroundStyle}
      />

      {/* //? stock list only for mobile  */}
      <StockListMobile currentStocks={currentStocks} stockPrice={stockPrice} />

      {/* //? result dialog  */}
      {previousRoundId && (
        <ResultDialog
          key={String(showResults)}
          open={showResults}
          roundRecordId={previousRoundId}
          placeTimeLeft={placeTimeLeft}
        />
      )}
    </>
  );
};

export default GameDisplay;

import React from "react";
import GameDisplay from "./gameDisplay";
import { StockListDesktop } from "./StocksList";
import Image from "next/image";
import { useGameState } from "@/hooks/use-current-game";
import MenuDialog from "./dialogs/MenuDialog";
import useWindowSize from "@/hooks/use-window-size";

interface GameScreenProps {
  isGameActive: boolean;
  winningIdRoundRecord?: any;
  isPlaceOver?: boolean;
  betAmount: number;
  setBetAmount: (amount: number) => void;
  roundRecord: any;
  currentStocks: any[];
  stockPrice: any;
  // getBackgroundStyle: (src: string) => React.CSSProperties;
}

const StockSlot: React.FC<GameScreenProps> = ({
  isGameActive,
  winningIdRoundRecord,
  isPlaceOver,
  betAmount,
  setBetAmount,
  roundRecord,
  currentStocks,
  stockPrice,
  // getBackgroundStyle,
}) => {
  const { gameTimeLeft, placeTimeLeft } = useGameState(roundRecord);
  const { isMobile } = useWindowSize();

  // Calculate the display time and status
  const displayTime = !isPlaceOver
    ? placeTimeLeft.formatted
    : gameTimeLeft.formatted;

  const statusText = isPlaceOver ? "Betting Closed" : "Betting Open";
  return (
    <div className="flex flex-col items-center justify-between h-full p-2 lg:p-5 pb-0 lg:pb-0 font-blood-melt text-white relative">
      
      <div className="flex justify-center items-center absolute top-2 right-2 lg:right-5 lg:top-5 z-30">
        <MenuDialog>
          <Image
            className="w-10 h-10 rounded-full"
            // src={getCachedImage("/images/slot-machine/menu-btn.png")?.src}
            src="/images/slot-machine/menu-btn.png"
            alt="menu"
            width={isMobile ? 40 : 60}
            height={isMobile ? 40 : 60}
          />
        </MenuDialog>
      </div>

      {/* //? title */}
      <div className="flex justify-center items-center">
        <Image
          src="/images/slot-machine/heading.png"
          alt="title"
          width={isMobile ? 233 : 388}
          height={isMobile ? 50 : 85}
        />
      </div>

      {/* //? status text and timer */}
      <div className=" w-full flex items-center justify-center lg:grid lg:grid-cols-12">
        <div className=" lg:col-span-8 lg:col-start-2 flex items-center justify-center gap-2">
          <Image
            src="/images/slot-machine/clock.png"
            alt="clock"
            width={isMobile ? 40 : 60}
            height={isMobile ? 60 : 90}
          />
          <div className="flex flex-col items-center justify-center lg:gap-2">
            <div className={`text-base lg:text-3xl font-normal relative`}>
              <p
                style={{
                  textShadow: "0 0 4px black",
                }}
                className="absolute top-0 left-0 z-10 text-white"
              >
                {statusText}
              </p>
              <p className="slot-gradient-shadow z-20 relative">{statusText}</p>
            </div>
            <div className="text-3xl lg:text-[40px] font-normal relative">
              <p
                style={{
                  textShadow: "0 0 4px black",
                }}
                className="absolute top-0 left-0 z-10 text-white"
              >
                {displayTime}
              </p>
              <p className="slot-gradient-shadow z-20 relative">{displayTime}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 w-full max-w-2xl lg:max-w-none h-full relative">
        {/* //? game board and betting panel  */}
        <div className="col-span-8 col-start-2 flex flex-col items-center justify-around h-full relative z-20 flex-1">
          <GameDisplay
            isGameActive={isGameActive}
            winningIdRoundRecord={winningIdRoundRecord}
            isPlaceOver={isPlaceOver}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            roundRecord={roundRecord}
            currentStocks={currentStocks}
            stockPrice={stockPrice}
            // getBackgroundStyle={getBackgroundStyle}
          />
        </div>

        {/* //? stock list  */}
        <StockListDesktop
          currentStocks={currentStocks}
          stockPrice={stockPrice}
        />
      </div>
    </div>
  );
};

export default StockSlot;

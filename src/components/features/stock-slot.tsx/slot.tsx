import React, { useRef } from "react";
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
  const imgRef = useRef<HTMLImageElement>(null);

  // Calculate the display time and status
  const displayTime = !isPlaceOver
    ? placeTimeLeft.formatted
    : gameTimeLeft.formatted;

  const statusText = isPlaceOver ? "Betting Closed" : "Betting Open";

  return (
    <div className="flex flex-col items-center justify-between h-screen p-2 lg:p-5 pb-0 lg:pb-0 font-blood-melt text-white relative overflow-y-auto">
      {/* //? menu button */}
      <div className="flex justify-center items-center absolute top-2 right-2 lg:right-5 lg:top-5 z-30">
        <MenuDialog>
          <Image
            className="rounded-full"
            // src={getCachedImage("/images/slot-machine/menu-btn.png")?.src}
            src="https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179645/menu-btn_ymde5q.png"
            alt="menu"
            width={isMobile ? 40 : 60}
            height={isMobile ? 40 : 60}
          />
        </MenuDialog>
      </div>

      <div className="w-full h-full justify-center items-center flex flex-1 flex-col">
        {/* //? title */}
        <div className="flex justify-center items-center">
          <Image
            src="https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179643/heading_bet8pj.png"
            alt="title"
            width={isMobile ? 233 : 388}
            height={isMobile ? 50 : 85}
          />
        </div>

        <div className="w-full h-full justify-center items-start pt-6 md:pt-0 flex flex-1 gap-5">
          <div className="justify-center items-center flex flex-col gap-4 md:gap-0">
            {/* //? status text and timer */}
            <div className=" w-full flex items-center justify-center flex-shrink-0">
              <div className="flex items-center justify-center gap-2">
                <Image
                  src="https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179643/clock_k8dux3.png"
                  alt="clock"
                  width={isMobile ? 40 : 60}
                  height={isMobile ? 60 : 90}
                />
                <div className="flex flex-col items-center justify-center lg:gap-2">
                  <p
                    style={{ WebkitTextStroke: "1px #0285F5" }}
                    className="text-white text-base lg:text-3xl"
                  >
                    {statusText}
                  </p>

                  <p
                    style={{ WebkitTextStroke: "1px #0285F5" }}
                    className=" z-20 relative text-base lg:text-3xl"
                  >
                    {displayTime}
                  </p>
                </div>
              </div>
            </div>

            {/* //? game board and betting panel  */}
            <GameDisplay
              isGameActive={isGameActive}
              winningIdRoundRecord={winningIdRoundRecord}
              isPlaceOver={isPlaceOver}
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              roundRecord={roundRecord}
              currentStocks={currentStocks}
              stockPrice={stockPrice}
              imgRef={imgRef}
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
    </div>
  );
};

export default StockSlot;

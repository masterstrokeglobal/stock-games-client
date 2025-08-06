import React from "react";
import GameDisplay from "./gameDisplay";
import HowToPlay from "./dialogs/HowToPlay";
import BettingHistory from "./dialogs/BettingHistory";
import { StockListDesktop } from "./StocksList";
import MenuDialog from "./dialogs/MenuDialog";

interface GameScreenProps {
  stockStates: number[];
  isGameActive: boolean;
  winningIdRoundRecord?: any;
  isPlaceOver?: boolean;
  betAmount: number;
  setBetAmount: (amount: number) => void;
  roundRecord: any;
}

const StockSlot: React.FC<GameScreenProps> = ({
  stockStates,
  isGameActive,
  winningIdRoundRecord,
  isPlaceOver,
  betAmount,
  setBetAmount,
  roundRecord,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-2 lg:p-5 pb-0 lg:pb-0 font-wendy-one ">
      <div className="flex flex-col lg:grid lg:grid-cols-12 w-full max-w-2xl lg:max-w-none h-full">
        {/* //? menu mobile  */}
        <div className="lg:hidden flex justify-between relative h-fit flex-shrink-0">
          <div className="flex flex-col justify-center items-center gap-2">
            <MenuDialog>
              <img
                className="w-10 h-10 rounded-full"
                src="/images/slot-machine/menu-btn.png"
                alt=""
              />
            </MenuDialog>
            <button className="w-10 h-10">
              <img
                className="w-full h-full"
                src="/images/slot-machine/btn-audio.png"
                alt=""
              />
            </button>
          </div>
          <div
            style={{
              background:
                "linear-gradient(to right, #995914, #CC9B1A, #995914)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              WebkitTextStroke: "1px #4A1900",
            }}
            className="text-4xl uppercase"
          >
            STOCKSLOT
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <button className="w-10 h-10">
              <img
                className="w-full h-full"
                src="/images/slot-machine/i-btn.png"
                alt=""
              />
            </button>
            <button className="w-10 h-10">
              <img
                className="w-full h-full"
                src="/images/slot-machine/btn-pause.png"
                alt=""
              />
            </button>
          </div>
        </div>

        {/* //? menu desktop  */}
        <div className="lg:col-span-2 lg:flex hidden flex-col justify-start items-start relative font-wendy-one text-xl">
          <div
            style={{
              backgroundImage: "url('/images/slot-machine/menu-bg.png')",
              backgroundSize: "100% 100%",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
            }}
            className="flex flex-col gap-2 w-full justify-center items-center px-5 py-3"
          >
            <BettingHistory>
              <div
                style={{
                  backgroundImage:
                    "url('/images/slot-machine/menu-item-bg-1.png')",
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                }}
                className="text-center w-full px-3 py-2"
              >
                Betting History
              </div>
            </BettingHistory>
            <HowToPlay>
              <div
                style={{
                  backgroundImage:
                    "url('/images/slot-machine/menu-item-bg-2.png')",
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                }}
                className="text-center px-3 py-2"
              >
                How to play
              </div>
            </HowToPlay>
          </div>
        </div>

        {/* //? game board and betting panel  */}
        <div className="lg:col-span-8 flex flex-col items-center justify-end lg:p-5 h-full relative z-20 flex-1">
          <GameDisplay
            stockStates={stockStates}
            isGameActive={isGameActive}
            winningIdRoundRecord={winningIdRoundRecord}
            isPlaceOver={isPlaceOver}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            roundRecord={roundRecord}
          />
        </div>

        {/* //? stock list  */}
        <StockListDesktop 
          roundRecord={roundRecord}
          winningIdRoundRecord={winningIdRoundRecord}
        />
      </div>
    </div>
  );
};

export default StockSlot;

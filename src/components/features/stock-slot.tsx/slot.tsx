import React from "react";
import GameDisplay from "./gameDisplay";
import HowToPlay from "./dialogs/HowToPlay";
import BettingHistory from "./dialogs/BettingHistory";
import { StockListDesktop } from "./StocksList";
import MenuDialog from "./dialogs/MenuDialog";
import { useAudio } from "@/context/audio-context";
import InfoDialog from "./dialogs/InfoDialog";
import DemoVideo from "./dialogs/demo-video";
// import { getCachedImage } from "@/hooks/image-preloader";

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
  const { isMuted, toggleMute } = useAudio();
  return (
    <div className="flex flex-col items-center justify-center h-full p-2 lg:p-5 pb-0 lg:pb-0 font-wendy-one text-white">
      <div className="flex flex-col lg:grid lg:grid-cols-12 w-full max-w-2xl lg:max-w-none h-full">
        {/* //? menu mobile  */}
        <div className="lg:hidden flex justify-between relative h-fit flex-shrink-0">
          <div className="flex flex-col justify-center items-center gap-2">
            <MenuDialog>
              <img
                className="w-10 h-10 rounded-full"
                // src={getCachedImage("/images/slot-machine/menu-btn.png")?.src}
                src="/images/slot-machine/menu-btn.png"
                alt=""
              />
            </MenuDialog>
            <button
              onClick={toggleMute}
              className="w-10 h-10 relative flex justify-center items-center"
            >
              {isMuted && (
                <div className="w-[1px] h-3/4 bg-black absolute rotate-45 z-20 "></div>
              )}
              <img
                className="w-full h-full block z-10"
                // src={getCachedImage("/images/slot-machine/btn-audio.png")?.src}
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
            <InfoDialog>
              <button className="w-10 h-10">
                <img
                  className="w-full h-full"
                  // src={getCachedImage("/images/slot-machine/i-btn.png")?.src}
                  src="/images/slot-machine/i-btn.png"
                  alt=""
                />
              </button>
            </InfoDialog>
            <DemoVideo>
              <button className="w-10 h-10">
                <img
                  className="w-full h-full"
                  // src={getCachedImage("/images/slot-machine/btn-pause.png")?.src}
                  src="/images/slot-machine/btn-pause.png"
                  alt=""
                />
              </button>
            </DemoVideo>
          </div>
        </div>

        {/* //? menu desktop  */}
        <div className="lg:col-span-2 lg:flex hidden flex-col justify-start items-start relative font-wendy-one text-xl">
          <div
            style={{
              // ...getBackgroundStyle("/images/slot-machine/menu-bg.png"),
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
                  // ...getBackgroundStyle("/images/slot-machine/menu-item-bg-1.png"),
                  backgroundImage: "url('/images/slot-machine/menu-item-bg-1.png')",
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
                  // ...getBackgroundStyle("/images/slot-machine/menu-item-bg-2.png"),
                  backgroundImage: "url('/images/slot-machine/menu-item-bg-2.png')",
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                }}
                className="text-center px-3 py-2"
              >
                How to play
              </div>
            </HowToPlay>
            <DemoVideo>
              <div
                style={{
                  // ...getBackgroundStyle("/images/slot-machine/menu-item-bg-2.png"),
                  backgroundImage: "url('/images/slot-machine/menu-item-bg-2.png')",
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                }}
                className="text-center px-3 py-2"
              >
                Demo Video
              </div>
            </DemoVideo>
          </div>
        </div>

        {/* //? game board and betting panel  */}
        <div className="lg:col-span-8 flex flex-col items-center justify-end lg:p-5 h-full relative z-20 flex-1">
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

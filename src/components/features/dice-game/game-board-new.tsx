import { useGameState, useIsPlaceOver } from "@/hooks/use-current-game";

import useWindowSize from "@/hooks/use-window-size";
import { cn, INR } from "@/lib/utils";
import { HeadTailPlacementType } from "@/models/head-tail";
import { RoundRecord } from "@/models/round-record";
import { useCreateHeadTailPlacement, useGetMyCurrentRoundHeadTailPlacement } from "@/react-query/head-tail-queries";
import { CheckCircle } from "lucide-react";
import { BettingArea } from "./betting-chip";
import { useEffect, useRef, useState } from "react";
import useWindowSize from "@/hooks/use-window-size";
import CoinToss from "../coin-head-tail/coin-toss";

type GameBoardProps = PropsWithClassName<{
    roundRecord: RoundRecord,
    roundRecordWithWinningSide: RoundRecord | null,
    betAmount: number,
    setBetAmount: (amount: number) => void
}>;

const CARD_WIDTH = 130;
const CARD_HEIGHT = 190;
const MOBILE_CARD_WIDTH = 110;

const GameBoard = ({ className, roundRecord, betAmount, setBetAmount, roundRecordWithWinningSide }: GameBoardProps) => {

    const tableRef = useRef<HTMLImageElement>(null);
    const { width } = useWindowSize();
    const { mutate: createHeadTailPlacement, isPending } = useCreateHeadTailPlacement();
    const [tableHeight, setTableHeight] = useState(0);
    const isMobile = width < 768;

    const isPlaceOver = useIsPlaceOver(roundRecord);


    useEffect(() => {
        if (tableRef.current) {
            setTableHeight(tableRef.current.clientHeight);
        }
    }, [width]);

    const handleCardClick = (side: HeadTailPlacementType) => {
        if (isPending) return;
        createHeadTailPlacement({ roundId: roundRecord.id, placement: side, amount: betAmount })
    };

    const { data: placements } = useGetMyCurrentRoundHeadTailPlacement(roundRecord.id);


    const { myHeadAmount, myTailAmount } = placements?.reduce((acc, placement) => {
        if (placement.placement === HeadTailPlacementType.HEAD) {
            acc.myHeadAmount += placement.amount;
        } else {
            acc.myTailAmount += placement.amount;
        }
        return acc;
    }, { myHeadAmount: 0, myTailAmount: 0 }) ?? { myHeadAmount: 0, myTailAmount: 0 };

    const hasHeadBet = myHeadAmount > 0;
    const hasTailBet = myTailAmount > 0;

    const winningSide = roundRecordWithWinningSide?.winningSide;


    return (
        <section className={cn("flex flex-col relative w-full h-full", className)}>
            <main className="w-full h-full flex flex-col justify-between">
                <div className="xl:mx-20 -mx-4  relative md:pt-20 pt-40">
                    <img src="/images/head-tail/bg.png" alt="game board" className="w-full scale-125 -translate-y-1/4 z-0 h-full absolute top-0 left-0 object-cover" />
                    <div className="bottom-0 left-0 w-full  min-h-40 bg-gradient-to-t scale-125 absolute z-0 from-[#00033D] to-transparent" />
                    <img src="/images/head-tail/table.png" alt="table" className="w-full relative z-0 aspect-[8/3]" ref={tableRef} />
                    <img src="/images/head-tail/girl.png" alt="dealer" className="absolute z-10 left-1/2 -translate-x-1/2 xl:h-60 h-48 " style={{ bottom: tableHeight - 10 }} />
                    {/* Cards absolute, larger size, with coin images in center */}
                   <CoinToss
                    isFlipping={isPlaceOver}
                    style={{
                        bottom:tableHeight / 2,
                    }}
                    className="absolute z-20  left-1/2 translate-y-1/3 -translate-x-1/2 "
                    resultOutcome={roundRecordWithWinningSide?.winningSide}
                   />
                    <div style={{ bottom: tableHeight / 2 }} className="absolute w-full left-0 right-0 -translate-y-1/4 z-20 pointer-events-none" >
                        <HeadCard
                            onClick={() => handleCardClick(HeadTailPlacementType.HEAD)}
                            bet={hasHeadBet ? myHeadAmount : 0}
                            win={hasHeadBet ? myHeadAmount * 2 : 0}

                            className={cn("xs:left-[12%] left-[10px] -bottom-1/2 cursor-pointer", winningSide === HeadTailPlacementType.HEAD ? "animate-pulse" : "")}
                            isMobile={isMobile}
                            style={{
                                width: isMobile ? MOBILE_CARD_WIDTH : CARD_WIDTH,
                                height: isMobile ? "auto" : CARD_HEIGHT,
                            }}
                        />
                        <TailCard
                            onClick={() => handleCardClick(HeadTailPlacementType.TAIL)}
                            bet={hasTailBet ? myTailAmount : 0}
                            win={hasTailBet ? myTailAmount * 2 : 0}

                            className={cn("xs:right-[12%] right-[10px] -bottom-1/2 cursor-pointer", winningSide === HeadTailPlacementType.TAIL ? "animate-pulse" : "")}
                            isMobile={isMobile}
                            style={{
                                width: isMobile ? MOBILE_CARD_WIDTH : CARD_WIDTH,
                                height: isMobile ? "auto" : CARD_HEIGHT,
                            }}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-center mt-8">
                    <GameTimer className="md:hidden flex relative z-10" roundRecord={roundRecord} />
                    <BettingArea
                        betAmount={betAmount}
                        setBetAmount={setBetAmount}
                    />
                </div>
            </main>
        </section>
    );
};

type CardProps = {
    bet: number;
    win: number;
    className?: string;
    onClick?: (side: HeadTailPlacementType) => void;
    isMobile?: boolean;
    style?: React.CSSProperties;
};

const HeadCard = ({ bet, win, className, onClick, isMobile, style }: CardProps) => (
    <div
        onClick={() => onClick?.(HeadTailPlacementType.HEAD)}
        className={cn(
            "flex flex-col items-center justify-between pointer-events-auto absolute ",
            className,
            "rounded-[14px] ",
            "transition-all duration-200",
            bet > 0 ? "ring-2 ring-[#24AAFF] scale-105" : ""
        )}
        style={{
            ...style,
            width: isMobile ? MOBILE_CARD_WIDTH : CARD_WIDTH,
            height: isMobile ? "auto" : CARD_HEIGHT,
            background: "radial-gradient(50% 50% at 50% 50%, rgba(255, 192, 37, 0.87) 0%, rgba(140, 76, 25, 0.87) 100%)",
            border: "2px solid #F5D561",
            boxShadow: "0px 0px 13.8px 0px #F5D561 inset",
            backdropFilter: "blur(13.3px)",
        }}
    >
        {bet > 0 && <div className="absolute -top-3 -left-3 -rotate-12 p-1.5 flex items-center justify-center aspect-square rounded-full  z-10">
            <span className="text-white md:text-[10px] text-[8px] z-10 relative  font-poppins">
                {INR(bet, true, false)}
            </span>
            <img src="/images/head-tail/betting-chip.png" alt="" className="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>}
        {bet > 0 && <BetIndicator key={bet} bet={bet} className="left-1/2 -translate-x-1/2 top-0 -translate-y-full" />}

        {/* Top Bar */}
        <div
            className="w-[calc(100%-12px)] py-0.5 px-0 text-center rounded-[7px] border border-[#F5D561] m-1.5 bg-[#693D11] shadow-[0px_0px_10.8px_-2px_#F5D561_inset]"
        >
            <span className={cn("font-medium tracking-wider text-[#F5D561] drop-shadow font-protest-strike", isMobile ? "text-sm" : "text-sm")}>HEAD</span>
        </div>
        {/* SubLabel and Coin */}
        <div className="flex flex-col items-center flex-1 justify-center relative w-full">
            <span className={cn("tracking-wider text-white mb-0.5 font-prosto-one", isMobile ? "text-xs" : "text-sm")}>Gold</span>
            {/* Coin image in center */}
            <div className="flex items-center justify-center w-full my-1">
                <img
                    src="/images/coins/head.png"
                    alt="head coin"
                    className={cn("relative z-10 object-contain drop-shadow", isMobile ? "w-8 h-8 scale-100" : "w-14 h-14")}
                    style={{ maxWidth: isMobile ? 32 : 60, maxHeight: isMobile ? 32 : 60, }}
                />
                <div className={cn("w-auto aspect-square blur-sm rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#693D11]", isMobile ? "h-8" : "h-14")}></div>
            </div>
            <div className={cn("font-bold text-white mb-0.5", isMobile ? "text-[8px]" : "text-[10px]")}>1 : 2</div>
        </div>
        {/* Bottom Stats */}
        <div
            className="w-full px-2 py-1.5 flex flex-col border-t-2 rounded-b-xl overflow-hidden border-t-[#F5D561] bg-[#693D11] shadow-[0_0_9.9px_0_#F5D561_inset] backdrop-blur-[12.1px]"
        >
            <div className="flex flex-row justify-between w-full mb-0.5">
                <span className={cn("font-semibold text-white", isMobile ? "text-[7px]" : "text-[9px]")}>Your Bet:</span>
                <span className="text-[9px] font-semibold text-white">Win:</span>
            </div>
            <div className="flex flex-row justify-between w-full">
                <span className="text-[10px] font-phudu text-white">{INR(bet)}</span>
                <span className="text-[10px] font-phudu text-white">{INR(win)}</span>
            </div>
        </div>
    </div>
);

const TailCard = ({ bet, win, className, onClick, isMobile }: CardProps) => (
    <div
        onClick={() => onClick?.(HeadTailPlacementType.TAIL)}
        className={cn(
            "flex flex-col items-center justify-between pointer-events-auto absolute",
            className,
            "rounded-[14px] ",
            "transition-all duration-200",
            bet > 0 ? "ring-2 ring-[#24AAFF] scale-105" : ""
        )}
        style={{
            width: isMobile ? MOBILE_CARD_WIDTH : CARD_WIDTH,
            height: isMobile ? "auto" : CARD_HEIGHT,
            background: "radial-gradient(50% 50% at 50% 50%, rgb(192, 192, 192) 0%, rgb(80, 80, 80) 100%)",
            border: "2px solid #B9B9B9",
            boxShadow: "0px 0px 10.8px -2px #B9B9B9 inset",
        }}
    >
         {bet > 0 && <div className="absolute -top-3 -left-3 -rotate-12 p-1.5 flex items-center justify-center aspect-square rounded-full  z-10">
            <span className="text-white md:text-[10px] text-[8px] z-10 relative  font-poppins">
                {INR(bet, true, false)}
            </span>
            <img src="/images/head-tail/betting-chip.png" alt="" className="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>}
        {bet > 0 && <BetIndicator key={bet} bet={bet} className="left-1/2 -translate-x-1/2 top-0 -translate-y-full" />}
        {/* Top Bar */}
        <div
            className="w-[calc(100%-12px)] py-0.5 px-0 text-center rounded-[7px] m-1.5"
            style={{
                borderRadius: "7px",
                border: "1px solid #B9B9B9",
                background: "#555",
                boxShadow: "0px 0px 10.8px -2px #B9B9B9 inset",
            }}
        >
            <span className="text-sm font-medium tracking-wider text-white drop-shadow font-protest-strike">TAIL</span>
        </div>
        {/* SubLabel and Coin */}
        <div className="flex flex-col items-center flex-1 justify-center relative w-full">
            <span className={cn("tracking-wider text-white mb-0.5 font-prosto-one", isMobile ? "text-xs" : "text-sm")}>Silver</span>
            {/* Coin image in center */}
            <div className="flex items-center justify-center w-full my-1">
                <img
                    src="/images/coins/tail.png"
                    alt="tail coin"
                    className={cn("relative z-10 object-contain drop-shadow", isMobile ? "w-8 h-8 scale-100" : "w-14 h-14")}
                    style={{ maxWidth: isMobile ? 32 : 60, maxHeight: isMobile ? 32 : 60, }}
                />
                <div className={cn("w-auto aspect-square blur-sm rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#555555]", isMobile ? "h-8" : "h-14")}></div>
            </div>
            <div className={cn("font-bold text-white mb-0.5", isMobile ? "text-[8px]" : "text-[10px]")}>1 : 2</div>
        </div>
        {/* Bottom Stats */}
        <div
            className="w-full px-2 py-1.5 flex flex-col border-t-2 rounded-b-xl overflow-hidden border-t-[#B9B9B9] bg-[#555] shadow-[0_0_9.9px_0_#B9B9B9_inset] backdrop-blur-[12.1px]"
            style={{
                boxShadow: "0px 0px 9.9px 0px #B9B9B9 inset",
            }}
        >
            <div className="flex flex-row justify-between w-full mb-0.5">
                <span className={cn("font-semibold text-white", isMobile ? "text-[7px]" : "text-[9px]")}>Your Bet:</span>
                <span className="text-[9px] font-semibold text-white">Win:</span>
            </div>
            <div className="flex flex-row justify-between w-full">
                <span className="text-[10px] font-phudu text-white">{INR(bet)}</span>
                <span className="text-[10px] font-phudu text-white">{INR(win)}</span>
            </div>
        </div>
    </div>
);



export const GameTimer = ({ roundRecord, className }: { roundRecord: RoundRecord, className?: string }) => {
    const { gameTimeLeft, isPlaceOver, placeTimeLeft, isGameOver } = useGameState(roundRecord);
    const statusText = isPlaceOver ? (isGameOver ? "Game Over" : "Betting Closed") : "Betting Open";
    const timeLeft = !isPlaceOver ? placeTimeLeft : gameTimeLeft;

    return (
        <div
            className={cn(`
        flex items-center gap-4 px-6 py-1 rounded-[2.5rem]
        border-2
        border-[#24AAFF]
        bg-[#001A5F]
        shadow-[0px_0px_9.1px_1px_rgba(0,116,255,1)]
        w-fit
        md:min-w-[300px]
      `, className)}
        >
            <span
                className={`
          uppercase tracking-wider font-poppins text-nowrap md:text-xl font-medium
          text-[rgba(148,209,255,1)]
        `}
                style={{
                    textShadow: "0px 0px 6.5px rgba(0, 116, 255, 1)",
                }}
            >
                {statusText}
            </span>
            <span
                className={` font-poppins font-bold text-white  px-3 py-1 rounded text-nowrap
        `}
                style={{
                    textShadow: "0px 0px 24.6px rgba(0,85,255,1)",
                }}
            >
                {`${timeLeft.minutes.toString().padStart(2, '0')} : ${timeLeft.seconds.toString().padStart(2, '0')}`}
            </span>
        </div>
    );
};

const BetIndicator = ({ bet, className }: { bet: number, className?: string }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className={cn("pointer-events-auto rounded-lg absolute flex flex-col items-center z-20 animate-pulse", className)}>
            <div
                style={{
                    background: "#076509",
                    boxShadow: "0px 0px 4px 0px #28FF18",
                    border: "2px solid #28FF18",
                }}
                className="flex flex-row items-center justify-center gap-1.5 px-1.5 py-0.5 rounded-lg w-20 h-10 md:w-[100px] md:h-[50px]"
            >
                <CheckCircle className="size-4 md:size-5" style={{ color: "#26FA11" }} />
                <div className="flex flex-col items-start">
                    <span className="text-white leading-none font-semibold font-poppins flex items-center text-xs md:text-sm" style={{ textShadow: "0px 0px 2px #24FA13" }}>
                        {INR(bet, true)}
                    </span>
                    <span className="text-white font-poppins text-[10px] md:text-xs" style={{ marginTop: "-1px", textShadow: "0px 0px 2px #24FA13" }}>placed</span>
                </div>
            </div>
            <img
                src="/images/head-tail/bet-triangle.png"
                alt=""
                className="w-4 h-auto md:w-6 md:h-auto"
                style={{
                    filter: "drop-shadow(0px 0px 4px #28FF18)"
                }}
            />
        </div>
    );
};
export default GameBoard;   
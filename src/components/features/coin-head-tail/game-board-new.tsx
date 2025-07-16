import { useGameState, useIsPlaceOver } from "@/hooks/use-current-game";
import useWindowSize from "@/hooks/use-window-size";
import { cn, INR } from "@/lib/utils";
import { HeadTailPlacementType } from "@/models/head-tail";
import { RoundRecord } from "@/models/round-record";
import { useCreateHeadTailPlacement, useGetMyCurrentRoundHeadTailPlacement } from "@/react-query/head-tail-queries";
import { CheckCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CoinToss from "./coin-toss";
import { BettingArea } from "../dice-game/betting-chip";

type GameBoardProps = PropsWithClassName<{
    roundRecord: RoundRecord,
    roundRecordWithWinningSide: RoundRecord | null,
    betAmount: number,
    setBetAmount: (amount: number) => void
}>;

const CARD_WIDTH = 130;
const CARD_HEIGHT = 190;
const MOBILE_CARD_WIDTH = 100;

const GameBoard = ({ className, roundRecord, betAmount, setBetAmount, roundRecordWithWinningSide }: GameBoardProps) => {

    const [showCoinToss, setShowCoinToss] = useState(false);
    const tableRef = useRef<HTMLImageElement>(null);
    const ladyRef = useRef<HTMLVideoElement>(null);
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

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        
        if (ladyRef.current && isPlaceOver) {
            ladyRef.current.play();
            timeout = setTimeout(() => {
                setShowCoinToss(true);
            }, 2500)
        } else {
            if (!roundRecordWithWinningSide?.finalPricesPresent) {
                ladyRef.current?.pause();
            }
        }
        return () => {
            if (timeout) clearTimeout(timeout);
        }
    }, [isPlaceOver, roundRecordWithWinningSide]);

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

    const headName = roundRecord.market.find(m => m.id === roundRecord.coinTossPair?.head.id)?.codeName ?? "HEAD";
    const tailName = roundRecord.market.find(m => m.id === roundRecord.coinTossPair?.tail.id)?.codeName ?? "TAIL";

    const winningSide = roundRecordWithWinningSide?.winningSide;

    // The CoinToss should only appear after showCoinToss is true, and should animate from above
    // We'll pass a prop "fromAbove" to CoinToss, which it can use to start from a higher Y and animate down

    return (
        <section className={cn("flex flex-col relative w-full h-full", className)}>
            <main className="w-full h-full flex flex-col xxl:justify-around justify-between">
                <div className="xl:mx-20 -mx-4  relative xxl:pt-[15%] md:pt-20 pt-40">
                    <img src="/images/head-tail/bg.png" alt="game board" className="w-full scale-125 -translate-y-1/4 z-0 h-full absolute top-0 left-0 object-cover" />
                    <div className="bottom-0 left-0 w-full  min-h-40 bg-gradient-to-t scale-125 absolute z-0 from-[#00033D] to-transparent" />
                    <img src="/images/head-tail/table.png" alt="table" className="w-full relative z-10 aspect-[8/3]" ref={tableRef} />
                    <video src="/images/head-tail/lady.webm" autoPlay loop muted controls={false} className="absolute z-0 xsm:left-1/2 left-[calc(48%)] -translate-x-1/2 xl:h-60 h-48 " style={{ bottom: tableHeight - 20 }} ref={ladyRef} />
                    {/* Cards absolute, larger size, with coin images in center */}
                   <CoinToss
                    isFlipping={isPlaceOver}
                    style={{
                        bottom:tableHeight / 2,
                        opacity: showCoinToss ? 1 : 0,
                    }}
                    className={cn("absolute z-20 left-1/2", showCoinToss ? "coin-toss-anim-1" : "")}
                    resultOutcome={roundRecordWithWinningSide?.winningSide}
                   />
                    <div style={{ bottom: tableHeight / 2 }} className="absolute w-full left-0 right-0 -translate-y-1/4 z-20 pointer-events-none" >
                        <HeadCard
                            onClick={() => handleCardClick(HeadTailPlacementType.HEAD)}
                            bet={hasHeadBet ? myHeadAmount : 0}
                            win={hasHeadBet ? myHeadAmount * 2 : 0}
                            name={headName}
                            className={cn("xs:left-[12%] left-[10px] -bottom-1/2 cursor-pointer", 
                                myHeadAmount > 0 ? "drop-shadow-[0px_0px_20.9px_#B6D7FF]" : "",
                                winningSide === HeadTailPlacementType.HEAD ? "animate-pulse" : "")}
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
                            name={tailName}
                            className={cn("xs:right-[12%] right-[10px] -bottom-1/2 cursor-pointer",
                                myTailAmount > 0 ? "drop-shadow-[0px_0px_20.9px_#B6D7FF]" : "",
                                 winningSide === HeadTailPlacementType.TAIL ? "animate-pulse" : "")}
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
    name: string;
};

const HeadCard = ({ bet, win, className, onClick, isMobile, style, name }: CardProps) => (
    <div
        onClick={() => onClick?.(HeadTailPlacementType.HEAD)}
        className={cn(
            "flex flex-col items-center justify-between pointer-events-auto absolute",
            className,
            "transition-all duration-200",
            bet > 0 ? "ring-2 ring-[#24AAFF]" : ""
        )}
        style={{
            ...style,
            width: isMobile ? MOBILE_CARD_WIDTH : CARD_WIDTH,
            height: isMobile ? "auto" : CARD_HEIGHT,
            borderRadius: "15px",
            border: "2px solid #6CDCFB",
            background: "radial-gradient(50% 50% at 50% 50%, rgba(57, 151, 201, 0.87) 0%, rgba(9, 39, 90, 0.87) 100%)",
            boxShadow: "0px 0px 13.8px 2px #0068E1 inset",
            backdropFilter: "blur(13.300000190734863px)",
        }}
    >
        {bet > 0 && <div className="absolute -top-3 -left-3 -rotate-12 p-1.5 flex items-center justify-center aspect-square rounded-full  z-10">
            <span className="text-white md:text-[10px] text-[8px] z-10 relative  font-poppins">
                {INR(bet, true, false)}
            </span>
            <img src="/images/head-tail/betting-chip.png" alt="" className="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>}
        {bet > 0 && <BetIndicator key={bet} bet={bet} className="left-1/2 drop-shadow-none -translate-x-1/2 top-0 -translate-y-full" />}

        {/* Top Bar */}
        <div
            className="w-[calc(100%-12px)] md:py-0.5 px-0 text-center m-1.5"
            style={{
                borderRadius: "9px",
                border: "1px solid #6CDCFB",
                background: "#002A68",
                boxShadow: "0px 0px 10.8px -2px #7AB3FF inset",
            }}
        >
            <span className={cn("font-medium tracking-wider text-[#6CDCFB] drop-shadow font-protest-strike", isMobile ? "text-xs" : "text-sm")}>HEAD</span>
        </div>
        {/* SubLabel and Coin */}
        <div className="flex flex-col items-center flex-1 justify-center relative w-full">
            <span className={cn("tracking-wider text-white  text-center mb-0.5 font-prosto-one w-full px-1 line-clamp-1 truncate", isMobile ? "text-xs" : "text-sm")}>{name.toUpperCase()}</span>

            {/* Coin image in center */}
            <div className="flex items-center justify-center w-full my-1">
                <img
                    src="/images/coins/head.png"
                    alt="head coin"
                    className={cn("relative z-10 object-contain drop-shadow", isMobile ? "w-8 h-8 scale-100 -translate-y-0.5" : "w-14 -translate-y-0.5 h-14")}
                    style={{ maxWidth: isMobile ? 32 : 60, maxHeight: isMobile ? 32 : 60, }}
                />
                <div className={cn("w-auto aspect-square blur-sm rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#001D4B]", isMobile ? "h-8" : "h-[60px]")}></div>
            </div>
            <div className={cn("font-bold text-white font-inter mb-0.5", isMobile ? "text-[8px]" : "text-[10px]")}>1 : 2</div>
        </div>
        {/* Bottom Stats */}
        <div
                className="w-full px-2 py-1.5 flex flex-col rounded-b-xl overflow-hidden "
            >
            <div className="flex flex-row font-inter justify-between w-full mb-0.5">
                <span className={cn("font-semibold text-white", isMobile ? "text-[7px]" : "text-[9px]")}>Your Bet:</span>
                <span className="text-[9px] font-semibold text-white">Win:</span>
            </div>
            <div className="flex flex-row justify-between w-full">
                <span className="text-[10px] font-phudu font-normal text-white">{INR(bet)}</span>
                <span className="text-[10px] font-phudu font-normal text-white">{INR(win)}</span>
            </div>
        </div>
        <div className="absolute -bottom-4 left-0 w-full h-4 bg-black/50 blur-[10px] z-10"/>
    </div>
);

const TailCard = ({ bet, win, className, onClick, isMobile, name }: CardProps) => (
    <div
        onClick={() => onClick?.(HeadTailPlacementType.TAIL)}
        className={cn(
            "flex flex-col items-center justify-between pointer-events-auto absolute",
            className,
            "transition-all duration-200",
            bet > 0 ? "ring-2 ring-[#24AAFF]" : ""
        )}
        style={{
            width: isMobile ? MOBILE_CARD_WIDTH : CARD_WIDTH,
            height: isMobile ? "auto" : CARD_HEIGHT,
            borderRadius: "15px",
            border: "2px solid #6CDCFB",
            background: "radial-gradient(50% 50% at 50% 50%, rgba(57, 151, 201, 0.87) 0%, rgba(9, 39, 90, 0.87) 100%)",
            boxShadow: "0px 0px 13.8px 2px #0068E1 inset",
            backdropFilter: "blur(13.300000190734863px)",
        }}
    >
         {bet > 0 && <div className="absolute -top-3 -left-3 -rotate-12 p-1.5 flex items-center justify-center aspect-square rounded-full  z-10">
            <span className="text-white md:text-[10px] text-[8px] z-10 relative  font-poppins">
                {INR(bet, true, false)}
            </span>
            <img src="/images/head-tail/betting-chip.png" alt="" className="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>}
        {bet > 0 && <BetIndicator key={bet} bet={bet} className="left-1/2 !drop-shadow-none -translate-x-1/2 top-0 -translate-y-full" />}
        {/* Top Bar */}
        <div
            className="w-[calc(100%-12px)] md:py-0.5 px-0 text-center m-1.5"
            style={{
                borderRadius: "9px",
                border: "1px solid #6CDCFB",
                background: "#002A68",
                boxShadow: "0px 0px 10.8px -2px #7AB3FF inset",
            }}
        >
            <span className="text-xs md:text-sm font-medium tracking-wider text-[#6CDCFB] drop-shadow font-protest-strike">TAIL</span>
        </div>
        {/* SubLabel and Coin */}
        <div className="flex flex-col items-center flex-1 justify-center relative w-full">
            <span className={cn("tracking-wider text-white text-center mb-0.5 w-full px-1 line-clamp-1 truncate font-prosto-one", isMobile ? "text-xs" : "text-sm")}>{name.toUpperCase()}</span>

            {/* Coin image in center */}
            <div className="flex items-center justify-center w-full my-1">
                <img
                    src="/images/coins/tail.png"
                    alt="tail coin"
                    className={cn("relative z-10 object-contain drop-shadow -translate-y-0.5", isMobile ? "w-8 h-8 scale-100" : "w-14 -translate-y-0.5 h-14")}
                    style={{ maxWidth: isMobile ? 32 : 60, maxHeight: isMobile ? 32 : 60, }}
                />
                <div className={cn("w-auto aspect-square blur-sm rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#001D4B]", isMobile ? "h-9" : "h-[60px]")}></div>
            </div>
            <div className={cn("font-bold text-white mb-0.5", isMobile ? "text-[8px]" : "text-[10px]")}>1 : 2</div>
        </div>
        {/* Bottom Stats */}
        <div
            className="w-full px-2 py-1.5 flex flex-col rounded-b-xl overflow-hidden "
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
        <div className="absolute -bottom-4 left-0 w-full h-4 bg-black/50 blur-[10px] z-10"/>
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
                className={`font-poppins font-bold text-white  px-3 py-1 rounded text-nowrap`}
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
        <div className={cn("pointer-events-auto rounded-lg absolute flex flex-col items-center z-20 ", className)}>
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
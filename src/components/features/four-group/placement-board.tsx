import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/context/auth-context";
import { useGameState, useShowResults } from "@/hooks/use-current-game";
import { useGameType } from "@/hooks/use-game-type";
import useNSEAvailable from "@/hooks/use-nse-available";
import { cn } from "@/lib/utils";
import MarketItem, { SchedulerType } from "@/models/market-item";
import { RoundRecord } from "@/models/round-record";
import { SinglePlayerGamePlacement } from "@/models/singleplayer-game-placement";
import User from "@/models/user";
import { useCreateSinglePlayerRouletteBet, useGetMyCurrentPlacement } from "@/react-query/game-record-queries";
import { useEffect, useMemo, useState } from "react";
import GameResultDialog from "../game/result-dialog";

type Props = {
    roundRecord: RoundRecord;
    previousRoundId?: string;
    globalBetAmount: number;
    children?: React.ReactNode;
    showCards?: boolean;
};

const SinglePlayerRouletteGame = ({ roundRecord, globalBetAmount, children, showCards = true }: Props) => {
    const [cardsFlipped, setCardsFlipped] = useState<boolean[]>([false, false, false, false]);
    const gameState = useGameState(roundRecord);
    const isNSEAvailable = useNSEAvailable();
    const { mutate, isPending: isPlacingBet } = useCreateSinglePlayerRouletteBet();
    const [tab, setTab] = useGameType();
    const { userDetails } = useAuthStore();
    const currentUser = userDetails as User;
    const { data, isSuccess } = useGetMyCurrentPlacement(roundRecord.id!.toString());

    const bettedChips = useMemo(() => {
        if (!isSuccess) return [];

        const gameRecords: SinglePlayerGamePlacement[] = data.data.placement ? data.data.placement.map((placement: any) => new SinglePlayerGamePlacement(placement)) : [];

        if (gameRecords.length === 0) return [];

        return gameRecords;
    }, [data]);


    const { previousRoundId, showResults } = useShowResults(roundRecord, bettedChips);

    useEffect(() => {
        const flipCards = async () => {
            for (let i = 0; i < 4; i++) {
                setTimeout(() => {
                    setCardsFlipped(prev => {
                        const newFlipped = [...prev];
                        newFlipped[i] = true;
                        return newFlipped;
                    });
                }, i * 150);
            }
        };
        flipCards();
    }, []);

    const handleCardClick = (cardIndex: number) => {
        if (gameState.isPlaceOver || isPlacingBet) return;

        const marketId = roundRecord.market[cardIndex]?.id;
        if (marketId) {
            mutate({
                roundId: roundRecord.id,
                amount: globalBetAmount,
                market: marketId,
            });
        }
    };

    const getBetForCard = (cardIndex: number) => {
        return bettedChips.find(chip => chip.marketItem?.id == roundRecord.market[cardIndex]?.id);
    };

    const isNSEAllowed = !currentUser.isNotAllowedToPlaceOrder(SchedulerType.NSE);
    const isCryptoAllowed = !currentUser.isNotAllowedToPlaceOrder(SchedulerType.CRYPTO);
    const isUSAMarketAllowed = !currentUser.isNotAllowedToPlaceOrder(SchedulerType.USA_MARKET);

    return (
        <div className="mx-auto lg:px-4 px-2 py-2 bg-gradient-to-br from-green-800 via-green-900 to-green-950">

            {children}
            <div className="relative rounded-xl lg:flex-row flex-col flex gap-8">
                <div className="w-full">
                    <Tabs
                        value={tab}
                        onValueChange={(value) => setTab(value as SchedulerType)}
                        className="w-full relative z-10 mb-4"
                    >
                        <TabsList
                            className="
            w-full flex
            bg-[linear-gradient(135deg,#1a0f0a_0%,#2d1810_30%,#3d2415_70%,#1a0f0a_100%)]
            p-1.5
            rounded-[1.5rem]
            border border-[#6b4423]/30
            items-center
            justify-center
            gap-2
            shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,215,0,0.1)]
        "
                        >
                            {isNSEAllowed && (
                                <TabsTrigger
                                    disabled={!isNSEAvailable}
                                    className={cn(
                                        "flex-1 h-11 text-[1rem] font-bold uppercase tracking-wide transition-all duration-300 rounded-[1.2rem] relative overflow-hidden",
                                        // Active state - Rich gold/amber
                                        "data-[state=active]:bg-[linear-gradient(135deg,#d4af37_0%,#ffd700_25%,#ffb347_75%,#cd853f_100%)]",
                                        "data-[state=active]:text-[#1a0f0a] data-[state=active]:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]",
                                        // Inactive state - Muted bronze
                                        "data-[state=inactive]:bg-[linear-gradient(135deg,#3d2415_0%,#4a2c1a_50%,#3d2415_100%)]",
                                        "data-[state=inactive]:text-[#d4af37] data-[state=inactive]:border data-[state=inactive]:border-[#6b4423]/40",
                                        // Hover state
                                        "hover:bg-[linear-gradient(135deg,#4a2c1a_0%,#5d3621_50%,#4a2c1a_100%)] hover:text-[#ffd700]",
                                        "hover:shadow-[0_4px_16px_rgba(212,175,55,0.2)]",
                                        !isNSEAvailable && '!cursor-not-allowed opacity-40 grayscale'
                                    )}
                                    value="nse"
                                    style={{
                                        border: "none",
                                        textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                                    }}
                                >
                                    <span className="relative z-10">NSE</span>
                                    {/* Subtle shimmer effect for active state */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-data-[state=active]:animate-pulse" />
                                </TabsTrigger>
                            )}
                            {isCryptoAllowed && (
                                <TabsTrigger
                                    className="
                    flex-1 h-11 text-[1rem] font-bold uppercase tracking-wide transition-all duration-300 rounded-[1.2rem] relative overflow-hidden
                    data-[state=active]:bg-[linear-gradient(135deg,#d4af37_0%,#ffd700_25%,#ffb347_75%,#cd853f_100%)]
                    data-[state=active]:text-[#1a0f0a] data-[state=active]:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]
                    data-[state=inactive]:bg-[linear-gradient(135deg,#3d2415_0%,#4a2c1a_50%,#3d2415_100%)]
                    data-[state=inactive]:text-[#d4af37] data-[state=inactive]:border data-[state=inactive]:border-[#6b4423]/40
                    hover:bg-[linear-gradient(135deg,#4a2c1a_0%,#5d3621_50%,#4a2c1a_100%)] hover:text-[#ffd700]
                    hover:shadow-[0_4px_16px_rgba(212,175,55,0.2)]
                "
                                    value="crypto"
                                    style={{
                                        border: "none",
                                        textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                                    }}
                                >
                                    <span className="relative z-10">Crypto</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-data-[state=active]:animate-pulse" />
                                </TabsTrigger>
                            )}
                            {isUSAMarketAllowed && (
                                <TabsTrigger
                                    className="
                    flex-1 h-11 text-[1rem] font-bold uppercase tracking-wide transition-all duration-300 rounded-[1.2rem] relative overflow-hidden
                    data-[state=active]:bg-[linear-gradient(135deg,#d4af37_0%,#ffd700_25%,#ffb347_75%,#cd853f_100%)]
                    data-[state=active]:text-[#1a0f0a] data-[state=active]:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]
                    data-[state=inactive]:bg-[linear-gradient(135deg,#3d2415_0%,#4a2c1a_50%,#3d2415_100%)]
                    data-[state=inactive]:text-[#d4af37] data-[state=inactive]:border data-[state=inactive]:border-[#6b4423]/40
                    hover:bg-[linear-gradient(135deg,#4a2c1a_0%,#5d3621_50%,#4a2c1a_100%)] hover:text-[#ffd700]
                    hover:shadow-[0_4px_16px_rgba(212,175,55,0.2)]
                "
                                    value="usa_market"
                                    style={{
                                        border: "none",
                                        textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                                    }}
                                >
                                    <span className="relative z-10">USA Market</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-data-[state=active]:animate-pulse" />
                                </TabsTrigger>
                            )}
                        </TabsList>
                    </Tabs>
                    {showCards && (
                    <div className="rounded-2xl ">
                        <div className="grid grid-cols-4 lg:grid-cols-8 md:gap-6 gap-2 justify-items-center">
                            {roundRecord.market.slice(0, 16).map((market, index) => (
                                <CardComponent
                                    key={index}
                                    market={market}
                                    index={index}
                                    gameState={gameState}
                                    cardsFlipped={cardsFlipped}
                                    handleCardClick={handleCardClick}
                                    roundRecord={roundRecord}
                                    getBetForCard={getBetForCard}
                                />
                            ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {previousRoundId && <GameResultDialog key={String(showResults)} open={showResults} roundRecordId={previousRoundId} />}
        </div>
    );
};

export default SinglePlayerRouletteGame;
const CardComponent = ({
    index,
    gameState,
    cardsFlipped,
    handleCardClick,
    roundRecord,
    getBetForCard
}: {
    market: MarketItem,
    index: number,
    gameState: any,
    cardsFlipped: boolean[],
    handleCardClick: (index: number) => void,
    roundRecord: RoundRecord,
    getBetForCard: (index: number) => any
}) => {
    const cardSuits = [
        { suit: '♠', name: 'Spades', color: 'text-black', marketIndex: 0, bgColor: 'bg-gradient-to-br from-gray-100 to-gray-200' },
        { suit: '♥', name: 'Hearts', color: 'text-red-500', marketIndex: 1, bgColor: 'bg-gradient-to-br from-red-50 to-red-100' },
        { suit: '♦', name: 'Diamonds', color: 'text-red-500', marketIndex: 2, bgColor: 'bg-gradient-to-br from-red-50 to-red-100' },
        { suit: '♣', name: 'Clubs', color: 'text-black', marketIndex: 3, bgColor: 'bg-gradient-to-br from-gray-100 to-gray-200' }
    ];

    const isFlipped = cardsFlipped[index];
    const isWinner = gameState.isPlaceOver && roundRecord.isHorseWinning(index + 1);
    const card = cardSuits[index % 4];
    const hasBet = getBetForCard(index);

    return (
        <div
            className={cn(
                "relative max-w-24 sm:max-w-28 md:max-w-32 w-full h-32 sm:h-36 md:h-44 perspective-1000 cursor-pointer transition-all duration-300 hover:scale-105",
                gameState.isPlaceOver && "cursor-not-allowed"
            )}
            onClick={() => handleCardClick(index)}
        >
            <div
                className={cn(
                    "relative w-full h-full transition-transform duration-700 transform-style-preserve-3d",
                    isFlipped && "rotate-y-180"
                )}
            >
                {/* Card Back */}
                <div className="absolute inset-0 backface-hidden rounded-xl bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 border-2 border-yellow-400 shadow-2xl">
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-4xl sm:text-5xl md:text-6xl text-yellow-400 opacity-80">🎰</div>
                    </div>
                    <div className="absolute inset-2 border border-yellow-400/30 rounded-lg"></div>
                </div>

                {/* Card Front */}
                <div className={cn(
                    "absolute inset-0 backface-hidden rotate-y-180 rounded-xl border-2 shadow-2xl transition-all duration-300",
                    card.bgColor,
                    hasBet && "border-yellow-400 shadow-yellow-400/50",
                    isWinner && "border-green-400 shadow-green-400/50",
                    !hasBet && !isWinner && "border-gray-300"
                )}>
                    <div className="w-full h-full flex flex-col items-center justify-center p-2 sm:p-3 md:p-4">
                        <div className={cn("text-4xl sm:text-5xl md:text-6xl mb-1 sm:mb-2", card.color)}>
                            {card.suit}
                        </div>

                        <div className="text-[10px] sm:text-xs text-gray-600 mt-1 sm:mt-2 text-center">
                            {roundRecord.market[index]?.codeName || `Stock ${index + 1}`}
                        </div>
                        <div className={cn("text-xs sm:text-sm font-bold text-center", card.color)}>
                            {roundRecord.market[index]?.name}
                        </div>
                    </div>

                    {/* Bet Chip */}
                    {hasBet && (
                        <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] sm:text-xs rounded-full w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center font-bold border-2 border-yellow-300 shadow-lg">
                            {hasBet.amount}
                        </div>
                    )}

                    {/* Winner Crown */}
                    {isWinner && (
                        <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2">
                            <div className="text-2xl sm:text-3xl">👑</div>
                        </div>
                    )}

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
            </div>
        </div>
    );
};
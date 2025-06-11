import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/context/auth-context';
import { useGameState, useIsPlaceOver, useShowResults } from '@/hooks/use-current-game';
import { useGameType } from '@/hooks/use-game-type';
import { useLeaderboard } from '@/hooks/use-leadboard';
import { cn } from '@/lib/utils';
import MarketItem, { SchedulerType } from '@/models/market-item';
import MiniMutualFundPlacement from '@/models/mini-mutual-fund';
import User from '@/models/user';
import { useCreateSinglePlayerRouletteBet, useGetCurrentRoundPlacements } from '@/react-query/game-record-queries';
import { useStockBettingStore } from '@/store/betting-store';
import { useSinglePlayerGameStore } from '@/store/single-player-game-store';
import { Clock, Play, Square, Triangle } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import GameResultDialog from '../../result-dialog';
import BetInputForm from './mini-mutual-fund-place';

const StockRouletteComponent = () => {
  const [tab, setTab] = useGameType();
  const { userDetails } = useAuthStore();

  // Game store integration
  const {
    roundRecord
  } = useSinglePlayerGameStore();
  const isPlaceOver = useIsPlaceOver(roundRecord ?? null);
  const gameState = useGameState(roundRecord ?? null);

  const { mutate, isPending: isPlacingBet } = useCreateSinglePlayerRouletteBet();
  const { data, isSuccess } = useGetCurrentRoundPlacements(roundRecord?.id!.toString());
  const { stocks } = useLeaderboard(roundRecord!);

  const stocksToPriceMap = useMemo(() => {
    const map = new Map<number, number>();
    stocks.forEach(stock => {
      if (stock.id && stock.price)
        map.set(stock.id, stock.price);
    });
    return map;
  }, [stocks]);

  const stocksToChangePercentMap = useMemo(() => {
    const map = new Map<number, number>();
    stocks.forEach(stock => {
      if (stock.id && stock.change_percent)
        map.set(stock.id, Number(stock.change_percent)!);
    });
    return map;
  }, [stocks]);

  const placements = useMemo<MiniMutualFundPlacement[]>(() => {
    return isSuccess ? data?.data.placements : [];
  }, [isSuccess, data]);

  const { betAmount, setIsLoading } = useStockBettingStore();
  const marketItems = roundRecord?.market ?? [];

  // Calculate total bets for a specific market item
  const calculateTotalBetsForMarket = (marketItemId: number): number => {
    return placements
      .filter(placement => placement.marketItem?.id === marketItemId)
      .reduce((total, placement) => total + (placement.amount ?? 0), 0);
  };

  // Handle bet placement
  const handlePlaceBet = (stock: MarketItem): void => {
    if (!stock || isPlaceOver || !roundRecord || isPlacingBet) return;

    setIsLoading(true);
    mutate(
      {
        roundId: roundRecord.id,
        amount: betAmount,
        market: stock.id,
      },
      {
        onSuccess: () => {
          setIsLoading(false);
        },
        onError: () => {
          setIsLoading(false);
        }
      }
    );
  };

  const currentUser = userDetails as User;

  const isNSEAllowed = !currentUser.isNotAllowedToPlaceOrder(SchedulerType.NSE);
  const isCryptoAllowed = !currentUser.isNotAllowedToPlaceOrder(SchedulerType.CRYPTO);
  const isUSAMarketAllowed = !currentUser.isNotAllowedToPlaceOrder(SchedulerType.USA_MARKET);
  const isNotAllowedToPlaceBet = currentUser.isNotAllowedToPlaceOrder(roundRecord?.type ?? SchedulerType.NSE);
  const { previousRoundId, showResults } = useShowResults(roundRecord, placements as any);

  // Get timer color based on time remaining
  const getTimerColor = () => {
    if (gameState.isGameOver) return 'text-gray-400';
    if (gameState.isPlaceOver) {
      const timeLeft = gameState.gameTimeLeft.seconds;
      if (timeLeft <= 10) return 'text-red-400';
      if (timeLeft <= 30) return 'text-yellow-400';
      return 'text-green-400';
    } else {
      const timeLeft = gameState.placeTimeLeft.seconds;
      if (timeLeft <= 10) return 'text-red-400';
      if (timeLeft <= 30) return 'text-yellow-400';
      return 'text-green-400';
    }
  };

  // Get phase indicator
  const getPhaseStatus = () => {
    if (gameState.isGameOver) return { text: "Round Complete", color: "text-gray-400", icon: Square };
    if (!gameState.isPlaceOver) return { text: "Betting Phase", color: "text-green-400", icon: Play };
    return { text: "Trading Period", color: "text-yellow-400", icon: Clock };
  };

  const phaseStatus = getPhaseStatus();

  if (!roundRecord) return null;

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full text-white flex flex-col">
        {/* Header with Glassmorphism */}
        <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50"></div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Mini Mutual Fund
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Enhanced Timer Display */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl rounded-2xl px-8 py-2">
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${phaseStatus.color} drop-shadow-sm`}>
                    {phaseStatus.text}
                  </span>
                </div>
                <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
                <div className="flex items-center gap-3">
                  <div className={`text-4xl font-bold font-mono tracking-wider ${getTimerColor()} drop-shadow-2xl`}>
                    {gameState.isGameOver
                      ? "00:00"
                      : gameState.isPlaceOver
                        ? gameState.gameTimeLeft.formatted
                        : gameState.placeTimeLeft.formatted
                    }
                  </div>
                </div>
              </div>

              {gameState.isGameOver && (
                <Link href={`/game/platform`}>
                  <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-red-500/25 backdrop-blur-sm border border-red-500/30">
                    Go to Platform
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className='flex gap-4 h-full'>
          <div className='border-r border-white/10 h-full'>

            {/* Enhanced Tabs with Glassmorphism */}
            <Tabs
              value={tab}
              onValueChange={(value) => setTab(value as SchedulerType)}
              className="bg-white/5 backdrop-blur-xl border-b border-white/10"
            >
              <TabsList className="w-full bg-transparent rounded-none h-auto p-2 flex gap-2">
                {isNSEAllowed && (
                  <TabsTrigger
                    disabled={isNotAllowedToPlaceBet}
                    className={cn(
                      "flex-1 py-2 px-8 transition-all duration-500 rounded-xl relative overflow-hidden backdrop-blur-sm",
                      "data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500/30 data-[state=active]:to-red-600/30",
                      "data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-red-500/20",
                      "data-[state=active]:border data-[state=active]:border-red-400/40",
                      "data-[state=inactive]:text-gray-300 data-[state=inactive]:bg-white/5",
                      "hover:text-white hover:bg-white/10 hover:shadow-lg",
                      "data-[state=inactive]:border data-[state=inactive]:border-white/10",
                      isNotAllowedToPlaceBet && "opacity-50 cursor-not-allowed"
                    )}
                    value="nse"
                  >
                    <div className="font-bold ">NSE</div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 data-[state=active]:opacity-100 transition-opacity duration-500"></div>
                  </TabsTrigger>
                )}
                {isCryptoAllowed && (
                  <TabsTrigger
                    className="flex-1 py-2 px-8 transition-all duration-500 rounded-xl relative overflow-hidden backdrop-blur-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500/30 data-[state=active]:to-red-600/30 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-red-500/20 data-[state=active]:border data-[state=active]:border-red-400/40 data-[state=inactive]:text-gray-300 data-[state=inactive]:bg-white/5 hover:text-white hover:bg-white/10 hover:shadow-lg data-[state=inactive]:border data-[state=inactive]:border-white/10"
                    value="crypto"
                  >
                    <div className="font-bold ">Crypto</div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 data-[state=active]:opacity-100 transition-opacity duration-500"></div>
                  </TabsTrigger>
                )}
                {isUSAMarketAllowed && (
                  <TabsTrigger
                    className="flex-1 py-2 px-8 transition-all duration-500 rounded-xl relative overflow-hidden backdrop-blur-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500/30 data-[state=active]:to-red-600/30 data-[state=active]:text-white data-[state=active]:shadow-xl data-[state=active]:shadow-red-500/20 data-[state=active]:border data-[state=active]:border-red-400/40 data-[state=inactive]:text-gray-300 data-[state=inactive]:bg-white/5 hover:text-white hover:bg-white/10 hover:shadow-lg data-[state=inactive]:border data-[state=inactive]:border-white/10"
                    value="usa_market"
                  >
                    <div className="font-bold ">USA Market</div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 data-[state=active]:opacity-100 transition-opacity duration-500"></div>
                  </TabsTrigger>
                )}
              </TabsList>
            </Tabs>

            {/* Stock Grid with Enhanced Glassmorphism */}
            <div className="flex-1 p-6  " >
              <div className="grid md:grid-cols-8 grid-cols-4 gap-4">
                {marketItems.slice(0, 16).map((stock, index) => {
                  const totalBets = calculateTotalBetsForMarket(stock.id ?? 0);
                  const price = stock.id ? stocksToPriceMap.get(stock.id) : null;
                  const changePercent = stock.id ? stocksToChangePercentMap.get(stock.id) : null;
                  const isPositive = changePercent ? changePercent > 0 : false;

                  // Alternate colors like roulette - red and green pattern
                  const isRed = index % 2 === 0;

                  return (
                    <button
                      key={stock.id}
                      onClick={() => handlePlaceBet(stock)}
                      disabled={gameState.isPlaceOver || gameState.isGameOver || isPlacingBet}
                      className={`
                    relative group h-16 rounded-2xl font-bold text-white transition-all duration-500
                    flex flex-col items-center justify-center p-4
                    border backdrop-blur-xl shadow-xl
                    ${isRed
                          ? 'bg-gradient-to-br from-red-500/30 via-red-600/20 to-red-700/30 border-red-400/40 hover:border-red-300/60'
                          : 'bg-gradient-to-br from-green-500/30 via-green-600/20 to-green-700/30 border-green-400/40 hover:border-green-300/60'
                        }
                    ${!gameState.isPlaceOver && !gameState.isGameOver && !isPlacingBet
                          ? 'hover:shadow-2xl hover:shadow-red-500/20 hover:scale-105 cursor-pointer transform hover:bg-white/5'
                          : 'opacity-100 cursor-not-allowed'
                        }
                  `}
                    >
                      {/* Price Change Triangle */}
                      {Number(changePercent ?? 0) > 0 && (
                        <Triangle
                          size={10}
                          className={cn(
                            "absolute top-2 right-2 drop-shadow-sm",
                            isPositive ? "text-white/80 fill-white/80" : "text-white/80 fill-white/80 rotate-180"
                          )}
                        />
                      )}

                      {/* Stock Info */}
                      <div className="text-center">
                        <div className="text-white text-sm text-left line-clamp-2  font-black mb-1   drop-shadow-sm">
                          {stock.name}
                        </div>
                        {price && (
                          <div className="text-white/90 text-xs drop-shadow-sm">
                            {roundRecord.type === SchedulerType.CRYPTO ? "USDT " : stock.currency}
                            {price}
                          </div>
                        )}
                      </div>

                      {/* Poker Chip Style Bet Amount */}
                      {totalBets > 0 && (
                        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center text-xs font-bold shadow-xl border-2 border-dashed border-amber-300 backdrop-blur-sm">
                          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center">
                            <span className="text-black font-extrabold text-xs">{totalBets}</span>
                          </div>
                          {/* Poker chip segments */}
                          <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-700/30"></div>
                          <div className="absolute top-0 left-1/2 w-px h-2 bg-amber-700/40 transform -translate-x-1/2"></div>
                          <div className="absolute bottom-0 left-1/2 w-px h-2 bg-amber-700/40 transform -translate-x-1/2"></div>
                          <div className="absolute left-0 top-1/2 w-2 h-px bg-amber-700/40 transform -translate-y-1/2"></div>
                          <div className="absolute right-0 top-1/2 w-2 h-px bg-amber-700/40 transform -translate-y-1/2"></div>
                        </div>
                      )}

                      {/* Glass Shine Effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Subtle Inner Glow */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-transparent"></div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <BetInputForm />
        </div>

        {previousRoundId && (
          <GameResultDialog
            key={String(showResults)}
            open={showResults}
            roundRecordId={previousRoundId}
          />
        )}
      </div>
    </div>
  );
};

export default StockRouletteComponent;
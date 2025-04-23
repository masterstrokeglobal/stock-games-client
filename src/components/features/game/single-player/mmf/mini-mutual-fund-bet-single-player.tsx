import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/context/auth-context';
import { useGameState, useIsPlaceOver } from '@/hooks/use-current-game';
import { useGameType } from '@/hooks/use-game-type';
import { useLeaderboard } from '@/hooks/use-leadboard';
import { cn } from '@/lib/utils';
import MarketItem, { SchedulerType } from '@/models/market-item';
import MiniMutualFundPlacement from '@/models/mini-mutual-fund';
import User from '@/models/user';
import { useCreateSinglePlayerRouletteBet } from '@/react-query/game-record-queries';
import { useGetMiniMutualFundCurrentUserPlacements } from '@/react-query/lobby-query';
import { useStockBettingStore } from '@/store/betting-store';
import { useGameStore } from "@/store/game-store";
import { useSinglePlayerGameStore } from '@/store/single-player-game-store';
import { Triangle } from 'lucide-react';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { CurrentGameState } from '../../contants';

const StockSelectionGridSinglePlayer: React.FC = () => {
  const [tab, setTab] = useGameType();
  const { userDetails } = useAuthStore();

  // Game store integration
  const {
    roundRecord
  } = useSinglePlayerGameStore();
  const isPlaceOver = useIsPlaceOver(roundRecord ?? null);
  const gameState = useGameState(roundRecord ?? null);


  const { mutate, isPending: isPlacingBet } = useCreateSinglePlayerRouletteBet();
  const { data, isSuccess } = useGetMiniMutualFundCurrentUserPlacements(roundRecord?.id);
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
    return isSuccess ? data.placements : [];
  }, [isSuccess, data]);

  const moneyLeft = useMemo(() => {
    return isSuccess ? data?.totalMoneyLeft : "-";
  }, [isSuccess, data?.totalMoneyLeft,]);


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
    if (!stock || isPlaceOver || !roundRecord) return;

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


  if (!roundRecord) return null;

  return (
    <div className="w-full flex-1 mb-6 h-full ">
      <ScrollArea
        type="auto"
        className="h-full w-full"
      >
        <GameHeader gameState={gameState} moneyLeft={moneyLeft} className='lg:flex items-center px-4 justify-between lg:flex-row' />
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as SchedulerType)}
          className="w-full relative z-10"
        >
          <TabsList className="w-full hidden lg:flex  bg-tertiary ">
            {isNSEAllowed && (
              <TabsTrigger disabled={isNotAllowedToPlaceBet} className={cn("flex-1 h-8", isNotAllowedToPlaceBet && '!cursor-not-allowed')} value="nse">NSE</TabsTrigger>
            )}
            {isCryptoAllowed && (
              <TabsTrigger className="flex-1 h-8" value="crypto">Crypto</TabsTrigger>
            )}
            {isUSAMarketAllowed && (
              <TabsTrigger className="flex-1 h-8" value="usa_market">USA Market</TabsTrigger>
            )}
          </TabsList>
        </Tabs>
        <div className="grid sm:grid-cols-4 grid-cols-2 gap-4 p-4">
          {marketItems.map((stock) => (
            <div
              key={stock.id}
              onClick={() => handlePlaceBet(stock)}
              className={`
              relative flex flex-col items-center justify-center 
              w-full h-14 bg-[#1A2D58] p-3 rounded-lg 
              cursor-pointer transition-all 
              ${isPlaceOver ? 'opacity-70 cursor-not-allowed' : ''}
            `}
            >
              <div className="text-white  text-sm  font-bold">{stock.name}</div>
              <div className="text-sm text-gray-300">
                {stock.id && stocksToPriceMap.get(stock.id) && <>
                  {roundRecord.type == SchedulerType.CRYPTO ? "USDT " : "Rs."}
                  {stocksToPriceMap.get(stock.id)}</>}
              </div>
              {/* Total Bets Coin */}
              {(stock.id && calculateTotalBetsForMarket(stock.id) > 0) && <div
                className="
                absolute top-1/2 right-2  -translate-y-1/2
                w-8 h-8 rounded-full 
                bg-red-600 text-white 
                flex items-center justify-center 
                text-xs font-bold
              "
              >
                {stock.id && calculateTotalBetsForMarket(stock.id)}
              </div>}

              {stock.id && <Triangle size={20} className='size-3 top-2 left-2 absolute' style={{
                transform: `rotate(${stocksToChangePercentMap.get(stock.id)! > 0 ? '0deg' : '180deg'})`,
                color: stocksToChangePercentMap.get(stock.id)! > 0 ? 'green' : 'red',
                fill: stocksToChangePercentMap.get(stock.id)! > 0 ? 'green' : 'red'
              }} />}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default StockSelectionGridSinglePlayer;


interface GameHeaderProps {
  gameState: CurrentGameState;
  className?: string;
  moneyLeft: string;
}


export const GameHeader: React.FC<GameHeaderProps> = ({ gameState, moneyLeft, className }) => {

  const { lobby } = useGameStore();
  const getMessage = () => {
    if (gameState.isGameOver) {
      return "Game Over";
    }
    return gameState.isPlaceOver ? "Game ends in" : "Round starts in";
  };

  const getTime = () => {
    if (gameState.isGameOver) {
      return "00:00";
    }
    return gameState.isPlaceOver
      ? gameState.gameTimeLeft.formatted
      : gameState.placeTimeLeft.formatted;
  };

  return (
    <header className={cn(' hidden lg:block my-2 text-white', className)}>
      <div>
        <h2 className="text-lg font-semibold ">
          Mini Mutual Fund
        </h2>
        <p className="font-semibold text-gray-">
          {getMessage()}

        </p>
      </div>

      {!gameState.isGameOver ? <p className='text-7xl jersey leading-[5rem]'>
        {getTime()}
      </p> : <Link href={`/game/platform`}><Button variant="game">Go to Platform</Button></Link>}
    </header>
  );
};
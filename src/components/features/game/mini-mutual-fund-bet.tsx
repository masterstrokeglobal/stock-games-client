import { Button } from '@/components/ui/button';
import { useGameState, useIsPlaceOver } from '@/hooks/use-current-game';
import { useLeaderboard } from '@/hooks/use-leadboard';
import { cn } from '@/lib/utils';
import MarketItem, { SchedulerType } from '@/models/market-item';
import MiniMutualFundPlacement from '@/models/mini-mutual-fund';
import { useCreateMiniMutualFundPlacementBet } from '@/react-query/game-record-queries';
import { useGetMiniMutualFundCurrentUserPlacements } from '@/react-query/lobby-query';
import { useStockBettingStore } from '@/store/betting-store';
import { useGameStore } from "@/store/game-store";
import { Triangle } from 'lucide-react';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { CurrentGameState } from './contants';

const StockSelectionGrid: React.FC = () => {
  const { lobbyRound } = useGameStore();
  const isPlaceOver = useIsPlaceOver(lobbyRound?.roundRecord ?? null);
  const gameState = useGameState(lobbyRound?.roundRecord ?? null);


  const { mutate } = useCreateMiniMutualFundPlacementBet();
  const { data, isSuccess } = useGetMiniMutualFundCurrentUserPlacements(lobbyRound?.id);

  const { stocks } = useLeaderboard(lobbyRound!.roundRecord!);

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
  const marketItems = lobbyRound?.roundRecord?.market ?? [];

  // Calculate total bets for a specific market item
  const calculateTotalBetsForMarket = (marketItemId: number): number => {
    return placements
      .filter(placement => placement.marketItem?.id === marketItemId)
      .reduce((total, placement) => total + (placement.amount ?? 0), 0);
  };

  const changePercent = (marketItemId: number): number => {
    const stock = stocks.find(stock => stock.id === marketItemId);
    if (!stock) return 0;
    return parseInt(stock.change_percent);
  };
  // Handle bet placement
  const handlePlaceBet = (stock: MarketItem): void => {
    if (!stock || isPlaceOver) return;

    setIsLoading(true);
    mutate(
      {
        marketItemId: stock.id,
        lobbyRoundId: lobbyRound!.id,
        amount: betAmount,
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


  if (!lobbyRound?.roundRecord) return null;

  return (
    <div className="w-full mb-6">
      <GameHeader gameState={gameState} moneyLeft={moneyLeft} className='lg:flex items-center px-4 justify-between lg:flex-row' />

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
                {lobbyRound.roundRecord?.type == SchedulerType.CRYPTO ? "USDT " : "Rs."}
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
    </div>
  );
};

export default StockSelectionGrid;


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
        <h2 className="text-lg font-semibold text-gray-">
          {getMessage()}
        </h2>
        <p className="font-semibold text-gray-">
          Money Left:  Rs.{moneyLeft}
        </p>
      </div>

      {!gameState.isGameOver ? <p className='text-7xl jersey leading-[5rem]'>
        {getTime()}
      </p> : <Link href={`/game/lobby/${lobby?.joiningCode}`}><Button variant="game">Go to Lobby</Button></Link>}
    </header>
  );
};
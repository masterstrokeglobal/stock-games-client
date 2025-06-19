import { cn, INR } from '@/lib/utils';
import { HeadTailPlacementType } from '@/models/head-tail';
import { RoundRecord } from '@/models/round-record';
import { useCreateHeadTailPlacement, useGetMyCurrentRoundHeadTailPlacement } from '@/react-query/head-tail-queries';
import { useLeaderboard } from '@/hooks/use-sevenup-leader-board';
import { StockPrice } from './stock-price';
import TimeDisplay from '@/components/common/bet-locked-banner';
import { useMemo } from 'react';


type Props = {
  roundRecord: RoundRecord;
  amount: number;
  className?: string;
  children?: React.ReactNode;
  roundRecordWithWinningSide: RoundRecord | null;
}

export default function CoinFlipGame({ roundRecord, amount, className, roundRecordWithWinningSide }: Props) {

  const winningSide = roundRecordWithWinningSide?.winningSide ?? null;
  const { mutate: createHeadTailPlacement, isPending } = useCreateHeadTailPlacement();
  const { stocks } = useLeaderboard(roundRecord);

  const { data: placements } = useGetMyCurrentRoundHeadTailPlacement(roundRecord.id);

  const handleCardClick = (side: HeadTailPlacementType) => {
    if (isPending) return;
    createHeadTailPlacement({ roundId: roundRecord.id, placement: side, amount })
  };

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

  
  const headStock=  useMemo(() => roundRecordWithWinningSide?.finalPricesPresent ? roundRecordWithWinningSide.sortedMarketItems?.find((item) => item.id === roundRecord.coinTossPair?.head?.id) : stocks.find((item) => item.id === roundRecord.coinTossPair?.head?.id), [stocks, roundRecord.coinTossPair?.head?.id, roundRecordWithWinningSide]);
  const tailStock=  useMemo(() => roundRecordWithWinningSide?.finalPricesPresent ? roundRecordWithWinningSide.sortedMarketItems?.find((item) => item.id === roundRecord.coinTossPair?.tail?.id) : stocks.find((item) => item.id === roundRecord.coinTossPair?.tail?.id), [stocks, roundRecord.coinTossPair?.tail?.id, roundRecordWithWinningSide]);
  
  const winningStock = roundRecordWithWinningSide?.finalPricesPresent ? roundRecordWithWinningSide.sortedMarketItems?.[0] : stocks.sort((a, b) => parseFloat(b.change_percent) - parseFloat(a.change_percent))[0];


  return (
    <div className={cn("flex flex-col items-center justify-center w-full h-full bg-amber-800 p-4 md:pt-20 pt-32 rounded-lg bg-center relative", className)}>
      <div className='grid sm:grid-cols-3 grid-cols-2 w-full z-10 absolute top-0 left-0'>

        {headStock && <StockPrice key={headStock.id}  rankedMarketItem={headStock} winning={ winningSide ? winningSide === HeadTailPlacementType.HEAD : winningStock?.id === headStock?.id} />}
        <TimeDisplay className='col-span-2 sm:col-span-1 sm:order-none order-last' roundRecord={roundRecord} />
        {tailStock && <StockPrice key={tailStock.id} rankedMarketItem={tailStock} winning={ winningSide ? winningSide === HeadTailPlacementType.TAIL : winningStock?.id === tailStock?.id} />}

      </div>
      <img src="/images/wodden-board.jpg" alt="wodden-board" className="w-full h-full object-fill absolute top-0 left-0 z-0" />
      <div className="flex w-full max-w-md gap-4 p-4">
        {/* HEAD CARD */}
        <div className="w-1/2 relative">
          {/* Poker Chip Badge */}
          {hasHeadBet && (
            <div className="absolute -top-3 -left-3 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 aspect-square z-20 border-3 border-dashed border-amber-800 rounded-full p-2 flex justify-center items-center text-[10px] text-center w-10 h-10 shadow-[0_4px_12px_rgba(217,119,6,0.6)] ring-2 ring-yellow-300 ring-opacity-50">
              <span className="font-bold text-amber-900 drop-shadow-sm">{myHeadAmount}</span>
            </div>
          )}

          <div
            className={cn(
              "min-h-64 z-10 rounded-md flex flex-col cursor-pointer transition-all duration-300",
              isPending ? 'opacity-70 pointer-events-none' : 'hover:shadow-lg hover:scale-105',
              hasHeadBet ? "border-4 rounded-lg border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)]" : "",
              winningSide === HeadTailPlacementType.HEAD ? 'border-4 border-amber-400 animate-pulse shadow-[0_0_20px_rgba(251,191,36,0.8)]' : ''
            )}
            onClick={() => handleCardClick(HeadTailPlacementType.HEAD)}
          >
            <div className="bg-blue-600 rounded-t-md p-3 text-center">
              <span className="text-white text-2xl font-bold">HEAD</span>
            </div>

            <div className="bg-amber-100 flex-1 rounded-b-md flex flex-col items-center justify-start px-4 pb-4 relative">
              <div className="flex flex-col gap-2 text-black text-sm font-semibold">
                {roundRecord.coinTossPair?.head?.name}
              </div>
              <div className="w-20 h-20 rounded-full flex items-center justify-center">
                <img src="/images/coin-face/head.png" alt="head" className="w-full h-full object-fill" />
              </div>
              <div className="mt-4 text-amber-900 font-bold">1:2</div>

              {/* Stats Container */}
              <div className="absolute bottom-0 left-0 right-0 bg-amber-50 bg-opacity-80 p-2 rounded-b-md">
                <div className="flex justify-between items-center px-2">
                  <div className="text-xs font-semibold text-amber-900">
                    <span>Your Bet:</span>
                    <span className="block font-bold">{INR(myHeadAmount)}</span>
                  </div>
                  <div className="text-xs font-semibold text-amber-900">
                    <span>Win:</span>
                    <span className="block font-bold">{INR(myHeadAmount * 2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TAIL CARD */}
        <div className="w-1/2 relative">
          {/* Poker Chip Badge */}
          {hasTailBet && (
            <div className="absolute -top-3 -left-3 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 aspect-square z-20 border-3 border-dashed border-amber-800 rounded-full p-2 flex justify-center items-center text-[10px] text-center w-10 h-10 shadow-[0_4px_12px_rgba(217,119,6,0.6)] ring-2 ring-yellow-300 ring-opacity-50">
              <span className="font-bold text-amber-900 drop-shadow-sm">{myTailAmount}</span>
            </div>
          )}

          <div
            className={cn(
              "min-h-64 z-10 rounded-md flex flex-col cursor-pointer transition-all duration-300",
              isPending ? 'opacity-70 pointer-events-none' : 'hover:shadow-lg hover:scale-105',
              hasTailBet ? "border-4 rounded-lg border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)]" : "",

              winningSide === HeadTailPlacementType.TAIL ? 'border-4 animate-pulse  border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)]' : ''
            )}
            onClick={() => handleCardClick(HeadTailPlacementType.TAIL)}
          >
            <div className="bg-slate-600 rounded-t-md p-3 text-center">
              <span className="text-white text-2xl font-bold">TAIL</span>
            </div>
            <div className="bg-amber-100 flex-1 rounded-b-md flex flex-col items-center justify-start px-4 pb-4 relative">
              <div className="flex flex-col gap-2 text-black text-sm font-semibold">
                {roundRecord.coinTossPair?.tail?.name}
              </div>
              <div className="w-20 h-20 rounded-full flex items-center justify-center">
                <img src="/images/coin-face/tail.png" alt="tail" className="w-full h-full object-fill" />
              </div>
              <div className="mt-4 text-amber-900 font-bold">1:2</div>

              {/* Stats Container */}
              <div className="absolute bottom-0 left-0 right-0 w-full bg-amber-50 bg-opacity-80 p-2 rounded-b-md">
                <div className="flex justify-between items-center px-2">
                  <div className="text-xs font-semibold text-amber-900">
                    <span>Your Bet:</span>
                    <span className="block font-bold">{INR(myTailAmount)}</span>
                  </div>
                  <div className="text-xs font-semibold text-amber-900">
                    <span>Win:</span>
                    <span className="block font-bold">{INR(myTailAmount * 2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
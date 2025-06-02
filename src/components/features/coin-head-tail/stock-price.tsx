import { usePlacementOver } from '@/hooks/use-current-game';
import { RankedMarketItem, useLeaderboard } from '@/hooks/use-leadboard';
import { cn } from '@/lib/utils';
import { HeadTailPlacementType } from '@/models/head-tail';
import { RoundRecord } from '@/models/round-record';
import { ArrowUpIcon } from "@radix-ui/react-icons";
import React from 'react';

interface StockPriceProps {
  rankedMarketItem: RankedMarketItem;
}

const StockPrice: React.FC<StockPriceProps> = ({ rankedMarketItem }) => {

  if (rankedMarketItem == null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-black flex text-xs flex-row  justify-between px-4 items-center gap-2 p-2">
      <div className="flex flex-col gap-2">
        <span>{rankedMarketItem.name}</span>
        <span>Price: <b>
          {rankedMarketItem.initialPrice}
        </b></span>
      </div>
      <div className="flex flex-col gap-2">
        <span className='t'>Current Price:<b>
          {rankedMarketItem.price}
        </b>
        </span>
        <div className={cn("flex gap-2", parseFloat(rankedMarketItem.change_percent) > 0 ? 'text-green-500' : 'text-red-500')} >
          <ArrowUpIcon className={cn(parseFloat(rankedMarketItem.change_percent) > 0 ? 'text-green-500' : 'text-red-500 rotate-180')} />
          <span> {rankedMarketItem.change_percent} %</span>
        </div>
      </div>
    </div>
  );
};

export const StockPriceDisplay: React.FC<{ roundRecord: RoundRecord, winningSide: HeadTailPlacementType | null }> = ({ roundRecord, winningSide }) => {
  const { stocks } = useLeaderboard(roundRecord);

  const isPlaceOver = usePlacementOver(roundRecord);
  const isFlipping = isPlaceOver;

  console.log(isFlipping,winningSide)

  return (
    <div className="flex flex-col justify-center items-start bg-red-500">
      <div className="w-full grid grid-cols-2 ">
        {stocks.map((stock) => (
            <StockPrice key={stock.id} rankedMarketItem={stock} />
          ))}
      </div>
      <div className='h-32 w-full bg-white'>
        <CoinFlipVideo isFlipping={isFlipping} resultOutcome={winningSide ?? undefined} />
      </div>
    </div>
  );
};

const CoinFlipVideo = ({ isFlipping, resultOutcome }: { isFlipping: boolean, resultOutcome?: HeadTailPlacementType }) => {
  const headRef = React.useRef<HTMLVideoElement>(null);
  const tailRef = React.useRef<HTMLVideoElement>(null);
  const tossRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (resultOutcome === HeadTailPlacementType.HEAD && headRef.current) {
      headRef.current.play();
    }
    if (resultOutcome === HeadTailPlacementType.TAIL && tailRef.current) {
      tailRef.current.play();
    }
    if (isFlipping && tossRef.current) {
      tossRef.current.play();
    }
  }, [isFlipping, resultOutcome]);


  return (
    <div className="relative w-full h-full">
      <video
        ref={headRef}
        src="/videos/head.webm"
        muted
        loop
        className={`absolute inset-0 bg-transparent  w-full h-full ${resultOutcome === HeadTailPlacementType.HEAD ? 'opacity-100' : 'opacity-0'}`}
      />
      <video
        ref={tailRef}
        src="/videos/tail.webm"
        muted
        loop
        className={`absolute inset-0 bg-transparent  w-full h-full ${resultOutcome === HeadTailPlacementType.TAIL ? 'opacity-100' : 'opacity-0'}`}
      />
      <video
        ref={tossRef}
        src="/videos/toss.webm"
        muted
        loop={false}
        className={`absolute inset-0 bg-transparent  w-full h-full ${resultOutcome == null ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

import { useIsPlaceOver } from '@/hooks/use-current-game';
import { RankedMarketItem } from '@/hooks/use-leadboard';
import { cn } from '@/lib/utils';
import { HeadTailPlacementType } from '@/models/head-tail';
import { RoundRecord } from '@/models/round-record';
import { ArrowUpIcon } from "@radix-ui/react-icons";
import React from 'react';

interface StockPriceProps {
  rankedMarketItem: RankedMarketItem;
  winning:boolean;
}

export const StockPrice: React.FC<StockPriceProps> = ({ rankedMarketItem, winning }) => {

  if (rankedMarketItem == null) {
    return <div>Loading...</div>;
  }

  return (
    <div className={cn("bg-red-500 flex text-xs flex-row rounded-b-xl  justify-between px-4 items-center gap-2 p-2", winning && "bg-green-500")}>
      <div className="flex flex-col gap-2">
        <span>{rankedMarketItem.name}</span>
        <span>Price: <b>
          {rankedMarketItem.initialPrice}
        </b></span>
      </div>
      <div className="flex flex-col gap-2">
        <span className='text-white'>Current Price:<b>
          {rankedMarketItem.price}
        </b>
        </span>
        <div className={cn("flex gap-2", parseFloat(rankedMarketItem.change_percent) > 0 ? 'text-white' : 'text-white')} >
          <ArrowUpIcon className={cn(parseFloat(rankedMarketItem.change_percent) > 0 ? 'text-white' : 'text-white rotate-180')} />
          <span> {parseFloat(rankedMarketItem.change_percent ?? "0").toFixed(6)} %</span>
        </div>
      </div>
    </div>
  );
};

export const StockPriceDisplay: React.FC<{ roundRecord: RoundRecord, winningSide: HeadTailPlacementType | null }> = ({ roundRecord, winningSide }) => {

  const isPlaceOver = useIsPlaceOver(roundRecord);

  return (
    <div className="flex flex-col justify-center  bg-[url('/images/coin-face/wodenboard.jpeg')] bg-cover items-start ">
    
      <div className='sm:h-64 h-52 w-full'>
        <CoinFlipVideo isFlipping={isPlaceOver} resultOutcome={winningSide ?? undefined} />
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
    if (isFlipping && resultOutcome == undefined && tossRef.current) {
      tossRef.current.pause();
      tossRef.current.currentTime = 0;
      tossRef.current.play();
    }
  }, [isFlipping, resultOutcome]);


  return (
    <div className="relative w-full h-full bg-cover bg-center">
      <video
        ref={headRef}
        src="/videos/head.webm"
        muted
        loop={false}
        className={`absolute left-1/2 -translate-x-1/2 bg-transparent  w-3/4 h-fit ${resultOutcome === HeadTailPlacementType.HEAD ? 'opacity-100' : 'opacity-0'}`}
      />
      <video
        ref={tailRef}
        src="/videos/tail.webm"
        muted
        loop={false}
        className={`absolute inset-0 left-1/2 -translate-x-1/2 bg-transparent  w-3/4 h-fit ${resultOutcome === HeadTailPlacementType.TAIL ? 'opacity-100' : 'opacity-0'}`}
      />
      <video
        ref={tossRef}
        src="/videos/toss.webm"
        muted
        loop={false}
        className={`absolute left-1/2 -translate-x-1/2 bg-transparent  w-3/4 h-fit ${resultOutcome == undefined ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

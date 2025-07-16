import { RankedMarketItem, useLeaderboard } from '@/hooks/use-leadboard';
import { cn } from '@/lib/utils';
import { RoundRecord, WHEEL_COLOR_CONFIG } from '@/models/round-record';
import { WheelColor } from '@/models/wheel-of-fortune-placement';
import { useCreateWheelOfFortunePlacement } from '@/react-query/wheel-of-fortune-queries';
import { useMemo } from 'react';
import TriangleDownGlow from '../common/triangle-down-glow';
import TriangleUpGlow from '../common/triangle-up-glow';

// Color configuration mapping

type Props = {
  roundRecord: RoundRecord;
  amount: number;
  className?: string;
  children?: React.ReactNode;
  roundRecordWithWinningId: RoundRecord | null;
}


export const colorConfig: { color: WheelColor, bgColor: string, borderColor: string, textColor: string }[] = [
  {
      color: WheelColor.COLOR5,
      bgColor: 'linear-gradient(341.3deg, rgba(141, 96, 24, 0.273) 1.58%, rgba(255, 162, 0, 0.56) 97.92%)',
    borderColor: '#FFC857',
    textColor: '#FFC857',
  },

  {
    color: WheelColor.COLOR4,
    bgColor: 'linear-gradient(341.3deg, rgba(94, 4, 179, 0.28) 1.58%, rgba(132, 0, 183, 0.7) 97.92%)',
    borderColor: '#CD71FF',
    textColor: '#CD71FF',
  },
  {
    color: WheelColor.COLOR3,
    bgColor: 'linear-gradient(341.3deg, rgba(1, 103, 182, 0.273) 1.58%, rgba(0, 129, 229, 0.7) 97.92%)',
    borderColor: '#0076FF',
    textColor: '#0076FF',
  },
  {
    color: WheelColor.COLOR2,
    bgColor: 'linear-gradient(341.3deg, rgba(0, 163, 10, 0.273) 1.58%, rgba(0, 164, 10, 0.7) 97.92%)',
    borderColor: '#0ED700',
    textColor: '#0ED700',
  },
  {   
    color: WheelColor.COLOR1,
    bgColor: 'linear-gradient(341.3deg, rgba(209, 2, 20, 0.273) 1.58%, rgba(239, 0, 20, 0.7) 97.92%)',
    borderColor: '#FF0909  ',
    textColor: '#FF0909',
  },
]

export default function WheelOfFortuneGameBoard({ roundRecord, amount, className, children, roundRecordWithWinningId }: Props) {

  const { stocks } = useLeaderboard(roundRecord);
  const { mutate: createWheelPlacement, isPending } = useCreateWheelOfFortunePlacement();
  // const { data: placements } = useGetMyCurrentRoundWheelOfFortunePlacement(roundRecord.id);

  const winningId = roundRecordWithWinningId?.winningId || null;

  const marketItemsStocks = useMemo(() => {
    const marketItems = roundRecord.market;
    return marketItems.map((item) => {
      const stock = roundRecordWithWinningId?.finalPricesPresent ? roundRecordWithWinningId.sortedMarketItems?.find((stock) => stock.id === item.id) : stocks.find((stock) => stock.id === item.id);
      return stock;
    }).filter((stock): stock is RankedMarketItem => stock !== undefined);
  }, [roundRecord, stocks, roundRecordWithWinningId]);


  const handleColorClick = (color: WheelColor) => {
    if (isPending) return;
    createWheelPlacement({ roundId: roundRecord.id, placementColor: color, amount });
  };

  // Calculate total bets for each color
  // const colorBets: Record<WheelColor, number> | undefined = placements?.reduce((acc, placement) => {
  //   if (!acc[placement.placementColor]) {
  //     acc[placement.placementColor] = 0;
  //   }
  //   acc[placement.placementColor] += placement.amount;
  //   return acc;
  // }, {} as Record<WheelColor, number>);


  const winningColor = useMemo(() => {
    if (!winningId) return null;
    const market = roundRecord.getColorByMarketId(winningId[0] as unknown as number);
    return market || null;
  }, [winningId, roundRecord]);


  return (
      <div className={cn("flex items-center justify-between w-full h-full  bg-center relative", className)}>
      {children}
      {/* Color Cards Grid */}
      <div className="  flex flex-wrap gap-2 justify-center w-full">
          <ColorCard color={WheelColor.COLOR5} winningColor={winningColor} isPending={isPending} roundRecord={roundRecord} handleColorClick={handleColorClick} marketItemsStocks={marketItemsStocks} />
          <ColorCard color={WheelColor.COLOR4} winningColor={winningColor} isPending={isPending} roundRecord={roundRecord} handleColorClick={handleColorClick} marketItemsStocks={marketItemsStocks} />
          <ColorCard color={WheelColor.COLOR3} winningColor={winningColor} isPending={isPending} roundRecord={roundRecord} handleColorClick={handleColorClick} marketItemsStocks={marketItemsStocks} />
          <ColorCard color={WheelColor.COLOR2} winningColor={winningColor} isPending={isPending} roundRecord={roundRecord} handleColorClick={handleColorClick} marketItemsStocks={marketItemsStocks} />
          <ColorCard color={WheelColor.COLOR1} winningColor={winningColor} isPending={isPending} roundRecord={roundRecord} handleColorClick={handleColorClick} marketItemsStocks={marketItemsStocks} />
      </div>
    </div>
  );
}
const ColorCard = ({ color, winningColor, isPending, handleColorClick, roundRecord, marketItemsStocks }: { color: WheelColor, winningColor: WheelColor | null, isPending: boolean, roundRecord: RoundRecord, handleColorClick: (color: WheelColor) => void, marketItemsStocks: RankedMarketItem[] }) => {
  const config = WHEEL_COLOR_CONFIG[color];
  const currentColorConfig = colorConfig.find(c => c.color === color);
  // const myBetAmount = colorBets?.[color] || 0;
  const isWinner = winningColor === color;

  // Get the top performing stock from marketItemsStocks
  const topStock = marketItemsStocks.sort((a, b) => (b?.change_percent == undefined ? -100 : parseFloat(b?.change_percent)) - (a?.change_percent == undefined ? -100 : parseFloat(a?.change_percent)))[0];

  return (
    <div
      style={{
        background: currentColorConfig?.bgColor,
        border: `2px solid ${currentColorConfig?.borderColor}`,
        color: currentColorConfig?.textColor,
      }}
      className={cn(
        "z-10 rounded-lg min-w-52 flex-1 flex flex-col cursor-pointer transition-all duration-300 relative group",
        isPending ? 'opacity-70 pointer-events-none' : 'hover:shadow-lg',
        isWinner ? `border-2 ${config.borderColor} border-dashed border-amber-700 shadow-custom-glow animate-pulse` : ''
      )}

      onClick={() => handleColorClick(color)}
    >
      <div className="h-full flex-1 flex flex-col">
        <div style={{color: 'white', textShadow: `0px 0px 40px ${currentColorConfig?.borderColor}, 0px 0px 20px ${currentColorConfig?.borderColor}`}} className={cn("rounded-t-lg px-2 py-3 font-konkhmer-sleokchher tracking-wider text-white  flex justify-center gap-2 items-center text-center w-full")}>
          <span className="text-lg ">{config.name}</span>
          <div>
            1:{config.multiplier}
          </div>
        </div>
          <div style={{background: currentColorConfig?.borderColor}} className='w-3/4 h-0.5  mx-auto ' />
        <div className={cn("flex-1 rounded-b-lg flex flex-col items-center justify-start relative w-full")}>
          <ul className="gap-1 w-full py-4">
            {roundRecord.getMarketsByColor(color).map((market, index) => {
              const stock = marketItemsStocks.find(s => s.id === market.id);
              const isTopStock = stock?.id === topStock?.id;
              const changePercent = Number(stock?.change_percent) || 0;
              const isPositive = changePercent > 0;

              return (
                <li
                  key={market.id}
                  className={cn(
                    "text-sm  tracking-wider py-1 text-white  px-2 flex items-center justify-between  gap-2",
                    isTopStock && "bg-amber-300/80 border border-amber-400  px-2"
                  )}
                >
                  <span className='text-xs whitespace-nowrap truncate line-clamp-1 block flex-1'>{index + 1}. {market.name?.slice(0, 17)}</span>
                  <span className={cn(
                    "flex items-center gap-1 text-xs font-bold",
                    isPositive ? "text-green-600" : "text-red-600"
                  )}>
                    {isPositive ? <TriangleUpGlow className='size-5' /> : <TriangleDownGlow className='size-5 font-montserrat' />} {changePercent.toFixed(5)}%
                  </span>
                </li>
              );
            })}
          </ul>

          {/* <div className="w-full mt-auto p-2 rounded-b-lg">
            <div className="flex flex-col items-center">
              <div  style={{color: currentColorConfig?.textColor}} className="text-lg font-semibold font-konkhmer-sleokchher flex items-center gap-1 text-center">
                <span className="font-bold">{INR(myBetAmount * config.multiplier)}</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};


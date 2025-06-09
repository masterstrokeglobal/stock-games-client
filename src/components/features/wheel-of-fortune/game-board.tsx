import { cn, INR } from '@/lib/utils';
import { RoundRecord, WHEEL_COLOR_CONFIG } from '@/models/round-record';
import { WheelColor } from '@/models/wheel-of-fortune-placement';
import { useCreateWheelOfFortunePlacement, useGetMyCurrentRoundWheelOfFortunePlacement } from '@/react-query/wheel-of-fortune-queries';
import { useState } from 'react';

// Color configuration mapping

type Props = {
  roundRecord: RoundRecord;
  amount: number;
  className?: string;
  children?: React.ReactNode;
  winningColor?: WheelColor;
}

export default function WheelOfFortuneGameBoard({ roundRecord, amount, className, children, winningColor }: Props) {

  const { mutate: createWheelPlacement, isPending } = useCreateWheelOfFortunePlacement();
  const { data: placements } = useGetMyCurrentRoundWheelOfFortunePlacement(roundRecord.id);

  const handleColorClick = (color: WheelColor) => {
    if (isPending) return;
    createWheelPlacement({ roundId: roundRecord.id, placementColor: color, amount });
  };

  // Calculate total bets for each color
  const colorBets: Record<WheelColor, number> | undefined = placements?.reduce((acc, placement) => {
    if (!acc[placement.placementColor]) {
      acc[placement.placementColor] = 0;
    }
    acc[placement.placementColor] += placement.amount;
    return acc;
  }, {} as Record<WheelColor, number>);


  console.log(roundRecord)

  return (
    <div className={cn("flex flex-col items-center justify-center w-full h-full bg-amber-800 p-4 pt-20 rounded-lg bg-center relative", className)}>
      {children}
      <img src="/images/wodden-board.jpg" alt="wodden-board" className="w-full h-full object-fill absolute top-0 left-0 z-0" />


      {/* Color Cards Grid */}
      <div className="flex flex-wrap w-full max-w-4xl gap-2 md:p-4 justify-center">
        {/* Top row - 3 cards */}
        {/* <div className="flex w-full gap-2 mb-2"> */}
          <ColorCard color={WheelColor.COLOR1} colorBets={colorBets} winningColor={winningColor} isPending={isPending} roundRecord={roundRecord} handleColorClick={handleColorClick} />
          <ColorCard color={WheelColor.COLOR2} colorBets={colorBets} winningColor={winningColor} isPending={isPending} roundRecord={roundRecord} handleColorClick={handleColorClick} />
          <ColorCard color={WheelColor.COLOR3} colorBets={colorBets} winningColor={winningColor} isPending={isPending} roundRecord={roundRecord} handleColorClick={handleColorClick} />
        {/* </div> */}
        {/* Bottom row - 2 cards */}
        {/* <div className="flex gap-2" style={{ width: 'calc(66.666% - 0.25rem)' }}> */}
          <ColorCard color={WheelColor.COLOR4} colorBets={colorBets} winningColor={winningColor} isPending={isPending} roundRecord={roundRecord} handleColorClick={handleColorClick} />
          <ColorCard color={WheelColor.COLOR5} colorBets={colorBets} winningColor={winningColor} isPending={isPending} roundRecord={roundRecord} handleColorClick={handleColorClick} />
        {/* </div> */}
      </div>

      {/* Total Bet Display */}
      <div className="mt-4 bg-amber-100 rounded-lg p-3 z-10">
        <div className="text-amber-900 font-bold text-center">
          Total Bet: {colorBets ? INR(Object.values(colorBets).reduce((sum, amount) => sum + amount, 0)) : '0'}
        </div>
      </div>
    </div>
  );
}

const ColorCard = ({ color, colorBets, winningColor, isPending, handleColorClick, roundRecord }: { color: WheelColor, colorBets?: Record<WheelColor, number>, winningColor?: WheelColor, isPending: boolean, roundRecord: RoundRecord, handleColorClick: (color: WheelColor) => void }) => {
  const config = WHEEL_COLOR_CONFIG[color];
  const myBetAmount = colorBets?.[color] || 0;
  const isWinner = winningColor === color;

  const [isFlipped, setIsFlipped] = useState(false);

  console.log(setIsFlipped)

  return (
    <div
      className={cn(
        "flex-1 min-w-[190px] max-w-[190px] min-h-64 z-10 rounded-lg flex flex-col cursor-pointer transition-all duration-300 relative group",
        isPending ? 'opacity-70 pointer-events-none' : 'hover:shadow-lg hover:scale-105',
        isWinner ? `border-2 ${config.borderColor} shadow-custom-glow` : ''
      )}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}

      onClick={() => handleColorClick(color)}
    >

      {myBetAmount > 0 && (
          <div className="absolute top-0 left-0  bg-amber-500 aspect-square z-20 border-2 border-dashed border-amber-700  rounded-full p-1 flex justify-center gap-2 items-center text-[10px]  text-center w-fit">
            <span className="font-bold">{myBetAmount}</span>
          </div>
        )}

      <div
        className={cn(
          "absolute inset-0 w-full h-full transition-transform duration-500",
          isFlipped ? 'rotate-y-180' : ''
        )}
        style={{
          backfaceVisibility: 'hidden',
          transform: isFlipped ? 'rotateY(180deg)' : ''
        }}
      >
        <div className="h-full flex flex-col">
          <div className={cn(config.bgColor, "rounded-t-lg p-2 flex justify-center gap-2 items-center text-center w-full")}>
            <span className="text-white text-lg font-bold">{config.name}</span>
            <div className=" font-bold ">
              1:{config.multiplier}
            </div>
          </div>
          <div className="bg-amber-100 flex-1 rounded-b-lg flex flex-col items-center justify-start  relative w-full">

            <ul className="gap-1 w-full py-4  p-2">
              {roundRecord.getMarketsByColor(color).map((market,index) => (
                <li key={market.id} className="text-sm  font-medium text-gray-700">
                 {index + 1}. {market.name}
                </li>
              ))}
            </ul>

            <div className="w-full mt-auto bg-amber-50 bg-opacity-80 p-2 rounded-b-lg">
              <div className="flex flex-col items-center">
                <div className="text-xs font-semibold flex items-center gap-1 text-amber-900 text-center">
                  <img src="/images/coin.png" alt="bet" className="w-4 h-4" />
                  <span className="font-bold">{INR(myBetAmount * config.multiplier)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
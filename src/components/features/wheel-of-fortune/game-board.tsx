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



  return (
    <div className={cn("flex flex-col items-center justify-center w-full h-full bg-amber-800 p-4 pt-20 rounded-lg bg-center relative", className)}>
      {children}
      <img src="/images/wodden-board.jpg" alt="wodden-board" className="w-full h-full object-fill absolute top-0 left-0 z-0" />


      {/* Color Cards Grid */}
      <div className="flex flex-wrap w-full max-w-4xl gap-2 p-4 justify-center">
        {/* Top row - 3 cards */}
        <div className="flex w-full gap-2 mb-2">
          <ColorCard color={WheelColor.COLOR1} colorBets={colorBets} winningColor={winningColor} isPending={isPending} roundRecord={roundRecord} handleColorClick={handleColorClick}   />
          <ColorCard color={WheelColor.COLOR2} colorBets={colorBets} winningColor={winningColor} isPending={isPending} roundRecord={roundRecord} handleColorClick={handleColorClick} />
          <ColorCard color={WheelColor.COLOR3} colorBets={colorBets} winningColor={winningColor} isPending={isPending} roundRecord={roundRecord} handleColorClick={handleColorClick} />
        </div>
        {/* Bottom row - 2 cards */}
        <div className="flex gap-2" style={{ width: 'calc(66.666% - 0.25rem)' }}>
          <ColorCard color={WheelColor.COLOR4} colorBets={colorBets} winningColor={winningColor} isPending={isPending} roundRecord={roundRecord} handleColorClick={handleColorClick} />
          <ColorCard color={WheelColor.COLOR5} colorBets={colorBets} winningColor={winningColor} isPending={isPending} roundRecord={roundRecord} handleColorClick={handleColorClick} />
        </div>
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
const ColorCard = ({ color, colorBets, winningColor, isPending, handleColorClick ,roundRecord}: { color: WheelColor, colorBets?: Record<WheelColor, number>, winningColor?: WheelColor, isPending: boolean, roundRecord: RoundRecord, handleColorClick: (color: WheelColor) => void }) => {
  const config = WHEEL_COLOR_CONFIG[color];
  const myBetAmount = colorBets?.[color] || 0;
  const isWinner = winningColor === color;

  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={cn(
        "flex-1 min-h-64 z-10 rounded-lg flex flex-col cursor-pointer transition-all duration-300 relative group",
        isPending ? 'opacity-70 pointer-events-none' : 'hover:shadow-lg hover:scale-105',
        isWinner ? `border-2 ${config.borderColor} shadow-custom-glow` : ''
      )}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div 
        className={cn(
          "absolute inset-0 w-full h-full transition-transform duration-500",
          isFlipped ? 'rotate-y-180' : ''
        )}
        style={{
          backfaceVisibility: 'hidden',
          transform: isFlipped ? 'rotateY(180deg)' : ''
        }}
        onClick={() => handleColorClick(color)}
      >
        <div className="h-full flex flex-col">
          <div className={cn(config.bgColor, "rounded-t-lg p-2 text-center w-full")}>
            <span className="text-white text-lg font-bold">{config.name}</span>
          </div>
          <div className="bg-amber-100 flex-1 rounded-b-lg flex flex-col items-center justify-start p-3 relative w-full">
            {/* Color Circle */}
            <div className={cn("w-12 h-12 rounded-full", config.bgColor)}></div>

            {/* Multiplier */}
            <div className="mt-2 text-amber-900 font-bold text-sm">
              1:{config.multiplier}
            </div>

            {/* Stats Container */}
            <div className="absolute bottom-0 left-0 right-0 bg-amber-50 bg-opacity-80 p-2 rounded-b-lg">
              <div className="flex flex-col items-center">
                <div className="text-xs font-semibold text-amber-900 text-center">
                  <span>Bet: </span>
                  <span className="font-bold">{INR(myBetAmount)}</span>
                </div>
                <div className="text-xs font-semibold text-amber-900 text-center">
                  <span>Win: </span>
                  <span className="font-bold">{INR(myBetAmount * config.multiplier)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back side with stocks */}
      <div 
        className={cn(
          "absolute inset-0 w-full h-full bg-amber-100 rounded-lg p-4 transition-transform duration-500",
          isFlipped ? '' : 'rotate-y-180'
        )}
        style={{
          backfaceVisibility: 'hidden',
          transform: isFlipped ? '' : 'rotateY(180deg)'
        }}
      >
        <div className="h-full overflow-y-auto">
          <h3 className={cn("text-center font-bold mb-2", config.textColor)}>Stocks in {config.name}</h3>
          <ul className="space-y-2">
            {roundRecord.getMarketsByColor(color).map((market) => (
              <li key={market.id} className="text-sm text-gray-700">
                {market.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
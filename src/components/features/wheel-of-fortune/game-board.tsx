import { cn, INR } from '@/lib/utils';
import { RoundRecord } from '@/models/round-record';
import { WheelColor } from '@/models/wheel-of-fortune-placement';
import { useCreateWheelOfFortunePlacement, useGetMyCurrentRoundWheelOfFortunePlacement } from '@/react-query/wheel-of-fortune-queries';

// Color configuration mapping
const WHEEL_COLOR_CONFIG = {
  [WheelColor.COLOR1]: {
    name: 'GOLDEN',
    bgColor: 'bg-yellow-500',
    textColor: 'text-yellow-900',
    borderColor: 'border-yellow-600',
    shadowColor: 'shadow-yellow-500/50',
    actualColor: 'golden',
    multiplier: 4.8 // 1:4.8 payout for golden
  },
  [WheelColor.COLOR2]: {
    name: 'RED',
    bgColor: 'bg-red-600',
    textColor: 'text-red-900',
    borderColor: 'border-red-600', 
    shadowColor: 'shadow-red-500/50',
    actualColor: 'red',
    multiplier: 2.4 // 1:2.4 payout for red
  },
  [WheelColor.COLOR3]: {
    name: 'BLUE', 
    bgColor: 'bg-blue-600',
    textColor: 'text-blue-900',
    borderColor: 'border-blue-600',
    shadowColor: 'shadow-blue-500/50',
    actualColor: 'blue',
    multiplier: 2.4 // 1:2.4 payout for blue
  },
  [WheelColor.COLOR4]: {
    name: 'GREEN',
    bgColor: 'bg-green-600', 
    textColor: 'text-green-900',
    borderColor: 'border-green-600',
    shadowColor: 'shadow-green-500/50',
    actualColor: 'green',
    multiplier: 2.4 // 1:2.4 payout for green
  },
  [WheelColor.COLOR5]: {
    name: 'PURPLE',
    bgColor: 'bg-purple-600',
    textColor: 'text-purple-900', 
    borderColor: 'border-purple-600',
    shadowColor: 'shadow-purple-500/50',
    actualColor: 'purple',
    multiplier: 2.4 // 1:2.4 payout for purple
  }
};

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
    createWheelPlacement({ roundId: roundRecord.id, color, amount });
  };

  // Calculate total bets for each color
  const colorBets : Record<WheelColor, number> | undefined = placements?.reduce((acc, placement) => {
    if (!acc[placement.placementColor]) {
      acc[placement.placementColor] = 0;
    }
    acc[placement.placementColor] += placement.amount;
    return acc;
  }, {} as Record<WheelColor, number>);

  const ColorCard = ({ color }: { color: WheelColor }) => {
    const config = WHEEL_COLOR_CONFIG[color];
    const myBetAmount = colorBets?.[color] || 0;
    const isWinner = winningColor === color;

    return (
      <div
        className={cn(
          "flex-1 min-h-48 z-10 rounded-lg flex flex-col cursor-pointer transition-all duration-300",
          isPending ? 'opacity-70 pointer-events-none' : 'hover:shadow-lg hover:scale-105',
          isWinner ? `border-2 ${config.borderColor} shadow-custom-glow` : ''
        )}
        onClick={() => handleColorClick(color)}
      >
        <div className={cn(config.bgColor, "rounded-t-lg p-2 text-center")}>
          <span className="text-white text-lg font-bold">{config.name}</span>
        </div>
        <div className="bg-amber-100 flex-1 rounded-b-lg flex flex-col items-center justify-start p-3 relative">
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
    );
  };

  return (
    <div className={cn("flex flex-col items-center justify-center w-full h-full bg-amber-800 p-4 pt-20 rounded-lg bg-center relative", className)}>
      {children}
      <img src="/images/wodden-board.jpg" alt="wodden-board" className="w-full h-full object-fill absolute top-0 left-0 z-0" />
      
      {/* Wheel Container */}
      <div className="flex flex-col items-center mb-6 z-10">
        <div className="w-32 h-32 rounded-full border-4 border-amber-600 bg-amber-200 flex items-center justify-center mb-4 relative overflow-hidden">
          {/* Wheel segments */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full relative">
              {Object.entries(WHEEL_COLOR_CONFIG).map(([colorKey, config], index) => {
                const rotation = (index * 72) - 90; // 72 degrees per segment, start from top
                return (
                  <div
                    key={colorKey}
                    className={cn("absolute w-full h-full", config.bgColor)}
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((rotation + 72) * Math.PI / 180)}% ${50 + 50 * Math.sin((rotation + 72) * Math.PI / 180)}%)`,
                      transform: `rotate(${rotation}deg)`,
                      transformOrigin: 'center'
                    }}
                  />
                );
              })}
            </div>
          </div>
          {/* Center circle */}
          <div className="absolute w-4 h-4 bg-amber-800 rounded-full z-10"></div>
          {/* Pointer */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-amber-800 z-20"></div>
        </div>
        <h2 className="text-2xl font-bold text-amber-100 mb-2">Wheel of Fortune</h2>
      </div>

      {/* Color Cards Grid */}
      <div className="flex flex-wrap w-full max-w-4xl gap-2 p-4 justify-center">
        {/* Top row - 3 cards */}
        <div className="flex w-full gap-2 mb-2">
          <ColorCard color={WheelColor.COLOR1} />
          <ColorCard color={WheelColor.COLOR2} />
          <ColorCard color={WheelColor.COLOR3} />
        </div>
        {/* Bottom row - 2 cards */}
        <div className="flex gap-2" style={{ width: 'calc(66.666% - 0.25rem)' }}>
          <ColorCard color={WheelColor.COLOR4} />
          <ColorCard color={WheelColor.COLOR5} />
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
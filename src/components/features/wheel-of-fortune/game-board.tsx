import { cn, INR } from '@/lib/utils';
import { RoundRecord, WHEEL_COLOR_CONFIG } from '@/models/round-record';
import { WheelColor } from '@/models/wheel-of-fortune-placement';
import { useCreateWheelOfFortunePlacement, useGetMyCurrentRoundWheelOfFortunePlacement } from '@/react-query/wheel-of-fortune-queries';

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
    <div className={cn("flex  flex-col items-center justify-center w-full h-full bg-amber-800 p-4 pt-20 rounded-lg bg-center relative", className)}>
      {children}
      <img src="/images/wodden-board.jpg" alt="wodden-board" className="w-full h-full object-fill absolute top-0 left-0 z-0" />

      {/* Color Cards Grid */}
      <div className="flex flex-wrap w-full max-w-4xl gap-2 md:p-4 mb-8 justify-center">
        <ColorCard color={WheelColor.COLOR5} colorBets={colorBets} winningColor={winningColor} isPending={isPending} roundRecord={roundRecord} handleColorClick={handleColorClick} />
        <ColorCard color={WheelColor.COLOR4} colorBets={colorBets} winningColor={winningColor} isPending={isPending} roundRecord={roundRecord} handleColorClick={handleColorClick} />
        <ColorCard color={WheelColor.COLOR3} colorBets={colorBets} winningColor={winningColor} isPending={isPending} roundRecord={roundRecord} handleColorClick={handleColorClick} />
        <ColorCard color={WheelColor.COLOR2} colorBets={colorBets} winningColor={winningColor} isPending={isPending} roundRecord={roundRecord} handleColorClick={handleColorClick} />
        <ColorCard color={WheelColor.COLOR1} colorBets={colorBets} winningColor={winningColor} isPending={isPending} roundRecord={roundRecord} handleColorClick={handleColorClick} />
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



  return (
    <div
      className={cn(
        "flex-1 min-w-[190px] sm:max-w-[190px]  h-full min-h-52 z-10 rounded-lg flex flex-col cursor-pointer transition-all duration-300 relative group",
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

      <div className="h-full flex-1 flex flex-col">
        <div className={cn(config.bgColor, "rounded-t-lg p-2 flex justify-center gap-2 items-center text-center w-full")}>
          <span className="text-white text-lg font-bold">{config.name}</span>
          <div className=" font-bold ">
            1:{config.multiplier}
          </div>
        </div>
        <div className="bg-amber-100 flex-1 rounded-b-lg flex flex-col items-center justify-start  relative w-full">

          <ul className="gap-1 w-full py-4 p-2 ">
            {roundRecord.getMarketsByColor(color).map((market, index) => (
              <li
                key={market.id}
                className="text-sm font-medium pb-2 text-gray-700 pl-6 -indent-3"
              >
                {index + 1}. {market.name?.slice(0, 17)}
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
  );
};



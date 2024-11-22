import { getBetPosition } from "@/hooks/use-roulette-betting";
import { Chip } from "./contants";


const BettingChips: React.FC<{ chips: Chip[] }> = ({ chips }) => {
  console.log(chips);
  return (
    <div className="absolute inset-0 pointer-events-none">
      {chips.map((chip, index) => {
        const position = getBetPosition(chip as any);
        if (position.x ==0 && position.y == 0) {
          return null;
        }
        return (
          <div
            key={index}
            className="absolute flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500 text-black text-xs font-bold transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: position.x,
              top: position.y,
              zIndex: 10
            }}
          >
            {chip.amount}
          </div>
        );
      })}
    </div>
  );
};

export default BettingChips;
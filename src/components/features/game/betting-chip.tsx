import { Chip } from "./contants";

type Props = {
    chips: Chip[];
    getBetPosition: (bet: any) => { x: number; y: number };
}

const BettingChips: React.FC<Props> = ({ chips,getBetPosition }) => {
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
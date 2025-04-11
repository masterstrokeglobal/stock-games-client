import { PlacementType } from "@/models/game-record";
import { Chip } from "./contants";
import { RoundRecord } from "@/models/round-record";
import { useMemo } from "react";
type Props = {
  chips: Chip[];
  roundRecord: RoundRecord;
  getBetPosition: (bet: any) => { x: number; y: number };
}

const BettingChips: React.FC<Props> = ({ chips, getBetPosition, roundRecord }) => {

  const filteredChips = useMemo(() => {
    return chips.filter((chip) => {
      // remove single bet on zeroth position
      if (chip.type === PlacementType.SINGLE && chip.numbers.includes(17)) {
        return false;
      }
      return true;
    });
  }, [chips, roundRecord]);

  return (
    <div className="absolute inset-0 pointer-events-none chips-overlay">
      {filteredChips.map((chip, index) => {
        const position = getBetPosition(chip as any);
        if (position.x == 0 && position.y == 0) {
          return null;
        }
        return (
          <div
            key={index}
            className="absolute flex items-center justify-center w-7 h-7 rounded-full bg-chip text-white text-xs font-bold transform -translate-x-1/2 -translate-y-1/2"
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



import { Button } from '@/components/ui/button';
import { Bet, Chip } from './contants';
import { RoundRecord } from '@/models/round-record';

interface RouletteBettingGridProps {
    hoveredCell: Bet | null;
    chips: Chip[];
    roundRecord: RoundRecord;
}
export const RouletteBettingGrid = ({ hoveredCell, chips, roundRecord }: RouletteBettingGridProps) => {
    const ROULETTE_NUMBERS = Array.from({ length: 16 }, (_, i) => ({
        number: i + 1,
        color: (i + 1) % 2 === 0 ? 'black' : 'red'
    }));

    const getCodeByIndex = (index: number) => {
        return roundRecord.market[index-1]?.codeName;
    }

    return (
        <div className="grid grid-cols-4 flex-1 gap-2 p-px">
            {ROULETTE_NUMBERS.map(({ number, color }) => (
                <div
                    key={number}
                    className={`
                  h-10 relative group rounded-sm
                  ${color === 'red' ? 'routelette-piece-red' : 'routelette-piece-black'}
                  ${hoveredCell?.numbers.includes(number) ? 'ring-4 ring-yellow-400 ring-opacity-75' : ''}
                  ${chips.some(chip => chip.numbers.includes(number)) ? 'ring-2 ring-yellow-500' : ''}
                  transition-all duration-150
                `}
                >
                    <span  className="absolute inset-0 flex items-end text-xs m-1 justify-start text-white ">
                        {getCodeByIndex(number)}
                    </span>
                    <span className="absolute inset-0 mx-4 flex items-center justify-end text-white text-2xl font-bold">
                        {number}
                    </span>
                </div>
            ))}
        </div>
    );
};



import { Button } from '@/components/ui/button';
import { Bet, Chip, ROULETTE_NUMBERS } from './contants';

interface RouletteBettingGridProps {
    hoveredCell: Bet | null;
    chips: Chip[];
}

export const RouletteBettingGrid: React.FC<RouletteBettingGridProps> = ({
    hoveredCell,
    chips
}) => {
    return (
        <>
            <div className='flex w-full'>


                <div className="grid grid-cols-4 flex-1 gap-2  p-px">
                    {ROULETTE_NUMBERS.map(({ number, color }) => (
                        <div
                            key={number}
                            className={`
                        h-10 relative group rounded-sm
                        ${color === 'red' ? 'routelette-piece-red' : 'routelette-piece-black '}
                        ${hoveredCell && hoveredCell.numbers.includes(number) ? 'ring-4 ring-blue-400 ring-opacity-75' : ''}
                        ${chips.some(chip => chip.numbers.includes(number)) ? 'ring-2 ring-blue-500' : ''}
                        transition-all duration-150 
                        `}
                        >
                            <span className="absolute inset-0 mx-4 flex items-center justify-end  text-white text-2xl font-bold">
                                {number}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="grid grid-row-2 gap-2 ml-2">
                    <Button variant="game-secondary" className="col-span-1 flex items-center h-full w-10 justify-center">
                        <span className="rotate-text">1st 8</span>
                    </Button>
                    <Button variant="game-secondary" className="col-span-1 flex items-center h-full w-10 justify-center">
                        <span className="rotate-text">2nd 8</span>
                    </Button>
                </div>
            </div>

            <div className='grid grid-cols-2 flex-1 gap-2 mt-4'>
                <Button variant="game-secondary" className='col-span-1 justify-center'>1st 8</Button>
                <Button variant="game-secondary" className='col-span-1 justify-center'>2nd 8</Button>
            </div>

            {/* Special Bets Section */}
            <div className="grid grid-cols-4 gap-2 mt-4">
                <Button variant="game-secondary" className="col-span-1">EVEN</Button>
                <Button variant="game-secondary" className="col-span-1 roulette-piece-black-select"></Button>
                <Button variant="game-secondary" className="col-span-1 roulette-piece-red-select"></Button>
                <Button variant="game-secondary" className="col-span-1">ODD</Button>
            </div>
        </>

    );
};

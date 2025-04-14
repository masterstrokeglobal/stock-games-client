


import { RoundRecord } from '@/models/round-record';
import { Bet, Chip } from './contants';
import { useGetRoundRecordById } from '@/react-query/round-record-queries';
import { useEffect, useMemo } from 'react';
import { cn, ROULETTE_NUMBERS } from '@/lib/utils';

interface RouletteBettingGridProps {
    hoveredCell: Bet | null;
    chips: Chip[];
    roundRecord: RoundRecord;
    previousRoundId?: string;
}
export const RouletteBettingGrid = ({ hoveredCell, chips, roundRecord }: RouletteBettingGridProps) => {


    const { refetch, data, isSuccess } = useGetRoundRecordById(roundRecord.id);

    useEffect(() => {
        const resultFetchTime = new Date(roundRecord.endTime).getTime() - new Date().getTime() + 4000;

        const timer = setTimeout(() => {
            console.log('refetching');
            refetch();
        }, resultFetchTime);

        return () => clearTimeout(timer);
    }, [roundRecord, refetch]);

    const winnerNumber = useMemo(() => {
        if (!isSuccess) return null;
        const winningId = data.data?.winningId;

        if (!winningId) return null;

        const winningNumber = roundRecord.market.find((item) => item.id === winningId);
        if (!winningNumber) return null;
        return winningNumber.horse;
    }, [data, isSuccess]);

    const getCodeByIndex = (index: number) => {
        return `${roundRecord.market[index - 1]?.codeName}`;
    }


    return (
        <div className="grid grid-cols-4 flex-1 gap-2 p-px">
            {ROULETTE_NUMBERS.map(({ number, color }) => (
                <div key={number} className={cn(winnerNumber === number ? 'border-2 border-yellow-600 rounded-sm  shadow-lg shadow-yellow-600/30' : '')}>
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
                    <span className="absolute inset-0 flex items-end ml-1 font-semibold sm:text-[10px] text-[8px] justify-start text-game-text-secondary ">
                        {getCodeByIndex(number)}
                    </span>
                    <span className="absolute inset-0 mx-1 flex items-start justify-end text-game-text-secondary text-2xl font-bold">
                        {number}
                    </span>
                    {winnerNumber === number && <img className='z-40 relative w-auto md:h-7 h-6 animate-pulse  duration-500 md:translate-x-0 -translate-x-1' src='/images/crown.png' />}
                </div>
                </div>
            ))}
        </div>
    );
};
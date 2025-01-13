


import { RoundRecord } from '@/models/round-record';
import { Bet, Chip } from './contants';
import { useGetRoundRecordById } from '@/react-query/round-record-queries';
import { useEffect, useMemo } from 'react';

interface RouletteBettingGridProps {
    hoveredCell: Bet | null;
    chips: Chip[];
    roundRecord: RoundRecord;
    previousRoundId?: string;
}
export const RouletteBettingGrid = ({ hoveredCell, chips, roundRecord }: RouletteBettingGridProps) => {
    const ROULETTE_NUMBERS = Array.from({ length: 16 }, (_, i) => ({
        number: i + 1,
        color: (i + 1) % 2 === 0 ? 'black' : 'red'
    }));

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
                <div
                    key={number}
                    className={`
                  h-10 relative group rounded-sm
                  ${color === 'red' ? 'routelette-piece-red' : 'routelette-piece-black'}
                  ${hoveredCell?.numbers.includes(number) ? 'ring-4 ring-yellow-400 ring-opacity-75' : ''}
                  ${chips.some(chip => chip.numbers.includes(number)) ? 'ring-2 ring-yellow-500' : ''}
                  ${winnerNumber === number ? '!border-2 border-yellow-500 ' : ''}
                  transition-all duration-150
                `}
                >
                    <span className="absolute inset-0 flex items-end ml-1 sm:text-[10px] text-[8px] justify-start text-white ">
                        {getCodeByIndex(number)}
                    </span>
                    <span className="absolute inset-0 mx-1 flex items-start justify-end text-white text-2xl font-bold">
                        {number} 
                    </span>
                    {winnerNumber === number && <img className='z-40 relative' src='/crown.png' />}
                </div>
            ))}
        </div>
    );
};
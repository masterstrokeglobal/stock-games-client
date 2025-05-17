import { RoundRecord, RoundRecordGameType } from '@/models/round-record';
import { Bet, Chip } from './contants';
import { useGetRoundRecordById } from '@/react-query/round-record-queries';
import { useEffect, useMemo } from 'react';
import { LobbyResult } from './lobby-result-dialog';
import { cn, ROULETTE_NUMBERS } from '@/lib/utils';

interface RouletteBettingGridProps {
    hoveredCell: Bet | null;
    chips: Chip[];
    roundRecord: RoundRecord;
    previousRoundId?: string;
    result?: LobbyResult;
}
export const RouletteBettingGrid = ({ hoveredCell, chips, roundRecord ,result}: RouletteBettingGridProps) => {


    const { refetch, data, isSuccess } = useGetRoundRecordById(roundRecord.id);

    useEffect(() => {
        const resultFetchTime = new Date(roundRecord.endTime).getTime() - new Date().getTime() + 3000;

        const timer = setTimeout(() => {
            refetch();
        }, resultFetchTime);

        return () => clearTimeout(timer);
    }, [roundRecord, refetch]);

    const winningNumbers: number[] = useMemo(() => {
        console.log(result, "result");
        if (result) {
            return result.winningItems?.map(item => {
                // Find the market item that matches the winning item code
                const marketItem = roundRecord.market.find(market => {
                    return market.bitcode?.toUpperCase() === item.code?.toUpperCase();
                });
                return marketItem?.horse || null;
            }).filter(Boolean) ?? [];
        } else if (isSuccess && data.data?.winningId && roundRecord.roundRecordGameType !== RoundRecordGameType.LOBBY) {
            // If no result but we have successful data fetch with winningId
            const winningIds = data.data?.winningId;
            const winningNumbers = winningIds?.map((id: number) => {
                const marketItem = roundRecord.market.find(market => {
                    return market.id === id;
                });
                return marketItem?.horse || null;
            }).filter(Boolean) ?? [];
            return winningNumbers;
        }
        return [];
    }, [data, isSuccess, result, roundRecord.market]);

    const getCodeByIndex = (index: number) => {
        return `${roundRecord.market[index - 1]?.codeName}`;
    }

    console.log(winningNumbers, "winningNumbers");
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
<<<<<<< HEAD
                  transition-all duration-150`}
                >
                    <span className="absolute inset-0 flex items-end ml-1 font-semibold sm:text-[10px] text-[8px] justify-start text-game-text-secondary ">
                        {getCodeByIndex(number)}
                    </span>
                    <span className="absolute inset-0 mx-1 flex items-start justify-end text-game-text-secondary text-2xl font-bold">
                        {number}
                    </span>
                    {winningNumbers.includes(number) && <img className='z-40 relative' src='/crown.png' alt="Winner" />}
=======
                  transition-all duration-150
                `}
                    >
                        <span style={{ wordBreak: 'break-all' }} className="absolute inset-0 flex items-end ml-1 font-semibold break-words w-full sm:text-[10px] text-[8px] justify-start text-game-text-secondary ">
                            {getCodeByIndex(number)}
                        </span>
                        <span className="absolute inset-0 mx-1 flex items-start justify-end text-game-text-secondary text-2xl font-bold">
                            {number}
                        </span>
                        {winnerNumber === number && <img className='z-40 relative w-auto md:h-7 h-6 animate-pulse  duration-500 md:translate-x-0 -translate-x-1' src='/images/crown.png' />}
                    </div>
>>>>>>> new-game
                </div>
            ))}
        </div>
    );
};
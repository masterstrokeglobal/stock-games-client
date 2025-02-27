import React from 'react';
import { CurrentGameState } from './contants';
import { RoundRecord } from '@/models/round-record';
import { useGameState } from '@/hooks/use-current-game';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface GameHeaderProps {
    gameState: CurrentGameState;
    className?: string;
}


export const GameHeader: React.FC<GameHeaderProps> = ({ gameState,className }) => {
    const getMessage = () => {
        if (gameState.isGameOver) {
            return "Game Over";
        }
        return  gameState.isPlaceOver ? "Game ends in" : "Round starts in";
    };

    const getTime = () => {
        if (gameState.isGameOver) {
            return "00:00";
        }
        return gameState.isPlaceOver
            ? gameState.gameTimeLeft.formatted
            : gameState.placeTimeLeft.formatted;
    };

    return (
        <header className={cn('text-center hidden lg:block my-2 text-white',className)}>
            <h2 className="text-lg font-semibold text-gray-">
                {getMessage()}
            </h2>
            <p className='text-7xl jersey leading-[5rem]'>
                {getTime()}
            </p>
        </header>
    );
};
type Props = {
    roundRecord: RoundRecord;
}

export const MobileGameHeader = ({ roundRecord }: Props) => {
    const t = useTranslations('game');
    const gameState = useGameState(roundRecord);
    return (
        <header className='text-center relative h-16  text-white'>
            <img className='w-full h-full absolute object-cover z-10' src='/mobile-header.svg' alt='Roulette' />
            <div className='h-16 w-40 bg-[url("/mobile-header-center.svg")] bg-cover z-40  relative mx-auto'>
                <span className='text-sm'>
                    {gameState.isPlaceOver ? t('game-ends-in') : t('round-starts-in')}
                </span>
                <div className='text-xl font-bold mt-1'>
                    {gameState.isPlaceOver ? gameState.gameTimeLeft.formatted : gameState.placeTimeLeft.formatted}
                </div>
            </div>
        </header>
    );
}
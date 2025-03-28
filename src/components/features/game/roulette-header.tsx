import React from 'react';
import { CurrentGameState } from './contants';
import { RoundRecord } from '@/models/round-record';
import { useGameState } from '@/hooks/use-current-game';
import { useTranslations } from 'next-intl';

interface GameHeaderProps {
    gameState: CurrentGameState;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ gameState }) => {
    const t = useTranslations('game');
    return (
        <header className='text-center hidden lg:block my-2 text-game-secondary'>
            <h2>{gameState.isPlaceOver ? t("game-ends-in") : t("round-starts-in")}</h2>
            <p className='text-7xl jersey leading-[5rem]'>
                {gameState.isPlaceOver ? gameState.gameTimeLeft.formatted : gameState.placeTimeLeft.formatted}
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
        <header className='text-center relative h-16  '>
            <img className='w-full h-full absolute object-cover z-10' src='mobile-header.svg' alt='Roulette' />
            <div className='h-16 w-40 bg-[url("/mobile-header-center.svg")] text-white bg-cover z-40  relative mx-auto'>
                <span className='text-sm'>
                    {gameState.isPlaceOver ? t('game-ends-in') : t('round-starts-in')}
                </span>
                <div className='text-xl font-bold mt-1 '>
                    {gameState.isPlaceOver ? gameState.gameTimeLeft.formatted : gameState.placeTimeLeft.formatted}
                </div>
            </div>
        </header>
    );
}
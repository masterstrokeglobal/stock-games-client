import { useGameState } from '@/hooks/use-current-game';
import { RoundRecord } from '@/models/round-record';
import { useTranslations } from 'next-intl';
import React from 'react';
import { CurrentGameState } from './contants';
import { cn } from '@/lib/utils';

interface GameHeaderProps {
    gameState: CurrentGameState;
    className?: string;
}

export const GameHeaderBackground: React.FC<GameHeaderProps> = ({ gameState, className }) => {
    const t = useTranslations('game');
    const getTime = () => {
        if (gameState.isGameOver) {
            return "00:00";
        }
        return gameState.isPlaceOver
            ? gameState.gameTimeLeft.formatted
            : gameState.placeTimeLeft.formatted;
    };

    return (
        <header
            className={cn(
                'text-center hidden lg:flex flex-col items-center justify-center w-full relative',
                className
            )}
        >
            <div className="">
                <span
                    className="inline-block px-3 py-1 text-white text-2xl font-semibold rounded bg-transparent  tracking-wide"
                    style={{ letterSpacing: "0.04em" }}
                >
                    {gameState.isPlaceOver ? t("game-ends-in") : t("round-starts-in")}
                </span>
            </div>
            <p
                style={{
                    textShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                }}
                className='text-5xl font-bold text-white relative'>
                {getTime()}
            </p>
        </header>
    );
}

export const GameHeader: React.FC<GameHeaderProps> = ({ gameState, className }) => {
    const t = useTranslations('game');
    
    const getTime = () => {
        if (gameState.isGameOver) {
            return "00:00";
        }
        return gameState.isPlaceOver
            ? gameState.gameTimeLeft.formatted
            : gameState.placeTimeLeft.formatted;
    };

    return (
        <header className={cn('text-center hidden lg:block my-2 text-game-secondary', className)}>
            <h2>{gameState.isPlaceOver ? t("game-ends-in") : t("round-starts-in")}</h2>
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
        <header className='text-center relative h-16'>
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
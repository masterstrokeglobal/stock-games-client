import React from 'react';
import { CurrentGameState } from './contants';
import { RoundRecord } from '@/models/round-record';
import { useGameState } from '@/hooks/use-current-game';

interface GameHeaderProps {
    gameState: CurrentGameState;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ gameState }) => {
    return (
        <header className='text-center hidden lg:block my-2 text-white'>
            <h2>{gameState.isPlaceOver ? "Game Ends in" : "Round Starts in"}</h2>
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
    const gameState = useGameState(roundRecord);
    return (
        <header className='text-center relative h-16  text-white'>
            <img className='w-full h-full absolute object-cover' src='mobile-header.svg' alt='Roulette' />
            <div className='h-16 w-40 bg-[url("/mobile-header-center.svg")] bg-cover z-50  relative mx-auto'>
                <span className='text-sm'>Round Ends In</span>
                <div className='text-xl font-bold mt-1'>
                    {gameState.isPlaceOver ? gameState.gameTimeLeft.formatted : gameState.placeTimeLeft.formatted}
                </div>
            </div>
        </header>
    );
}
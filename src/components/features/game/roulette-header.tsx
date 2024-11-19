import React from 'react';
import { CurrentGameState } from './contants';

interface GameHeaderProps {
    gameState: CurrentGameState;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ gameState }) => {
    return (
        <header className='text-center hidden xl:block my-2 text-white'>
            <h2>{gameState.isPlaceOver ? "Game Ends in" : "Round Starts in"}</h2>
            <p className='text-7xl jersey leading-[5rem]'>
                {gameState.isPlaceOver ? gameState.gameTimeLeft.formatted : gameState.placeTimeLeft.formatted}
            </p>
        </header>
    );
};

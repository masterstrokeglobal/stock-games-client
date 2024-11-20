import {  useEffect, useState,useMemo } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { RoundRecord } from '@/models/round-record';
import { useGetCurrentRoundRecord } from '@/react-query/round-record-queries';
import { useGameType } from './use-game-type';

interface FormattedTime {
    minutes: number;
    seconds: number;
    formatted: string;      // "MM:SS" format
    shortFormat: string;    // "1m 30s" format
    longFormat: string;     // "1 minute 30 seconds" format
    raw: number;           // milliseconds
}

interface CurrentGameState {
    placeTimeLeft: FormattedTime;
    gameTimeLeft: FormattedTime;
    isPlaceOver: boolean;
    isGameOver: boolean;
}

interface RoundRecordResponse {
    data: {
        roundRecords: RoundRecord[];
    };
}

interface UseCurrentGameReturn {
    isLoading: boolean;
    roundRecord: RoundRecord | null;
    error: unknown;
    gameState: CurrentGameState;
}

const REFRESH_INTERVAL = 1000;

const formatTime = (ms: number): FormattedTime => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return {
        minutes,
        seconds: remainingSeconds,
        formatted: `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`,
        shortFormat: `${minutes}m ${remainingSeconds}s`,
        longFormat: `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ${remainingSeconds} ${remainingSeconds === 1 ? 'second' : 'seconds'}`,
        raw: ms
    };
};

export const useCurrentGame = (): {
    roundRecord: RoundRecord | null;
    isLoading: boolean;
} => {

    const [type, setType] = useGameType();
    const {
        data,
        isLoading,
        isSuccess,
    }: UseQueryResult<RoundRecordResponse, unknown> = useGetCurrentRoundRecord(type);

    const roundRecord = useMemo(() => {
        // Only compute when data is successfully loaded
        if (!isSuccess || !data?.data.roundRecords?.[0]) {
            return null;
        }

        // Create RoundRecord only when necessary
        return new RoundRecord(data.data.roundRecords[0]);
    }, [data?.data.roundRecords?.[0], isSuccess]); // More precise dependency

    return {
        roundRecord,
        isLoading,
    };
};

export const useGameState = (roundRecord: RoundRecord | null) => {
    const [gameState, setGameState] = useState({
        placeTimeLeft: formatTime(0),
        gameTimeLeft: formatTime(0),
        isPlaceOver: false,
        isGameOver: false,
    });

    useEffect(() => {
        if (!roundRecord) return;

        const updateTimes = () => {
            const now = new Date().getTime();
            const placeEnd = new Date(roundRecord.placementEndTime).getTime();
            const gameEnd = new Date(roundRecord.endTime).getTime();

            setGameState({
                placeTimeLeft: formatTime(Math.max(0, placeEnd - now)),
                gameTimeLeft: formatTime(Math.max(0, gameEnd - now)),
                isPlaceOver: now >= placeEnd,
                isGameOver: now >= gameEnd,
            });
        };

        updateTimes();
        const intervalId = setInterval(updateTimes, REFRESH_INTERVAL);

        return () => {
            clearInterval(intervalId);
        };
    }, [roundRecord]); // Only re-run when `roundRecord` changes

    return gameState;
};

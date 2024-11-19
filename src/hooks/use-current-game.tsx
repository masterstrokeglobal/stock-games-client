import { useMemo, useEffect, useState } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { RoundRecord } from '@/models/round-record';
import { useGetCurrentRoundRecord } from '@/react-query/round-record-queries';
import { SchedulerType } from '@/models/market-item';

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

export const useCurrentGame = (type: SchedulerType): UseCurrentGameReturn => {
    const {
        data,
        error,
        isLoading,
        isSuccess,
    }: UseQueryResult<RoundRecordResponse, unknown> = useGetCurrentRoundRecord(type);

    const [gameState, setGameState] = useState<CurrentGameState>({
        placeTimeLeft: formatTime(0),
        gameTimeLeft: formatTime(0),
        isPlaceOver: false,
        isGameOver: false,
    });

    const [derivedError, setDerivedError] = useState<unknown>(null);

    const roundRecord = useMemo(() => {
        if (!isSuccess) {
            return null;
        }

        if (data?.data.roundRecords?.[0]) {
            return new RoundRecord(data.data.roundRecords[0]);
        }

        // If no round records are found, set derivedError to indicate an issue.
        setDerivedError(new Error('No round records found.'));
        return null;
    }, [data, isSuccess]);

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
        return () => clearInterval(intervalId);
    }, [roundRecord]);

    return {
        isLoading,
        roundRecord,
        error: error || derivedError, // Combine API error and derived error.
        gameState,
    };
};

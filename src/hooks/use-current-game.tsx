import { RoundRecord } from '@/models/round-record';
import { useGetCurrentRoundRecord } from '@/react-query/round-record-queries';
import { useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useGameType } from './use-game-type';
import { useGetMyPlacements } from '@/react-query/game-record-queries';
import GameRecord from '@/models/game-record';

interface FormattedTime {
    minutes: number;
    seconds: number;
    formatted: string;      // "MM:SS" format
    shortFormat: string;    // "1m 30s" format
    longFormat: string;     // "1 minute 30 seconds" format
    raw: number;           // milliseconds
}

interface RoundRecordResponse {
    data: {
        roundRecords: RoundRecord[];
    };
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
    const queryClient = useQueryClient();
    const [type] = useGameType();
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
        const roundRecord = new RoundRecord(data.data.roundRecords[0]);

        return roundRecord;
    }, [data?.data.roundRecords?.[0], isSuccess]);

    useEffect(() => {

        if (!roundRecord) return;

        // adding 2 seconds to the time to fetch intial price values
        const timeToPlace = new Date(roundRecord.placementEndTime).getTime() - new Date().getTime() + 4000;

        // adding 2 seconds delay for round creation
        const timeToGameEnd = new Date(roundRecord.endTime).getTime() - new Date().getTime() + 13000;

        const gameEnd = setTimeout(() => {
            console.log('game end');
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === 'current-round-record';
                },
            });
        }, timeToGameEnd);

        const placeEnd = setTimeout(() => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === 'current-round-record';
                },
            });
        }, timeToPlace);

        return () => {
            clearTimeout(gameEnd);
            clearTimeout(placeEnd);
        };


    }, [roundRecord]);


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

export const useIsPlaceOver = (roundRecord: RoundRecord | null) => {
    const [isPlaceOver, setIsPlaceOver] = useState(false);

    useEffect(() => {
        if (!roundRecord) {
            setIsPlaceOver(false);
            return;
        }

        const checkPlaceOver = () => {
            const now = new Date().getTime();
            const placeEnd = new Date(roundRecord.placementEndTime).getTime();

            const gameEnd = new Date(roundRecord.endTime).getTime();

            if (now >= placeEnd != isPlaceOver)
                setIsPlaceOver(now >= placeEnd);


            if (now >= gameEnd)
                setIsPlaceOver(false);
        };

        // Initial check
        checkPlaceOver();

        // Set up an interval to check periodically, but less frequently
        const intervalId = setInterval(checkPlaceOver, 1000); // Check every second

        return () => {
            clearInterval(intervalId);
        };
    }, [roundRecord]); // Only re-run when roundRecord changes

    return isPlaceOver;
};





export const useShowResults = (roundRecord: RoundRecord | null) => {
    const [showResults, setShowResults] = useState(false);
    const [currentRoundId, setCurrentRoundId] = useState<number | null>(null);
    const [previousRoundId, setPreviousRoundId] = useState<number | null>(null);
    const { data: placementData, isSuccess } = useGetMyPlacements({ roundId: previousRoundId });

    const bettedChips = useMemo(() => {
        if (!isSuccess) return [];
        const gameRecords: GameRecord[] = placementData.data.map((record: Partial<GameRecord>) => new GameRecord(record));
        const chips = gameRecords.map((record) => ({
            type: record.placementType,
            amount: record.amount,
            numbers: record.market,
        }));
        return chips;
    }, [placementData]);

    useEffect(() => {
        // Retrieve previous round ID from localStorage when the component mounts
        const storedPreviousRoundId = sessionStorage.getItem('previousRoundId');
        if (storedPreviousRoundId) {
            setPreviousRoundId(parseInt(storedPreviousRoundId, 10));
        }
    }, []); // Run only on mount

    useEffect(() => {
        if (!roundRecord) return;

        // Check if the round has changed
        if (roundRecord.id !== currentRoundId) {
            // Update the previous round ID
            if (currentRoundId) {
                sessionStorage.setItem('previousRoundId', currentRoundId.toString());
                setPreviousRoundId(currentRoundId);
            }

            setCurrentRoundId(roundRecord.id);
        }

        const updateShowResults = () => {
            const now = new Date().getTime();
            const gameEnd = new Date(roundRecord.endTime).getTime();
            const adjustedEndTime = gameEnd + 3000;
            const THIRTY_SECONDS = 30000;

            if (now >= adjustedEndTime - THIRTY_SECONDS) {
                setShowResults(false);
                setPreviousRoundId(roundRecord.id);
            }


            console.log('showing results', now >= adjustedEndTime);

            if (now >= adjustedEndTime && bettedChips.length > 0) {
                console.log('showing results', now >= adjustedEndTime, bettedChips);
                setShowResults(true);
            }
        };

        updateShowResults();
        const intervalId = setInterval(updateShowResults, REFRESH_INTERVAL);

        return () => {
            clearInterval(intervalId);
        };
    }, [roundRecord, currentRoundId]); // Re-run when `roundRecord` or `currentRoundId` changes

    return { showResults, currentRoundId, previousRoundId };
};



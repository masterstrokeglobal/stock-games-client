import { SchedulerType } from '@/models/market-item';
import { RoundRecord, RoundRecordGameType } from '@/models/round-record';
import { useGetCurrentRoundRecord } from '@/react-query/round-record-queries';
import { useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useGameType } from './use-game-type';
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

export const useCurrentGame = (gameType: RoundRecordGameType = RoundRecordGameType.DERBY): {
    roundRecord: RoundRecord | null;
    isLoading: boolean;
} => {
    const queryClient = useQueryClient();
    const [type] = useGameType();
    const {
        data,
        isLoading,
        isSuccess,
    }: UseQueryResult<RoundRecordResponse, unknown> = useGetCurrentRoundRecord(type, gameType);

    const roundRecord = useMemo(() => {
        // Only compute when data is successfully loaded
        if (!isSuccess || !data?.data?.roundRecords?.[0]) {
            return null;
        }

        // Create RoundRecord only when necessary
        const roundRecord = new RoundRecord(data.data.roundRecords[0]);
  
        /*
        gold, color5: market index [20] wheel index [0] 
        red color1: [market index 0, 3, 6, 9, 12, 15, 18 ] wheel index [2, 5, 8,11, 14, 17 ]
        green color2: [market index 1, 4, 7, 10, 13,16 ] wheel index [3, 6, 9, 12, 15, 19]
        blue color3: [market index 2, 8, 14, 19 ] wheel index [1, 7,13, 18]
        purple color4: [market index 5, 11, 17 ] wheel index [4, 10, 16]
        
        */


        // Function to rearrange markets according to wheel position mapping
        const rearrangeMarketsForWheel = (markets: any[]) => {
            if (markets.length !== 21) return markets; // Safety check
            
            // Mapping: wheelIndex -> marketIndex
            const wheelToMarketMapping = [
                20, // wheel index 0 -> market index 20 (gold)
                2,  // wheel index 1 -> market index 2 (blue)
                0,  // wheel index 2 -> market index 0 (red)
                1,  // wheel index 3 -> market index 1 (green)
                5,  // wheel index 4 -> market index 5 (purple)
                3,  // wheel index 5 -> market index 3 (red)
                4,  // wheel index 6 -> market index 4 (green)
                8,  // wheel index 7 -> market index 8 (blue)
                6,  // wheel index 8 -> market index 6 (red)
                7,  // wheel index 9 -> market index 7 (green)
                11, // wheel index 10 -> market index 11 (purple)
                9,  // wheel index 11 -> market index 9 (red)
                10, // wheel index 12 -> market index 10 (green)
                14, // wheel index 13 -> market index 14 (blue)
                12, // wheel index 14 -> market index 12 (red)
                13, // wheel index 15 -> market index 13 (green)
                17, // wheel index 16 -> market index 17 (purple)
                15, // wheel index 17 -> market index 15 (red)
                19, // wheel index 18 -> market index 19 (blue)
                16, // wheel index 19 -> market index 16 (green)
                18  // wheel index 20 -> market index 18 (red)
            ];
            
            // Create new array with markets in wheel order
            const rearrangedMarkets = wheelToMarketMapping.map(marketIndex => markets[marketIndex]);
            
            return rearrangedMarkets;
        };
        
        // Apply the rearrangement to the market array
        if (roundRecord.market && Array.isArray(roundRecord.market) && roundRecord.roundRecordGameType === RoundRecordGameType.WHEEL_OF_FORTUNE) {
            roundRecord.market = rearrangeMarketsForWheel(roundRecord.market);
        }

        return roundRecord;
    }, [data?.data?.roundRecords?.[0], isSuccess]);

    console.log("Current Round Record:", roundRecord);

    useEffect(() => {

        if (!roundRecord) return;

        // adding 2 seconds to the time to fetch intial price values
        const timeToPlace = new Date(roundRecord.placementEndTime).getTime() - new Date().getTime() + 4000;

        // adding 2 seconds delay for round creation
        let timeToGameEnd = new Date(roundRecord.endTime).getTime() - new Date().getTime() + 8000;

        if ((roundRecord.roundRecordGameType === RoundRecordGameType.STOCK_SLOTS || roundRecord.roundRecordGameType === RoundRecordGameType.STOCK_JACKPOT) && roundRecord.type === SchedulerType.NSE ) {
            timeToGameEnd = new Date(roundRecord.endTime).getTime() - new Date().getTime() + 18000;
        }

        const gameEnd = setTimeout(() => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === 'current-round-record' || query.queryKey[0] === 'myPlacements' || query.queryKey[0] === "user" && query.queryKey[1] == 'wallet';
                },
            });
        }, timeToGameEnd);

        const placeEnd = setTimeout(() => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === 'current-round-record' || query.queryKey[0] === 'myPlacements' || query.queryKey[0] === "user" && query.queryKey[1] == 'wallet';
                },
            });
        }, timeToPlace);

        const interval = setInterval(() => {
            timeToGameEnd = new Date(roundRecord.endTime).getTime() - new Date().getTime() + 15000;
        }, 1000);
        return () => {
            clearTimeout(gameEnd);
            clearTimeout(placeEnd);
            clearInterval(interval);
        };


    }, [roundRecord]);


    return {
        roundRecord,
        isLoading,
    };
};

export const useGameState = (roundRecord: RoundRecord | null) => {
    const [gameState, setGameState] = useState({
        placeStartTimeLeft: formatTime(0),
        placeTimeLeft: formatTime(0),
        gameTimeLeft: formatTime(0),
        isPlaceOver: false,
        isPlaceStarted: false,
        isGameOver: false,
    });

    useEffect(() => {
        if (!roundRecord) return;

        const updateTimes = () => {
            const now = new Date().getTime();
            const placeEnd = new Date(roundRecord.placementEndTime).getTime();
            const gameEnd = new Date(roundRecord.endTime).getTime();
            const placeStart = new Date(roundRecord.placementStartTime).getTime();
            const isPlaceStarted = now >= placeStart;


            setGameState({
                placeTimeLeft: formatTime(Math.max(0, placeEnd - now)),
                gameTimeLeft: formatTime(Math.max(0, gameEnd - now)),
                placeStartTimeLeft: formatTime(Math.max(0, placeStart - now)),
                isPlaceOver: now >= placeEnd,
                isPlaceStarted: isPlaceStarted,
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

export const useShowResults = (roundRecord: RoundRecord | null, bettedChips: any[]) => {
    const [showResults, setShowResults] = useState(false);
    const [currentRoundId, setCurrentRoundId] = useState<number | null>(null);
    const [previousRoundId, setPreviousRoundId] = useState<number | null>(null);

    useEffect(() => {
        // Retrieve previous round ID from localStorage when the component mounts
        const storedPreviousRoundId = sessionStorage.getItem(`game-previous-Round-${roundRecord?.roundRecordGameType}`);
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
                sessionStorage.setItem(`game-previous-Round-${roundRecord.roundRecordGameType}`, currentRoundId.toString());
                setPreviousRoundId(currentRoundId);
            }

            setCurrentRoundId(roundRecord.id);
        }

        const updateShowResults = () => {
            const now = new Date().getTime();
            const gameEnd = new Date(roundRecord.endTime).getTime();
            const adjustedEndTime = gameEnd + 3000;
            const EMD_TIME = 30000;

            if (now >= adjustedEndTime - EMD_TIME) {
                setShowResults(false);
                if (roundRecord.id !== previousRoundId) {
                    setPreviousRoundId(roundRecord.id);
                }
            }
            if (now >= adjustedEndTime && bettedChips.length > 0) {
                setShowResults(true);
            }
        };

        const intervalId = setInterval(updateShowResults, REFRESH_INTERVAL);

        return () => {
            clearInterval(intervalId);
        };
    }, [roundRecord, currentRoundId, bettedChips]);

    return { showResults, currentRoundId, previousRoundId };
};


export const usePlacementOver = (roundRecord: RoundRecord | null) => {

    const [isPlaceOver, setIsPlaceOver] = useState(false);

    useEffect(() => {
        if (!roundRecord) {
            setIsPlaceOver(false);
            return;
        }

        const checkPlaceOver = () => {
            const now = new Date().getTime();
            const placeEnd = new Date(roundRecord.placementEndTime).getTime();

            if (now >= placeEnd != isPlaceOver)
                setIsPlaceOver(now >= placeEnd);
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



"use client"
import TimeDisplay from '@/components/common/bet-locked-banner';
import GameLoadingScreen from '@/components/common/game-loading-screen';
import MarketSelector from '@/components/common/market-selector';
import { BettingArea } from '@/components/features/wheel-of-fortune/betting-area';
import GameBoard from '@/components/features/wheel-of-fortune/game-board';
import { StockPriceDisplay } from '@/components/features/wheel-of-fortune/stock-price';
import { useCurrentGame } from '@/hooks/use-current-game';
import { useMarketSelector } from '@/hooks/use-market-selector';
import { RoundRecord, RoundRecordGameType } from '@/models/round-record';
import { useGetRoundRecordById } from '@/react-query/round-record-queries';
import { useEffect, useMemo, useState } from 'react';


const WheelOfFortune = () => {
    const { marketSelected } = useMarketSelector();
    const [betAmount, setBetAmount] = useState<number>(100);
    const {
        roundRecord,
        isLoading
    } = useCurrentGame(RoundRecordGameType.WHEEL_OF_FORTUNE);
    // const roundRecord = useMemo(() => RoundRecord.fromAPI(roundRecordData), []);

    const { refetch, data, isSuccess } = useGetRoundRecordById(roundRecord?.id);

    useEffect(() => {
        if (!roundRecord) return;
        const resultFetchTime = new Date(roundRecord.endTime).getTime() - new Date().getTime() + 3000;

        const timer = setTimeout(() => {
            refetch();
        }, resultFetchTime);
        return () => clearTimeout(timer);
    }, [roundRecord, refetch]);

    const winningMarketId: number[] | null = useMemo(() => {
        if (!isSuccess) return null;
        if (roundRecord?.id == data?.data?.id) return (data.data as RoundRecord).winningId || null;
        return null;
    }, [data, isSuccess, roundRecord]);


    if (!marketSelected) return <MarketSelector className='min-h-[calc(100svh-100px)] max-w-2xl mx-auto' title="Wheel of Fortune Market" />

    if (isLoading || !roundRecord) return <GameLoadingScreen className='min-h-[calc(100svh-100px)]' />

    return (
        <section className="flex flex-col  items-center justify-center min-h-[calc(100svh-100px)]">
            <div className="flex flex-col min-h-screen max-w-2xl w-full mx-auto bg-gray-900 border border-gray-600 rounded-lg text-white overflow-hidden">
                <StockPriceDisplay roundRecord={roundRecord} winningMarketId={winningMarketId} />
                <GameBoard roundRecord={roundRecord} amount={betAmount}>
                    <TimeDisplay className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-full max-w-sm  " roundRecord={roundRecord} />
                </GameBoard>
                <BettingArea betAmount={betAmount} setBetAmount={setBetAmount} roundRecord={roundRecord} />
            </div>
        </section>
    );
};

export default WheelOfFortune;

// const roundRecordData = RoundRecord.fromAPI({
//         "id": 141852,
//         "startTime": "2025-05-22T09:56:00.397Z",
//         "companyId": 4,
//         "endTime": "2025-05-22T09:58:00.397Z",
//         "placementStartTime": "2025-05-22T09:56:00.397Z",
//         "placementEndTime": "2025-05-22T09:56:30.397Z",
//         "market": [
//             {
//                 "id": 3,
//                 "type": "nse",
//                 "active": true,
//                 "name": "National Aluminium Company Ltd.",
//                 "oddsMultiplier": 1,
//                 "code": "NATIONALUM",
//                 "createdAt": "2024-11-18T13:23:14.868Z",
//                 "placementAllowed": true,
//                 "updatedAt": "2025-04-25T00:31:58.139Z",
//                 "deletedAt": null,
//                 "horse": 1
//             },
//             {
//                 "id": 11,
//                 "type": "nse",
//                 "active": true,
//                 "name": "Coal India Ltd.",
//                 "oddsMultiplier": 1,
//                 "code": "COALINDIA",
//                 "createdAt": "2024-11-18T13:23:14.868Z",
//                 "placementAllowed": true,
//                 "updatedAt": "2024-11-18T13:23:14.868Z",
//                 "deletedAt": null,
//                 "horse": 2
//             },
//             {
//                 "id": 49,
//                 "type": "nse",
//                 "active": true,
//                 "name": "State Bank of India",
//                 "oddsMultiplier": 1,
//                 "code": "SBIN",
//                 "createdAt": "2025-01-06T03:25:03.985Z",
//                 "placementAllowed": true,
//                 "updatedAt": "2025-01-27T04:20:12.933Z",
//                 "deletedAt": null,
//                 "horse": 3
//             },
//             {
//                 "id": 36,
//                 "type": "nse",
//                 "active": true,
//                 "name": "Ambuja Cements Ltd.",
//                 "oddsMultiplier": 1,
//                 "code": "AMBUJACEM",
//                 "createdAt": "2024-11-18T13:23:14.868Z",
//                 "placementAllowed": true,
//                 "updatedAt": "2025-04-25T00:32:31.093Z",
//                 "deletedAt": null,
//                 "horse": 4
//             },
//             {
//                 "id": 39,
//                 "type": "nse",
//                 "active": true,
//                 "name": "Bosch Ltd.",
//                 "oddsMultiplier": 1,
//                 "code": "BOSCHLTD",
//                 "createdAt": "2024-11-18T13:23:14.868Z",
//                 "placementAllowed": true,
//                 "updatedAt": "2025-04-25T00:32:32.721Z",
//                 "deletedAt": null,
//                 "horse": 5
//             },
//             {
//                 "id": 7,
//                 "type": "nse",
//                 "active": true,
//                 "name": "Ashok Leyland Ltd.",
//                 "oddsMultiplier": 1,
//                 "code": "ASHOKLEY",
//                 "createdAt": "2024-11-18T13:23:14.868Z",
//                 "placementAllowed": true,
//                 "updatedAt": "2025-04-25T00:32:09.772Z",
//                 "deletedAt": null,
//                 "horse": 6
//             },
//             {
//                 "id": 43,
//                 "type": "nse",
//                 "active": true,
//                 "name": "HDFC Bank Ltd.",
//                 "oddsMultiplier": 1,
//                 "code": "HDFCBANK",
//                 "createdAt": "2025-01-06T03:21:47.256Z",
//                 "placementAllowed": true,
//                 "updatedAt": "2025-01-06T03:31:42.996Z",
//                 "deletedAt": null,
//                 "horse": 7
//             },
//             {
//                 "id": 5,
//                 "type": "nse",
//                 "active": true,
//                 "name": "Tata Steel Ltd.",
//                 "oddsMultiplier": 1,
//                 "code": "TATASTEEL",
//                 "createdAt": "2024-11-18T13:23:14.868Z",
//                 "placementAllowed": true,
//                 "updatedAt": "2025-04-25T00:32:08.115Z",
//                 "deletedAt": null,
//                 "horse": 8
//             },
//             {
//                 "id": 1,
//                 "type": "nse",
//                 "active": true,
//                 "name": "NIFTY",
//                 "oddsMultiplier": 1,
//                 "code": "NIFTY",
//                 "createdAt": "2024-11-18T12:40:55.208Z",
//                 "placementAllowed": true,
//                 "updatedAt": "2025-03-24T01:23:26.723Z",
//                 "deletedAt": null,
//                 "horse": 9
//             },
//             {
//                 "id": 17,
//                 "type": "nse",
//                 "active": true,
//                 "name": "Shriram Finance Ltd.",
//                 "oddsMultiplier": 1,
//                 "code": "SHRIRAMFIN",
//                 "createdAt": "2024-11-18T13:23:14.868Z",
//                 "placementAllowed": true,
//                 "updatedAt": "2025-04-25T00:32:29.591Z",
//                 "deletedAt": null,
//                 "horse": 10
//             },
//             {
//                 "id": 16,
//                 "type": "nse",
//                 "active": true,
//                 "name": "Reliance Industries Ltd.",
//                 "oddsMultiplier": 1,
//                 "code": "RELIANCE",
//                 "createdAt": "2024-11-18T13:23:14.868Z",
//                 "placementAllowed": true,
//                 "updatedAt": "2025-04-25T00:32:28.055Z",
//                 "deletedAt": null,
//                 "horse": 11
//             },
//             {
//                 "id": 45,
//                 "type": "nse",
//                 "active": true,
//                 "name": "Titan Company Limited",
//                 "oddsMultiplier": 1,
//                 "code": "TITAN",
//                 "createdAt": "2025-01-06T03:22:47.265Z",
//                 "placementAllowed": true,
//                 "updatedAt": "2025-04-04T02:04:53.146Z",
//                 "deletedAt": null,
//                 "horse": 12
//             },
//             {
//                 "id": 53,
//                 "type": "nse",
//                 "active": true,
//                 "name": "HCL Technologies Limited",
//                 "oddsMultiplier": 1,
//                 "code": "HCLTECH",
//                 "createdAt": "2025-01-06T03:37:42.280Z",
//                 "placementAllowed": false,
//                 "updatedAt": "2025-04-15T02:02:28.268Z",
//                 "deletedAt": null,
//                 "horse": 13
//             },
//             {
//                 "id": 18,
//                 "type": "nse",
//                 "active": true,
//                 "name": "Wipro Ltd.",
//                 "oddsMultiplier": 1,
//                 "code": "WIPRO",
//                 "createdAt": "2024-11-18T13:23:14.868Z",
//                 "placementAllowed": true,
//                 "updatedAt": "2025-04-15T02:07:19.515Z",
//                 "deletedAt": null,
//                 "horse": 14
//             },
//             {
//                 "id": 66,
//                 "type": "nse",
//                 "active": true,
//                 "name": "Adani Enterprise",
//                 "oddsMultiplier": 1,
//                 "code": "ADANIENT",
//                 "createdAt": "2025-04-25T01:04:57.745Z",
//                 "placementAllowed": true,
//                 "updatedAt": "2025-04-25T01:04:57.745Z",
//                 "deletedAt": null,
//                 "horse": 15
//             },
//             {
//                 "id": 67,
//                 "type": "nse",
//                 "active": true,
//                 "name": "Adani Ports & SEZ",
//                 "oddsMultiplier": 1,
//                 "code": "ADANIPORTS",
//                 "createdAt": "2025-04-25T01:05:06.205Z",
//                 "placementAllowed": true,
//                 "updatedAt": "2025-04-25T01:05:06.205Z",
//                 "deletedAt": null,
//                 "horse": 16
//             },
//             {
//                 "id": 71,
//                 "type": "nse",
//                 "active": true,
//                 "name": "Apollo Hospital",
//                 "oddsMultiplier": 1,
//                 "code": "APOLLOHOSP",
//                 "createdAt": "2025-04-25T01:05:26.025Z",
//                 "placementAllowed": true,
//                 "updatedAt": "2025-04-25T01:05:26.025Z",
//                 "deletedAt": null,
//                 "horse": 17
//             },
//             {
//                 "id": 18,
//                 "type": "nse",
//                 "active": true,
//                 "name": "Wipro Ltd.",
//                 "oddsMultiplier": 1,
//                 "code": "WIPRO",
//                 "createdAt": "2024-11-18T13:23:14.868Z",
//                 "placementAllowed": true,
//                 "updatedAt": "2025-04-15T02:07:19.515Z",
//                 "deletedAt": null,
//                 "horse": 14
//             },
//             {
//                 "id": 66,
//                 "type": "nse",
//                 "active": true,
//                 "name": "Adani Enterprise",
//                 "oddsMultiplier": 1,
//                 "code": "ADANIENT",
//                 "createdAt": "2025-04-25T01:04:57.745Z",
//                 "placementAllowed": true,
//                 "updatedAt": "2025-04-25T01:04:57.745Z",
//                 "deletedAt": null,
//                 "horse": 15
//             },
//             {
//                 "id": 67,
//                 "type": "nse",
//                 "active": true,
//                 "name": "Adani Ports & SEZ",
//                 "oddsMultiplier": 1,
//                 "code": "ADANIPORTS",
//                 "createdAt": "2025-04-25T01:05:06.205Z",
//                 "placementAllowed": true,
//                 "updatedAt": "2025-04-25T01:05:06.205Z",
//                 "deletedAt": null,
//                 "horse": 16
//             },
//             {
//                 "id": 71,
//                 "type": "nse",
//                 "active": true,
//                 "name": "Apollo Hospital",
//                 "oddsMultiplier": 1,
//                 "code": "APOLLOHOSP",
//                 "createdAt": "2025-04-25T01:05:26.025Z",
//                 "placementAllowed": true,
//                 "updatedAt": "2025-04-25T01:05:26.025Z",
//                 "deletedAt": null,
//                 "horse": 17
//             }
//         ],
//         "type": "nse",
//         "winningId": [7],
//         "createdAt": "2025-05-22T09:56:00.414Z",
//         "updatedAt": "2025-05-22T09:58:01.627Z",
//         "roundRecordGameType": "wheel_of_fortune",
//         "gameType": "wheel_of_fortune"
//     })

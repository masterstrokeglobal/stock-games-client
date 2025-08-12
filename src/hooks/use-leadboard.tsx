import MarketItem, { NSEMarketItem, SchedulerType } from '@/models/market-item';
import { RoundRecord } from '@/models/round-record';
import LeaderboardSocketManager from '@/services/leaderboard-websocket';
import { useEffect, useRef, useState } from 'react';

export interface RankedMarketItem extends MarketItem {
    change_percent: string;
    rank: number;
    price: number;
    initialPrice?: number;
}

export const useLeaderboard = (roundRecord: RoundRecord | null) => {
    const [stocks, setStocks] = useState<RankedMarketItem[]>(roundRecord?.market as RankedMarketItem[] || []);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
    const latestDataRef = useRef<RankedMarketItem[]>(roundRecord?.market.map((item) => ({
        ...item,
        change_percent: '0',
        price: roundRecord?.initialValues?.[item.bitcode?.toLocaleLowerCase() as string] || 0,
        initialPrice: roundRecord?.initialValues?.[item.bitcode?.toLocaleLowerCase() as string] || 0,
        stream: item.stream,
        bitcode: item.bitcode,
        codeName: item.codeName,
        currency: item.currency,
        horse: item.horse,
    })) as RankedMarketItem[] || []);
    const initialPricesRef = useRef<Map<string, number>>(new Map());

    const getRoundStatus = () => {
        if (!roundRecord) return 'pre-tracking';
        const now = new Date();
        if (now < roundRecord.placementEndTime) {
            return 'pre-tracking';
        } else if (now >= roundRecord.placementEndTime && now <= roundRecord.endTime) {
            return 'tracking';
        } else {
            return 'completed';
        }
    };

    const calculateRanks = (items: RankedMarketItem[]) => {
        const rankedMarketItem = [...items]
            .sort((a, b) => {
                const changeA = parseFloat(a.change_percent || '0');
                const changeB = parseFloat(b.change_percent || '0');
                return changeB - changeA;
            })
            .map((item, index) => ({
                ...item,
                rank: index + 1,
                stream: item.stream,
                bitcode: item.bitcode,
                codeName: item.codeName,
                currency: item.currency,
                horse: item.horse,
                type: item.type,
                active: item.active,
                name: item.name,
                id: item.id
            })) as RankedMarketItem[];

        return rankedMarketItem;
    };

    const processPrice = (bitcode: string, currentPrice: number) => {
        if (!roundRecord) return { initialPrice: currentPrice, changePercent: '0' };
        const roundStatus = getRoundStatus();
        const key = roundRecord.type === SchedulerType.CRYPTO ? bitcode.toLocaleLowerCase() : bitcode.toUpperCase();

        if (roundStatus === 'tracking' && roundRecord.initialValues && roundRecord.initialValues[key] === undefined) {
            initialPricesRef.current.set(bitcode, currentPrice);
            return { initialPrice: currentPrice, changePercent: '0' };
        }
        if (roundStatus === 'tracking' && roundRecord.initialValues && roundRecord.initialValues[key]) {
            const initialPrice = roundRecord.initialValues ? roundRecord.initialValues[key] : undefined;

            if (initialPrice === undefined) {
                console.log('No initial price found for', key);
                return { initialPrice: currentPrice, changePercent: '0' };
            }

            const changePercent = ((currentPrice - initialPrice) / initialPrice * 100).toFixed(5);
            return { initialPrice, changePercent };
        }

        return { initialPrice: currentPrice, changePercent: '0' };
    };

    const processSocketData = (data: any) => {
        if (!roundRecord) return;

        if (roundRecord.type === SchedulerType.CRYPTO) {
            const streamData = data;
            if (streamData && streamData.s) {
                const currentPrice = parseFloat(streamData.p);
                const { initialPrice, changePercent } = processPrice(
                    streamData.s,
                    currentPrice
                );
                latestDataRef.current = latestDataRef.current.map(stock => {
                    if (stock.bitcode === streamData.s) {
                        if (changePercent === undefined || changePercent === "NaN") {
                            return stock;
                        }
                        return {
                            ...stock,
                            price: currentPrice,
                            change_percent: changePercent,
                            initialPrice: initialPrice,
                            rank: stock.rank,
                            currency: stock.currency,
                            stream: stock.stream,
                            bitcode: stock.bitcode,
                            codeName: stock.codeName
                        };
                    }
                    return stock;
                });

                if (getRoundStatus() === 'tracking') {
                    latestDataRef.current = calculateRanks(latestDataRef.current);
                }
            }
        } else if (roundRecord.type === SchedulerType.NSE || roundRecord.type === SchedulerType.USA_MARKET) {
            const changes = data as any[];
            if (Array.isArray(changes) && changes.length === 0) return;

            const changedStocks = changes.map(change => new NSEMarketItem(change));

            changedStocks.forEach(changeStock => {
                if (!latestDataRef.current.some(stock => stock.bitcode === changeStock.code)) {
                    return;
                }
                const currentPrice = parseFloat(changeStock.price.toString());
                const { initialPrice, changePercent } = processPrice(
                    changeStock.code,
                    currentPrice
                );

                latestDataRef.current = latestDataRef.current.map(stock => {
                    if (stock.bitcode === changeStock.code) {
                        return {
                            ...stock,
                            price: currentPrice,
                            change_percent: changePercent,
                            initialPrice: initialPrice,
                            rank: stock.rank,
                            stream: stock.stream,
                            bitcode: stock.bitcode,
                            codeName: stock.codeName,
                            currency: stock.currency,
                            horse: stock.horse,
                            type: stock.type,
                            active: stock.active,
                            name: stock.name,
                            id: stock.id
                        };
                    }
                    return stock;
                });

                if (getRoundStatus() === 'tracking') {
                    latestDataRef.current = calculateRanks(latestDataRef.current);
                }
            });
        } else if (roundRecord.type === SchedulerType.MCX) {
            const changes = data as any[];
            if (!Array.isArray(changes) || changes.length === 0) return;

            const innerData = changes[0];
            if (!Array.isArray(innerData)) return;

            const today = new Date();
            const contractsByCommodity: {
                [key: string]: Array<{ symbol: string; expiryDate: Date; price: number }>;
            } = {};

            for (let i = 0; i < innerData.length; i += 10) {
                const chunk = innerData.slice(i, i + 10);
                if (chunk.length >= 3 && chunk[0] !== "") {
                    const fullSymbol = chunk[0];
                    const symbolMatch = fullSymbol.match(
                        /^([A-Z]+M?)([0-9]{1,2}[A-Z]{3}(?:[0-9]{2})?)FUT$/
                    );

                    if (symbolMatch) {
                        const baseSymbol = symbolMatch[1];
                        const price = parseFloat(chunk[3]);

                        if (!isNaN(price)) {
                            if (!contractsByCommodity[baseSymbol]) {
                                contractsByCommodity[baseSymbol] = [];
                            }

                            contractsByCommodity[baseSymbol].push({
                                symbol: baseSymbol,
                                expiryDate: today,
                                price: price
                            });
                        }
                    }
                }
            }

            for (const commodity in contractsByCommodity) {
                const contracts = contractsByCommodity[commodity];
                if (contracts.length === 0) continue;

                const currentPrice = contracts[0].price;
                const { initialPrice, changePercent } = processPrice(
                    commodity,
                    currentPrice
                );

                latestDataRef.current = latestDataRef.current.map(stock => {
                    if (stock.bitcode === commodity) {
                        return {
                            ...stock,
                            price: currentPrice,
                            change_percent: changePercent,
                            initialPrice: initialPrice,
                            rank: stock.rank,
                            stream: stock.stream,
                            bitcode: stock.bitcode,
                            codeName: stock.codeName,
                            currency: stock.currency,
                            horse: stock.horse,
                            type: stock.type,
                            active: stock.active,
                            name: stock.name,
                            id: stock.id
                        };
                    }
                    return stock;
                });

                if (getRoundStatus() === 'tracking') {
                    latestDataRef.current = calculateRanks(latestDataRef.current);
                }
            }
        }
    };

    useEffect(() => {
        if (!roundRecord || roundRecord.market.length === 0) return;

        const socketManager = LeaderboardSocketManager.getInstance();

        // Set connection status to connecting
        setConnectionStatus('connecting');

        // Add listeners
        const onMessage = (data: any) => processSocketData(data);
        const onConnectionChange = (status: 'connecting' | 'connected' | 'disconnected') => {
            setConnectionStatus(status);
        };

        socketManager.addListener(roundRecord.type, onMessage);
        socketManager.addConnectionListener(roundRecord.type, onConnectionChange);

        // Set up interval to update stocks state
        const intervalId = setInterval(() => {
            setStocks([...latestDataRef.current]);
        }, 2000);

        return () => {
            socketManager.removeListener(roundRecord.type, onMessage);
            socketManager.removeConnectionListener(roundRecord.type, onConnectionChange);
            clearInterval(intervalId);
        };
    }, [roundRecord]);

    useEffect(() => {
        if (!roundRecord) return;
        setStocks(roundRecord.market as RankedMarketItem[]);
        latestDataRef.current = roundRecord.market as RankedMarketItem[];
    }, [roundRecord]);

    return {
        stocks,
        connectionStatus,
        roundStatus: getRoundStatus()
    };
};
import MarketItem, { NSEMarketItem, SchedulerType } from '@/models/market-item';
import { RoundRecord } from '@/models/round-record';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { parseCOMEXMessage } from './use-multi-socket-leaderboard';

export interface RankedMarketItem extends MarketItem {
    change_percent: string;
    rank: number;
    price: number;
    initialPrice?: number;
}

export const useLeaderboard = (roundRecord: RoundRecord | null) => {
    const [stocks, setStocks] = useState<RankedMarketItem[]>(roundRecord?.market as RankedMarketItem[] || []);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
    const socketRef = useRef<Socket | null>(null);
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

    const updateStockData = (bitcode: string, price: number) => {
        const { initialPrice, changePercent } = processPrice(bitcode, price);

        latestDataRef.current = latestDataRef.current.map(stock => {
            if (stock.bitcode === bitcode) {
                if (changePercent === undefined || changePercent === "NaN") {
                    return stock;
                }
                return {
                    ...stock,
                    price,
                    change_percent: changePercent,
                    initialPrice,
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
    };


    const handleCOMEXData = (data: any) => {
        const parsedPrices: { [key: string]: number } = parseCOMEXMessage(data);
        Object.entries(parsedPrices).forEach(([commodity, price]) => {
            console.log(latestDataRef.current.map(stock => stock.bitcode));
            if (latestDataRef.current.some(stock => stock.bitcode === commodity)) {
                updateStockData(commodity, price);
            }
        });
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

    useEffect(() => {
        if (!roundRecord) return;
        const connectSocket = () => {
            if (roundRecord?.market.length === 0) return;

            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }

            setConnectionStatus('connecting');
            let namespace = '';
            switch (roundRecord.type) {
                case SchedulerType.CRYPTO:
                    namespace = '/crypto';
                    break;
                case SchedulerType.NSE:
                    namespace = '/nse';
                    break;
                case SchedulerType.USA_MARKET:
                    namespace = '/usa';
                    break;
                case SchedulerType.MCX:
                    namespace = '/mcx';
                    break;
                case SchedulerType.COMEX:
                    namespace = '/comex';
                    break;
                default:
                    namespace = '';
            }
            if (!namespace) return;
            const url = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}${namespace}`;
            socketRef.current = io(url, { transports: ['websocket'] });

            socketRef.current.on('connect', () => {
                setConnectionStatus('connected');
            });
            socketRef.current.on('disconnect', () => {
                setConnectionStatus('disconnected');
            });

            socketRef.current.on('data', (messageEvent: any) => {
                const data = JSON.parse(messageEvent);
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
                } else if (roundRecord.type === SchedulerType.NSE) {
                    const changes = data as any[];
                    if (Array.isArray(changes) && changes.length === 0) return;

                    const changedStocks = changes.map(change => new NSEMarketItem(change));

                    changedStocks.map(changeStock => {
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
                } else if (roundRecord.type === SchedulerType.USA_MARKET) {
                    const changes = data as any[];
                    if (Array.isArray(changes) && changes.length === 0) return;

                    const changedStocks = changes.map(change => new NSEMarketItem(change));

                    changedStocks.map(changeStock => {
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
                else if (roundRecord.type === SchedulerType.COMEX) {
                    handleCOMEXData(data);
                }
            });
        };
        // Set up interval to update stocks state
        const intervalId = setInterval(() => {
            setStocks(latestDataRef.current);
        }, 2000);

        connectSocket();
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
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

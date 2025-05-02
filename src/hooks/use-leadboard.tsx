import MarketItem, { NSEMarketItem, SchedulerType } from '@/models/market-item';
import { RoundRecord } from '@/models/round-record';
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
    const socketRef = useRef<WebSocket | null>(null);
    const latestDataRef = useRef<RankedMarketItem[]>(roundRecord?.market as RankedMarketItem[] || []);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
    const initialPricesRef = useRef<Map<string, number>>(new Map());
    const roundEndCheckRef = useRef<NodeJS.Timeout>();


    const getRoundStatus = () => {
        if (!roundRecord) return 'pre-tracking';
        const now = new Date();
        if (now < roundRecord .placementEndTime) {
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
            })) as RankedMarketItem[]

        return rankedMarketItem;

    };

    const processPrice = (bitcode: string, currentPrice: number) => {
        if (!roundRecord) return { initialPrice: currentPrice, changePercent: '0' };
        const roundStatus = getRoundStatus();
        const key = roundRecord.type === SchedulerType.CRYPTO ? bitcode.toLocaleLowerCase() : bitcode.toUpperCase();

        // Set initial price exactly at placementEndTime
        if (roundStatus === 'tracking' && roundRecord.initialValues && roundRecord.initialValues[key] === undefined) {
            initialPricesRef.current.set(bitcode, currentPrice);
            return { initialPrice: currentPrice, changePercent: '0' };
        }

        // Calculate changes during tracking period
        if (roundStatus === 'tracking' && roundRecord.initialValues && roundRecord.initialValues[key]) {
            const   initialPrice = roundRecord.initialValues ? roundRecord.initialValues[key] : undefined;
         
            if (initialPrice === undefined) {
                console.log('No initial price found for', key);
                return { initialPrice: currentPrice, changePercent: '0' };
            }

            const changePercent = ((currentPrice - initialPrice) / initialPrice * 100).toFixed(5);
            return { initialPrice, changePercent };
        }

        // After round ends, maintain final values but stop updating
/*         if (roundStatus === 'completed') {
            const initialPrice = initialPricesRef.current.get(bitcode);
            return {
                initialPrice: initialPrice || currentPrice,
                changePercent: latestDataRef.current.find(s => s.bitcode === bitcode)?.change_percent || '0'
            };
        }
 */
        return { initialPrice: currentPrice, changePercent: '0' };
    };

    useEffect(() => {
        if (!roundRecord) return;
        const connectSocket = () => {
            if (roundRecord?.market.length === 0) return;

            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }

            try {
                setConnectionStatus('connecting');
                console.log('Connecting to WebSocket', roundRecord?.type);

                if (roundRecord?.type === SchedulerType.CRYPTO) {
                    socketRef.current = new WebSocket(process.env.NEXT_PUBLIC_CRYPTO_WEBSOCKET_URL as string);
                    socketRef.current.onopen = () => {
                        setConnectionStatus('connected');
                    };

                    socketRef.current.onmessage = (event) => {
                        try {
                            const obj = JSON.parse(event.data);
                            const streamData = obj;

                            if (streamData && streamData.s) {
                                const currentPrice = parseFloat(streamData.p);
                                const { initialPrice, changePercent } = processPrice(
                                    streamData.s,
                                    currentPrice
                                );

                                latestDataRef.current = latestDataRef.current.map(stock => {
                                    if (stock.bitcode === streamData.s) {
                                        return {
                                            ...stock,
                                            price: currentPrice,
                                            change_percent: changePercent,
                                            initialPrice: initialPrice,
                                            rank: stock.rank,
                                            currency: stock.currency,
                                            stream: stock.stream,
                                            bitcode: stock.bitcode,
                                            codeName: stock.codeName // Ensure codeName is included
                                        };
                                    }
                                    return stock;
                                });
                                if (getRoundStatus() === 'tracking') {
                                    latestDataRef.current = calculateRanks(latestDataRef.current);
                                }
                            }
                        } catch (error) {
                            console.error('Error processing WebSocket message:', error);
                        }
                    };
                }

                if (roundRecord.type === SchedulerType.NSE) {
                    socketRef.current = new WebSocket(process.env.NEXT_PUBLIC_NSE_WEBSOCKET_URL as string);
                    socketRef.current.onopen = () => {
                        setConnectionStatus('connected');
                        // Connection established - subscription messages can be sent here if needed
                    };

                    socketRef.current.onmessage = (message) => {
                        try {
                            const changes = JSON.parse(message.data as string) as any[];
                            if (Array.isArray(changes) && changes.length === 0) return;

                            const changedStocks = changes.map(change => new NSEMarketItem(change));

                            changedStocks.map(changeStock => {
                                // Skip stocks that are not in the initial list
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
                                        } 
                                    }
                                    return stock;
                                });

                                if (getRoundStatus() === 'tracking') {
                                    latestDataRef.current = calculateRanks(latestDataRef.current);
                                }
                            });

                        } catch (error) {
                            console.error('Error processing WebSocket message:', error);
                        }
                    };
                }
                if (roundRecord.type === SchedulerType.USA_MARKET) {
                    socketRef.current = new WebSocket(process.env.NEXT_PUBLIC_USA_WEBSOCKET_URL as string);
                    socketRef.current.onopen = () => {
                        setConnectionStatus('connected');
                        // Connection established - subscription messages can be sent here if needed
                    };

                    socketRef.current.onmessage = (message) => {
                        try {
                            const changes = JSON.parse(message.data as string) as any[];
                            if (Array.isArray(changes) && changes.length === 0) return;

                            const changedStocks = changes.map(change => new NSEMarketItem(change));

                            changedStocks.map(changeStock => {
                                // Skip stocks that are not in the initial list
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
                                        } 
                                    }
                                    return stock;
                                });

                                if (getRoundStatus() === 'tracking') {
                                    latestDataRef.current = calculateRanks(latestDataRef.current);
                                }
                            });

                        } catch (error) {
                            console.error('Error processing WebSocket message:', error);
                        }
                    };
                }
                if (roundRecord.type === SchedulerType.USA_MARKET) {
                    socketRef.current = new WebSocket(process.env.NEXT_PUBLIC_USA_WEBSOCKET_URL as string);
                    socketRef.current.onopen = () => {
                        setConnectionStatus('connected');
                        // Connection established - subscription messages can be sent here if needed
                    };

                    socketRef.current.onmessage = (message) => {
                        try {
                            const changes = JSON.parse(message.data as string) as any[];
                            if (Array.isArray(changes) && changes.length === 0) return;

                            const changedStocks = changes.map(change => new NSEMarketItem(change));

                            changedStocks.map(changeStock => {
                                // Skip stocks that are not in the initial list
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
                                            codeName: stock.codeName // Ensure codeName is included
                                        };
                                    }
                                    return stock;
                                });

                                if (getRoundStatus() === 'tracking') {
                                    latestDataRef.current = calculateRanks(latestDataRef.current);
                                }
                            });

                        } catch (error) {
                            console.error('Error processing WebSocket message:', error);
                        }
                    };
                }
            } catch (error) {
                console.error('Error creating WebSocket connection:', error);
                setConnectionStatus('disconnected');
            }

            if (socketRef.current == null)
                return;

            socketRef.current.onclose = () => {
                setConnectionStatus('disconnected');

                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                }

                reconnectTimeoutRef.current = setTimeout(() => {
                    if (socketRef.current?.readyState === WebSocket.CLOSED) {
                        connectSocket();
                    }
                }, 3000);
            };

            socketRef.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                setConnectionStatus('disconnected');
            };

        };

        // Initial connection
        connectSocket();

        // Set up interval to update stocks state
        const intervalId = setInterval(() => {
            setStocks(latestDataRef.current);
        }, 2000);

        // Set up round end check
        const checkRoundEnd = () => {
            const now = new Date();
            if (now >= roundRecord.endTime) {
                // Clean up after logging final prices
                if (socketRef.current) {
                    socketRef.current.close();
                }
                clearInterval(intervalId);
                return;
            }

            // Schedule next check
            roundEndCheckRef.current = setTimeout(checkRoundEnd, 1000);
        };

        // Start checking for round end
        checkRoundEnd();

        // Cleanup
        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (roundEndCheckRef.current) {
                clearTimeout(roundEndCheckRef.current);
            }
            if (socketRef.current) {
                socketRef.current.close();
            }
            clearInterval(intervalId);
            initialPricesRef.current.clear();
        };
    }, [roundRecord]);

    //update stocks on roundRecord change
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



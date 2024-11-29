import { useState, useEffect, useRef } from 'react';
import MarketItem, { SchedulerType } from '@/models/market-item';
import { RoundRecord } from '@/models/round-record';

interface RankedMarketItem extends MarketItem {
    change_percent: string;
    rank: number;
    price: number;
    initialPrice?: number;
}

export const useLeaderboard = (roundRecord: RoundRecord,type:SchedulerType) => {
    const [stocks, setStocks] = useState<RankedMarketItem[]>(roundRecord.market as RankedMarketItem[]);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
    const socketRef = useRef<WebSocket | null>(null);
    const latestDataRef = useRef<RankedMarketItem[]>(roundRecord.market as RankedMarketItem[]);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
    const initialPricesRef = useRef<Map<string, number>>(new Map());
    const roundEndCheckRef = useRef<NodeJS.Timeout>();

    const getRoundStatus = () => {
        const now = new Date();
        if (now < roundRecord.placementEndTime) {
            return 'pre-tracking';
        } else if (now >= roundRecord.placementEndTime && now <= roundRecord.endTime) {
            return 'tracking';
        } else {
            return 'completed';
        }
    };

    const logFinalPrices = () => {
        latestDataRef.current
            .sort((a, b) => parseFloat(b.change_percent) - parseFloat(a.change_percent))
            .forEach((stock, index) => {
                const initialPrice = stock.bitcode ? initialPricesRef.current.get(stock.bitcode) : undefined;
                console.log(
                    `${index + 1}. ${stock.bitcode}: ` +
                    `Initial: ${initialPrice?.toFixed(5)}, ` +
                    `Final: ${stock.price?.toFixed(5)}, ` +
                    `Change: ${stock.change_percent}%`
                );
            });
    };

    const calculateRanks = (items: RankedMarketItem[]) => {
        return [...items]
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
                codeName: item.codeName
            }));
    };

    const processPrice = (bitcode: string, currentPrice: number) => {
        const roundStatus = getRoundStatus();

        // Set initial price exactly at placementEndTime
        if (roundStatus === 'tracking' && !initialPricesRef.current.has(bitcode)) {
            initialPricesRef.current.set(bitcode, currentPrice);
            return { initialPrice: currentPrice, changePercent: '0' };
        }

        // Calculate changes during tracking period
        if (roundStatus === 'tracking' && initialPricesRef.current.has(bitcode)) {
            const initialPrice = roundRecord.initialValues ? roundRecord.initialValues[bitcode.toLocaleLowerCase()] : console.log('No initial values found');

            const changePercent = ((currentPrice - initialPrice) / initialPrice * 100).toFixed(5);
            return { initialPrice, changePercent };
        }

        // After round ends, maintain final values but stop updating
        if (roundStatus === 'completed') {
            const initialPrice = initialPricesRef.current.get(bitcode);
            return {
                initialPrice: initialPrice || currentPrice,
                changePercent: latestDataRef.current.find(s => s.bitcode === bitcode)?.change_percent || '0'
            };
        }

        return { initialPrice: currentPrice, changePercent: '0' };
    };

    useEffect(() => {
        const connectSocket = () => {
            if (roundRecord.market.length === 0) return;

            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }

            try {
                setConnectionStatus('connecting');
                socketRef.current = new WebSocket('wss://stream.binance.com:9443/stream');

                socketRef.current.onopen = () => {
                    setConnectionStatus('connected');
                    const streams = roundRecord.market.map(stock => stock.stream);

                    if (socketRef.current?.readyState === WebSocket.OPEN) {
                        socketRef.current.send(JSON.stringify({
                            method: "SUBSCRIBE",
                            params: streams,
                            id: 1
                        }));
                    }
                };

                socketRef.current.onmessage = (event) => {
                    try {
                        const obj = JSON.parse(event.data);
                        const streamData = obj.data;

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

            } catch (error) {
                console.error('Error creating WebSocket connection:', error);
                setConnectionStatus('disconnected');
            }
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
                logFinalPrices();
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

    return {
        stocks,
        connectionStatus,
        roundStatus: getRoundStatus()
    };
};
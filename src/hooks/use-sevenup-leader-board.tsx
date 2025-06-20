import MarketItem, { NSEMarketItem, SchedulerType } from '@/models/market-item';
import { RoundRecord, RoundRecordGameType } from '@/models/round-record';
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
    // For multi-market scenario, store multiple sockets
    const socketsRef = useRef<Map<SchedulerType, WebSocket>>(new Map());
    const latestDataRef = useRef<RankedMarketItem[]>(roundRecord?.market as RankedMarketItem[] || []);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
    const initialPricesRef = useRef<Map<string, number>>(new Map());
    const roundEndCheckRef = useRef<NodeJS.Timeout>();

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
            const initialPrice = roundRecord.initialValues ? roundRecord.initialValues[key] : undefined;

            if (initialPrice === undefined) {
                return { initialPrice: currentPrice, changePercent: '0' };
            }

            const changePercent = ((currentPrice - initialPrice) / initialPrice * 100).toFixed(5);
            return { initialPrice, changePercent };
        }

        return { initialPrice: currentPrice, changePercent: '0' };
    };

    // Generic function to update stock data
    const updateStockData = (bitcode: string, currentPrice: number) => {
        if (!latestDataRef.current.some(stock => stock.bitcode === bitcode)) {
            return;
        }

        const { initialPrice, changePercent } = processPrice(bitcode, currentPrice);

        latestDataRef.current = latestDataRef.current.map(stock => {
            if (stock.bitcode === bitcode) {
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
    };

    // Message handlers for different market types
    const handleCryptoMessage = (event: MessageEvent) => {
        try {
            const obj = JSON.parse(event.data);
            const streamData = obj;

            if (streamData && streamData.s) {
                const currentPrice = parseFloat(streamData.p);
                updateStockData(streamData.s, currentPrice);
            }
        } catch (error) {
            console.log('Error parsing crypto data', error);
        }
    };

    const handleNSEMessage = (message: MessageEvent) => {
        try {
            const changes = JSON.parse(message.data as string) as any[];
            if (Array.isArray(changes) && changes.length === 0) return;

            const changedStocks = changes.map(change => new NSEMarketItem(change));
            changedStocks.forEach(changeStock => {
                const currentPrice = parseFloat(changeStock.price.toString());
                updateStockData(changeStock.code, currentPrice);
            });
        } catch (error) {
            console.error('Error processing NSE WebSocket message:', error);
        }
    };

    const handleUSAMessage = (message: MessageEvent) => {
        try {
            const changes = JSON.parse(message.data as string) as any[];
            if (Array.isArray(changes) && changes.length === 0) return;

            const changedStocks = changes.map(change => new NSEMarketItem(change));
            changedStocks.forEach(changeStock => {
                const currentPrice = parseFloat(changeStock.price.toString());
                updateStockData(changeStock.code, currentPrice);
            });
        } catch (error) {
            console.error('Error processing USA WebSocket message:', error);
        }
    };

    const handleMCXMessage = (message: MessageEvent) => {
        try {
            const data = JSON.parse(message.data as string);
            if (!Array.isArray(data) || data.length === 0) return;

            const innerData = data[0];
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
                updateStockData(commodity, currentPrice);
            }
        } catch (error) {
            console.error('Error processing MCX WebSocket message:', error);
        }
    };

    // Function to create a single WebSocket connection
    const createWebSocket = (marketType: SchedulerType, wsUrl: string, messageHandler: (event: MessageEvent) => void) => {
        const socket = new WebSocket(wsUrl);
        
        socket.onopen = () => {
            console.log(`Connected to ${marketType} WebSocket`);
            // Check if all required sockets are connected for multi-market scenario
            if (roundRecord?.roundRecordGameType === RoundRecordGameType.SEVEN_UP_DOWN) {
                const allConnected = Array.from(socketsRef.current.values()).every(s => s.readyState === WebSocket.OPEN);
                if (allConnected) {
                    setConnectionStatus('connected');
                }
            } else {
                setConnectionStatus('connected');
            }
        };

        socket.onmessage = messageHandler;

        socket.onclose = () => {
            console.log(`Disconnected from ${marketType} WebSocket`);
            setConnectionStatus('disconnected');
            
            // Attempt to reconnect after 3 seconds
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            
            reconnectTimeoutRef.current = setTimeout(() => {
                if (socket.readyState === WebSocket.CLOSED) {
                    const newSocket = createWebSocket(marketType, wsUrl, messageHandler);
                    socketsRef.current.set(marketType, newSocket);
                }
            }, 3000);
        };

        socket.onerror = (error) => {
            console.error(`WebSocket error for ${marketType}:`, error);
            setConnectionStatus('disconnected');
        };

        return socket;
    };

    useEffect(() => {
        if (!roundRecord) return;
        
        const connectSocket = () => {
            if (roundRecord?.market.length === 0) return;

            // Close existing connections
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
            
            // Close all multi-market connections
            socketsRef.current.forEach(socket => socket.close());
            socketsRef.current.clear();

            try {
                setConnectionStatus('connecting');
                console.log('Connecting to WebSocket', roundRecord?.type);

                // Multi-market scenario (NSE Seven Up Down)
                if (roundRecord.type === SchedulerType.NSE && roundRecord.roundRecordGameType === RoundRecordGameType.SEVEN_UP_DOWN) {
                    const markets = [
                        { type: SchedulerType.NSE, url: process.env.NEXT_PUBLIC_NSE_WEBSOCKET_URL, handler: handleNSEMessage },
                        { type: SchedulerType.USA_MARKET, url: process.env.NEXT_PUBLIC_USA_WEBSOCKET_URL, handler: handleUSAMessage },
                        { type: SchedulerType.CRYPTO, url: process.env.NEXT_PUBLIC_CRYPTO_WEBSOCKET_URL, handler: handleCryptoMessage },
                        { type: SchedulerType.MCX, url: process.env.NEXT_PUBLIC_MCX_WEBSOCKET_URL, handler: handleMCXMessage }
                    ];
                    
                    markets.forEach(market => {
                        if (market.url) {
                            const socket = createWebSocket(market.type, market.url, market.handler);
                            socketsRef.current.set(market.type, socket);
                        }
                    });
                }
                // Single market scenarios
                else if (roundRecord?.type === SchedulerType.CRYPTO) {
                    socketRef.current = createWebSocket(
                        SchedulerType.CRYPTO,
                        process.env.NEXT_PUBLIC_CRYPTO_WEBSOCKET_URL as string,
                        handleCryptoMessage
                    );
                }
                else if (roundRecord.type === SchedulerType.NSE) {
                    socketRef.current = createWebSocket(
                        SchedulerType.NSE,
                        process.env.NEXT_PUBLIC_NSE_WEBSOCKET_URL as string,
                        handleNSEMessage
                    );
                }
                else if (roundRecord.type === SchedulerType.USA_MARKET) {
                    socketRef.current = createWebSocket(
                        SchedulerType.USA_MARKET,
                        process.env.NEXT_PUBLIC_USA_WEBSOCKET_URL as string,
                        handleUSAMessage
                    );
                }
                else if (roundRecord.type === SchedulerType.MCX) {
                    socketRef.current = createWebSocket(
                        SchedulerType.MCX,
                        process.env.NEXT_PUBLIC_MCX_WEBSOCKET_URL as string,
                        handleMCXMessage
                    );
                }

            } catch (error) {
                console.log(error);
                setConnectionStatus('disconnected');
            }
        };

        // Initial connection
        connectSocket();

        // Set up interval to update stocks state
        const intervalId = setInterval(() => {
            setStocks([...latestDataRef.current]);
        }, 500);

        // Set up round end check
        const checkRoundEnd = () => {
            const now = new Date();
            if (now >= roundRecord.endTime) {
                // Clean up after logging final prices
                if (socketRef.current) {
                    socketRef.current.close();
                }
                socketsRef.current.forEach(socket => socket.close());
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
            socketsRef.current.forEach(socket => socket.close());
            socketsRef.current.clear();
            clearInterval(intervalId);
            initialPricesRef.current.clear();
        };
    }, [roundRecord]);

    // Update stocks on roundRecord change
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
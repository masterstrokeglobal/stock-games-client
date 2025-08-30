import MarketItem, { NSEMarketItem, SchedulerType } from '@/models/market-item';
import { RoundRecord, RoundRecordGameType } from '@/models/round-record';
import { useEffect, useRef, useState } from 'react';
import SocketManager from '@/lib/socket-manager';
import { Socket } from 'socket.io-client';

export interface RankedMarketItem extends MarketItem {
    change_percent: string;
    rank: number;
    price: number;
    initialPrice?: number;
}

// Configuration for socket connections
interface SocketConfig {
    namespace: string;
    schedulerType: SchedulerType;
}

const SOCKET_CONFIGS: SocketConfig[] = [
    { namespace: '/crypto', schedulerType: SchedulerType.CRYPTO },
    { namespace: '/nse', schedulerType: SchedulerType.NSE },
    { namespace: '/usa', schedulerType: SchedulerType.USA_MARKET },
    { namespace: '/mcx', schedulerType: SchedulerType.MCX },
    { namespace: '/comex', schedulerType: SchedulerType.COMEX }
];

export const parseCOMEXMessage = (data: any): { [key: string]: number } => {
    const parsedPrices: { [key: string]: number } = {};

    if (!Array.isArray(data) || data.length < 1) {
        return parsedPrices;
    }

    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset() + 330);

    const contractsByCommodity: {
        [key: string]: Array<{ symbol: string; expiryDate: Date; price: number }>;
    } = {};

    for (const contractData of data) {
        if (
            !Array.isArray(contractData) ||
            contractData.length < 3 ||
            contractData[0] === ""
        ) {
            continue;
        }

        const fullSymbol = contractData[0];
        const symbolMatch = fullSymbol.match(
            /^([A-Z]{2,4})([FGHJKMNQUVXZ])([0-9]{2})$/
        );
        if (!symbolMatch) {
            continue;
        }

        const baseSymbol = symbolMatch[1];
        const monthCode = symbolMatch[2];
        const year = parseInt("20" + symbolMatch[3], 10);

        const monthMap: { [key: string]: number } = {
            F: 0, G: 1, H: 2, J: 3, K: 4, M: 5,
            N: 6, Q: 7, U: 8, V: 9, X: 10, Z: 11,
        };
        const month = monthMap[monthCode];
        if (month === undefined) {
            continue;
        }

        const expiryDate = new Date(year, month + 1, 0, 23, 59, 59);
        expiryDate.setMinutes(
            expiryDate.getMinutes() - expiryDate.getTimezoneOffset() + 330
        );
        if (isNaN(expiryDate.getTime()) || expiryDate < today) {
            continue;
        }

        let price = parseFloat(contractData[3]);
        if (isNaN(price)) {
            price = parseFloat(contractData[4]);
            if (isNaN(price)) {
                continue;
            }
        }

        if (!contractsByCommodity[baseSymbol]) {
            contractsByCommodity[baseSymbol] = [];
        }
        contractsByCommodity[baseSymbol].push({
            symbol: `${baseSymbol}_${monthCode}${symbolMatch[3]}`,
            expiryDate,
            price,
        });
    }

    for (const commodity in contractsByCommodity) {
        const contracts = contractsByCommodity[commodity];
        if (contracts.length === 0) continue;

        contracts.sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime());

        let selectedContract = null;
        for (const contract of contracts) {
            const deltaDate = new Date(contract.expiryDate);
            deltaDate.setDate(deltaDate.getDate() - 5);

            if (today <= deltaDate) {
                selectedContract = contract;
                break;
            } else if (contract.expiryDate >= today) {
                selectedContract = contract;
                break;
            }
        }

        if (selectedContract) {
            parsedPrices[commodity] = selectedContract.price;
        }
    }
    return parsedPrices;
};

export const useLeaderboard = (roundRecord: RoundRecord | null) => {
    const [stocks, setStocks] = useState<RankedMarketItem[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');

    const socketRef = useRef<Socket | null>(null);
    // For multi-market scenario, store multiple sockets
    const socketsRef = useRef<Map<SchedulerType, Socket>>(new Map());
    const latestDataRef = useRef<RankedMarketItem[]>([]);
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
        return [...items]
            .sort((a, b) => {
                const changeA = parseFloat(a.change_percent || '0');
                const changeB = parseFloat(b.change_percent || '0');
                return changeB - changeA;
            })
            .map((item, index) => ({
                ...item,
                rank: index + 1,
            })) as RankedMarketItem[];
    };

    const processPrice = (bitcode: string, currentPrice: number) => {
        if (!roundRecord) return { initialPrice: currentPrice, changePercent: '0' };
        const roundStatus = getRoundStatus();
        const key = roundRecord.type === SchedulerType.CRYPTO ? bitcode.toLowerCase() : bitcode.toUpperCase();

        // Set initial price exactly at placementEndTime
        if (roundStatus === 'tracking' && roundRecord.initialValues && roundRecord.initialValues[key] === undefined) {
            initialPricesRef.current.set(bitcode, currentPrice);
            return { initialPrice: currentPrice, changePercent: '0' };
        }

        // Calculate changes during tracking period
        if (roundStatus === 'tracking' && roundRecord.initialValues && roundRecord.initialValues[key]) {
            const initialPrice = roundRecord.initialValues[key];

            if (initialPrice === undefined) {
                console.log('No initial price found for', key);
                return { initialPrice: currentPrice, changePercent: '0' };
            }

            const changePercent = ((currentPrice - initialPrice) / initialPrice * 100).toFixed(5);
            return { initialPrice, changePercent };
        }

        return { initialPrice: currentPrice, changePercent: '0' };
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

    const handleCryptoData = (data: any) => {
        if (data && data.s) {
            const currentPrice = parseFloat(data.p);
            updateStockData(data.s, currentPrice);
        }
    };

    const handleNSEUSAData = (data: any[]) => {
        if (!Array.isArray(data) || data.length === 0) return;

        const changedStocks = data.map(change => new NSEMarketItem(change));
        changedStocks.forEach(changeStock => {
            if (latestDataRef.current.some(stock => stock.bitcode === changeStock.code)) {
                const currentPrice = parseFloat(changeStock.price.toString());
                updateStockData(changeStock.code, currentPrice);
            }
        });
    };

    const handleMCXData = (data: any[]) => {
        if (!Array.isArray(data) || data.length === 0) return;

        const innerData = data[0];
        if (!Array.isArray(innerData)) return;

        const contractsByCommodity: {
            [key: string]: Array<{ symbol: string; price: number }>;
        } = {};

        for (let i = 0; i < innerData.length; i += 10) {
            const chunk = innerData.slice(i, i + 10);
            if (chunk.length >= 3 && chunk[0] !== "") {
                const fullSymbol = chunk[0];
                const symbolMatch = fullSymbol.match(/^([A-Z]+M?)([0-9]{1,2}[A-Z]{3}(?:[0-9]{2})?)FUT$/);

                if (symbolMatch) {
                    const baseSymbol = symbolMatch[1];
                    const price = parseFloat(chunk[3]);

                    if (!isNaN(price)) {
                        if (!contractsByCommodity[baseSymbol]) {
                            contractsByCommodity[baseSymbol] = [];
                        }
                        contractsByCommodity[baseSymbol].push({ symbol: baseSymbol, price });
                    }
                }
            }
        }

        Object.entries(contractsByCommodity).forEach(([commodity, contracts]) => {
            if (contracts.length > 0) {
                updateStockData(commodity, contracts[0].price);
            }
        });
    };

    const handleCOMEXData = (data: any) => {
        const parsedPrices = parseCOMEXMessage(data);
        Object.entries(parsedPrices).forEach(([commodity, price]) => {
            if (latestDataRef.current.some(stock => stock.bitcode === commodity)) {
                updateStockData(commodity, price);
            }
        });
    };

    const getSocketConfigForRoundType = (schedulerType: SchedulerType): SocketConfig | null => {
        return SOCKET_CONFIGS.find(config => config.schedulerType === schedulerType) || null;
    };

    // Function to create a single Socket.IO connection
    const createSocket = (schedulerType: SchedulerType, namespace: string): Socket => {
        const url = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}${namespace}`;
        const socket = SocketManager.getSocket(namespace, url);

        socket.on('connect', () => {
            console.log(`Connected to ${schedulerType} Socket.IO`);

            // Check if all required sockets are connected for multi-market scenario
            if (roundRecord?.roundRecordGameType === RoundRecordGameType.SEVEN_UP_DOWN ||
                roundRecord?.roundRecordGameType === RoundRecordGameType.STOCK_SLOTS ||
                (roundRecord?.type === SchedulerType.COMEX)) {
                const allConnected = Array.from(socketsRef.current.values()).every(s => s.connected);
                if (allConnected || socketsRef.current.size === 1) {
                    setConnectionStatus('connected');
                }
            } else {
                setConnectionStatus('connected');
            }
        });

        socket.on('disconnect', () => {
            console.log(`Disconnected from ${schedulerType} Socket.IO`);
            setConnectionStatus('disconnected');
        });

        socket.on('data', (messageEvent: any) => {
            try {
                const data = typeof messageEvent === 'string' ? JSON.parse(messageEvent) : messageEvent;

                // Route data to appropriate handler based on scheduler type
                switch (schedulerType) {
                    case SchedulerType.CRYPTO:
                        handleCryptoData(data);
                        break;
                    case SchedulerType.NSE:
                    case SchedulerType.USA_MARKET:
                        handleNSEUSAData(data);
                        break;
                    case SchedulerType.MCX:
                        handleMCXData(data);
                        break;
                    case SchedulerType.COMEX:
                        handleCOMEXData(data);
                        break;
                }
            } catch (error) {
                console.error(`Error processing ${schedulerType} Socket.IO message:`, error);
            }
        });

        return socket;
    };

    useEffect(() => {
        if (!roundRecord || roundRecord.market.length === 0) {
            setStocks([]);
            return;
        }

        // Initialize stocks data
        const initialStocks: RankedMarketItem[] = roundRecord.market.map((item) => ({
            ...item,
            change_percent: '0',
            price: roundRecord.initialValues?.[item.bitcode?.toLowerCase() as string] || 0,
            initialPrice: roundRecord.initialValues?.[item.bitcode?.toLowerCase() as string] || 0,
            rank: 0,
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

        latestDataRef.current = initialStocks;
        setStocks(initialStocks);

        // Close existing connections
        if (socketRef.current) {
            socketRef.current.off('connect');
            socketRef.current.off('disconnect');
            socketRef.current.off('data');
            const name = getSocketConfigForRoundType(roundRecord.type)?.namespace;
            if (name) {
                SocketManager.releaseSocket(name);
            }
            socketRef.current = null;
        }

        // Close all multi-market connections
        socketsRef.current.forEach((socket, schedulerType) => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('data');
            const name = getSocketConfigForRoundType(schedulerType)?.namespace;
            if (name) {
                SocketManager.releaseSocket(name);
            }
        });
        socketsRef.current.clear();

        setConnectionStatus('connecting');
        console.log('Connecting to Socket.IO', roundRecord?.type, roundRecord?.roundRecordGameType);

        try {
            // Multi-market scenario (NSE Seven Up Down)
            if (roundRecord.type === SchedulerType.NSE && roundRecord.roundRecordGameType === RoundRecordGameType.SEVEN_UP_DOWN) {
                const markets = [
                    { type: SchedulerType.NSE, namespace: '/nse' },
                    { type: SchedulerType.CRYPTO, namespace: '/crypto' },
                    { type: SchedulerType.MCX, namespace: '/mcx' },
                    { type: SchedulerType.COMEX, namespace: '/comex' }, 
                ];

                markets.forEach(market => {
                    const socket = createSocket(market.type, market.namespace);
                    socketsRef.current.set(market.type, socket);
                });
            }
            // Multi-market scenario (USA Market Seven Up Down)
            else if (roundRecord.type === SchedulerType.USA_MARKET && roundRecord.roundRecordGameType === RoundRecordGameType.SEVEN_UP_DOWN) {
                const markets = [
                    { type: SchedulerType.USA_MARKET, namespace: '/usa' },
                    { type: SchedulerType.CRYPTO, namespace: '/crypto' },
                    { type: SchedulerType.MCX, namespace: '/mcx' },
                    { type: SchedulerType.COMEX, namespace: '/comex' },
                ];

                markets.forEach(market => {
                    const socket = createSocket(market.type, market.namespace);
                    socketsRef.current.set(market.type, socket);
                });
            }
            // Multi-market scenario (COMEX Stock Slots)
            else if (roundRecord.type === SchedulerType.COMEX && roundRecord.roundRecordGameType === RoundRecordGameType.STOCK_SLOTS) {
                const markets = [
                    { type: SchedulerType.CRYPTO, namespace: '/crypto' },
                    { type: SchedulerType.COMEX, namespace: '/comex' },
                ];

                markets.forEach(market => {
                    const socket = createSocket(market.type, market.namespace);
                    socketsRef.current.set(market.type, socket);
                });
            }
            // COMEX always uses multi-connection (with CRYPTO)
            else if (roundRecord.type === SchedulerType.COMEX) {
                const markets = [
                    { type: SchedulerType.CRYPTO, namespace: '/crypto' },
                    { type: SchedulerType.COMEX, namespace: '/comex' }
                ];

                markets.forEach(market => {
                    const socket = createSocket(market.type, market.namespace);
                    socketsRef.current.set(market.type, socket);
                });
            }
            // Single market scenarios
            else {
                // Get socket configuration for the round type
                const socketConfig = getSocketConfigForRoundType(roundRecord.type);
                if (!socketConfig) {
                    console.warn(`No socket configuration found for scheduler type: ${roundRecord.type}`);
                    return;
                }

                socketRef.current = createSocket(roundRecord.type, socketConfig.namespace);
            }

        } catch (error) {
            console.error('Error setting up Socket.IO connections:', error);
            setConnectionStatus('disconnected');
        }

        // Update stocks periodically
        const intervalId = setInterval(() => {
            setStocks([...latestDataRef.current]);
        }, 1000);

        // Set up round end check
        let roundEndCheckRef: NodeJS.Timeout;
        const checkRoundEnd = () => {
            const now = new Date();
            if (now >= roundRecord.endTime) {
                // Clean up after round ends
                if (socketRef.current) {
                    socketRef.current.off('connect');
                    socketRef.current.off('disconnect');
                    socketRef.current.off('data');
                    const name = getSocketConfigForRoundType(roundRecord.type)?.namespace;
                    if (name) {
                        SocketManager.releaseSocket(name);
                    }
                }

                // Clean up multi-market connections
                socketsRef.current.forEach((socket, schedulerType) => {
                    socket.off('connect');
                    socket.off('disconnect');
                    socket.off('data');
                    const name = getSocketConfigForRoundType(schedulerType)?.namespace;
                    if (name) {
                        SocketManager.releaseSocket(name);
                    }
                });
                socketsRef.current.clear();

                clearInterval(intervalId);
                return;
            }

            // Schedule next check
            roundEndCheckRef = setTimeout(checkRoundEnd, 1000);
        };

        // Start checking for round end
        checkRoundEnd();

        return () => {
            clearInterval(intervalId);
            if (roundEndCheckRef) {
                clearTimeout(roundEndCheckRef);
            }

            if (socketRef.current) {
                socketRef.current.off('connect');
                socketRef.current.off('disconnect');
                socketRef.current.off('data');
                const name = getSocketConfigForRoundType(roundRecord.type)?.namespace;
                if (name) {
                    SocketManager.releaseSocket(name);
                }
            }

            // Clean up multi-market connections
            socketsRef.current.forEach((socket, schedulerType) => {
                socket.off('connect');
                socket.off('disconnect');
                socket.off('data');
                const name = getSocketConfigForRoundType(schedulerType)?.namespace;
                if (name) {
                    SocketManager.releaseSocket(name);
                }
            });
            socketsRef.current.clear();

            initialPricesRef.current.clear();
            setConnectionStatus('disconnected');
        };
    }, [roundRecord]);

    return {
        stocks,
        connectionStatus,
        roundStatus: getRoundStatus()
    };
};
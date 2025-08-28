import MarketItem, { SchedulerType } from '@/models/market-item';
import { RoundRecord, RoundRecordGameType } from '@/models/round-record';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useStockSelectorAviator } from './use-market-selector';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { io, Socket } from 'socket.io-client';

class SocketIOManager {
    private static instance: SocketIOManager;
    private sockets: { [key: string]: Socket } = {};
    private listeners: { [key: string]: Set<(data: any) => void> } = {};
    private errorListeners: { [key: string]: Set<(error: string) => void> } = {};
    private registrationStates: { [key: string]: boolean } = {};

    private constructor() { }

    public static getInstance(): SocketIOManager {
        if (!SocketIOManager.instance) {
            SocketIOManager.instance = new SocketIOManager();
        }
        return SocketIOManager.instance;
    }

    private getSocketIOUrl(type: SchedulerType): { url: string; namespace: string } {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        
        switch (type) {
            case SchedulerType.NSE:
                return { url: baseUrl, namespace: "/aviator-nse" };
            case SchedulerType.CRYPTO:
                return { url: baseUrl, namespace: "/aviator-crypto" };
            case SchedulerType.USA_MARKET:
                return { url: baseUrl, namespace: "/aviator-usa" };
            case SchedulerType.MCX:
                return { url: baseUrl, namespace: "/aviator-mcx" };
            default:
                throw new Error("Invalid scheduler type");
        }
    }

    public getSocket(type: SchedulerType): Socket {
        if (!this.sockets[type]) {
            const { url, namespace } = this.getSocketIOUrl(type);
            const socket = io(`${url}${namespace}`, {
                transports: ['websocket', 'polling'],
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                timeout: 20000,
            });

            this.listeners[type] = new Set();
            this.errorListeners[type] = new Set();
            this.registrationStates[type] = false;

            socket.on('connect', () => {
                console.log(` Socket connected to ${namespace} at ${new Date().toISOString()}`);
                this.registrationStates[type] = false; // Reset registration state on new connection
            });

            socket.on('disconnect', (reason) => {
                console.log(` Socket disconnected from ${namespace}: ${reason} at ${new Date().toISOString()}`);
                this.registrationStates[type] = false;
            });

            socket.on('connect_error', (error) => {
                console.error(` Socket connection error for ${namespace}:`, error);
                this.registrationStates[type] = false;
                this.errorListeners[type].forEach(listener => listener('Socket.IO connection error'));
            });

            socket.on('message', (data) => {
                try {
                    console.log(` Received message from ${namespace}:`, data);
                    
                    // Handle registration confirmation
                    if (data.type === 'REGISTERED') {
                        this.registrationStates[type] = true;
                        console.log(` Registration confirmed for ${namespace}`);
                    }
                    
                    this.listeners[type].forEach(listener => listener(data));
                } catch (err) {
                    console.error('Error processing socket data:', err);
                    this.errorListeners[type].forEach(listener => listener('Failed to parse socket data'));
                }
            });

            socket.on('error', (error) => {
                console.error(` Received error from ${namespace}:`, error);
                this.errorListeners[type].forEach(listener => listener(error.error || 'Unknown error'));
            });

            this.sockets[type] = socket;
        }
        return this.sockets[type];
    }

    public registerSocket(type: SchedulerType, token: string): void {
        const socket = this.sockets[type];
        if (socket && socket.connected && !this.registrationStates[type]) {
            console.log(` Registering socket for ${type}`);
            socket.emit("message", { 
                type: "REGISTER", 
                jwtToken: token 
            });
        }
    }

    public isRegistered(type: SchedulerType): boolean {
        return this.registrationStates[type] || false;
    }

    public addListener(type: SchedulerType, onMessage: (data: any) => void, onError: (error: string) => void) {
        this.listeners[type]?.add(onMessage);
        this.errorListeners[type]?.add(onError);
    }

    public removeListener(type: SchedulerType, onMessage: (data: any) => void, onError: (error: string) => void) {
        this.listeners[type]?.delete(onMessage);
        this.errorListeners[type]?.delete(onError);
    }

    public disconnect(type: SchedulerType) {
        if (this.sockets[type]) {
            this.sockets[type].disconnect();
            delete this.sockets[type];
            delete this.listeners[type];
            delete this.errorListeners[type];
            delete this.registrationStates[type];
        }
    }
}

export enum WebSocketEventType {
    REGISTER = "REGISTER",
    PLACE_BET = "PLACE_BET",
    CASH_OUT = "CASH_OUT",
    REGISTERED = "REGISTERED",
    BET_PLACED = "BET_PLACED",
    CASH_OUT_SUCCESS = "CASH_OUT_SUCCESS",
    ERROR = "ERROR",
    ROUND_CREATED = "ROUND_CREATED",
    BETTING_ENDED = "BETTING_ENDED",
    ROUND_UPDATE = "ROUND_UPDATE",
    ITEMS_STATUS = "ITEMS_STATUS",
    USER_CASH_OUT = "USER_CASH_OUT",
    ROUND_ENDED = "ROUND_ENDED",
}

type WebSocketData = {
    type: WebSocketEventType
} & (
        | { type: WebSocketEventType.REGISTER; jwtToken: string }
        | { type: WebSocketEventType.PLACE_BET; amount: number; roundId: number; marketItem: number }
        | { type: WebSocketEventType.CASH_OUT; roundId: number; jwtToken: string }
        | { type: WebSocketEventType.REGISTERED; companyId: number; userId: number }
        | { type: WebSocketEventType.BET_PLACED; bet: { userId: number; companyId: number; roundId: number; amount: number; marketItem: number; placementId: number; timestamp: number } }
        | { type: WebSocketEventType.CASH_OUT_SUCCESS; cashOut: { userId: number; companyId: number; roundId: number; marketItem: number; amount: number; multiplier: number; payout: number; timestamp: number } }
        | { type: WebSocketEventType.ERROR; error: string }
        | { type: WebSocketEventType.ROUND_CREATED; round: { roundId: number; roundRecord: RoundRecord; items?: Array<{ code: string; initialPrice: number; currentPrice: number; multiplier: number; delta: number; status: "active" | "crashed" | "flew_away"; growthRate: number }> } }
        | { type: WebSocketEventType.BETTING_ENDED; roundId: number }
        | { type: WebSocketEventType.ROUND_UPDATE; roundId: number; items: { code: string; initialPrice: number; currentPrice: number; multiplier: number; delta: number; status: "active" | "crashed" | "flew_away"; growthRate: number }[]; progress: number }
        | { type: WebSocketEventType.ITEMS_STATUS; roundId: number; items: Record<string, { status: "active" | "crashed" | "flew_away"; multiplier: number }> }
        | { type: WebSocketEventType.USER_CASH_OUT; userId: number; roundId: number; marketItem: number; amount: number; multiplier: number; payout: number }
        | { type: WebSocketEventType.ROUND_ENDED; roundId: number }
    )

type ItemStatus = {
    code: string;
    status: "active" | "crashed" | "flew_away";
    multiplier: number;
}

const useAviator = ({ 
    type, 
    token, 
    roundRecord, 
    onSelectedPlaneCrash 
}: { 
    type: SchedulerType, 
    token: string, 
    roundRecord: RoundRecord, 
    onSelectedPlaneCrash?: (crashed: boolean) => void 
}) => {
    const queryClient = useQueryClient();
    const { stockSelectedAviator, setStockSelectedAviator } = useStockSelectorAviator();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [data, setData] = useState<ItemStatus[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [planeStatus, setPlaneStatus] = useState<Map<string, { status: "active" | "crashed" | "flew_away"; multiplier: number }> | null>(null);
    const [, setCrashedState] = useState<Map<string, { status: "crashed" | "flew_away" }> | null>(null);
    
    // Use refs to store stable references
    const typeRef = useRef(type);
    const tokenRef = useRef(token);
    const timerRef = useRef<NodeJS.Timeout>();
    const previousStatesRef = useRef<Record<string, { status: string; multiplier: number }>>({});

    // Update refs when props change
    useEffect(() => {
        typeRef.current = type;
        tokenRef.current = token;
    }, [type, token]);

    // Stable callback for plane crash detection
    const handlePlaneCrash = useCallback((crashed: boolean) => {
        onSelectedPlaneCrash?.(crashed);
    }, [onSelectedPlaneCrash]);

    // Initialize plane status from round record
    useEffect(() => {
        if (planeStatus === null && roundRecord?.market) {
            const items: [string, { status: "active" | "crashed" | "flew_away"; multiplier: number }][] = roundRecord.market
                .filter((item) => item.code)
                .map((item) => [
                    item.code!,
                    { status: "active" as const, multiplier: 1 }
                ]);
            setPlaneStatus(new Map(items));
        }
    }, [planeStatus, roundRecord?.market]);

    // Track plane status changes without using localStorage in artifacts
    useEffect(() => {
        if (planeStatus && stockSelectedAviator && roundRecord?.market) {
            const selectedStock = roundRecord.market.find(stock => stock.id === Number(stockSelectedAviator));
            const selectedStockCode = selectedStock?.code || selectedStock?.codeName;
            
            planeStatus.forEach((value, code) => {
                // Check if this is a new crash or flew away event
                if (value.status === "crashed" || value.status === "flew_away") {
                    const prevState = previousStatesRef.current[code];
                    if (!prevState || prevState.status === "active") {
                        const isSelectedPlane = code === selectedStockCode;
                        console.log(` Plane ${code} has ${value.status} at multiplier ${value.multiplier} ${isSelectedPlane ? '(SELECTED PLANE)' : '(OTHER PLANE)'}`);
                        
                        if (isSelectedPlane && value.status === "crashed") {
                            handlePlaneCrash(true);
                        }
                    }
                }
                
                // Update previous state
                previousStatesRef.current[code] = { status: value.status, multiplier: value.multiplier };
            });
        }
    }, [planeStatus, stockSelectedAviator, roundRecord?.market, handlePlaneCrash]);

    // Stable socket connection setup
    useEffect(() => {
        const socketManager = SocketIOManager.getInstance();
        const socketConnection = socketManager.getSocket(typeRef.current);
        setSocket(socketConnection);

        // Registration logic
        const attemptRegistration = () => {
            if (socketConnection.connected && !socketManager.isRegistered(typeRef.current)) {
                socketManager.registerSocket(typeRef.current, tokenRef.current);
            }
        };

        // Register immediately if connected
        attemptRegistration();

        // Register on connect events
        const handleConnect = () => {
            console.log(` Socket connected, attempting registration...`);
            setTimeout(attemptRegistration, 100); // Small delay to ensure socket is fully ready
        };

        socketConnection.on('connect', handleConnect);

        // Message handler
        const onMessage = (event: WebSocketData) => {
            console.log(` Processing message:`, event.type);

            // Handle registration confirmation
            if (event.type === WebSocketEventType.REGISTERED) {
                console.log(` Registration successful`);
            }

            // Update plane status
            if (event.type === WebSocketEventType.ITEMS_STATUS) {
                setPlaneStatus(() => {
                    const newPlaneStatus = new Map<string, { status: "active" | "crashed" | "flew_away"; multiplier: number }>();
                    Object.entries(event.items).forEach(([code, item]) => {
                        newPlaneStatus.set(code, { status: item.status, multiplier: item.multiplier });
                    });
                    return newPlaneStatus;
                });

                // Update data for selected market item
                const selectedMarketItem = roundRecord?.market?.find((item: MarketItem) => stockSelectedAviator === item.id?.toString());
                const itemStatus = selectedMarketItem?.code ? event.items[selectedMarketItem.code] : null;
                
                if (itemStatus && selectedMarketItem?.code) {
                    const formattedItemStatus: ItemStatus = {
                        code: selectedMarketItem.code,
                        status: itemStatus.status || "active",
                        multiplier: itemStatus.multiplier || 1
                    };
                    setData((currentData) => [...currentData, formattedItemStatus]);
                }
            }

            // Handle bet placed
            if (event.type === WebSocketEventType.BET_PLACED) {
                toast.success("Bet placed successfully");
                queryClient.invalidateQueries({ queryKey: ["aviator-my-placement", roundRecord?.id] });
                queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "user" && query.queryKey[1] === 'wallet' });
            }

            // Handle cash out success
            if (event.type === WebSocketEventType.CASH_OUT_SUCCESS) {
                toast.success("Cash out successful");
                queryClient.invalidateQueries({ queryKey: ["aviator-my-placement", roundRecord?.id] });
                queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "user" && query.queryKey[1] === 'wallet' });
            }

            // Handle round ended
            if (event.type === WebSocketEventType.ROUND_ENDED) {
                toast.success("Round ended");
                setPlaneStatus(null);
                setData([]);
                previousStatesRef.current = {}; // Reset previous states
            }

            // Handle new round
            if (event.type === WebSocketEventType.ROUND_CREATED) {
                const round = event.round.roundRecord;
                toast.success("New Round - Select Your Market");
                
                // Clear existing timer
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                }
                
                timerRef.current = setTimeout(() => {
                    queryClient.setQueryData(["current-round-record", typeRef.current, RoundRecordGameType.AVIATOR], () => {
                        return {
                            data: {
                                roundRecords: [round]
                            }
                        };
                    });

                    // Update plane status from round items
                    if (event.round.items && Array.isArray(event.round.items)) {
                        setPlaneStatus(() => {
                            const newPlaneStatus = new Map<string, { status: "active" | "crashed" | "flew_away"; multiplier: number }>();
                            event.round.items!.forEach((item) => {
                                newPlaneStatus.set(item.code, {
                                    status: item.status || "active",
                                    multiplier: item.multiplier || 1
                                });
                            });
                            return newPlaneStatus;
                        });

                        setCrashedState(() => {
                            const newCrashedState = new Map<string, { status: "crashed" | "flew_away" }>();
                            event.round.items!.forEach((item) => {
                                if (item.status === "crashed" || item.status === "flew_away") {
                                    newCrashedState.set(item.code, { status: item.status });
                                }
                            });
                            return newCrashedState;
                        });
                    }

                    setStockSelectedAviator(null);
                    previousStatesRef.current = {}; // Reset previous states for new round
                }, 2000);
            }

            // Handle betting ended
            if (event.type === WebSocketEventType.BETTING_ENDED) {
                console.log(` Betting phase ended for round: ${event.roundId}`);
            }
        };

        const onError = (newError: string) => {
            console.error(` Socket error:`, newError);
            setError(newError);
        };

        socketManager.addListener(typeRef.current, onMessage, onError);

        return () => {
            socketConnection.off('connect', handleConnect);
            socketManager.removeListener(typeRef.current, onMessage, onError);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []); // Empty dependency array - connection is stable

    // Stable bet placement function
    const placeBet = useCallback((amount: number) => {
        console.log(` Placing bet: ${amount}, Round: ${roundRecord?.id}, Stock: ${stockSelectedAviator}`);
        if (socket?.connected && roundRecord?.id && stockSelectedAviator) {
            socket.emit("message", { 
                type: WebSocketEventType.PLACE_BET,
                amount, 
                roundId: Number(roundRecord.id), 
                marketItem: Number(stockSelectedAviator) 
            });
        } else {
            console.warn(` Cannot place bet - Socket connected: ${socket?.connected}, Round ID: ${roundRecord?.id}, Stock: ${stockSelectedAviator}`);
        }
    }, [socket, roundRecord?.id, stockSelectedAviator]);

    // Stable cash out function
    const cashOut = useCallback(() => {
        console.log(` Cashing out for round: ${roundRecord?.id}`);
        if (socket?.connected && roundRecord?.id && tokenRef.current) {
            socket.emit("message", { 
                type: WebSocketEventType.CASH_OUT,
                roundId: roundRecord.id, 
                jwtToken: tokenRef.current 
            });
        } else {
            console.warn(` Cannot cash out - Socket connected: ${socket?.connected}, Round ID: ${roundRecord?.id}`);
        }
    }, [socket, roundRecord?.id]);

    return { 
        socket, 
        data, 
        error, 
        placeBet, 
        cashOut, 
        planeStatus 
    } as AviatorHookReturn;
};

export default useAviator;

export type AviatorHookReturn = {
    socket: Socket | null;
    data: ItemStatus[];
    error: string | null;
    placeBet: (amount: number) => void;
    cashOut: () => void;
    planeStatus: Map<string, { status: "active" | "crashed" | "flew_away"; multiplier: number }> | null;
}
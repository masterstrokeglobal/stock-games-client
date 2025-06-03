import MarketItem, { SchedulerType } from '@/models/market-item';
import { RoundRecord, RoundRecordGameType } from '@/models/round-record';
import { useEffect, useState } from 'react';
import { useStockSelectorAviator } from './use-market-selector';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
class WebSocketManager {
    private static instance: WebSocketManager;
    private sockets: { [key: string]: WebSocket } = {};
    private listeners: { [key: string]: Set<(data: any) => void> } = {};
    private errorListeners: { [key: string]: Set<(error: string) => void> } = {};

    private constructor() { }

    public static getInstance(): WebSocketManager {
        if (!WebSocketManager.instance) {
            WebSocketManager.instance = new WebSocketManager();
        }
        return WebSocketManager.instance;
    }

    private getWebSocketUrl(type: SchedulerType): string {
        switch (type) {
            case SchedulerType.NSE:
                return process.env.NEXT_PUBLIC_AVIATOR_WEBSOCKET_NSE || "ws://localhost:7070";
            case SchedulerType.CRYPTO:
                return process.env.NEXT_PUBLIC_AVIATOR_WEBSOCKET_CRYPTO || "ws://localhost:7071";
            case SchedulerType.USA_MARKET:
                return process.env.NEXT_PUBLIC_AVIATOR_WEBSOCKET_USA_MARKET || "ws://localhost:7072";
            default:
                throw new Error("Invalid scheduler type");
        }
    }

    public getSocket(type: SchedulerType): WebSocket {
        if (!this.sockets[type]) {
            const ws = new WebSocket(this.getWebSocketUrl(type));
            this.listeners[type] = new Set();
            this.errorListeners[type] = new Set();

            ws.onopen = () => {
                console.log("WebSocket connected");
            };

            ws.onmessage = (event) => {
                try {
                    const parsedData = JSON.parse(event.data);
                    this.listeners[type].forEach(listener => listener(parsedData));
                } catch (err) {
                    this.errorListeners[type].forEach(listener => listener('Failed to parse websocket data'));
                }
            };

            ws.onerror = () => {
                this.errorListeners[type].forEach(listener => listener('WebSocket error occurred'));
            };

            this.sockets[type] = ws;
        }
        return this.sockets[type];
    }

    public addListener(type: SchedulerType, onMessage: (data: any) => void, onError: (error: string) => void) {
        this.listeners[type]?.add(onMessage);
        this.errorListeners[type]?.add(onError);
    }

    public removeListener(type: SchedulerType, onMessage: (data: any) => void, onError: (error: string) => void) {
        this.listeners[type]?.delete(onMessage);
        this.errorListeners[type]?.delete(onError);
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
        | { type: WebSocketEventType.ROUND_CREATED; round: { roundId: number; roundRecord: RoundRecord } }
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

const useAviator = ({ type, token, roundRecord }: { type: SchedulerType, token: string, roundRecord: RoundRecord }) => {

    const queryClient = useQueryClient();
    const { stockSelectedAviator } = useStockSelectorAviator();
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [data, setData] = useState<ItemStatus[]>([]);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const wsManager = WebSocketManager.getInstance();
        const ws = wsManager.getSocket(type);
        setSocket(ws);

        // Send register event when connected
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: WebSocketEventType.REGISTER, jwtToken: token }));
        } else {
            ws.addEventListener('open', () => {
                ws.send(JSON.stringify({ type: WebSocketEventType.REGISTER, jwtToken: token }));
            });
        }

        const onMessage = (event: WebSocketData) => {
            if (event.type === WebSocketEventType.BET_PLACED) {
                toast.success("Bet placed successfully");
                queryClient.invalidateQueries({ queryKey: ["aviator-my-placement", roundRecord.id] });
            }
            if (event.type === WebSocketEventType.CASH_OUT_SUCCESS) {
                toast.success("Cash out successful");
                queryClient.invalidateQueries({ queryKey: ["aviator-my-placement", roundRecord.id] });
            }
            if (event.type === WebSocketEventType.ITEMS_STATUS) {
                const selectedMarketItem = roundRecord.market.find((item: MarketItem) => stockSelectedAviator === item.id?.toString());

                const itemStatus = selectedMarketItem?.code ? event.items[selectedMarketItem?.code] : null;
                const formattedItemStatus: ItemStatus = {
                    code: selectedMarketItem?.code || "",
                    status: itemStatus?.status || "active",
                    multiplier: itemStatus?.multiplier || 1
                }
                if (itemStatus) {
                    setData((currentData) => [...currentData, formattedItemStatus]);
                }
            }

            if (event.type === WebSocketEventType.ROUND_ENDED) {
                toast.success("Round ended");
            }

            if (event.type === WebSocketEventType.ROUND_CREATED) {
                const round = event.round.roundRecord;
                toast.success("new Round Select Your Market");
                queryClient.setQueryData(["current-round-record", type, RoundRecordGameType.AVIATOR], (oldData: any) => {
                    return {
                        data: {
                            roundRecords: [round]
                        }
                    }
                });
            }
        };
        const onError = (newError: string) => setError(newError);

        wsManager.addListener(type, onMessage, onError);

        return () => {
            wsManager.removeListener(type, onMessage, onError);
        };
    }, [type, token]);


    const placeBet = (amount: number) => {
        if (socket) {
            console.log(amount, roundRecord.id, stockSelectedAviator);
            socket.send(JSON.stringify({ type: WebSocketEventType.PLACE_BET, amount, roundId: Number(roundRecord.id), marketItem: Number(stockSelectedAviator) }));
        }
    }

    const cashOut = () => {
        if (socket) {
            socket.send(JSON.stringify({ type: WebSocketEventType.CASH_OUT, roundId: roundRecord.id, jwtToken: token }));
        }
    }
    return { socket, data, error, placeBet, cashOut } as AviatorHookReturn;
};

export default useAviator;


export type AviatorHookReturn = {
    socket: WebSocket | null;
    data: ItemStatus[];
    error: string | null;
    placeBet: (amount: number) => void;
    cashOut: () => void;
}


interface BonusUpdateMessage {
    type: 'BONUS_PROGRESS' | 'BONUS_COMPLETED' | 'BONUS_ASSIGNED' | 'BONUS_EXPIRED';
    data: {
        assignmentId?: string;
        bonusName?: string;
        potBalance?: number;
        remainingWager?: number;
        providerId?: number;
        betAmount?: number;
        totalProgress?: number;
    };
}

interface WebSocketMessage {
    type: string;
    data: any;
    bonusUpdate?: BonusUpdateMessage;
}

class WebSocketSingleton {
    private static instance: WebSocketSingleton;
    private ws: WebSocket | null = null;
    private bonusWs: WebSocket | null = null;
    private listeners: Set<(message: any) => void> = new Set();
    private bonusListeners: Set<(message: BonusUpdateMessage) => void> = new Set();
    private reconnectCount = 0;
    private bonusReconnectCount = 0;
    private readonly DEFAULT_CONFIG = {
        reconnectAttempts: 5,
        reconnectInterval: 0,
    };

    private constructor() { }

    static getInstance(): WebSocketSingleton {
        if (!WebSocketSingleton.instance) {
            WebSocketSingleton.instance = new WebSocketSingleton();
        }
        return WebSocketSingleton.instance;
    }

    connect(lobbyId: number, userId: string) {
        if (this.ws?.url
            && this.ws.url.includes(`lobbyId=${lobbyId}`)
            && this.ws.url.includes(`userId=${userId}`)
            && this.ws.readyState === WebSocket.OPEN
        ) {
            return;
        }

        const websocketUrl = process.env.NEXT_PUBLIC_LOBBY_ROUND_WEBSOCKET_URL || 'ws://localhost:8080';
        this.ws = new WebSocket(`${websocketUrl}?lobbyId=${lobbyId}&userId=${userId}`);

        this.ws.onopen = () => {
            console.log('WebSocket Connected');
            this.reconnectCount = 0;
        };

        this.ws.onmessage = (event: MessageEvent) => {
            try {
                const message: WebSocketMessage = JSON.parse(event.data);
                this.notifyListeners(message);
                
                // Handle bonus updates if present
                if (message.bonusUpdate) {
                    this.notifyBonusListeners(message.bonusUpdate);
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        this.ws.onerror = (error: Event) => {
            console.error('WebSocket error:', error);
        };

        this.ws.onclose = (error) => {
            this.ws = null;
            console.log('WebSocket Closed:', error);
            if (this.reconnectCount < this.DEFAULT_CONFIG.reconnectAttempts) {
                    this.reconnectCount++;
                    this.connect(lobbyId, userId);
            }
        };
    }

    connectBonusTracking(userId: string) {
        if (this.bonusWs?.url
            && this.bonusWs.url.includes(`userId=${userId}`)
            && this.bonusWs.readyState === WebSocket.OPEN
        ) {
            return;
        }

        const bonusWebsocketUrl = process.env.NEXT_PUBLIC_BONUS_WEBSOCKET_URL || 'ws://localhost:8080/bonus';
        this.bonusWs = new WebSocket(`${bonusWebsocketUrl}?userId=${userId}`);

        this.bonusWs.onopen = () => {
            console.log('Bonus WebSocket Connected');
            this.bonusReconnectCount = 0;
        };

        this.bonusWs.onmessage = (event: MessageEvent) => {
            try {
                const message: BonusUpdateMessage = JSON.parse(event.data);
                this.notifyBonusListeners(message);
            } catch (error) {
                console.error('Error parsing Bonus WebSocket message:', error);
            }
        };

        this.bonusWs.onerror = (error: Event) => {
            console.error('Bonus WebSocket error:', error);
        };

        this.bonusWs.onclose = (error) => {
            this.bonusWs = null;
            console.log('Bonus WebSocket Closed:', error);
            if (this.bonusReconnectCount < this.DEFAULT_CONFIG.reconnectAttempts) {
                this.bonusReconnectCount++;
                this.connectBonusTracking(userId);
            }
        };
    }

    addListener(callback: (message: any) => void) {
        this.listeners.add(callback);
    }

    removeListener(callback: (message: any) => void) {
        this.listeners.delete(callback);
    }

    addBonusListener(callback: (message: BonusUpdateMessage) => void) {
        this.bonusListeners.add(callback);
    }

    removeBonusListener(callback: (message: BonusUpdateMessage) => void) {
        this.bonusListeners.delete(callback);
    }

    private notifyListeners(message: any) {
        this.listeners.forEach(listener => listener(message));
    }

    private notifyBonusListeners(message: BonusUpdateMessage) {
        this.bonusListeners.forEach(listener => listener(message));
    }

    sendMessage(message: string) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket is not connected');
        }

        const chatMessage = {
            type: 'chat_message',
            message
        };

        this.ws.send(JSON.stringify(chatMessage));
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        if (this.bonusWs) {
            this.bonusWs.close();
            this.bonusWs = null;
        }
        this.listeners.clear();
        this.bonusListeners.clear();
    }

    disconnectBonusTracking() {
        if (this.bonusWs) {
            this.bonusWs.close();
            this.bonusWs = null;
        }
        this.bonusListeners.clear();
    }
}

export default WebSocketSingleton;
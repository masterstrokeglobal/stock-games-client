class WebSocketSingleton {
    private static instance: WebSocketSingleton;
    private ws: WebSocket | null = null;
    private listeners: Set<(message: any) => void> = new Set();
    private reconnectCount = 0;
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
                const message = JSON.parse(event.data);
                this.notifyListeners(message);
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
                setTimeout(() => {
                    this.reconnectCount++;
                    this.connect(lobbyId, userId);
                }, this.DEFAULT_CONFIG.reconnectInterval);
            }
        };
    }

    addListener(callback: (message: any) => void) {
        this.listeners.add(callback);
    }

    removeListener(callback: (message: any) => void) {
        this.listeners.delete(callback);
    }

    private notifyListeners(message: any) {
        this.listeners.forEach(listener => listener(message));
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
        this.listeners.clear();
    }
}

export default WebSocketSingleton;
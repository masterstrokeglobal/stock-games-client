import { SchedulerType } from '@/models/market-item';
import { io, Socket } from 'socket.io-client';

class LeaderboardSocketManager {
    private static instance: LeaderboardSocketManager;
    private sockets: { [key: string]: Socket } = {};
    private listeners: { [key: string]: Set<(data: any) => void> } = {};
    private connectionListeners: { [key: string]: Set<(status: 'connecting' | 'connected' | 'disconnected') => void> } = {};

    private constructor() { }

    public static getInstance(): LeaderboardSocketManager {
        if (!LeaderboardSocketManager.instance) {
            LeaderboardSocketManager.instance = new LeaderboardSocketManager();
        }
        return LeaderboardSocketManager.instance;
    }

    private getSocketIOUrl(type: SchedulerType): { url: string; namespace: string } {
        const baseUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:8000";
        
        switch (type) {
            case SchedulerType.CRYPTO:
                return { url: baseUrl, namespace: "/crypto" };
            case SchedulerType.NSE:
                return { url: baseUrl, namespace: "/nse" };
            case SchedulerType.USA_MARKET:
                return { url: baseUrl, namespace: "/usa" };
            case SchedulerType.MCX:
                return { url: baseUrl, namespace: "/mcx" };
            case SchedulerType.COMEX:
                return { url: baseUrl, namespace: "/comex" };
            default:
                throw new Error("Invalid scheduler type");
        }
    }

    public getSocket(type: SchedulerType): Socket {
        if (!this.sockets[type]) {
            const { url, namespace } = this.getSocketIOUrl(type);
            const socket = io(`${url}${namespace}`, {
                transports: ['websocket'],
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            this.listeners[type] = new Set();
            this.connectionListeners[type] = new Set();

            socket.on('connect', () => {
                console.log(`Leaderboard Socket connected to ${namespace}`);
                this.connectionListeners[type].forEach(listener => listener('connected'));
            });

            socket.on('disconnect', (reason) => {
                console.log(`Leaderboard Socket disconnected from ${namespace}:`, reason);
                this.connectionListeners[type].forEach(listener => listener('disconnected'));
            });

            socket.on('connect_error', (error) => {
                console.error(`Leaderboard Socket connection error for ${namespace}:`, error);
                this.connectionListeners[type].forEach(listener => listener('disconnected'));
            });

            socket.on('data', (messageEvent: any) => {
                try {
                    const data = JSON.parse(messageEvent);
                    this.listeners[type].forEach(listener => listener(data));
                } catch (err) {
                    console.error('Error processing leaderboard socket data:', err);
                }
            });

            this.sockets[type] = socket;
        }
        return this.sockets[type];
    }

    public addListener(type: SchedulerType, onMessage: (data: any) => void) {
        this.listeners[type]?.add(onMessage);
    }

    public removeListener(type: SchedulerType, onMessage: (data: any) => void) {
        this.listeners[type]?.delete(onMessage);
    }

    public addConnectionListener(type: SchedulerType, onConnectionChange: (status: 'connecting' | 'connected' | 'disconnected') => void) {
        this.connectionListeners[type]?.add(onConnectionChange);
    }

    public removeConnectionListener(type: SchedulerType, onConnectionChange: (status: 'connecting' | 'connected' | 'disconnected') => void) {
        this.connectionListeners[type]?.delete(onConnectionChange);
    }

    public disconnect(type: SchedulerType) {
        if (this.sockets[type]) {
            this.sockets[type].disconnect();
            delete this.sockets[type];
            delete this.listeners[type];
            delete this.connectionListeners[type];
        }
    }

    public disconnectAll() {
        Object.keys(this.sockets).forEach(type => {
            this.disconnect(type as SchedulerType);
        });
    }
}

export default LeaderboardSocketManager;

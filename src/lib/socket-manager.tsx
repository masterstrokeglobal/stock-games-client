import { io, Socket } from 'socket.io-client';

type SocketMap = Map<string, { socket: Socket, refCount: number }>;

class SocketManager {
    private sockets: SocketMap = new Map();

    getSocket(namespace: string, url: string): Socket {
        if (this.sockets.has(namespace)) {
            const entry = this.sockets.get(namespace)!;
            entry.refCount += 1;
            return entry.socket;
        }
        const socket = io(url, { transports: ['websocket'] });
        this.sockets.set(namespace, { socket, refCount: 1 });
        return socket;
    }

    releaseSocket(namespace: string) {
        const entry = this.sockets.get(namespace);
        if (!entry) return;
        entry.refCount -= 1;
        if (entry.refCount <= 0) {
            entry.socket.disconnect();
            this.sockets.delete(namespace);
        }
    }
}

const socketManager = new SocketManager();
export default socketManager;
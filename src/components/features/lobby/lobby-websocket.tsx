import { useAuthStore } from '@/context/auth-context';
import Lobby, { LobbyEvents, LobbyStatus } from '@/models/lobby';
import LobbyUser, { LobbyUserStatus } from '@/models/lobby-user';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useCallback, useRef } from 'react';

interface WebSocketMessage {
    event: LobbyEvents;
    data: any;
}

interface ChatMessage {
    type: 'chat_message';
    message: string;
}

const DEFAULT_CONFIG = {
    reconnectAttempts: 3,
    reconnectInterval: 5000,
};

function useLobbyWebSocket<T extends Lobby>(lobbyId?: number, lobbyCode?: string) {
    const queryClient = useQueryClient();
    const { userDetails } = useAuthStore();
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        let reconnectCount = 0;

        if (!lobbyId) {
            return;
        }

        const connect = () => {
            const websocketUrl = process.env.NEXT_PUBLIC_LOBBY_ROUND_WEBSOCKET_URL || 'ws://localhost:8080';
            const ws = new WebSocket(`${websocketUrl}?lobbyId=${lobbyId}&userId=${userDetails?.id}`);
            wsRef.current = ws;
            console.log('Connecting to WebSocket:', wsRef.current);

            ws.onopen = () => {
                console.log('WebSocket Connected');
                reconnectCount = 0;
            };

            ws.onmessage = (event: MessageEvent) => {
                try {
                    const message: WebSocketMessage = JSON.parse(event.data);
                    handleAction(message);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            ws.onerror = (error: Event) => {
                console.error('WebSocket error:', error);
            };

            ws.onclose = () => {
                console.log('WebSocket disconnected');
                wsRef.current = null;

                if (reconnectCount < DEFAULT_CONFIG.reconnectAttempts) {
                    console.log(`Attempting to reconnect... (${reconnectCount + 1}/${DEFAULT_CONFIG.reconnectAttempts})`);
                    setTimeout(() => {
                        reconnectCount++;
                        connect();
                    }, DEFAULT_CONFIG.reconnectInterval);
                }
            };
        };

        connect();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [lobbyId, queryClient, userDetails?.id]);

    const sendMessage = useCallback((message: string) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket is not connected');
        }

        const chatMessage: ChatMessage = {
            type: 'chat_message',
            message
        };

        wsRef.current.send(JSON.stringify(chatMessage));
    }, []);

    const handleAction = (message: WebSocketMessage) => {
        // Get the code from the updated lobby data
        const code = lobbyCode;
        // Update the specific lobby query data
        const queryKey = ['lobbies', 'code', code];
        console.log('Message:', message);

        switch (message.event) {
            case LobbyEvents.USER_JOINED:
                queryClient.invalidateQueries({
                    predicate: (query) => query.queryKey[0] === 'lobbies',
                });
                break;
            case LobbyEvents.USER_LEFT:
                queryClient.setQueryData<T>(queryKey, (oldData) => {
                    const lobby = oldData?.clone() as Lobby;
                    lobby.lobbyUsers = lobby.lobbyUsers?.map((user) => {
                        if (user.user?.id === message.data.userId) {
                            user.status = LobbyUserStatus.LEFT;
                        }
                        return user;
                    });
                    return lobby as T;
                }, {
                    updatedAt: Date.now()
                });
                break;

            case LobbyEvents.USER_READY:
                queryClient.setQueryData<T>(queryKey, (oldData) => {
                    const lobby = oldData?.clone() as Lobby;
                    const user = lobby.lobbyUsers?.find((user) => user.user?.id == message.data?.userId);
                    console.log('User ready:', lobby.lobbyUsers?.map((user) => user.user?.id), message.data?.userId);
                    if (user) {
                        user.status = LobbyUserStatus.PLAYING;
                    }
                    return lobby as T;
                });
                break;

            case LobbyEvents.ROUND_STARTED:
                queryClient.setQueryData<T>(queryKey, (oldData) => {
                    console.log('Round started:', message);
                    const lobby = oldData?.clone() as Lobby;
                    lobby.status = LobbyStatus.IN_PROGRESS;
                    return lobby as T;
                });
                break;

            case LobbyEvents.ROUND_ENDED:
                queryClient.setQueryData<T>(queryKey, (oldData) => {
                    const lobby = oldData?.clone() as Lobby;
                    lobby.status = LobbyStatus.CLOSED;
                    return lobby as T;
                });
                break;

            case LobbyEvents.LOBBY_CLOSED:
                queryClient.setQueryData<T>(queryKey, (oldData) => {
                    const lobby = oldData as Lobby;
                    lobby.status = LobbyStatus.CLOSED;
                    return lobby as T;
                });
                // Optionally invalidate the query to trigger a refetch
                queryClient.invalidateQueries({
                    predicate: (query) => query.queryKey[0] === 'lobbies',
                });
                break;

            default:
                console.log('Unknown event:', message);
        }
    };


    return { sendMessage };

}

export default useLobbyWebSocket;
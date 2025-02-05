import Lobby, { LobbyEvents, LobbyStatus } from '@/models/lobby';
import LobbyUser, { LobbyUserStatus } from '@/models/lobby-user';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

interface WebSocketMessage {
    event: LobbyEvents;
    data: any;
}


const DEFAULT_CONFIG = {
    reconnectAttempts: 3,
    reconnectInterval: 5000,
};


function useLobbyWebSocket<T extends Lobby>(lobbyId?: number, lobbyCode?: string) {
    const queryClient = useQueryClient();

    useEffect(() => {
        let reconnectCount = 0;

        if (!lobbyId) {
            return;
        }

        let ws: WebSocket | null = null;

        const connect = () => {
            ws = new WebSocket(`ws://localhost:8080?lobbyId=${lobbyId}`);

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
            if (ws) {
                ws.close();
            }
        };
    }, [lobbyId, queryClient]);

    const handleAction = (message: WebSocketMessage) => {
        // Get the code from the updated lobby data
        const code = lobbyCode;
        // Update the specific lobby query data
        const queryKey = ['lobbies', 'code', code];

        switch (message.event) {
            case LobbyEvents.USER_JOINED:
                console.log('User joined:', message);
                queryClient.setQueryData<T>(queryKey, (oldData) => {
                    const lobby = oldData?.clone() as Lobby;
                    console.log('User joined:', message);
                    console.log('Old lobby:', lobby.lobbyUsers);
                    lobby.lobbyUsers?.push(new LobbyUser(message.data));
                    console.log('new Lobby:', lobby.lobbyUsers);
                    return lobby as T;
                });
                break;
            case LobbyEvents.USER_LEFT:
                queryClient.setQueryData<T>(queryKey, (oldData) => {    
                    const lobby = oldData?.clone() as Lobby;
                    console.log('User left:', message);
                    console.log('User ID:', message.data.userId, lobby.lobbyUsers?.map((user) => user.user?.id));
                    lobby.lobbyUsers = lobby.lobbyUsers?.map((user) => {
                        if (user.user?.id === message.data.userId) {
                            user.status = LobbyUserStatus.LEFT;
                        }
                        return user;
                    });
                    console.log('new Lobby:', lobby.lobbyUsers?.length);
                    return lobby as T;
                },{
                    updatedAt: Date.now()
                });
                break;

            case LobbyEvents.USER_READY:
                queryClient.setQueryData<T>(queryKey, (oldData) => {
                    const lobby = oldData?.clone() as Lobby;
                    const user = lobby.lobbyUsers?.find((user) => user.id === message.data.id);
                    if (user) {
                        user.status = LobbyUserStatus.PLAYING;
                    }
                    return lobby as T;
                });
                break;

            case LobbyEvents.ROUND_STARTED:
                queryClient.setQueryData<T>(queryKey, (oldData) => {
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
}

export default useLobbyWebSocket;
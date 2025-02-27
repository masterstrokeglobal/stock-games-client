import { useAuthStore } from '@/context/auth-context';
import WebSocketSingleton from '@/lib/websocket-singleton';
import Lobby, { LobbyEvents, LobbyGameType, LobbyStatus } from '@/models/lobby';
import LobbyChat from '@/models/lobby-chat';
import LobbyRound from '@/models/lobby-round';
import { LobbyUserStatus } from '@/models/lobby-user';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { LobbyResult } from '../game/lobby-result-dialog';
interface WebSocketMessage {
    event: LobbyEvents;
    data: any;
}


function useLobbyWebSocket<T extends Lobby>({ lobbyCode, lobbyId, gameType }: { lobbyId?: number, lobbyCode?: string, gameType?: LobbyGameType }) {
    const queryClient = useQueryClient();
    const [showResults, setShowResult] = useState<boolean>(false);
    const [resultData, setResultData] = useState<LobbyResult | undefined>(undefined);
    const { userDetails } = useAuthStore();
    const router = useRouter();
    
    const handleAction = useCallback((message: WebSocketMessage) => {
        const code = lobbyCode;
        const queryKey = ['lobbies', 'code', code];
        const chatQueryKey = ["lobbies", "chat", lobbyId];
        const lobbyRoundQueryKey = ["lobbies", "round", lobbyId];
        
        console.log('Game type:', gameType);

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

                let url = `/game/lobby/${lobbyCode}/play`;


                if (gameType == LobbyGameType.MINI_MUTUAL_FUND) {
                    url = `/game/lobby/${lobbyCode}/play/mini-mutual-fund`;
                }

                router.push(url);
                break;

            case LobbyEvents.INITIAL_VALUE_FETCHED:
                queryClient.setQueryData<T>(lobbyRoundQueryKey, (oldData) => {
                    const lobby = oldData?.clone() as unknown as LobbyRound;
                    if (lobby.roundRecord) {
                        lobby.roundRecord!.initialValues = message.data.prices;
                    }

                    return lobby as unknown as T;
                });
                break;

            case LobbyEvents.USER_PLACED:
                queryClient.invalidateQueries({
                    predicate: (query) => query.queryKey[0] === 'allPlacement',
                });
                break;

            case LobbyEvents.ROUND_ENDED:
                queryClient.setQueryData<T>(queryKey, (oldData) => {
                    const lobby = oldData?.clone() as Lobby;
                    lobby.status = LobbyStatus.CLOSED;
                    return lobby as T;
                });

                setShowResult(true);
                setResultData(message.data);
                queryClient.invalidateQueries({
                    predicate: (query) => query.queryKey[0] === 'allPlacement',
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

            case LobbyEvents.CHAT_MESSAGE:
                queryClient.setQueryData<T>(chatQueryKey, (oldData) => {
                    const chat = oldData as unknown as LobbyChat[];

                    let newChat = [...chat, message.data];

                    // filter unique messages
                    newChat = newChat.filter((item, index, self) => self.findIndex((t) => t.id === item.id) === index);

                    return newChat as unknown as T;
                });
                break;

            default:
                console.log('Unknown event:', message);
        }
    }, [lobbyCode, lobbyId, queryClient, router]);


    useEffect(() => {
        if (!lobbyId || !userDetails?.id) return;

        console.log('Connecting to lobby websocket', lobbyId, userDetails.id);
        const wsInstance = WebSocketSingleton.getInstance();
        wsInstance.connect(lobbyId, userDetails.id.toString());
        wsInstance.addListener(handleAction);


        return () => {
            wsInstance.removeListener(handleAction);
        };
    }, [lobbyId, userDetails?.id, handleAction]);

    const sendMessage = (message: string) => {
        const wsInstance = WebSocketSingleton.getInstance();
        wsInstance.sendMessage(message);
    };

    return { sendMessage, showResults, resultData };

}

export default useLobbyWebSocket;
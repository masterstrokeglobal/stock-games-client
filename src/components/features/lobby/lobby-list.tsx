"use client";
import { useGetLobbies, useGetMyLobbies } from '@/react-query/lobby-query';
import { useMemo } from 'react';
import LobbyCard from './lobby-card';
import Lobby from '@/models/lobby';


const LobbyList = () => {
    const { data, isLoading } = useGetLobbies({});

    const { data: lobbyuser } = useGetMyLobbies();

    const lobbies = useMemo(() => {
        if (!data) return [];
        return data.lobbies.map(lobby => new Lobby(lobby));
    }, [data]);

    const otherLobbies = useMemo(() => {
        if (lobbies && !lobbyuser) return lobbies;
        if (!lobbyuser || !lobbies) return [];
        const otherLobbies = lobbies.filter(lobby => lobbyuser.lobby && lobby.id !== lobbyuser.lobby.id);
        return otherLobbies.map(lobby => new Lobby(lobby));
    }, [lobbies, lobbyuser])

    if (isLoading) {
        return <div className="text-white">Loading lobbies...</div>;
    }

    if (!lobbies?.length) {
        return <div className="text-white">No active lobbies found.</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Regular Lobbies */}
            {lobbyuser && lobbyuser.lobby && <h2 className='text-white mb-2'>My Lobbies</h2>}
            {lobbyuser && lobbyuser.lobby && <LobbyCard joined lobby={lobbyuser.lobby} />}
            {otherLobbies.length && <h2 className='text-white mb-2'>Other Lobbies</h2>}
            {otherLobbies.map((lobby) => (
                <LobbyCard
                    key={lobby.id}
                    lobby={lobby}
                />
            ))}
        </div>
    );
};

export default LobbyList;
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/context/auth-context";
import Lobby, { LobbyGameType } from "@/models/lobby";
import { useJoinLobby, useLeaveLobby, useReadyToPlay, useStartRound, useUnreadyToPlay } from "@/react-query/lobby-query";
import Link from "next/link";

type Props = {
    lobby: Lobby;
};

const LobbySettings = ({ lobby }: Props) => {
    const { userDetails } = useAuthStore();
    const { mutate: readyToPlay, isPending: isReadyLoading } = useReadyToPlay();
    const { mutate: joinLobby, isPending: isJoinLoading } = useJoinLobby();
    const {
        mutate: startRound,
        isPending: isStartLoading,
    } = useStartRound();
    const { mutate: leaveLobby, isPending: isLeaveLoading } = useLeaveLobby();
    const { mutate: unreadyToPlay, isPending: isUnreadyLoading } = useUnreadyToPlay();

    // Assuming these methods exist on the Lobby model
    const userId = userDetails!.id!;
    const isParticipant = lobby.isParticipant(userId);
    const isReady = lobby.isReadyToPlay(userId);
    const isLeader = lobby.isLeader(userId);


    const handleReadyToPlay = () => {
        readyToPlay(lobby.id!);
    };

    const handleLeaveLobby = () => {
        leaveLobby(lobby.id!);
    };


    return (
        <div className="flex gap-4 flex-col">

            {(!isParticipant && !lobby.isClosed) && (
                <Button
                    variant="game"
                    className="w-full flex-1"
                    onClick={() => joinLobby({ code: lobby.joiningCode })}
                    disabled={isJoinLoading}
                >
                    {isJoinLoading ? "Joining..." : "Join Lobby"}
                </Button>
            )}
            {/* Play Button */}
            {lobby.isStarted && (
                <Link href={`/game/lobby/${lobby.joiningCode}/play/${lobby.gameType == LobbyGameType.MINI_MUTUAL_FUND ? "/mini-mutual-fund" : ""}`} >
                    <Button
                        variant="game"
                        className="w-full flex-1"
                    >
                        Play Game
                    </Button>
                </Link>
            )}

            {(isLeader && !lobby.isStarted) && (
                <Button
                    variant="game"
                    className="w-full flex-1"
                    onClick={() => startRound(lobby.id!)}
                    disabled={isStartLoading}
                >
                    {isStartLoading ? "Starting..." : "Start Round"}
                </Button>
            )}




            {/* Leave Button */}
            {isParticipant && (
                <Button
                    variant="destructive"
                    className="w-full flex-1"
                    onClick={handleLeaveLobby}
                    disabled={isLeaveLoading}
                >
                    {isLeaveLoading ? "Leaving..." : "Leave Lobby"}
                </Button>
            )}
            {(lobby.isClosed || !isParticipant) && (    // Lobby is closed
                <Link href={`/game/lobby?gameType=${lobby.gameType}`} >
                    <Button variant="game" className="w-full flex-1">
                        Back to Lobbies
                    </Button>
                </Link>
            )}
        </div>
    );
};

export default LobbySettings;
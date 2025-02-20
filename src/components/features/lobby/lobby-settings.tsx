import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/context/auth-context";
import Lobby from "@/models/lobby";
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
            {isParticipant && !isReady && (
                <Button
                    variant="game"
                    className="w-full flex-1"
                    onClick={handleReadyToPlay}
                    disabled={isReadyLoading}
                >
                    {isReadyLoading ? "Getting Ready..." : "Ready to Play"}
                </Button>
            )}


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
                <Link href={`/game/lobby/${lobby.joiningCode}/play`} >
                    <Button
                        variant="game"
                        className="w-full flex-1"
                    >
                        Play Game
                    </Button>
                </Link>
            )}

            {(isLeader && isReady && !lobby.isStarted) && (
                <Button
                    variant="game"
                    className="w-full flex-1"
                    onClick={() => startRound(lobby.id!)}
                    disabled={isStartLoading}
                >
                    {isStartLoading ? "Starting..." : "Start Round"}
                </Button>
            )}

            {isReady && !lobby.isStarted && (
                <Button
                    variant="destructive"
                    className="w-full flex-1"
                    onClick={() => unreadyToPlay(lobby.id!)}
                    disabled={isUnreadyLoading}
                >
                    {isUnreadyLoading ? "Unready..." : "Unready to Play"}
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
            {lobby.isClosed && (    // Lobby is closed
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
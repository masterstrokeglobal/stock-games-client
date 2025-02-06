
"use client";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/context/auth-context';
import { Lobby, LobbyType } from '@/models/lobby';
import { useJoinLobby } from '@/react-query/lobby-query';
import { Crown, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


interface LobbyCardProps {
    lobby: Lobby;
    isHighlighted?: boolean;
    joined?: boolean;
}

const LobbyCard = ({ lobby, joined = false }: LobbyCardProps) => {
    const router = useRouter();
    const { mutate: joinLobby, isPending } = useJoinLobby();
    const { userDetails } = useAuthStore();

    const onLobbyJoin = (lobbyId: string) => {
        joinLobby({ code: lobbyId.toString() }, {
            onSuccess: () => {
                router.push(`/game/lobby/${lobbyId}`);
            }
        });
    };


    const userId = userDetails?.id!;
    const isLeader = lobby.isLeader(userId);
    console.log(lobby.leader?.id, userId)

    return <Link href={joined || isLeader ? `/game/lobby/${lobby.joiningCode}` : "#"} passHref>
        <Card className={`${'bg-gray-900 border-gray-800'}`}>
            <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                    <div>

                        <div className={`p-3 rounded-lg ${'bg-gray-800'}`}>
                            <Gamepad2 className="w-6 h-6 text-white" />
                        </div>
                        {isLeader && <Badge className='text-white bg-yellow-500'>Host</Badge>}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-white font-semibold">{lobby.name}</h3>
                            {lobby.type === LobbyType.PUBLIC && (
                                <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded">
                                    Public
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-400"> {lobby.getTypeName} ({lobby.marketType.toUpperCase()})</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm text-gray-400 flex gap-2 "> <Crown className="w-4 h-4 text-yellow-500" /> Entry Fee</p>
                        <p className={`font-semibold ${'text-white'}`}>
                            Rs. {lobby.amount}
                        </p>
                    </div>
                    {!joined && (
                        <Button
                            variant="game"
                            className="h-12"
                            onClick={() => onLobbyJoin(lobby.joiningCode)}
                            disabled={isPending}
                        >
                            Join
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    </Link>
}

export default LobbyCard;
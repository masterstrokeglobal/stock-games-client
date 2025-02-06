import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { useAuthStore } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import Lobby from '@/models/lobby';
import { Users } from 'lucide-react';

type Props = {
    lobby: Lobby;
};
const LobbyPlayers = ({ lobby }: Props) => {
    const { userDetails } = useAuthStore();

    const userId = userDetails?.id!;
    return <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Players
            </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lobby?.lobbyUsers?.map((player) => (
                <Card key={player.id} className={cn(userId === player.user?.id! ? 'border-blue-500' : 'border-gray-600',"bg-primary-game border-2")}>
                    <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img
                                    src={player.user?.profileImage}
                                    alt={player.user?.name}
                                    className="w-12 h-12 rounded-full border-2 border-gray-700"
                                />
                                {lobby.isLeader(player.user?.id!) && (
                                    <Badge className="absolute -bottom-2 bg-yellow-500 text-white text-xs rounded-full">
                                        Host
                                    </Badge>
                                )}
                            </div>
                            <div>
                                <div className="flex items-start  flex-col">
                                    <span className="text-white font-medium capitalize">{player.user?.name}</span>
                                    <span className="text-gray-400 text-xs">@{player.user?.username}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant="success">{player.status}</Badge>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </CardContent>
    </Card>
};

export default LobbyPlayers;
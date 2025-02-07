import { Lobby } from './lobby';
import User from './user';

export class LobbyChat {
    id?: number;
    lobby?: Lobby;
    user?: User;
    message?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(params: Partial<LobbyChat> = {}) {
        this.id = params.id;
        this.lobby = params.lobby ? new Lobby(params.lobby) : undefined;
        this.user = params.user ? new User(params.user) : undefined;
        this.message = params.message;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }

    clone(): LobbyChat {
        return new LobbyChat({
            id: this.id,
            lobby: this.lobby,
            user: this.user,
            message: this.message,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt
        });
    }
}

export default LobbyChat;
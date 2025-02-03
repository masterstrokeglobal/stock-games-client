import { Lobby } from "./lobby";
import User from "./user";

export enum LobbyUserStatus {
    JOINED = "joined",
    PLAYING = "playing",
    LEFT = "left"
}

export enum RoundRecordGameType {
    DERBY = "derby",
    LOBBY = "lobby"
}

export class LobbyUser {
    id?: number;
    lobby?: Lobby;
    user?: User;
    status: LobbyUserStatus;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(params: LobbyUser) {
        this.id = params.id;
        this.lobby = params.lobby ? new Lobby(params.lobby) : undefined;
        this.user = params.user ? new User(params.user) : undefined;
        this.status = params.status;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }

    // Helper methods
    isActive(): boolean {
        return this.status === LobbyUserStatus.JOINED || this.status === LobbyUserStatus.PLAYING;
    }

    isPlaying(): boolean {
        return this.status === LobbyUserStatus.PLAYING;
    }

    hasLeft(): boolean {
        return this.status === LobbyUserStatus.LEFT;
    }

    canRejoin(): boolean {
        return this.status === LobbyUserStatus.LEFT && !this.deletedAt;
    }
}

export default LobbyUser;
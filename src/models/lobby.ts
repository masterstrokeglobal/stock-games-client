import { Company } from "./company";
import LobbyUser, { LobbyUserStatus } from "./lobby-user";
import { SchedulerType } from "./market-item";
import User from "./user";

export enum LobbyStatus {
    OPEN = "open",
    IN_PROGRESS = "in_progress",
    CLOSED = "closed",
}

export enum LobbyGameType {
    GUESS_FIRST = "guess_first",
    GUESS_LAST = "guess_last",
    GUESS_FIRST_EIGHT = "guess_first_eight",
    GUESS_LAST_EIGHT = "guess_last_eight",
    GUESS_FIRST_THREE = "guess_first_three",
    GUESS_LAST_THREE = "guess_last_three",
}

export enum LobbyEvents {
    USER_JOINED = "user_joined",
    USER_LEFT = "user_left",
    ROUND_STARTED = "round_started",
    ROUND_ENDED = "round_ended",
    LOBBY_CLOSED = "lobby_closed",
    USER_READY = "user_ready",
}

export enum LobbyType {
    PRIVATE = "private",
    PUBLIC = "public",
}
export class Lobby {
    id?: number;
    company?: Company;
    name?: string;
    leader?: User;
    startTime?: Date;
    endTime?: Date;
    amount: number;
    gameType: LobbyGameType;
    marketType: SchedulerType;
    lobbyUsers?: LobbyUser[];
    totalPool?: number;
    status: LobbyStatus;
    type: LobbyType;
    joiningCode: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(params: Lobby) {
        this.id = params.id;
        this.company = params.company;
        this.leader = params.leader;
        this.lobbyUsers = params.lobbyUsers?.map((user) => new LobbyUser(user));
        this.name = params.name;
        this.startTime = params.startTime;
        this.totalPool = params.totalPool;
        this.endTime = params.endTime;
        this.amount = params.amount;
        this.gameType = params.gameType;
        this.marketType = params.marketType;
        this.status = params.status;
        this.type = params.type;
        this.joiningCode = params.joiningCode;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }

    get getTypeName(): string {
        // remove _ and capitalize
        return this.gameType.replace("_", " ").toUpperCase();
    }

    isLeader(userId: string | number): boolean {
        return this.leader?.id == userId;
    }

    isParticipant(userId: string | number): boolean {
        const participant = this.lobbyUsers?.findIndex((user) => user.user?.id == userId && user.status !== LobbyUserStatus.LEFT);
        return participant !== -1;
    }

    get userPercentage(): number {
        return ((this.lobbyUsers?.length ?? 0) / 16) * 100;
    }

    isReadyToPlay(userId: string | number): boolean {
        const user = this.lobbyUsers?.find((user) => user.user?.id == userId);
        return user?.status === LobbyUserStatus.PLAYING;
    }

    // Optional: Helper methods
    isOpen(): boolean {
        return this.status === LobbyStatus.OPEN;
    }

    isPublic(): boolean {
        return this.type === LobbyType.PUBLIC;
    }

    get isStarted(): boolean {
        return this.status === LobbyStatus.IN_PROGRESS;
    }

    canJoin(userId?: string | number): boolean {
        return this.isOpen() && this.leader?.id !== userId;
    }

    // clone 
    clone(): Lobby {
        return new Lobby(this);
    }
}

export default Lobby;
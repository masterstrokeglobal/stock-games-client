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
    GUESS_FIRST_FOUR = "guess_first_four",
    GUESS_LAST_FOUR = "guess_last_four",
    GUESS_FIRST_EIGHT = "guess_first_eight",
    GUESS_LAST_EIGHT = "guess_last_eight",
    GUESS_HIGHER = "guess_higher",
}
export enum LobbyEvents {
    USER_JOINED = "user_joined",
    USER_LEFT = "user_left",
    ROUND_STARTED = "round_started",
    ROUND_ENDED = "round_ended",
    CHAT_MESSAGE = "chat_message",
    LOBBY_CLOSED = "lobby_closed",
    USER_READY = "user_ready",
    USER_PLACED = "user_placement_placed",
    INITIAL_VALUE_FETCHED = "initial_values_fetched",
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

    get isClosed(): boolean {
        return this.status === LobbyStatus.CLOSED;
    }

    get totalPool(): number {
        const readyUsers = this?.lobbyUsers?.filter(u => u.status === LobbyUserStatus.PLAYING).length;
        if (!readyUsers) return 0;

        return readyUsers * (this?.amount * .90);
    }
    
    getWinnerCode = (resultData: any): string | null => {
        if (resultData?.priceDifferences && Array.isArray(resultData.priceDifferences) && resultData.priceDifferences.length > 0 ) {
            if (resultData.priceDifferences[0].code)
            return resultData.priceDifferences[0].codeName;
        }
        return null;

    }


    // clone 
    clone(): Lobby {
        return new Lobby(this);
    }
}

export default Lobby;
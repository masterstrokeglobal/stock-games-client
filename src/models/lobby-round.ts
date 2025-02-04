import { Lobby } from "./lobby";
import { RoundRecord } from "./round-record";
import User from "./user";

export class LobbyRound {
    id?: number;
    lobby?: Lobby;
    users: User[];
    roundRecord: RoundRecord | null;
    winners: User[];
    totalPool: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(params: Partial<LobbyRound>) {
        this.id = params.id;
        this.lobby = params.lobby;
        this.users = params.users || [];
        this.roundRecord = params.roundRecord?.id ? new RoundRecord(params.roundRecord) : null;
        this.winners = params.winners || [];
        this.totalPool = params.totalPool || 0;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }

    // Check if a user is participating in this round
    isParticipant(userId: string | number): boolean {
        return this.users.some(user => user.id == userId);
    }

    // Check if a user is a winner in this round
    isWinner(userId: string | number): boolean {
        return this.winners.some(winner => winner.id == userId);
    }

    // Check if the round has ended (has winners)
    get isCompleted(): boolean {
        return this.winners.length > 0;
    }

    // Get the duration of the round if it's completed
    get roundDuration(): number | null {
        if (this.createdAt && this.updatedAt && this.isCompleted) {
            return this.updatedAt.getTime() - this.createdAt.getTime();
        }
        return null;
    }
}

export default LobbyRound;
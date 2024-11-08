export class GameRecord {
    id?: number;
    roundId?: number; // Reference to RoundRecord
    userId?: number; // Reference to User
    transactionId?: number; // Reference to Transaction
    position?: string | null; // Game position, could be an enum or string
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(params: Partial<GameRecord> = {}) {
        this.id = params.id;
        this.roundId = params.roundId;
        this.userId = params.userId;
        this.transactionId = params.transactionId;
        this.position = params.position;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }

}

export default GameRecord;

import { RoundRecord, RoundRecordGameType } from "./round-record";
import { Transaction } from "./transaction";
import User from "./user";


export enum SevenUpDownPlacementType {
    UP = "up",
    DOWN = "down",
    SEVEN = "seven",
}

class SevenUpDownPlacement {
    id: number;
    round?: RoundRecord;
    user?: User;
    amount: number;
    isWinner: boolean;
    transaction?: Transaction;
    gameType: RoundRecordGameType;
    placement: SevenUpDownPlacementType;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;

    constructor(params: SevenUpDownPlacement) {
        this.id = params.id;
        this.round = params.round ? new RoundRecord(params.round) : undefined;
        this.user = params.user;
        this.amount = params.amount;
        this.isWinner = params.isWinner;
        this.transaction = params.transaction;
        this.gameType = params.gameType;
        this.placement = params.placement;
        this.createdAt = new Date(params.createdAt);
        this.updatedAt = new Date(params.updatedAt);
        this.deletedAt = params.deletedAt ? new Date(params.deletedAt) : undefined;
    }
}

export default SevenUpDownPlacement;
import { RoundRecord } from "./round-record";
import { Transaction } from "./transaction";
import User from "./user";

export enum HeadTailPlacementType {
    HEAD = "head",
    TAIL = "tail"
}

export class HeadTailPlacement {
    id: number;
    round: RoundRecord;
    user?: User;
    amount: number;
    isWinner: boolean;
    transaction?: Transaction;
    gameType: string;
    placement!: HeadTailPlacementType;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;

    constructor(params: HeadTailPlacement) {
        this.id = params.id;
        this.round = params.round;
        this.user = params.user;
        this.amount = params.amount;
        this.isWinner = params.isWinner;
        this.transaction = params.transaction;
        this.gameType = params.gameType;
        this.placement = params.placement;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }
}
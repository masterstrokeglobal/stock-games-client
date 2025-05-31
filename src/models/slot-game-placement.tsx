import { RoundRecord } from "./round-record";
import { Transaction } from "./transaction";
import User from "./user";

export class StockGamePlacement {
    id!: number;
    round!: RoundRecord;
    user?: User;
    amount!: number;
    isWinner!: boolean;
    transaction?: Transaction;
    createdAt!: Date;
    updatedAt!: Date;
    deletedAt?: Date;

    constructor(params: StockGamePlacement) {
        this.id = params.id;
        this.round = params.round;
        this.user = params.user;
        this.amount = params.amount;
        this.isWinner = params.isWinner;
        this.transaction = params.transaction;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }
}
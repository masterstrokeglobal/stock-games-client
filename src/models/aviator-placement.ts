import { MarketItem } from "./market-item";
import { RoundRecordGameType } from "./round-record";
import { RoundRecord } from "./round-record";
import { Transaction } from "./transaction";
import User from "./user";

export class AviatorPlacement {
    id: number;
    round: RoundRecord;
    user?: User;
    amount: number;
    isWinner: boolean;
    transaction?: Transaction;
    gameType: RoundRecordGameType;
    marketItem: MarketItem;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;

    constructor(params: AviatorPlacement) {
        this.id = params.id;
        this.round = params.round;
        this.user = params.user;
        this.amount = params.amount;
        this.isWinner = params.isWinner;
        this.transaction = params.transaction;
        this.gameType = params.gameType;
        this.marketItem = params.marketItem;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }
}
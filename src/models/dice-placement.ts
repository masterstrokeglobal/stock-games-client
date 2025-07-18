import { RoundRecordGameType } from "./round-record";

import { RoundRecord } from "./round-record";
import { Transaction } from "./transaction";
import User from "./user";


export enum DicePlacementType {
    FIRST = "first",
    SECOND = "second",
    BOTH = "both",
  }
  

export class DicePlacement {
    id: number;
    round: RoundRecord;
    user?: User;
    amount: number;
    isWinner: boolean;
    placementType: DicePlacementType;
    transaction?: Transaction;
    gameType: RoundRecordGameType;
    number: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;

    constructor(params: DicePlacement) {
        this.id = params.id;
        this.round = params.round;
        this.user = params.user;
        this.amount = params.amount;
        this.isWinner = params.isWinner;
        this.placementType = params.placementType;
        this.transaction = params.transaction;
        this.gameType = params.gameType;
        this.number = params.number;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }
}

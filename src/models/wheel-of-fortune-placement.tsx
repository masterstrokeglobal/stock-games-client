import { RoundRecord } from "./round-record";
import { Transaction } from "./transaction";
import User from "./user";

export enum WheelColor {
    COLOR1 = "color1",
    COLOR2 = "color2",
    COLOR3 = "color3",
    COLOR4 = "color4",
    COLOR5 = "color5",
}


export interface ColorConfig {
    name: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    shadowColor: string;
    actualColor: string;
    multiplier: number;
}

export class WheelOfFortunePlacement {

    id: number;
    round: RoundRecord;
    placementColor: WheelColor;
    user: User;
    amount: number;
    isWinner: boolean;
    transaction: Transaction;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;

    constructor(params: WheelOfFortunePlacement) {
        this.id = params.id;
        this.round = params.round;
        this.placementColor = params.placementColor;
        this.user = params.user;
        this.amount = params.amount;
        this.isWinner = params.isWinner;
        this.transaction = params.transaction;
        this.createdAt = new Date(params.createdAt);
        this.updatedAt = new Date(params.updatedAt);
        this.deletedAt = params.deletedAt;
    }

    getPlacementColor() {
        return this.placementColor;
    }

    getAmount() {
        return this.amount;
    }
}


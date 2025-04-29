import { MarketItem } from "./market-item";
import { RoundRecordGameType } from "./round-record";
import { RoundRecord } from "./round-record";
import User from "./user";


export type StockSlotPlacementType = "high" | "low";

export class StockSlotPlacement {
    id!: number;
    round!: RoundRecord;
    user?: User;
    amount!: number;
    isWinner!: boolean;
    gameType!: RoundRecordGameType;
    marketItem!: MarketItem;
    placement!: StockSlotPlacementType;
    createdAt!: Date;
    updatedAt!: Date;
    deletedAt?: Date;

    constructor(params: StockSlotPlacement) {
        this.id = params.id;
        this.round = params.round;
        this.user = params.user;
        this.amount = params.amount;
        this.isWinner = params.isWinner;
        this.gameType = params.gameType;
        this.marketItem = params.marketItem;
        this.placement = params.placement;
        this.createdAt = params.createdAt ? new Date(params.createdAt) : new Date();
        this.updatedAt = params.updatedAt ? new Date(params.updatedAt) : new Date();
        this.deletedAt = params.deletedAt ? new Date(params.deletedAt) : undefined;
    }
}




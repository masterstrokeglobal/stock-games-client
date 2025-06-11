import { RoundRecord, RoundRecordGameType } from "./round-record";
import { MarketItem } from "./market-item";
import User from "./user";

export class SinglePlayerGamePlacement {
    id?: number;
    round?: RoundRecord;
    user?: User;
    externalUser?: any;
    amount?: number;
    isWinner?: boolean;
    gameType?: RoundRecordGameType;
    marketItem?: MarketItem;

    constructor(params: Partial<SinglePlayerGamePlacement> = {}) {
        this.id = params.id;
        this.round = params.round;
        this.user = params.user;
        this.externalUser = params.externalUser;
        this.amount = params.amount;
        this.isWinner = params.isWinner;
        this.gameType = params.gameType;
        this.marketItem = params.marketItem;
    }
}

import { RoundRecord } from "./round-record";
import { Transaction } from "./transaction";
import User from "./user";


export enum SevenUpDownPlacementType {
    UP = "up",
    DOWN = "down",
    SEVEN = "seven",
}


export enum RoundRecordGameType {
    DERBY = "derby",
    LOBBY = "lobby",
    MINI_MUTUAL_FUND = "mini_mutual_fund",
    GUESS_FIRST_FOUR = "guess_first_four",
    GUESS_LAST_FOUR = "guess_last_four",
    GUESS_FIRST_EIGHT = "guess_first_eight",
    GUESS_LAST_EIGHT = "guess_last_eight",
    STOCK_SLOTS = "stock_slots",
    STOCK_JACKPOT = "stock_jackpot",
    SEVEN_UP_DOWN = "seven_up_down",
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
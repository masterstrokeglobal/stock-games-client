import { PlacementType } from "./game-record";
import { RoundRecord } from "./round-record";

export enum RedBlackAdvancePlacementType {
    CURRENT = "current",
    NEXT = "next",
    MAXIMUM = "maximum",
    FIVE = "five",
}

export enum RedBlackPlacementType {
    RED = "red",
    BLACK = "black",
}

class AdvanceGameRecord {
    id?: number;
    roundId: number;
    userId: number;
    amount: number;
    isWinner: boolean;
    placementType: RedBlackPlacementType;
    advancePlacementType: RedBlackAdvancePlacementType;
    transactionId?: number;
    createdAt: Date;
    round?: RoundRecord;
    updatedAt: Date;
    deletedAt?: Date;
    startRound: number;
    endRound: number;

    constructor(params: Partial<AdvanceGameRecord>) {
        this.id = params.id;
        this.roundId = params.roundId ?? 0;
        this.userId = params.userId!;
        this.amount = params.amount!;
        this.isWinner = params.isWinner ?? false;
        this.placementType = params.placementType!;
        this.advancePlacementType = params.advancePlacementType ?? RedBlackAdvancePlacementType.CURRENT;
        this.transactionId = params.transactionId;
        this.createdAt = params.createdAt!;
        this.round = params.round;
        this.updatedAt = params.updatedAt!;
        this.deletedAt = params.deletedAt;
        this.startRound = params.startRound ?? -1;
        this.endRound = params.endRound ?? -1;
    }

    get isRangeBet() {
        return this.startRound !== this.endRound;
    }
}

export default AdvanceGameRecord;
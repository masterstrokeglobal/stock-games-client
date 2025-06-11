import { PlacementType } from "./game-record";
import { RoundRecord } from "./round-record";

class AdvanceGameRecord {
    id?: number;
    roundId: number;
    userId: number;
    amount: number;
    isWinner: boolean;
    placementType: PlacementType;
    placeValue?: string;
    market: number[];
    createdAt: Date;
    round?: RoundRecord;
    updatedAt: Date;
    deletedAt?: Date;
    startRound: number;
    endRound: number;
    redWon: number;
    blackWon: number;

    constructor(params: Partial<AdvanceGameRecord>) {
        this.id = params.id;
        this.roundId = params.roundId ?? 0;
        this.userId = params.userId!;
        this.amount = params.amount!;
        this.isWinner = params.isWinner ?? false;
        this.placementType = params.placementType!;
        this.market = params.market!;
        this.placeValue = params.placeValue ?? this.placementType;
        this.createdAt = params.createdAt!;
        this.round = params.round;
        this.updatedAt = params.updatedAt!;
        this.deletedAt = params.deletedAt;
        this.startRound = params.startRound ?? -1;
        this.endRound = params.endRound ?? -1;
        this.redWon = params.redWon ?? -1;
        this.blackWon = params.blackWon ?? -1;
    }
}

export default AdvanceGameRecord;
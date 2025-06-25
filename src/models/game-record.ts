import { RoundRecord } from "./round-record";

class GameRecord {
    id?: number;
    roundId: number;
    userId: number;
    amount: number;
    startRound?: number;
    endRound?: number;
    isWinner: boolean;
    placementType: PlacementType;
    placeValue?: string;
    market: number[];
    placedValues?: string;
    createdAt: Date;
    round?: RoundRecord;
    updatedAt: Date;
    deletedAt?: Date;

    constructor(params: Partial<GameRecord>) {
        this.id = params.id;
        this.roundId = params.roundId ?? 0;
        this.userId = params.userId!;
        this.amount = params.amount!;
        this.isWinner = params.isWinner ?? false;
        this.placementType = params.placementType!;
        this.startRound = params.startRound;
        this.endRound = params.endRound;
        this.market = params.market!;
        this.placedValues = params.placedValues;
        this.placeValue = params.placeValue ?? this.placementType;
        this.createdAt = params.createdAt!;
        this.round = params.round;
        this.updatedAt = params.updatedAt!;
        this.deletedAt = params.deletedAt;
    }
}

export enum PlacementType {
    SINGLE = "single",
    SPLIT = "split",
    QUARTER = "quarter",
    STREET = "street",
    DOUBLE_STREET = "double_street",
    CORNER = "corner",
    COLUMN = "column",
    COLOR = "color",
    EVEN_ODD = "even_odd",
    HIGH_LOW = "high_low",
    ROUND_RANGE = "round_range"
}

export default GameRecord;
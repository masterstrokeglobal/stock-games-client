import { RoundRecord } from "./round-record";

class GameRecord {
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

    constructor(params: Partial<GameRecord>) {
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
    HIGH_LOW = "high_low"
}

export default GameRecord;
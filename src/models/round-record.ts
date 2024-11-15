import { SchedulerType } from "./market-item";


export class RoundRecord {
    id?: number;
    startTime?: Date;
    companyId?: number;
    endTime?: Date;
    placementStartTime?: Date;
    placementEndTime?: Date;
    type?: SchedulerType;
    winningId?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(params: Partial<RoundRecord> = {}) {
        this.id = params.id;
        this.startTime = params.startTime;
        this.companyId = params.companyId;
        this.endTime = params.endTime;
        this.placementStartTime = params.placementStartTime;
        this.placementEndTime = params.placementEndTime;
        this.type = params.type;
        this.winningId = params.winningId;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }

}

export default RoundRecord;

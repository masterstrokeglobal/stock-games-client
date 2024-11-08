import { SchedulerType } from "./market-item";

export class Scheduler {
    id?: number;
    startDate?: Date;
    companyId?: number;
    endDate?: Date;
    startTime?: string;
    endTime?: string;
    type?: SchedulerType;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(params: Partial<Scheduler> = {}) {
        this.id = params.id;
        this.startDate = params.startDate;
        this.companyId = params.companyId;
        this.endDate = params.endDate;
        this.startTime = params.startTime;
        this.endTime = params.endTime;
        this.type = params.type;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }
}

export default Scheduler;

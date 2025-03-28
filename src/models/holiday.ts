import { SchedulerType } from "./market-item";

export class Holiday {
    id: number;
    type: SchedulerType;
    startDate: Date | null;
    endDate: Date | null;
    createdAt: Date | null;
    updatedAt: Date;
    deletedAt?: Date;

    constructor(holidayData: Partial<Holiday>) {

        this.id = holidayData.id ?? 0;
        this.type = holidayData.type ?? SchedulerType.NSE;
        this.startDate = holidayData.startDate ? new Date(holidayData.startDate) : null;
        this.endDate = holidayData.endDate ? new Date(holidayData.endDate) : null;
        this.createdAt = holidayData.createdAt ? new Date(holidayData.createdAt) : null;
        this.updatedAt = holidayData.updatedAt ? new Date(holidayData.updatedAt) : new Date();
        this.deletedAt = holidayData.deletedAt ? new Date(holidayData.deletedAt) : undefined;

    }
}

export default Holiday;
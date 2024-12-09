import { SchedulerType } from "./market-item";

export class Holiday {
    id!: number;
    type!: SchedulerType;
    date!: Date;
    createdAt!: Date;
    updatedAt!: Date;
    deletedAt?: Date;

    constructor(holidayData: Partial<Holiday>) {
        Object.assign(this, holidayData);
    }
}

export default Holiday;
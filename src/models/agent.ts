import { Company } from "./company";
import { SchedulerType } from "./market-item";

class Agent {
    id?: number;
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    placementNotAllowed: SchedulerType[];
    depositBonusPercentage?: number;
    referenceCode?: string;
    company?: Company;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(params: Partial<Agent> = {}) {
        this.id = params.id;
        this.firstname = params.firstname;
        this.lastname = params.lastname;
        this.depositBonusPercentage = params.depositBonusPercentage;
        this.email = params.email;
        this.password = params.password;
        this.referenceCode = params.referenceCode;
        this.placementNotAllowed = params.placementNotAllowed || [];

        if (params.company) {
            this.company = new Company(params.company);
        }

        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }

    get name(): string {
        return `${this.firstname} ${this.lastname}`;
    }

}

export default Agent;
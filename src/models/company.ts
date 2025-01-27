import { SchedulerType } from "./market-item";

export class Company {
    id?: number;
    name?: string;
    address?: string;
    contactPersonName?: string;
    contactPersonEmail?: string;
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    paymentImage?: string;
    domain?: string;
    createdAt?: Date;
    updatedAt?: Date;
    placementNotAllowed?: SchedulerType[];
    deletedAt?: Date;

    constructor(params: Partial<Company> = {}) {
        this.id = params.id;
        this.name = params.name;
        this.address = params.address;
        this.contactPersonName = params.contactPersonName;
        this.contactPersonEmail = params.contactPersonEmail;
        this.logo = params.logo;
        this.primaryColor = params.primaryColor;
        this.placementNotAllowed = params.placementNotAllowed || [];

        this.secondaryColor = params.secondaryColor;
        this.domain = params.domain;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
        this.paymentImage = params.paymentImage;
    }
}

export default Company;
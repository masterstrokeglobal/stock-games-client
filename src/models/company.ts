import { SchedulerType } from "./market-item";

interface Theme {
    primary: string;
    secondary: string;
    [key: string]: string; // Allows additional optional properties
}
export class Company {
    id?: number;
    name?: string;
    address?: string;
    contactPersonName?: string;
    contactPersonEmail?: string;
    logo?: string;
    theme?: Theme;
    depositBonusPercentage?: string;
    depositBonusPercentageEnabled?: boolean;
    paymentImage?: string;
    domain?: string;
    createdAt?: Date;
    updatedAt?: Date;
    externalPayIn!: boolean;
    externalPayOut!: boolean;
    placementNotAllowed?: SchedulerType[];
    deletedAt?: Date;
    minPlacement?: number;
    maxPlacement?: number;
    otpIntegration?: boolean;
    coinValues?: number[];

    constructor(params: Partial<Company> = {}) {
        this.id = params.id;
        this.name = params.name;
        this.address = params.address;
        this.contactPersonName = params.contactPersonName;
        this.contactPersonEmail = params.contactPersonEmail;
        this.logo = params.logo;
        this.placementNotAllowed = params.placementNotAllowed || [];
        this.depositBonusPercentageEnabled = params.depositBonusPercentageEnabled;
        this.domain = params.domain;
        this.theme = params.theme;
        this.externalPayIn = params.externalPayIn || false;
        this.externalPayOut = params.externalPayOut || false;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
        this.paymentImage = params.paymentImage;
        this.depositBonusPercentage = params.depositBonusPercentage;
        this.otpIntegration = params.otpIntegration || false;
        this.minPlacement = params.minPlacement;
        this.maxPlacement = params.maxPlacement;
        this.coinValues = params.coinValues;
    }
}

export default Company;
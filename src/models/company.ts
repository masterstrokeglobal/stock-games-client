import { RoundRecordGameType } from "./round-record";
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
    gameRestrictions:RoundRecordGameType[];
    allowedCasino!: boolean;
    deletedAt?: Date;
    minPlacement: number;
    maxPlacement: number;
    minCasinoPlacement?: number;
    maxCasinoPlacement?: number;
    maxSinglePlacementPerGameType?: Record<RoundRecordGameType, number>;
    otpIntegration?: boolean;
    coinValues?: number[];
    dynamicQR: boolean;
    cryptoPayIn?: boolean;
    cryptoPayOut?: boolean;

    constructor(params: Partial<Company> = {}) {
        this.id = params.id;
        this.name = params.name;
        this.address = params.address;
        this.contactPersonName = params.contactPersonName;
        this.contactPersonEmail = params.contactPersonEmail;
        this.logo = params.logo;
        this.placementNotAllowed = params.placementNotAllowed || [];
        this.gameRestrictions = params.gameRestrictions || [];
        this.depositBonusPercentageEnabled = params.depositBonusPercentageEnabled;
        this.domain = params.domain;
        this.allowedCasino = params.allowedCasino || false;
        this.theme = params.theme;
        this.externalPayIn = params.externalPayIn || false;
        this.externalPayOut = params.externalPayOut || false;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
        this.paymentImage = params.paymentImage;
        this.depositBonusPercentage = params.depositBonusPercentage;
        this.otpIntegration = params.otpIntegration || false;
        this.minPlacement = params.minPlacement ?? 0;
        this.maxPlacement = params.maxPlacement ?? Infinity;
        this.maxSinglePlacementPerGameType = params.maxSinglePlacementPerGameType;
        this.coinValues = params.coinValues;
        this.minCasinoPlacement = params.minCasinoPlacement;
        this.maxCasinoPlacement = params.maxCasinoPlacement;
        this.cryptoPayIn = params.cryptoPayIn || false;
        this.cryptoPayOut = params.cryptoPayOut || false;
        this.dynamicQR = params.dynamicQR || false;
    }
}

export default Company;
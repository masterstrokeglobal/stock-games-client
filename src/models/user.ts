import Company from "./company";
import { SchedulerType } from "./market-item";

type CryptoAddress = {
    id: number;
    crypto: string;
    symbol: string;
    paymentAddress: string;
}

class User {
    id?: number;
    firstname?: string;
    lastname?: string;
    username?: string;
    email?: string;
    phone?: string;
    password?: string;
    googleId?: string;
    profileImage?: string;
    otpSecret?: string;
    isVerified?: boolean;
    depositBonusPercentage!: number;
    placementNotAllowed: SchedulerType[];
    company?: Company;
    weeklyWithdrawLimit?: number;
    cryptoAddress?: CryptoAddress[];
    dailyWithdrawLimit?: number;
    monthlyWithdrawLimit?: number;
    createdAt?: Date;
    notes?: string;
    demoUser?: boolean;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(params: Partial<User> = {}) {
        this.id = params.id;
        this.firstname = params.firstname;
        this.lastname = params.lastname;
        this.username = params.username;
        this.email = params.email;
        this.phone = params.phone;
        this.notes = params.notes;
        this.password = params.password;
        this.googleId = params.googleId;
        this.depositBonusPercentage = params.depositBonusPercentage??0;
        this.otpSecret = params.otpSecret;
        this.isVerified = params.isVerified;
        this.profileImage = params.profileImage;
        this.demoUser = params.demoUser;
        this.weeklyWithdrawLimit = params.weeklyWithdrawLimit;
        this.dailyWithdrawLimit = params.dailyWithdrawLimit;
        this.monthlyWithdrawLimit = params.monthlyWithdrawLimit;
        this.cryptoAddress = params.cryptoAddress;
        if (params.company) {
            this.company = new Company(params.company);
        }

        this.placementNotAllowed = params.placementNotAllowed || [];

        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }

    isNotAllowedToPlaceOrder(type: SchedulerType) {
        return this.placementNotAllowed.includes(type);
    }

    get name() {
        return `${this.firstname} ${this.lastname}`;
    }

    get isDemoUser() {
        return this.demoUser;
    }
}

export default User;

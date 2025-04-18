import Company from "./company";


export enum BonusCategory {
    JOINING = "joining",
    SIGNUP = "signup",
    REFERRAL = "referral",
    DEPOSIT = "deposit",
    LOSEBACK = "loseback",
}

export enum BonusFrequency {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    EVERY = "every",
}


class Bonus {
    id?: number;
    name?: string;
    description?: string;
    category: BonusCategory;
    amount: number;
    maxAmount?: number;
    minAmount?: number;
    imageUrl?: string;
    endDate?: Date;
    startDate?: Date;
    company?: Company;
    maxCount?: number;
    percentage?: boolean;

    frequency?: BonusFrequency;
    active: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(params: Partial<Bonus> = {}) {
        this.id = params.id;
        this.name = params.name;
        this.description = params.description;
        this.category = params.category || BonusCategory.DEPOSIT;
        this.amount = params.amount || 0;
        this.maxAmount = params.maxAmount;
        this.minAmount = params.minAmount;
        this.imageUrl = params.imageUrl;
        this.endDate = params.endDate;
        this.startDate = params.startDate;
        this.active = params.active || false;
        this.frequency = params.frequency;
        this.maxCount = params.maxCount;
        this.percentage = params.percentage;
        if (params.company) {
            this.company = new Company(params.company);
        }

        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }

    isActive(): boolean {
        const now = new Date();

        // Check if bonus is marked as active
        if (!this.active) return false;

        // Check if bonus is within valid date range
        if (this.startDate && this.startDate > now) return false;
        if (this.endDate && this.endDate < now) return false;

        return true;
    }

    isApplicableForAmount(amount: number): boolean {
        if (this.minAmount && amount < this.minAmount) return false;
        if (this.maxAmount && amount > this.maxAmount) return false;
        return true;
    }

    calculateBonusAmount(baseAmount: number): number {
        const bonusAmount = this.amount;

        // If there's a max amount cap, ensure bonus doesn't exceed it
        if (this.maxAmount && bonusAmount > this.maxAmount) {
            return this.maxAmount;
        }

        return bonusAmount;
    }
}

export default Bonus;
import Company from "./company";

export enum BonusType {
    FIXED_AMOUNT = "FIXED_AMOUNT",
    PERCENTAGE = "PERCENTAGE",
    FREE_SPINS = "FREE_SPINS",
    CASHBACK = "CASHBACK"
}

export enum TriggerEvent {
    FIRST_DEPOSIT = "FIRST_DEPOSIT",
    DEPOSIT_MATCH = "DEPOSIT_MATCH",
    WELCOME_BONUS = "WELCOME_BONUS",
    LOYALTY_REWARD = "LOYALTY_REWARD",
    CASHBACK = "CASHBACK"
}

export enum WagerRequirementType {
    TURNOVER_MULTIPLIER = "TURNOVER_MULTIPLIER",
    FIXED_AMOUNT = "FIXED_AMOUNT",
    NO_REQUIREMENT = "NO_REQUIREMENT"
}

export enum BonusStatus {
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED", 
    EXPIRED = "EXPIRED",
    PENDING = "PENDING"
}

export enum ProviderType {
    STOCK = 1,
    QTECH = 2
}

export interface BonusAssignment {
    id: number;
    userId: number;
    bonusCampaignId: number;
    bonusCampaign: EnhancedBonus;
    potBalance: number;
    requiredWager: number;
    remainingWager: number;
    status: BonusStatus;
    providerProgress?: Record<string, number>;
    assignedAt: Date;
    expiresAt?: Date;
    completedAt?: Date;
}

export interface WagerProgress {
    assignments: BonusAssignment[];
    totalActiveBonus: number;
    totalWageredToday: number;
}

export interface ProviderBreakdown {
    providerId: number;
    providerName: string;
    totalWagered: number;
    isEligible: boolean;
    contributionPercentage: number;
}

export interface BonusBreakdown {
    assignmentId: number;
    bonusName: string;
    totalRequired: number;
    totalWagered: number;
    remainingWager: number;
    providerBreakdown: ProviderBreakdown[];
}

class EnhancedBonus {
    id?: number;
    bonusName?: string;
    description?: string;
    bonusType: BonusType;
    triggerEvent: TriggerEvent;
    bonusValue: number;
    wagerRequirementType: WagerRequirementType;
    wagerRequirementValue: number;
    spendingRequirement?: number;
    applicableProviders?: ProviderType[];
    minDepositAmount?: number;
    maxBonusAmount?: number;
    validityDays?: number;
    isActive: boolean;
    company?: Company;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(params: Partial<EnhancedBonus> = {}) {
        this.id = params.id;
        this.bonusName = params.bonusName;
        this.description = params.description;
        this.bonusType = params.bonusType || BonusType.PERCENTAGE;
        this.triggerEvent = params.triggerEvent || TriggerEvent.FIRST_DEPOSIT;
        this.bonusValue = params.bonusValue || 0;
        this.wagerRequirementType = params.wagerRequirementType || WagerRequirementType.TURNOVER_MULTIPLIER;
        this.wagerRequirementValue = params.wagerRequirementValue || 1;
        this.spendingRequirement = params.spendingRequirement;
        this.applicableProviders = params.applicableProviders;
        this.minDepositAmount = params.minDepositAmount;
        this.maxBonusAmount = params.maxBonusAmount;
        this.validityDays = params.validityDays;
        this.isActive = params.isActive || false;

        if (params.company) {
            this.company = new Company(params.company);
        }

        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }

    isApplicableForProvider(providerId: ProviderType): boolean {
        if (!this.applicableProviders || this.applicableProviders.length === 0) {
            return true; // If no providers specified, applicable to all
        }
        return this.applicableProviders.includes(providerId);
    }

    getProviderNames(): string[] {
        if (!this.applicableProviders) return ['All providers'];
        return this.applicableProviders.map(id => 
            id === ProviderType.STOCK ? 'Stock Trading' : 'Casino Games'
        );
    }

    calculateWagerRequirement(depositAmount: number): number {
        switch (this.wagerRequirementType) {
            case WagerRequirementType.TURNOVER_MULTIPLIER:
                return (depositAmount + this.calculateBonusAmount(depositAmount)) * this.wagerRequirementValue;
            case WagerRequirementType.FIXED_AMOUNT:
                return this.wagerRequirementValue;
            case WagerRequirementType.NO_REQUIREMENT:
                return 0;
            default:
                return 0;
        }
    }

    calculateBonusAmount(depositAmount: number): number {
        const calculatedBonus = (depositAmount * this.bonusValue) / 100;
        
        if (this.maxBonusAmount && calculatedBonus > this.maxBonusAmount) {
            return this.maxBonusAmount;
        }
        
        return calculatedBonus;
    }

    isEligibleForDeposit(depositAmount: number): boolean {
        if (this.minDepositAmount && depositAmount < this.minDepositAmount) {
            return false;
        }
        return this.isActive;
    }
}

export default EnhancedBonus;

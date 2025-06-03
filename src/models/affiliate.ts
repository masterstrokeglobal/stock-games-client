import Company from "./company";
import { SchedulerType } from "./market-item";
import User from "./user";


export enum AffiliateRole {
    MASTER_AFFILIATE = "master_affiliate",
    SUB_AFFILIATE = "sub_affiliate",
}

class Affiliate {
    id?: number;
    name?: string;
    role: AffiliateRole;
    minAmount: number;
    maxAmount?: number;
    username?: string;
    password?: string;
    canCreateSubAffiliate?: boolean;
    referenceCode?: string;
    parentAffiliate?: Affiliate;
    company?: Company;
    userCount?: number;
    comission?: number;
    users?: User[];
    placementNotAllowed: SchedulerType[];
    referralBonus: number;
    isPercentage: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(params: Partial<Affiliate> = {}) {
        this.id = params.id;
        this.name = params.name;
        this.role = params.role || AffiliateRole.MASTER_AFFILIATE;
        this.minAmount = params.minAmount || 0;
        this.maxAmount = params.maxAmount;
        this.username = params.username;
        this.canCreateSubAffiliate = params.canCreateSubAffiliate || false;
        this.password = params.password;
        this.referenceCode = params.referenceCode;
        this.referralBonus = params.referralBonus || 0;
        this.isPercentage = params.isPercentage !== undefined ? params.isPercentage : true;
        this.comission = params.comission || 0;
        this.userCount = params.userCount || 0;

        if (params.parentAffiliate) {
            this.parentAffiliate = new Affiliate(params.parentAffiliate);
        }

        if (params.company) {
            this.company = new Company(params.company);
        }

        this.placementNotAllowed = params.placementNotAllowed || [];
        this.users = params.users || [];

        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }

    validateParent(): boolean {
        if (this.role === AffiliateRole.SUB_AFFILIATE && !this.parentAffiliate) {
            return false;
        }
        if (this.role === AffiliateRole.MASTER_AFFILIATE && this.parentAffiliate) {
            return false;
        }
        return true;
    }

    isNotAllowedToPlaceOrder(type: SchedulerType): boolean {
        return this.placementNotAllowed.includes(type);
    }
}

export default Affiliate;
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
    username?: string;
    password?: string;
    referenceCode?: string;
    parentAffiliate?: Affiliate;
    company?: Company;
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
        this.username = params.username;
        this.password = params.password;
        this.referenceCode = params.referenceCode;
        this.referralBonus = params.referralBonus || 0;
        this.isPercentage = params.isPercentage !== undefined ? params.isPercentage : true;

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
import Company from "./company";
import OperatorWallet from "./operator-wallet";

export enum OperatorRole {
    SUPER_DUPER_MASTER = "super_duper_master",
    DUPER_MASTER = "duper_master",
    MASTER = "master",
    AGENT = "agent",
}

export const isOperatorRole = (role: string): role is OperatorRole => {
    return Object.values(OperatorRole).includes(role as OperatorRole);
}

export const getLowerRankRole = (role: OperatorRole): OperatorRole => {
    switch (role) {
        case OperatorRole.SUPER_DUPER_MASTER:
            return OperatorRole.DUPER_MASTER;
        case OperatorRole.DUPER_MASTER:
            return OperatorRole.MASTER;
        case OperatorRole.MASTER:
            return OperatorRole.AGENT;
        default:
            return OperatorRole.AGENT;
    }
}
class Operator {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    role!: OperatorRole;
    percentageShare!: number;
    dmMaxBalance!: number;
    masterMaxBalance!: number;
    agentMaxBalance!: number;
    parentOperator?: Operator;
    children?: Operator[];
    company?: Company;
    operatorWallet?: OperatorWallet;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(params: Partial<Operator> = {}) {
        this.id = params.id;
        this.name = params.name;
        this.email = params.email;
        this.password = params.password;
        this.role = params.role ?? OperatorRole.SUPER_DUPER_MASTER;
        this.percentageShare = params.percentageShare ?? 0;
        this.dmMaxBalance = params.dmMaxBalance ?? 0;
        this.masterMaxBalance = params.masterMaxBalance ?? 0;
        this.agentMaxBalance = params.agentMaxBalance ?? 0;

        if (params.parentOperator) {
            this.parentOperator = new Operator(params.parentOperator);
        }

        if (params.children) {
            this.children = params.children.map(child => new Operator(child));
        }

        if (params.company) {
            this.company = new Company(params.company);
        }

        if (params.operatorWallet) {
            this.operatorWallet = new OperatorWallet(params.operatorWallet);
        }

        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }

    get isSuperDuperMaster() {
        return this.role === OperatorRole.SUPER_DUPER_MASTER;
    }

    get isDuperMaster() {
        return this.role === OperatorRole.DUPER_MASTER;
    }

    get isMaster() {
        return this.role === OperatorRole.MASTER;
    }

    get isAgent() {
        return this.role === OperatorRole.AGENT;
    }

    get hasChildren() {
        return this.children && this.children.length > 0;
    }

    get hasParent() {
        return !!this.parentOperator;
    }

    getMaxBalanceForRole(role: OperatorRole): number {
        switch (role) {
            case OperatorRole.DUPER_MASTER:
                return this.dmMaxBalance;
            case OperatorRole.MASTER:
                return this.masterMaxBalance;
            case OperatorRole.AGENT:
                return this.agentMaxBalance;
            default:
                return 0;
        }
    }

    canManageOperator(targetOperator: Operator): boolean {
        // Super duper master can manage everyone
        if (this.isSuperDuperMaster) {
            return true;
        }

        // Duper master can manage master and agent
        if (this.isDuperMaster) {
            return targetOperator.isMaster || targetOperator.isAgent;
        }

        // Master can manage agent
        if (this.isMaster) {
            return targetOperator.isAgent;
        }

        // Agent cannot manage anyone
        return false;
    }

    isDescendantOf(ancestor: Operator): boolean {
        let current = this.parentOperator;
        while (current) {
            if (current.id === ancestor.id) {
                return true;
            }
            current = current.parentOperator;
        }
        return false;
    }

    getAllDescendants(): Operator[] {
        const descendants: Operator[] = [];

        if (this.children) {
            for (const child of this.children) {
                descendants.push(child);
                descendants.push(...child.getAllDescendants());
            }
        }

        return descendants;
    }
}

export default Operator;
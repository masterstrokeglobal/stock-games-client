class AgentWallet {
    id?: number;
    agentId?: number;
    balance: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(params: Partial<AgentWallet> = {}) {
        this.id = params.id;
        this.agentId = params.agentId;
        this.balance = params.balance ?? 0;
        this.createdAt = params.createdAt ?? new Date();
        this.updatedAt = params.updatedAt ?? new Date();
        this.deletedAt = params.deletedAt;
    }
}

export default AgentWallet;

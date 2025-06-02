class UserIpLog {
    id!: number;
    user!: number;
    ipv4?: string;
    ipv6?: string;
    createdAt!: Date;
    updatedAt!: Date;
    deletedAt?: Date;

    constructor(params: Partial<UserIpLog> = {}) {
        this.id = params.id!;
        this.user = params.user!;
        this.ipv4 = params.ipv4;
        this.ipv6 = params.ipv6;
        this.createdAt = params.createdAt!;
        this.updatedAt = params.updatedAt!;
        this.deletedAt = params.deletedAt;
    }
}

export default UserIpLog;

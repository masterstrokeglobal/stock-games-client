export enum AdminRole {
    SUPER_ADMIN = "super_admin",
    COMPANY_ADMIN = "company_admin",
}


class Admin {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    role?: AdminRole; // Assuming AdminRole is an enum you have defined
    companyId?: number; // Assuming you may want to link to a Company entity
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(params: Partial<Admin> = {}) {
        this.id = params.id;
        this.name = params.name;
        this.email = params.email;
        this.password = params.password;
        this.role = params.role;
        this.companyId = params.companyId;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }

    get isSuperAdmin() {
        return this.role === AdminRole.SUPER_ADMIN;
    }

    get isCompanyAdmin() {
        return this.role === AdminRole.COMPANY_ADMIN;
    }
}

export default Admin;

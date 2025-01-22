import Company from "./company";

export enum AdminRole {
    SUPER_ADMIN = "super_admin",
    COMPANY_ADMIN = "company_admin",
    AGENT = "agent",
}

interface AdminParams {
    id?: number;
    name?: string;
    email?: string;
    company?: Company | Record<string, any>;
    referenceCode?: string;
    password?: string;
    role?: AdminRole;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    firstname?: string;
    lastname?: string;
}

class Admin {
    id?: number;
    name?: string;
    email?: string;
    company?: Company;
    referenceCode?: string;
    password?: string;
    role?: AdminRole;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(params: AdminParams = {}) {
        this.id = params.id;
        this.name = params.name;
        this.email = params.email;
        this.password = params.password;
        this.role = params.role;
        this.referenceCode = params.referenceCode;
        this.createdAt = params.createdAt ? new Date(params.createdAt) : undefined;
        this.updatedAt = params.updatedAt ? new Date(params.updatedAt) : undefined;
        this.deletedAt = params.deletedAt ? new Date(params.deletedAt) : undefined;

        // Handle company initialization
        if (params.company) {
            this.company = params.company instanceof Company
                ? params.company
                : new Company(params.company);
        }

        // Handle name composition from firstname and lastname
        if (params.firstname || params.lastname) {
            this.name = `${params.firstname || ''} ${params.lastname || ''}`.trim();
        }
    }

    get isSuperAdmin(): boolean {
        return this.role === AdminRole.SUPER_ADMIN;
    }

    get isCompanyAdmin(): boolean {
        return this.role === AdminRole.COMPANY_ADMIN;
    }

    get isAgent(): boolean {
        return this.role === AdminRole.AGENT;
    }
}

export default Admin;
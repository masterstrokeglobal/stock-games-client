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
}

export default Admin;

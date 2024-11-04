import Company from "./company";


class User {
    id?: number;
    firstname?: string;
    lastname?: string;
    username?: string;
    email?: string;
    phone?: string;
    password?: string;
    googleId?: string;
    otpSecret?: string;
    isVerified?: boolean;
    company?: Company;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(params: Partial<User> = {}) {
        this.id = params.id;
        this.firstname = params.firstname;
        this.lastname = params.lastname;
        this.username = params.username;
        this.email = params.email;
        this.phone = params.phone;
        this.password = params.password;
        this.googleId = params.googleId;
        this.otpSecret = params.otpSecret;
        this.isVerified = params.isVerified;

        if (params.company) {
            this.company = new Company(params.company);
        }

        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }

    get name() {
        return `${this.firstname} ${this.lastname}`;
    }

}

export default User;

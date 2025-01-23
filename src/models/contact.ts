import User from "./user";

export enum ContactStatus {
    OPEN = "open",
    IN_PROGRESS = "in_progress",
    CLOSED = "closed"
}

class Contact {
    id?: number;
    subject?: string;
    description?: string;
    status: ContactStatus;
    user?: User;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    constructor(params: Partial<Contact> = {}) {
        this.id = params.id;
        this.subject = params.subject;
        this.description = params.description;
        this.status = params.status || ContactStatus.OPEN;

        if (params.user) {
            this.user = new User(params.user);
        }

        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
        this.deletedAt = params.deletedAt;
    }


}

export default Contact;
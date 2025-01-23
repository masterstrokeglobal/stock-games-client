import api from "./instance";
import { ContactFormValues } from "@/components/features/gamer/contact-form";

export const contactAPI = {
    // Create a new contact query
    createContact: async (payload: ContactFormValues) => {
        return api.post("/ticket", payload);
    },

    // Fetch all contacts with optional filters
    getContacts: async (filter?: SearchFilters) => {
        return api.get("/ticket", { params: filter });
    },

    // Fetch a single contact by ID
    getContactById: async (id: string) => {
        return api.get(`/ticket/${id}`);
    },

    // Update a contact status by ID
    updateContactById: async (payload: { id: string; status: string }) => {
        const { id, ...data } = payload;
        return api.patch(`/ticket/${id}`, data);
    },

    // Delete a contact by ID
    deleteContactById: async (id: string) => {
        return api.delete(`/ticket/${id}`);
    }
};
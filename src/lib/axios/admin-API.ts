import api from "./instance";
import { AdminFormValues } from "@/components/features/admin/admin-form";

export const adminAPI = {
    createAdmin: async (payload: any) => {
        return api.post("/admin", payload);
    },

    getAllAdmins: async (filter: SearchFilters) => {
        return api.get("/admin", {
            params: filter
        });
    },

    getAdminById: async (adminId: string) => {
        return api.get(`/admin/${adminId}`);
    },

    updateAdminById: async (payload: AdminFormValues) => {
        const id = payload.id;
        delete payload.id;
        return api.patch(`/admin/${id}`, payload);
    },

    getAdminProfile: async () => {
        return api.get("/admin/profile");
    },
    deleteAdminById: async (adminId: string) => {
        return api.delete(`/admin/${adminId}`);
    },
};

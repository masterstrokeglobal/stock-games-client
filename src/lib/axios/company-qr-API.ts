import api from "./instance";
import { CompanyQRFormSchema } from "@/components/features/company-qr/company-qr-form";

export const companyQRAPI = {
  createCompanyQR: async (payload: CompanyQRFormSchema) => {
    return api.post("/company-qr", payload);
  },

  getCompanyQR: async (filter?: any) => {
    const sanitizedFilter: any = {};
    Object.entries(filter ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        sanitizedFilter[key] = value;
      }
    });
    return api.get("/company-qr", { params: sanitizedFilter });
  },

  getActiveCompanyQR: async (filter?: any) => {
    const sanitizedFilter: any = {};
    Object.entries(filter ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        sanitizedFilter[key] = value;
      }
    });
    return api.get("/company-qr/within-limit", { params: sanitizedFilter });
  },
  getCompanyQRById: async (id: string) => {
    return api.get(`/company-qr/${id}`);
  },

  updateCompanyQRById: async (payload: Partial<CompanyQRFormSchema & { id: string }>) => {
    const { id, ...data } = payload;
    return api.patch(`/company-qr/${id}`, data);
  },

  deleteCompanyQRById: async (id: string) => {
    return api.delete(`/company-qr/${id}`);
  },
};

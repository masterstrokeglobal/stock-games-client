import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { companyQRAPI } from "@/lib/axios/company-qr-API";
import { CompanyQR } from "@/models/company-qr";

export const useCreateCompanyQR = () => {
  return useMutation({
    mutationFn: companyQRAPI.createCompanyQR,
    onSuccess: () => toast.success("Company QR created successfully"),
    onError: (error: any) =>
      toast.error(error.response?.data?.message ?? "Error creating Company QR"),
  });
};

export const useGetCompanyQRs = (filter?: any) => {
  return useQuery({
    queryKey: ["companyQRs", filter],
    queryFn: async () => {
      const response = await companyQRAPI.getCompanyQR(filter);
      return {
        data: response.data.companyQr.map((item: any) => new CompanyQR(item)),
        count: response.data.count
      }
    },
  });
};

export const useGetActiveCompanyQR = (filter?: any) => {
  return useQuery({
    queryKey: ["activeCompanyQR", filter],
    queryFn: async () => {
      const response = await companyQRAPI.getActiveCompanyQR(filter);
      return  response.data.data ? new CompanyQR(response.data.data) : null;
    },
  });
};

export const useGetCompanyQRById = (id: string) => {
  return useQuery({
    queryKey: ["companyQRs", id],
    queryFn: () => companyQRAPI.getCompanyQRById(id),
  });
};

export const useUpdateCompanyQRById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: companyQRAPI.updateCompanyQRById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyQRs"] });
      toast.success("Company QR updated successfully");
    },
    onError: (error: any) =>
      toast.error(error.response?.data?.message ?? "Error updating Company QR"),
  });
};

export const useDeleteCompanyQRById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: companyQRAPI.deleteCompanyQRById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyQRs"] });
      toast.success("Company QR deleted successfully");
    },
    onError: (error: any) =>
      toast.error(error.response?.data?.message ?? "Error deleting Company QR"),
  });
};



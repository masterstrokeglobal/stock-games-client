import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { companyAPI } from "@/lib/axios/company-API"; // Adjust the path as needed

export const useCreateCompany = () => {
    return useMutation({
        mutationFn: companyAPI.createCompany,
        onSuccess: () => {
            toast.success("Company created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.error ?? "Error creating company");
        },
    });
};

export const useGetAllCompanies = () => {
    return useQuery({
        queryKey: ["companies"],
        queryFn: companyAPI.getAllCompanies,
    });
};

export const useGetCompanyById = (companyId: string) => {
    return useQuery({
        queryKey: ["company", companyId],
        queryFn: () => companyAPI.getCompanyById(companyId),
    });
};

export const useUpdateCompanyById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: companyAPI.updateCompanyById,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "companies";
                }
            });
            toast.success("Company updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.error ?? "Error updating company");
        },
    });
};

export const useDeleteCompanyById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: companyAPI.deleteCompanyById,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "companies";
                }
            });
            toast.success("Company deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.error ?? "Error deleting company");
        },
    });
};

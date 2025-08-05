import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { companyApiDetailsAPI } from "@/lib/axios/company-api-details-API"; // Adjust the path as needed
import CompanyApiDetails from "@/models/company-api-details";

export const useCreateCompanyApiDetails = () => {
    return useMutation({
        mutationFn: companyApiDetailsAPI.createCompanyApiDetails,
        onSuccess: () => {
            toast.success("Company API details created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error creating company API details");
        },
    });
};

export const useGetCompanyApiDetails = (companyId: string) => {
    return useQuery({
        queryKey: ["company-api-details", companyId],
        queryFn: async () => {
            const response = await companyApiDetailsAPI.getCompanyApiDetails(companyId)
            return new CompanyApiDetails(response.data.data)
        },
        retry:1,
        enabled: !!companyId,
    });
};

export const useUpdateCompanyApiDetailsById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: companyApiDetailsAPI.updateCompanyApiDetailsById,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "company-api-details";
                }
            });
            toast.success("Company API details updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating company API details");
        },
    });
};

export const useGetCompanyApiDetailsById = (id: string) => {
    return useQuery({
        queryKey: ["company-api-details", id],
        queryFn: () => companyApiDetailsAPI.getCompanyApiDetailsById(id),
        enabled: !!id,
    });
};

export const useDeleteCompanyApiDetailsById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: companyApiDetailsAPI.deleteCompanyApiDetailsById,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "company-api-details";
                }
            });
        }
    })
}
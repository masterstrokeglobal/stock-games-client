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
            toast.error(error.response?.data?.message ?? "Error creating company");
        },
    });
};

export const useGetAllCompanies = (filter: SearchFilters) => {
    return useQuery({
        queryKey: ["companies", filter],
        queryFn: () => companyAPI.getAllCompanies(filter),
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
            toast.error(error.response?.data?.message ?? "Error updating company");
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
            toast.error(error.response?.data?.message ?? "Error deleting company");
        },
    });
};

export const useAddPlacementNotAllowed = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: companyAPI.addPlacementNotAllowed,
        onSuccess: () => {
            toast.success("Placement not allowed added successfully");
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "company";
                }
            });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error adding placement not allowed");
        },
    });
}

export const useRemovePlacementNotAllowed = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: companyAPI.removePlacementNotAllowed,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "company";
                }
            });
            toast.success("Placement not allowed removed successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error removing placement not allowed");
        },
    });
}
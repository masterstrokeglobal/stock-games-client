import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { companyAPI } from "@/lib/axios/company-API"; // Adjust the path as needed
import { COMPANYID } from "@/lib/utils";
import Company from "@/models/company";
import CompanyWallet from "@/models/company-wallet";
import { AxiosError } from "axios";

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

export const useGetCompanyById = (companyId?: string) => {
    return useQuery({
        queryKey: ["company", companyId],
        queryFn: companyId ? () => companyAPI.getCompanyById(companyId) : undefined,
        enabled: !!companyId,
    });
};

export const useGetMyCompany = () => {
    return useQuery({
        queryKey: ["company", "my", COMPANYID],
        queryFn: async () => {
            const company = await companyAPI.getCompanyById(COMPANYID.toString());
            return new Company(company.data);
        },
    });
}

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

export const useUpdateDepositBonusPercentage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: companyAPI.updateDepositBonusPercentage,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "company";
                }
            });
            toast.success("Deposit bonus percentage updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating deposit bonus percentage");
        },
    });
}

export const useUpdateAgentUserBonusPercentage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: companyAPI.updateAgentUserBonusPercentage,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "company";
                }
            });
            toast.success("Agent user bonus percentage updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating agent user bonus percentage");
        },
    });
}

export const useUpdateDepositBonusPercentageEnabled = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: companyAPI.updateDepositBonusPercentageEnabled,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "company";
                }
            });
            toast.success("Deposit bonus percentage enabled updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating deposit bonus percentage enabled");
        },
    });
}

export const useCompanyWalletByCompanyId = ({ companyId }: { companyId: string }) => {
    return useQuery<CompanyWallet, AxiosError>({
        queryKey: ["company", "wallet", companyId],
        queryFn: async () => {
            const company = await companyAPI.companyWalletByCompanyId(companyId);
            return new CompanyWallet(company.data);
        }
    });
}

export const useCreateCompanyWallet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: companyAPI.createCompanyWallet,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "company";
                }
            });
            toast.success("Company wallet created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error creating company wallet");
        },
    });
}

export const useFinancialReport = ({ startDate, endDate }: { startDate: string, endDate: string }) => {
    return useQuery({
        queryKey: ["company", "financial-report", startDate, endDate],
        queryFn: async () => {
            const report = await companyAPI.financialReport({ startDate, endDate });
            return report.data;
        }
    });
}

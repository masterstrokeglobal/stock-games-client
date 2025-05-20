import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ledgerAPI from "@/lib/axios/ledger-API";
import { LedgerFormData } from "@/components/features/ledger/ledger-form";
import { toast } from "sonner";
import Ledger from "@/models/ledger";

export const useGetAllLedgerEntries = (params: SearchFilters) => {
    return useQuery<{ ledger: Ledger[], count: number }>({
        queryKey: ["ledger", params],
        queryFn: async () => {
            const response = await ledgerAPI.getAllLedgerEntries(params);
            return {
                ledger: response.data.ledger.map((ledger: Ledger) => new Ledger(ledger)),
                count: response.data.count
            }
        },
    });
};

export const useGetLedgerById = (id: string) => {
    return useQuery<Ledger>({
        queryKey: ["ledger", id],
        queryFn: async () => {
            const response = await ledgerAPI.getLedgerById(id);
            return new Ledger(response.data);
        },
    });
};

export const useCreateLedgerEntry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ledgerAPI.createLedgerEntry,
        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "ledger" });
            toast.success("Ledger entry created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error creating ledger entry");
        },
    });
};

export const useUpdateLedgerEntry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: LedgerFormData & { id: string }) => ledgerAPI.updateLedgerEntry(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "ledger" });
            toast.success("Ledger entry updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating ledger entry");
        },
    }); 
};

export const useDeleteLedgerEntry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => ledgerAPI.deleteLedgerEntry(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === "ledger" });
            toast.success("Ledger entry deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error deleting ledger entry");
        },
    });
};  

export const useGetLedgerReport = ({companyId, startDate, endDate}: {companyId?: string, startDate?: Date, endDate?: Date}) => {
    return useQuery({
        queryKey: ["ledger", companyId, startDate, endDate],
        queryFn: () => ledgerAPI.getLedgerReport({companyId: companyId?.toString() ?? "", startDate: startDate ?? new Date(), endDate: endDate ?? new Date()}),
        enabled: !!companyId && !!startDate && !!endDate,
    });
};


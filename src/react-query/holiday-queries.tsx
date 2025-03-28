import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { holidayAPI } from "@/lib/axios/holiday-API"; // Adjust the path as needed

export const useGetAllHolidays = (filter?: any) => {
    return useQuery({
        queryKey: ["holidays", filter],
        queryFn: () => holidayAPI.getAllHolidays(filter),
    });
};

export const useGetHolidayById = (holidayId: string) => {
    return useQuery({
        queryKey: ["holidays", holidayId],
        queryFn: () => holidayAPI.getHolidayById(holidayId),
    });
};

export const useCreateHoliday = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: holidayAPI.createHoliday,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "holidays";
                },
            });
            toast.success("Holiday created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message ?? "Error creating holiday");
        },
    });
};

export const useUpdateHoliday = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ holidayId, data }: { holidayId: string, data: any }) =>
            holidayAPI.updateHoliday(holidayId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "holidays";
                },
            });
            toast.success("Holiday updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message ?? "Error updating holiday");
        },
    });
};

export const useDeleteHoliday = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: holidayAPI.deleteHoliday,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "holidays";
                },
            });
            toast.success("Holiday deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message ?? "Error deleting holiday");
        },
    });
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { schedulerAPI } from "@/lib/axios/scheduler-API";


// Hook to create a new scheduler
export const useCreateScheduler = () => {
    return useMutation({
        mutationFn: schedulerAPI.createScheduler,
        onSuccess: () => {
            toast.success("Scheduler created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.error ?? "Error creating scheduler");
        },
    });
};

// Hook to get all schedulers with optional filters
export const useGetSchedulers = (filter?: SearchFilters) => {
    return useQuery({
        queryKey: ["schedulers", filter],
        queryFn: () => schedulerAPI.getSchedulers(filter),
    });
};

// Hook to update a scheduler by ID
export const useUpdateSchedulerById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: schedulerAPI.updateSchedulerById,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "schedulers",
            });
            toast.success("Scheduler updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.error ?? "Error updating scheduler");
        },
    });
};

// Hook to get a specific scheduler by ID
export const useGetSchedulerById = (id: string) => {
    return useQuery({
        queryKey: ["schedulers", id],
        queryFn: () => schedulerAPI.getSchedulerById(id),
    });
};

// Hook to get a unique scheduler based on filter criteria
export const useGetUniqueScheduler = (filter?: any) => {
    return useQuery({
        queryKey: ["uniqueScheduler", filter],
        queryFn: () => schedulerAPI.getUniqueScheduler(filter),
    });
};

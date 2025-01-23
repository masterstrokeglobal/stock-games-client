import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { contactAPI } from "@/lib/axios/contact-API";

// Hook to create a new contact
export const useCreateContact = () => {
    return useMutation({
        mutationFn: contactAPI.createContact,
        onSuccess: () => {
            toast.success("Message sent successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message ?? "Error sending message");
        },
    });
};

// Hook to get all contacts with optional filters
export const useGetContacts = (filter?: SearchFilters) => {
    return useQuery({
        queryKey: ["contacts", filter],
        queryFn: () => contactAPI.getContacts(filter),
    });
};

// Hook to get a specific contact by ID
export const useGetContactById = (id: string) => {
    return useQuery({
        queryKey: ["contacts", id],
        queryFn: () => contactAPI.getContactById(id),
        enabled: !!id,
    });
};

// Hook to update a contact's status
export const useUpdateContactById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: contactAPI.updateContactById,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "contacts",
            });
            toast.success("Contact status updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating contact status");
        },
    });
};

// Hook to delete a contact
export const useDeleteContactById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: contactAPI.deleteContactById,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "contacts",
            });
            toast.success("Contact deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error deleting contact");
        },
    });
};
"use client";

import LoadingScreen from "@/components/common/loading-screen";
import AdminForm, { AdminFormValues } from "@/components/features/admin/admin-form"; // Adjust the import based on your file structure
import { Separator } from "@/components/ui/separator";
import Admin from "@/models/admin"; // Adjust the import according to your models
import { useGetAdminById, useUpdateAdminById } from "@/react-query/admin-queries"; // Import hooks for fetching and updating admin
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

const EditAdminPage = () => {
    const params = useParams();
    const { id } = params; // Extract admin ID from parameters
    const { data, isLoading, isSuccess } = useGetAdminById(id.toString()); // Fetch the admin data by ID
    const { mutate, isPending } = useUpdateAdminById(); // Hook for updating an admin
    const router = useRouter();

    const defaultValues: AdminFormValues | null = useMemo(() => {
        if (!isSuccess) return null;

        const adminItem = new Admin(data?.data);
        const formValues: AdminFormValues = {
            id: adminItem.id?.toString(),
            name: adminItem.name,
            email: adminItem.email ?? "",
            companyId: adminItem.company?.id?.toString() || "", // Assuming companyId might be nullable
        };
        return formValues;
    }, [data, isSuccess]);

    const onSubmit = (data: AdminFormValues) => {

        const formData = {
            ...data,
            id: id.toString(),
        };
        mutate(formData, {
            onSuccess: () => {
                router.push("/dashboard/admins");
            },
        });
    };

    if (isLoading) return <LoadingScreen>Loading admin...</LoadingScreen>; // Show loading screen

    return (
        <section className="container-main min-h-[60vh] max-w-xl">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Edit Admin</h2>
            </header>
            <Separator className="mt-4" />
            <main className="mt-4">
                <AdminForm
                    defaultValues={defaultValues as any} // Pass default values to the form
                    onSubmit={onSubmit} // Handle form submission
                    isLoading={isPending} // Loading state for the submission
                />
            </main>
        </section>
    );
};

export default EditAdminPage;

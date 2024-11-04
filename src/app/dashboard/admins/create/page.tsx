"use client";

import AdminForm, { AdminFormValues } from "@/components/features/admin/admin-form"; // Adjust the import based on your file structure
import { Separator } from "@/components/ui/separator";
import { useCreateAdmin } from "@/react-query/admin-queries"; // Import the query hook for creating an admin
import { useRouter } from "next/navigation";

const defaultValues: AdminFormValues = {
    name: "",
    email: "",
    password: "",
    companyId: "", // Can be "none" or empty initially
};

const CreateAdminPage = () => {
    const router = useRouter();
    const { mutate, isPending } = useCreateAdmin();

    const onSubmit = (data: AdminFormValues) => {

        mutate(data, {
            onSuccess: () => {
                router.push("/dashboard/admins");
            },
        });
    };

    return (
        <section className="container-main min-h-[60vh] max-w-xl">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Create Admin</h2>
            </header>
            <Separator className="mt-4" />
            <main className="mt-4">
                <AdminForm
                    defaultValues={defaultValues}
                    onSubmit={onSubmit}
                    isLoading={isPending} // Loading state to show while creating
                />
            </main>
        </section>
    );
};

export default CreateAdminPage;

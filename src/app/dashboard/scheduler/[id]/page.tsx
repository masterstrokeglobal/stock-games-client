"use client";

import React, { useMemo } from "react";
import LoadingScreen from "@/components/common/loading-screen";
import SchedulerForm, { SchedulerFormValues } from "@/components/features/scheduler/scheduler-form";
import { useGetSchedulerById, useUpdateSchedulerById } from "@/react-query/scheduler-queries";
import { useParams, useRouter } from "next/navigation";

const EditSchedulerPage = () => {
    const params = useParams();
    const { id } = params; // Extract scheduler ID from the route
    const { data, isLoading, isSuccess } = useGetSchedulerById(id.toString()); // Fetch scheduler data by ID
    const { mutate, isPending } = useUpdateSchedulerById(); // Hook for updating scheduler
    const router = useRouter();

    // Pre-fill form values with fetched data
    const defaultValues: SchedulerFormValues | null = useMemo(() => {
        if (!isSuccess) return null;

        const scheduler = data.data;

        return {
            id: scheduler.id?.toString(),
            startDate: scheduler.startDate ? new Date(scheduler.startDate) : new Date(),
            endDate: scheduler.endDate ? new Date(scheduler.endDate) : new Date(),
            startTime: scheduler.startTime,
            endTime: scheduler.endTime,
            type: scheduler.type ?? "",
            companyId: scheduler.companyId.toString() ?? null,
        };
    }, [data, isSuccess]);


    const onSubmit = (data: SchedulerFormValues) => {
        mutate(data, {
            onSuccess: () => {
                router.push("/dashboard/scheduler"); // Redirect after successful update
            },
        });
    };

    // Show loading screen while fetching data
    if (isLoading) return <LoadingScreen>Loading scheduler...</LoadingScreen>;

    return (
        <section className="container-main min-h-[60vh] max-w-xl">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Edit Scheduler</h2>
            </header>
            <main className="mt-4">
                {defaultValues ? (
                    <SchedulerForm
                        defaultValues={defaultValues}
                        onSubmit={onSubmit}
                        isLoading={isPending}
                    />
                ) : (
                    <p>No data available</p>
                )}
            </main>
        </section>
    );
};

export default EditSchedulerPage;

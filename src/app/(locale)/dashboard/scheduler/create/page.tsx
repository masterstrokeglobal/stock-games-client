"use client";

import React from "react";
import SchedulerForm, { SchedulerFormValues } from "@/components/features/scheduler/scheduler-form";
import { useCreateScheduler } from "@/react-query/scheduler-queries";
import { useRouter } from "next/navigation";
import { SchedulerType } from "@/models/market-item";
import { useAuthStore } from "@/context/auth-context";

const defaultValues: SchedulerFormValues = {
    startDate: new Date(),
    endDate: new Date(),
    createRound: true,
    endTime: "",
    startTime: "",
    type: SchedulerType.NSE, // Replace 'SomeValidType' with an actual value from SchedulerType
};

const CreateSchedulerPage = () => {
    const router = useRouter();
    const { userDetails } = useAuthStore();
    const { mutate, isPending } = useCreateScheduler();

    const onSubmit = (data: SchedulerFormValues) => {
        const companyId = userDetails?.company?.id;
        if (companyId) {
            mutate({
                ...data,
                companyId: companyId.toString(),
            }, {
                onSuccess: () => {
                    router.push("/dashboard/scheduler"); // Redirect to scheduler list page after creation
                },
            });
        };
    }

    return (
        <section className="container-main min-h-[60vh] max-w-xl">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Create Scheduler</h2>
            </header>
            <main className="mt-4">
                <SchedulerForm
                    defaultValues={defaultValues}
                    onSubmit={onSubmit}
                    isLoading={isPending}
                />
            </main>
        </section>
    );
};

export default CreateSchedulerPage;

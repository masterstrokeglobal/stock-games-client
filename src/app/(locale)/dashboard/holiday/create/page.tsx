"use client";

import React from "react";
import HolidayForm, { HolidayFormValues } from "@/components/features/holiday/holiday-form";
import { useCreateHoliday } from "@/react-query/holiday-queries";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/context/auth-context";
import { SchedulerType } from "@/models/market-item";

const defaultValues: HolidayFormValues = {
    date: new Date(),
    type: SchedulerType.NSE
};

const CreateHolidayPage = () => {
    const router = useRouter();
    const { userDetails } = useAuthStore();
    const { mutate, isPending } = useCreateHoliday();

    const onSubmit = (data: HolidayFormValues) => {
        const companyId = userDetails?.company?.id;
        if (companyId) {
            mutate({
                ...data,
                companyId: companyId.toString(),
            }, {
                onSuccess: () => {
                    router.push("/dashboard/holidays");
                },
            });
        }
    }

    return (
        <section className="container-main min-h-[60vh] max-w-xl">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Create Holiday</h2>
            </header>
            <main className="mt-4">
                <HolidayForm
                    defaultValues={defaultValues}
                    onSubmit={onSubmit}
                    isLoading={isPending}
                />
            </main>
        </section>
    );
};

export default CreateHolidayPage;
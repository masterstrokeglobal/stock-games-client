"use client";

import LoadingScreen from "@/components/common/loading-screen";
import HolidayForm, { HolidayFormValues } from "@/components/features/holiday/holiday-form";
import { useGetHolidayById, useUpdateHoliday } from "@/react-query/holiday-queries";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

const EditHolidayPage = () => {
    const params = useParams();
    const { id } = params; // Extract holiday ID from the route
    const { data, isLoading, isSuccess } = useGetHolidayById(id.toString()); // Fetch holiday data by ID
    const { mutate, isPending } = useUpdateHoliday(); // Hook for updating holiday
    const router = useRouter();

    // Pre-fill form values with fetched data
    const defaultValues: HolidayFormValues | null = useMemo(() => {
        if (!isSuccess) return null;

        const holiday = data.data;

        return {
            type: holiday.type,
            date: holiday.startDate
        };
    }, [data, isSuccess]);

    const onSubmit = (data: HolidayFormValues) => {
        mutate({
            holidayId: id.toString(),
            data: {
                date: data.date
            }
        }, {
            onSuccess: () => {
                router.push("/dashboard/holiday"); // Redirect after successful update
            },
        });
    };

    // Show loading screen while fetching data
    if (isLoading) return <LoadingScreen>Loading holiday...</LoadingScreen>;

    return (
        <section className="container-main min-h-[60vh] max-w-xl">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Edit Holiday</h2>
            </header>
            <main className="mt-4">
                {defaultValues ? (
                    <HolidayForm
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

export default EditHolidayPage;
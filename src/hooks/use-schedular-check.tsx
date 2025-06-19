import { useGetSchedulers } from "@/react-query/scheduler-queries";
import { SchedulerType } from "@/models/market-item";
import { COMPANYID } from "@/lib/utils";
import { Scheduler } from "@/models/schedular";
import { useMemo } from "react";

const useSchedularCheck = () => {
    const { data, isSuccess, isFetching } = useGetSchedulers({
        page: 1,
        search: "",
        limit: 1000,
        companyId: COMPANYID.toString(),
    });

    const schedulers = useMemo(() => {
        if (isSuccess && data?.data?.schedulers) {
            return Array.from(data.data.schedulers).map(
                (scheduler: any) => new Scheduler(scheduler)
            );
        }
        return [];
    }, [data, isSuccess]);

    const schedulerStatus = useMemo(() => {
        const now = new Date();
        const statusMap: Record<SchedulerType, boolean> = {} as Record<SchedulerType, boolean>;

        schedulers?.forEach((scheduler) => {
            if (!scheduler.type) return;

            if (!scheduler.startDate || !scheduler.endDate || !scheduler.startTime || !scheduler.endTime) {
                statusMap[scheduler.type] = false;
                return;
            }

            // Check if current date falls within the scheduler's date range first
            const currentDate = now;
            const isWithinDateRange = currentDate >= scheduler.startDate && currentDate <= scheduler.endDate;

            if (!isWithinDateRange) {
                statusMap[scheduler.type] = false;
                return;
            }

            statusMap[scheduler.type] = scheduler.createRound ?? false;
        });

        return statusMap;
    }, [schedulers]);

    return { schedulers, isFetching, schedulerStatus };
};

export default useSchedularCheck;
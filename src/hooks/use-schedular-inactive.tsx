import { useGetSchedulers } from "@/react-query/scheduler-queries";
import { SchedulerType } from "@/models/market-item";
import { COMPANYID } from "@/lib/utils";
import { Scheduler } from "@/models/schedular";
import { useMemo } from "react";

const useSchedularInactive = (schedulerType: SchedulerType) => {
    const { data, isSuccess, isFetching } = useGetSchedulers({
        page: 1,
        search: "",
        limit: 1000,
        companyId: COMPANYID.toString(),
        type: schedulerType
    });

    const schedulers = useMemo(() => {
        if (isSuccess && data?.data?.schedulers) {
            return Array.from(data.data.schedulers).map(
                (scheduler: any) => new Scheduler(scheduler)
            );
        }
        return [];
    }, [data, isSuccess]);

    const isActive = useMemo(() => {
        const now = new Date();

        return schedulers?.some((scheduler) => {
            if (!scheduler.startDate || !scheduler.endDate || !scheduler.startTime || !scheduler.endTime) {
                return false;
            }

            // Check if current date falls within the scheduler's date range first
            const currentDate = now;
            const isWithinDateRange = currentDate >= scheduler.startDate && currentDate <= scheduler.endDate;


            if (!isWithinDateRange) {
                return false;
            }
   
            return scheduler.createRound ;
        });
    }, [schedulers]);

    return { schedulers, isFetching, isActive };
};

export default useSchedularInactive;    
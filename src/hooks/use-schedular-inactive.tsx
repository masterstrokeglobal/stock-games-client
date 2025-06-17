import { useGetSchedulers } from "@/react-query/scheduler-queries";
import { SchedulerType } from "@/models/market-item";
import { COMPANYID } from "@/lib/utils";

const useSchedularInactive = (schedulerType: SchedulerType) => {

    const { data: schedulers } = useGetSchedulers({
        page: 1,
        limit: 1000,
        companyId: COMPANYID.toString(),
        search: "",
        type: schedulerType
    })

    return { schedulers };
};

export default useSchedularInactive;    
import { useMemo } from "react";

import { RoundRecord } from "@/models/round-record";
import { useGetRoundRecordById } from "@/react-query/round-record-queries";
import { useEffect } from "react";

const useWinningId = (roundRecord: RoundRecord | null,timeToFetch:number=500) => {
    const { refetch, data, isSuccess } = useGetRoundRecordById(roundRecord?.id);

    useEffect(() => {
        if (!roundRecord) return;
        const resultFetchTime = new Date(roundRecord.endTime).getTime() - new Date().getTime() + timeToFetch;
        const timer = setTimeout(() => {
            refetch().then((result) => {
                const isResultPresent = result.data?.data?.winningId;
                if (isResultPresent) {
                    clearTimeout(timer);
                }
                else {
                    refetch();
                    clearTimeout(timer);
                }
            });
        }, resultFetchTime);
        return () => clearTimeout(timer);
    }, [roundRecord, refetch]);

    const roundRecordWithWinningId: RoundRecord | null = useMemo(() => {
        if (!isSuccess || !data?.data) return null;
        if (roundRecord?.id === data?.data?.id) {
            // Only create new RoundRecord if the data has actually changed
            return new RoundRecord(data.data as RoundRecord) || null;
        }
        return null;
    }, [data?.data, isSuccess, roundRecord?.id]);

    return roundRecordWithWinningId;
};

export default useWinningId;

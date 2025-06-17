import { useMemo } from "react";

import { RoundRecord } from "@/models/round-record";
import { useGetRoundRecordById } from "@/react-query/round-record-queries";
import { useEffect } from "react";

const useWinningId = (roundRecord: RoundRecord | null) => {
    const { refetch, data, isSuccess } = useGetRoundRecordById(roundRecord?.id);

    useEffect(() => {
        if (!roundRecord) return;
        const resultFetchTime = new Date(roundRecord.endTime).getTime() - new Date().getTime();
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
        if (!isSuccess) return null;
        if (roundRecord?.id == data?.data?.id) return new RoundRecord(data.data as RoundRecord) || null;
        return null;
    }, [data, isSuccess, roundRecord]);

    return roundRecordWithWinningId;
};

export default useWinningId;

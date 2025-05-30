import { useMemo } from "react";

import { RoundRecord } from "@/models/round-record";
import { useGetRoundRecordById } from "@/react-query/round-record-queries";
import { useEffect } from "react";

const useWinningId = (roundRecord: RoundRecord | null) => {
    const { refetch, data, isSuccess } = useGetRoundRecordById(roundRecord?.id);

    useEffect(() => {
        if (!roundRecord) return;
        const resultFetchTime = new Date(roundRecord.endTime).getTime() - new Date().getTime() + 3000;

        const timer = setTimeout(() => {
            refetch();
        }, resultFetchTime);
        return () => clearTimeout(timer);
    }, [roundRecord, refetch]);

    const winningMarketId: number[] | null = useMemo(() => {
        if (!isSuccess) return null;
        if (roundRecord?.id == data?.data?.id) return (data.data as RoundRecord).winningId || null;
        return null;
    }, [data, isSuccess, roundRecord]);

    return winningMarketId;
};

export default useWinningId;

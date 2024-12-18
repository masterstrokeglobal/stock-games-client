"use client";
import AgentProfitLossCard from "@/components/features/agent/agent-profit-loss";
import DatePicker from "@/components/ui/date-picker";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/context/auth-context";
import { useGetAgentProfitLoss } from "@/react-query/agent-queries";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

const AgentProfitLoss = () => {
    const [filter, setFilter] = useState({
        //start of month
        startDate: dayjs().startOf("month").toDate(),
        endDate: dayjs().endOf("month").toDate(),
    });
    const { userDetails } = useAuthStore();

    const agentId = userDetails?.id;

    const {
        data,
        isSuccess,
        isLoading,
    } = useGetAgentProfitLoss(
        {
            agentId: agentId?.toString(),
            startDate: filter.startDate,
            endDate: filter.endDate,
        }
    );

    const profitLoss = useMemo(() => {
        if (isSuccess) {
            return data.data;
        }
        return null;
    }, [data, isSuccess]);

    return (
        <section className="container-main min-h-[60vh]">
            <main className="mt-4 space-y-8">
                <h1 className="text-2xl font-semibold">Agent Profit and Loss</h1>

                <Separator />
                <div className="flex justify-between items-end gap-4">
                    <h2 className="text-xl font-semibold" >Filters</h2>
                    <div className="flex gap-4">

                    <DatePicker value={filter.startDate} onSelect={(date) => setFilter({ ...filter, startDate: date })} label="Start Date" />
                    <DatePicker value={filter.endDate} onSelect={(date) => setFilter({ ...filter, endDate: date })} label="End Date" />
                    </div>
                </div>
                {isLoading && <div>Loading...</div>}
                {isSuccess && <AgentProfitLossCard data={profitLoss} />}
            </main>
        </section>
    );
};

export default AgentProfitLoss;
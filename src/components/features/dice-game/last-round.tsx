"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import useWindowSize from "@/hooks/use-window-size";
import { cn } from "@/lib/utils";
import { RoundRecord } from "@/models/round-record";
import { useGetDiceLast10RoundDetails } from "@/react-query/round-record-queries";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";

// Enhanced interface for ranked market items
type Props = {
    roundRecord: RoundRecord;
    className?: string;
}

const LastRoundWinner = ({ roundRecord, className }: Props) => {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const { data, isSuccess, refetch } = useGetDiceLast10RoundDetails();
    const { isMobile } = useWindowSize();

    useEffect(() => {
        const resultFetchTime = new Date(roundRecord.endTime).getTime() - new Date().getTime() + 4000;

        const timer = setTimeout(() => {
            refetch();
        }, resultFetchTime);

        return () => clearTimeout(timer);
    }, [roundRecord, refetch]);


    return (
        <section
            ref={sectionRef}
            className={cn("md:rounded-sm h-full !pb-0.5 overflow-hidden w-full", className)}
        >
            <div className="md:rounded-sm h-full">
                <header className="text-white bg-[#0C309E] dice-header text-center py-3 px-4 font-bold">
                    Last Round Results
                </header>
                <ScrollArea
                    style={{ height: isMobile ? "300px" : "100%" }}
                    type="auto"
                    scrollThumbClassName="bg-[#4467CC]"
                >
                    <table className="min-w-full mb-12 relative">
                        <thead className="sticky border-[#4467CC80] bg-[#140538] border-b top-0 py-2">
                            <tr className="text-game-text text-sm">
                                <th className="p-2 py-3 text-left text-white">
                                    Round Id
                                </th>
                                <th className="p-2 py-3 text-left text-white">
                                    Time
                                </th>
                                <th className="p-2 py-3 text-right text-white">
                                    Result
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {isSuccess && data && data.length > 0 ? (
                                data.slice(0, 10).map((round) => (
                                    <tr 
                                        key={round.id} 
                                        className="border-b last:border-none text-game-secondary border-[#DADCE00D] overflow-hidden"
                                    >
                                        <td className="p-2">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-game-secondary text-sm">
                                                    #{round.id}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-2">
                                            <span className="text-game-secondary text-sm">
                                                {dayjs(round.createdAt).format("DD/MM/YYYY HH:mm A")}
                                            </span>
                                        </td>
                                        <td className="p-2 text-center">
                                            <div className="text-white font-bold">
                                                {round.winningNumber || 10}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="text-game-secondary text-center py-8">
                                        No previous rounds available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </section>
    );
};

export default LastRoundWinner;
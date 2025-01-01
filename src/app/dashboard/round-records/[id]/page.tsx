"use client";

import LoadingScreen from "@/components/common/loading-screen";
import RoundRecordCard from "@/components/features/round-record/round-record-card";
import {RoundRecord} from "@/models/round-record"; // Adjust the import path
import { useGetRoundRecordById } from "@/react-query/round-record-queries"; // Custom hook for fetching round record details
import { useParams } from "next/navigation";
import { useMemo } from "react";

const ViewRoundRecordPage = () => {
    const params = useParams();
    const { id } = params;
    const { data, isLoading, isSuccess } = useGetRoundRecordById(Number(id)); // Fetch round record data by ID

    const roundRecordDetails = useMemo(() => {
        if (isSuccess) {
            return new RoundRecord(data?.data); 
        }
        return null;
    }, [data, isSuccess]);

    if (isLoading) return <LoadingScreen className="h-[60vh]">Loading round record...</LoadingScreen>; // Show loading screen

    return (
        <section className="container-main min-h-[60vh]">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Round Record Details</h2>
            </header>
            <main className="mt-4">
                {roundRecordDetails && <RoundRecordCard roundRecord={roundRecordDetails} />}
            </main>
        </section>
    );
};

export default ViewRoundRecordPage;

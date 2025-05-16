"use client";

import LoadingScreen from "@/components/common/loading-screen";
import LedgerForm, { LedgerFormData } from "@/components/features/ledger/ledger-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetLedgerById, useUpdateLedgerEntry } from "@/react-query/ledger-queries";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const CompanyLedgerPage = () => {
    const id = useParams().id;
    const { data, isLoading } = useGetLedgerById(id as string);
    const defaultValues: LedgerFormData | null = useMemo(() => {
        if (!data) return null;
        return {
            amount: data?.amount,
            entryType: data?.entryType,
        }
    }, [data]);
    const { mutate: updateLedgerEntry, isPending } = useUpdateLedgerEntry();

    const handleSubmit = (data: LedgerFormData) => {
        updateLedgerEntry({ id: id as string, ...data });
    }

    if (isLoading || !defaultValues) return <LoadingScreen className="min-h-screen" />

    return <section className="container mx-auto px-4 py-8 max-w-4xl">

        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-3xl font-bold">Update Ledger Entry</h1>
                <p className="text-gray-500 mt-1">Update the transaction to the company ledger</p>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
                <CardDescription>
                    Enter the transaction details below. Company ID: {id || "Not specified"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <LedgerForm
                    onSubmit={handleSubmit}
                    isLoading={isPending}
                    defaultValues={defaultValues}
                />
            </CardContent>
        </Card>
    </section>
};

export default CompanyLedgerPage;

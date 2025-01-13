"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/components/common/container";
import TopBar from "@/components/common/top-bar";
import { useCreateWithdrawDetail } from "@/react-query/withdrawl-details-queries";
import BankAccountForm, { BankAccountFormValues } from "@/components/features/game/wallet/bank-details-form";
import { useTranslations } from "next-intl";

const AddBankDetailsPage = () => {
    const t = useTranslations('bank-form');
    const searchParams = useSearchParams();
    const { mutate, isPending } = useCreateWithdrawDetail();
    const router = useRouter();

    // Determine if the form should show bank details or UPI based on the `type` search parameter
    const isUPI = searchParams.get("type") === "upi";

    const handleSubmit = (data: BankAccountFormValues) => {
        mutate(data, {
            onSuccess: () => {
                // Redirect to the wallet page after successful submission
                router.push("/game/wallet/menu/withdrawl-details");
            },
        });
    };

    return (
        <Container className="flex flex-col items-center min-h-screen pt-24">
            <TopBar>
                {t('page-title')}
            </TopBar>
            <main className="mt-4 w-full mx-auto h-full max-w-xl">
                <BankAccountForm
                    onSubmit={handleSubmit}
                    isLoading={isPending}
                    isUPI={isUPI}
                />
            </main>
        </Container>
    );
};

export default AddBankDetailsPage;
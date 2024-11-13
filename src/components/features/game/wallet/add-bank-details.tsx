import React, { useState } from "react";
import Container from "@/components/common/container";
import TopBar from "@/components/common/top-bar";
import { useCreateWithdrawDetail } from "@/react-query/withdrawl-details-queries";
import BankAccountForm, { BankAccountFormValues } from "./bank-details-form";

const AddBankDetailsPage = () => {
    const { mutate, isPending } = useCreateWithdrawDetail();
    const [defaultValues, setDefaultValues] = useState<BankAccountFormValues>({
        cardHolder: "",
        accountNumber: "",
        ifscCode: "",
    });

    const handleSubmit = (data: BankAccountFormValues) => {
        mutate(data);
    };

    return (
        <Container className="flex flex-col items-center min-h-screen">
            <TopBar >
                Your Wallet
            </TopBar>
            <main className="mt-4">
                <BankAccountForm
                    defaultValues={defaultValues}
                    onSubmit={handleSubmit}
                    isLoading={isPending}
                />
            </main>
        </Container>
    );
};

export default AddBankDetailsPage;
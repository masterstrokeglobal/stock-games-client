'use client';

import React from 'react';
import Container from '@/components/common/container';
import TopBar from '@/components/common/top-bar';
import WithdrawForm, { WithdrawFormValues } from '@/components/features/gamer/wallet/withdrawl-form';
import { useCreateWithdrawalRequest } from '@/react-query/payment-queries';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const WithdrawalFormPage = () => {
    const { mutate, isPending } = useCreateWithdrawalRequest();
    const {isLoading,data} = 
    const router = useRouter();

    const onSubmit = async (data: WithdrawFormValues) => {
        // Ensure amount is converted to integer
        const withdrawalData = {
            ...data,
            amount: parseInt(data.amount.toString()),
        };

        mutate(withdrawalData);
    };

    return (
        <Container className="flex flex-col space-y-8 items-center min-h-screen pt-24">
            <TopBar>
                <h1 className="text-xl font-semibold">Withdraw Funds</h1>
            </TopBar>

            <div className="w-full max-w-md px-4">
                <WithdrawForm isLoading={isPending}

                    onSubmit={onSubmit} />
            </div>
        </Container>
    );
};

export default WithdrawalFormPage; 
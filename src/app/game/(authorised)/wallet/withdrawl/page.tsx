'use client';

import React, { useMemo } from 'react';
import Container from '@/components/common/container';
import TopBar from '@/components/common/top-bar';
import WithdrawForm, { WithdrawFormValues } from '@/components/features/gamer/wallet/withdrawl-form';
import { useCreateWithdrawalRequest, useGetWallet } from '@/react-query/payment-queries';
import Wallet from '@/models/wallet';
import { useRouter } from 'next/navigation';

const WithdrawalFormPage = () => {
    const { mutate, isPending } = useCreateWithdrawalRequest();
    const { data, isLoading } = useGetWallet();
    const router  = useRouter();

    const wallet = useMemo(() => {
        if (isLoading) return new Wallet();
        return new Wallet(data?.data?.wallet);
    }, [data])

    const onSubmit = async (data: WithdrawFormValues) => {
        // Ensure amount is converted to integer
        const withdrawalData = {
            ...data,
            amount: parseInt(data.amount.toString()),
        };
        mutate(withdrawalData,{
            onSuccess: () => {
               router.push('/game/user-menu');
            }
        });
    };

    return (
        <Container className="flex flex-col space-y-8 items-center min-h-screen pt-24">
            <TopBar>
                <h1 className="text-xl font-semibold">Withdraw Funds</h1>
            </TopBar>

            <div className="w-full max-w-md px-4">
                {isLoading && <div>Loading...</div>}
                {!isLoading && (
                    <WithdrawForm
                        onSubmit={onSubmit}
                        totalAmount={wallet.totalBalance}
                        isLoading={isPending}
                    />
                )}
            </div>
        </Container>
    );
};

export default WithdrawalFormPage; 
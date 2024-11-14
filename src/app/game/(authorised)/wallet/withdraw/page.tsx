"use client"
import React from 'react';
import Container from '@/components/common/container';
import TopBar from '@/components/common/top-bar';
import DepositForm, { DepositFormValues } from '@/components/features/gamer/wallet/deposit-form';
import { useCreateDepositRequest } from '@/react-query/payment-queries';
import { useRouter } from 'next/navigation';

const DepositFormPage = () => {

    const { mutate } = useCreateDepositRequest();

    const router = useRouter();

    const onSubmit = async (data: DepositFormValues) => {

        data.amount = parseInt(data.amount.toString());
        mutate(data, {
            onSuccess: () => {
                router.push('/game/profile');
            },
            onError: (error: any) => {
                console.log('Error creating deposit request');
            }
        });
    }

    return (
        <Container className="flex flex-col space-y-8 items-center min-h-screen pt-24">
            <TopBar >
                Deposit Funds
            </TopBar>
            <DepositForm onSubmit={onSubmit} />
        </Container>
    );
};

export default DepositFormPage;
"use client"
import React from 'react';
import Container from '@/components/common/container';
import TopBar from '@/components/common/top-bar';
import DepositForm, { DepositFormValues } from '@/components/features/gamer/wallet/deposit-form';
import { useCreateDepositRequest } from '@/react-query/payment-queries';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/context/auth-context';

const DepositFormPage = () => {

    const { mutate, isPending } = useCreateDepositRequest();

    const { userDetails } = useAuthStore();
    const router = useRouter();
    const company = userDetails?.company;

    const onSubmit = async (data: DepositFormValues) => {
        data.amount = parseInt(data.amount.toString());
        mutate(data, {
            onSuccess: (data) => {
                const responseLink = data.data?.response;
                if (responseLink) {
                    window.open(responseLink, '_blank');
                    router.push('/game/platform/user-menu');
                } else {
                    router.push('/game/platform/user-menu');
                }
            },
            onError: () => {
                console.log('Error creating deposit request');
            }
        });
    }

    return (
        <Container className="flex flex-col space-y-8 items-center  bg-primary-game  pt-24">
            <TopBar >
                Deposit Funds
            </TopBar>
            <DepositForm onSubmit={onSubmit} isLoading={isPending} external={company!.externalPayIn} />
        </Container>
    );
};

export default DepositFormPage;
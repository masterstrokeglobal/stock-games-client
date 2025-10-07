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
            onSuccess: (response) => {
                const transaction = response.data?.transaction;
                const paymentLinkResponse = response.data?.response;
                
                // Check if payment_link exists in the response
                if (paymentLinkResponse?.payment_link || paymentLinkResponse) {
                    const paymentLink = paymentLinkResponse?.payment_link || paymentLinkResponse;
                    // Redirect to payment status page with transaction ID and payment link
                    const params = new URLSearchParams({
                        transactionId: transaction?.id?.toString() || '',
                        paymentLink: paymentLink
                    });
                    router.push(`/game/wallet/payment-status?${params.toString()}`);
                } else {
                    // Fallback to existing manual flow (for non-21 companies)
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
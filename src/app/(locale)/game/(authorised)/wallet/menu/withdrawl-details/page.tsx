"use client"

import Container from '@/components/common/container';
import Navbar from '@/components/features/game/navbar';
import { BankIcon, DeleteIcon, UPIIcon } from '@/components/features/user-menu/icons';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import WithdrawDetailsRecord from '@/models/withdrawl-details';
import { useDeleteWithdrawDetailById, useGetAllWithdrawDetails } from '@/react-query/withdrawl-details-queries';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { useMemo } from 'react';

const PaymentMethodCards = () => {
    const t = useTranslations('payment-methods');
    const { data, isSuccess } = useGetAllWithdrawDetails({});
    const { mutate: deleteWithdrawDetail } = useDeleteWithdrawDetailById();
    const [showAddPaymentMethod, setShowAddPaymentMethod] = React.useState(false);

    const withdrawDetails: WithdrawDetailsRecord[] = useMemo(() => {
        if (isSuccess) {
            return data?.data.map((detail: any) => new WithdrawDetailsRecord(detail));
        }
        return [];
    }, [data, isSuccess]);

    return (
        <Container className="flex flex-col items-center min-h-screen pt-24">
            <Navbar />
            <div className="w-full max-w-sm mt-8 mx-auto h-full space-y-4">
                {!showAddPaymentMethod && withdrawDetails.length > 0 && (
                    <>
                        {withdrawDetails?.map((detail, index) => (
                            <div
                                key={index}
                                className={cn(buttonVariants({ variant: "game-secondary" }),"w-full gap-4 h-14 rounded-none",  index === 0 && "mt-4")}
                            >
                                <div>
                                    {!detail.isUpi ? <BankIcon /> : <UPIIcon />}
                                </div>
                                <div className='flex flex-col items-start'>
                                    <span>
                                        {detail.isUpi ? t('upi-id') : detail.accountName}
                                    </span>
                                    <span>
                                        {detail.isUpi
                                            ? `${'.'.repeat(12)}${detail.upiId?.slice(-4)}`
                                            : `${'.'.repeat(10)}${detail.accountNumber?.slice(-4)}`}
                                    </span>
                                </div>
                                <Button variant="ghost" className='ml-auto' onClick={() => deleteWithdrawDetail(detail.id?.toString() ?? "")}>
                                    <DeleteIcon />
                                </Button>
                            </div>
                        ))}

                        <Button
                            variant="game"
                            className="w-full mt-4 gap-x-2 h-12 rounded-none"
                            onClick={() => setShowAddPaymentMethod(true)}
                        >
                            <Plus className='size-5' />
                            {t('add-method')}
                        </Button>
                    </>
                )}


                {!showAddPaymentMethod && withdrawDetails.length === 0 && (
                    <div className="flex flex-col text-white items-center justify-center space-y-4 min-h-[60vh]">
                        <p className="text-center mb-5 text-xl text-gray-300">
                            {t('no-methods')}
                        </p>
                        <Button
                            variant="game"
                            className="w-full gap-x-2"
                            onClick={() => setShowAddPaymentMethod(true)}
                        >
                            <Plus className='size-5' />
                            {t('add-method')}
                        </Button>
                    </div>
                )}
                {showAddPaymentMethod && <AddPaymentMethod onBack={() => setShowAddPaymentMethod(false)} />}
            </div>
        </Container>
    );
};

type Props = {
    onBack: () => void;
}

const AddPaymentMethod = ({ }: Props) => {
    const t = useTranslations('payment-methods');

    return (
        <>
            <Link
                href={{
                    pathname: "/game/wallet/menu/withdrawl-details/create",
                    query: { type: 'bank' }
                }}
                passHref
            >
                <Button variant="game-secondary" className="w-full gap-x-3 h-14 rounded-none">
                    <BankIcon />
                    {t('add-bank')}
                </Button>
            </Link>
        </>
    );
};

export default PaymentMethodCards;
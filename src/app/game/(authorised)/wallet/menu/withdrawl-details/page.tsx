"use client"
import Container from '@/components/common/container';
import TopBar from '@/components/common/top-bar';
import { Button } from '@/components/ui/button';
import WithdrawDetailsRecord from '@/models/withdrawl-details';
import { useGetAllWithdrawDetails } from '@/react-query/withdrawl-details-queries';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { BankIcon, DeleteIcon, UPIIcon } from '../../../user-menu/icons';

const PaymentMethodCards = () => {
    const { data, isSuccess } = useGetAllWithdrawDetails({});
    const [showAddPaymentMethod, setShowAddPaymentMethod] = React.useState(false);

    const withdrawDetails: WithdrawDetailsRecord[] = useMemo(() => {
        if (isSuccess) {
            return data?.data.map((detail: any) => new WithdrawDetailsRecord(detail));
        }

        return [];
    }, [data]);



    return (
        <Container className="flex flex-col items-center min-h-screen pt-24">
            <TopBar rightContent={<Button variant="ghost" size="icon" onClick={() => setShowAddPaymentMethod(true)}><Plus /></Button>}>
                Payment Methods
            </TopBar>
            <div className="w-full max-w-sm mt-8 mx-auto  h-full space-y-4">
                {!showAddPaymentMethod &&
                    <>
                        {withdrawDetails?.map((detail, index) => (
                            <Button key={index} variant="game-secondary" className="w-full gap-4 h-14">
                                <div>
                                    {!detail.isUpi ? <BankIcon /> : <UPIIcon />}
                                </div>
                                <div className='flex flex-col items-start'>
                                    <span>
                                        {detail.isUpi ? 'UPI ID' : detail.accountName}
                                    </span>
                                    <span>
                                        {detail.isUpi
                                            ? `${'.'.repeat(12)}${detail.upiId?.slice(-4)}`
                                            : `${'.'.repeat(10)}${detail.accountNumber?.slice(-4)}`}
                                    </span>

                                </div>
                                <div className='ml-auto'>
                                    <DeleteIcon />
                                </div>
                            </Button>
                        ))}
                    </>
                }

                {!showAddPaymentMethod && withdrawDetails.length === 0 && ( // If no payment methods are added
                    <div className="flex flex-col text-white items-center justify-center space-y-4 min-h-[60vh]">
                        <p className="text-center mb-5 text-xl text-gray-300">No Payment Methods Added</p>
                        <Button variant="game" className="w-full gap-x-2" onClick={() => setShowAddPaymentMethod(true)}>
                            <Plus className='size-5' />
                            Add Payment Method
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
    return (
        <>
            <Link href={{ pathname: "/game/wallet/menu/withdrawl-details/create", query: { type: 'upi' } }} passHref>
                <Button variant="game-secondary" className="w-full gap-x-3 mb-4 h-14">
                    <UPIIcon />
                    Add UPI
                </Button>
            </Link>
            <Link href={{ pathname: "/game/wallet/menu/withdrawl-details/create", query: { type: 'bank' } }} passHref>
                <Button variant="game-secondary" className="w-full gap-x-3 h-14">
                    <BankIcon />
                    Add Bank Details
                </Button>
            </Link>
        </>
    );
};

export default PaymentMethodCards;
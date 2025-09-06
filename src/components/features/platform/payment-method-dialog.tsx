"use client";

import { BankIcon, DeleteIcon, UPIIcon } from '@/components/features/user-menu/icons';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import WithdrawDetailsRecord from '@/models/withdrawl-details';
import { useCreateWithdrawDetail, useDeleteWithdrawDetailById, useGetAllWithdrawDetails } from '@/react-query/withdrawl-details-queries';
import { Plus, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

interface PaymentMethodDialogProps {
    onBack?: () => void;
}

const PaymentMethodDialog = ({ onBack }: PaymentMethodDialogProps) => {
    const t = useTranslations('payment-methods');
    const { data, isSuccess, refetch } = useGetAllWithdrawDetails({});
    const { mutate: deleteWithdrawDetail } = useDeleteWithdrawDetailById();
    const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);

    const withdrawDetails: WithdrawDetailsRecord[] = useMemo(() => {
        if (isSuccess) {
            return data?.data.map((detail: any) => new WithdrawDetailsRecord(detail));
        }
        return [];
    }, [data, isSuccess]);

    const handleAddPaymentMethod = () => {
        setShowAddPaymentMethod(true);
    };

    const handleBackToList = () => {
        setShowAddPaymentMethod(false);
        refetch(); // Refresh the list after adding
    };

    const handleDeletePaymentMethod = (id: string) => {
        deleteWithdrawDetail(id, {
            onSuccess: () => {
                refetch();
            }
        });
    };

    return (
        <div className="dark:bg-[#050128] bg-[#C3E3FF] border-t-2 dark:border-platform-border border-primary-game rounded-sm md:px-6 px-4 py-8 h-full w-full overflow-y-auto">
            {/* Header */}
            <div className="flex items-center mb-6">
                {onBack && (
                    <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
                        <ArrowLeft className="text-platform-text" />
                    </Button>
                )}
                <h3 className="text-platform-text text-lg font-semibold">
                    Withdrawal Methods
                </h3>
            </div>

            {!showAddPaymentMethod ? (
                <>
                    {/* Payment Methods List */}
                    {withdrawDetails.length > 0 ? (
                        <div className="space-y-4">
                            {withdrawDetails?.map((detail, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        buttonVariants({ variant: "game-secondary" }),
                                        "w-full gap-4 h-14 rounded-none flex items-center justify-between p-4"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div>
                                            {!detail.isUpi ? <BankIcon /> : <UPIIcon />}
                                        </div>
                                        <div className='flex flex-col items-start'>
                                            <span className="text-white font-medium">
                                                {detail.isUpi ? t('upi-id', { defaultValue: 'UPI ID' }) : detail.accountName}
                                            </span>
                                            <span className="text-gray-300 text-sm">
                                                {detail.isUpi
                                                    ? `${'.'.repeat(12)}${detail.upiId?.slice(-4)}`
                                                    : `${'.'.repeat(10)}${detail.accountNumber?.slice(-4)}`}
                                            </span>
                                        </div>
                                    </div>
                                    <Button 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => handleDeletePaymentMethod(detail.id?.toString() ?? "")}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <DeleteIcon />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col text-white items-center justify-center space-y-4 min-h-[200px]">
                            <p className="text-center mb-5 text-xl text-gray-300">
                                {t('no-methods', { defaultValue: 'No payment methods added yet' })}
                            </p>
                        </div>
                    )}

                    {/* Add Payment Method Button */}
                    <Button
                        variant="game"
                        className="w-full mt-6 gap-x-2 h-12 rounded-none"
                        onClick={handleAddPaymentMethod}
                    >
                        <Plus className='size-5' />
                        {t('add-method', { defaultValue: 'Add Payment Method' })}
                    </Button>
                </>
            ) : (
                <AddPaymentMethodForm onBack={handleBackToList} />
            )}
        </div>
    );
};

interface AddPaymentMethodFormProps {
    onBack: () => void;
}

const AddPaymentMethodForm = ({ onBack }: AddPaymentMethodFormProps) => {
    const t = useTranslations('payment-methods');
    const [activeTab, setActiveTab] = useState<"bank" | "upi">("bank");
    const { mutate: createWithdrawDetail, isPending } = useCreateWithdrawDetail();

    // Bank form state
    const [bankForm, setBankForm] = useState({
        accountName: '',
        accountNumber: '',
        ifscCode: '',
        bankName: ''
    });

    // UPI form state  
    const [upiForm, setUpiForm] = useState({
        upiId: ''
    });

    const handleBankSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        createWithdrawDetail({
            accountName: bankForm.accountName,
            accountNumber: bankForm.accountNumber,
            ifscCode: bankForm.ifscCode,
            bankName: bankForm.bankName,
            isUpi: false
        }, {
            onSuccess: () => {
                // Reset form
                setBankForm({
                    accountName: '',
                    accountNumber: '',
                    ifscCode: '',
                    bankName: ''
                });
                onBack();
            }
        });
    };

    const handleUpiSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        createWithdrawDetail({
            upiId: upiForm.upiId,
            isUpi: true
        }, {
            onSuccess: () => {
                // Reset form
                setUpiForm({ upiId: '' });
                onBack();
            }
        });
    };

    return (
        <div className="space-y-6 w-full ">
            {/* Back Button */}
            {/* <Button variant="ghost" onClick={onBack} className="mb-4 text-platform-text hover:text-white">
                <ArrowLeft className="mr-2 size-4" />
                Back to Payment Methods
            </Button> */}

            {/* Tab Selection */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "bank" | "upi")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-transparent border-2 dark:border-platform-border border-primary-game rounded-sm p-0 h-auto">
                    <TabsTrigger
                        value="bank"
                        className="rounded-sm py-1.5 md:py-3 text-platform-text bg-transparent data-[state=active]:bg-gradient-to-r dark:data-[state=active]:from-[#252AB2] dark:data-[state=active]:to-[#111351] data-[state=active]:from-[#64B6FD] data-[state=active]:to-[#64B7FE] data-[state=active]:text-white data-[state=active]:border-r-2 dark:data-[state=active]:border-[#3B4BFF] data-[state=active]:border-[#64B7FE] border-transparent"
                    >
                        <BankIcon className="mr-2" />
                        {t('add-bank', { defaultValue: 'Bank Account' })}
                    </TabsTrigger>
                    <TabsTrigger
                        value="upi"
                        className="rounded-sm py-1.5 md:py-3 text-platform-text bg-transparent data-[state=active]:bg-gradient-to-r dark:data-[state=active]:from-[#252AB2] dark:data-[state=active]:to-[#111351] data-[state=active]:from-[#64B6FD] data-[state=active]:to-[#64B7FE] data-[state=active]:text-white data-[state=active]:border-l-2 dark:data-[state=active]:border-[#3B4BFF] data-[state=active]:border-[#64B7FE] border-transparent"
                    >
                        <div className="mr-2"><UPIIcon /></div>
                        {t('add-upi', { defaultValue: 'UPI ID' })}
                    </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="bank" className="mt-0">
                        <form onSubmit={handleBankSubmit} className="space-y-4">
                            <fieldset className="relative border-2 dark:border-platform-border border-primary-game rounded-sm px-4 py-1.5">
                                <legend className="px-2 text-platform-text md:text-sm text-xs font-medium">Account Holder Name</legend>
                                <Input
                                    type="text"
                                    className="w-full bg-transparent font-normal border-none rounded-none text-platform-text text-base focus:outline-none placeholder:text-platform-text transition-all p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                                    placeholder="Enter account holder name"
                                    value={bankForm.accountName}
                                    onChange={(e) => setBankForm(prev => ({ ...prev, accountName: e.target.value }))}
                                    required
                                />
                            </fieldset>

                            <fieldset className="relative border-2 dark:border-platform-border border-primary-game rounded-sm px-4 py-1.5">
                                <legend className="px-2 text-platform-text md:text-sm text-xs font-medium">Account Number</legend>
                                <Input
                                    type="text"
                                    className="w-full bg-transparent font-normal border-none rounded-none text-platform-text text-base focus:outline-none placeholder:text-platform-text transition-all p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                                    placeholder="Enter account number"
                                    value={bankForm.accountNumber}
                                    onChange={(e) => setBankForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                                    required
                                />
                            </fieldset>

                            <fieldset className="relative border-2 dark:border-platform-border border-primary-game rounded-sm px-4 py-1.5">
                                <legend className="px-2 text-platform-text md:text-sm text-xs font-medium">IFSC Code</legend>
                                <Input
                                    type="text"
                                    className="w-full bg-transparent font-normal border-none rounded-none text-platform-text text-base focus:outline-none placeholder:text-platform-text transition-all p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                                    placeholder="Enter IFSC code"
                                    value={bankForm.ifscCode}
                                    onChange={(e) => setBankForm(prev => ({ ...prev, ifscCode: e.target.value }))}
                                    required
                                />
                            </fieldset>

                            <fieldset className="relative border-2 dark:border-platform-border border-primary-game rounded-sm px-4 py-1.5">
                                <legend className="px-2 text-platform-text md:text-sm text-xs font-medium">Bank Name</legend>
                                <Input
                                    type="text"
                                    className="w-full bg-transparent font-normal border-none rounded-none text-platform-text text-base focus:outline-none placeholder:text-platform-text transition-all p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                                    placeholder="Enter bank name"
                                    value={bankForm.bankName}
                                    onChange={(e) => setBankForm(prev => ({ ...prev, bankName: e.target.value }))}
                                    required
                                />
                            </fieldset>

                            <Button
                                type="submit"
                                variant="game"
                                className="w-full mt-6 h-12 rounded-none"
                                disabled={isPending}
                            >
                                {isPending ? "Adding..." : "Add Bank Account"}
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="upi" className="mt-0">
                        <form onSubmit={handleUpiSubmit} className="space-y-4">
                            <fieldset className="relative border-2 dark:border-platform-border border-primary-game rounded-sm px-4 py-1.5">
                                <legend className="px-2 text-platform-text md:text-sm text-xs font-medium">UPI ID</legend>
                                <Input
                                    type="text"
                                    className="w-full bg-transparent font-normal border-none rounded-none text-platform-text text-base focus:outline-none placeholder:text-platform-text transition-all p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                                    placeholder="Enter UPI ID (e.g., user@paytm)"
                                    value={upiForm.upiId}
                                    onChange={(e) => setUpiForm(prev => ({ ...prev, upiId: e.target.value }))}
                                    required
                                />
                            </fieldset>

                            <Button
                                type="submit"
                                variant="game"
                                className="w-full mt-6 h-12 rounded-none"
                                disabled={isPending}
                            >
                                {isPending ? "Adding..." : "Add UPI ID"}
                            </Button>
                        </form>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

export default PaymentMethodDialog;

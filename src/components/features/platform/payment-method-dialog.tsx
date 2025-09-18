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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormProvider from '@/components/ui/form/form-provider';
import FormInput from '@/components/ui/form/form-input';

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
        <div className="dark:bg-[#050128] md:h-[calc(100vh-300px)] max-h-[calc(100vh-150px)]  bg-[#C3E3FF] border-t-2 dark:border-platform-border border-primary-game rounded-sm md:px-6 px-4 py-8 w-full flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-6">
                {onBack && (
                    <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
                        <ArrowLeft className="text-platform-text" />
                    </Button>
                )}
                <h3 className="text-platform-text text-lg font-semibold">
                    Withdrawal Details
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

// Bank account form validation schema
const createBankAccountSchema = () => z.object({
    accountName: z.string()
        .min(3, 'Account name must be at least 3 characters')
        .max(100, 'Account name must be less than 100 characters'),
    accountNumber: z.string()
        .min(9, 'Account number must be at least 9 digits')
        .max(18, 'Account number must be at most 18 digits')
        .regex(/^\d+$/, 'Account number must contain only digits'),
    ifscCode: z.string()
        .min(11, 'IFSC code must be 11 characters')
        .max(11, 'IFSC code must be 11 characters')
        .regex(/^[A-Z0-9]+$/, 'IFSC code must contain only letters and numbers'),
    bankName: z.string()
        .min(3, 'Bank name must be at least 3 characters')
        .max(100, 'Bank name must be less than 100 characters'),
});

// UPI form validation schema
const createUpiSchema = () => z.object({
    upiId: z.string()
        .min(5, 'UPI ID must be at least 5 characters')
        .max(50, 'UPI ID must be less than 50 characters')
        .regex(/^[\w\.\-]+@[\w\-]+$/, 'Invalid UPI ID format (e.g. username@bank)'),
});

// Define types for the form values
type BankAccountFormValues = z.infer<ReturnType<typeof createBankAccountSchema>>;
type UpiFormValues = z.infer<ReturnType<typeof createUpiSchema>>;

const AddPaymentMethodForm = ({ onBack }: AddPaymentMethodFormProps) => {
    const t = useTranslations('payment-methods');
    const [activeTab, setActiveTab] = useState<"bank" | "upi">("bank");
    const { mutate: createWithdrawDetail, isPending } = useCreateWithdrawDetail();

    // Bank form with React Hook Form
    const bankForm = useForm<BankAccountFormValues>({
        resolver: zodResolver(createBankAccountSchema()),
        defaultValues: {
            accountName: '',
            accountNumber: '',
            ifscCode: '',
            bankName: ''
        }
    });

    // UPI form with React Hook Form
    const upiForm = useForm<UpiFormValues>({
        resolver: zodResolver(createUpiSchema()),
        defaultValues: {
            upiId: ''
        }
    });

    const handleBankSubmit = (data: BankAccountFormValues) => {
        createWithdrawDetail({
            accountName: data.accountName,
            accountNumber: data.accountNumber,
            ifscCode: data.ifscCode,
            bankName: data.bankName,
            isUpi: false
        }, {
            onSuccess: () => {
                // Reset form
                bankForm.reset();
                onBack();
            }
        });
    };

    const handleUpiSubmit = (data: UpiFormValues) => {
        createWithdrawDetail({
            upiId: data.upiId,
            isUpi: true
        }, {
            onSuccess: () => {
                // Reset form
                upiForm.reset();
                onBack();
            }
        });
    };

    return (
        <div className="space-y-6 w-full h-full overflow-y-auto">
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
                        <FormProvider 
                            methods={bankForm} 
                            className="space-y-4" 
                            onSubmit={bankForm.handleSubmit(handleBankSubmit)}
                        >
                            <FormInput
                                control={bankForm.control}
                                name="accountName"
                                label="Account Holder Name"
                                placeholder="Enter account holder name"
                                game
                                className="relative"
                                inputClassName="w-full bg-transparent font-normal border-none rounded-none text-platform-text text-base focus:outline-none placeholder:text-platform-text transition-all p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                            />

                            <FormInput
                                control={bankForm.control}
                                name="accountNumber"
                                label="Account Number"
                                placeholder="Enter account number (9-18 digits)"
                                game
                                className="relative"
                                inputClassName="w-full bg-transparent font-normal border-none rounded-none text-platform-text text-base focus:outline-none placeholder:text-platform-text transition-all p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                            />

                            <FormInput
                                control={bankForm.control}
                                name="ifscCode"
                                label="IFSC Code"
                                placeholder="Enter IFSC code (11 characters)"
                                game
                                className="relative"
                                inputClassName="w-full bg-transparent font-normal border-none rounded-none text-platform-text text-base focus:outline-none placeholder:text-platform-text transition-all p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                            />

                            <FormInput
                                control={bankForm.control}
                                name="bankName"
                                label="Bank Name"
                                placeholder="Enter bank name"
                                game
                                className="relative"
                                inputClassName="w-full bg-transparent font-normal border-none rounded-none text-platform-text text-base focus:outline-none placeholder:text-platform-text transition-all p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                            />

                            <Button
                                type="submit"
                                variant="game"
                                className="w-full mt-6 h-12 rounded-none"
                                disabled={isPending || bankForm.formState.isSubmitting}
                            >
                                {isPending ? "Adding..." : "Add Bank Account"}
                            </Button>
                        </FormProvider>
                    </TabsContent>

                    <TabsContent value="upi" className="mt-0">
                        <FormProvider 
                            methods={upiForm} 
                            className="space-y-4" 
                            onSubmit={upiForm.handleSubmit(handleUpiSubmit)}
                        >
                            <FormInput
                                control={upiForm.control}
                                name="upiId"
                                label="UPI ID"
                                placeholder="Enter UPI ID (e.g., user@paytm)"
                                game
                                className="relative"
                                inputClassName="w-full bg-transparent font-normal border-none rounded-none text-platform-text text-base focus:outline-none placeholder:text-platform-text transition-all p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                            />

                            <Button
                                type="submit"
                                variant="game"
                                className="w-full mt-6 h-12 rounded-none"
                                disabled={isPending || upiForm.formState.isSubmitting}
                            >
                                {isPending ? "Adding..." : "Add UPI ID"}
                            </Button>
                        </FormProvider>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

export default PaymentMethodDialog;

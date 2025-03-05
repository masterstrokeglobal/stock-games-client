"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormProvider from "@/components/ui/form/form-provider";
import FormSelect from "@/components/ui/form/form-select";
import { Transaction, TransactionStatus } from "@/models/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TransactionStatusAlert from "./transaction-status";

// Schema for transaction form validation
export const transactionEditSchema = z.object({
    status: z.enum([TransactionStatus.PENDING, TransactionStatus.COMPLETED, TransactionStatus.FAILED]),
});

type TransactionFormValues = z.infer<typeof transactionEditSchema>;

type TransactionEditProps = {
    transaction: Transaction;
    onSubmit: (data: TransactionFormValues) => void;
    isLoading?: boolean;
    showEdit ?: boolean;
};

const TransactionEditForm = ({ transaction, onSubmit, isLoading ,showEdit=true}: TransactionEditProps) => {
    const form = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionEditSchema),
        defaultValues: { status: TransactionStatus.FAILED },
    });

    const { control, handleSubmit } = form;
    const currentStatus = transaction.status

    return (
        <section className="container-main min-h-[60vh] max-w-xl">
            <Card className="border shadow-none bg-white">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Transaction Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 capitalize">
                        {/* Read-only Transaction Details */}
                        <p><strong>Type:</strong> {transaction.type.replace("_", " ")}</p>
                        <p><strong>Amount:</strong> ₹{transaction.amount}</p>
                        <p><strong>PG ID:</strong> {transaction.pgId || "N/A"}</p>
                        <p><strong>Bonus Percentage:</strong> {transaction.bonusPercentage || 0}%</p>
                        <p><strong>Created At:</strong> {new Date(transaction.createdAt).toLocaleDateString()}</p>
                    </div>
                    {(currentStatus === TransactionStatus.PENDING && showEdit) && (
                        <FormProvider methods={form} onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                            {/* Editable Status Field */}
                            <FormSelect
                                control={control}
                                name="status"
                                defaultValue={TransactionStatus.COMPLETED.toString()}
                                label="Change Status"
                                options={[
                                    { label: "Completed", value: TransactionStatus.COMPLETED.toString() },
                                    { label: "Cancelled", value: TransactionStatus.FAILED.toString() },
                                ]}
                            />

                            <footer className="flex justify-end gap-4 mt-8">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Updating..." : "Update Status"}
                                </Button>
                            </footer>
                        </FormProvider>
                    )}
                    {currentStatus !== TransactionStatus.PENDING && (
                        <TransactionStatusAlert currentStatus={currentStatus} />
                    )}
                </CardContent>
            </Card>
        </section>
    );
};

export default TransactionEditForm;

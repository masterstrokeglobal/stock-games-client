"use client";

import LedgerForm, { LedgerFormData } from "@/components/features/ledger/ledger-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LedgerEntryType } from "@/models/ledger";
import { useCreateLedgerEntry } from "@/react-query/ledger-queries";
import { useRouter, useSearchParams } from "next/navigation";

const defaultValues: LedgerFormData = {
  amount: 0,
   entryType: LedgerEntryType.PAID,
};

const CreateCompanyLedgerPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const companyId = searchParams.get("companyId");
  const { mutate: createLedgerEntry, isPending } = useCreateLedgerEntry();

  const handleSubmit = (data: LedgerFormData) => {
    createLedgerEntry({ ...data, companyId: companyId as string },{
      onSuccess: () => {
        router.push(`/dashboard/company-ledger?companyIdFilter=${companyId}&page=1`);
      },
    });
  };

  return (
    <section className="container mx-auto px-4 py-8 max-w-4xl">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Create Ledger Entry</h1>
          <p className="text-gray-500 mt-1">Add a new transaction to the company ledger</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>
            Enter the transaction details below. Company ID: {companyId || "Not specified"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LedgerForm 
            onSubmit={handleSubmit} 
            isLoading={isPending} 
            defaultValues={defaultValues} 
          />
        </CardContent>
      </Card>
    </section>
  );
};

export default CreateCompanyLedgerPage;
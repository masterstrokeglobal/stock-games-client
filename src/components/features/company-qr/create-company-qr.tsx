"use client";
import { useCreateCompanyQR } from "@/react-query/company-qr-queries";
import { CompanyQRForm, CompanyQRFormSchema } from "./company-qr-form";
import { useRouter } from "next/navigation";
import { CompanyQRType } from "@/models/company-qr";

const defaultValues: CompanyQRFormSchema = {
  qr: "",
  maxLimit: 1,
  active: true,
  type: CompanyQRType.UPI,  
};

const CreateCompanyQR = () => {
  const router = useRouter();
  const { mutate: createCompanyQR, isPending } = useCreateCompanyQR();

  const handleSubmit = (data: CompanyQRFormSchema) => {
    createCompanyQR(data, {
      onSuccess: () => {
        router.push("/dashboard/company-qr");
      },
    });
  };

  return (
    <section className="flex flex-col gap-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Create Company QR</h1>
      <CompanyQRForm
        onSubmit={handleSubmit}
        isLoading={isPending}
        defaultValues={defaultValues}
      />
    </section>
  );
};

export default CreateCompanyQR;

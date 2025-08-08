"use client";
import { useGetCompanyQRById, useUpdateCompanyQRById } from "@/react-query/company-qr-queries";
import { useParams, useRouter } from "next/navigation";
import { CompanyQRForm, CompanyQRFormSchema } from "./company-qr-form";

const UpdateCompanyQR = () => {
  const router = useRouter();
  const { id } = useParams();
  const { data: qrData, isLoading } = useGetCompanyQRById(id as string);
  const { mutate: updateCompanyQR, isPending } = useUpdateCompanyQRById();

  if (isLoading) return <div>Loading...</div>;
  if (!qrData) return <div>Company QR not found</div>;

  const handleSubmit = (data: CompanyQRFormSchema) => {
    updateCompanyQR({ id: id.toString(), ...data }, {
      onSuccess: () => {
        router.push("/dashboard/company-qr");
      },
    });
  };

  return (
    <section className="flex flex-col gap-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Update Company QR</h1>
      <CompanyQRForm
        defaultValues={qrData.data}
        onSubmit={handleSubmit}
        isLoading={isPending}
      />
    </section>
  );
};

export default UpdateCompanyQR;

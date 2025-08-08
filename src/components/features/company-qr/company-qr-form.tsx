import { Button } from "@/components/ui/button";
import FormImage from "@/components/ui/form/form-image-compact";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import FormGroupSelect from "@/components/ui/form/form-select";
import FormSwitch from "@/components/ui/form/form-switch";
import { cn } from "@/lib/utils";
import { CompanyQRType } from "@/models/company-qr";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const companyQrSchema = z
  .object({
    qr: z
      .string()
      .url('Please provide a valid URL')
      .min(1, 'QR URL is required'),
    
    maxLimit: z.coerce
      .number({
        required_error: 'Max limit is required',
        invalid_type_error: 'Max limit must be a number',
      })
      .positive('Max limit must be greater than 0')
      .int('Max limit must be a whole number'),
    
    active: z.boolean().default(true),
    
    type: z.nativeEnum(CompanyQRType, {
      required_error: 'QR type is required',
      invalid_type_error: 'Invalid QR type',
    }),
    
    // Bank details - optional for UPI, required for BANK type
    bankName: z.string().optional().nullable(),
    
    accountNumber: z
      .string()
      .regex(/^\d+$/, 'Account number must contain only digits')
      .optional()
      .nullable(),
    
    ifscCode: z
      .string()
      .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format')
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    // Type-specific validation
    if (data.type === CompanyQRType.UPI) {
      // For UPI, validate QR format if needed
      if (!data.qr) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'QR must be a valid UPI payment URL',
          path: ['qr'],
        });
      }
    }
    
    if (data.type === CompanyQRType.BANK) {
      // For bank transfers, all bank details are required
      const requiredFields = [
        { field: 'bankName', name: 'Bank name' },
        { field: 'accountNumber', name: 'Account number' },
        { field: 'ifscCode', name: 'IFSC code' },
      ] as const;
      
      requiredFields.forEach(({ field, name }) => {
        if (!data[field] || data[field]?.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${name} is required for bank transfer type`,
            path: [field],
          });
        }
      });
    }
  });


export type CompanyQRFormSchema = z.infer<typeof companyQrSchema>;

type Props = {
  onSubmit: (data: CompanyQRFormSchema) => void;
  defaultValues: CompanyQRFormSchema;
  className?: string;
  isLoading?: boolean;
};

export const CompanyQRForm = ({
  defaultValues,
  onSubmit,
  className,
  isLoading,
}: Props) => {
  const form = useForm<CompanyQRFormSchema>({
    resolver: zodResolver(companyQrSchema),
    defaultValues,
  });

  const type = form.watch("type");

  console.log(form.formState.errors);

  return (
    <FormProvider
      methods={form}
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("space-y-5", className)}
    >
      {type === CompanyQRType.UPI && <FormImage
        control={form.control}
        name="qr"
        aspectRatio={1}
        aspectRatioDescription="1:1"
        label="QR Image"
        description="Square image - width: 300px height: 300px max size: 5MB"
        maxSize={5}
      />}
      {type === CompanyQRType.BANK && <>
        <FormInput
          control={form.control}
          name="bankName"
          label="Bank Name"
          placeholder="Enter Bank Name"
        />
        <FormInput
          control={form.control}
          name="accountNumber"
          label="Account Number"
          placeholder="Enter Account Number"
        />
        <FormInput
          control={form.control}
          name="ifscCode"
          label="IFSC Code"
          placeholder="Enter IFSC Code"
        />
      </>}
      <FormInput
        control={form.control}
        name="maxLimit"
        label="Max Limit"
        type="number"
        placeholder="Enter Max Limit"
      />
      <FormGroupSelect
        control={form.control}
        name="type"
        label="Type"
        options={Object.values(CompanyQRType).map((type) => ({
          value: type,
          label: type,
        }))}
      />
      <FormSwitch
        control={form.control}
        name="active"
        label="Active"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit"}
      </Button>
    </FormProvider>
  );
};

export default CompanyQRForm;

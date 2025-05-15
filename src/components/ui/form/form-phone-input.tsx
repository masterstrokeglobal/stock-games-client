"use client";

import { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { PhoneInput } from "@/components/ui/phone-input";

function FormPhoneNumber<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder,
  game,
  disabled,
  formItemClassName,
  inputClassName,
  ...props
}: {
  label?: string;
  control: Control<TFieldValues>;
  className?: string;
  name: TName;
  description?: string;
  inputClassName?: string;
  game?: boolean;
  formItemClassName?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem {...props} className={cn(formItemClassName)}>
          {label && <FormLabel className={cn(game ? "text-white" : '')}>{label}</FormLabel>}
          <PhoneInput
            value={field.value}
            onChange={field.onChange}
            className={cn(inputClassName, game ? "text-white" : '')}
            placeholder={placeholder}
            disabled={disabled}
            defaultCountry="AU"
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormPhoneNumber;

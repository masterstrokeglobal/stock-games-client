"use client";

import { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ComboboxSelect } from "@/components/ui/combobox";

function FormComboboxSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  options,
  errorMessage,
}: {
  label?: string;
  control: Control<TFieldValues>;
  options: { value: string; label: string }[];
  className?: string;
  onSearchInputChange?: (value: string) => void;
  errorMessage?: string;
  name: TName;
  description?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <br />
          <ComboboxSelect
            className="w-full"
            placeholder="Select Category"
            options={options}
            onValueChange={field.onChange}
            value={field.value}
          />
          <FormMessage />
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </FormItem>
      )}
    />
  );
}

export default FormComboboxSelect;

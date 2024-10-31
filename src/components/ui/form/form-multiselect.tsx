"use client";

import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    MultiSelect,
} from "@/components/ui/multi-select"; // Import your MultiSelect component here

function FormMultiSelect<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    control,
    name,
    label,
    placeholder,
    options,
    className,
    disabled,
    ...props
}: {
    label?: string;
    control: Control<TFieldValues>;
    options: { value: string; label: string }[];
    className?: string;
    name: TName;
    description?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className} {...props}>
                    <FormLabel>{label}</FormLabel>
                    <MultiSelect
                        options={options}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        placeholder={placeholder}
                        variant="inverted" // Change this to your preferred variant
                        disabled={disabled}
                    />
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export default FormMultiSelect;

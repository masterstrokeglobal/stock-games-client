"use client"

import { Control, FieldPath, FieldValues } from "react-hook-form"

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"

type FormRecordProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
    label?: string
    control: Control<TFieldValues>
    name: TName
    description?: string
    inputClassName?: string
}

function isValidJsonObject(str: string) {
    try {
        const parsed = JSON.parse(str)
        return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)
    } catch {
        return false
    }
}

function FormRecord<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    control,
    name,
    label,
    description,
    inputClassName,
}: FormRecordProps<TFieldValues, TName>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                // Always keep a string value for the textarea, but parse to object onChange if valid
                const stringValue =
                    field.value && typeof field.value === "object"
                        ? JSON.stringify(field.value, null, 2)
                        : typeof field.value === "string"
                            ? field.value
                            : ""

                return (
                    <FormItem>
                        {label && <FormLabel>{label}</FormLabel>}
                        <FormControl>
                            <textarea
                                className={cn(
                                    "min-h-[120px] font-mono text-xs p-2 border rounded w-full",
                                    inputClassName
                                )}

                                spellCheck={false}
                                {...field}
                                value={stringValue}
                                onChange={e => {
                                    const val = e.target.value
                                    if (isValidJsonObject(val)) {
                                        field.onChange(JSON.parse(val))
                                    } else {
                                        field.onChange(val)
                                    }
                                }}
                            />
                        </FormControl>
                        <FormDescription>
                            {description ||
                                "Enter a JSON object, e.g. { \"primary\": \"#0A1634\", \"secondary\": \"#122148\" }"}
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )
            }}
        />
    )
}

export default FormRecord

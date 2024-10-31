"use client"

import { Control, FieldPath, FieldValues } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Checkbox } from "../checkbox"
import { cn } from "@/lib/utils"

function FormCheckbox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  className,
  ...props
}: {
  label?: string
  control: Control<TFieldValues>
  className?: string
  children?: React.ReactNode
  Icon?: React.ReactNode
  name: TName
  description?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-row items-center space-x-3 space-y-0", className)}>
          <FormControl>
            <Checkbox
              {...props}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className=" flex items-start leading-none">
            {label && <FormLabel>{label}</FormLabel>}
          </div>
        </FormItem>
      )}
    />
  )
}

export default FormCheckbox

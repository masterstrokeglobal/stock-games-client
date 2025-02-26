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
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

function FormTextArea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  inputClassName,
  game = false,
  description,
  label,
  ...props
}: {
  label?: string
  control: Control<TFieldValues>
  name: TName,
  game?: boolean,
  inputClassName?: string
  description?: string
} & React.InputHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel className={game ? "text-white" : ''}
          >{label}</FormLabel>}
          <FormControl>
            <Textarea className={cn(inputClassName, game ? "h-52 text-white bg-secondary-game border border-[#EFF8FF17] focus:border-[#55B0FF]" : '')} {...props} {...field} />

          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormTextArea

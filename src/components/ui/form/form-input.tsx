"use client";

import { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  description,
  game,
  inputClassName,
  children,
  label,
  className,
  ...props
}: {
  label?: string;
  control: Control<TFieldValues>;
  className?: string;
  inputClassName?: string;
  children?: React.ReactNode;
  game?: boolean;
  Icon?: React.ReactNode;
  name: TName;
  description?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel className={cn(game ? "text-white" : '')}>{label}</FormLabel>}
          <FormControl>
            <div className={"relative"}>
              <Input className={cn(inputClassName, game ? "h-12 text-white bg-[#122146] border border-[#EFF8FF17] focus:border-[#55B0FF]" : '')} {...props} {...field} />
              {children}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormInput;

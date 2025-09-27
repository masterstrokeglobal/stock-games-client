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

/**
 * Game style input for forms.
 * Applies special styles when `game` prop is true.
 */
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
  transform,
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
  transform?: (value: string) => string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  // Game input styles (matches /features/platform/filters.tsx)
  const gameInputClass =
    "w-full bg-primary-game border border-platform-border ring-0 focus:bg-primary-game/80 focus:border-platform-border text-white placeholder:text-gray-200 dark:placeholder:text-gray-400 h-12 rounded-xl";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Apply transform function if provided
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          field.onChange(transform ? transform(value) : value);
        };
        
        return (
        <FormItem className={cn(className, game ? "space-y-1" : "")}>
          {label && (
            <FormLabel className={cn(game ? "text-platform-text mb-0" : "")}>
              {label}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              <Input
                className={cn(
                  inputClassName,
                  game ? gameInputClass : ""
                )}
                {...props}
                {...field}
                onChange={handleChange}
              />
              {children}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}}
    />
  );
}

export default FormInput;

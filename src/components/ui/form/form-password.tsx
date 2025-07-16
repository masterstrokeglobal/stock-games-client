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
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../button";
import { cn } from "@/lib/utils";

/**
 * Game style password input for forms.
 * Applies special styles when `game` prop is true.
 * Matches FormInput for password fields.
 */
function FormPassword<
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
  // Game input styles (matches /features/platform/filters.tsx and FormInput)
  const gameInputClass =
    "w-full bg-primary-game border border-platform-border ring-0 focus:bg-primary-game/80 focus:border-platform-border text-white placeholder:text-gray-200 dark:placeholder:text-gray-400 h-12 rounded-none";

  const [inputType, setInputType] = useState<"password" | "text">("password");

  const toggleType = () => {
    setInputType((prev) => (prev === "password" ? "text" : "password"));
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
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
                type={inputType}
              />
              <Button
                onClick={toggleType}
                variant="ghost"
                type="button"
                size="sm"
                tabIndex={-1}
                className={cn(
                  "absolute text-platform-text cursor-pointer px-2",
                  game ? "top-2 right-1" : "right-1 top-0.5"
                )}
              >
                {inputType === "password" ? (
                  <EyeOff size={20} className="text-current" />
                ) : (
                  <Eye size={20} className="text-current" />
                )}
              </Button>
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

export default FormPassword;

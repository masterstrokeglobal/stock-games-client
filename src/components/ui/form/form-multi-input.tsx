"use client";

import { useState } from "react";
import { Control, FieldPath, FieldValues, useFieldArray } from "react-hook-form";
import { PlusCircle, X } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import FormInput from "./form-input";

function FormMultiInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  description,
  game,
  inputClassName,
  label,
  className,
  placeholder = "Enter value",
  maxInputs = 10,
  ...props
}: {
  label?: string;
  control: Control<TFieldValues>;
  className?: string;
  inputClassName?: string;
  game?: boolean;
  name: TName;
  description?: string;
  placeholder?: string;
  maxInputs?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name">) {
  const { fields, append, remove } = useFieldArray({
    control: control as any,
    name: name as any,
  });

  const [_, setFocusedIndex] = useState<number | null>(null);

  console.log(_);
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className={className}>
          {label && <FormLabel className={cn(game ? "text-white" : "")}>{label}</FormLabel>}
          
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <FormInput
                  control={control as any}
                  name={`${String(name)}[${index}]` as any}
                  game={game}
                  inputClassName={inputClassName}
                  placeholder={placeholder}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(null)}
                  {...props}
                >
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6",
                        game ? "hover:bg-secondary-game/20" : ""
                      )}
                      onClick={() => remove(index)}
                    >
                      <X className={cn("h-4 w-4", game ? "text-white" : "")} />
                      <span className="sr-only">Remove</span>
                    </Button>
                  )}
                </FormInput>
              </div>
            ))}
          </div>
          
          {fields.length < maxInputs && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "mt-2",
                game ? "text-white border-primary hover:bg-secondary-game/20" : ""
              )}
              onClick={() => append("")}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add {label ? label.toLowerCase() : "input"}
            </Button>
          )}
          
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormMultiInput;

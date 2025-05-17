"use client";

// FormSwitch.tsx
import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
function FormSwitch<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  description,
  label,
  className,
  game,
}: {
  label?: string;
  control: Control<TFieldValues>;
  className?: string;
  name: TName;
  description?: string;
  game?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className={cn("flex flex-row items-center justify-between rounded-lg border p-4", className)}>
        <div className="space-y-0.5">
          {label && <FormLabel>{label}</FormLabel>}
          {description && <FormDescription>{description}</FormDescription>}
        </div>
        <FormControl>
          <Switch
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        </FormControl>
      </FormItem>
    )}
  />
  )
}

export default FormSwitch;

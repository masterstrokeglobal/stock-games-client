"use client";

// FormSwitch.tsx
import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

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
        <FormItem className={cn(
          "flex flex-row items-center justify-between rounded-lg border p-4",
          game && "border-[#EFF8FF17] bg-[#122146]",
          className
        )}>
          <div className="space-y-0.5">
            {label && (
              <FormLabel className={cn(game && "text-white")}>
                {label}
              </FormLabel>
            )}
            {description && (
              <FormDescription className={cn(game && "text-gray-400")}>
                {description}
              </FormDescription>
            )}
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              className={cn(
                game && "data-[state=checked]:bg-[#55B0FF]",
                className
              )}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export default FormSwitch;

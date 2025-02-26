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
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "../button"
import { cn } from "@/lib/utils"

function FormPassword<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    control,
    name,
    description,
    label,
    game,
    className,
    ...props
}: {
    label?: string
    control: Control<TFieldValues>
    className?: string
    game?: boolean
    Icon?: React.ReactNode
    name: TName
    description?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
    const [inputType, setInputType] = useState<'password' | 'text'>('password');

    const toggleType = () => {
        if (inputType === 'password') {
            setInputType('text');
        } else {
            setInputType('password');
        }
    }
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    {label && <FormLabel className={cn(game ? "text-white" : '')}>{label}</FormLabel>}
                    <FormControl >
                        <div className="relative text-white">
                            <Input className={cn(game ? "h-12 text-white bg-secondary-game border border-[#EFF8FF17] focus:border-[#55B0FF]" : '')} {...props} {...field} type={inputType} />
                            <Button onClick={toggleType} variant={'ghost'} type="button" size={'sm'} className={cn("absolute cursor-pointer ", game ? "top-2 right-1" : "right-1 top-0.5  ")}>
                                {!(inputType === 'password') ? (
                                    <Eye size={20} className="text-current" />
                                ) : (
                                    <EyeOff size={20} className="text-current" />
                                )}
                            </Button>
                        </div>
                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default FormPassword

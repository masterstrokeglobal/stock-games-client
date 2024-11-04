"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type SimpleSelectProps = {
    label?: string;
    options: { value: string; label: string }[];
    placeholder?: string;
    value?: string;
    className?: string;
    disabled?: boolean;
    onChange: (value: string) => void;
};

function SimpleSelect({
    label,
    options,
    placeholder,
    className,
    disabled,
    onChange,
    value,
}: SimpleSelectProps) {

    const handleValueChange = (value: string) => {
        onChange(value);
    };

    return (
        <div className={className}>
            {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
            <Select disabled={disabled} onValueChange={handleValueChange} value={value}>
                <SelectTrigger className="mt-1 flex gap-2 w-full">
                    {value ? (
                        options.find((option) => option.value === value)?.label
                    ) : (
                        <SelectValue placeholder={placeholder} />
                    )}
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

export default SimpleSelect;

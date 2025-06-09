"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./button";
import { ScrollArea } from "../ui/scroll-area";

type Option = {
  label: React.ReactNode;
  value: string;
};

type Props = {
  name?: string;
  placeholder?: string;
  options: Option[];
  className?: string;
  defaultValue?: string;
  onValueChange?: (e: string) => void;
  value?: string;
  disabled?: boolean;
  defaultOption?: boolean;
};

export function ComboboxSelect({
  value,
  options,
  className,
  onValueChange,
}: Props) {
  const [open, setOpen] = React.useState(false);
  function onSelectOptionChange(e: string) {
    if (onValueChange) {
      onValueChange(e);
    }
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-[200px] whitespace-nowrap  bg-gray-100 justify-between",
            className
          )}
        >
          {value !== undefined
            ? options.find((framework) => framework.value === value)?.label
            : "Select options..."}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className=" p-0">
        <Command>
          <CommandInput placeholder="Search Option..." />
          <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              <CommandList>

                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={String(option.label)}
                    onSelect={() => {
                      onSelectOptionChange(String(option.value));
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

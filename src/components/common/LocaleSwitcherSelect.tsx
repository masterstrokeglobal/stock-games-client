'use client';

import { Locale } from '@/i18n/config';
import { setUserLocale } from '@/services/locale';
import { useTransition } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
  className?: string;
  selectClassName?: string;
};

export default function LocaleSwitcherSelect({
  defaultValue,
  items,
  className,
  selectClassName
}: Props) {
  const [isPending, startTransition] = useTransition();

  function onChange(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  return (
    <div className={className}>
      <Select defaultValue={defaultValue} onValueChange={onChange} disabled={isPending}>
        <SelectTrigger showCaret={false} className={cn("w-full border rounded-full platform-gradient header-inner-shadow h-11 ", selectClassName)}  >
          {items.find((item) => item.value === defaultValue)?.label}
          <ChevronDown className='fill-platform-text stroke-none' />
        </SelectTrigger>
        <SelectContent className='z-[61]'>
          {items.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}



export  function LocaleSwitcherSelect2({
  defaultValue,
  items,
  className,
  selectClassName
}: Props) {
  const [isPending, startTransition] = useTransition();

  function onChange(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  return (
    <div className={className}>
      <Select defaultValue={defaultValue} onValueChange={onChange} disabled={isPending}>
        <SelectTrigger showCaret={false} className={cn("w-full border bg-primary-game rounded-none border-platform-border h-11 ", selectClassName)}  >
          {items.find((item) => item.value === defaultValue)?.label}
          <ChevronDown className='fill-platform-text stroke-none' />
        </SelectTrigger>
        <SelectContent className='z-[61] bg-primary-game rounded-none border border-platform-border'>
          {items.map(({ value, label }) => (
            <SelectItem key={value} value={value} className='rounded-none hover:bg-secondary'>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}


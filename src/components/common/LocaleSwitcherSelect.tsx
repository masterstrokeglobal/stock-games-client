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
        <SelectTrigger showCaret={false} className={cn("w-full border rounded-full text-white border-[#29FEFE] bg-[#003662E5] h-11 ", selectClassName)}  >
          {items.find((item) => item.value === defaultValue)?.label}
          <ChevronDown className='fill-white stroke-none' />
        </SelectTrigger>
        <SelectContent>
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

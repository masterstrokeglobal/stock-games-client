'use client';

import { Locale } from '@/i18n/config';
import { setUserLocale } from '@/services/locale';
import { useTransition } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';

type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
};

export default function LocaleSwitcherSelect({
  defaultValue,
  items,
}: Props) {
  const [isPending, startTransition] = useTransition();

  function onChange(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  return (
    <div>
      <Select defaultValue={defaultValue} onValueChange={onChange} disabled={isPending}>
        <SelectTrigger className="w-full  bg-secondary-game border text-game-text border-[#EFF8FF17] h-11 rounded-md">
          {items.find((item) => item.value === defaultValue)?.label}
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

import { useLocale } from 'next-intl';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';

export default function LocaleSwitcher() {
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={[
        {
          value: 'en',
          label: "English"
        },
        {
          value: 'ru',
          label: "Русский"
        },
        {
          value: 'tur',
          label: "Türkçe"
        },
        {
          value: 'sr',
          label: "Serbian"
        },
        {
          value: 'ar',
          label: "Arabic"
        }
      ]}
    />
  );
}

import { useLocale } from 'next-intl';
import LocaleSwitcherSelect from './LocaleSwitcherSelect';

export default function LocaleSwitcher( {className, selectClassName}: {className?: string, selectClassName?: string} ) {
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect
      className={className}
      defaultValue={locale}
      selectClassName={selectClassName}
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

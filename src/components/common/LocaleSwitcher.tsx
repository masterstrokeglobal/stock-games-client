import { useLocale } from 'next-intl';
import LocaleSwitcherSelect, { LocaleSwitcherSelect2 } from './LocaleSwitcherSelect';

const items=[
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
  },
  {
    value: 'hi',
    label: "Hindi"
  },
  {
    value: 'ta',
    label: "Tamil"
  },
  {
    value: 'te',
    label: "Telugu"
  },
  {
    value: 'kn',
    label: "Kannada"
  },
  {
    value: 'mr',
    label: "Marathi"
  },
  {
    value: 'gu',
    label: "Gujarati"
  }        
];

export default function LocaleSwitcher( {className, selectClassName, theme="rounded"}: {className?: string, selectClassName?: string, theme?:"rounded"|"solid"} ) {
  const locale = useLocale();
  if(theme === "solid") {
    return (
      <LocaleSwitcherSelect2
        className={className}
        items={items}
        defaultValue={locale}
        selectClassName={selectClassName}
      />
    );
  }
  return (
    <LocaleSwitcherSelect
      className={className}
      defaultValue={locale}
      selectClassName={selectClassName}
      items={items}
    />
  );
}



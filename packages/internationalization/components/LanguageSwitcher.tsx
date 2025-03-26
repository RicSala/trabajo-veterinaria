'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/components/ui/select';
import {
  useRouter,
  usePathname,
} from '@repo/internationalization/src/i18n/navigation';
import { Locale, useLocale, useTranslations } from 'next-intl';
import { routing } from '@repo/internationalization/src/i18n/routing';

export const LanguageSwitcher = ({
  defaultValue = 'es',
}: {
  defaultValue?: Locale;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('locale');

  function onSelectChange(locale: Locale) {
    router.push(pathname, { locale });
  }

  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={onSelectChange}
      value={locale}
    >
      <SelectTrigger className='w-[200px] max-w-full'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((cur) => (
          <SelectItem key={cur} value={cur}>
            {t(cur)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

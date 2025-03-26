'use client';

import { useTranslations } from '@repo/internationalization/src/i18n/useTranslation';
import { LanguageSwitcher } from '@repo/internationalization/components/LanguageSwitcher';
import { BetterAuthUI } from '@repo/auth';
import {
  TypographyH3,
  PageHeading,
  SectionHeader,
  SectionDescription,
} from '@repo/design-system/components/Typography';
export default function Page() {
  const t = useTranslations('HomePage');

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      {t('title')}

      <LanguageSwitcher />
      <BetterAuthUI.UserButton />
      <PageHeading>Hello</PageHeading>
      <SectionHeader>Hello</SectionHeader>
      <SectionDescription>
        Exercitation et irure commodo id dolor ad et. Est aliquip velit sint
        reprehenderit laboris. Esse nostrud eiusmod sunt anim exercitation nulla
        officia aliquip ex culpa aliquip labore.
      </SectionDescription>
      <TypographyH3>Hello</TypographyH3>
    </div>
  );
}

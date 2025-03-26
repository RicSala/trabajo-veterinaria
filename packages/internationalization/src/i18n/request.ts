import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  if (!routing.locales.includes(requested as any)) notFound();
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const [languages, common, auth] = await Promise.all([
    import(`../../messages/locales/${locale}.json`),
    import(`../../messages/${locale}.json`),
    import(`../../messages/auth/${locale}.json`),
  ]);

  return {
    locale,
    messages: {
      ...languages.default,
      ...common.default,
      ...auth.default,
    },
  };
});

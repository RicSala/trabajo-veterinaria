import createNextIntlPlugin from 'next-intl/plugin';

export const withNextIntl = createNextIntlPlugin(
  '../../packages/internationalization/src/i18n/request.ts'
);

'use client';

import Link from 'next/link';
import { useTranslations } from '@repo/internationalization/src/i18n/useTranslation';
// export const metadata = createMetadata({
//   title: 'My Blog',
//   description: 'My Blog Description',
// });

// const jsonLd: WithContext<Blog> = {
//   '@type': 'Blog',
//   '@context': 'https://schema.org',
//   url: 'https://www.example.com/blog',
//   name: 'My Blog',
//   description: 'My Blog Description',
// };

export default function Home() {
  const t = useTranslations('HomePage');
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      {/* <JsonLd code={jsonLd} /> */}
      <Link className='text-red-400' href='/app'>
        {t('title')}
      </Link>
      <div className='text-red-400'>{t('about')}</div>
    </div>
  );
}

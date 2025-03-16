import { createMetadata } from '@repo/seo/metadata';
import { Blog, JsonLd, WithContext } from '@repo/seo/json-ld';
import Link from 'next/link';
export const metadata = createMetadata({
  title: 'My Blog',
  description: 'My Blog Description',
});

const jsonLd: WithContext<Blog> = {
  '@type': 'Blog',
  '@context': 'https://schema.org',
  url: 'https://www.example.com/blog',
  name: 'My Blog',
  description: 'My Blog Description',
};

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <JsonLd code={jsonLd} />
      <Link className='text-red-400' href='/app'>Go to app</Link>
      <div className='text-red-400'>Hello</div>
    </div>
  );
}

import { Bricolage_Grotesque, Indie_Flower, Inter } from 'next/font/google';

export const primaryFont = Inter({ subsets: ['latin'] });

export const secondaryFont = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-grotesque',
  display: 'swap',
  adjustFontFallback: false,
});

export const handwritten = Indie_Flower({
  subsets: ['latin'],
  variable: '--font-grotesque',
  display: 'swap',
  weight: ['400'],
});

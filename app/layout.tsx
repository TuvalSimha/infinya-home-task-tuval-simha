import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Navigation from '@/components/Navigation';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Infinya Home Task - Tuval Simha',
  description:
    'This is a home task for Infinya, built with Next.js, Tailwind CSS, and TypeScript.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:site' content='@tuvalsimha' />
      <meta name='twitter:creator' content='@tuvalsimha' />
      <meta name='twitter:title' content='Infinya Home Task - Tuval Simha' />
      <meta
        name='twitter:description'
        content='This is a home task for Infinya, built with Next.js, Tailwind CSS, and TypeScript.'
      />
      <meta property='og:title' content='Infinya Home Task - Tuval Simha' />
      <meta property='og:type' content='website' />
      <meta
        property='og:description'
        content='This is a home task for Infinya, built with Next.js, Tailwind CSS, and TypeScript.'
      />
      <meta property='og:url' content='https://infinya-home-task.vercel.app/' />
      <meta property='og:image' content='public/image.png' />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        {children}
      </body>
    </html>
  );
}

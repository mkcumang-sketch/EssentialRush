import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Path fixed
import { GlobalProvider } from './GlobalProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Essential Rush | Fine Horology',
  description: 'Premium luxury timepieces curated for the modern connoisseur.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalProvider>
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}
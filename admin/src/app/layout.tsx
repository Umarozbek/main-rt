import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RT Holdings — Admin CMS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RT Holdings — Admin CMS',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

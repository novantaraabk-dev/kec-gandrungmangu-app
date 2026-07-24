import { PublicHeader } from '@/components/public-dashboard/public-header';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <PublicHeader />
      <main>{children}</main>
    </div>
  );
}
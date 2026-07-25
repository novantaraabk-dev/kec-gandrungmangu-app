import React from 'react';
import { getUser } from '@/lib/auth';
import { DesaPageHeader } from '@/components/layout/desa-page-header';

function capitalizeFirstLetter(string: string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default async function DesaLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ village: string }>;
}) {
  const resolvedParams = await params;
  const village = resolvedParams?.village || '';
  const user = await getUser();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-50 relative overflow-hidden font-sans">
      {/* Ambient Gradient Mesh Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <DesaPageHeader user={user} village={village} />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {children}
        </main>
      </div>
    </div>
  );
}

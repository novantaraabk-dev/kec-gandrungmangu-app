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
  params: { village: string };
}) {
  const user = await getUser();

  return (
    <div className="flex flex-col min-h-screen">
        <DesaPageHeader user={user} village={params.village} />
        <main className="flex-1 bg-background p-4 sm:p-6 lg:p-8">
            {children}
        </main>
    </div>
  );
}

'use client';

import { AppHeader } from '@/components/layout/app-header';
import { AppLogo } from '@/components/layout/app-logo';
import type { User } from '@/lib/auth';
import { useAppSettings } from '@/lib/app-settings';
import Link from 'next/link';

function capitalizeFirstLetter(string: string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

interface DesaPageHeaderProps {
    user: User;
    village: string;
}

export function DesaPageHeader({ user, village }: DesaPageHeaderProps) {
    const { logoUrl } = useAppSettings();
    const villageName = capitalizeFirstLetter(village);

    return (
        <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shrink-0">
            <Link href={`/desa/${village}/dashboard`}>
                <AppLogo logoUrl={logoUrl} />
            </Link>
             <div className="ml-4 flex-1">
                <p className='text-sm font-medium text-muted-foreground'>Desa {villageName}</p>
             </div>
            <AppHeader user={user} />
        </header>
    )
}

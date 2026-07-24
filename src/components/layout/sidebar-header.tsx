'use client';
import { AppLogo } from './app-logo';
import { useAppSettings } from '@/lib/app-settings';
import Link from 'next/link';

interface SidebarHeaderProps {
    homePath?: string;
}

export function SidebarHeader({ homePath = "/" }: SidebarHeaderProps) {
    const { logoUrl } = useAppSettings();
    return (
         <div className="flex h-20 items-center border-b border-sidebar-border px-6">
            <Link href={homePath} className="flex items-center gap-3 font-semibold">
              <AppLogo logoUrl={logoUrl} />
            </Link>
          </div>
    )
}

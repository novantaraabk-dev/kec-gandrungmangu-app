'use client';

import Link from 'next/link';
import { AppLogo } from '@/components/layout/app-logo';
import { useAppSettings } from '@/lib/app-settings';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function PublicHeader() {
    const { logoUrl } = useAppSettings();

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
            <Link href="/">
                <AppLogo logoUrl={logoUrl} />
            </Link>
            <Button asChild variant="outline">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Link>
            </Button>
        </header>
    );
}

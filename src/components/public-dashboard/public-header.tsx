'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppLogo } from '@/components/layout/app-logo';
import { Button } from '@/components/ui/button';
import { useAppSettings } from '@/lib/app-settings';
import { ArrowLeft, Home } from 'lucide-react';

export function PublicHeader() {
  const { logoUrl } = useAppSettings();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <Link href="/public" className="flex items-center space-x-2">
          <AppLogo logoUrl={logoUrl} />
        </Link>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Halaman Awal
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

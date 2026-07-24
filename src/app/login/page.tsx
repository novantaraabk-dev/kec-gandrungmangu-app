'use client';

import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAppSettings } from '@/lib/app-settings';
import Image from 'next/image';
import { AppLogo } from '@/components/layout/app-logo';

export default function LoginPage() {
  const { logoUrl } = useAppSettings();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 relative h-16 w-16 flex items-center justify-center">
             {logoUrl ? (
              <Image src={logoUrl} alt="Logo Aplikasi" fill className="object-contain" />
            ) : (
              <AppLogo />
            )}
          </div>
          <CardTitle className="font-headline text-3xl font-bold text-primary">Login Admin Kecamatan</CardTitle>
          <CardDescription className="font-body">Sistem Olah Laporan Informasi & Data Desa</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}

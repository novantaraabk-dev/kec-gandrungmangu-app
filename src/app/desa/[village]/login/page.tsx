'use client';

import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building, ArrowLeft } from 'lucide-react';
import { villages } from '@/lib/villages';
import { notFound, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useAppSettings } from '@/lib/app-settings';
import { AppLogo } from '@/components/layout/app-logo';

function capitalizeFirstLetter(string: string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function VillageLoginPage() {
  const params = useParams();
  const village = params.village as string;
  const villageName = capitalizeFirstLetter(village);
  const { logoUrl, villageBackgroundUrl } = useAppSettings();

  // Check if the village from the URL is a valid one
  if (!villages.map(v => v.toLowerCase()).includes(village)) {
    notFound();
  }

  return (
    <div className="relative w-full h-screen">
      {villageBackgroundUrl && (
        <Image
          src={villageBackgroundUrl}
          alt="Latar belakang desa"
          fill
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-slate-900/70" />

      <div className="absolute top-0 left-0 z-20 p-4 sm:p-6 lg:p-8">
        <Link href="/">
          <AppLogo logoUrl={logoUrl} theme="dark" />
        </Link>
      </div>
      
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg bg-background/80 backdrop-blur-sm">
          <CardHeader className="text-center">
              <div className="mx-auto mb-4 relative h-16 w-16 flex items-center justify-center">
                {logoUrl ? (
                  <Image src={logoUrl} alt="Logo Desa" fill className="object-contain" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Building className="h-8 w-8" />
                  </div>
                )}
              </div>
            <CardTitle className="font-headline text-3xl font-bold text-primary">Login Operator</CardTitle>
            <CardDescription className="font-body text-lg">Desa {villageName}</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm 
              redirectTo={`/desa/${village}/dashboard`} 
              placeholderEmail={`${village}@admin.id`}
            />
            <div className="mt-6 text-center">
              <Button asChild variant="link" className="text-muted-foreground">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali ke Halaman Utama
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

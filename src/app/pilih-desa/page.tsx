'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { villages } from '@/lib/villages';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, ArrowLeft } from 'lucide-react';
import { useAppSettings } from '@/lib/app-settings';
import Link from 'next/link';
import { AppLogo } from '@/components/layout/app-logo';

export default function PilihDesaPage() {
  const [selectedVillage, setSelectedVillage] = useState<string>('');
  const router = useRouter();
  const { logoUrl, villageBackgroundUrl } = useAppSettings();

  const handleContinue = () => {
    if (selectedVillage) {
      router.push(`/desa/${selectedVillage.toLowerCase()}/login`);
    }
  };

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

      <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
        <Card className="w-full max-w-md bg-card">
            <CardHeader className="text-center">
                <div className="mx-auto mb-4 relative h-16 w-16 flex items-center justify-center">
                    {logoUrl ? (
                        <Image src={logoUrl} alt="Logo Aplikasi" fill className="object-contain" />
                    ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Building className="h-8 w-8" />
                        </div>
                    )}
                </div>
                <CardTitle className="text-4xl font-bold font-headline text-primary">Pilih Desa Anda</CardTitle>
                <CardDescription className="text-lg">
                    Silakan pilih desa untuk melanjutkan ke halaman login operator.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <Select onValueChange={setSelectedVillage} value={selectedVillage}>
                    <SelectTrigger className="w-full text-lg h-12">
                        <SelectValue placeholder="Pilih Desa..." />
                    </SelectTrigger>
                    <SelectContent>
                        {villages.map((village) => (
                        <SelectItem key={village} value={village}>
                            {village}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>

                    <Button
                    onClick={handleContinue}
                    disabled={!selectedVillage}
                    className="w-full text-lg py-6"
                    size="lg"
                    >
                    Lanjutkan
                    </Button>
                </div>
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

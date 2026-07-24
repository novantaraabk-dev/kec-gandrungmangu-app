'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAppSettings } from '@/lib/app-settings';
import Image from 'next/image';

export function LandingHero() {
  const { backgroundUrl } = useAppSettings();
  const router = useRouter();

  return (
    <div className="relative w-full h-[calc(100vh-120px)] text-white">
      {backgroundUrl && (
        <Image
          src={backgroundUrl}
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-7xl md:text-9xl font-bold font-headline text-white drop-shadow-lg">
          SOLID
        </h1>
        <p className="mt-2 text-xl md:text-2xl font-medium text-slate-200 drop-shadow-md">
          Sistem Olah Laporan Informasi & Data Desa
        </p>
        <p className="mt-4 text-3xl md:text-4xl font-bold tracking-wide max-w-2xl mx-auto drop-shadow-md">
          KECAMATAN GANDRUNGMANGU
        </p>
        <p className="mt-4 max-w-2xl text-base md:text-lg text-slate-300 italic">
          Memberikan kemudahan akses data dan informasi yang akurat, serta meningkatkan transparansi dan efisiensi dalam pengelolaan data desa.
        </p>
        
        <Button onClick={() => router.push('/dashboard')} className="mt-8 px-8 py-6 text-lg font-semibold glow-shadow">
            Masuk ke Dashboard
        </Button>
      </div>
    </div>
  );
}

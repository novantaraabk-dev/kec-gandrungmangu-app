'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { villages } from '@/lib/villages';
import { Landmark } from 'lucide-react';

export default function SelectVillageForApbdesPage() {
  const [selectedVillage, setSelectedVillage] = useState('');
  const router = useRouter();

  const handleContinue = () => {
    if (selectedVillage) {
      router.push(`/public/apbdes/${selectedVillage}`);
    }
  };

  return (
      <div className="container max-w-4xl py-8 sm:py-12">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Landmark className="h-8 w-8" />
            </div>
            <CardTitle className="text-4xl font-extrabold tracking-tight font-headline text-slate-900 dark:text-white">
              APBDes per Desa
            </CardTitle>
            <CardDescription className="mt-2 text-lg text-slate-600 dark:text-slate-300">
              Pilih desa untuk melihat rincian Anggaran Pendapatan dan Belanja Desa.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-6 flex flex-col items-center gap-4 sm:flex-row">
            <Select onValueChange={setSelectedVillage} value={selectedVillage}>
              <SelectTrigger className="w-full text-base h-12 sm:w-[300px]">
                <SelectValue placeholder="Pilih Desa..." />
              </SelectTrigger>
              <SelectContent>
                {villages.map((village) => (
                  <SelectItem key={village} value={village.toLowerCase()}>
                    {village}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleContinue}
              disabled={!selectedVillage}
              className="w-full text-base py-6 sm:w-auto"
              size="lg"
            >
              Lihat Data APBDes
            </Button>
          </CardContent>
        </Card>
      </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { villages } from '@/lib/villages';
import { Users } from 'lucide-react';

export default function SelectVillagePage() {
  const [selectedVillage, setSelectedVillage] = useState('');
  const router = useRouter();

  const handleContinue = () => {
    if (selectedVillage) {
      router.push(`/public/profil-perangkat/${selectedVillage.toLowerCase()}`);
    }
  };

  return (
    <div className="container max-w-2xl py-12">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader className="text-center items-center">
             <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400 mb-4">
                <Users className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold font-headline">Profil Perangkat Desa</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Pilih desa untuk melihat struktur organisasi dan profil perangkat desa, BPD, serta RT/RW.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select onValueChange={setSelectedVillage} value={selectedVillage}>
                <SelectTrigger className="w-full text-base h-12">
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
                Lihat Profil
              </Button>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}

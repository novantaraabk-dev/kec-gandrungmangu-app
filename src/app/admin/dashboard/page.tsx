'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { villages } from '@/lib/villages';
import { VillageDataDisplay } from '@/components/public-dashboard/village-data-display';

export default function DashboardPage() {
  const [selectedVillage, setSelectedVillage] = useState('kecamatan');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Dashboard Kecamatan</h1>
          <p className="text-muted-foreground">Pilih wilayah untuk melihat rekapitulasi data.</p>
        </div>
        <Select value={selectedVillage} onValueChange={setSelectedVillage}>
            <SelectTrigger className="w-full sm:w-[280px]">
                <SelectValue placeholder="Pilih Wilayah..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="kecamatan">Rekapitulasi Kecamatan</SelectItem>
                {villages.map((v) => (
                <SelectItem key={v} value={v.toLowerCase()}>{v}</SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>
      <VillageDataDisplay village={selectedVillage} />
    </div>
  );
}

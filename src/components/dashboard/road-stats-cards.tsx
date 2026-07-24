'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, AlertTriangle, Wrench, Loader2 } from 'lucide-react';
import { type JalanDesa } from '@/lib/jalan-desa-data';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
};

export function RoadStatsCards() {
  const firestore = useFirestore();
  const jalanDesaQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'jalanDesa');
  }, [firestore]);

  const { data: allJalanDesa, isLoading } = useCollection<JalanDesa>(jalanDesaQuery);

  const totals = useMemo(() => {
    if (!allJalanDesa) return { totalPanjangKecamatan: 0, totalRusakKecamatan: 0, estimasiBiaya: 0 };

    let totalPanjangKecamatan = 0;
    let totalRusakKecamatan = 0;
    let totalAreaRusak = 0;

    allJalanDesa.forEach((jalan) => {
        totalPanjangKecamatan += Number(jalan.panjang) || 0;
        const panjangRusak = (Number(jalan.rusakRingan) || 0) + (Number(jalan.rusakBerat) || 0);
        totalRusakKecamatan += panjangRusak;
        
        const lebar = Number(String(jalan.lebar || '0').replace(',', '.')) || 0;

        if (panjangRusak > 0 && lebar > 0) {
            totalAreaRusak += panjangRusak * lebar;
        }
    });
    
    const estimasiBiaya = totalAreaRusak * 1200000;

    return { totalPanjangKecamatan, totalRusakKecamatan, estimasiBiaya };
  }, [allJalanDesa]);
  
  if (isLoading) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="rounded-2xl shadow-sm flex items-center justify-center h-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></Card>
            <Card className="rounded-2xl shadow-sm flex items-center justify-center h-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></Card>
            <Card className="rounded-2xl shadow-sm flex items-center justify-center h-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></Card>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Jalan Kecamatan</CardTitle>
          <Map className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totals.totalPanjangKecamatan.toLocaleString('id-ID')} M</div>
          <p className="text-xs text-muted-foreground mt-1">Total panjang jalan se-kecamatan</p>
        </CardContent>
      </Card>
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Kerusakan</CardTitle>
          <AlertTriangle className="h-5 w-5 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totals.totalRusakKecamatan.toLocaleString('id-ID')} M</div>
          <p className="text-xs text-muted-foreground mt-1">Total kerusakan jalan se-kecamatan</p>
        </CardContent>
      </Card>
       <Card className="rounded-2xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Estimasi Biaya</CardTitle>
          <Wrench className="h-5 w-5 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totals.estimasiBiaya)}</div>
          <p className="text-xs text-muted-foreground mt-1">Estimasi biaya perbaikan jalan</p>
        </CardContent>
      </Card>
    </div>
  );
}

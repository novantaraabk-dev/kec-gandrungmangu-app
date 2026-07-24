'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { ArrowRight, Loader2 } from 'lucide-react';
import { type JalanDesa } from '@/lib/jalan-desa-data';
import { villages } from '@/lib/villages';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';


interface VillageStat {
  villageName: string;
  totalPanjang: number;
  totalRusak: number;
  estimasiBiaya: number;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
};


export function RoadStatsByVillage() {
  const firestore = useFirestore();
  const jalanDesaQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'jalanDesa');
  }, [firestore]);

  const { data: allJalanDesa, isLoading } = useCollection<JalanDesa>(jalanDesaQuery);

  const statsByVillage: VillageStat[] = useMemo(() => {
    if (!allJalanDesa) return [];

    const statsMap = new Map<string, { totalPanjang: number; totalRusak: number; totalAreaRusak: number }>();
    villages.forEach(v => statsMap.set(v.toLowerCase(), { totalPanjang: 0, totalRusak: 0, totalAreaRusak: 0 }));

    allJalanDesa.forEach(jalan => {
      const villageKey = jalan.village.toLowerCase();
      const stat = statsMap.get(villageKey);
      if (stat) {
        stat.totalPanjang += Number(jalan.panjang) || 0;
        const panjangRusak = (Number(jalan.rusakRingan) || 0) + (Number(jalan.rusakBerat) || 0);
        stat.totalRusak += panjangRusak;
        
        const lebar = Number(String(jalan.lebar || '0').replace(',', '.')) || 0;
        if (panjangRusak > 0 && lebar > 0) {
            stat.totalAreaRusak += panjangRusak * lebar;
        }
      }
    });

    return villages.map(village => {
        const villageKey = village.toLowerCase();
        const stat = statsMap.get(villageKey)!;
        const estimasiBiaya = stat.totalAreaRusak * 1200000;
        return {
            villageName: village,
            totalPanjang: stat.totalPanjang,
            totalRusak: stat.totalRusak,
            estimasiBiaya,
        };
    });

  }, [allJalanDesa]);

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Rincian Kondisi Jalan per Desa</CardTitle>
        <CardDescription>Ringkasan total panjang, kerusakan, dan estimasi biaya perbaikan untuk setiap desa.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Desa</TableHead>
                <TableHead className="text-right">Total Panjang (M)</TableHead>
                <TableHead className="text-right">Total Kerusakan (M)</TableHead>
                <TableHead className="text-right">Estimasi Biaya</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  </TableCell>
                </TableRow>
              ) : (
                statsByVillage.map((stat) => (
                  <TableRow key={stat.villageName}>
                    <TableCell className="font-medium">{stat.villageName}</TableCell>
                    <TableCell className="text-right">{stat.totalPanjang.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right">{stat.totalRusak.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right">{formatCurrency(stat.estimasiBiaya)}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                         <Link href={`/admin/jalan-desa/${stat.villageName.toLowerCase()}`}>
                           Lihat Detail <ArrowRight className="ml-2 h-4 w-4" />
                         </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

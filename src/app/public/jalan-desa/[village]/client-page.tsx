'use client';

import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { type JalanDesa } from '@/lib/jalan-desa-data';
import { Map, AlertTriangle, Loader2 } from 'lucide-react';

function capitalizeFirstLetter(string: string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function JalanDesaPublicClientPage({ village }: { village: string }) {
  const villageTitle = capitalizeFirstLetter(village);
  const firestore = useFirestore();
  const villageKey = village.toLowerCase();

  const jalanDesaQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'jalanDesa'), where('village', '==', villageKey));
  }, [firestore, villageKey]);

  const { data: jalanList, isLoading: isLoadingData } = useCollection<JalanDesa>(jalanDesaQuery);

  const sortedJalanList = useMemo(() => {
    if (!jalanList) return [];
    return [...jalanList].sort((a, b) => a.noUrut - b.noUrut);
  }, [jalanList]);

  const totals = useMemo(() => {
    if (!jalanList) return { totalPanjang: 0, totalRusak: 0 };
    const totalPanjang = jalanList.reduce((acc, jalan) => acc + (Number(jalan.panjang) || 0), 0);
    const totalRusak = jalanList.reduce(
      (acc, jalan) => acc + (Number(jalan.rusakRingan) || 0) + (Number(jalan.rusakBerat) || 0),
      0
    );
    return { totalPanjang, totalRusak };
  }, [jalanList]);

  if (isLoadingData) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
            <h1 className="text-3xl md:text-4xl font-bold font-headline text-slate-800 dark:text-slate-100">
                Database Jalan Desa
            </h1>
            <p className="mt-1 text-lg text-slate-600 dark:text-slate-400">
                Menampilkan rincian data kondisi jalan untuk <span className="font-semibold text-primary">{villageTitle}</span>.
            </p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Panjang Jalan</CardTitle>
                    <Map className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totals.totalPanjang.toLocaleString('id-ID')} M</div>
                    <p className="text-xs text-muted-foreground">Total panjang semua ruas jalan desa</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Kerusakan Jalan</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totals.totalRusak.toLocaleString('id-ID')} M</div>
                    <p className="text-xs text-muted-foreground">Total panjang jalan rusak ringan & berat</p>
                </CardContent>
            </Card>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Jalan Desa</CardTitle>
          <CardDescription>Rincian data untuk setiap ruas jalan di Desa {villageTitle}.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Jalan</TableHead>
                  <TableHead>Panjang (M)</TableHead>
                  <TableHead>Lebar (M)</TableHead>
                  <TableHead>Jenis Perkerasan</TableHead>
                  <TableHead>Kerusakan (M)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedJalanList.length > 0 ? (
                  sortedJalanList.map((jalan) => {
                    const kerusakan =
                      (Number(jalan.rusakRingan) || 0) + (Number(jalan.rusakBerat) || 0);
                    return (
                      <TableRow key={jalan.id}>
                        <TableCell>{jalan.noUrut}</TableCell>
                        <TableCell className="font-medium">{jalan.namaJalan}</TableCell>
                        <TableCell>{jalan.panjang}</TableCell>
                        <TableCell>{jalan.lebar}</TableCell>
                        <TableCell>{jalan.jenisPerkerasan}</TableCell>
                        <TableCell className={kerusakan > 0 ? 'text-destructive font-medium' : ''}>
                          {kerusakan > 0 ? kerusakan.toLocaleString('id-ID') : '0'}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      Belum ada data jalan untuk desa ini.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

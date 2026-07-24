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
import { Loader2, Landmark } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { ApbdesDetail } from '@/lib/perangkat-data';

function capitalizeFirstLetter(string: string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function ApbdesPublicClientPage({ village }: { village: string }) {
  const villageTitle = capitalizeFirstLetter(village);
  const firestore = useFirestore();

  const year = new Date().getFullYear();
  const apbdesId = `${village.toLowerCase()}-${year}`;

  const apbdesDetailsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'apbdes', apbdesId, 'details'));
  }, [firestore, apbdesId]);

  const { data: apbdesData, isLoading: isLoadingData } = useCollection<ApbdesDetail>(apbdesDetailsQuery);

  const summaryData = useMemo(() => {
    if (!apbdesData || apbdesData.length === 0) {
      return {
        expenditureByField: new Map<string, number>(),
        revenueBySource: new Map<string, number>(),
        expenditureBySource: new Map<string, number>(),
        totalRevenue: 0,
        totalExpenditure: 0,
      };
    }

    const revenues = apbdesData.filter(item => item.category.toLowerCase().includes('pendapatan'));
    const expenditures = apbdesData.filter(item => !item.category.toLowerCase().includes('pendapatan'));

    const expenditureByField = expenditures
      .reduce((acc, item) => {
        const fieldName = item.category.replace(/belanja/i, '').replace(/bidang/i, '').trim();
        acc.set(fieldName, (acc.get(fieldName) || 0) + item.amount);
        return acc;
      }, new Map<string, number>());
      
    const revenueBySource = revenues
      .reduce((acc, item) => {
        const source = item.fundingSource || 'Lainnya';
        acc.set(source, (acc.get(source) || 0) + item.amount);
        return acc;
    }, new Map<string, number>());
    
    const expenditureBySource = expenditures
      .reduce((acc, item) => {
        const source = item.fundingSource || 'Lainnya';
        acc.set(source, (acc.get(source) || 0) + item.amount);
        return acc;
      }, new Map<string, number>());

    const totalRevenue = revenues.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenditure = expenditures.reduce((sum, item) => sum + item.amount, 0);

    return { expenditureByField, revenueBySource, totalRevenue, expenditureBySource, totalExpenditure };
  }, [apbdesData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold font-headline text-slate-800 dark:text-slate-100">Rincian APBDes Desa {villageTitle}</h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Anggaran Pendapatan dan Belanja Desa untuk tahun {year}.</p>
        </div>

        {isLoadingData && (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )}

        {(!apbdesData || apbdesData.length === 0) && !isLoadingData && (
          <Card className="text-center p-8">
            <CardTitle>Data Tidak Ditemukan</CardTitle>
            <CardDescription className="mt-2">Data APBDes untuk Desa {villageTitle} tahun {year} belum tersedia.</CardDescription>
          </Card>
        )}

        {apbdesData && apbdesData.length > 0 && !isLoadingData && (
          <div className="space-y-6">
            
            {summaryData.revenueBySource.size > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Rincian Pendapatan per Sumber Dana</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {Array.from(summaryData.revenueBySource.entries()).map(([source, total]) => (
                        <div key={source} className="flex flex-col justify-between rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground capitalize">{source}</p>
                            <p className="text-lg font-bold mt-1">{formatCurrency(total)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t mt-4 pt-4 flex justify-between items-center font-bold text-lg">
                        <span>Total Pendapatan</span>
                        <span>{formatCurrency(summaryData.totalRevenue)}</span>
                    </div>
                  </CardContent>
                </Card>
            )}

            {summaryData.expenditureBySource.size > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Rincian Belanja per Sumber Dana</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {Array.from(summaryData.expenditureBySource.entries()).map(([source, total]) => (
                        <div key={source} className="flex flex-col justify-between rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground capitalize">{source}</p>
                            <p className="text-lg font-bold mt-1">{formatCurrency(total)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
            )}

            {summaryData.expenditureByField.size > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Rincian Belanja per Bidang</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {Array.from(summaryData.expenditureByField.entries()).map(([field, total]) => (
                        <div key={field} className="flex flex-col justify-between rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground capitalize">{field.toLowerCase()}</p>
                            <p className="text-lg font-bold mt-1">{formatCurrency(total)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t mt-4 pt-4 flex justify-between items-center font-bold text-lg">
                        <span>Total Belanja</span>
                        <span>{formatCurrency(summaryData.totalExpenditure)}</span>
                    </div>
                  </CardContent>
                </Card>
            )}
          </div>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Landmark className="h-6 w-6" />
                  <span>Data Rincian APBDes Tahun {year}</span>
                </CardTitle>
                <CardDescription>
                  Berikut adalah rincian kegiatan pendapatan dan belanja desa.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bidang</TableHead>
                    <TableHead>Kode Kegiatan</TableHead>
                    <TableHead>Kode</TableHead>
                    <TableHead>Nama Kegiatan</TableHead>
                    <TableHead>Anggaran</TableHead>
                    <TableHead>Sumber Dana</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingData && (
                     <TableRow><TableCell colSpan={6} className="text-center h-24"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>
                  )}
                  {!isLoadingData && apbdesData && apbdesData.length > 0 ? (
                    apbdesData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.activityCode}</TableCell>
                        <TableCell>{item.code}</TableCell>
                        <TableCell className="font-medium">{item.description}</TableCell>
                        <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.amount)}</TableCell>
                        <TableCell>{item.fundingSource}</TableCell>
                      </TableRow>
                    ))
                  ) : !isLoadingData && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        Belum ada rincian data APBDes untuk tahun ini.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

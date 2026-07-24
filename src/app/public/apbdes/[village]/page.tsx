'use client';

import { useParams, notFound } from 'next/navigation';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { villages } from '@/lib/villages';
import { ApbdesDetail } from '@/lib/perangkat-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { PublicHeader } from '@/components/public-dashboard/public-header';
import { useMemo } from 'react';

function capitalizeFirstLetter(string: string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

export default function PublicApbdesVillagePage() {
  const params = useParams();
  const village = params.village as string;
  
  if (!villages.map(v => v.toLowerCase()).includes(village)) {
    notFound();
  }

  const villageTitle = capitalizeFirstLetter(village);
  const firestore = useFirestore();
  const year = new Date().getFullYear();
  const apbdesId = `${village}-${year}`;

  const apbdesDetailsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'apbdes', apbdesId, 'details'));
  }, [firestore, apbdesId]);

  const { data: apbdesData, isLoading: isLoadingData } = useCollection<ApbdesDetail>(apbdesDetailsQuery);

  const summaryData = useMemo(() => {
    if (!apbdesData || apbdesData.length === 0) {
      return {
        expenditureByField: new Map<string, number>(),
        byFundingSource: new Map<string, number>(),
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
      
    const byFundingSource = revenues
      .reduce((acc, item) => {
        const source = item.fundingSource || 'Lainnya';
        acc.set(source, (acc.get(source) || 0) + item.amount);
        return acc;
    }, new Map<string, number>());
    
    const totalRevenue = revenues.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenditure = expenditures.reduce((sum, item) => sum + item.amount, 0);

    return { expenditureByField, byFundingSource, totalRevenue, totalExpenditure };
  }, [apbdesData]);
  
  const sortedApbdesData = useMemo(() => {
    if (!apbdesData) return [];
    return [...apbdesData].sort((a, b) => 
      (a.activityCode || "").localeCompare(b.activityCode || "", undefined, { numeric: true, sensitivity: 'base' })
    );
  }, [apbdesData]);


  return (
    <>
      <PublicHeader />
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold font-headline">Ringkasan APBDes Desa {villageTitle}</h1>
            <p className="text-muted-foreground">Tahun Anggaran {year}</p>
          </div>

          {isLoadingData && (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
             </div>
          )}

          {!isLoadingData && apbdesData && apbdesData.length > 0 ? (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ringkasan Pendapatan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {Array.from(summaryData.byFundingSource.entries()).map(([source, total]) => (
                                    <div key={source} className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">{source}</span>
                                        <span className="font-medium">{formatCurrency(total)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t mt-4 pt-4 flex justify-between items-center font-bold text-lg">
                                <span>Total Pendapatan</span>
                                <span>{formatCurrency(summaryData.totalRevenue)}</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Ringkasan Belanja</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {Array.from(summaryData.expenditureByField.entries()).map(([field, total]) => (
                                    <div key={field} className="flex justify-between text-sm">
                                        <span className="text-muted-foreground capitalize">{field.toLowerCase()}</span>
                                        <span className="font-medium">{formatCurrency(total)}</span>
                                    </div>
                                ))}
                            </div>
                             <div className="border-t mt-4 pt-4 flex justify-between items-center font-bold text-lg">
                                <span>Total Belanja</span>
                                <span>{formatCurrency(summaryData.totalExpenditure)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Rincian Anggaran</CardTitle>
                        <CardDescription>Daftar rincian kegiatan Anggaran Pendapatan dan Belanja Desa.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                <TableRow>
                                    <TableHead>Bidang</TableHead>
                                    <TableHead>Nama Kegiatan</TableHead>
                                    <TableHead>Anggaran</TableHead>
                                    <TableHead>Sumber Dana</TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                {sortedApbdesData.map((item) => (
                                    <TableRow key={item.id}>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell className="font-medium">{item.description}</TableCell>
                                    <TableCell>{formatCurrency(item.amount)}</TableCell>
                                    <TableCell>{item.fundingSource}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
          ) : (
            !isLoadingData && (
                <Card className="flex flex-col items-center justify-center p-8 text-center">
                    <CardTitle className="text-2xl font-bold">Data Belum Tersedia</CardTitle>
                    <CardDescription className="mt-2">Data APBDes untuk Desa {villageTitle} tahun {year} belum tersedia.</CardDescription>
                </Card>
            )
          )}

        </div>
      </main>
    </>
  );
}

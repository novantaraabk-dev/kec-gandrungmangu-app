'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { JalanKabupaten } from '@/lib/perangkat-data';
import { Loader2, Search, Milestone, Map, Wrench, ShieldCheck } from 'lucide-react';
import { villages } from '@/lib/villages';

function formatNumber(val?: number) {
  if (val === undefined || val === null || isNaN(val)) return '0';
  return new Intl.NumberFormat('id-ID').format(val);
}

function formatCurrency(value?: number) {
  if (!value) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

export default function PublicJalanKabupatenPage() {
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVillage, setFilterVillage] = useState('all');

  const jalanKabupatenQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'jalanKabupaten');
  }, [firestore]);

  const { data: allJalanList, isLoading } = useCollection<JalanKabupaten>(jalanKabupatenQuery);

  const filteredList = useMemo(() => {
    if (!allJalanList) return [];
    return allJalanList
      .filter((item) => filterVillage === 'all' || (item.village || '').toLowerCase().includes(filterVillage.toLowerCase()))
      .filter(
        (item) =>
          (item.namaRuas || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.noRuas || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.village || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [allJalanList, filterVillage, searchTerm]);

  const summary = useMemo(() => {
    if (!filteredList) return { totalRuas: 0, totalPanjang: 0, totalBaik: 0, totalRusak: 0, totalPagu: 0 };
    let totalPanjang = 0;
    let totalBaik = 0;
    let totalRusak = 0;
    let totalPagu = 0;

    filteredList.forEach((j) => {
      totalPanjang += Number(j.panjangRuas) || 0;
      totalBaik += Number(j.kondisiBaik) || 0;
      totalRusak += (Number(j.kondisiRusakRingan) || 0) + (Number(j.kondisiRusakBerat) || 0);
      totalPagu += Number(j.paguUsulan) || 0;
    });

    return {
      totalRuas: filteredList.length,
      totalPanjang,
      totalBaik,
      totalRusak,
      totalPagu,
    };
  }, [filteredList]);

  return (
    <div className="container mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold tracking-widest text-sky-700 uppercase bg-sky-50 px-3 py-1 rounded-full border border-sky-100 flex items-center gap-1.5">
              <Milestone className="w-3.5 h-3.5 text-sky-600" />
              Publikasi Data Terbuka
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-headline text-slate-900">
            Database Jalan Kabupaten
          </h1>
          <p className="mt-1 text-sm text-slate-500 max-w-2xl">
            Informasi kondisi fisik, lebar, tingkat kerusakan, dan pagu usulan ruas jalan kabupaten yang melintasi wilayah Kecamatan Gandrungmangu (Data resmi admin).
          </p>
        </div>
      </div>

      {/* KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
              <span>Total Ruas Jalan</span>
              <Milestone className="w-4 h-4 text-sky-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 font-headline mt-2">{summary.totalRuas} Ruas</p>
            <p className="text-xs text-slate-500 mt-1">Terdaftar di sistem admin</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
              <span>Total Panjang</span>
              <Map className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-black text-indigo-700 font-headline mt-2">{formatNumber(summary.totalPanjang)} M</p>
            <p className="text-xs text-slate-500 mt-1">Panjang keseluruhan ruas</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
              <span>Kondisi Baik</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-700 font-headline mt-2">{formatNumber(summary.totalBaik)} M</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              {((summary.totalBaik / (summary.totalPanjang || 1)) * 100).toFixed(1)}% Kondisi Baik
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
              <span>Total Pagu Usulan</span>
              <Wrench className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-xl font-black text-slate-900 font-headline mt-2 truncate">{formatCurrency(summary.totalPagu)}</p>
            <p className="text-xs text-slate-500 mt-1">Usulan perbaikan Musrenbang</p>
          </CardContent>
        </Card>
      </div>

      {/* FILTER & TABLE */}
      <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">Daftar Ruas Jalan Kabupaten</CardTitle>
              <CardDescription className="text-xs text-slate-500">Tabel lengkap data jalan kabupaten di Kecamatan Gandrungmangu</CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Cari nama / nomor ruas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 text-xs rounded-xl"
                />
              </div>

              {/* Village Filter */}
              <select
                value={filterVillage}
                onChange={(e) => setFilterVillage(e.target.value)}
                className="h-9 px-3 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold"
              >
                <option value="all">Semua Desa</option>
                {villages.map((v) => (
                  <option key={v} value={v.toLowerCase()}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2 text-sky-600" />
              <span className="text-xs font-semibold">Memuat data jalan kabupaten...</span>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs">
              Tidak ada data ruas jalan kabupaten yang ditemukan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="text-[11px] font-bold text-slate-700">
                    <TableHead className="w-12 text-center">No</TableHead>
                    <TableHead>No. Ruas</TableHead>
                    <TableHead>Nama Ruas Jalan</TableHead>
                    <TableHead>Wilayah Desa</TableHead>
                    <TableHead className="text-right">Panjang (M)</TableHead>
                    <TableHead className="text-right">Lebar (M)</TableHead>
                    <TableHead className="text-right">Baik (M)</TableHead>
                    <TableHead className="text-right">Sedang (M)</TableHead>
                    <TableHead className="text-right">Rusak (M)</TableHead>
                    <TableHead className="text-right">Pagu Usulan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs font-medium">
                  {filteredList.map((item, idx) => {
                    const totalRusak = (Number(item.kondisiRusakRingan) || 0) + (Number(item.kondisiRusakBerat) || 0);
                    return (
                      <TableRow key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                        <TableCell className="text-center text-slate-400 font-mono text-[11px]">{idx + 1}</TableCell>
                        <TableCell className="font-mono font-bold text-sky-700">{item.noRuas || '-'}</TableCell>
                        <TableCell className="font-bold text-slate-900">{item.namaRuas}</TableCell>
                        <TableCell className="capitalize text-slate-600">{item.village || '-'}</TableCell>
                        <TableCell className="text-right font-extrabold text-slate-900">{formatNumber(item.panjangRuas)}</TableCell>
                        <TableCell className="text-right text-slate-600">{formatNumber(item.lebarRuas)}</TableCell>
                        <TableCell className="text-right text-emerald-600 font-bold">{formatNumber(item.kondisiBaik)}</TableCell>
                        <TableCell className="text-right text-sky-600">{formatNumber(item.kondisiSedang)}</TableCell>
                        <TableCell className="text-right text-rose-600 font-bold">{formatNumber(totalRusak)}</TableCell>
                        <TableCell className="text-right font-bold text-slate-900">{formatCurrency(item.paguUsulan)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

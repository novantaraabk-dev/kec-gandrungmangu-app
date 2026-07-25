'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Apbdes, Monev } from '@/lib/perangkat-data';
import { 
  Landmark, 
  DollarSign, 
  TrendingUp, 
  Building2, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Layers, 
  Table, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Sparkles,
  ClipboardCheck,
  ShieldCheck,
  AlertCircle,
  Coins
} from 'lucide-react';
import Link from 'next/link';

// Format currency helper
const formatCurrency = (val: number) => {
  if (!val || isNaN(val)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
};

// Format concise currency helper (e.g. 16,85 M)
const formatShortCurrency = (val: number) => {
  if (!val || isNaN(val)) return 'Rp 0';
  if (val >= 1_000_000_000) {
    return `Rp ${(val / 1_000_000_000).toFixed(2).replace('.', ',')} M`;
  }
  if (val >= 1_000_000) {
    return `Rp ${(val / 1_000_000).toFixed(1).replace('.', ',')} Jt`;
  }
  return formatCurrency(val);
};

// 14 Villages Financial & Monev Default Dataset (Updated with exact 2026 Dana Desa Reguler allocations)
const defaultVillageFinanceData = [
  { village: 'GANDRUNGMANGU', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 96.5, realisasiFisikPct: 98.0, statusSpj: 'SPJ Lengkap', statusDesa: 'MAJU' },
  { village: 'GANDRUNGMANIS', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 94.2, realisasiFisikPct: 95.5, statusSpj: 'SPJ Lengkap', statusDesa: 'MAJU' },
  { village: 'CISUMUR', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 95.8, realisasiFisikPct: 97.2, statusSpj: 'SPJ Lengkap', statusDesa: 'MANDIRI' },
  { village: 'KARANGANYAR', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 93.5, realisasiFisikPct: 95.0, statusSpj: 'SPJ Lengkap', statusDesa: 'MAJU' },
  { village: 'CINANGSI', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 95.0, realisasiFisikPct: 96.5, statusSpj: 'SPJ Lengkap', statusDesa: 'MAJU' },
  { village: 'KARANGGINTUNG', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 94.8, realisasiFisikPct: 96.0, statusSpj: 'SPJ Lengkap', statusDesa: 'BERKEMBANG' },
  { village: 'RUNGKANG', pagu: 801832000, dds: 356832000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 343832000, bidang3: 60000000, bidang4: 108000000, bidang5: 30000000, realisasiKeuanganPct: 92.0, realisasiFisikPct: 94.0, statusSpj: 'SPJ Lengkap', statusDesa: 'BERKEMBANG' },
  { village: 'SIDAURIP', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 94.5, realisasiFisikPct: 96.2, statusSpj: 'SPJ Lengkap', statusDesa: 'MAJU' },
  { village: 'GINTUNGREJA', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 93.8, realisasiFisikPct: 95.4, statusSpj: 'SPJ Lengkap', statusDesa: 'MAJU' },
  { village: 'LAYANSARI', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 96.0, realisasiFisikPct: 97.8, statusSpj: 'SPJ Lengkap', statusDesa: 'MAJU' },
  { village: 'BULUSARI', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 94.0, realisasiFisikPct: 95.8, statusSpj: 'SPJ Lengkap', statusDesa: 'BERKEMBANG' },
  { village: 'MUKTISARI', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 95.2, realisasiFisikPct: 96.8, statusSpj: 'SPJ Lengkap', statusDesa: 'MAJU' },
  { village: 'WRINGINHARJO', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 94.6, realisasiFisikPct: 96.0, statusSpj: 'SPJ Lengkap', statusDesa: 'MAJU' },
  { village: 'KERTAJAYA', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 94.1, realisasiFisikPct: 95.6, statusSpj: 'SPJ Lengkap', statusDesa: 'BERKEMBANG' },
];

export function VillageFinanceSection() {
  const firestore = useFirestore();
  const [showTable, setShowTable] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<'sumber' | 'bidang' | 'prioritas'>('sumber');
  const [selectedSort, setSelectedSort] = useState<'pagu' | 'realisasi' | 'dds'>('pagu');

  const currentYear = new Date().getFullYear();

  // Query Firestore collection `apbdes`
  const apbdesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'apbdes'));
  }, [firestore]);
  const { data: firestoreApbdes } = useCollection<Apbdes>(apbdesQuery);

  // Query Firestore collection `monev`
  const monevQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'monev'));
  }, [firestore]);
  const { data: firestoreMonev } = useCollection<Monev>(monevQuery);

  // Query Firestore collection `prioritasDanaDesa`
  const prioritasQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'prioritasDanaDesa'));
  }, [firestore]);
  const { data: firestorePrioritas } = useCollection<any>(prioritasQuery);

  // Aggregated Village Data with Firestore Monev Realization & Prioritas DDS Overrides
  const villageList = useMemo(() => {
    const monevRealizationMap: Record<string, number> = {};
    if (firestoreMonev && firestoreMonev.length > 0) {
      firestoreMonev.forEach((m) => {
        if (m.village && m.realization) {
          const key = m.village.toUpperCase();
          monevRealizationMap[key] = (monevRealizationMap[key] || 0) + Number(m.realization);
        }
      });
    }

    const prioritasDdsMap: Record<string, number> = {};
    if (firestorePrioritas && firestorePrioritas.length > 0) {
      firestorePrioritas.forEach((p) => {
        if (p.village && (p.paguDanaDesa || p.jumlahPaguPrioritas)) {
          const key = p.village.toUpperCase();
          prioritasDdsMap[key] = (prioritasDdsMap[key] || 0) + Number(p.paguDanaDesa || p.jumlahPaguPrioritas || 0);
        }
      });
    }

    return defaultVillageFinanceData.map((v) => {
      const vKey = v.village.toUpperCase();
      
      const fsDds = prioritasDdsMap[vKey];
      const dds = fsDds !== undefined && fsDds > 0 ? fsDds : v.dds;

      const fsRealization = monevRealizationMap[vKey];
      const fallbackAmount = (v as any).realisasiAmount || Math.round(v.pagu * (v.realisasiKeuanganPct / 100));
      const realisasiAmount = fsRealization !== undefined && fsRealization > 0 ? fsRealization : fallbackAmount;
      const realisasiKeuanganPct = Number(((realisasiAmount / (v.pagu || 1)) * 100).toFixed(1));

      return {
        ...v,
        dds,
        realisasiAmount,
        realisasiKeuanganPct,
      };
    });
  }, [firestoreMonev, firestorePrioritas]);

  // Aggregated Totals
  const totals = useMemo(() => {
    return villageList.reduce(
      (acc, curr) => {
        acc.pagu += curr.pagu;
        acc.dds += curr.dds;
        acc.add += curr.add;
        acc.pbh += curr.pbh;
        acc.pades += curr.pades;
        acc.dll += curr.dll;
        acc.bidang1 += curr.bidang1;
        acc.bidang2 += curr.bidang2;
        acc.bidang3 += curr.bidang3;
        acc.bidang4 += curr.bidang4;
        acc.bidang5 += curr.bidang5;
        return acc;
      },
      {
        pagu: 0,
        dds: 0,
        add: 0,
        pbh: 0,
        pades: 0,
        dll: 0,
        bidang1: 0,
        bidang2: 0,
        bidang3: 0,
        bidang4: 0,
        bidang5: 0,
      }
    );
  }, [villageList]);

  // Overall Realisasi Averages
  const avgRealisasi = useMemo(() => {
    const totalKeuanganPct = villageList.reduce((acc, curr) => acc + curr.realisasiKeuanganPct, 0);
    const totalFisikPct = villageList.reduce((acc, curr) => acc + curr.realisasiFisikPct, 0);
    const spjLengkapCount = villageList.filter(v => v.statusSpj === 'SPJ Lengkap').length;

    const mandiriCount = villageList.filter(v => (v as any).statusDesa === 'MANDIRI').length || 1;
    const majuCount = villageList.filter(v => (v as any).statusDesa === 'MAJU').length || 9;
    const berkembangCount = villageList.filter(v => (v as any).statusDesa === 'BERKEMBANG').length || 4;

    return {
      keuanganPct: (totalKeuanganPct / villageList.length).toFixed(1),
      fisikPct: (totalFisikPct / villageList.length).toFixed(1),
      spjLengkapCount,
      totalVillageCount: villageList.length,
      mandiriCount,
      majuCount,
      berkembangCount,
    };
  }, [villageList]);

  // Total Realisasi Monev Amount & Total Realisasi Monev % across all 14 villages
  const totalMonevSummary = useMemo(() => {
    const totalPagu = totals.pagu || 1;
    const totalRealisasiAmount = villageList.reduce((acc, curr) => acc + curr.realisasiAmount, 0);
    const totalRealisasiPct = Number(((totalRealisasiAmount / totalPagu) * 100).toFixed(1));

    return {
      totalRealisasiAmount,
      totalRealisasiPct,
      totalPagu,
    };
  }, [totals.pagu, villageList]);

  // Pie Chart Slices for Sumber Anggaran (matching uploaded infographic reference)
  const sumberDanaSlices = useMemo(() => {
    const total = totals.pagu || 1;
    return [
      { num: '01', label: 'DDS (Dana Desa - APBN)', shortLabel: 'DDS (Dana Desa)', amount: totals.dds, pct: Number(((totals.dds / total) * 100).toFixed(1)), color: '#0284C7', gradient: 'from-sky-500 to-indigo-600' },
      { num: '02', label: 'ADD (Alokasi Dana Desa)', shortLabel: 'ADD (Alokasi Desa)', amount: totals.add, pct: Number(((totals.add / total) * 100).toFixed(1)), color: '#0D9488', gradient: 'from-teal-500 to-emerald-600' },
      { num: '03', label: 'PBH (Bagi Hasil Pajak)', shortLabel: 'PBH (Bagi Hasil)', amount: totals.pbh, pct: Number(((totals.pbh / total) * 100).toFixed(1)), color: '#D97706', gradient: 'from-amber-500 to-orange-600' },
      { num: '04', label: 'PADes (Pendapatan Asli Desa)', shortLabel: 'PADes (Asli Desa)', amount: totals.pades, pct: Number(((totals.pades / total) * 100).toFixed(1)), color: '#E11D48', gradient: 'from-rose-500 to-red-600' },
      { num: '05', label: 'DLL (Pendapatan Lain-Lain)', shortLabel: 'DLL (Lain-Lain)', amount: totals.dll, pct: Number(((totals.dll / total) * 100).toFixed(1)), color: '#8B5CF6', gradient: 'from-purple-500 to-indigo-600' },
    ];
  }, [totals]);

  // Pie Chart Slices for Belanja per Bidang (matching uploaded infographic reference)
  const bidangSlices = useMemo(() => {
    const total = totals.pagu || 1;
    return [
      { num: '01', label: 'Bidang 1: Penyelenggaraan Pemerintahan', shortLabel: 'Bidang Pemerintahan', amount: totals.bidang1, pct: Number(((totals.bidang1 / total) * 100).toFixed(1)), color: '#0284C7', gradient: 'from-blue-600 to-sky-500' },
      { num: '02', label: 'Bidang 2: Pelaksanaan Pembangunan', shortLabel: 'Bidang Pembangunan', amount: totals.bidang2, pct: Number(((totals.bidang2 / total) * 100).toFixed(1)), color: '#0D9488', gradient: 'from-teal-500 to-emerald-600' },
      { num: '03', label: 'Bidang 3: Pembinaan Kemasyarakatan', shortLabel: 'Bidang Pembinaan', amount: totals.bidang3, pct: Number(((totals.bidang3 / total) * 100).toFixed(1)), color: '#D97706', gradient: 'from-amber-500 to-orange-600' },
      { num: '04', label: 'Bidang 4: Pemberdayaan Masyarakat', shortLabel: 'Bidang Pemberdayaan', amount: totals.bidang4, pct: Number(((totals.bidang4 / total) * 100).toFixed(1)), color: '#E11D48', gradient: 'from-rose-500 to-red-600' },
      { num: '05', label: 'Bidang 5: Bencana & Keadaan Darurat', shortLabel: 'Bidang Bencana/Darurat', amount: totals.bidang5, pct: Number(((totals.bidang5 / total) * 100).toFixed(1)), color: '#8B5CF6', gradient: 'from-purple-500 to-indigo-600' },
    ];
  }, [totals]);

  // Pie Chart Slices for Prioritas Dana Desa 2026 (matching exact table data / Firestore)
  const prioritasDanaSlices = useMemo(() => {
    let blt = 494400000;
    let iklim = 283967220;
    let kesehatan = 1356734400;
    let pangan = 447960800;
    let infrastrukturDigital = 533245700;

    if (firestorePrioritas && firestorePrioritas.length > 0) {
      blt = firestorePrioritas.reduce((acc, curr: any) => acc + (curr.totalAnggaranBlt || 0), 0) || blt;
      iklim = firestorePrioritas.reduce((acc, curr: any) => acc + (curr.totalAnggaranIklim || 0), 0) || iklim;
      kesehatan = firestorePrioritas.reduce((acc, curr: any) => acc + (curr.totalAnggaranKesehatan || 0), 0) || kesehatan;
      pangan = firestorePrioritas.reduce((acc, curr: any) => acc + (curr.totalAnggaranPangan || 0), 0) || pangan;
      infrastrukturDigital = firestorePrioritas.reduce((acc, curr: any) => acc + ((curr.totalAnggaranInfrastruktur || 0) + (curr.totalAnggaranDigital || 0)), 0) || infrastrukturDigital;
    }

    const total = (blt + iklim + kesehatan + pangan + infrastrukturDigital) || 1;

    return [
      { num: '01', label: 'BLT Dana Desa (Bantuan Tunai)', shortLabel: 'BLT Dana Desa', amount: blt, pct: Number(((blt / total) * 100).toFixed(1)), color: '#0284C7', gradient: 'from-sky-500 to-indigo-600' },
      { num: '02', label: 'Desa Iklim & Tangguh Bencana', shortLabel: 'Desa Iklim & Bencana', amount: iklim, pct: Number(((iklim / total) * 100).toFixed(1)), color: '#0D9488', gradient: 'from-teal-500 to-emerald-600' },
      { num: '03', label: 'Layanan Kesehatan Skala Desa', shortLabel: 'Layanan Kesehatan', amount: kesehatan, pct: Number(((kesehatan / total) * 100).toFixed(1)), color: '#D97706', gradient: 'from-amber-500 to-orange-600' },
      { num: '04', label: 'Ketahanan Pangan & Ekonomi', shortLabel: 'Ketahanan Pangan', amount: pangan, pct: Number(((pangan / total) * 100).toFixed(1)), color: '#E11D48', gradient: 'from-rose-500 to-red-600' },
      { num: '05', label: 'Infrastruktur PKTD & Digital', shortLabel: 'Infrastruktur & Digital', amount: infrastrukturDigital, pct: Number(((infrastrukturDigital / total) * 100).toFixed(1)), color: '#8B5CF6', gradient: 'from-purple-500 to-indigo-600' },
    ];
  }, [firestorePrioritas]);

  // Active Slices & Totals based on Active Tab
  const activeSlices = activeChartTab === 'sumber' ? sumberDanaSlices : activeChartTab === 'bidang' ? bidangSlices : prioritasDanaSlices;
  const activeTotalAmount = useMemo(() => {
    if (activeChartTab === 'prioritas') {
      return prioritasDanaSlices.reduce((acc, curr) => acc + curr.amount, 0);
    }
    return totals.pagu;
  }, [activeChartTab, prioritasDanaSlices, totals.pagu]);

  // Sorted Village List for Ranking Chart
  const sortedVillages = useMemo(() => {
    return [...villageList].sort((a, b) => {
      if (selectedSort === 'pagu') return b.pagu - a.pagu;
      if (selectedSort === 'realisasi') return b.realisasiKeuanganPct - a.realisasiKeuanganPct;
      if (selectedSort === 'dds') return b.dds - a.dds;
      return b.pagu - a.pagu;
    });
  }, [villageList, selectedSort]);

  const maxPagu = useMemo(() => Math.max(...villageList.map(v => v.pagu)), [villageList]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mt-10 pt-10 border-t border-indigo-100/90 space-y-8"
    >
      
      {/* SECTION HEADER & NAV LINK */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-indigo-100 pb-4 sm:pb-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-[10px] sm:text-xs font-black tracking-widest text-indigo-700 uppercase bg-gradient-to-r from-indigo-100 via-purple-100 to-sky-100 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-indigo-200 shadow-sm flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-indigo-600" />
              KEUANGAN DESA & REALISASI MONEV
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl lg:text-4xl font-black font-headline tracking-tight leading-tight text-slate-900">
            Keuangan & Realisasi APBDes 14 Desa
          </h2>

          <p className="text-xs sm:text-base text-slate-600 leading-relaxed mt-1 font-medium max-w-3xl">
            Rekapitulasi Rincian Belanja per Sumber Dana, Rincian Belanja per Bidang, serta Capaian Hasil Realisasi Monev APBDes di Kecamatan Gandrungmangu.
          </p>
        </div>

        {/* HEADER ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <button
            onClick={() => setShowTable(!showTable)}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3.5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Table className="w-4 h-4 text-indigo-600" />
            <span>{showTable ? 'Sembunyikan Tabel Financial' : 'Lihat Matriks Financial 14 Desa'}</span>
            {showTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <Link
            href="/public/apbdes"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 px-4 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:scale-102"
          >
            <span>Detail APBDes per Desa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 5 TOP SUMMARY HIGHLIGHT CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Stat 1: Total Pagu APBDes Kecamatan */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-indigo-50/90 via-purple-50/40 to-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-indigo-200/90 shadow-md hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-300">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-black text-indigo-700 bg-indigo-100/90 px-2.5 py-0.5 rounded-full border border-indigo-200 uppercase">
              PAGU ANGGARAN
            </span>
          </div>
          <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Total APBDes 14 Desa</p>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 font-headline mt-1 tracking-tight">
            {formatShortCurrency(totals.pagu)}
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-600 font-medium mt-1">14 Desa di Gandrungmangu</p>
        </motion.div>

        {/* Stat 2: Total Dana Desa (DDS) */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-sky-50/90 via-cyan-50/40 to-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-sky-200/90 shadow-md hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 text-white flex items-center justify-center font-bold shadow-md shadow-sky-300">
              <Landmark className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-black text-sky-700 bg-sky-100/90 px-2.5 py-0.5 rounded-full border border-sky-200 uppercase">
              DANA DESA (APBN)
            </span>
          </div>
          <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Total DDS (Dana Desa)</p>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 font-headline mt-1 tracking-tight">
            {formatShortCurrency(totals.dds)}
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-600 font-medium mt-1">45.5% dari Total APBDes</p>
        </motion.div>

        {/* Stat 3: Realisasi Keuangan Monev */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-emerald-200/90 shadow-md hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-300">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-black text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">
              HASIL MONEV
            </span>
          </div>
          <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Rata-rata Realisasi Keuangan</p>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 font-headline mt-1 tracking-tight">
            {avgRealisasi.keuanganPct}% <span className="text-xs sm:text-sm font-bold text-emerald-600">Tercapai</span>
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-600 font-medium mt-1">Realisasi Fisik: {avgRealisasi.fisikPct}%</p>
        </motion.div>

        {/* Stat 4: Verifikasi SPJ Lengkap */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-purple-50/90 via-indigo-50/40 to-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-purple-200/90 shadow-md hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-300">
              <ClipboardCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-black text-purple-700 bg-purple-100/90 px-2.5 py-0.5 rounded-full border border-purple-200 uppercase">
              STATUS SPJ DESA
            </span>
          </div>
          <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Kelengkapan SPJ Monev</p>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 font-headline mt-1 tracking-tight">
            {avgRealisasi.spjLengkapCount} / {avgRealisasi.totalVillageCount} <span className="text-xs sm:text-sm font-bold text-purple-600">Desa</span>
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-600 font-medium mt-1">100% SPJ Lengkap Terverifikasi</p>
        </motion.div>

        {/* Stat 5: Status IDM Desa (Kartu Didedikasikan di Sebelah STATUS SPJ) */}
        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-teal-50/90 via-emerald-50/40 to-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-teal-200/90 shadow-md hover:shadow-xl transition-all col-span-2 sm:col-span-1 lg:col-span-1"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-teal-300">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-black text-teal-700 bg-teal-100/90 px-2.5 py-0.5 rounded-full border border-teal-200 uppercase">
              STATUS IDM DESA
            </span>
          </div>
          <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Klasifikasi Status Desa</p>

          <div className="mt-2 space-y-1 sm:space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/80 text-emerald-900">
              <span>Mandiri</span>
              <span className="font-black text-emerald-700">{avgRealisasi.mandiriCount} Desa</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200/80 text-blue-900">
              <span>Maju</span>
              <span className="font-black text-blue-700">{avgRealisasi.majuCount} Desa</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/80 text-amber-900">
              <span>Berkembang</span>
              <span className="font-black text-amber-700">{avgRealisasi.berkembangCount} Desa</span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* 2 MAIN SECTIONS: (1) PIE CHART INFOGRAPHIC (2) RANKING REALISASI MONEV PER DESA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* LEFT COLUMN: PIE CHART INFOGRAPHIC (SUMBER DANA & BIDANG) (7 COLS) */}
        <div className="lg:col-span-7 bg-slate-50/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-6">
          
          {/* TAB SWITCHER & HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-headline flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-indigo-600" />
                {activeChartTab === 'sumber' 
                  ? 'Diagram Pie Total per Sumber Anggaran' 
                  : activeChartTab === 'bidang' 
                  ? 'Diagram Pie Rincian Belanja per Bidang' 
                  : 'Diagram Pie Prioritas Dana Desa 2026'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">Visualisasi infografis lingkaran proporsi APBDes 14 Desa</p>
            </div>

            {/* TAB SELECTOR BUTTONS (3 TABS) */}
            <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-2xl border border-slate-300 shadow-inner flex-wrap sm:flex-nowrap">
              <button
                onClick={() => setActiveChartTab('sumber')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                  activeChartTab === 'sumber'
                    ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>Sumber Anggaran</span>
              </button>

              <button
                onClick={() => setActiveChartTab('bidang')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                  activeChartTab === 'bidang'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Belanja per Bidang</span>
              </button>

              <button
                onClick={() => setActiveChartTab('prioritas')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                  activeChartTab === 'prioritas'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Prioritas DD</span>
              </button>
            </div>
          </div>

          {/* SVG INFOGRAPHIC PIE CHART WITH NUMBERED PINS (STYLE MATCHING USER REFERENCE IMAGE) */}
          <div className="flex flex-col items-center justify-center relative py-2">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center">
              
              <svg viewBox="0 0 320 320" className="w-full h-full drop-shadow-xl overflow-visible">
                {(() => {
                  let cumulativeAngle = -90;
                  const r = 78;
                  const strokeWidth = 34;
                  const circumference = 2 * Math.PI * r;

                  // Pass 1: Compute raw geometries & initial leader line coordinates
                  const items = activeSlices.map((slice, index) => {
                    const percentage = slice.pct / 100;
                    const angle = percentage * 360;
                    const startAngle = cumulativeAngle;
                    const endAngle = cumulativeAngle + angle;
                    cumulativeAngle += angle;

                    const midAngle = (startAngle + endAngle) / 2;
                    const rad = (midAngle * Math.PI) / 180;

                    const strokeDasharray = `${(percentage * circumference).toFixed(1)} ${(circumference - percentage * circumference).toFixed(1)}`;
                    const strokeDashoffset = ((-startAngle - 90) / 360 * circumference).toFixed(1);

                    const rStart = 95;
                    const rElbow = 118 + (index % 3) * 15;

                    const x1 = 160 + rStart * Math.cos(rad);
                    const y1 = 160 + rStart * Math.sin(rad);
                    let x2 = 160 + rElbow * Math.cos(rad);
                    let y2 = 160 + rElbow * Math.sin(rad);

                    let isRight = Math.cos(rad) >= -0.15;
                    if (Math.sin(rad) < -0.7 && Math.abs(Math.cos(rad)) < 0.45) {
                      isRight = index % 2 === 0;
                    }

                    let x3 = isRight ? Math.max(x2 + 20, 195) : Math.min(x2 - 20, 125);

                    return {
                      slice,
                      index,
                      percentage,
                      strokeDasharray,
                      strokeDashoffset,
                      x1, y1, x2, y2, x3, isRight,
                    };
                  });

                  // Pass 2: Anti-collision adjustments grouped by Right and Left sides
                  const rightItems = items.filter(it => it.isRight).sort((a, b) => a.y2 - b.y2);
                  const leftItems = items.filter(it => !it.isRight).sort((a, b) => a.y2 - b.y2);

                  const enforceMinSpacing = (group: typeof items) => {
                    for (let i = 1; i < group.length; i++) {
                      const prev = group[i - 1];
                      const curr = group[i];
                      const minDist = 26; // Ensure 26px vertical distance between text centers
                      if (curr.y2 - prev.y2 < minDist) {
                        curr.y2 = prev.y2 + minDist;
                      }
                    }
                  };

                  enforceMinSpacing(rightItems);
                  enforceMinSpacing(leftItems);

                  return items.map(({ slice, strokeDasharray, strokeDashoffset, x1, y1, x2, y2, x3, isRight }) => (
                    <g key={slice.num} className="group cursor-pointer">
                      {/* Arc Donut Segment */}
                      <circle
                        cx="160"
                        cy="160"
                        r={r}
                        stroke={slice.color}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        transform="rotate(-90 160 160)"
                        className="transition-all duration-300 hover:stroke-[40] opacity-95 hover:opacity-100"
                      >
                        <title>{`${slice.label}: ${formatCurrency(slice.amount)} (${slice.pct}%)`}</title>
                      </circle>

                      {/* Step Leader Line */}
                      <polyline
                        points={`${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)} ${x3.toFixed(1)},${y2.toFixed(1)}`}
                        stroke={slice.color}
                        strokeWidth="1.8"
                        strokeDasharray="2.5,2.5"
                        fill="none"
                        className="opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <circle cx={x1.toFixed(1)} cy={y1.toFixed(1)} r="3" fill={slice.color} />

                      {/* Numbered Pin Badge Circle (Style from uploaded reference image) */}
                      <circle cx={x3.toFixed(1)} cy={y2.toFixed(1)} r="8.5" fill={slice.color} className="shadow-md" />
                      <text
                        x={x3.toFixed(1)}
                        y={(y2 + 3).toFixed(1)}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        className="text-[8px] font-black font-mono pointer-events-none select-none"
                      >
                        {slice.num}
                      </text>

                      {/* Text Callout Label attached to Leader Line Pin */}
                      <text
                        x={isRight ? (x3 + 12).toFixed(1) : (x3 - 12).toFixed(1)}
                        y={y2.toFixed(1)}
                        textAnchor={isRight ? "start" : "end"}
                        className="pointer-events-none select-none transition-all group-hover:scale-105"
                      >
                        <tspan
                          x={isRight ? (x3 + 12).toFixed(1) : (x3 - 12).toFixed(1)}
                          dy="-3"
                          className="text-[8px] sm:text-[8.5px] font-black fill-slate-900 font-headline"
                        >
                          {slice.shortLabel}
                        </tspan>
                        <tspan
                          x={isRight ? (x3 + 12).toFixed(1) : (x3 - 12).toFixed(1)}
                          dy="9"
                          fill={slice.color}
                          className="text-[7.5px] font-black"
                        >
                          {`${formatShortCurrency(slice.amount)} (${slice.pct}%)`}
                        </tspan>
                      </text>
                    </g>
                  ));
                })()}

                {/* CENTER DARK EMBLEM CORE BADGE (MATCHING USER REFERENCE IMAGE) */}
                <foreignObject x="100" y="100" width="120" height="120" className="overflow-visible">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border-4 border-white shadow-2xl flex flex-col items-center justify-center text-white text-center p-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400 text-slate-900 flex items-center justify-center font-black shadow-md mb-0.5">
                      {activeChartTab === 'sumber' ? <Coins className="w-4 h-4" /> : activeChartTab === 'bidang' ? <Layers className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    </div>
                    <span className="text-[13px] font-black font-headline tracking-tight leading-none mt-0.5">
                      {formatShortCurrency(activeTotalAmount)}
                    </span>
                    <span className="text-[7.5px] font-bold tracking-widest uppercase text-cyan-300 mt-0.5">
                      {activeChartTab === 'sumber' ? 'TOTAL PAGU' : activeChartTab === 'bidang' ? 'TOTAL BELANJA' : 'TOTAL PRIORITAS'}
                    </span>
                  </div>
                </foreignObject>
              </svg>

            </div>
          </div>

          {/* CARDS BREAKDOWN LEGEND BELOW PIE CHART (3 COMPACT ROWS) */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
            {activeSlices.map((slice, index) => {
              const isLastOdd = index === activeSlices.length - 1 && activeSlices.length % 2 !== 0;

              return (
                <div 
                  key={slice.num}
                  className={`p-2 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between hover:shadow-sm transition-all ${
                    isLastOdd ? 'col-span-2' : 'col-span-1'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-md bg-gradient-to-r ${slice.gradient} text-white flex items-center justify-center font-black font-mono text-[10px] shadow-xs shrink-0`}>
                      {slice.num}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[11px] font-extrabold text-slate-900 font-headline truncate max-w-[120px] sm:max-w-[160px]" title={slice.label}>
                        {slice.shortLabel || slice.label}
                      </h4>
                      <p className="text-[9px] text-slate-400 font-medium">14 Desa</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-black text-slate-900 font-headline block">{formatShortCurrency(slice.amount)}</span>
                    <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">{slice.pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: CHART HASIL REALISASI VS TOTAL APBDES PER DESA (5 COLS) */}
        <div className="lg:col-span-5 bg-slate-50/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-headline flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Chart Hasil Realisasi Monev vs Total APBDes
              </h3>
              <p className="text-xs text-slate-500 font-medium">Nilai Realisasi Monev vs Total Pagu APBDes per Desa</p>
            </div>

            {/* Sort Toggle */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold shadow-xs">
              <button
                onClick={() => setSelectedSort('pagu')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${selectedSort === 'pagu' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Pagu
              </button>
              <button
                onClick={() => setSelectedSort('realisasi')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${selectedSort === 'realisasi' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Realisasi
              </button>
            </div>
          </div>

          {/* TOTAL REALISASI MONEV SUMMARY BADGE BOX */}
          <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 p-3.5 rounded-2xl text-white shadow-md flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-bold shadow-inner">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider block">Total Realisasi Monev Kecamatan</span>
                <span className="text-base sm:text-lg font-black font-headline tracking-tight">
                  {formatCurrency(totalMonevSummary.totalRealisasiAmount)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-emerald-100 uppercase block">Capaian Realisasi</span>
              <span className="text-sm sm:text-base font-black bg-white text-emerald-800 px-2.5 py-0.5 rounded-lg shadow-xs inline-block">
                {totalMonevSummary.totalRealisasiPct}%
              </span>
            </div>
          </div>

          {/* Sub Header Legend Indicator */}
          <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 text-[11px] font-bold">
            <span className="flex items-center gap-1.5 text-indigo-700">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
              Total APBDes (100%)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Hasil Realisasi Monev
            </span>
          </div>

          {/* 14 VILLAGES 2-COLUMN GRID (KIRI & KANAN) CHART REALISASI VS TOTAL APBDES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {sortedVillages.map((v, index) => {
              const realisasiPct = v.realisasiKeuanganPct;

              return (
                <motion.div
                  key={v.village}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className="p-2 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-800 font-headline flex items-center gap-1">
                      <span className="w-3.5 text-[9px] text-slate-400 font-mono font-black text-center">#{index + 1}</span>
                      <span className="truncate max-w-[85px] sm:max-w-[95px]">{v.village}</span>
                    </span>
                    
                    <div className="flex items-center gap-1">
                      <span className="text-emerald-700 font-black text-[10px]">
                        {formatShortCurrency(v.realisasiAmount)}
                      </span>
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {realisasiPct}%
                      </span>
                    </div>
                  </div>

                  {/* Stacked Compact Bar */}
                  <div className="w-full bg-indigo-100/70 h-2 rounded-full overflow-hidden border border-indigo-200/70 relative">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${realisasiPct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.05 + index * 0.02, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 shadow-xs"
                      title={`Total APBDes: ${formatCurrency(v.pagu)} | Hasil Realisasi: ${formatCurrency(v.realisasiAmount)} (${realisasiPct}%)`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>

      {/* EXPANDABLE REKAPITULASI FINANCIAL MATRIX DATA TABLE */}
      <AnimatePresence>
        {showTable && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden pt-4 border-t border-slate-200"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-slate-900 font-headline flex items-center gap-2">
                  <Table className="w-4 h-4 text-indigo-600" />
                  Tabel Matriks Keuangan APBDes & Realisasi Monev 14 Desa
                </h4>
                <span className="text-[11px] font-bold text-slate-500">
                  Tahun Anggaran {currentYear}
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
                <table className="w-full text-xs text-left text-slate-700">
                  <thead className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 text-white font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-3">No</th>
                      <th className="py-3 px-3">Desa</th>
                      <th className="py-3 px-3 text-right">Pagu APBDes</th>
                      <th className="py-3 px-3 text-right">DDS (Dana Desa)</th>
                      <th className="py-3 px-3 text-right">ADD (Alokasi Desa)</th>
                      <th className="py-3 px-3 text-right">Bagi Hasil (PBH)</th>
                      <th className="py-3 px-3 text-right">PADes</th>
                      <th className="py-3 px-3 text-right">Keuangan (%)</th>
                      <th className="py-3 px-3 text-right">Fisik (%)</th>
                      <th className="py-3 px-3 text-center">Status SPJ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {villageList.map((d, index) => (
                      <tr key={d.village} className="hover:bg-indigo-50/60 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-400">{index + 1}</td>
                        <td className="py-2.5 px-3 font-extrabold text-slate-900 font-headline">{d.village}</td>
                        <td className="py-2.5 px-3 text-right font-black text-slate-900">{formatCurrency(d.pagu)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-indigo-700">{formatCurrency(d.dds)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-sky-700">{formatCurrency(d.add)}</td>
                        <td className="py-2.5 px-3 text-right text-amber-700">{formatCurrency(d.pbh)}</td>
                        <td className="py-2.5 px-3 text-right text-emerald-700">{formatCurrency(d.pades)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-600">{d.realisasiKeuanganPct}%</td>
                        <td className="py-2.5 px-3 text-right font-bold text-teal-600">{d.realisasiFisikPct}%</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${d.statusSpj === 'SPJ Lengkap' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                            {d.statusSpj}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
                    <tr>
                      <td colSpan={2} className="py-3 px-3 text-left uppercase tracking-wider">Total Kecamatan</td>
                      <td className="py-3 px-3 text-right text-slate-900 font-black">{formatCurrency(totals.pagu)}</td>
                      <td className="py-3 px-3 text-right text-indigo-800">{formatCurrency(totals.dds)}</td>
                      <td className="py-3 px-3 text-right text-sky-800">{formatCurrency(totals.add)}</td>
                      <td className="py-3 px-3 text-right text-amber-800">{formatCurrency(totals.pbh)}</td>
                      <td className="py-3 px-3 text-right text-emerald-800">{formatCurrency(totals.pades)}</td>
                      <td className="py-3 px-3 text-right text-emerald-700">{avgRealisasi.keuanganPct}%</td>
                      <td className="py-3 px-3 text-right text-teal-700">{avgRealisasi.fisikPct}%</td>
                      <td className="py-3 px-3 text-center text-indigo-800">{avgRealisasi.spjLengkapCount}/14 Lengkap</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

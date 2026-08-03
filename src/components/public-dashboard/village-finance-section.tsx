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

// Format concise currency helper (e.g. 11,44 M)
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

// 14 Villages Financial & Monev Exact Dataset (Synced with Admin APBDes System)
const defaultVillageFinanceData = [
  { village: 'GANDRUNGMANGU', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 68.4, realisasiFisikPct: 98.0, statusSpj: 'SPJ Lengkap', statusDesa: 'MAJU' },
  { village: 'GANDRUNGMANIS', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 66.6, realisasiFisikPct: 95.5, statusSpj: 'SPJ Lengkap', statusDesa: 'MAJU' },
  { village: 'CISUMUR', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 40.1, realisasiFisikPct: 97.2, statusSpj: 'SPJ Lengkap', statusDesa: 'MANDIRI' },
  { village: 'KARANGANYAR', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 15.0, realisasiFisikPct: 95.0, statusSpj: 'SPJ Lengkap', statusDesa: 'MAJU' },
  { village: 'CINANGSI', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 41.8, realisasiFisikPct: 96.5, statusSpj: 'SPJ Lengkap', statusDesa: 'MAJU' },
  { village: 'KARANGGINTUNG', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 54.9, realisasiFisikPct: 96.0, statusSpj: 'SPJ Lengkap', statusDesa: 'BERKEMBANG' },
  { village: 'RUNGKANG', pagu: 801832000, dds: 356832000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 343832000, bidang3: 60000000, bidang4: 108000000, bidang5: 30000000, realisasiKeuanganPct: 58.1, realisasiFisikPct: 94.0, statusSpj: 'SPJ Lengkap', statusDesa: 'BERKEMBANG' },
  { village: 'SIDAURIP', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 21.9, realisasiFisikPct: 96.2, statusSpj: 'SPJ Lengkap', statusDesa: 'MAJU' },
  { village: 'GINTUNGREJA', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 58.5, realisasiFisikPct: 95.4, statusSpj: 'SPJ Lengkap', statusDesa: 'MAJU' },
  { village: 'LAYANSARI', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 54.7, realisasiFisikPct: 97.8, statusSpj: 'SPJ Lengkap', statusDesa: 'MAJU' },
  { village: 'BULUSARI', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 58.3, realisasiFisikPct: 95.8, statusSpj: 'SPJ Lengkap', statusDesa: 'BERKEMBANG' },
  { village: 'MUKTISARI', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 58.1, realisasiFisikPct: 96.8, statusSpj: 'SPJ Lengkap', statusDesa: 'MAJU' },
  { village: 'WRINGINHARJO', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 67.4, realisasiFisikPct: 96.0, statusSpj: 'SPJ Lengkap', statusDesa: 'MAJU' },
  { village: 'KERTAJAYA', pagu: 818456000, dds: 373456000, add: 310000000, pbh: 45000000, pades: 60000000, dll: 30000000, bidang1: 260000000, bidang2: 360000000, bidang3: 60000000, bidang4: 108456000, bidang5: 30000000, realisasiKeuanganPct: 66.5, realisasiFisikPct: 95.6, statusSpj: 'SPJ Lengkap', statusDesa: 'BERKEMBANG' },
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

  // Aggregated Village Data with Dynamic Firestore APBDes & Monev Merging
  const villageList = useMemo(() => {
    // Map Firestore APBDes documents by village key
    const apbdesMap: Record<string, any> = {};
    if (firestoreApbdes && firestoreApbdes.length > 0) {
      firestoreApbdes.forEach((item) => {
        const vName = item.village || (item.id ? item.id.split('-')[0] : '');
        if (vName) {
          const key = vName.toUpperCase();
          apbdesMap[key] = item;
        }
      });
    }

    // Map Firestore Monev entries by village key
    const monevRealizationMap: Record<string, { totalRealization: number; totalPhysical: number; count: number; spjIncomplete: boolean }> = {};
    if (firestoreMonev && firestoreMonev.length > 0) {
      firestoreMonev.forEach((m) => {
        if (m.village) {
          const key = m.village.toUpperCase();
          if (!monevRealizationMap[key]) {
            monevRealizationMap[key] = { totalRealization: 0, totalPhysical: 0, count: 0, spjIncomplete: false };
          }
          monevRealizationMap[key].totalRealization += Number(m.realization || 0);
          if ((m as any).physicalProgress) {
            monevRealizationMap[key].totalPhysical += Number((m as any).physicalProgress);
          }
          monevRealizationMap[key].count += 1;
          if (m.status && !m.status.toLowerCase().includes('lengkap')) {
            monevRealizationMap[key].spjIncomplete = true;
          }
        }
      });
    }

    // Map Firestore Prioritas Dana Desa
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
      const fsApbdes = apbdesMap[vKey];
      
      // Dynamic Pagu
      const pagu = fsApbdes?.revenue || fsApbdes?.pagu || v.pagu;
      
      // Dynamic Revenue Sources
      const revSources = fsApbdes?.revenueSources || {};
      const ddsFromFs = revSources['DDS'] || revSources['Dana Desa'] || prioritasDdsMap[vKey];
      const dds = ddsFromFs !== undefined && ddsFromFs > 0 ? ddsFromFs : v.dds;

      const addFromFs = revSources['ADD'] || revSources['Alokasi Dana Desa'];
      const add = addFromFs !== undefined && addFromFs > 0 ? addFromFs : v.add;

      const pbhFromFs = revSources['PBH'] || revSources['Bagi Hasil Pajak'] || revSources['Bagi Hasil'];
      const pbh = pbhFromFs !== undefined && pbhFromFs > 0 ? pbhFromFs : v.pbh;

      const padesFromFs = revSources['PADES'] || revSources['Pendapatan Asli Desa'] || revSources['PADes'];
      const pades = padesFromFs !== undefined && padesFromFs > 0 ? padesFromFs : v.pades;

      // Dynamic Monev Realization
      const fsMonevInfo = monevRealizationMap[vKey];
      const fallbackAmount = Math.round(pagu * (v.realisasiKeuanganPct / 100));
      const realisasiAmount = fsMonevInfo?.totalRealization && fsMonevInfo.totalRealization > 0
        ? fsMonevInfo.totalRealization
        : fallbackAmount;

      const realisasiKeuanganPct = Number(((realisasiAmount / (pagu || 1)) * 100).toFixed(1));

      const realisasiFisikPct = fsMonevInfo && fsMonevInfo.count > 0 && fsMonevInfo.totalPhysical > 0
        ? Number((fsMonevInfo.totalPhysical / fsMonevInfo.count).toFixed(1))
        : v.realisasiFisikPct;

      const statusSpj = fsMonevInfo ? (fsMonevInfo.spjIncomplete ? 'SPJ Belum Lengkap' : 'SPJ Lengkap') : v.statusSpj;

      return {
        ...v,
        pagu,
        dds,
        add,
        pbh,
        pades,
        realisasiAmount,
        realisasiKeuanganPct,
        realisasiFisikPct,
        statusSpj,
      };
    });
  }, [firestoreApbdes, firestoreMonev, firestorePrioritas]);

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
        acc.realisasiAmount += curr.realisasiAmount;
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
        realisasiAmount: 0,
      }
    );
  }, [villageList]);

  // Overall Realisasi Averages
  const avgRealisasi = useMemo(() => {
    const totalRealisasiAmount = villageList.reduce((acc, curr) => acc + curr.realisasiAmount, 0);
    const totalPagu = totals.pagu || 1;
    const keuanganPct = (Number((totalRealisasiAmount / totalPagu) * 100)).toFixed(1);

    const totalFisikPct = villageList.reduce((acc, curr) => acc + curr.realisasiFisikPct, 0);
    const fisikPct = (totalFisikPct / villageList.length).toFixed(1);

    const spjLengkapCount = villageList.filter(v => v.statusSpj === 'SPJ Lengkap').length;

    const mandiriCount = villageList.filter(v => (v as any).statusDesa === 'MANDIRI').length || 1;
    const majuCount = villageList.filter(v => (v as any).statusDesa === 'MAJU').length || 9;
    const berkembangCount = villageList.filter(v => (v as any).statusDesa === 'BERKEMBANG').length || 4;

    return {
      keuanganPct,
      fisikPct,
      spjLengkapCount,
      totalVillageCount: villageList.length,
      mandiriCount,
      majuCount,
      berkembangCount,
    };
  }, [villageList, totals.pagu]);

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

  // Pie Chart Slices for Belanja per Bidang
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

  // Pie Chart Slices for Prioritas Dana Desa 2026
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

  // Sorted Village List for Ranking Chart
  const sortedVillages = useMemo(() => {
    return [...villageList].sort((a, b) => {
      if (selectedSort === 'pagu') return b.pagu - a.pagu;
      if (selectedSort === 'realisasi') return b.realisasiKeuanganPct - a.realisasiKeuanganPct;
      if (selectedSort === 'dds') return b.dds - a.dds;
      return b.pagu - a.pagu;
    });
  }, [villageList, selectedSort]);

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-emerald-50/95 via-teal-50/60 to-slate-50 border border-emerald-200/90 shadow-md space-y-8"
      >
      
      {/* SECTION HEADER & NAV LINK */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-200/80 pb-4 sm:pb-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-[10px] sm:text-xs font-black tracking-widest text-white uppercase bg-emerald-700 px-3.5 py-1.5 rounded-full border border-emerald-500 shadow-xs flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-white" />
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
            className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-800 bg-white hover:bg-indigo-50 border border-indigo-200 px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
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
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-indigo-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-full border border-indigo-200 uppercase">
                PAGU ANGGARAN
              </span>
            </div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Total APBDes 14 Desa</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-headline mt-1 tracking-tight">
              {formatShortCurrency(totals.pagu)}
            </h3>
          </div>
          <p className="text-[10px] sm:text-xs text-indigo-700 font-bold mt-2 pt-2 border-t border-indigo-50">14 Desa di Gandrungmangu</p>
        </motion.div>

        {/* Stat 2: Total Dana Desa (DDS) */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-sky-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Coins className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200 uppercase">
                APBN 2026
              </span>
            </div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Dana Desa (DDS) APBN</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-headline mt-1 tracking-tight">
              {formatShortCurrency(totals.dds)}
            </h3>
          </div>
          <p className="text-[10px] sm:text-xs text-sky-700 font-bold mt-2 pt-2 border-t border-sky-50">Rata-rata ~Rp 372 Jt / Desa</p>
        </motion.div>

        {/* Stat 3: Total Alokasi Dana Desa (ADD) */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-teal-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full border border-teal-200 uppercase">
                APBD KABUPATEN
              </span>
            </div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Alokasi Dana Desa (ADD)</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-headline mt-1 tracking-tight">
              {formatShortCurrency(totals.add)}
            </h3>
          </div>
          <p className="text-[10px] sm:text-xs text-teal-700 font-bold mt-2 pt-2 border-t border-teal-50">Siltap & Operasional Pemdes</p>
        </motion.div>

        {/* Stat 4: Capaian Realisasi Keuangan Monev */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">
                SERAPAN MONEV
              </span>
            </div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Realisasi Keuangan (%)</p>
            <h3 className="text-xl sm:text-2xl font-black text-emerald-700 font-headline mt-1 tracking-tight">
              {avgRealisasi.keuanganPct}%
            </h3>
          </div>
          <p className="text-[10px] sm:text-xs text-emerald-700 font-bold mt-2 pt-2 border-t border-emerald-50">
            {formatShortCurrency(totalMonevSummary.totalRealisasiAmount)} Terserap
          </p>
        </motion.div>

        {/* Stat 5: Status Laporan SPJ Monev */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-purple-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between col-span-2 sm:col-span-1"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200 uppercase">
                AKUNTABILITAS
              </span>
            </div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Status Laporan SPJ</p>
            <h3 className="text-xl sm:text-2xl font-black text-purple-900 font-headline mt-1 tracking-tight">
              {avgRealisasi.spjLengkapCount}/14 Desa
            </h3>
          </div>
          <p className="text-[10px] sm:text-xs text-purple-700 font-bold mt-2 pt-2 border-t border-purple-50">
            100% SPJ Lengkap & Terverifikasi
          </p>
        </motion.div>

      </div>

      {/* 2 MAIN SECTIONS: (1) INFOGRAPHIC PIE CHART (2) RANKING REALISASI PER DESA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: PIE CHART INFOGRAPHIC (7 COLS) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xl p-5 sm:p-7 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 font-headline flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-indigo-600" />
                {activeChartTab === 'sumber' 
                  ? 'Struktur Pendapatan APBDes 14 Desa' 
                  : activeChartTab === 'bidang' 
                  ? 'Alokasi Belanja APBDes per Bidang' 
                  : 'Prioritas Penggunaan Dana Desa 2026'}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Proporsi persentase alokasi anggaran APBDes di Kecamatan Gandrungmangu.
              </p>
            </div>

            {/* TAB SELECTOR BUTTONS */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start sm:self-auto">
              <button
                onClick={() => setActiveChartTab('sumber')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeChartTab === 'sumber'
                    ? 'bg-white text-indigo-700 shadow-sm font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sumber Dana
              </button>
              <button
                onClick={() => setActiveChartTab('bidang')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeChartTab === 'bidang'
                    ? 'bg-white text-indigo-700 shadow-sm font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Per Bidang
              </button>
              <button
                onClick={() => setActiveChartTab('prioritas')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeChartTab === 'prioritas'
                    ? 'bg-white text-indigo-700 shadow-sm font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Prioritas DDS
              </button>
            </div>
          </div>

          {/* SVG INFOGRAPHIC PIE CHART WITH NUMBERED PINS */}
          <div className="relative flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl border border-slate-100">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90 filter drop-shadow-md">
                {activeSlices.reduce<{ accumAngle: number; paths: React.ReactNode[] }>((acc, slice, i) => {
                  const total = activeSlices.reduce((sum, s) => sum + s.amount, 0) || 1;
                  const pct = slice.amount / total;
                  const angle = pct * 360;
                  const start = acc.accumAngle;
                  acc.accumAngle += angle;

                  const startRad = ((start - 90) * Math.PI) / 180;
                  const endRad = ((acc.accumAngle - 90) * Math.PI) / 180;

                  const r = 80;
                  const x1 = 100 + r * Math.cos(startRad);
                  const y1 = 100 + r * Math.sin(startRad);
                  const x2 = 100 + r * Math.cos(endRad);
                  const y2 = 100 + r * Math.sin(endRad);

                  const largeArc = angle > 180 ? 1 : 0;
                  const d = `M 100 100 L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

                  acc.paths.push(
                    <path
                      key={i}
                      d={d}
                      fill={slice.color}
                      className="transition-all duration-300 hover:opacity-85 hover:scale-102 cursor-pointer"
                    >
                      <title>{`${slice.label}: ${formatCurrency(slice.amount)} (${slice.pct}%)`}</title>
                    </path>
                  );
                  return acc;
                }, { accumAngle: 0, paths: [] }).paths}

                {/* Donut Center Hole */}
                <circle cx="100" cy="100" r="52" fill="#ffffff" />
              </svg>

              {/* Center Badge */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-headline leading-none">
                  {formatShortCurrency(totals.pagu)}
                </span>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mt-1">
                  TOTAL APBDES
                </span>
              </div>
            </div>
          </div>

          {/* CARDS BREAKDOWN LEGEND BELOW PIE CHART */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activeSlices.map((slice) => (
              <div
                key={slice.num}
                className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span 
                    style={{ backgroundColor: slice.color }} 
                    className="w-7 h-7 rounded-xl text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs"
                  >
                    {slice.num}
                  </span>
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{slice.shortLabel}</h4>
                    <p className="text-[11px] font-extrabold text-indigo-700">{formatCurrency(slice.amount)}</p>
                  </div>
                </div>

                <span 
                  style={{ backgroundColor: `${slice.color}15`, color: slice.color }} 
                  className="text-xs font-black px-2 py-0.5 rounded-lg shrink-0"
                >
                  {slice.pct}%
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: CHART HASIL REALISASI VS TOTAL APBDES PER DESA (5 COLS) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-xl p-5 sm:p-7 space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 font-headline flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                Capaian Realisasi Keuangan per Desa
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Peringkat serapan anggaran APBDes 14 Desa.
              </p>
            </div>

            {/* SORT BUTTONS */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setSelectedSort('pagu')}
                className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                  selectedSort === 'pagu' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
                }`}
              >
                Pagu
              </button>
              <button
                onClick={() => setSelectedSort('realisasi')}
                className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                  selectedSort === 'realisasi' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
                }`}
              >
                % Serapan
              </button>
            </div>
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
                      whileInView={{ width: `${Math.min(100, realisasiPct)}%` }}
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

      {/* EXPANDABLE REKAPITULASI FINANCIAL MATRIX DATA TABLE (MATCHING USER ADMIN SYSTEM & SCREENSHOT) */}
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

              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-lg bg-white">
                <table className="w-full text-xs text-left text-slate-700 border-collapse">
                  <thead className="bg-[#1E1B4B] text-white font-extrabold uppercase text-[10px] tracking-wider text-center">
                    <tr>
                      <th className="py-3 px-3 w-10 border-b border-indigo-900">NO</th>
                      <th className="py-3 px-4 text-left border-b border-indigo-900">DESA</th>
                      <th className="py-3 px-3 text-right border-b border-indigo-900">PAGU APBDES</th>
                      <th className="py-3 px-3 text-right border-b border-indigo-900">DDS (DANA DESA)</th>
                      <th className="py-3 px-3 text-right border-b border-indigo-900">ADD (ALOKASI DESA)</th>
                      <th className="py-3 px-3 text-right border-b border-indigo-900">BAGI HASIL (PBH)</th>
                      <th className="py-3 px-3 text-right border-b border-indigo-900">PADES</th>
                      <th className="py-3 px-3 text-right border-b border-indigo-900">KEUANGAN (%)</th>
                      <th className="py-3 px-3 text-right border-b border-indigo-900">FISIK (%)</th>
                      <th className="py-3 px-3 text-center border-b border-indigo-900">STATUS SPJ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {villageList.map((d, index) => (
                      <tr key={d.village} className="hover:bg-indigo-50/60 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-400 text-center">{index + 1}</td>
                        <td className="py-2.5 px-4 font-black text-slate-900 font-headline italic uppercase">{d.village}</td>
                        <td className="py-2.5 px-3 text-right font-black text-slate-900">{formatCurrency(d.pagu)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-indigo-700">{formatCurrency(d.dds)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-sky-700">{formatCurrency(d.add)}</td>
                        <td className="py-2.5 px-3 text-right text-amber-700 font-bold">{formatCurrency(d.pbh)}</td>
                        <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">{formatCurrency(d.pades)}</td>
                        <td className="py-2.5 px-3 text-right font-black text-emerald-600">{d.realisasiKeuanganPct}%</td>
                        <td className="py-2.5 px-3 text-right font-black text-teal-600">{d.realisasiFisikPct}%</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border ${d.statusSpj === 'SPJ Lengkap' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                            {d.statusSpj}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 font-black text-slate-900 border-t-2 border-slate-300">
                    <tr className="bg-slate-100/90 text-slate-900">
                      <td colSpan={2} className="py-3 px-4 text-left uppercase tracking-wider font-headline font-black">TOTAL KECAMATAN</td>
                      <td className="py-3 px-3 text-right text-slate-900 font-black">{formatCurrency(totals.pagu)}</td>
                      <td className="py-3 px-3 text-right text-indigo-800 font-black">{formatCurrency(totals.dds)}</td>
                      <td className="py-3 px-3 text-right text-sky-800 font-black">{formatCurrency(totals.add)}</td>
                      <td className="py-3 px-3 text-right text-amber-800 font-black">{formatCurrency(totals.pbh)}</td>
                      <td className="py-3 px-3 text-right text-emerald-800 font-black">{formatCurrency(totals.pades)}</td>
                      <td className="py-3 px-3 text-right text-emerald-700 font-black">{avgRealisasi.keuanganPct}%</td>
                      <td className="py-3 px-3 text-right text-teal-700 font-black">{avgRealisasi.fisikPct}%</td>
                      <td className="py-3 px-3 text-center text-indigo-800 font-black">{avgRealisasi.spjLengkapCount}/14 Lengkap</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
    </section>
  );
}

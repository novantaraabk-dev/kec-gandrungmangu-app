'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { jalanDesaData, type JalanDesa } from '@/lib/jalan-desa-data';
import { jalanKabupatenStaticData } from '@/lib/jalan-kabupaten-data';
import type { JalanKabupaten } from '@/lib/perangkat-data';
import { 
  Map, 
  Milestone, 
  ExternalLink,
  ChevronDown,
  Search,
  FileSpreadsheet,
  Building,
  Table,
  ListFilter
} from 'lucide-react';
import Link from 'next/link';

function parseNumeric(val: any): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const cleaned = String(val).replace(/\./g, '').replace(/,/g, '').trim();
  const num = Number(cleaned);
  return isNaN(num) ? 0 : num;
}

function getItemAnggaran(item: any): number {
  if (!item) return 0;
  const val = parseNumeric(
    item.totalAnggaran ?? 
    item.anggaranPenyelesaian ?? 
    item.anggaran ?? 
    item.nominal ?? 
    item.total_anggaran ?? 
    0
  );
  if (val > 0) return val;
  
  // Fallback calculation: (sedang + rusakRingan + rusakBerat) * 1.200.000
  const sedang = parseNumeric(item.sedang ?? item.kondisiSedang);
  const rr = parseNumeric(item.rusakRingan ?? item.kondisiRusakRingan);
  const rb = parseNumeric(item.rusakBerat ?? item.kondisiRusakBerat);
  const damage = sedang + rr + rb;
  if (damage > 0) {
    return damage * 1200000;
  }
  return 0;
}

function formatCurrency(value: number) {
  if (!value) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatKm(meters: number) {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} Km`;
  }
  return `${meters.toLocaleString('id-ID')} M`;
}

const VILLAGES = [
  { id: 'all', name: 'Semua Desa (14 Desa)' },
  { id: 'bulusari', name: 'Bulusari' },
  { id: 'cinangsi', name: 'Cinangsi' },
  { id: 'cisumur', name: 'Cisumur' },
  { id: 'gandrungmangu', name: 'Gandrungmangu' },
  { id: 'gandrungmanis', name: 'Gandrungmanis' },
  { id: 'gintungreja', name: 'Gintungreja' },
  { id: 'karanganyar', name: 'Karanganyar' },
  { id: 'karanggintung', name: 'Karanggintung' },
  { id: 'kertajaya', name: 'Kertajaya' },
  { id: 'layansari', name: 'Layansari' },
  { id: 'muktisari', name: 'Muktisari' },
  { id: 'rungkang', name: 'Rungkang' },
  { id: 'sidaurip', name: 'Sidaurip' },
  { id: 'wringinharjo', name: 'Wringinharjo' },
];

export function RoadAnalyticsSection() {
  const firestore = useFirestore();

  // Village Filter State for Jalan Desa & Jalan Kabupaten
  const [selectedDesa, setSelectedDesa] = useState<string>('all');
  const [selectedDesaKabupaten, setSelectedDesaKabupaten] = useState<string>('all');

  // Table Sub-View Mode for Jalan Desa (rekap vs rincian)
  const [tableSubViewJalanDesa, setTableSubViewJalanDesa] = useState<'rekap' | 'rincian'>('rekap');

  // Collapsible Table States
  const [showTableJalanDesa, setShowTableJalanDesa] = useState(false);
  const [showTableJalanKabupaten, setShowTableJalanKabupaten] = useState(false);
  const [searchJalanDesa, setSearchJalanDesa] = useState('');
  const [searchJalanKabupaten, setSearchJalanKabupaten] = useState('');

  // Firestore Queries
  const jalanDesaQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'jalanDesa');
  }, [firestore]);

  const jalanKabupatenQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'jalanKabupaten');
  }, [firestore]);

  const { data: firestoreJalanDesa } = useCollection<JalanDesa>(jalanDesaQuery);
  const { data: firestoreJalanKabupaten } = useCollection<JalanKabupaten>(jalanKabupatenQuery);

  // Combine static + firestore data for Jalan Desa
  const allJalanDesaList: JalanDesa[] = useMemo(() => {
    if (firestoreJalanDesa && firestoreJalanDesa.length > 0) {
      return firestoreJalanDesa;
    }
    // Fallback to static dataset
    const staticList: JalanDesa[] = [];
    Object.keys(jalanDesaData).forEach((vKey) => {
      staticList.push(...jalanDesaData[vKey]);
    });
    return staticList;
  }, [firestoreJalanDesa]);

  // Filtered Jalan Desa dataset by Selected Village Tab
  const activeJalanDesaList = useMemo(() => {
    if (selectedDesa === 'all') {
      return allJalanDesaList;
    }
    return allJalanDesaList.filter(
      (item) => item.village?.toLowerCase().trim() === selectedDesa.toLowerCase().trim()
    );
  }, [allJalanDesaList, selectedDesa]);

  // Jalan Kabupaten Data (Merge Firestore with Static Data so all 23 items retain full condition numbers)
  const allJalanKabupatenList: any[] = useMemo(() => {
    if (!firestoreJalanKabupaten || firestoreJalanKabupaten.length === 0) {
      return jalanKabupatenStaticData;
    }

    return jalanKabupatenStaticData.map((staticItem) => {
      const fsItem = firestoreJalanKabupaten.find(
        (f: any) => String(f.noRuas) === String(staticItem.noRuas) || f.id === staticItem.id
      );
      if (!fsItem) return staticItem;

      const baik = parseNumeric((fsItem as any).kondisiBaik ?? (fsItem as any).baik);
      const sedang = parseNumeric((fsItem as any).kondisiSedang ?? (fsItem as any).sedang);
      const rr = parseNumeric((fsItem as any).kondisiRusakRingan ?? (fsItem as any).rusakRingan);
      const rb = parseNumeric((fsItem as any).kondisiRusakBerat ?? (fsItem as any).rusakBerat);

      const hasFsConditions = (baik + sedang + rr + rb) > 0;

      return {
        ...staticItem,
        ...fsItem,
        kondisiBaik: hasFsConditions ? baik : staticItem.kondisiBaik,
        kondisiSedang: hasFsConditions ? sedang : staticItem.kondisiSedang,
        kondisiRusakRingan: hasFsConditions ? rr : staticItem.kondisiRusakRingan,
        kondisiRusakBerat: hasFsConditions ? rb : staticItem.kondisiRusakBerat,
        panjangKm: (fsItem as any).panjangKm || staticItem.panjangKm,
        panjangRuas: (fsItem as any).panjangRuas || staticItem.panjangRuas,
        lebarRuas: (fsItem as any).lebarRuas || staticItem.lebarRuas,
        paguUsulan2026: (fsItem as any).paguUsulan2026 || (fsItem as any).paguUsulan || staticItem.paguUsulan2026,
        usulanMusren: (fsItem as any).usulanMusren || staticItem.usulanMusren,
        usulanDesa: (fsItem as any).usulanDesa || staticItem.usulanDesa,
        sisaVolume: (fsItem as any).sisaVolume || staticItem.sisaVolume,
      };
    });
  }, [firestoreJalanKabupaten]);

  // Filtered Jalan Kabupaten dataset by Selected Village Tab
  const activeJalanKabupatenList = useMemo(() => {
    if (selectedDesaKabupaten === 'all') {
      return allJalanKabupatenList;
    }
    const q = selectedDesaKabupaten.toLowerCase().trim();
    return allJalanKabupatenList.filter((item) => {
      const v = item.village?.toLowerCase().trim() || '';
      const name = item.namaRuas?.toLowerCase() || '';
      const usulan = (item.usulanMusren || '').toLowerCase() + ' ' + (item.usulanDesa || '').toLowerCase();
      const pangkal = (item.pangkalRuas || '').toLowerCase();
      const ujung = (item.ujungRuas || '').toLowerCase();

      return (
        v === q ||
        name.includes(q) ||
        usulan.includes(q) ||
        pangkal.includes(q) ||
        ujung.includes(q)
      );
    });
  }, [allJalanKabupatenList, selectedDesaKabupaten]);

  // 1. Aggregated Stats for Jalan Desa (based on selected Village Tab)
  const statsJalanDesa = useMemo(() => {
    let totalPanjang = 0;
    let totalBaik = 0;
    let totalSedang = 0;
    let totalRusakRingan = 0;
    let totalRusakBerat = 0;
    let totalAnggaran = 0;
    let totalRuas = activeJalanDesaList.length;

    activeJalanDesaList.forEach((j) => {
      totalPanjang += parseNumeric(j.panjang);
      totalBaik += parseNumeric(j.baik);
      totalSedang += parseNumeric(j.sedang);
      totalRusakRingan += parseNumeric(j.rusakRingan);
      totalRusakBerat += parseNumeric(j.rusakBerat);
      totalAnggaran += getItemAnggaran(j);
    });

    const totalRusak = totalRusakRingan + totalRusakBerat;

    return {
      totalRuas,
      totalPanjang,
      totalBaik,
      totalSedang,
      totalRusakRingan,
      totalRusakBerat,
      totalRusak,
      totalAnggaran,
    };
  }, [activeJalanDesaList]);

  // 2. Aggregated Summary per Village (14 Desa)
  const rekapDesaTable = useMemo(() => {
    const map: {
      [key: string]: {
        village: string;
        ruasCount: number;
        panjang: number;
        baik: number;
        sedang: number;
        rusakRingan: number;
        rusakBerat: number;
        totalAnggaran: number;
      };
    } = {};

    allJalanDesaList.forEach((j) => {
      const vKey = (j.village || 'lainnya').toLowerCase().trim();
      if (!map[vKey]) {
        map[vKey] = {
          village: vKey,
          ruasCount: 0,
          panjang: 0,
          baik: 0,
          sedang: 0,
          rusakRingan: 0,
          rusakBerat: 0,
          totalAnggaran: 0,
        };
      }
      map[vKey].ruasCount += 1;
      map[vKey].panjang += parseNumeric(j.panjang);
      map[vKey].baik += parseNumeric(j.baik);
      map[vKey].sedang += parseNumeric(j.sedang);
      map[vKey].rusakRingan += parseNumeric(j.rusakRingan);
      map[vKey].rusakBerat += parseNumeric(j.rusakBerat);
      map[vKey].totalAnggaran += getItemAnggaran(j);
    });

    return Object.values(map).sort((a, b) => a.village.localeCompare(b.village));
  }, [allJalanDesaList]);

  // 3. Aggregated Stats for Jalan Kabupaten (Separating Physical Requirement vs Musrenbangkec 2026)
  const statsJalanKabupaten = useMemo(() => {
    let totalPanjang = 0;
    let totalBaik = 0;
    let totalSedang = 0;
    let totalRusakRingan = 0;
    let totalRusakBerat = 0;
    let totalKebutuhanFisik = 0;
    let totalUsulanMusren2026 = 0;
    let totalUsulanCount = 0;
    let totalRuas = activeJalanKabupatenList.length;

    activeJalanKabupatenList.forEach((j: any) => {
      const baik = Number(j.kondisiBaik) || 0;
      const sedang = Number(j.kondisiSedang) || 0;
      const rr = Number(j.kondisiRusakRingan) || 0;
      const rb = Number(j.kondisiRusakBerat) || 0;
      const p = Number(j.panjangRuas) || (baik + sedang + rr + rb);
      const damage = sedang + rr + rb;
      const keb = damage * 2000000;
      const usulan = Number(j.paguUsulan2026 ?? j.paguUsulan ?? 0);

      totalPanjang += p;
      totalBaik += baik;
      totalSedang += sedang;
      totalRusakRingan += rr;
      totalRusakBerat += rb;
      totalKebutuhanFisik += keb;
      totalUsulanMusren2026 += usulan;
      if (j.usulanDesa || j.usulanMusren || usulan > 0) totalUsulanCount++;
    });

    const totalRusak = totalSedang + totalRusakRingan + totalRusakBerat;

    return {
      totalRuas,
      totalPanjang,
      totalBaik,
      totalSedang,
      totalRusakRingan,
      totalRusakBerat,
      totalRusak,
      totalKebutuhanFisik,
      totalUsulanMusren2026,
      totalUsulanCount,
    };
  }, [activeJalanKabupatenList]);

  // Filtered Jalan Desa Items for Table (filtered by Tab & Search)
  const filteredJalanDesa = useMemo(() => {
    return activeJalanDesaList.filter((item) => {
      const q = searchJalanDesa.toLowerCase();
      return (
        item.namaJalan?.toLowerCase().includes(q) ||
        item.village?.toLowerCase().includes(q) ||
        item.jenisPerkerasan?.toLowerCase().includes(q) ||
        item.pangkal?.toLowerCase().includes(q) ||
        item.ujung?.toLowerCase().includes(q)
      );
    });
  }, [activeJalanDesaList, searchJalanDesa]);

  // Filtered Jalan Kabupaten Items for Table (filtered by Tab & Search)
  const filteredJalanKabupaten = useMemo(() => {
    return activeJalanKabupatenList.filter((item) => {
      const q = searchJalanKabupaten.toLowerCase();
      return (
        item.namaRuas?.toLowerCase().includes(q) ||
        item.noRuas?.toString().includes(q) ||
        item.pangkalRuas?.toLowerCase().includes(q) ||
        item.ujungRuas?.toLowerCase().includes(q)
      );
    });
  }, [activeJalanKabupatenList, searchJalanKabupaten]);

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-8">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold tracking-widest text-indigo-700 uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 flex items-center gap-1.5">
              <Milestone className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              Infrastruktur Jalan Kecamatan
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-headline text-slate-900 tracking-tight">
            Analisis Data Jalan Desa & Jalan Kabupaten
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mt-1">
            Panel data fisik terpisah untuk Jalan Desa dan Jalan Kabupaten di Kecamatan Gandrungmangu.
          </p>
        </div>

        {/* SUMMARY BADGE */}
        <motion.div 
          whileHover={{ scale: 1.03 }}
          className="flex items-center gap-2 text-xs font-semibold bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          <span className="text-indigo-700 font-bold">Total Gabungan: {formatKm(statsJalanDesa.totalPanjang + statsJalanKabupaten.totalPanjang)}</span>
        </motion.div>
      </div>

      {/* 2 SEPARATE DEDICATED CARDS (DATA JALAN DESA & DATA JALAN KABUPATEN) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* ==================================================================== */}
        {/* KARTU 1: DATA JALAN DESA */}
        {/* ==================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-indigo-50/90 via-purple-50/40 to-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-indigo-200/90 shadow-xl shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between space-y-4 sm:space-y-6"
        >
          <div className="space-y-4 sm:space-y-6">
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-indigo-100 pb-3 sm:pb-4 gap-2">
              <div className="flex items-center gap-3">
                <motion.div 
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/30 transition-all"
                >
                  <Map className="w-5 h-5" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 font-headline">Data Jalan Desa</h3>
                  <p className="text-xs font-bold text-indigo-600">/public/jalan-desa</p>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/public/jalan-desa"
                  className="inline-flex items-center gap-1 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-500/25 self-start sm:self-auto"
                >
                  <span>Kelola Jalan Desa</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            </div>

            {/* VILLAGE SELECTION TAB BAR JALAN DESA */}
            <div className="space-y-1.5 bg-indigo-100/40 p-2.5 rounded-2xl border border-indigo-200/80">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                <span className="flex items-center gap-1.5 text-indigo-900 font-extrabold">
                  <Building className="w-3.5 h-3.5 text-indigo-600" />
                  Filter Tampilan Desa (Jalan Desa):
                </span>
                {selectedDesa !== 'all' && (
                  <button 
                    onClick={() => setSelectedDesa('all')} 
                    className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 underline transition-all"
                  >
                    Tampilkan Semua Desa
                  </button>
                )}
              </div>

              {/* Wrapped 2-3 Rows Village Tabs Grid */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {VILLAGES.map((v) => {
                  const isActive = selectedDesa === v.id;
                  return (
                    <button
                      key={`jd-tab-${v.id}`}
                      onClick={() => setSelectedDesa(v.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-500/30 scale-[1.02]'
                          : 'bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 border border-indigo-200/80'
                      }`}
                    >
                      {v.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Animated KPI Stats Grid Jalan Desa */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* 1. Total Ruas */}
              <motion.div 
                whileHover={{ scale: 1.03, y: -2 }}
                className="bg-gradient-to-br from-indigo-100/90 via-indigo-50 to-white p-3.5 rounded-2xl border border-indigo-200/90 transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Total Ruas Jalan</p>
                <p className="text-xl sm:text-2xl font-black text-indigo-700 font-headline mt-0.5">{statsJalanDesa.totalRuas} <span className="text-xs font-bold text-indigo-600">Ruas</span></p>
                <p className="text-[10px] text-indigo-600 font-bold mt-1">
                  {selectedDesa === 'all' ? '14 Desa Terdaftar' : `Desa ${VILLAGES.find(v => v.id === selectedDesa)?.name}`}
                </p>
              </motion.div>

              {/* 2. Total Panjang */}
              <motion.div 
                whileHover={{ scale: 1.03, y: -2 }}
                className="bg-gradient-to-br from-blue-100/90 via-blue-50 to-white p-3.5 rounded-2xl border border-blue-200/90 transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Total Panjang</p>
                <p className="text-xl sm:text-2xl font-black text-blue-700 font-headline mt-0.5">{formatKm(statsJalanDesa.totalPanjang)}</p>
                <p className="text-[10px] text-blue-600 font-bold mt-1 truncate" title={`Baik: ${formatKm(statsJalanDesa.totalBaik)} | Sedang: ${formatKm(statsJalanDesa.totalSedang)}`}>
                  Baik: {formatKm(statsJalanDesa.totalBaik)} | Sedang: {formatKm(statsJalanDesa.totalSedang)}
                </p>
              </motion.div>

              {/* 3. Total Kerusakan */}
              <motion.div 
                whileHover={{ scale: 1.03, y: -2 }}
                className="bg-gradient-to-br from-rose-100/90 via-rose-50 to-white p-3.5 rounded-2xl border border-rose-200/90 transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Total Kerusakan</p>
                <p className="text-xl sm:text-2xl font-black text-rose-700 font-headline mt-0.5">{formatKm(statsJalanDesa.totalRusak)}</p>
                <p className="text-[10px] text-rose-600 font-bold mt-1">
                  {((statsJalanDesa.totalRusak / (statsJalanDesa.totalPanjang || 1)) * 100).toFixed(1)}% Butuh Penanganan
                </p>
              </motion.div>

              {/* 4. Nominal Kebutuhan Anggaran */}
              <motion.div 
                whileHover={{ scale: 1.03, y: -2 }}
                className="bg-gradient-to-br from-purple-100/90 via-purple-50 to-white p-3.5 rounded-2xl border border-purple-200/90 transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Nominal Kebutuhan</p>
                <p className="text-lg sm:text-xl font-black text-purple-800 font-headline mt-0.5 truncate" title={formatCurrency(statsJalanDesa.totalAnggaran)}>
                  {formatCurrency(statsJalanDesa.totalAnggaran)}
                </p>
                <p className="text-[10px] text-purple-600 font-bold mt-1">Total Anggaran Penyelesaian</p>
              </motion.div>

            </div>

            {/* Kartu Kecil-Kecil Total Kondisi Fisik (Meter) Jalan Desa */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <motion.div 
                whileHover={{ scale: 1.02, y: -1 }}
                className="bg-emerald-50/90 p-2.5 rounded-xl border border-emerald-200 flex flex-col justify-between shadow-2xs"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shadow-xs" />
                  <span>BAIK</span>
                </div>
                <p className="text-sm font-black text-emerald-950 font-mono mt-1">
                  {statsJalanDesa.totalBaik.toLocaleString('id-ID')} <span className="text-[10px] font-bold text-emerald-700">M</span>
                </p>
                <p className="text-[9px] font-bold text-emerald-700 mt-0.5">({formatKm(statsJalanDesa.totalBaik)})</p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02, y: -1 }}
                className="bg-sky-50/90 p-2.5 rounded-xl border border-sky-200 flex flex-col justify-between shadow-2xs"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-sky-800 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-sky-500 shadow-xs" />
                  <span>SEDANG</span>
                </div>
                <p className="text-sm font-black text-sky-950 font-mono mt-1">
                  {statsJalanDesa.totalSedang.toLocaleString('id-ID')} <span className="text-[10px] font-bold text-sky-700">M</span>
                </p>
                <p className="text-[9px] font-bold text-sky-700 mt-0.5">({formatKm(statsJalanDesa.totalSedang)})</p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02, y: -1 }}
                className="bg-amber-50/90 p-2.5 rounded-xl border border-amber-200 flex flex-col justify-between shadow-2xs"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-amber-900 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shadow-xs" />
                  <span>R. RINGAN</span>
                </div>
                <p className="text-sm font-black text-amber-950 font-mono mt-1">
                  {statsJalanDesa.totalRusakRingan.toLocaleString('id-ID')} <span className="text-[10px] font-bold text-amber-800">M</span>
                </p>
                <p className="text-[9px] font-bold text-amber-800 mt-0.5">({formatKm(statsJalanDesa.totalRusakRingan)})</p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02, y: -1 }}
                className="bg-rose-50/90 p-2.5 rounded-xl border border-rose-200 flex flex-col justify-between shadow-2xs"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-rose-800 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-rose-600 shadow-xs" />
                  <span>R. BERAT</span>
                </div>
                <p className="text-sm font-black text-rose-950 font-mono mt-1">
                  {statsJalanDesa.totalRusakBerat.toLocaleString('id-ID')} <span className="text-[10px] font-bold text-rose-700">M</span>
                </p>
                <p className="text-[9px] font-bold text-rose-700 mt-0.5">({formatKm(statsJalanDesa.totalRusakBerat)})</p>
              </motion.div>
            </div>

            {/* Animated Stacked Progress Bar Jalan Desa */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Grafik Kondisi Fisik Jalan Desa</span>
                <span className="text-indigo-600 font-extrabold">100% Proporsi</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden flex border border-indigo-200/80 p-0.5 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(statsJalanDesa.totalBaik / (statsJalanDesa.totalPanjang || 1)) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="bg-emerald-500 h-full rounded-l-full transition-all hover:bg-emerald-600"
                  title={`Baik: ${formatKm(statsJalanDesa.totalBaik)}`}
                />
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(statsJalanDesa.totalSedang / (statsJalanDesa.totalPanjang || 1)) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
                  className="bg-sky-400 h-full transition-all hover:bg-sky-500"
                  title={`Sedang: ${formatKm(statsJalanDesa.totalSedang)}`}
                />
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(statsJalanDesa.totalRusakRingan / (statsJalanDesa.totalPanjang || 1)) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
                  className="bg-amber-400 h-full transition-all hover:bg-amber-500"
                  title={`Rusak Ringan: ${formatKm(statsJalanDesa.totalRusakRingan)}`}
                />
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(statsJalanDesa.totalRusakBerat / (statsJalanDesa.totalPanjang || 1)) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.45, ease: "easeOut" }}
                  className="bg-rose-500 h-full rounded-r-full transition-all hover:bg-rose-600"
                  title={`Rusak Berat: ${formatKm(statsJalanDesa.totalRusakBerat)}`}
                />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-600 pt-1 font-semibold">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" /> Baik ({formatKm(statsJalanDesa.totalBaik)})</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-sm" /> Sedang ({formatKm(statsJalanDesa.totalSedang)})</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" /> Rusak Ringan ({formatKm(statsJalanDesa.totalRusakRingan)})</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" /> Rusak Berat ({formatKm(statsJalanDesa.totalRusakBerat)})</span>
              </div>
            </div>
          </div>

          {/* HIDDEN ACCORDION TABLE FOR JALAN DESA */}
          <div className="border-t border-indigo-100 pt-3">
            <button
              onClick={() => setShowTableJalanDesa(!showTableJalanDesa)}
              className="w-full py-2.5 px-3.5 rounded-xl bg-white border border-indigo-200 text-indigo-900 hover:bg-indigo-50/80 font-extrabold text-xs flex items-center justify-between transition-all cursor-pointer shadow-2xs group"
            >
              <span className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                <span>Rincian Lengkap Jalan Desa ({statsJalanDesa.totalRuas} Ruas)</span>
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-indigo-700">
                <span>{showTableJalanDesa ? 'Sembunyikan' : 'Tampilkan'}</span>
                <div className={`w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center transition-transform duration-300 ${showTableJalanDesa ? 'rotate-180 bg-indigo-600 text-white' : ''}`}>
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </span>
            </button>

            <AnimatePresence>
              {showTableJalanDesa && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 space-y-3"
                >
                  {/* SUB-TAB TOGGLE (Rekap Total per Desa VS Rincian per Ruas) */}
                  <div className="flex items-center justify-between gap-2 bg-indigo-50 p-1 rounded-xl border border-indigo-200">
                    <div className="flex items-center gap-1 w-full">
                      <button
                        onClick={() => setTableSubViewJalanDesa('rekap')}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          tableSubViewJalanDesa === 'rekap'
                            ? 'bg-white text-indigo-900 shadow-xs border border-indigo-200/80'
                            : 'text-indigo-700 hover:text-indigo-900'
                        }`}
                      >
                        <Table className="w-3.5 h-3.5" />
                        <span>Rekap Total per Desa (14 Desa)</span>
                      </button>
                      <button
                        onClick={() => setTableSubViewJalanDesa('rincian')}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          tableSubViewJalanDesa === 'rincian'
                            ? 'bg-white text-indigo-900 shadow-xs border border-indigo-200/80'
                            : 'text-indigo-700 hover:text-indigo-900'
                        }`}
                      >
                        <ListFilter className="w-3.5 h-3.5" />
                        <span>Rincian Ruas Jalan ({filteredJalanDesa.length} Ruas)</span>
                      </button>
                    </div>
                  </div>

                  {/* VIEW 1: REKAPITULASI TOTAL PER DESA (14 DESA) */}
                  {tableSubViewJalanDesa === 'rekap' && (
                    <div className="overflow-x-auto rounded-xl border border-indigo-200 max-h-96 overflow-y-auto bg-white shadow-xs">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-indigo-50 text-indigo-900 font-extrabold uppercase tracking-wider text-[9px] sticky top-0 border-b border-indigo-200 z-10">
                          <tr>
                            <th className="p-2 text-center">No</th>
                            <th className="p-2">Nama Desa</th>
                            <th className="p-2 text-center">Jumlah Ruas</th>
                            <th className="p-2 text-center">Total Panjang</th>
                            <th className="p-2 text-center">Baik (M)</th>
                            <th className="p-2 text-center">Sedang (M)</th>
                            <th className="p-2 text-center">R.Ringan (M)</th>
                            <th className="p-2 text-center">R.Berat (M)</th>
                            <th className="p-2 text-right">Total Anggaran Penyelesaian</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-indigo-100 font-medium text-slate-700">
                          {rekapDesaTable.map((item, idx) => (
                            <tr 
                              key={item.village} 
                              onClick={() => setSelectedDesa(item.village)}
                              className={`hover:bg-indigo-50/60 transition-colors cursor-pointer ${selectedDesa === item.village ? 'bg-indigo-50/80 font-bold' : ''}`}
                            >
                              <td className="p-2 text-center font-mono text-slate-400">{idx + 1}</td>
                              <td className="p-2 capitalize font-bold text-indigo-950 flex items-center gap-1.5">
                                <span>{item.village}</span>
                                {selectedDesa === item.village && (
                                  <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.2 rounded-md">Aktif</span>
                                )}
                              </td>
                              <td className="p-2 text-center font-mono font-bold text-indigo-700">{item.ruasCount} Ruas</td>
                              <td className="p-2 text-center font-mono font-bold text-slate-900">{formatKm(item.panjang)}</td>
                              <td className="p-2 text-center font-mono text-emerald-700 font-bold">{item.baik > 0 ? `${item.baik.toLocaleString('id-ID')} M` : '-'}</td>
                              <td className="p-2 text-center font-mono text-sky-700 font-bold">{item.sedang > 0 ? `${item.sedang.toLocaleString('id-ID')} M` : '-'}</td>
                              <td className="p-2 text-center font-mono text-amber-700 font-bold">{item.rusakRingan > 0 ? `${item.rusakRingan.toLocaleString('id-ID')} M` : '-'}</td>
                              <td className="p-2 text-center font-mono text-rose-700 font-bold">{item.rusakBerat > 0 ? `${item.rusakBerat.toLocaleString('id-ID')} M` : '-'}</td>
                              <td className="p-2 text-right font-bold text-purple-800 font-headline bg-purple-50/50">
                                {formatCurrency(item.totalAnggaran)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-indigo-100/80 text-indigo-950 font-extrabold text-[11px] sticky bottom-0 border-t border-indigo-200">
                          <tr>
                            <td colSpan={2} className="p-2.5 text-center uppercase tracking-wider">TOTAL AKUMULASI (14 DESA)</td>
                            <td className="p-2.5 text-center font-mono">{statsJalanDesa.totalRuas} Ruas</td>
                            <td className="p-2.5 text-center font-mono">{formatKm(statsJalanDesa.totalPanjang)}</td>
                            <td className="p-2.5 text-center font-mono text-emerald-800">{statsJalanDesa.totalBaik.toLocaleString('id-ID')} M</td>
                            <td className="p-2.5 text-center font-mono text-sky-800">{statsJalanDesa.totalSedang.toLocaleString('id-ID')} M</td>
                            <td className="p-2.5 text-center font-mono text-amber-800">{statsJalanDesa.totalRusakRingan.toLocaleString('id-ID')} M</td>
                            <td className="p-2.5 text-center font-mono text-rose-800">{statsJalanDesa.totalRusakBerat.toLocaleString('id-ID')} M</td>
                            <td className="p-2.5 text-right font-bold text-purple-900 font-headline bg-purple-100">
                              {formatCurrency(statsJalanDesa.totalAnggaran)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}

                  {/* VIEW 2: RINCIAN PER RUAS JALAN DESA (366 RUAS) */}
                  {tableSubViewJalanDesa === 'rincian' && (
                    <div className="space-y-3">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Cari jalan desa / perkerasan / pangkal..."
                          value={searchJalanDesa}
                          onChange={(e) => setSearchJalanDesa(e.target.value)}
                          className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                        />
                      </div>

                      <div className="overflow-x-auto rounded-xl border border-indigo-200 max-h-96 overflow-y-auto bg-white shadow-xs">
                        <table className="w-full text-left text-[11px]">
                          <thead className="bg-indigo-50 text-indigo-900 font-extrabold uppercase tracking-wider text-[9px] sticky top-0 border-b border-indigo-200 z-10">
                            <tr>
                              <th className="p-2 text-center">No</th>
                              <th className="p-2">Desa</th>
                              <th className="p-2">Nama Jalan</th>
                              <th className="p-2 text-center">Panjang</th>
                              <th className="p-2 text-center">Lebar</th>
                              <th className="p-2">Perkerasan</th>
                              <th className="p-2 text-center">Baik</th>
                              <th className="p-2 text-center">Sedang</th>
                              <th className="p-2 text-center">R.Ringan</th>
                              <th className="p-2 text-center">R.Berat</th>
                              <th className="p-2 text-right">Nominal Anggaran</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-indigo-100 font-medium text-slate-700">
                            {filteredJalanDesa.length > 0 ? (
                              filteredJalanDesa.map((item, idx) => (
                                <tr key={`${item.id}-${idx}`} className="hover:bg-indigo-50/50">
                                  <td className="p-2 text-center font-mono text-slate-400">{idx + 1}</td>
                                  <td className="p-2 capitalize font-bold text-indigo-950">{item.village}</td>
                                  <td className="p-2 font-bold text-slate-900">{item.namaJalan}</td>
                                  <td className="p-2 text-center font-mono font-bold">{parseNumeric(item.panjang).toLocaleString('id-ID')} M</td>
                                  <td className="p-2 text-center font-mono">{item.lebar ? `${item.lebar} M` : '-'}</td>
                                  <td className="p-2">
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                                      {item.jenisPerkerasan || 'Rabat'}
                                    </span>
                                  </td>
                                  <td className="p-2 text-center font-mono text-emerald-700 font-bold">{parseNumeric(item.baik) > 0 ? `${parseNumeric(item.baik)} M` : '-'}</td>
                                  <td className="p-2 text-center font-mono text-sky-700 font-bold">{parseNumeric(item.sedang) > 0 ? `${parseNumeric(item.sedang)} M` : '-'}</td>
                                  <td className="p-2 text-center font-mono text-amber-700 font-bold">{parseNumeric(item.rusakRingan) > 0 ? `${parseNumeric(item.rusakRingan)} M` : '-'}</td>
                                  <td className="p-2 text-center font-mono text-rose-700 font-bold">{parseNumeric(item.rusakBerat) > 0 ? `${parseNumeric(item.rusakBerat)} M` : '-'}</td>
                                  <td className="p-2 text-right font-bold text-purple-700 font-headline">
                                    {getItemAnggaran(item) > 0 ? formatCurrency(getItemAnggaran(item)) : 'Rp 0'}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={11} className="p-6 text-center text-slate-400">
                                  Tidak ada data jalan desa yang cocok.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </motion.div>

        {/* ==================================================================== */}
        {/* KARTU 2: DATA JALAN KABUPATEN */}
        {/* ==================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-sky-50/90 via-cyan-50/40 to-white rounded-3xl p-4 sm:p-7 border border-sky-200/90 shadow-xl shadow-sky-500/10 transition-all duration-300 flex flex-col justify-between space-y-4 sm:space-y-6"
        >
          <div className="space-y-4 sm:space-y-6">
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sky-100 pb-3 sm:pb-4 gap-2">
              <div className="flex items-center gap-3">
                <motion.div 
                  whileHover={{ rotate: -12, scale: 1.1 }}
                  className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white flex items-center justify-center font-bold shadow-lg shadow-sky-500/30 transition-all"
                >
                  <Milestone className="w-5 h-5" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 font-headline">Data Jalan Kabupaten</h3>
                  <p className="text-xs font-bold text-sky-600">/public</p>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/public"
                  className="inline-flex items-center gap-1 text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 px-4 py-2 rounded-xl transition-all shadow-md shadow-sky-500/25 self-start sm:self-auto"
                >
                  <span>Kelola Jalan Kabupaten</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            </div>

            {/* VILLAGE SELECTION TAB BAR JALAN KABUPATEN */}
            <div className="space-y-1.5 bg-sky-100/40 p-2.5 rounded-2xl border border-sky-200/80">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                <span className="flex items-center gap-1.5 text-sky-900 font-extrabold">
                  <Building className="w-3.5 h-3.5 text-sky-600" />
                  Filter Tampilan Desa (Jalan Kabupaten):
                </span>
                {selectedDesaKabupaten !== 'all' && (
                  <button 
                    onClick={() => setSelectedDesaKabupaten('all')} 
                    className="text-[11px] font-bold text-sky-700 hover:text-sky-900 underline transition-all"
                  >
                    Tampilkan Semua Desa
                  </button>
                )}
              </div>

              {/* Wrapped 2-3 Rows Village Tabs Grid */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {VILLAGES.map((v) => {
                  const isActive = selectedDesaKabupaten === v.id;
                  return (
                    <button
                      key={`jk-tab-${v.id}`}
                      onClick={() => setSelectedDesaKabupaten(v.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-sm shadow-sky-500/30 scale-[1.02]'
                          : 'bg-white text-slate-700 hover:bg-sky-50 hover:text-sky-900 border border-sky-200/80'
                      }`}
                    >
                      {v.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Animated KPI Stats Grid Jalan Kabupaten (Separating Physical Need vs Musrenbangkec 2026) */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* 1. Total Ruas Utama */}
              <motion.div 
                whileHover={{ scale: 1.03, y: -2 }}
                className="bg-gradient-to-br from-sky-100/90 via-sky-50 to-white p-3.5 rounded-2xl border border-sky-200/90 transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Total Ruas Utama</p>
                <p className="text-xl sm:text-2xl font-black text-sky-700 font-headline mt-0.5">{statsJalanKabupaten.totalRuas} <span className="text-xs font-bold text-sky-600">Ruas</span></p>
                <p className="text-[10px] text-sky-600 font-bold mt-1">
                  {selectedDesaKabupaten === 'all' ? 'Status Jalan Kabupaten' : `Desa ${VILLAGES.find(v => v.id === selectedDesaKabupaten)?.name}`}
                </p>
              </motion.div>

              {/* 2. Total Panjang */}
              <motion.div 
                whileHover={{ scale: 1.03, y: -2 }}
                className="bg-gradient-to-br from-cyan-100/90 via-cyan-50 to-white p-3.5 rounded-2xl border border-cyan-200/90 transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Total Panjang</p>
                <p className="text-xl sm:text-2xl font-black text-cyan-700 font-headline mt-0.5">{formatKm(statsJalanKabupaten.totalPanjang)}</p>
                <p className="text-[10px] text-cyan-600 font-bold mt-1">
                  Baik: {formatKm(statsJalanKabupaten.totalBaik)} | Sedang: {formatKm(statsJalanKabupaten.totalSedang)}
                </p>
              </motion.div>

              {/* 3. Estimasi Kebutuhan Penanganan Fisik */}
              <motion.div 
                whileHover={{ scale: 1.03, y: -2 }}
                className="bg-gradient-to-br from-rose-100/90 via-rose-50 to-white p-3.5 rounded-2xl border border-rose-200/90 transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Estimasi Kebutuhan Fisik</p>
                <p className="text-lg sm:text-xl font-black text-rose-700 font-headline mt-0.5 truncate" title={formatCurrency(statsJalanKabupaten.totalKebutuhanFisik)}>
                  {formatCurrency(statsJalanKabupaten.totalKebutuhanFisik)}
                </p>
                <p className="text-[10px] text-rose-600 font-bold mt-1">
                  Perbaikan {formatKm(statsJalanKabupaten.totalRusak)} Kerusakan
                </p>
              </motion.div>

              {/* 4. Nominal Usulan Musrenbangkec 2026 */}
              <motion.div 
                whileHover={{ scale: 1.03, y: -2 }}
                className="bg-gradient-to-br from-indigo-100/90 via-indigo-50 to-white p-3.5 rounded-2xl border border-indigo-200/90 transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Usulan Musrenbangkec 2026</p>
                <p className="text-lg sm:text-xl font-black text-indigo-800 font-headline mt-0.5 truncate" title={formatCurrency(statsJalanKabupaten.totalUsulanMusren2026)}>
                  {formatCurrency(statsJalanKabupaten.totalUsulanMusren2026)}
                </p>
                <p className="text-[10px] text-indigo-600 font-bold mt-1">Usulan RKPD Tahun 2026</p>
              </motion.div>

            </div>

            {/* Kartu Kecil-Kecil Total Kondisi Fisik (Meter) Jalan Kabupaten */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <motion.div 
                whileHover={{ scale: 1.02, y: -1 }}
                className="bg-emerald-50/90 p-2.5 rounded-xl border border-emerald-200 flex flex-col justify-between shadow-2xs"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shadow-xs" />
                  <span>BAIK</span>
                </div>
                <p className="text-sm font-black text-emerald-950 font-mono mt-1">
                  {statsJalanKabupaten.totalBaik.toLocaleString('id-ID')} <span className="text-[10px] font-bold text-emerald-700">M</span>
                </p>
                <p className="text-[9px] font-bold text-emerald-700 mt-0.5">({formatKm(statsJalanKabupaten.totalBaik)})</p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02, y: -1 }}
                className="bg-yellow-50/90 p-2.5 rounded-xl border border-yellow-300 flex flex-col justify-between shadow-2xs"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-yellow-950 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-xs" />
                  <span>SEDANG</span>
                </div>
                <p className="text-sm font-black text-amber-950 font-mono mt-1">
                  {statsJalanKabupaten.totalSedang.toLocaleString('id-ID')} <span className="text-[10px] font-bold text-amber-800">M</span>
                </p>
                <p className="text-[9px] font-bold text-amber-800 mt-0.5">({formatKm(statsJalanKabupaten.totalSedang)})</p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02, y: -1 }}
                className="bg-amber-50/90 p-2.5 rounded-xl border border-amber-300 flex flex-col justify-between shadow-2xs"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-amber-950 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-amber-600 shadow-xs" />
                  <span>R. RINGAN</span>
                </div>
                <p className="text-sm font-black text-amber-950 font-mono mt-1">
                  {statsJalanKabupaten.totalRusakRingan.toLocaleString('id-ID')} <span className="text-[10px] font-bold text-amber-900">M</span>
                </p>
                <p className="text-[9px] font-bold text-amber-900 mt-0.5">({formatKm(statsJalanKabupaten.totalRusakRingan)})</p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02, y: -1 }}
                className="bg-rose-50/90 p-2.5 rounded-xl border border-rose-200 flex flex-col justify-between shadow-2xs"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-rose-800 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-rose-600 shadow-xs" />
                  <span>R. BERAT</span>
                </div>
                <p className="text-sm font-black text-rose-950 font-mono mt-1">
                  {statsJalanKabupaten.totalRusakBerat.toLocaleString('id-ID')} <span className="text-[10px] font-bold text-rose-700">M</span>
                </p>
                <p className="text-[9px] font-bold text-rose-700 mt-0.5">({formatKm(statsJalanKabupaten.totalRusakBerat)})</p>
              </motion.div>
            </div>

            {/* Animated Stacked Progress Bar Jalan Kabupaten */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Grafik Kondisi Fisik Jalan Kabupaten</span>
                <span className="text-sky-600 font-extrabold">100% Proporsi</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden flex border border-sky-200/80 p-0.5 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(statsJalanKabupaten.totalBaik / (statsJalanKabupaten.totalPanjang || 1)) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="bg-emerald-500 h-full rounded-l-full transition-all hover:bg-emerald-600"
                  title={`Baik: ${formatKm(statsJalanKabupaten.totalBaik)}`}
                />
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(statsJalanKabupaten.totalSedang / (statsJalanKabupaten.totalPanjang || 1)) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
                  className="bg-sky-400 h-full transition-all hover:bg-sky-500"
                  title={`Sedang: ${formatKm(statsJalanKabupaten.totalSedang)}`}
                />
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(statsJalanKabupaten.totalRusakRingan / (statsJalanKabupaten.totalPanjang || 1)) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
                  className="bg-amber-400 h-full transition-all hover:bg-amber-500"
                  title={`Rusak Ringan: ${formatKm(statsJalanKabupaten.totalRusakRingan)}`}
                />
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(statsJalanKabupaten.totalRusakBerat / (statsJalanKabupaten.totalPanjang || 1)) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.45, ease: "easeOut" }}
                  className="bg-rose-500 h-full rounded-r-full transition-all hover:bg-rose-600"
                  title={`Rusak Berat: ${formatKm(statsJalanKabupaten.totalRusakBerat)}`}
                />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-600 pt-1 font-semibold">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" /> Baik ({formatKm(statsJalanKabupaten.totalBaik)})</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-sm" /> Sedang ({formatKm(statsJalanKabupaten.totalSedang)})</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" /> Rusak Ringan ({formatKm(statsJalanKabupaten.totalRusakRingan)})</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" /> Rusak Berat ({formatKm(statsJalanKabupaten.totalRusakBerat)})</span>
              </div>
            </div>
          </div>

          {/* HIDDEN ACCORDION TABLE FOR JALAN KABUPATEN */}
          <div className="border-t border-sky-100 pt-3">
            <button
              onClick={() => setShowTableJalanKabupaten(!showTableJalanKabupaten)}
              className="w-full py-2.5 px-3.5 rounded-xl bg-white border border-sky-200 text-sky-900 hover:bg-sky-50/80 font-extrabold text-xs flex items-center justify-between transition-all cursor-pointer shadow-2xs group"
            >
              <span className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-sky-600" />
                <span>Rincian Lengkap Jalan Kabupaten ({statsJalanKabupaten.totalRuas} Ruas Utama)</span>
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-sky-700">
                <span>{showTableJalanKabupaten ? 'Sembunyikan' : 'Tampilkan'}</span>
                <div className={`w-5 h-5 rounded-full bg-sky-100 flex items-center justify-center transition-transform duration-300 ${showTableJalanKabupaten ? 'rotate-180 bg-sky-600 text-white' : ''}`}>
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </span>
            </button>

            <AnimatePresence>
              {showTableJalanKabupaten && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 space-y-3"
                >
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari ruas jalan kabupaten / no ruas..."
                      value={searchJalanKabupaten}
                      onChange={(e) => setSearchJalanKabupaten(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 w-full"
                    />
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-sky-200 max-h-96 overflow-y-auto bg-white shadow-xs">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-sky-900 text-white font-extrabold uppercase tracking-wider text-[9px] sticky top-0 border-b border-sky-800 z-10">
                        <tr>
                          <th className="p-2 text-center border-r border-sky-800">NO RUAS</th>
                          <th className="p-2 border-r border-sky-800">NAMA RUAS JALAN</th>
                          <th className="p-2 border-r border-sky-800">USULAN DESA</th>
                          <th className="p-2 border-r border-sky-800">USULAN RKPD 2026</th>
                          <th className="p-2 text-right border-r border-sky-800">PAGU USULAN RKPD 2026</th>
                          <th className="p-2 text-center border-r border-sky-800">SISA VOLUME (METER)</th>
                          <th className="p-2 text-center border-r border-sky-800">PANJANG RUAS (KM)</th>
                          <th className="p-2 text-center border-r border-sky-800">LEBAR RUAS (Meter)</th>
                          <th className="p-2 text-center bg-emerald-700 text-white border-r border-emerald-600">BAIK (Meter)</th>
                          <th className="p-2 text-center bg-yellow-500 text-slate-950 border-r border-yellow-400">SEDANG (Meter)</th>
                          <th className="p-2 text-center bg-amber-600 text-white border-r border-amber-500">RUSAK RINGAN (Meter)</th>
                          <th className="p-2 text-center bg-rose-700 text-white">RUSAK BERAT (Meter)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sky-100 font-medium text-slate-700">
                        {filteredJalanKabupaten.length > 0 ? (
                          filteredJalanKabupaten.map((item: any, idx: number) => {
                            const baik = parseNumeric(item.kondisiBaik ?? item.baik ?? 0);
                            const sedang = parseNumeric(item.kondisiSedang ?? item.sedang ?? 0);
                            const rr = parseNumeric(item.kondisiRusakRingan ?? item.rusakRingan ?? item.rr ?? 0);
                            const rb = parseNumeric(item.kondisiRusakBerat ?? item.rusakBerat ?? item.rb ?? 0);
                            const pKm = item.panjangKm ? `${item.panjangKm}`.replace('.', ',') : (item.panjangRuas ? (item.panjangRuas / 1000).toFixed(2).replace('.', ',') : '-');
                            const usulan2026 = Number(item.paguUsulan2026 ?? item.paguUsulan ?? 0);

                            return (
                              <tr key={`${item.noRuas}-${idx}`} className="hover:bg-sky-50/50">
                                <td className="p-2 text-center font-mono font-bold text-sky-900 border-r border-slate-100">{item.noRuas}</td>
                                <td className="p-2 font-bold text-slate-900 border-r border-slate-100">{item.namaRuas}</td>
                                <td className="p-2 text-slate-700 font-semibold border-r border-slate-100">{item.usulanDesa || '-'}</td>
                                <td className="p-2 text-slate-600 text-[10px] border-r border-slate-100">{item.usulanMusren || '-'}</td>
                                <td className="p-2 text-right font-bold text-indigo-700 font-mono border-r border-slate-100">
                                  {usulan2026 > 0 ? usulan2026.toLocaleString('id-ID') : '-'}
                                </td>
                                <td className="p-2 text-center font-mono border-r border-slate-100">{item.sisaVolume || '-'}</td>
                                <td className="p-2 text-center font-mono font-bold border-r border-slate-100">{pKm}</td>
                                <td className="p-2 text-center font-mono border-r border-slate-100">{item.lebarRuas ? `${item.lebarRuas}`.replace('.', ',') : '-'}</td>
                                <td className="p-2 text-center font-mono text-emerald-800 font-bold bg-emerald-50/30 border-r border-slate-100">{baik > 0 ? baik.toLocaleString('id-ID') : '0'}</td>
                                <td className="p-2 text-center font-mono text-amber-900 font-bold bg-yellow-50/40 border-r border-slate-100">{sedang > 0 ? sedang.toLocaleString('id-ID') : '0'}</td>
                                <td className="p-2 text-center font-mono text-amber-800 font-bold bg-amber-50/30 border-r border-slate-100">{rr > 0 ? rr.toLocaleString('id-ID') : '0'}</td>
                                <td className="p-2 text-center font-mono text-rose-800 font-bold bg-rose-50/30">{rb > 0 ? rb.toLocaleString('id-ID') : '0'}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={12} className="p-6 text-center text-slate-400">
                              Tidak ada data jalan kabupaten yang cocok.
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot className="bg-slate-900 text-white font-extrabold text-[11px] sticky bottom-0 border-t border-slate-800">
                        <tr>
                          <td colSpan={4} className="p-2.5 text-center uppercase tracking-wider">TOTAL AKUMULASI ({statsJalanKabupaten.totalRuas} RUAS)</td>
                          <td className="p-2.5 text-right font-mono text-indigo-300">{statsJalanKabupaten.totalUsulanMusren2026 > 0 ? statsJalanKabupaten.totalUsulanMusren2026.toLocaleString('id-ID') : '-'}</td>
                          <td className="p-2.5 text-center font-mono">-</td>
                          <td className="p-2.5 text-center font-mono text-cyan-300">{(statsJalanKabupaten.totalPanjang / 1000).toFixed(2).replace('.', ',')}</td>
                          <td className="p-2.5 text-center font-mono">-</td>
                          <td className="p-2.5 text-center font-mono bg-emerald-800 text-emerald-100 font-bold">{statsJalanKabupaten.totalBaik.toLocaleString('id-ID')}</td>
                          <td className="p-2.5 text-center font-mono bg-yellow-500 text-slate-950 font-bold">{statsJalanKabupaten.totalSedang.toLocaleString('id-ID')}</td>
                          <td className="p-2.5 text-center font-mono bg-amber-700 text-amber-100 font-bold">{statsJalanKabupaten.totalRusakRingan.toLocaleString('id-ID')}</td>
                          <td className="p-2.5 text-center font-mono bg-rose-800 text-rose-100 font-bold">{statsJalanKabupaten.totalRusakBerat.toLocaleString('id-ID')}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </motion.div>

      </div>

    </section>
  );
}

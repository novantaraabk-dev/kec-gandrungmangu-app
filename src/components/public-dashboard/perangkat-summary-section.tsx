'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Users, 
  UserCheck, 
  Award, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Table, 
  ChevronDown, 
  ChevronUp,
  PieChart as PieChartIcon,
  BarChart3,
  Sparkles,
  Shield
} from 'lucide-react';
import { kelembagaanDesaData, totalKelembagaan } from '@/lib/kelembagaan-data';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

export function PerangkatSummarySection() {
  const [activeTab, setActiveTab] = useState<'cards' | 'komposisi' | 'sebaran' | 'tabel'>('cards');
  const [showTable, setShowTable] = useState(false);

  // Firestore Dynamic Linmas Query
  const firestore = useFirestore();
  const linmasQuery = useMemoFirebase(() => firestore ? collection(firestore, 'linmas') : null, [firestore]);
  const { data: firestoreLinmas } = useCollection<any>(linmasQuery);

  const displayLinmasTotal = useMemo(() => {
    if (firestoreLinmas && firestoreLinmas.length > 0) {
      return firestoreLinmas.length;
    }
    return totalKelembagaan.rtRwBpd.linmas;
  }, [firestoreLinmas]);

  // Slices for Donut Chart (Perangkat Desa Composition)
  const perangkatSlices = [
    { label: 'Staf Desa', count: totalKelembagaan.perangkat.staf, color: '#6366F1', bg: 'bg-indigo-500', text: 'text-indigo-600', border: 'border-indigo-200' },
    { label: 'Kepala Dusun (Kadus)', count: totalKelembagaan.perangkat.kadus, color: '#06B6D4', bg: 'bg-cyan-500', text: 'text-cyan-600', border: 'border-cyan-200' },
    { label: 'Kasi (Kepala Seksi)', count: totalKelembagaan.perangkat.kasi, color: '#10B981', bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-200' },
    { label: 'Kaur (Kepala Urusan)', count: totalKelembagaan.perangkat.kaur, color: '#F59E0B', bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-200' },
    { label: 'Kepala Desa (Kades)', count: totalKelembagaan.perangkat.kades, color: '#EF4444', bg: 'bg-rose-500', text: 'text-rose-600', border: 'border-rose-200' },
    { label: 'Sekretaris Desa (Sekdes)', count: totalKelembagaan.perangkat.sekdes, color: '#8B5CF6', bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-200' },
  ];

  // Calculate angles for Donut SVG
  let accumAngle = 0;
  const donutPaths = perangkatSlices.map((slice) => {
    const pct = slice.count / totalKelembagaan.perangkat.total;
    const angle = pct * 360;
    const start = accumAngle;
    accumAngle += angle;
    
    // Convert angle to SVG arc coordinates (radius = 80, cx=100, cy=100)
    const startRad = ((start - 90) * Math.PI) / 180;
    const endRad = ((accumAngle - 90) * Math.PI) / 180;

    const r = 80;
    const x1 = 100 + r * Math.cos(startRad);
    const y1 = 100 + r * Math.sin(startRad);
    const x2 = 100 + r * Math.cos(endRad);
    const y2 = 100 + r * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;
    const d = `M 100 100 L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    
    return { ...slice, pct: (pct * 100).toFixed(1), d };
  });

  // Max value for bar scaling (Layansari / Cisumur total = 106)
  const maxLkdTotal = 110;

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-teal-50/95 via-cyan-50/60 to-emerald-50/70 border border-teal-200/90 shadow-md space-y-8"
      >
      {/* SECTION HEADER & NAV CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-teal-200/80 pb-4 sm:pb-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-[10px] sm:text-xs font-black tracking-widest text-white uppercase bg-teal-600 px-3.5 py-1.5 rounded-full border border-teal-400 shadow-xs flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-white" />
              KELEMBAGAAN & APARAT DESA
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl lg:text-4xl font-black font-headline tracking-tight leading-tight text-slate-900">
            Rekapitulasi Kelembagaan Desa
          </h2>

          <p className="text-xs sm:text-base text-slate-600 leading-relaxed mt-1 font-medium max-w-3xl">
            Data statistik resmi Perangkat Desa, RT/RW, BPD, dan Satlinmas Desa dari 14 Desa di Kecamatan Gandrungmangu.
          </p>
        </div>

        {/* Action Controls & Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <div className="bg-white p-1 rounded-2xl border border-slate-200 flex items-center gap-1 shadow-xs">
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'cards'
                  ? 'bg-indigo-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ringkasan</span>
            </button>

            <button
              onClick={() => setActiveTab('komposisi')}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'komposisi'
                  ? 'bg-indigo-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PieChartIcon className="w-3.5 h-3.5" />
              <span>Grafik Komposisi</span>
            </button>

            <button
              onClick={() => setActiveTab('sebaran')}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'sebaran'
                  ? 'bg-indigo-600 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Grafik Sebaran</span>
            </button>
          </div>

          <button
            onClick={() => {
              setShowTable(!showTable);
              if (!showTable) setActiveTab('tabel');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-black text-teal-800 bg-white hover:bg-teal-50 border border-teal-200 px-3.5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Table className="w-4 h-4 text-teal-600" />
            <span>{showTable ? 'Sembunyikan Tabel' : 'Matriks 14 Desa'}</span>
            {showTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <Link
            href="/public/profil-perangkat"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-4 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:scale-102"
          >
            <span>Profil Perangkat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4 VIBRANT DISPLAY CARDS (RT/RW, PERANGKAT, BPD, LINMAS) WITH EQUAL HEIGHT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch">
        
        {/* CARD 1: JUMLAH RT/RW */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 text-white flex items-center justify-center font-bold shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200 uppercase">
                LKD TERDOKUMENTASI
              </span>
            </div>

            <div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Pengurus RT / RW</p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 font-headline mt-0.5 tracking-tight">
                {totalKelembagaan.rtRwBpd.rtRwTotal.toLocaleString('id-ID')} RT & RW
              </h4>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                Terdiri dari <strong className="text-rose-700">{totalKelembagaan.rtRwBpd.rt} RT</strong> & <strong className="text-orange-700">{totalKelembagaan.rtRwBpd.rw} RW</strong> di 14 Desa.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between text-xs font-bold text-rose-700">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
              {totalKelembagaan.rtRwBpd.rt} RT & {totalKelembagaan.rtRwBpd.rw} RW
            </span>
            <Link href="/public/profil-perangkat" className="hover:underline flex items-center gap-1">
              <span>Rincian</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>

        {/* CARD 2: JUMLAH PERANGKAT DESA */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-indigo-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-xs">
                <UserCheck className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-full border border-indigo-200 uppercase">
                14 DESA TERDAFTAR
              </span>
            </div>

            <div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Perangkat Desa</p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 font-headline mt-0.5 tracking-tight">
                {totalKelembagaan.perangkat.total.toLocaleString('id-ID')} Aparat
              </h4>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                <strong className="text-indigo-700">{totalKelembagaan.perangkat.kades} Kades</strong>, <strong className="text-indigo-700">{totalKelembagaan.perangkat.sekdes} Sekdes</strong>, <strong className="text-indigo-700">{totalKelembagaan.perangkat.kasi} Kasi</strong>, <strong className="text-indigo-700">{totalKelembagaan.perangkat.kaur} Kaur</strong>, <strong className="text-indigo-700">{totalKelembagaan.perangkat.staf} Staf</strong>, & <strong className="text-indigo-700">{totalKelembagaan.perangkat.kadus} Kadus</strong>.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-indigo-100 flex items-center justify-between text-xs font-bold text-indigo-700">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              Pemerintah Desa Resmi
            </span>
            <Link href="/public/profil-perangkat" className="hover:underline flex items-center gap-1">
              <span>Rincian</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>

        {/* CARD 3: JUMLAH BPD */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-cyan-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 text-white flex items-center justify-center font-bold shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black text-cyan-800 bg-cyan-100 px-2.5 py-0.5 rounded-full border border-cyan-200 uppercase">
                LEGISLATIF DESA
              </span>
            </div>

            <div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Anggota BPD</p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 font-headline mt-0.5 tracking-tight">
                {totalKelembagaan.rtRwBpd.bpd.toLocaleString('id-ID')} Anggota
              </h4>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                Badan Permusyawaratan Desa pengawas tata kelola APBDes & Perdes.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-cyan-100 flex items-center justify-between text-xs font-bold text-cyan-800">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
              Total {totalKelembagaan.rtRwBpd.bpd} BPD (14 Desa)
            </span>
            <Link href="/public/profil-perangkat" className="hover:underline flex items-center gap-1">
              <span>Rincian</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>

        {/* CARD 4: LINMAS DESA */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">
                SATLINMAS DESA
              </span>
            </div>

            <div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Anggota Linmas Desa</p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 font-headline mt-0.5 tracking-tight">
                {displayLinmasTotal.toLocaleString('id-ID')} Personil
              </h4>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                Satuan Perlindungan Masyarakat pengamanan ketertiban, ketentraman & bencana.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs font-bold text-emerald-800">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Satlinmas 14 Desa
            </span>
            <Link href="/admin/linmas-desa" className="hover:underline flex items-center gap-1">
              <span>Kelola Data</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>

      </div>

      {/* GRAPHIC PANEL 1: KOMPOSISI PERANGKAT DESA (DONUT SVG & BREAKDOWN CARDS) */}
      {activeTab === 'komposisi' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-xl p-5 sm:p-7 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h4 className="text-lg font-black text-slate-900 font-headline flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-indigo-600" />
                Grafik Komposisi Perangkat Desa (Total {totalKelembagaan.perangkat.total} Aparat)
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Proporsi jabatan Perangkat Desa di 14 Desa se-Kecamatan Gandrungmangu.
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 self-start sm:self-auto">
              Visual Infografis
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* SVG DONUT CHART */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-indigo-50/40 rounded-2xl border border-slate-100">
              <div className="relative w-64 h-64 flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90 filter drop-shadow-md">
                  {donutPaths.map((slice, i) => (
                    <path
                      key={i}
                      d={slice.d}
                      fill={slice.color}
                      className="transition-all duration-300 hover:opacity-85 hover:scale-105 cursor-pointer"
                    >
                      <title>{`${slice.label}: ${slice.count} Orang (${slice.pct}%)`}</title>
                    </path>
                  ))}
                  {/* Center Cutout for Donut */}
                  <circle cx="100" cy="100" r="52" fill="#ffffff" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-3xl font-black text-slate-900 font-headline leading-none">
                    {totalKelembagaan.perangkat.total}
                  </span>
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mt-1">
                    Aparat Desa
                  </span>
                </div>
              </div>
            </div>

            {/* BREAKDOWN CARDS GRID */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {donutPaths.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 3 }}
                  className={`p-3.5 rounded-2xl border ${item.border} bg-white shadow-sm flex items-center justify-between gap-3`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3.5 h-3.5 rounded-full ${item.bg} shrink-0 shadow-sm`} />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{item.label}</h5>
                      <p className="text-[11px] text-slate-500 font-medium">{item.pct}% dari total aparat</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-base font-black ${item.text}`}>{item.count}</span>
                    <span className="text-[10px] text-slate-400 font-bold block">orang</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* GRAPHIC PANEL 2: SEBARAN KELEMBAGAAN PER DESA (BAR CHART RANKING) */}
      {activeTab === 'sebaran' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-xl p-5 sm:p-7 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h4 className="text-lg font-black text-slate-900 font-headline flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                Grafik Sebaran Kelembagaan & LKD (RT, RW, BPD, Linmas) per Desa
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Perbandingan jumlah Pengurus RT, RW, BPD, Linmas, dan Perangkat Desa di 14 Desa.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto text-[11px] font-bold">
              <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> RT/RW/BPD/Linmas
              </span>
              <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Perangkat Desa
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {kelembagaanDesaData.map((d) => {
              const lkdPct = Math.round((d.rtRwBpd.total / maxLkdTotal) * 100);
              return (
                <div 
                  key={d.no} 
                  className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2 hover:bg-indigo-50/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 italic font-headline flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px] not-italic">
                        {d.no}
                      </span>
                      {d.desa}
                    </span>
                    <span className="text-xs font-extrabold text-slate-700">
                      Total LKD/BPD/Linmas: <strong className="text-purple-800">{d.rtRwBpd.total}</strong> | Perangkat: <strong className="text-red-700">{d.perangkat.total}</strong>
                    </span>
                  </div>

                  {/* Progress bar for RT/RW/BPD/Linmas */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                      <div 
                        style={{ width: `${lkdPct}%` }} 
                        className="bg-gradient-to-r from-purple-500 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-500" 
                        title={`LKD Total: ${d.rtRwBpd.total}`}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span>{d.rtRwBpd.rt} RT, {d.rtRwBpd.rw} RW, {d.rtRwBpd.bpd} BPD, {d.rtRwBpd.linmas} Linmas</span>
                      <span>{d.perangkat.staf} Staf, {d.perangkat.kadus} Kadus</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* EXPANDABLE OFFICIAL 14-VILLAGE TABLE MATCHING USER DATA */}
      <AnimatePresence>
        {(showTable || activeTab === 'tabel') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-xl p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h4 className="text-base font-extrabold text-slate-900 font-headline flex items-center gap-2">
                <Table className="w-4 h-4 text-indigo-600" />
                Matriks Rekapitulasi Perangkat Desa, RT, RW, BPD, & Linmas 14 Desa
              </h4>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Data Resmi Kecamatan Gandrungmangu
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  {/* Header Level 1 */}
                  <tr className="text-center font-black uppercase text-white">
                    <th rowSpan={2} className="bg-emerald-800 border border-emerald-700 px-3 py-2 w-10">NO</th>
                    <th rowSpan={2} className="bg-emerald-800 border border-emerald-700 px-4 py-2 text-left">DESA</th>
                    <th colSpan={7} className="bg-red-800 border border-red-700 px-3 py-2">JUMLAH PERANGKAT DESA</th>
                    <th colSpan={5} className="bg-purple-900 border border-purple-800 px-3 py-2">JML RT, RW, BPD, LINMAS</th>
                  </tr>
                  {/* Header Level 2 */}
                  <tr className="text-center font-black uppercase text-white">
                    <th className="bg-red-700 border border-red-600 px-2 py-1.5">KADES</th>
                    <th className="bg-red-700 border border-red-600 px-2 py-1.5">SEKDES</th>
                    <th className="bg-red-700 border border-red-600 px-2 py-1.5">KASI</th>
                    <th className="bg-red-700 border border-red-600 px-2 py-1.5">KAUR</th>
                    <th className="bg-red-700 border border-red-600 px-2 py-1.5">STAF</th>
                    <th className="bg-red-700 border border-red-600 px-2 py-1.5">KADUS</th>
                    <th className="bg-red-900 border border-red-800 px-2.5 py-1.5">TTL</th>
                    <th className="bg-purple-800 border border-purple-700 px-2.5 py-1.5">RT</th>
                    <th className="bg-purple-800 border border-purple-700 px-2.5 py-1.5">RW</th>
                    <th className="bg-purple-800 border border-purple-700 px-2.5 py-1.5">BPD</th>
                    <th className="bg-purple-800 border border-purple-700 px-2.5 py-1.5">LINMAS</th>
                    <th className="bg-purple-950 border border-purple-900 px-2.5 py-1.5">TTL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100 bg-amber-50/30">
                  {kelembagaanDesaData.map((row) => (
                    <tr key={row.no} className="hover:bg-amber-100/60 transition-colors text-center font-medium text-slate-800">
                      <td className="border border-amber-200 px-2 py-1.5 font-bold text-slate-600">{row.no}</td>
                      <td className="border border-amber-200 px-3 py-1.5 text-left font-bold text-slate-900 italic">{row.desa}</td>
                      <td className="border border-amber-200 px-2 py-1.5">{row.perangkat.kades}</td>
                      <td className="border border-amber-200 px-2 py-1.5">{row.perangkat.sekdes}</td>
                      <td className="border border-amber-200 px-2 py-1.5">{row.perangkat.kasi}</td>
                      <td className="border border-amber-200 px-2 py-1.5">{row.perangkat.kaur}</td>
                      <td className="border border-amber-200 px-2 py-1.5">{row.perangkat.staf}</td>
                      <td className="border border-amber-200 px-2 py-1.5">{row.perangkat.kadus}</td>
                      <td className="border border-amber-200 px-2.5 py-1.5 font-black text-red-800 bg-red-50/60">{row.perangkat.total}</td>
                      <td className="border border-amber-200 px-2.5 py-1.5">{row.rtRwBpd.rt}</td>
                      <td className="border border-amber-200 px-2.5 py-1.5">{row.rtRwBpd.rw}</td>
                      <td className="border border-amber-200 px-2.5 py-1.5">{row.rtRwBpd.bpd}</td>
                      <td className="border border-amber-200 px-2.5 py-1.5 text-emerald-800 font-bold bg-emerald-50/40">{row.rtRwBpd.linmas}</td>
                      <td className="border border-amber-200 px-2.5 py-1.5 font-black text-purple-900 bg-purple-50/60">{row.rtRwBpd.total}</td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-emerald-900 text-white font-black text-center text-xs uppercase">
                    <td colSpan={2} className="border border-emerald-800 px-3 py-2 text-left">JUMLAH KECAMATAN</td>
                    <td className="border border-emerald-800 px-2 py-2">{totalKelembagaan.perangkat.kades}</td>
                    <td className="border border-emerald-800 px-2 py-2">{totalKelembagaan.perangkat.sekdes}</td>
                    <td className="border border-emerald-800 px-2 py-2">{totalKelembagaan.perangkat.kasi}</td>
                    <td className="border border-emerald-800 px-2 py-2">{totalKelembagaan.perangkat.kaur}</td>
                    <td className="border border-emerald-800 px-2 py-2">{totalKelembagaan.perangkat.staf}</td>
                    <td className="border border-emerald-800 px-2 py-2">{totalKelembagaan.perangkat.kadus}</td>
                    <td className="border border-red-800 bg-red-900 px-2.5 py-2 font-black text-white">{totalKelembagaan.perangkat.total}</td>
                    <td className="border border-purple-800 bg-purple-900 px-2.5 py-2">{totalKelembagaan.rtRwBpd.rt}</td>
                    <td className="border border-purple-800 bg-purple-900 px-2.5 py-2">{totalKelembagaan.rtRwBpd.rw}</td>
                    <td className="border border-purple-800 bg-purple-900 px-2.5 py-2">{totalKelembagaan.rtRwBpd.bpd}</td>
                    <td className="border border-emerald-800 bg-emerald-800 px-2.5 py-2 text-amber-300 font-bold">{displayLinmasTotal}</td>
                    <td className="border border-purple-950 bg-purple-950 px-2.5 py-2 font-black text-amber-300">{totalKelembagaan.rtRwBpd.total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div>
    </section>
  );
}

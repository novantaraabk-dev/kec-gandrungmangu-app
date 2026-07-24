'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { vervalP3keData, type VervalP3keData } from '@/lib/p3ke-verval-data';
import { 
  Users, 
  Home, 
  Droplets, 
  Zap, 
  GraduationCap, 
  HeartHandshake, 
  Briefcase, 
  Baby, 
  TrendingUp, 
  Table, 
  ChevronDown, 
  ChevronUp, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Filter, 
  Sparkles,
  Layers,
  Building2,
  ShieldAlert,
  Search
} from 'lucide-react';

export function P3keAnalyticsSection() {
  const [selectedSort, setSelectedSort] = useState<'krt' | 'rtlh' | 'stunting'>('krt');
  const [showTable, setShowTable] = useState(false);
  const [activeDesa, setActiveDesa] = useState<string | null>(null);

  // Aggregated totals across all 14 villages
  const totals = useMemo(() => {
    return vervalP3keData.reduce(
      (acc, curr) => {
        acc.krt += curr.krt;
        acc.art += curr.art;
        acc.jamban += curr.tidakPunyaJamban;
        acc.rtlh += curr.rtlh;
        acc.listrik += curr.tidakPunyaListrik;
        acc.air += curr.tidakPunyaSumberAir;
        acc.ats += curr.anakTidakSekolah;
        acc.disabilitas += curr.disabilitas;
        acc.pengangguran += curr.tidakBekerja;
        acc.stunting += curr.resikoStunting;
        return acc;
      },
      {
        krt: 0,
        art: 0,
        jamban: 0,
        rtlh: 0,
        listrik: 0,
        air: 0,
        ats: 0,
        disabilitas: 0,
        pengangguran: 0,
        stunting: 0,
      }
    );
  }, []);

  // Sorted villages based on active filter
  const sortedVillages = useMemo(() => {
    return [...vervalP3keData].sort((a, b) => {
      if (selectedSort === 'krt') return b.krt - a.krt;
      if (selectedSort === 'rtlh') return b.rtlh - a.rtlh;
      if (selectedSort === 'stunting') return b.resikoStunting - a.resikoStunting;
      return b.krt - a.krt;
    });
  }, [selectedSort]);

  // Max values for chart scaling
  const maxKrt = useMemo(() => Math.max(...vervalP3keData.map(v => v.krt)), []);

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-8">
      
      {/* OUTER MULTI-COLOR GRADIENT CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="p-[2px] rounded-[24px] sm:rounded-[32px] bg-gradient-to-br from-indigo-600 via-sky-500 to-amber-500 shadow-2xl shadow-indigo-500/15 relative overflow-hidden"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-[22px] sm:rounded-[30px] p-4 sm:p-10 relative overflow-hidden space-y-6 sm:space-y-8">
          
          {/* Ambient Background Blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

          {/* SECTION HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-indigo-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
                <span className="text-[10px] sm:text-xs font-black tracking-widest text-indigo-800 uppercase bg-gradient-to-r from-indigo-100 via-sky-100 to-amber-100 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-indigo-200 shadow-sm flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 animate-pulse" />
                  DASHBOARD P3KE & PERCEPATAN PENANGGULANGAN KEMISKINAN
                </span>
              </div>
              
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black font-headline tracking-tight leading-tight bg-gradient-to-r from-indigo-900 via-sky-800 to-amber-700 bg-clip-text text-transparent">
                Data Sasaran P3KE Terverifikasi (14 Desa)
              </h2>
              
              <p className="text-xs sm:text-base text-slate-600 leading-relaxed mt-1.5 sm:mt-2 font-medium max-w-3xl">
                Sistem Olah Laporan Informasi & Data Desa (SOLID) menyajikan rekapitulasi data Sasaran P3KE terverifikasi & tervalidasi (Verval) di Kecamatan Gandrungmangu.
              </p>
            </div>

            <button
              onClick={() => setShowTable(!showTable)}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-700 hover:from-indigo-700 hover:to-sky-700 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-102 self-start lg:self-auto cursor-pointer"
            >
              <Table className="w-4 h-4" />
              <span>{showTable ? 'Sembunyikan Tabel P3KE' : 'Lihat Tabel Rekapitulasi 14 Desa'}</span>
              {showTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* 4 TOP KEY METRIC CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Stat 1: Total KRT Sasaran */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-br from-indigo-50/90 via-purple-50/40 to-white p-3.5 sm:p-5 rounded-2xl border border-indigo-200/90 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-300">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-black text-indigo-800 bg-indigo-100/90 px-2 py-0.5 rounded-full border border-indigo-200">
                  Kepala Rumah Tangga
                </span>
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Total KRT P3KE</p>
              <h3 className="text-xl sm:text-3xl font-black text-slate-900 font-headline mt-0.5 sm:mt-1 tracking-tight">
                {totals.krt.toLocaleString('id-ID')} <span className="text-xs sm:text-base font-bold text-indigo-600">KRT</span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium mt-0.5">Tersebar di 14 Desa</p>
            </motion.div>

            {/* Stat 2: Total ART Sasaran */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-br from-sky-50/90 via-cyan-50/40 to-white p-3.5 sm:p-5 rounded-2xl border border-sky-200/90 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white flex items-center justify-center font-bold shadow-md shadow-sky-300">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-black text-sky-800 bg-sky-100/90 px-2 py-0.5 rounded-full border border-sky-200">
                  Anggota Keluarga
                </span>
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Total ART P3KE</p>
              <h3 className="text-xl sm:text-3xl font-black text-slate-900 font-headline mt-0.5 sm:mt-1 tracking-tight">
                {totals.art.toLocaleString('id-ID')} <span className="text-xs sm:text-base font-bold text-sky-600">Jiwa</span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium mt-0.5">Jiwa Terdata Verval</p>
            </motion.div>

            {/* Stat 3: Rumah Tidak Layak Huni */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white p-3.5 sm:p-5 rounded-2xl border border-amber-200/90 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-300">
                  <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-black text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-200">
                  Fisik Bangunan
                </span>
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Target RTLH</p>
              <h3 className="text-xl sm:text-3xl font-black text-slate-900 font-headline mt-0.5 sm:mt-1 tracking-tight">
                {totals.rtlh.toLocaleString('id-ID')} <span className="text-xs sm:text-base font-bold text-amber-600">Unit</span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium mt-0.5">Prioritas Bedah Rumah</p>
            </motion.div>

            {/* Stat 4: Resiko Stunting */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-br from-rose-50/90 via-pink-50/40 to-white p-3.5 sm:p-5 rounded-2xl border border-rose-200/90 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white flex items-center justify-center font-bold shadow-md shadow-rose-300">
                  <Baby className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-black text-rose-800 bg-rose-100/90 px-2 py-0.5 rounded-full border border-rose-200">
                  Kesehatan Ibu & Anak
                </span>
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Risiko Stunting</p>
              <h3 className="text-xl sm:text-3xl font-black text-slate-900 font-headline mt-0.5 sm:mt-1 tracking-tight">
                {totals.stunting.toLocaleString('id-ID')} <span className="text-xs sm:text-base font-bold text-rose-600">Keluarga</span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium mt-0.5">Balita & Bumil Terpantau</p>
            </motion.div>

          </div>

          {/* MAIN GRAPHIC & BREAKDOWN SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* LEFT COLUMN: DIAGRAM BAR GRAFIK P3KE PER DESA (7 COLS) */}
            <div className="lg:col-span-7 bg-slate-50/80 rounded-2xl p-4 sm:p-6 border border-slate-200/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 font-headline flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-600" />
                    Grafik Distribusi P3KE per Desa
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Urutan volume sasaran KRT P3KE terverifikasi</p>
                </div>

                {/* Filter Selector Buttons */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold shadow-sm">
                  <button
                    onClick={() => setSelectedSort('krt')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${selectedSort === 'krt' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    Top KRT
                  </button>
                  <button
                    onClick={() => setSelectedSort('rtlh')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${selectedSort === 'rtlh' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    Top RTLH
                  </button>
                  <button
                    onClick={() => setSelectedSort('stunting')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${selectedSort === 'stunting' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    Stunting
                  </button>
                </div>
              </div>

              {/* Dynamic Animated Bar Chart for 14 Villages in 2-Column Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2 pt-1">
                {sortedVillages.map((v, index) => {
                  const widthPercent = (v.krt / maxKrt) * 100;
                  const isHovered = activeDesa === v.desa;

                  return (
                    <motion.div
                      key={v.desa}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.02 }}
                      onMouseEnter={() => setActiveDesa(v.desa)}
                      onMouseLeave={() => setActiveDesa(null)}
                      className={`p-1.5 sm:p-2 rounded-xl transition-all border ${isHovered ? 'bg-indigo-50/90 border-indigo-300 shadow-md scale-[1.01]' : 'bg-white/80 border-slate-200/80 hover:bg-slate-100/80'}`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                        <span className="text-slate-800 font-headline flex items-center gap-1 truncate">
                          <span className="w-3.5 text-[9px] text-slate-400 font-mono font-black text-center">#{index + 1}</span>
                          <span className="truncate">{v.desa}</span>
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] shrink-0">
                          <span className="text-indigo-700 font-extrabold">{v.krt.toLocaleString('id-ID')} KRT</span>
                          <span className="text-slate-300">|</span>
                          <span className="text-slate-500 font-medium">{v.art.toLocaleString('id-ID')} ART</span>
                        </div>
                      </div>

                      {/* Animated Compact Progress Bar */}
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/80">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${widthPercent}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, delay: 0.05 + index * 0.02, ease: 'easeOut' }}
                          className={`h-full rounded-full transition-colors ${
                            selectedSort === 'stunting' 
                              ? 'bg-gradient-to-r from-rose-500 to-pink-500' 
                              : selectedSort === 'rtlh' 
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                              : 'bg-gradient-to-r from-indigo-600 via-sky-500 to-cyan-500'
                          }`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: 8 INDIKATOR INTERVENSI P3KE (5 COLS) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="border-b border-indigo-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 font-headline flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Rincian 8 Indikator Intervensi
                </h3>
                <p className="text-xs text-slate-500 font-medium">Akumulasi kebutuhan intervensi P3KE se-Kecamatan</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                
                {/* Indikator 1: RTLH */}
                <motion.div 
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="bg-white p-3.5 rounded-xl border border-amber-200/90 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 text-amber-600 mb-1">
                    <Home className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">RTLH</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 font-headline">{totals.rtlh.toLocaleString('id-ID')}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Unit Rumah Tidak Layak Huni</p>
                </motion.div>

                {/* Indikator 2: Jamban / Sanitasi */}
                <motion.div 
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="bg-white p-3.5 rounded-xl border border-cyan-200/90 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 text-cyan-600 mb-1">
                    <Droplets className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Jamban</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 font-headline">{totals.jamban.toLocaleString('id-ID')}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">KK Belum Memiliki Jamban</p>
                </motion.div>

                {/* Indikator 3: Air Minum / Bersih */}
                <motion.div 
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="bg-white p-3.5 rounded-xl border border-sky-200/90 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 text-sky-600 mb-1">
                    <Droplets className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Sumber Air</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 font-headline">{totals.air.toLocaleString('id-ID')}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">KK Akses Air Non-Layak</p>
                </motion.div>

                {/* Indikator 4: Listrik */}
                <motion.div 
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="bg-white p-3.5 rounded-xl border border-yellow-200/90 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 text-yellow-600 mb-1">
                    <Zap className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Listrik</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 font-headline">{totals.listrik.toLocaleString('id-ID')}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">KK Belum Berlistrik</p>
                </motion.div>

                {/* Indikator 5: Anak Tidak Sekolah */}
                <motion.div 
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="bg-white p-3.5 rounded-xl border border-purple-200/90 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 text-purple-600 mb-1">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">ATS</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 font-headline">{totals.ats.toLocaleString('id-ID')}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Anak Tidak Sekolah</p>
                </motion.div>

                {/* Indikator 6: Pengangguran */}
                <motion.div 
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="bg-white p-3.5 rounded-xl border border-indigo-200/90 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 text-indigo-600 mb-1">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Tidak Bekerja</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 font-headline">{totals.pengangguran.toLocaleString('id-ID')}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Jiwa Usia Kerja Pengangguran</p>
                </motion.div>

                {/* Indikator 7: Disabilitas */}
                <motion.div 
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="bg-white p-3.5 rounded-xl border border-teal-200/90 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 text-teal-600 mb-1">
                    <HeartHandshake className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Disabilitas</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 font-headline">{totals.disabilitas.toLocaleString('id-ID')}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Penyandang Disabilitas</p>
                </motion.div>

                {/* Indikator 8: Risiko Stunting */}
                <motion.div 
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="bg-white p-3.5 rounded-xl border border-rose-200/90 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-2 text-rose-600 mb-1">
                    <Baby className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Stunting</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 font-headline">{totals.stunting.toLocaleString('id-ID')}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Keluarga Risiko Stunting</p>
                </motion.div>

              </div>
            </div>

          </div>

          {/* EXPANDABLE REKAPITULASI DATA TABLE */}
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
                      Tabel Matriks P3KE & Intervensi 14 Desa Kecamatan Gandrungmangu
                    </h4>
                    <span className="text-[11px] font-bold text-slate-500">
                      Sumber: Data Verval P3KE
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
                    <table className="w-full text-xs text-left text-slate-700">
                      <thead className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-3">No</th>
                          <th className="py-3 px-3">Desa</th>
                          <th className="py-3 px-3 text-right">KRT P3KE</th>
                          <th className="py-3 px-3 text-right">ART P3KE</th>
                          <th className="py-3 px-3 text-right">RTLH</th>
                          <th className="py-3 px-3 text-right">Jamban</th>
                          <th className="py-3 px-3 text-right">Air Bersih</th>
                          <th className="py-3 px-3 text-right">Listrik</th>
                          <th className="py-3 px-3 text-right">ATS</th>
                          <th className="py-3 px-3 text-right">Disabilitas</th>
                          <th className="py-3 px-3 text-right">Pengangguran</th>
                          <th className="py-3 px-3 text-right">Stunting</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {vervalP3keData.map((d, index) => (
                          <tr key={d.desa} className="hover:bg-indigo-50/60 transition-colors">
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-400">{index + 1}</td>
                            <td className="py-2.5 px-3 font-extrabold text-slate-900 font-headline">{d.desa}</td>
                            <td className="py-2.5 px-3 text-right font-bold text-indigo-700">{d.krt.toLocaleString('id-ID')}</td>
                            <td className="py-2.5 px-3 text-right font-bold text-sky-700">{d.art.toLocaleString('id-ID')}</td>
                            <td className="py-2.5 px-3 text-right text-amber-700 font-bold">{d.rtlh.toLocaleString('id-ID')}</td>
                            <td className="py-2.5 px-3 text-right text-cyan-700">{d.tidakPunyaJamban.toLocaleString('id-ID')}</td>
                            <td className="py-2.5 px-3 text-right text-sky-700">{d.tidakPunyaSumberAir.toLocaleString('id-ID')}</td>
                            <td className="py-2.5 px-3 text-right text-yellow-700">{d.tidakPunyaListrik.toLocaleString('id-ID')}</td>
                            <td className="py-2.5 px-3 text-right text-purple-700">{d.anakTidakSekolah.toLocaleString('id-ID')}</td>
                            <td className="py-2.5 px-3 text-right text-teal-700">{d.disabilitas.toLocaleString('id-ID')}</td>
                            <td className="py-2.5 px-3 text-right text-indigo-700">{d.tidakBekerja.toLocaleString('id-ID')}</td>
                            <td className="py-2.5 px-3 text-right font-bold text-rose-600">{d.resikoStunting.toLocaleString('id-ID')}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
                        <tr>
                          <td colSpan={2} className="py-3 px-3 text-left uppercase tracking-wider">Total Kecamatan</td>
                          <td className="py-3 px-3 text-right text-indigo-800">{totals.krt.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-3 text-right text-sky-800">{totals.art.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-3 text-right text-amber-800">{totals.rtlh.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-3 text-right text-cyan-800">{totals.jamban.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-3 text-right text-sky-800">{totals.air.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-3 text-right text-yellow-800">{totals.listrik.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-3 text-right text-purple-800">{totals.ats.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-3 text-right text-teal-800">{totals.disabilitas.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-3 text-right text-indigo-800">{totals.pengangguran.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-3 text-right text-rose-700">{totals.stunting.toLocaleString('id-ID')}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>

    </section>
  );
}

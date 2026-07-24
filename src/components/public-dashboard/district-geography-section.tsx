'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Compass, 
  Mountain, 
  Maximize2, 
  Navigation, 
  TrendingUp, 
  Table, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  PieChart as PieChartIcon,
  BarChart3,
  Eye,
  EyeOff
} from 'lucide-react';
import { geografiDesaData, totalGeografiKecamatan } from '@/lib/geografi-data';

export function DistrictGeographySection() {
  const [showTable, setShowTable] = useState(false);
  const [showVisualisation, setShowVisualisation] = useState(true);
  const [viewType, setViewType] = useState<'pie' | 'bar'>('pie');
  const [selectedSort, setSelectedSort] = useState<'luas' | 'jarakKec' | 'jarakKab'>('luas');
  const [activeSlice, setActiveSlice] = useState<string | null>(null);

  const sortedData = [...geografiDesaData].sort((a, b) => {
    if (selectedSort === 'luas') return b.luasKm2 - a.luasKm2;
    if (selectedSort === 'jarakKec') return a.jarakKeKecKm - b.jarakKeKecKm;
    return a.jarakKeKabKm - b.jarakKeKabKm;
  });

  const maxLuas = 17.04; // Sidaurip

  // 14 Vibrant Colors for the Donut Infographic
  const sliceColors = [
    '#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6', 
    '#EC4899', '#06B6D4', '#F97316', '#6366F1', '#14B8A6', 
    '#3B82F6', '#A855F7', '#84CC16', '#EAB308'
  ];

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      
      {/* Outer Multi-color Gradient Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="p-[2px] rounded-[24px] sm:rounded-[32px] bg-gradient-to-br from-sky-500 via-indigo-500 to-emerald-400 shadow-2xl shadow-sky-500/15 relative overflow-hidden"
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-[22px] sm:rounded-[30px] p-4 sm:p-10 relative overflow-hidden space-y-6 sm:space-y-8">
          
          {/* Ambient Background Blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-sky-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
                <span className="text-[10px] sm:text-xs font-black tracking-widest text-sky-800 uppercase bg-gradient-to-r from-sky-100 via-indigo-100 to-emerald-100 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-sky-200 shadow-sm flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-600 animate-spin" style={{ animationDuration: '12s' }} />
                  PROFIL GEOGRAFI & WILAYAH
                </span>
              </div>
              
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black font-headline tracking-tight leading-tight bg-gradient-to-r from-sky-900 via-indigo-800 to-emerald-700 bg-clip-text text-transparent">
                Kondisi Geografis Kecamatan Gandrungmangu
              </h2>
              
              <p className="text-xs sm:text-base text-slate-600 leading-relaxed mt-1.5 sm:mt-2 font-medium max-w-3xl">
                Kecamatan Gandrungmangu terletak di bagian utara Kabupaten Cilacap pada ketinggian rata-rata <strong className="text-sky-700">15 mdpl</strong> dengan total luas wilayah <strong className="text-indigo-700">119,26 km²</strong> (5,04% dari luas Kabupaten Cilacap).
              </p>
            </div>

            <button
              onClick={() => setShowTable(!showTable)}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-sky-600 via-indigo-600 to-emerald-600 hover:from-sky-700 hover:to-indigo-700 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-102 self-start lg:self-auto cursor-pointer"
            >
              <Table className="w-4 h-4" />
              <span>{showTable ? 'Sembunyikan Tabel Rekapitulasi' : 'Lihat Tabel Geografis 14 Desa'}</span>
              {showTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* 4 TOP KEY METRIC STAT CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Stat 1: Luas Wilayah */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-br from-sky-50/90 via-cyan-50/40 to-white p-3.5 sm:p-5 rounded-2xl border border-sky-200/90 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white flex items-center justify-center font-bold shadow-md shadow-sky-300">
                  <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-black text-sky-800 bg-sky-100/90 px-2 py-0.5 rounded-full border border-sky-200">
                  5,04% Kab.
                </span>
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Total Luas Wilayah</p>
              <h3 className="text-xl sm:text-3xl font-black text-slate-900 font-headline mt-0.5 sm:mt-1 tracking-tight">
                119,26 <span className="text-xs sm:text-base font-bold text-sky-600">km²</span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium mt-0.5">14 Desa Terdata</p>
            </motion.div>

            {/* Stat 2: Ketinggian */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-br from-indigo-50/90 via-purple-50/40 to-white p-5 rounded-2xl border border-indigo-200/90 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-300">
                  <Mountain className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black text-indigo-700 bg-indigo-100/90 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  Dataran Rendah
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ketinggian Rata-rata</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-headline mt-1 tracking-tight">
                15 <span className="text-base font-bold text-indigo-600">mdpl</span>
              </h3>
              <p className="text-[11px] text-slate-600 font-medium mt-1">Meter Di Atas Permukaan Laut</p>
            </motion.div>

            {/* Stat 3: Jarak ke Ibukota Kabupaten */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white p-5 rounded-2xl border border-emerald-200/90 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-300">
                  <Navigation className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Pusat Kab. Cilacap
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jarak ke Ibukota Kab.</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-headline mt-1 tracking-tight">
                73 <span className="text-base font-bold text-emerald-600">km</span>
              </h3>
              <p className="text-[11px] text-slate-600 font-medium mt-1">Dari Ibukota Kecamatan</p>
            </motion.div>

            {/* Stat 4: Posisi Wilayah */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white p-5 rounded-2xl border border-amber-200/90 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black text-amber-800 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Cilacap Utara
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Wilayah Kabupaten</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-headline mt-1 tracking-tight">
                14 <span className="text-base font-bold text-amber-600">Desa</span>
              </h3>
              <p className="text-[11px] text-slate-600 font-medium mt-1">100% Wilayah Terpetakan</p>
            </motion.div>

          </div>

          {/* MIDDLE SECTION: BATAS WILAYAH COMPASS & HIGHLIGHT ANALISIS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT: INTERACTIVE COMPASS / BATAS WILAYAH (6 COLS) */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="lg:col-span-6 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden flex flex-col justify-between border border-indigo-700/50"
            >
              {/* Background Compass Decorative Overlay */}
              <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                <Compass className="w-80 h-80 text-white" />
              </div>

              <div>
                <div className="flex items-center justify-between border-b border-indigo-800/80 pb-3 mb-4">
                  <h3 className="text-lg font-black font-headline tracking-wide flex items-center gap-2 text-white">
                    <Compass className="w-5 h-5 text-sky-400 animate-spin" style={{ animationDuration: '15s' }} />
                    Batas-Batas Wilayah Kecamatan
                  </h3>
                  <span className="text-[10px] font-black text-sky-300 bg-sky-950/80 px-3 py-1 rounded-full border border-sky-700 uppercase">
                    Administratif
                  </span>
                </div>

                {/* 4 Cardinal Directions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  
                  {/* Utara */}
                  <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 hover:bg-white/20 transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-lg bg-sky-500 text-white text-xs font-black flex items-center justify-center shadow-sm">U</span>
                      <span className="text-xs font-extrabold text-sky-300 uppercase tracking-wider">Sebelah Utara</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-200 leading-snug pl-8">
                      {totalGeografiKecamatan.batasWilayah.utara}
                    </p>
                  </div>

                  {/* Timur */}
                  <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 hover:bg-white/20 transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-lg bg-indigo-500 text-white text-xs font-black flex items-center justify-center shadow-sm">T</span>
                      <span className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider">Sebelah Timur</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-200 leading-snug pl-8">
                      {totalGeografiKecamatan.batasWilayah.timur}
                    </p>
                  </div>

                  {/* Selatan */}
                  <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 hover:bg-white/20 transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white text-xs font-black flex items-center justify-center shadow-sm">S</span>
                      <span className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider">Sebelah Selatan</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-200 leading-snug pl-8">
                      {totalGeografiKecamatan.batasWilayah.selatan}
                    </p>
                  </div>

                  {/* Barat */}
                  <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 hover:bg-white/20 transition-all">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-lg bg-amber-500 text-white text-xs font-black flex items-center justify-center shadow-sm">B</span>
                      <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">Sebelah Barat</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-200 leading-snug pl-8">
                      {totalGeografiKecamatan.batasWilayah.barat}
                    </p>
                  </div>

                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-indigo-800/60 text-[11px] text-indigo-200 font-medium flex items-center justify-between">
                <span>Pemerintahan Kecamatan Gandrungmangu</span>
                <span className="text-sky-300 font-bold">Cilacap, Jawa Tengah</span>
              </div>
            </motion.div>

            {/* RIGHT: ANALISIS HIGHLIGHT GEOGRAFIS (6 COLS) */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Highlight 1: Desa Terluas & Terkecil */}
              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white p-5 rounded-3xl border border-emerald-200/90 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">
                      Luas Wilayah
                    </span>
                    <Layers className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 font-headline">Desa Terluas & Terkecil</h4>
                  
                  <div className="space-y-2 mt-3 text-xs">
                    <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200/80 shadow-sm">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Desa Terluas</p>
                      <p className="text-sm font-black text-emerald-800">Sidaurip (17,04 km²)</p>
                      <p className="text-[10px] text-emerald-600 font-semibold">14,29% dari luas kecamatan</p>
                    </div>

                    <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200/80 shadow-sm">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Desa Terkecil</p>
                      <p className="text-sm font-black text-slate-900">Gandrungmangu (4,57 km²)</p>
                      <p className="text-[10px] text-slate-500 font-semibold">3,83% dari luas kecamatan</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Highlight 2: Akses Jarak Ke Ibukota */}
              <motion.div 
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-gradient-to-br from-indigo-50/90 via-sky-50/40 to-white p-5 rounded-3xl border border-indigo-200/90 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-indigo-800 bg-indigo-100/90 px-2.5 py-0.5 rounded-full border border-indigo-200 uppercase">
                      Aksesibilitas
                    </span>
                    <Navigation className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 font-headline">Jarak ke Pusat Ibukota</h4>
                  
                  <div className="space-y-2 mt-3 text-xs">
                    <div className="bg-white/80 p-2.5 rounded-xl border border-indigo-200/80 shadow-sm">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Terdekat ke Kec. (1 km)</p>
                      <p className="text-xs font-black text-indigo-900">Gandrungmanis & Gandrungmangu</p>
                    </div>

                    <div className="bg-white/80 p-2.5 rounded-xl border border-indigo-200/80 shadow-sm">
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Terjauh ke Kec. & Kab.</p>
                      <p className="text-xs font-black text-slate-900">Karanggintung (16 km ke Kec)</p>
                      <p className="text-xs font-black text-rose-700">Rungkang (63 km ke Kab)</p>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>

          </div>

          {/* BOTTOM SECTION: INFOGRAFIS PIE / DONUT CHART WITH SHOW/HIDE TOGGLE BUTTON */}
          <div className="bg-gradient-to-br from-slate-50/90 via-sky-50/30 to-white rounded-3xl p-6 sm:p-8 border border-sky-200/80 shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sky-100 pb-4 gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-black font-headline text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-sky-600" />
                  Visualisasi Distribusi Geografis 14 Desa
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Proporsi luas wilayah (km²) dan persentase (%) 14 Desa di Kecamatan Gandrungmangu.
                </p>
              </div>

              {/* Action Buttons: Show/Hide Toggle & View Switcher */}
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                {/* SHOW / HIDE TOGGLE BUTTON */}
                <button
                  onClick={() => setShowVisualisation(!showVisualisation)}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-sky-700 hover:text-sky-800 bg-sky-100/80 hover:bg-sky-200/80 border border-sky-200 px-3.5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  {showVisualisation ? <EyeOff className="w-4 h-4 text-sky-600" /> : <Eye className="w-4 h-4 text-sky-600" />}
                  <span>{showVisualisation ? 'Sembunyikan Visualisasi' : 'Munculkan Visualisasi'}</span>
                  {showVisualisation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {/* View Switcher: Pie Chart Infografis vs Bar Chart */}
                {showVisualisation && (
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-sky-200 shadow-sm text-xs font-bold">
                    <button
                      onClick={() => setViewType('pie')}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${viewType === 'pie' ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                      <PieChartIcon className="w-3.5 h-3.5" />
                      <span>Pie Chart</span>
                    </button>
                    <button
                      onClick={() => setViewType('bar')}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${viewType === 'bar' ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Bar Chart</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* VISUALIZATION CONTAINER WRAPPED IN ANIMATE PRESENCE & SHOW/HIDE STATE */}
            <AnimatePresence>
              {showVisualisation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden"
                >
                  {/* VIEW 1: PIE CHART INFOGRAFIS WITH EXTERNAL POINTER LINES & CALLOUTS */}
                  {viewType === 'pie' && (
                    <div className="py-4 flex flex-col items-center justify-center">
                      <div className="relative w-full max-w-[850px] aspect-[4/3] sm:aspect-[16/9] flex items-center justify-center">
                        
                        {/* SVG Infographic Donut with Leader Pointer Lines */}
                        <svg className="w-full h-full" viewBox="0 0 700 500">
                          
                          {/* Background Glow */}
                          <circle cx="350" cy="250" r="110" fill="none" stroke="#E0F2FE" strokeWidth="30" className="opacity-50" />
                          
                          {/* Render Slices & Leader Lines */}
                          {(() => {
                            const totalLuas = totalGeografiKecamatan.luasTotalKm2;
                            const sortedByLuas = [...geografiDesaData].sort((a, b) => b.luasKm2 - a.luasKm2);
                            
                            const r = 110; // Donut radius
                            const c = 2 * Math.PI * r; // ~691.15
                            let accumulatedOffset = 0;
                            let currentAngle = -Math.PI / 2;

                            return sortedByLuas.map((d, i) => {
                              const portion = d.luasKm2 / totalLuas;
                              const arcLength = portion * c;
                              const dasharray = `${arcLength} ${c - arcLength}`;
                              const offset = -accumulatedOffset;
                              accumulatedOffset += arcLength;

                              const sliceAngle = portion * 2 * Math.PI;
                              const midAngle = currentAngle + sliceAngle / 2;
                              currentAngle += sliceAngle;

                              const color = sliceColors[i % sliceColors.length];
                              const isActive = activeSlice === d.desa;

                              // Calculation for Leader Pointer Line:
                              const rArc = 125; // Arc start point radius
                              const rElbow = 160; // Elbow bend radius
                              
                              const x1 = 350 + rArc * Math.cos(midAngle);
                              const y1 = 250 + rArc * Math.sin(midAngle);
                              const x2 = 350 + rElbow * Math.cos(midAngle);
                              const y2 = 250 + rElbow * Math.sin(midAngle);

                              const isRight = Math.cos(midAngle) >= 0;
                              const x3 = isRight ? x2 + 35 : x2 - 35;
                              const textX = isRight ? x3 + 6 : x3 - 6;
                              const textAnchor = isRight ? 'start' : 'end';

                              return (
                                <g 
                                  key={d.desa} 
                                  className="group/slice cursor-pointer transition-all duration-300"
                                  onMouseEnter={() => setActiveSlice(d.desa)}
                                  onMouseLeave={() => setActiveSlice(null)}
                                >
                                  {/* Donut Slice Arc */}
                                  <circle
                                    cx="350"
                                    cy="250"
                                    r={r}
                                    stroke={color}
                                    strokeWidth={isActive ? "30" : "24"}
                                    fill="transparent"
                                    strokeDasharray={dasharray}
                                    strokeDashoffset={offset}
                                    transform="rotate(-90 350 250)"
                                    className="transition-all duration-300 opacity-95 hover:opacity-100"
                                  />

                                  {/* Pointer Leader Line (Point -> Angled Bend -> Horizontal Extension) */}
                                  <polyline
                                    points={`${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)} ${x3.toFixed(1)},${y2.toFixed(1)}`}
                                    stroke={color}
                                    strokeWidth={isActive ? "2.2" : "1.5"}
                                    strokeDasharray={isActive ? "none" : "3,2"}
                                    fill="none"
                                    className="transition-all duration-300 opacity-90 group-hover/slice:opacity-100"
                                  />
                                  
                                  {/* Slice Connection Dot */}
                                  <circle 
                                    cx={x1.toFixed(1)} 
                                    cy={y1.toFixed(1)} 
                                    r={isActive ? "4" : "2.5"} 
                                    fill={color} 
                                    className="transition-all duration-300"
                                  />
                                  
                                  {/* External Hexagon/Circle Number Badge at Elbow */}
                                  <circle 
                                    cx={x3.toFixed(1)} 
                                    cy={y2.toFixed(1)} 
                                    r="8" 
                                    fill={color} 
                                    className="shadow-md"
                                  />
                                  <text
                                    x={x3.toFixed(1)}
                                    y={(y2 + 3.2).toFixed(1)}
                                    textAnchor="middle"
                                    className="text-[8px] font-black fill-white pointer-events-none select-none"
                                  >
                                    {d.no}
                                  </text>

                                  {/* External Callout Label Text (Nama Desa & Luas Wilayah) */}
                                  <text
                                    x={textX.toFixed(1)}
                                    y={y2.toFixed(1)}
                                    textAnchor={textAnchor}
                                    className="pointer-events-none select-none transition-all duration-300"
                                  >
                                    {/* Line 1: Nama Desa */}
                                    <tspan 
                                      x={textX.toFixed(1)} 
                                      dy="-4" 
                                      className={`text-[10px] font-black font-headline ${isActive ? 'fill-indigo-900 text-xs' : 'fill-slate-900'}`}
                                    >
                                      {d.desa.toUpperCase()}
                                    </tspan>
                                    {/* Line 2: Luas Wilayah & Persentase */}
                                    <tspan 
                                      x={textX.toFixed(1)} 
                                      dy="11" 
                                      fill={color} 
                                      className="text-[9px] font-extrabold"
                                    >
                                      {d.luasKm2.toFixed(2)} km² ({d.persentaseLuas.toFixed(2)}%)
                                    </tspan>
                                  </text>
                                </g>
                              );
                            });
                          })()}

                          {/* Central Inner Badge */}
                          <circle cx="350" cy="250" r="75" fill="#1E1B4B" className="shadow-2xl" />
                          <circle cx="350" cy="250" r="72" fill="none" stroke="#4F46E5" strokeWidth="2" strokeDasharray="4,3" />

                          <text x="350" y="238" textAnchor="middle" className="text-[20px] font-black fill-white font-headline pointer-events-none">
                            119,26
                          </text>
                          <text x="350" y="254" textAnchor="middle" className="text-[8px] font-black fill-sky-300 tracking-widest uppercase pointer-events-none">
                            KM² LUAS WILAYAH
                          </text>
                          <text x="350" y="268" textAnchor="middle" className="text-[7px] font-bold fill-slate-300 tracking-wider uppercase pointer-events-none">
                            14 DESA TERDAFTAR
                          </text>

                        </svg>
                      </div>

                      {/* Footer Legend Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mt-4 w-full">
                        {[...geografiDesaData].sort((a, b) => b.luasKm2 - a.luasKm2).map((d, index) => {
                          const color = sliceColors[index % sliceColors.length];
                          const isActive = activeSlice === d.desa;

                          return (
                            <div
                              key={d.desa}
                              onMouseEnter={() => setActiveSlice(d.desa)}
                              onMouseLeave={() => setActiveSlice(null)}
                              className={`p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between text-center ${isActive ? 'bg-indigo-50 border-indigo-300 scale-105 shadow-md' : 'bg-white/80 border-slate-200/80 hover:bg-slate-50'}`}
                            >
                              <div className="flex items-center justify-center gap-1">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                                <span className="text-[10px] font-black text-slate-900 truncate">{d.desa}</span>
                              </div>
                              <span className="text-[10px] font-extrabold mt-1" style={{ color }}>
                                {d.luasKm2} km²
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* VIEW 2: BAR CHART (ALTERNATIF BARRING VISUAL) */}
                  {viewType === 'bar' && (
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between border-b border-sky-100 pb-2">
                        <span className="text-xs font-bold text-slate-700">Urutkan Data Berdasarkan:</span>
                        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-sky-200 shadow-sm text-xs font-bold">
                          <button
                            onClick={() => setSelectedSort('luas')}
                            className={`px-3 py-1 rounded-lg transition-all ${selectedSort === 'luas' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                          >
                            Luas (km²)
                          </button>
                          <button
                            onClick={() => setSelectedSort('jarakKec')}
                            className={`px-3 py-1 rounded-lg transition-all ${selectedSort === 'jarakKec' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                          >
                            Ke Kec. (km)
                          </button>
                          <button
                            onClick={() => setSelectedSort('jarakKab')}
                            className={`px-3 py-1 rounded-lg transition-all ${selectedSort === 'jarakKab' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                          >
                            Ke Kab. (km)
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                        {sortedData.map((d, index) => {
                          const barPercent = selectedSort === 'luas' 
                            ? (d.luasKm2 / maxLuas) * 100 
                            : selectedSort === 'jarakKec' 
                              ? (d.jarakKeKecKm / 16) * 100 
                              : (d.jarakKeKabKm / 63) * 100;

                          const barColor = selectedSort === 'luas' 
                            ? 'from-sky-500 to-indigo-600' 
                            : selectedSort === 'jarakKec' 
                              ? 'from-indigo-600 to-purple-600' 
                              : 'from-emerald-500 to-teal-600';

                          return (
                            <motion.div
                              key={d.desa}
                              initial={{ opacity: 0, x: -15 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.4, delay: index * 0.03 }}
                              whileHover={{ x: 4 }}
                              className="group bg-white/80 p-2.5 rounded-2xl border border-sky-100 shadow-sm hover:border-sky-300 transition-all cursor-pointer space-y-1.5"
                            >
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-slate-800 font-headline flex items-center gap-1.5 group-hover:text-sky-600 transition-colors">
                                  <span className="w-5 h-5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-black flex items-center justify-center">
                                    #{d.no}
                                  </span>
                                  {d.desa}
                                </span>
                                <span className="text-slate-900 font-black">
                                  {selectedSort === 'luas' ? (
                                    <>{d.luasKm2} km² <span className="text-[10px] font-semibold text-slate-500">({d.persentaseLuas}%)</span></>
                                  ) : selectedSort === 'jarakKec' ? (
                                    <>{d.jarakKeKecKm} km <span className="text-[10px] font-semibold text-slate-500">(ke Kec)</span></>
                                  ) : (
                                    <>{d.jarakKeKabKm} km <span className="text-[10px] font-semibold text-slate-500">(ke Kab)</span></>
                                  )}
                                </span>
                              </div>

                              {/* Progress Bar */}
                              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/80">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${barPercent}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.8, delay: 0.1 + index * 0.02, ease: "easeOut" }}
                                  className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
                                />
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* EXPANDABLE FULL 14-VILLAGE DATA TABLE MATCHING USER DATASET */}
          <AnimatePresence>
            {showTable && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-xl p-4 sm:p-6 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-base font-extrabold text-slate-900 font-headline flex items-center gap-2">
                    <Table className="w-4 h-4 text-sky-600" />
                    Tabel Rekapitulasi Kondisi Geografis 14 Desa di Kecamatan Gandrungmangu (2024)
                  </h4>
                  <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                    Data Resmi 2024
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-sky-900 via-indigo-900 to-emerald-900 text-white font-black uppercase text-center border-b border-sky-700">
                        <th className="px-3 py-2.5 w-10 border border-sky-700">NO</th>
                        <th className="px-4 py-2.5 text-left border border-sky-700">DESA</th>
                        <th className="px-3 py-2.5 border border-sky-700">LUAS WILAYAH (KM²)</th>
                        <th className="px-3 py-2.5 border border-sky-700">PERSENTASE (%)</th>
                        <th className="px-3 py-2.5 border border-sky-700">JARAK KE IBUKOTA KEC. (KM)</th>
                        <th className="px-3 py-2.5 border border-sky-700">JARAK KE IBUKOTA KAB. (KM)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-100 bg-slate-50/50">
                      {geografiDesaData.map((row) => (
                        <tr key={row.no} className="hover:bg-sky-100/60 transition-colors text-center font-medium text-slate-800">
                          <td className="border border-slate-200 px-2 py-2 font-bold text-slate-600">{row.no}</td>
                          <td className="border border-slate-200 px-4 py-2 text-left font-bold text-slate-900 italic flex items-center justify-between">
                            <span>{row.desa}</span>
                            {row.desa === 'Sidaurip' && <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">Terluas</span>}
                            {row.desa === 'Gandrungmangu' && <span className="text-[9px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">Terkecil</span>}
                          </td>
                          <td className="border border-slate-200 px-3 py-2 font-bold text-sky-800">{row.luasKm2.toFixed(2)}</td>
                          <td className="border border-slate-200 px-3 py-2 font-bold text-indigo-800">{row.persentaseLuas.toFixed(2)}%</td>
                          <td className="border border-slate-200 px-3 py-2 font-semibold">{row.jarakKeKecKm} km</td>
                          <td className="border border-slate-200 px-3 py-2 font-semibold">{row.jarakKeKabKm} km</td>
                        </tr>
                      ))}
                      {/* Total Row */}
                      <tr className="bg-gradient-to-r from-sky-950 via-indigo-950 to-emerald-950 text-white font-black text-center text-xs uppercase">
                        <td colSpan={2} className="border border-sky-800 px-4 py-2.5 text-left">TOTAL KECAMATAN GANDRUNGMANGU</td>
                        <td className="border border-sky-800 px-3 py-2.5 text-sky-300 font-extrabold text-sm">{totalGeografiKecamatan.luasTotalKm2.toFixed(2)} km²</td>
                        <td className="border border-sky-800 px-3 py-2.5 text-indigo-300 font-extrabold text-sm">100,00%</td>
                        <td className="border border-sky-800 px-3 py-2.5 text-slate-300">-</td>
                        <td className="border border-sky-800 px-3 py-2.5 text-emerald-300 font-extrabold text-sm">73 km (Kec. ke Kab.)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </section>
  );
}

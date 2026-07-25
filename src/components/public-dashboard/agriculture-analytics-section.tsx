'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sprout, 
  Tractor, 
  Droplets, 
  TreePine, 
  Wheat, 
  Users, 
  Building2, 
  BarChart3, 
  PieChart as PieChartIcon, 
  CheckCircle2, 
  AlertCircle, 
  Compass, 
  Sun, 
  CloudRain, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  Layers,
  Milk,
  Beef,
  Feather,
  Wrench,
  BadgePercent
} from 'lucide-react';

export function AgricultureAnalyticsSection() {
  const [activeTab, setActiveTab] = useState<'lahan' | 'komoditas' | 'kelembagaan' | 'alsintan'>('lahan');

  // Penggunaan Lahan Donut Slices Data (14.319 Ha)
  const lahanSlices = [
    { label: 'Sawah Irigasi Teknis', ha: 3629, pct: 25.3, color: '#059669', gradient: 'from-emerald-600 to-teal-500' },
    { label: 'Sawah Tadah Hujan', ha: 1532, pct: 10.7, color: '#10B981', gradient: 'from-emerald-400 to-green-500' },
    { label: 'Tegal / Kebun', ha: 3554, pct: 24.8, color: '#D97706', gradient: 'from-amber-500 to-yellow-600' },
    { label: 'Hutan Negara', ha: 2288, pct: 16.0, color: '#047857', gradient: 'from-green-700 to-emerald-800' },
    { label: 'Lahan Bukan Pertanian', ha: 2875, pct: 20.1, color: '#6366F1', gradient: 'from-indigo-500 to-blue-600' },
  ];

  const totalLahanHa = 14319;

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 border-t border-emerald-100/90 space-y-8">
      
      {/* SECTION HEADER & TITLE */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-100 pb-4 sm:pb-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-[10px] sm:text-xs font-black tracking-widest text-emerald-800 uppercase bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-xs flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-600" />
              SEKTOR PERTANIAN & PETERNAKAN
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl lg:text-4xl font-black font-headline tracking-tight leading-tight text-slate-900">
            Sektor Pertanian & Peternakan 14 Desa
          </h2>

          <p className="text-xs sm:text-base text-slate-600 leading-relaxed mt-1 font-medium max-w-3xl">
            Rekapitulasi Penggunaan Lahan, Demografi Petani, Kelembagaan Tani, Komoditas Unggulan, Populasi Ternak, dan Alsintan Kecamatan Gandrungmangu.
          </p>
        </div>

        {/* STAT BADGE SUMMARY IN HEADER */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 text-white p-3 rounded-2xl shadow-md self-start lg:self-auto">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
            <Tractor className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-100 font-bold uppercase block tracking-wider">Petani Utama</span>
            <span className="text-lg font-black font-headline tracking-tight">36.415 Orang</span>
          </div>
        </div>
      </div>

      {/* 5 TOP SUMMARY HIGHLIGHT CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Card 1: Luas Wilayah Lahan */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white p-4 rounded-2xl border border-emerald-200/90 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold shadow-xs">
              <TreePine className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 uppercase">
              LUAS LAHAN
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Luas Wilayah</p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-headline mt-0.5 tracking-tight">
            14.319 <span className="text-xs font-bold text-emerald-700">Ha</span>
          </h3>
          <p className="text-[10px] text-slate-600 font-medium mt-1">Sawah: 5.161 Ha (36,0%)</p>
        </motion.div>

        {/* Card 2: Produksi Padi Sawah */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-amber-50/90 via-yellow-50/40 to-white p-4 rounded-2xl border border-amber-200/90 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Wheat className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200 uppercase">
              PADI SAWAH
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Produksi Padi Sawah</p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-headline mt-0.5 tracking-tight">
            60.281 <span className="text-xs font-bold text-amber-700">Ton</span>
          </h3>
          <p className="text-[10px] text-slate-600 font-medium mt-1">Luas Tanam: 9.637 Ha</p>
        </motion.div>

        {/* Card 3: Kelembagaan Tani */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-sky-50/90 via-blue-50/40 to-white p-4 rounded-2xl border border-sky-200/90 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-black text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full border border-sky-200 uppercase">
              KELEMBAGAAN
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Kelembagaan</p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-headline mt-0.5 tracking-tight">
            253 <span className="text-xs font-bold text-sky-700">Kelompok</span>
          </h3>
          <p className="text-[10px] text-slate-600 font-medium mt-1">114 Poktan & 14 Gapoktan</p>
        </motion.div>

        {/* Card 4: Populasi Ternak */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-purple-50/90 via-indigo-50/40 to-white p-4 rounded-2xl border border-purple-200/90 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Feather className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200 uppercase">
              PETERNAKAN
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Populasi Ternak</p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-headline mt-0.5 tracking-tight">
            73.218 <span className="text-xs font-bold text-purple-700">Ekor</span>
          </h3>
          <p className="text-[10px] text-slate-600 font-medium mt-1">Ayam, Kambing, & Sapi</p>
        </motion.div>

        {/* Card 5: Kebutuhan & Defisit Alsintan */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-teal-50/90 via-cyan-50/40 to-white p-4 rounded-2xl border border-teal-200/90 shadow-sm hover:shadow-md transition-all col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Wrench className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-black text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full border border-teal-200 uppercase">
              ALSINTAN
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mekanisasi Pertanian</p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-headline mt-0.5 tracking-tight">
            402 <span className="text-xs font-bold text-teal-700">Unit</span>
          </h3>
          <p className="text-[10px] text-slate-600 font-medium mt-1">181 Traktor & 221 Pompa Air</p>
        </motion.div>

      </div>

      {/* TAB NAVIGATION FOR DETAILS */}
      <div className="flex items-center gap-1.5 bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300 shadow-inner flex-wrap">
        <button
          onClick={() => setActiveTab('lahan')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'lahan'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <PieChartIcon className="w-3.5 h-3.5" />
          <span>Penggunaan Lahan & Fisik</span>
        </button>

        <button
          onClick={() => setActiveTab('komoditas')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'komoditas'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Wheat className="w-3.5 h-3.5" />
          <span>Komoditas & Peternakan</span>
        </button>

        <button
          onClick={() => setActiveTab('kelembagaan')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'kelembagaan'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Kelembagaan Tani</span>
        </button>

        <button
          onClick={() => setActiveTab('alsintan')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'alsintan'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Irigasi & Alsintan</span>
        </button>
      </div>

      {/* TAB CONTENT PANELS */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: PENGGUNAAN LAHAN & FISIK */}
        {activeTab === 'lahan' && (
          <motion.div
            key="lahan"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* LEFT 7 COLS: INFOGRAPHIC PIE CHART LAHAN */}
            <div className="lg:col-span-7 bg-slate-50/90 rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 font-headline flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-emerald-600" />
                  Diagram Proporsi Penggunaan Lahan (14.319 Ha)
                </h3>
                <p className="text-xs text-slate-500 font-medium">Distribusi Lahan Sawah, Kebun/Tegal, Hutan, & Non-Pertanian</p>
              </div>

              {/* DONUT PIE CHART SVG WITH CALLOUT LINES */}
              <div className="flex flex-col items-center justify-center relative py-2">
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                  <svg viewBox="0 0 320 320" className="w-full h-full drop-shadow-xl overflow-visible">
                    {(() => {
                      let cumulativeAngle = -90;
                      const r = 78;
                      const strokeWidth = 32;
                      const circumference = 2 * Math.PI * r;

                      return lahanSlices.map((slice, index) => {
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
                        const rElbow = 115 + (index % 2) * 12;

                        const x1 = 160 + rStart * Math.cos(rad);
                        const y1 = 160 + rStart * Math.sin(rad);
                        const x2 = 160 + rElbow * Math.cos(rad);
                        const y2 = 160 + rElbow * Math.sin(rad);

                        const isRight = Math.cos(rad) >= -0.1;
                        const x3 = isRight ? Math.max(x2 + 15, 190) : Math.min(x2 - 15, 130);

                        return (
                          <g key={slice.label} className="group cursor-pointer">
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
                              className="transition-all duration-300 hover:stroke-[38] opacity-95 hover:opacity-100"
                            >
                              <title>{`${slice.label}: ${slice.ha.toLocaleString('id-ID')} Ha (${slice.pct}%)`}</title>
                            </circle>

                            <polyline
                              points={`${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)} ${x3.toFixed(1)},${y2.toFixed(1)}`}
                              stroke={slice.color}
                              strokeWidth="1.5"
                              strokeDasharray="2,2"
                              fill="none"
                              className="opacity-80"
                            />
                            <circle cx={x1.toFixed(1)} cy={y1.toFixed(1)} r="2.5" fill={slice.color} />

                            <circle cx={x3.toFixed(1)} cy={y2.toFixed(1)} r="7" fill={slice.color} />
                            <text x={x3.toFixed(1)} y={(y2 + 2.5).toFixed(1)} textAnchor="middle" fill="#FFF" className="text-[7px] font-black font-mono">
                              0{index + 1}
                            </text>

                            <text
                              x={isRight ? (x3 + 10).toFixed(1) : (x3 - 10).toFixed(1)}
                              y={y2.toFixed(1)}
                              textAnchor={isRight ? "start" : "end"}
                              className="pointer-events-none select-none"
                            >
                              <tspan x={isRight ? (x3 + 10).toFixed(1) : (x3 - 10).toFixed(1)} dy="-2" className="text-[8px] font-black fill-slate-900">
                                {slice.label}
                              </tspan>
                              <tspan x={isRight ? (x3 + 10).toFixed(1) : (x3 - 10).toFixed(1)} dy="9" fill={slice.color} className="text-[7.5px] font-black">
                                {`${slice.ha.toLocaleString('id-ID')} Ha (${slice.pct}%)`}
                              </tspan>
                            </text>
                          </g>
                        );
                      });
                    })()}

                    {/* CENTER CORE EMBLEM */}
                    <foreignObject x="105" y="105" width="110" height="110" className="overflow-visible">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 border-4 border-white shadow-2xl flex flex-col items-center justify-center text-white text-center p-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-400 text-slate-900 flex items-center justify-center font-black shadow-md mb-0.5">
                          <TreePine className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-black font-headline leading-none mt-0.5">14.319 Ha</span>
                        <span className="text-[7px] font-bold tracking-widest uppercase text-emerald-300 mt-0.5">LUAS WILAYAH</span>
                      </div>
                    </foreignObject>
                  </svg>
                </div>
              </div>

              {/* CARDS BREAKDOWN GRID BELOW CHART */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                {lahanSlices.map((slice, index) => (
                  <div key={slice.label} className={`p-2 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between ${index === 4 ? 'col-span-2' : ''}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-md bg-gradient-to-r ${slice.gradient} text-white flex items-center justify-center font-black font-mono text-[9px]`}>
                        0{index + 1}
                      </div>
                      <span className="text-[11px] font-bold text-slate-800">{slice.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-black text-slate-900">{slice.ha.toLocaleString('id-ID')} Ha</span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded ml-1">{slice.pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT 5 COLS: TOPOGRAFI, IKLIM, & JENIS TANAH */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Card Topografi & Elevasi */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center gap-2.5 text-emerald-800 font-extrabold font-headline text-sm border-b border-slate-100 pb-2">
                  <Compass className="w-4 h-4 text-emerald-600" />
                  Topografi & Elevasi Ketinggian
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-100 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Daerah Aliran Sungai</span>
                    <span className="text-sm font-black text-emerald-900">60% Datar • 40% Pegunungan</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-teal-50/80 border border-teal-100 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Ketinggian Elevasi</span>
                    <span className="text-sm font-black text-teal-900">4 mdpl – 45 mdpl</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  📍 Elevasi terrendah di <strong className="text-slate-900">Desa Gintungreja (4 mdpl)</strong> dan tertinggi di <strong className="text-slate-900">Desa Rungkang (45 mdpl)</strong> dengan kemiringan lereng 0–2% di hilir hingga &gt;15% di hulu.
                </p>
              </div>

              {/* Card Iklim & Curah Hujan */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center gap-2.5 text-sky-800 font-extrabold font-headline text-sm border-b border-slate-100 pb-2">
                  <CloudRain className="w-4 h-4 text-sky-600" />
                  Iklim & Curah Hujan Historis
                </div>

                <div className="p-3 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Curah Hujan Tertinggi</span>
                    <span className="text-base font-black text-sky-900">4.420 mm / tahun</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-sky-600 text-white font-black text-xs shadow-xs">
                    Tahun 2016
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Kecamatan ini memiliki tipe iklim tropis dengan musim kemarau dan penghujan yang jelas serta ketersediaan pasokan air tanah yang melimpah.
                </p>
              </div>

              {/* Card Jenis Tanah */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center gap-2.5 text-indigo-800 font-extrabold font-headline text-sm border-b border-slate-100 pb-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Karakteristik Jenis Tanah
                </div>

                <div className="space-y-1.5 text-xs font-semibold text-slate-700">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span>🌱 Tanah Alluvial (Subur Persawahan)</span>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">Mendominasi</span>
                  </div>
                  <p className="text-[11px] text-slate-500 pl-2">
                    Mendominasi wilayah persawahan datar seperti Desa Cisumur, Gintungreja, Sidaurip, dan Layansari. Terdapat pula jenis tanah Grumosol & Mediteran.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 2: KOMODITAS & PETERNAKAN */}
        {activeTab === 'komoditas' && (
          <motion.div
            key="komoditas"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* LEFT 7 COLS: TANAMAN PANGAN & HORTIKULTURA */}
            <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 font-headline flex items-center gap-2">
                    <Wheat className="w-4 h-4 text-amber-600" />
                    Tanaman Pangan & Hortikultura (Realisasi 2024)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Hasil Produksi dan Luas Tanam Komoditas Unggulan</p>
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                  Data 2024
                </span>
              </div>

              {/* TANAMAN PANGAN GRID */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tanaman Pangan Utama</h4>

                {/* Padi Sawah */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-extrabold text-amber-950 font-headline block">🌾 Padi Sawah</span>
                    <span className="text-[11px] text-slate-600 font-medium">Luas Tanam: 9.637 Ha</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-amber-900 font-headline block">60.280,91 Ton</span>
                    <span className="text-[10px] font-bold text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-200">Produksi Utama</span>
                  </div>
                </div>

                {/* Ubi Kayu (Singkong) */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-extrabold text-slate-900 font-headline block">🍠 Ubi Kayu (Singkong)</span>
                    <span className="text-[11px] text-slate-600 font-medium">Luas Tanam: 1.278 Ha</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-slate-900 font-headline block">26.478,66 Ton</span>
                    <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">Palawija</span>
                  </div>
                </div>

                {/* Grid Padi Gogo & Jagung */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-extrabold text-slate-900 block">🌱 Padi Gogo</span>
                    <span className="text-sm font-black text-emerald-800 block mt-1">3.097,85 Ton</span>
                    <span className="text-[10px] text-slate-500 font-medium">Tanam: 1.120 Ha</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-extrabold text-slate-900 block">🌽 Jagung</span>
                    <span className="text-sm font-black text-amber-800 block mt-1">915,20 Ton</span>
                    <span className="text-[10px] text-slate-500 font-medium">Tanam: 203 Ha</span>
                  </div>
                </div>
              </div>

              {/* HORTIKULTURA & PERKEBUNAN */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hortikultura & Perkebunan Unggulan</h4>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200">
                    <span className="text-[10px] font-bold text-orange-700 block">🍊 Jeruk</span>
                    <span className="text-xs font-black text-orange-950 block mt-0.5">239,53 Ton</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-yellow-50 border border-yellow-200">
                    <span className="text-[10px] font-bold text-yellow-700 block">🍌 Pisang</span>
                    <span className="text-xs font-black text-yellow-950 block mt-0.5">153,24 Ton</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                    <span className="text-[10px] font-bold text-rose-700 block">🥭 Pepaya</span>
                    <span className="text-xs font-black text-rose-950 block mt-0.5">682,39 Ton</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1">
                  <span className="text-xs font-extrabold text-emerald-950 font-headline block">🥥 Perkebunan Kelapa Deres & Kelapa Dalam</span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    Kelapa Deres untuk produksi <strong className="text-emerald-900">Gula Merah</strong> (Tanam 642,1 Ha) dan Kelapa Dalam (Tanam 910,2 Ha diproses menjadi Kopra).
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT 5 COLS: POPULASI PETERNAKAN */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-purple-800/80 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold font-headline flex items-center gap-2 text-white">
                      <Feather className="w-4 h-4 text-purple-300" />
                      Populasi Ternak Kecamatan
                    </h3>
                    <p className="text-xs text-purple-200 font-medium">Total Populasi: 73.218 Ekor</p>
                  </div>
                  <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                    🐄
                  </span>
                </div>

                {/* POPULASI TERNAK ITEM 1: AYAM BURAS */}
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/30 text-purple-200 flex items-center justify-center font-bold">
                      🐔
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-headline">Ayam Buras</h4>
                      <p className="text-[10px] text-purple-200">Unggas Dominan</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-white font-headline">59.683</span>
                    <span className="text-[10px] text-purple-300 block font-semibold">Ekor</span>
                  </div>
                </div>

                {/* POPULASI TERNAK ITEM 2: KAMBING / DOMBA */}
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/30 text-indigo-200 flex items-center justify-center font-bold">
                      🐐
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-headline">Kambing / Domba</h4>
                      <p className="text-[10px] text-purple-200">Ternak Kecil</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-white font-headline">12.976</span>
                    <span className="text-[10px] text-purple-300 block font-semibold">Ekor</span>
                  </div>
                </div>

                {/* POPULASI TERNAK ITEM 3: SAPI / KERBAU */}
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/30 text-emerald-200 flex items-center justify-center font-bold">
                      🐄
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-headline">Sapi / Kerbau</h4>
                      <p className="text-[10px] text-purple-200">Ternak Besar</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-white font-headline">559</span>
                    <span className="text-[10px] text-purple-300 block font-semibold">Ekor</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-purple-800/60 text-center">
                  <span className="text-[11px] font-medium text-purple-200">
                    Didukung 39 Kelompok Ternak (16 Pemula & 23 Lanjut)
                  </span>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 3: KELEMBAGAAN TANI */}
        {activeTab === 'kelembagaan' && (
          <motion.div
            key="kelembagaan"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 font-headline flex items-center gap-2">
                    <Users className="w-4 h-4 text-sky-600" />
                    Kelembagaan Pertanian & Pelaku Utama (253 Kelompok)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Rekapitulasi Poktan, Gapoktan, P3A, KWT, Kelompok Ternak, & Lumbung Pangan</p>
                </div>

                <span className="text-xs font-black px-3 py-1 rounded-xl bg-sky-50 text-sky-800 border border-sky-200">
                  Total: 253 Kelompok
                </span>
              </div>

              {/* 6 KELEMBAGAAN GRID CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                
                {/* 1. Poktan */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900 font-headline">🌾 Kelompok Tani (Poktan)</span>
                    <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">114 Kelompok</span>
                  </div>
                  <p className="text-xs text-slate-600">Rincian Kelas: 14 Pemula • 72 Lanjut • 22 Madya</p>
                </div>

                {/* 2. Gapoktan */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900 font-headline">🏛️ Gapoktan</span>
                    <span className="text-sm font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">14 Gapoktan</span>
                  </div>
                  <p className="text-xs text-slate-600">Terdapat 14 Gapoktan (13 Lanjut & 1 Madya)</p>
                </div>

                {/* 3. P3A */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900 font-headline">💧 P3A (Pemakai Air)</span>
                    <span className="text-sm font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">18 Kelompok</span>
                  </div>
                  <p className="text-xs text-slate-600">Rincian Kelas: 5 Pemula • 12 Lanjut • 1 Madya</p>
                </div>

                {/* 4. KWT */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900 font-headline">👩‍🌾 Kelompok Wanita Tani (KWT)</span>
                    <span className="text-sm font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">21 Kelompok</span>
                  </div>
                  <p className="text-xs text-slate-600">Rincian Kelas: 10 Pemula • 9 Lanjut</p>
                </div>

                {/* 5. Kelompok Ternak */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900 font-headline">🐄 Kelompok Ternak</span>
                    <span className="text-sm font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">39 Kelompok</span>
                  </div>
                  <p className="text-xs text-slate-600">Rincian Kelas: 16 Pemula • 23 Lanjut</p>
                </div>

                {/* 6. Lumbung Pangan */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900 font-headline">🏬 Lumbung Pangan</span>
                    <span className="text-sm font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">37 Kelompok</span>
                  </div>
                  <p className="text-xs text-slate-600">Rincian Kelas: 31 Pemula • 6 Lanjut</p>
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: IRIGASI & ALSINTAN */}
        {activeTab === 'alsintan' && (
          <motion.div
            key="alsintan"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* LEFT 6 COLS: KONDISI IRIGASI (JIDES) */}
            <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 font-headline flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  Kondisi Jaringan Irigasi Desa (JIDES)
                </h3>
                <p className="text-xs text-slate-500 font-medium">Dari Total 5.161 Ha Lahan Baku Sawah</p>
              </div>

              {/* PROGRESS BAR IRIGASI BAIK */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-emerald-800">✅ Irigasi Kondisi Baik (23,2%)</span>
                  <span className="text-emerald-700 font-black">1.201,1 Ha</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '23.2%' }} />
                </div>
              </div>

              {/* PROGRESS BAR IRIGASI RUSAK BERAT */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-rose-800">⚠️ Irigasi Rusak Berat (26,8%)</span>
                  <span className="text-rose-700 font-black">1.380,9 Ha</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '26.8%' }} />
                </div>
              </div>

              {/* PROGRESS BAR IRIGASI SEDANG / RINGAN */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-amber-800">🛠️ Irigasi Rusak Ringan/Sedang (50,0%)</span>
                  <span className="text-amber-700 font-black">2.579,0 Ha</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '50.0%' }} />
                </div>
              </div>
            </div>

            {/* RIGHT 6 COLS: ALSINTAN & DEFISIT */}
            <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 font-headline flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-teal-600" />
                  Ketersediaan Alsintan & Defisit Mekanisasi
                </h3>
                <p className="text-xs text-slate-500 font-medium">Perbandingan Ketersediaan vs Kebutuhan Ideal Alsintan</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Hand Traktor */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-xs font-extrabold text-slate-900 font-headline block">🚜 Hand Traktor</span>
                  <div className="text-xs font-bold text-slate-700 space-y-0.5">
                    <p>Tersedia: <strong className="text-emerald-700">181 Unit</strong></p>
                    <p>Ideal: <strong className="text-slate-900">318 Unit</strong></p>
                    <p className="text-rose-600 font-black pt-1">Defisit: -125 Unit</p>
                  </div>
                </div>

                {/* Pompa Air */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-xs font-extrabold text-slate-900 font-headline block">💧 Pompa Air</span>
                  <div className="text-xs font-bold text-slate-700 space-y-0.5">
                    <p>Tersedia: <strong className="text-sky-700">221 Unit</strong></p>
                    <p>Ideal: <strong className="text-slate-900">427 Unit</strong></p>
                    <p className="text-rose-600 font-black pt-1">Defisit: -206 Unit</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </section>
  );
}

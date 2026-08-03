'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Store, 
  Landmark, 
  TrendingUp, 
  Briefcase, 
  ShoppingBag, 
  Utensils, 
  Coins, 
  Handshake, 
  Building, 
  Sparkles,
  PieChart as PieChartIcon,
  CheckCircle2,
  Users,
  ShieldCheck,
  BadgePercent,
  Layers,
  Search,
  Phone,
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Flame,
  ChefHat,
  Package,
  Tag,
  ChevronLeft,
  ChevronRight,
  Filter,
  Factory
} from 'lucide-react';
import { sppgMbgDataset, sppgMbgSummary } from '@/lib/sppg-mbg-data';
import { umkmDataset, umkmSummary, UmkmData } from '@/lib/umkm-data';

export function EconomyAnalyticsSection() {
  const [activeTab, setActiveTab] = useState<'perdagangan' | 'umkm' | 'sppg' | 'kelembagaan' | 'perbankan'>('perdagangan');
  
  // SPPG Filters
  const [sppgFilterStatus, setSppgFilterStatus] = useState<'ALL' | 'AKTIF' | 'BELUM AKTIF'>('ALL');
  const [sppgSearchQuery, setSppgSearchQuery] = useState('');

  // UMKM Filters & Pagination
  const [umkmFilterDesa, setUmkmFilterDesa] = useState<string>('ALL');
  const [umkmFilterCategory, setUmkmFilterCategory] = useState<string>('ALL');
  const [umkmSearchQuery, setUmkmSearchQuery] = useState('');
  const [umkmPage, setUmkmPage] = useState(1);
  const umkmPerPage = 25;

  // Infographic Slices for Perdagangan & Niaga Sarana Desa (14 Desa)
  const perdaganganSlices = [
    { label: 'Ritel Modern (Minimarket)', count: 10, pct: 71.4, color: '#0EA5E9', gradient: 'from-sky-500 to-indigo-600' },
    { label: 'Pasar Tradisional Permanen', count: 6, pct: 42.9, color: '#059669', gradient: 'from-emerald-600 to-teal-500' },
    { label: 'Penyedia Jasa Kuliner', count: 6, pct: 42.9, color: '#E11D48', gradient: 'from-rose-500 to-red-600' },
    { label: 'Kelompok Pertokoan Aktif', count: 5, pct: 35.7, color: '#D97706', gradient: 'from-amber-500 to-orange-600' },
    { label: 'Pasar Semi-Permanen', count: 3, pct: 21.4, color: '#8B5CF6', gradient: 'from-purple-500 to-indigo-600' },
  ];

  // Filtered SPPG Dataset
  const filteredSppgData = useMemo(() => {
    return sppgMbgDataset.filter((item) => {
      const matchStatus = sppgFilterStatus === 'ALL' || item.status === sppgFilterStatus;
      const q = sppgSearchQuery.toLowerCase();
      const matchSearch = 
        item.namaSppg.toLowerCase().includes(q) ||
        item.alamat.toLowerCase().includes(q) ||
        item.namaYayasan.toLowerCase().includes(q) ||
        item.sppiPicMitra.toLowerCase().includes(q) ||
        item.ket.toLowerCase().includes(q) ||
        item.village.toLowerCase().includes(q);

      return matchStatus && matchSearch;
    });
  }, [sppgFilterStatus, sppgSearchQuery]);

  // Filtered UMKM Dataset
  const filteredUmkmData = useMemo(() => {
    return umkmDataset.filter((item) => {
      const matchDesa = umkmFilterDesa === 'ALL' || item.village.toLowerCase() === umkmFilterDesa.toLowerCase();
      const matchCategory = umkmFilterCategory === 'ALL' || item.category === umkmFilterCategory;
      const q = umkmSearchQuery.toLowerCase();
      const matchSearch = 
        item.nama.toLowerCase().includes(q) ||
        item.produk.toLowerCase().includes(q) ||
        item.alamat.toLowerCase().includes(q) ||
        item.village.toLowerCase().includes(q);

      return matchDesa && matchCategory && matchSearch;
    });
  }, [umkmFilterDesa, umkmFilterCategory, umkmSearchQuery]);

  // Paginated UMKM Dataset
  const paginatedUmkmData = useMemo(() => {
    const start = (umkmPage - 1) * umkmPerPage;
    return filteredUmkmData.slice(start, start + umkmPerPage);
  }, [filteredUmkmData, umkmPage]);

  const totalUmkmPages = Math.ceil(filteredUmkmData.length / umkmPerPage) || 1;

  // List of Villages for Dropdown Filter
  const villageListOptions = useMemo(() => {
    const villages = Array.from(new Set(umkmDataset.map(u => u.village))).sort();
    return villages;
  }, []);

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-yellow-50/70 rounded-3xl border border-amber-300/90 shadow-md my-6 space-y-8">
      
      {/* SECTION HEADER & TITLE */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-indigo-100 pb-4 sm:pb-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-[10px] sm:text-xs font-black tracking-widest text-indigo-700 uppercase bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-200 shadow-xs flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              SEKTOR EKONOMI, KELEMBAGAAN & UMKM
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl lg:text-4xl font-black font-headline tracking-tight leading-tight text-slate-900">
            Sektor Ekonomi, Kelembagaan, UMKM & SPPG (Dapur MBG)
          </h2>

          <p className="text-xs sm:text-base text-slate-600 leading-relaxed mt-1 font-medium max-w-3xl">
            Rekapitulasi 629 UMKM Terdaftar, Sarana Perdagangan, BUMDes, Koperasi Merah Putih, Perbankan, serta Data Satuan Pelayanan Pemenuhan Gizi (SPPG / Dapur MBG) 14 Desa.
          </p>
        </div>

        {/* HEADER STAT BADGES */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Badge 1: UMKM */}
          <div className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-3 px-4 rounded-2xl shadow-md">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-100 font-bold uppercase block tracking-wider">UMKM Terdaftar</span>
              <span className="text-lg font-black font-headline tracking-tight">629 Usaha</span>
            </div>
          </div>

          {/* Badge 2: SPPG */}
          <div className="flex items-center gap-2.5 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white p-3 px-4 rounded-2xl shadow-md">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] text-amber-100 font-bold uppercase block tracking-wider">Dapur MBG (SPPG)</span>
              <span className="text-lg font-black font-headline tracking-tight">17 Lokasi</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 TOP SUMMARY HIGHLIGHT CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Card 1: UMKM Terdaftar (NEW!) */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          onClick={() => setActiveTab('umkm')}
          className="bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white p-4 rounded-2xl border border-emerald-300/90 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
              <Store className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 uppercase">
              14 DESA
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">UMKM Terdaftar</p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-headline mt-0.5 tracking-tight">
            629 <span className="text-xs font-bold text-emerald-700">Usaha</span>
          </h3>
          <p className="text-[10px] text-slate-600 font-medium mt-1">236 Tempe/Tahu | 137 Snack</p>
        </motion.div>

        {/* Card 2: SPPG Dapur MBG */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          onClick={() => setActiveTab('sppg')}
          className="bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white p-4 rounded-2xl border border-amber-300/90 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
              <ChefHat className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 uppercase">
              9 AKTIF
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dapur MBG (SPPG)</p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-headline mt-0.5 tracking-tight">
            17 <span className="text-xs font-bold text-amber-700">Unit</span>
          </h3>
          <p className="text-[10px] text-slate-600 font-medium mt-1">9 Operasional | 8 Persiapan</p>
        </motion.div>

        {/* Card 3: BUMDes Terbentuk */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          onClick={() => setActiveTab('kelembagaan')}
          className="bg-gradient-to-br from-indigo-50/90 via-sky-50/40 to-white p-4 rounded-2xl border border-indigo-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-200 uppercase">
              100% DESA
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Unit Usaha BUMDes</p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-headline mt-0.5 tracking-tight">
            14 <span className="text-xs font-bold text-indigo-700">Desa</span>
          </h3>
          <p className="text-[10px] text-slate-600 font-medium mt-1">Terbentuk di 100% Desa</p>
        </motion.div>

        {/* Card 4: BUMDesma Kecamatan */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          onClick={() => setActiveTab('kelembagaan')}
          className="bg-gradient-to-br from-purple-50/90 via-pink-50/40 to-white p-4 rounded-2xl border border-purple-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Handshake className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200 uppercase">
              KONSOLIDASI
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">BUMDesma Kecamatan</p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-headline mt-0.5 tracking-tight">
            1 <span className="text-xs font-bold text-purple-700">Lembaga</span>
          </h3>
          <p className="text-[10px] text-slate-600 font-medium mt-1">Kerja Sama Antar-Desa</p>
        </motion.div>

        {/* Card 5: Koperasi Desa Merah Putih */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          onClick={() => setActiveTab('kelembagaan')}
          className="bg-gradient-to-br from-rose-50/90 via-red-50/40 to-white p-4 rounded-2xl border border-rose-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-red-600 text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200 uppercase">
              MATANG
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Koperasi Merah Putih</p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-headline mt-0.5 tracking-tight">
            14 <span className="text-xs font-bold text-rose-700">Desa</span>
          </h3>
          <p className="text-[10px] text-slate-600 font-medium mt-1">6 Desa Beroperasi Matang</p>
        </motion.div>

        {/* Card 6: Pasar Tradisional */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          onClick={() => setActiveTab('perdagangan')}
          className="bg-gradient-to-br from-sky-50/90 via-cyan-50/40 to-white p-4 rounded-2xl border border-sky-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 text-white flex items-center justify-center font-bold shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-black text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full border border-sky-200 uppercase">
              9 DESA
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pasar Tradisional</p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-headline mt-0.5 tracking-tight">
            9 <span className="text-xs font-bold text-sky-700">Desa</span>
          </h3>
          <p className="text-[10px] text-slate-600 font-medium mt-1">6 Permanen & 3 Semi</p>
        </motion.div>

      </div>

      {/* TAB NAVIGATION FOR DETAILS */}
      <div className="flex items-center gap-1.5 bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300 shadow-inner flex-wrap">
        
        <button
          onClick={() => setActiveTab('perdagangan')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'perdagangan'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Perdagangan & Jasa</span>
        </button>

        {/* TAB UMKM TERDAFTAR (NEW!) */}
        <button
          onClick={() => setActiveTab('umkm')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'umkm'
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-md'
              : 'text-emerald-950 font-black bg-emerald-100/80 hover:bg-emerald-200/80'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-emerald-600" />
          <span>UMKM Terdaftar (629 Usaha)</span>
          <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${activeTab === 'umkm' ? 'bg-white text-emerald-800' : 'bg-emerald-700 text-white'}`}>
            629 Usaha
          </span>
        </button>

        {/* TAB SPPG / DAPUR MBG */}
        <button
          onClick={() => setActiveTab('sppg')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'sppg'
              ? 'bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 text-white shadow-md'
              : 'text-amber-900 font-black bg-amber-100/80 hover:bg-amber-200/80'
          }`}
        >
          <ChefHat className="w-4 h-4 text-amber-500" />
          <span>SPPG (Dapur MBG)</span>
          <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${activeTab === 'sppg' ? 'bg-white text-orange-700' : 'bg-orange-600 text-white'}`}>
            17 Unit
          </span>
        </button>

        <button
          onClick={() => setActiveTab('kelembagaan')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'kelembagaan'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>BUMDes, BUMDesma, & Koperasi</span>
        </button>

        <button
          onClick={() => setActiveTab('perbankan')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'perbankan'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>Perbankan & Lembaga Keuangan</span>
        </button>

      </div>

      {/* TAB CONTENT PANELS */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: PERDAGANGAN & JASA */}
        {activeTab === 'perdagangan' && (
          <motion.div
            key="perdagangan"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* LEFT 7 COLS: INFOGRAPHIC PIE CHART PERDAGANGAN */}
            <div className="lg:col-span-7 bg-slate-50/90 rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 font-headline flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-indigo-600" />
                  Diagram Proporsi Sarana Perdagangan & Jasa
                </h3>
                <p className="text-xs text-slate-500 font-medium">Distribusi Sarana Niaga & Perdagangan Aktif di 14 Desa</p>
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
                      const totalSum = perdaganganSlices.reduce((acc, curr) => acc + curr.count, 0);

                      return perdaganganSlices.map((slice, index) => {
                        const percentage = slice.count / totalSum;
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
                              <title>{`${slice.label}: ${slice.count} Desa (${slice.pct}%)`}</title>
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
                                {`${slice.count} Desa (${slice.pct}%)`}
                              </tspan>
                            </text>
                          </g>
                        );
                      });
                    })()}

                    {/* CENTER CORE EMBLEM */}
                    <foreignObject x="105" y="105" width="110" height="110" className="overflow-visible">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border-4 border-white shadow-2xl flex flex-col items-center justify-center text-white text-center p-2">
                        <div className="w-6 h-6 rounded-full bg-sky-400 text-slate-900 flex items-center justify-center font-black shadow-md mb-0.5">
                          <Store className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-black font-headline leading-none mt-0.5">14 DESA</span>
                        <span className="text-[7px] font-bold tracking-widest uppercase text-sky-300 mt-0.5">SARANA NIAGA</span>
                      </div>
                    </foreignObject>
                  </svg>
                </div>
              </div>

              {/* CARDS BREAKDOWN GRID BELOW CHART */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                {perdaganganSlices.map((slice, index) => (
                  <div key={slice.label} className={`p-2 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between ${index === 4 ? 'col-span-2' : ''}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-md bg-gradient-to-r ${slice.gradient} text-white flex items-center justify-center font-black font-mono text-[9px]`}>
                        0{index + 1}
                      </div>
                      <span className="text-[11px] font-bold text-slate-800">{slice.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-black text-slate-900">{slice.count} Desa</span>
                      <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1 rounded ml-1">{slice.pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT 5 COLS: RINCIAN PERDAGANGAN & KULINER */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Pasar Tradisional Card */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center gap-2.5 text-emerald-800 font-extrabold font-headline text-sm border-b border-slate-100 pb-2">
                  <Store className="w-4 h-4 text-emerald-600" />
                  Pasar Tradisional Desa
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Bangunan Permanen</span>
                    <span className="text-base font-black text-emerald-900">6 Desa</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Semi-Permanen</span>
                    <span className="text-base font-black text-purple-900">3 Desa</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  🛒 Pasar tradisional aktif menjadi pusat distribusi kebutuhan pokok warga di 9 desa utama Kecamatan Gandrungmangu.
                </p>
              </div>

              {/* Ritel Modern & Pertokoan Card */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center gap-2.5 text-sky-800 font-extrabold font-headline text-sm border-b border-slate-100 pb-2">
                  <ShoppingBag className="w-4 h-4 text-sky-600" />
                  Ritel Modern & Pertokoan
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-950">🏪 Minimarket / Swalayan Modern</span>
                    <span className="text-xs font-black text-sky-800 bg-white px-2 py-0.5 rounded">Tersedia di 10 Desa</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-950">🛍️ Sentra Kelompok Pertokoan</span>
                    <span className="text-xs font-black text-amber-800 bg-white px-2 py-0.5 rounded">Aktif di 5 Desa</span>
                  </div>
                </div>
              </div>

              {/* Jasa Kuliner Card */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center gap-2.5 text-rose-800 font-extrabold font-headline text-sm border-b border-slate-100 pb-2">
                  <Utensils className="w-4 h-4 text-rose-600" />
                  Penyedia Jasa Kuliner
                </div>

                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-rose-950 block">🍽️ Restoran / Rumah Makan Resmi</span>
                    <span className="text-[10px] text-slate-500 font-medium">Usaha Kuliner Terdaftar</span>
                  </div>
                  <span className="text-sm font-black text-rose-900 bg-white px-2.5 py-1 rounded-xl border border-rose-200">
                    Terdata di 6 Desa
                  </span>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 2: UMKM TERDAFTAR 14 DESA (629 USAHA) */}
        {activeTab === 'umkm' && (
          <motion.div
            key="umkm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* UMKM BANNER & CATEGORY METRICS */}
            <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 rounded-3xl p-6 text-white shadow-xl space-y-5 border border-emerald-400/40">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/20 pb-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase text-emerald-100 border border-white/30">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    REKAPITULASI UMKM SE-KECAMATAN
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black font-headline tracking-tight text-white">
                    Data Usaha Mikro, Kecil & Menengah (629 UMKM)
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100 max-w-3xl leading-relaxed font-medium">
                    Inventarisasi Pelaku Usaha Mikro, Produk Olahan Makanan, Kerajinan, Industri Rumahan, Perajin Tempe, Pertanian, dan Jasa Usaha 14 Desa.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-white text-emerald-700 flex items-center justify-center font-black">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-100 font-bold uppercase block tracking-wider">Total UMKM Terdata</span>
                    <span className="text-xl font-black font-headline text-white">629 Pelaku Usaha</span>
                  </div>
                </div>
              </div>

              {/* 4 HIGHLIGHT CATEGORY CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                
                <div className="bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
                  <span className="text-[10px] text-emerald-200 font-bold uppercase block">Perajin Tempe & Tahu</span>
                  <span className="text-lg sm:text-xl font-black font-headline text-white">{umkmSummary.byCategory.tempeTahu} Usaha</span>
                  <p className="text-[9.5px] text-emerald-200 font-medium mt-0.5">Kedelai Rumahan</p>
                </div>

                <div className="bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
                  <span className="text-[10px] text-emerald-200 font-bold uppercase block">Makanan & Olahan</span>
                  <span className="text-lg sm:text-xl font-black font-headline text-white">{umkmSummary.byCategory.makananOlahan} Usaha</span>
                  <p className="text-[9.5px] text-emerald-200 font-medium mt-0.5">Sale, Sriping & Kue</p>
                </div>

                <div className="bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
                  <span className="text-[10px] text-emerald-200 font-bold uppercase block">Pertanian & Peternakan</span>
                  <span className="text-lg sm:text-xl font-black font-headline text-white">{umkmSummary.byCategory.pertanianPeternakan} Usaha</span>
                  <p className="text-[9.5px] text-emerald-200 font-medium mt-0.5">Pati Ubi, Gula & Kakao</p>
                </div>

                <div className="bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
                  <span className="text-[10px] text-emerald-200 font-bold uppercase block">Jasa & Kerajinan</span>
                  <span className="text-lg sm:text-xl font-black font-headline text-white">{umkmSummary.byCategory.kerajinanFashion + umkmSummary.byCategory.jasaManufaktur + umkmSummary.byCategory.perdaganganKuliner} Usaha</span>
                  <p className="text-[9.5px] text-emerald-200 font-medium mt-0.5">Fashion, Kayu & Jasa</p>
                </div>

              </div>

            </div>

            {/* FILTER & SEARCH CONTROLS FOR UMKM */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              
              <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
                
                {/* DROPDOWN FILTERS */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                  {/* Village Filter Dropdown */}
                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-500">Desa:</span>
                    <select
                      value={umkmFilterDesa}
                      onChange={(e) => {
                        setUmkmFilterDesa(e.target.value);
                        setUmkmPage(1);
                      }}
                      className="bg-transparent text-xs font-black text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">Semua Desa (14 Desa)</option>
                      {villageListOptions.map((v) => (
                        <option key={v} value={v}>
                          Desa {v}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category Filter Dropdown */}
                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-500 font-medium">Kategori:</span>
                    <select
                      value={umkmFilterCategory}
                      onChange={(e) => {
                        setUmkmFilterCategory(e.target.value);
                        setUmkmPage(1);
                      }}
                      className="bg-transparent text-xs font-black text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">Semua Kategori (629)</option>
                      <option value="Perajin Tempe & Tahu">Perajin Tempe & Tahu</option>
                      <option value="Makanan Ringan & Olahan">Makanan Ringan & Olahan</option>
                      <option value="Pertanian, Perkebunan & Peternakan">Pertanian & Peternakan</option>
                      <option value="Kerajinan, Fashion & Konveksi">Kerajinan & Fashion</option>
                      <option value="Jasa, Pertukangan & Manufaktur">Jasa & Pertukangan</option>
                      <option value="Perdagangan & Kuliner">Perdagangan & Kuliner</option>
                    </select>
                  </div>
                </div>

                {/* SEARCH INPUT */}
                <div className="relative w-full lg:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari Nama UMKM / Produk / Desa / Alamat..."
                    value={umkmSearchQuery}
                    onChange={(e) => {
                      setUmkmSearchQuery(e.target.value);
                      setUmkmPage(1);
                    }}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

              </div>

              {/* TABLE DATA UMKM (629 ENTRIES) */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
                <table className="w-full text-xs text-left text-slate-700 border-collapse">
                  <thead className="bg-[#1E1B4B] text-white font-extrabold uppercase text-[10px] tracking-wider text-center">
                    <tr>
                      <th className="py-3.5 px-3 w-10 border-b border-indigo-900">NO</th>
                      <th className="py-3.5 px-4 text-left border-b border-indigo-900">DESA</th>
                      <th className="py-3.5 px-4 text-left border-b border-indigo-900">NAMA UMKM / PEMILIK</th>
                      <th className="py-3.5 px-4 text-left border-b border-indigo-900">ALAMAT (RUMAH / USAHA)</th>
                      <th className="py-3.5 px-4 text-left border-b border-indigo-900">NAMA PRODUK / SPESIFIKASI</th>
                      <th className="py-3.5 px-3 text-center border-b border-indigo-900">KATEGORI USULAN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {paginatedUmkmData.length > 0 ? (
                      paginatedUmkmData.map((item) => (
                        <tr key={item.no} className="hover:bg-emerald-50/50 transition-colors">
                          <td className="py-3 px-3 text-center font-mono font-bold text-slate-400">{item.no}</td>
                          
                          {/* Desa */}
                          <td className="py-3 px-4 font-black text-slate-900 font-headline uppercase">
                            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-900 border border-indigo-200 text-[10.5px]">
                              {item.village}
                            </span>
                          </td>

                          {/* Nama UMKM */}
                          <td className="py-3 px-4 font-bold text-slate-900 text-[11.5px]">
                            {item.nama || 'UMKM Mandiri'}
                          </td>

                          {/* Alamat */}
                          <td className="py-3 px-4 text-slate-600 text-[11px] max-w-xs leading-relaxed">
                            <span className="flex items-start gap-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                              <span>{item.alamat}</span>
                            </span>
                          </td>

                          {/* Nama Produk */}
                          <td className="py-3 px-4 font-extrabold text-emerald-950 text-[11px]">
                            <span className="flex items-center gap-1.5">
                              <Package className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{item.produk}</span>
                            </span>
                          </td>

                          {/* Kategori */}
                          <td className="py-3 px-3 text-center">
                            <span className="text-[9.5px] font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 inline-block">
                              {item.category}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                          Tidak ditemukan data UMKM yang sesuai dengan filter / pencarian.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 font-black text-slate-900 border-t-2 border-slate-300">
                    <tr>
                      <td colSpan={2} className="py-3.5 px-4 text-left uppercase tracking-wider font-headline">TOTAL TERFILTER</td>
                      <td className="py-3.5 px-4 text-emerald-700 font-bold">{filteredUmkmData.length} UMKM Terdata</td>
                      <td colSpan={3} className="py-3.5 px-4 text-right text-slate-600 font-medium">
                        Menampilkan {paginatedUmkmData.length > 0 ? (umkmPage - 1) * umkmPerPage + 1 : 0} - {Math.min(umkmPage * umkmPerPage, filteredUmkmData.length)} dari Total 629 UMKM
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* PAGINATION CONTROLS */}
              {totalUmkmPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <span className="text-xs font-bold text-slate-500">
                    Halaman <strong className="text-slate-900">{umkmPage}</strong> dari <strong className="text-slate-900">{totalUmkmPages}</strong> ({filteredUmkmData.length} Data UMKM)
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setUmkmPage(prev => Math.max(1, prev - 1))}
                      disabled={umkmPage === 1}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Sebelumnya</span>
                    </button>

                    <div className="flex items-center gap-1 px-2">
                      {Array.from({ length: Math.min(5, totalUmkmPages) }, (_, i) => {
                        let pageNum = umkmPage;
                        if (umkmPage <= 3) pageNum = i + 1;
                        else if (umkmPage >= totalUmkmPages - 2) pageNum = totalUmkmPages - 4 + i;
                        else pageNum = umkmPage - 2 + i;

                        if (pageNum < 1 || pageNum > totalUmkmPages) return null;

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setUmkmPage(pageNum)}
                            className={`w-7 h-7 rounded-lg text-xs font-black transition-all ${
                              umkmPage === pageNum
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setUmkmPage(prev => Math.min(totalUmkmPages, prev + 1))}
                      disabled={umkmPage === totalUmkmPages}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <span>Berikutnya</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

            </div>

          </motion.div>
        )}

        {/* TAB 3: SPPG (DAPUR MBG - MAKAN BERGIZI GRATIS) */}
        {activeTab === 'sppg' && (
          <motion.div
            key="sppg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* SPPG TOP SUMMARY BANNER & STAT CARDS */}
            <div className="bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 rounded-3xl p-6 text-white shadow-xl space-y-5 border border-amber-400/40">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/20 pb-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase text-amber-100 border border-white/30">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    PROGRAM NASIONAL MAKAN BERGIZI GRATIS (MBG)
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black font-headline tracking-tight text-white">
                    Satuan Pelayanan Pemenuhan Gizi (SPPG / Dapur MBG)
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-100 max-w-3xl leading-relaxed font-medium">
                    Data Lokasi, Yayasan Pengelola, Tanggal Operasional, serta Penanggung Jawab Mitra SPPI/PIC Dapur MBG di Kecamatan Gandrungmangu.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-white text-orange-600 flex items-center justify-center font-black">
                    <ChefHat className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-100 font-bold uppercase block tracking-wider">Total Dapur SPPG</span>
                    <span className="text-xl font-black font-headline text-white">17 Lokasi</span>
                  </div>
                </div>
              </div>

              {/* 3 HIGHLIGHT METRIC BOXES */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-md shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-100 font-bold uppercase block">Status Beroperasi</span>
                    <span className="text-xl font-black font-headline text-white">9 Unit SPPG</span>
                    <p className="text-[10px] text-emerald-200 font-bold">100% Aktif Melayani</p>
                  </div>
                </div>

                <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black shadow-md shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-100 font-bold uppercase block">Proses Persiapan</span>
                    <span className="text-xl font-black font-headline text-white">8 Unit SPPG</span>
                    <p className="text-[10px] text-yellow-200 font-bold">Tahap Persiapan & Verifikasi</p>
                  </div>
                </div>

                <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center font-black shadow-md shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-100 font-bold uppercase block">Sebaran Wilayah Desa</span>
                    <span className="text-xl font-black font-headline text-white">8 Desa</span>
                    <p className="text-[10px] text-purple-200 font-bold">Tersebar Strategis di Gandrungmangu</p>
                  </div>
                </div>

              </div>

            </div>

            {/* FILTER & SEARCH BAR FOR SPPG */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                
                {/* FILTER STATUS BUTTONS */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full sm:w-auto">
                  <button
                    onClick={() => setSppgFilterStatus('ALL')}
                    className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      sppgFilterStatus === 'ALL'
                        ? 'bg-slate-900 text-white shadow-xs font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Semua SPPG ({sppgMbgSummary.total})
                  </button>
                  <button
                    onClick={() => setSppgFilterStatus('AKTIF')}
                    className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      sppgFilterStatus === 'AKTIF'
                        ? 'bg-emerald-600 text-white shadow-xs font-black'
                        : 'text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Aktif ({sppgMbgSummary.aktif})
                  </button>
                  <button
                    onClick={() => setSppgFilterStatus('BELUM AKTIF')}
                    className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      sppgFilterStatus === 'BELUM AKTIF'
                        ? 'bg-amber-600 text-white shadow-xs font-black'
                        : 'text-amber-700 hover:bg-amber-50'
                    }`}
                  >
                    Belum Aktif ({sppgMbgSummary.belumAktif})
                  </button>
                </div>

                {/* SEARCH INPUT */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari SPPG / Alamat / Yayasan / PIC..."
                    value={sppgSearchQuery}
                    onChange={(e) => setSppgSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

              </div>

              {/* TABLE DATA SPPG (17 LOKASI MBG) */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
                <table className="w-full text-xs text-left text-slate-700 border-collapse">
                  <thead className="bg-[#1E1B4B] text-white font-extrabold uppercase text-[10px] tracking-wider text-center">
                    <tr>
                      <th className="py-3.5 px-3 w-10 border-b border-indigo-900">NO</th>
                      <th className="py-3.5 px-4 text-left border-b border-indigo-900">NAMA SPPG (DAPUR MBG)</th>
                      <th className="py-3.5 px-3 text-center border-b border-indigo-900">STATUS</th>
                      <th className="py-3.5 px-4 text-left border-b border-indigo-900">ALAMAT LOKASI</th>
                      <th className="py-3.5 px-4 text-left border-b border-indigo-900">NAMA YAYASAN PENGELOLA</th>
                      <th className="py-3.5 px-3 text-center border-b border-indigo-900">TANGGAL OPS</th>
                      <th className="py-3.5 px-4 text-left border-b border-indigo-900">SPPI / PIC MITRA</th>
                      <th className="py-3.5 px-3 text-center border-b border-indigo-900">KET. TOA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredSppgData.length > 0 ? (
                      filteredSppgData.map((item) => {
                        const isAktif = item.status === 'AKTIF';

                        return (
                          <tr key={item.no} className="hover:bg-amber-50/50 transition-colors">
                            <td className="py-3 px-3 text-center font-mono font-bold text-slate-400">{item.no}</td>
                            
                            {/* Nama SPPG */}
                            <td className="py-3 px-4 font-bold text-slate-900 font-headline">
                              <span className="flex items-center gap-1.5">
                                <ChefHat className={`w-3.5 h-3.5 shrink-0 ${isAktif ? 'text-emerald-600' : 'text-amber-600'}`} />
                                <span>{item.namaSppg}</span>
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-3 px-3 text-center">
                              <span className={`inline-flex items-center gap-1 text-[9.5px] font-black px-2.5 py-1 rounded-full border ${
                                isAktif 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                                  : 'bg-amber-50 text-amber-700 border-amber-300'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isAktif ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                                {item.status}
                              </span>
                            </td>

                            {/* Alamat */}
                            <td className="py-3 px-4 text-slate-600 text-[11px] max-w-xs leading-relaxed">
                              <span className="flex items-start gap-1">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                                <span>{item.alamat}</span>
                              </span>
                            </td>

                            {/* Nama Yayasan */}
                            <td className="py-3 px-4 font-bold text-slate-800 text-[11px]">
                              {item.namaYayasan}
                            </td>

                            {/* Tanggal Ops */}
                            <td className="py-3 px-3 text-center text-slate-600 font-mono text-[10.5px]">
                              <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                {item.tanggalOperasion}
                              </span>
                            </td>

                            {/* PIC Mitra */}
                            <td className="py-3 px-4 font-extrabold text-indigo-900 text-[11px]">
                              {item.sppiPicMitra}
                            </td>

                            {/* Keterangan */}
                            <td className="py-3 px-3 text-center">
                              <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 inline-block">
                                {item.ket}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">
                          Tidak ditemukan data SPPG yang sesuai dengan pencarian / filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300 text-center">
                    <tr>
                      <td colSpan={2} className="py-3.5 px-4 text-left uppercase tracking-wider font-headline">TOTAL SPPG GANDRUNGMANGU</td>
                      <td className="py-3.5 px-3 text-emerald-700 font-bold">{sppgMbgSummary.aktif} AKTIF / {sppgMbgSummary.belumAktif} PERSIAPAN</td>
                      <td colSpan={5} className="py-3.5 px-4 text-right text-slate-600 font-medium">
                        Total 17 Satuan Pelayanan Pemenuhan Gizi (SPPG / Dapur MBG)
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

            </div>

          </motion.div>
        )}

        {/* TAB 4: BUMDes, BUMDesma, & KOPERASI */}
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
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    Penguatan Kelembagaan Ekonomi Desa (BUMDes, BUMDesma, & Koperasi)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Sinergi Lembaga Usaha Desa dan Kerja Sama Ekonomi Antar-Desa</p>
                </div>

                <span className="text-xs font-black px-3 py-1 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200">
                  100% Desa Terjangkau
                </span>
              </div>

              {/* 3 BIG FEATURED CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. BUMDes Unit Usaha */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50/90 via-sky-50/40 to-white border border-indigo-200 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-black text-slate-900 font-headline">Unit Usaha BUMDes</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Telah terbentuk <strong className="text-indigo-900">Unit Usaha BUMDes di seluruh 14 desa</strong> yang ada di Kecamatan Gandrungmangu sebagai penggerak usaha mandiri desa.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-indigo-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Cakupan Wilayah</span>
                    <span className="text-xs font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">14 Desa (100%)</span>
                  </div>
                </div>

                {/* 2. BUMDesma (BUMDes Bersama) */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-50/90 via-pink-50/40 to-white border border-purple-200 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md">
                      <Handshake className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-black text-slate-900 font-headline">BUMDesma (BUMDes Bersama)</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Guna mengonsolidasikan potensi ekonomi kawasan yang lebih luas, telah didirikan <strong className="text-purple-900">1 BUMDesma (BUMDes Bersama)</strong> tingkat kecamatan.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-purple-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Tingkat Kecamatan</span>
                    <span className="text-xs font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">1 BUMDesma</span>
                  </div>
                </div>

                {/* 3. Koperasi Desa Merah Putih */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-50/90 via-red-50/40 to-white border border-rose-200 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-black text-slate-900 font-headline">Koperasi Desa Merah Putih</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      Terbentuk di <strong className="text-rose-900">14 desa</strong>, dengan <strong className="text-rose-900">6 desa</strong> di antaranya telah terbangun secara matang dan beroperasi secara penuh.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-rose-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Status Operasi</span>
                    <span className="text-xs font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">6 Desa Matang</span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: PERBANKAN & LEMBAGA KEUANGAN */}
        {activeTab === 'perbankan' && (
          <motion.div
            key="perbankan"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* LEFT 6 COLS: PERBANKAN FORMAL (2024) */}
            <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 font-headline flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-emerald-600" />
                  Sektor Perbankan & Lembaga Keuangan Formal (2024)
                </h3>
                <p className="text-xs text-slate-500 font-medium">Fasilitas Permodalan Usaha & Perputaran Uang Masyarakat</p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-extrabold text-emerald-950 font-headline block">🏦 Bank Umum Pemerintah</span>
                    <span className="text-[11px] text-slate-600 font-medium">Kanal Layanan Perbankan Nasional</span>
                  </div>
                  <span className="text-sm font-black text-emerald-900 bg-white px-2.5 py-1 rounded-xl border border-emerald-200">
                    Tersedia di 2 Desa
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-extrabold text-sky-950 font-headline block">🏛️ Bank Perkreditan Rakyat (BPR)</span>
                    <span className="text-[11px] text-slate-600 font-medium">Layanan Kredit & Tabungan Daerah</span>
                  </div>
                  <span className="text-sm font-black text-sky-900 bg-white px-2.5 py-1 rounded-xl border border-sky-200">
                    Tersedia di 1 Desa
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT 6 COLS: KOPERASI AKTIF (BPS) */}
            <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 font-headline flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  Koperasi Aktif (Data BPS)
                </h3>
                <p className="text-xs text-slate-500 font-medium">Kelembagaan Koperasi Unit Desa & Simpan Pinjam</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                  <span className="text-xs font-extrabold text-purple-950 font-headline block">🌾 KUD (Koperasi Unit Desa)</span>
                  <p className="text-xs text-purple-900 font-black pt-1">Aktif di 2 Desa</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                  <span className="text-xs font-extrabold text-amber-950 font-headline block">💳 Kospin (Simpan Pinjam)</span>
                  <p className="text-xs text-amber-900 font-black pt-1">Aktif di 3 Desa</p>
                </div>
              </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </section>
  );
}

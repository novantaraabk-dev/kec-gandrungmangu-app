'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { defaultRumahIbadahData, type RumahIbadah } from '@/lib/rumah-ibadah-data';
import { defaultPendudukAgamaData, type PendudukAgama } from '@/lib/penduduk-agama-data';
import { 
  University, 
  Users, 
  Home, 
  Sparkles, 
  Church, 
  Heart, 
  Layers, 
  ChevronRight, 
  Table, 
  ChevronUp, 
  ChevronDown,
  PieChart as PieChartIcon,
  BarChart3,
  Landmark,
  ShieldAlert
} from 'lucide-react';

export function RumahIbadahAgamaSection() {
  const firestore = useFirestore();
  const [activeTab, setActiveTab] = useState<'rumahIbadah' | 'agama'>('rumahIbadah');
  const [showTable, setShowTable] = useState(false);

  // Firestore Collections with Fallback
  const rumahIbadahCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'rumahIbadah') : null),
    [firestore]
  );
  const { data: firestoreRumahIbadah } = useCollection<RumahIbadah>(rumahIbadahCollection);

  const agamaCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'pendudukAgama') : null),
    [firestore]
  );
  const { data: firestoreAgama } = useCollection<PendudukAgama>(agamaCollection);

  // Resolved Rumah Ibadah Data
  const rumahIbadahData: RumahIbadah[] = useMemo(() => {
    if (firestoreRumahIbadah && firestoreRumahIbadah.length > 0) {
      return firestoreRumahIbadah;
    }
    return defaultRumahIbadahData;
  }, [firestoreRumahIbadah]);

  // Resolved Agama Data
  const agamaData: PendudukAgama[] = useMemo(() => {
    if (firestoreAgama && firestoreAgama.length > 0) {
      return firestoreAgama;
    }
    return defaultPendudukAgamaData;
  }, [firestoreAgama]);

  // Aggregated Totals - Rumah Ibadah
  const totalRumahIbadah = useMemo(() => {
    return rumahIbadahData.reduce(
      (acc, curr) => {
        acc.masjid += Number(curr.masjid) || 0;
        acc.mushola += Number(curr.mushola) || 0;
        acc.gerejaProtestan += Number(curr.gerejaProtestan) || 0;
        acc.gerejaKatolik += Number(curr.gerejaKatolik) || 0;
        acc.wihara += Number(curr.wihara) || 0;
        acc.pura += Number(curr.pura) || 0;
        acc.sanggar += Number(curr.sanggar) || 0;
        acc.lainnya += Number(curr.lainnya) || 0;
        acc.total += (Number(curr.masjid) || 0) + (Number(curr.mushola) || 0) + (Number(curr.gerejaProtestan) || 0) + (Number(curr.gerejaKatolik) || 0) + (Number(curr.wihara) || 0) + (Number(curr.pura) || 0) + (Number(curr.sanggar) || 0) + (Number(curr.lainnya) || 0);
        return acc;
      },
      { masjid: 0, mushola: 0, gerejaProtestan: 0, gerejaKatolik: 0, wihara: 0, pura: 0, sanggar: 0, lainnya: 0, total: 0 }
    );
  }, [rumahIbadahData]);

  // Aggregated Totals - Agama
  const totalAgama = useMemo(() => {
    return agamaData.reduce(
      (acc, curr) => {
        acc.islam += Number(curr.islam) || 0;
        acc.kristenProtestan += Number(curr.kristenProtestan) || 0;
        acc.katolik += Number(curr.katolik) || 0;
        acc.budha += Number(curr.budha) || 0;
        acc.hindu += Number(curr.hindu) || 0;
        acc.konghucu += Number(curr.konghucu) || 0;
        acc.kepercayaan += Number(curr.kepercayaan) || 0;
        acc.lainLain += Number(curr.lainLain) || 0;
        acc.total += (Number(curr.islam) || 0) + (Number(curr.kristenProtestan) || 0) + (Number(curr.katolik) || 0) + (Number(curr.budha) || 0) + (Number(curr.hindu) || 0) + (Number(curr.konghucu) || 0) + (Number(curr.kepercayaan) || 0) + (Number(curr.lainLain) || 0);
        return acc;
      },
      { islam: 0, kristenProtestan: 0, katolik: 0, budha: 0, hindu: 0, konghucu: 0, kepercayaan: 0, lainLain: 0, total: 0 }
    );
  }, [agamaData]);

  // Pie Chart Slices Preparation for Rumah Ibadah
  const rumahIbadahSlices = useMemo(() => {
    const raw = [
      { label: 'Masjid', value: totalRumahIbadah.masjid, color: '#0284C7', gradient: 'from-sky-500 to-cyan-600' },
      { label: 'Mushola', value: totalRumahIbadah.mushola, color: '#0D9488', gradient: 'from-teal-500 to-emerald-600' },
      { label: 'Gereja Protestan', value: totalRumahIbadah.gerejaProtestan, color: '#D97706', gradient: 'from-amber-500 to-orange-600' },
      { label: 'Gereja Katolik', value: totalRumahIbadah.gerejaKatolik, color: '#E11D48', gradient: 'from-rose-500 to-red-600' },
      { label: 'Wihara & Pura', value: totalRumahIbadah.wihara + totalRumahIbadah.pura, color: '#8B5CF6', gradient: 'from-purple-500 to-indigo-600' },
      { label: 'Sanggar & Lainnya', value: totalRumahIbadah.sanggar + totalRumahIbadah.lainnya, color: '#64748B', gradient: 'from-slate-500 to-slate-700' },
    ];
    return raw.filter(item => item.value > 0);
  }, [totalRumahIbadah]);

  // Pie Chart Slices Preparation for Agama
  const agamaSlices = useMemo(() => {
    const raw = [
      { label: 'Islam', value: totalAgama.islam, color: '#0284C7', gradient: 'from-sky-500 to-cyan-600' },
      { label: 'Kristen Protestan', value: totalAgama.kristenProtestan, color: '#D97706', gradient: 'from-amber-500 to-orange-600' },
      { label: 'Katolik', value: totalAgama.katolik, color: '#E11D48', gradient: 'from-rose-500 to-red-600' },
      { label: 'Budha & Hindu', value: totalAgama.budha + totalAgama.hindu, color: '#8B5CF6', gradient: 'from-purple-500 to-indigo-600' },
      { label: 'Konghucu', value: totalAgama.konghucu, color: '#EC4899', gradient: 'from-pink-500 to-rose-600' },
      { label: 'Kepercayaan', value: totalAgama.kepercayaan, color: '#10B981', gradient: 'from-emerald-500 to-teal-600' },
      { label: 'Lain-Lain', value: totalAgama.lainLain, color: '#64748B', gradient: 'from-slate-500 to-slate-700' },
    ];
    return raw.filter(item => item.value > 0);
  }, [totalAgama]);

  const activeSlices = activeTab === 'rumahIbadah' ? rumahIbadahSlices : agamaSlices;
  const grandTotal = activeTab === 'rumahIbadah' ? totalRumahIbadah.total : totalAgama.total;

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      
      {/* MULTI-COLOR GRADIENT CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="p-[2px] rounded-[24px] sm:rounded-[32px] bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 shadow-2xl shadow-purple-500/15 relative overflow-hidden my-6"
      >
        <div className="bg-gradient-to-br from-purple-50/95 via-violet-50/60 to-white backdrop-blur-xl rounded-[22px] sm:rounded-[30px] p-4 sm:p-10 relative overflow-hidden space-y-6 sm:space-y-8 border border-purple-200/90">
          
          {/* Ambient Background Blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

          {/* SECTION HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-sky-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
                <span className="text-[10px] sm:text-xs font-black tracking-widest text-white uppercase bg-purple-600 px-3.5 py-1.5 rounded-full border border-purple-400 shadow-xs inline-flex items-center gap-1.5">
                  <University className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  DATA UMUM & SARANA KEAGAMAAN
                </span>
              </div>
              
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black font-headline tracking-tight leading-tight text-slate-900">
                Rumah Ibadah & Kepercayaan Kec. Gandrungmangu
              </h2>
              
              <p className="text-xs sm:text-base text-slate-600 leading-relaxed mt-1.5 sm:mt-2 font-medium max-w-3xl">
                Sistem Olah Laporan Informasi & Data Desa (SOLID) menyajikan rekapitulasi data tempat ibadah dan statistik pemeluk agama/kepercayaan di Kecamatan Gandrungmangu.
              </p>
            </div>

            {/* TAB SELECTORS */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start lg:self-auto shadow-inner">
              <button
                onClick={() => setActiveTab('rumahIbadah')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'rumahIbadah'
                    ? 'bg-gradient-to-r from-sky-600 to-teal-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <University className="w-4 h-4" />
                Rumah Ibadah
              </button>

              <button
                onClick={() => setActiveTab('agama')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'agama'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Users className="w-4 h-4" />
                Agama & Kepercayaan
              </button>
            </div>
          </div>

          {/* MAIN GRAPHIC SECTION: PIE CHART WITH CALLOUT BADGES MATCHING USER REFERENCE IMAGE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50/70 p-4 sm:p-8 rounded-3xl border border-slate-200/80">
            
            {/* LEFT SIDE (6 COLS): 3D STYLED PIE CHART WITH CENTER GLOBE BADGE */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                
                {/* SVG DONUT PIE CHART WITH CALLOUT LINES */}
                <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl overflow-visible">
                  {(() => {
                    let cumulativeAngle = -90;
                    const r = 70;
                    const strokeWidth = 32;
                    const circumference = 2 * Math.PI * r;

                    // Pass 1: Compute raw geometries & initial leader line coordinates
                    const items = activeSlices.map((slice, index) => {
                      const percentage = slice.value / (grandTotal || 1);
                      const angle = percentage * 360;
                      const startAngle = cumulativeAngle;
                      const endAngle = cumulativeAngle + angle;
                      cumulativeAngle += angle;

                      const midAngle = (startAngle + endAngle) / 2;
                      const rad = (midAngle * Math.PI) / 180;

                      const strokeDasharray = `${(percentage * circumference).toFixed(1)} ${(circumference - percentage * circumference).toFixed(1)}`;
                      const strokeDashoffset = ((-startAngle - 90) / 360 * circumference).toFixed(1);

                      const rStart = 88;
                      // Dynamic elbow radius: small slices fan out to staggered heights
                      const isSmall = percentage < 0.08;
                      const rElbow = isSmall ? 110 + (index % 3) * 16 : 108;

                      const x1 = 150 + rStart * Math.cos(rad);
                      const y1 = 150 + rStart * Math.sin(rad);
                      let x2 = 150 + rElbow * Math.cos(rad);
                      let y2 = 150 + rElbow * Math.sin(rad);

                      // Flexible side selection: top-center items alternate to left and right
                      let isRight = Math.cos(rad) >= -0.15;
                      if (Math.sin(rad) < -0.7 && Math.abs(Math.cos(rad)) < 0.45) {
                        isRight = index % 2 === 0;
                      }

                      let x3 = isRight ? Math.max(x2 + 15, 175) : Math.min(x2 - 15, 125);

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
                        const minDist = 24; // Ensure 24px vertical distance between text centers
                        if (curr.y2 - prev.y2 < minDist) {
                          curr.y2 = prev.y2 + minDist;
                        }
                      }
                    };

                    enforceMinSpacing(rightItems);
                    enforceMinSpacing(leftItems);

                    return items.map(({ slice, percentage, strokeDasharray, strokeDashoffset, x1, y1, x2, y2, x3, isRight }) => (
                      <g key={slice.label} className="group cursor-pointer">
                        {/* Segment Circle */}
                        <circle
                          cx="150"
                          cy="150"
                          r={r}
                          stroke={slice.color}
                          strokeWidth={strokeWidth}
                          fill="transparent"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          transform="rotate(-90 150 150)"
                          className="transition-all duration-300 hover:stroke-[38] hover:opacity-100 opacity-95"
                        >
                          <title>{`${slice.label}: ${slice.value.toLocaleString('id-ID')} (${(percentage * 100).toFixed(1)}%)`}</title>
                        </circle>

                        {/* Leader Line */}
                        <polyline
                          points={`${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)} ${x3.toFixed(1)},${y2.toFixed(1)}`}
                          stroke={slice.color}
                          strokeWidth="1.5"
                          strokeDasharray="2,2"
                          fill="none"
                          className="opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <circle cx={x1.toFixed(1)} cy={y1.toFixed(1)} r="2.5" fill={slice.color} />
                        <circle cx={x3.toFixed(1)} cy={y2.toFixed(1)} r="2" fill={slice.color} />

                        {/* Text Callout Label */}
                        <text
                          x={isRight ? (x3 + 5).toFixed(1) : (x3 - 5).toFixed(1)}
                          y={y2.toFixed(1)}
                          textAnchor={isRight ? "start" : "end"}
                          className="pointer-events-none select-none transition-all group-hover:scale-105"
                        >
                          <tspan
                            x={isRight ? (x3 + 5).toFixed(1) : (x3 - 5).toFixed(1)}
                            dy="-3"
                            className="text-[7.5px] font-black fill-slate-900 font-headline"
                          >
                            {slice.label}
                          </tspan>
                          <tspan
                            x={isRight ? (x3 + 5).toFixed(1) : (x3 - 5).toFixed(1)}
                            dy="9"
                            fill={slice.color}
                            className="text-[7px] font-black"
                          >
                            {`${slice.value.toLocaleString('id-ID')} (${(percentage * 100).toFixed(1)}%)`}
                          </tspan>
                        </text>
                      </g>
                    ));
                  })()}

                  {/* CENTER CIRCULAR GLOBE EMBLEM BADGE MATCHING REFERENCE IMAGE */}
                  <foreignObject x="95" y="95" width="110" height="110" className="overflow-visible">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 border-4 border-white shadow-xl flex flex-col items-center justify-center text-white text-center p-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-900 flex items-center justify-center font-black shadow-md mb-0.5">
                        {activeTab === 'rumahIbadah' ? <University className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                      </div>
                      <span className="text-[13px] font-black font-headline tracking-tight leading-none mt-0.5">
                        {grandTotal.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[8px] font-bold tracking-widest uppercase text-cyan-300 mt-0.5">
                        {activeTab === 'rumahIbadah' ? 'BANGUNAN' : 'PEMELUK'}
                      </span>
                    </div>
                  </foreignObject>
                </svg>
              </div>
            </div>

            {/* RIGHT SIDE (6 COLS): PILL BADGES & CALLOUTS MATCHING YOUR TEXT BADGES IN REFERENCE IMAGE */}
            <div className="lg:col-span-6 space-y-3">
              <div className="border-b border-slate-200 pb-2 mb-2">
                <h3 className="text-base font-extrabold text-slate-900 font-headline flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  {activeTab === 'rumahIbadah' ? 'Distribusi Rumah Ibadah Kecamatan' : 'Statistik Pemeluk Agama & Kepercayaan'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">Persentase & volume data terverifikasi di 14 Desa</p>
              </div>

              {/* DYNAMIC PILL CALLOUT BADGES (STYLE COPIED FROM USER REFERENCE IMAGE) */}
              <div className="space-y-2.5">
                {activeSlices.map((slice) => {
                  const percentage = ((slice.value / (grandTotal || 1)) * 100).toFixed(1);

                  return (
                    <motion.div
                      key={slice.label}
                      whileHover={{ x: 5, scale: 1.01 }}
                      className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {/* Circular Emblem Icon Box */}
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-r ${slice.gradient} text-white flex items-center justify-center font-black shadow-md`}>
                          <span className="text-xs font-mono font-bold">{percentage}%</span>
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 font-headline">{slice.label}</h4>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {activeTab === 'rumahIbadah' ? 'Unit Tempat Ibadah' : 'Jiwa Pemeluk'}
                          </p>
                        </div>
                      </div>

                      {/* Right Value Badge */}
                      <div className="text-right">
                        <span className="text-sm sm:text-base font-black text-slate-900 font-headline">
                          {slice.value.toLocaleString('id-ID')}
                        </span>
                        <span className="block text-[9px] font-bold text-slate-400 uppercase">
                          {activeTab === 'rumahIbadah' ? 'Unit' : 'Jiwa'}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* TOGGLE TABLE BUTTON */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 font-medium">
              Sumber Data: Firestore Database SOLID Kecamatan Gandrungmangu
            </span>
            <button
              onClick={() => setShowTable(!showTable)}
              className="inline-flex items-center gap-2 text-xs font-extrabold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl border border-indigo-200 transition-all cursor-pointer"
            >
              <Table className="w-3.5 h-3.5" />
              <span>{showTable ? 'Sembunyikan Tabel Rekapitulasi' : 'Lihat Rincian Data 14 Desa'}</span>
              {showTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* EXPANDABLE REKAPITULASI MATRIX DATA TABLE */}
          <AnimatePresence>
            {showTable && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden pt-4 border-t border-slate-200"
              >
                {activeTab === 'rumahIbadah' ? (
                  /* TABLE RUMAH IBADAH 14 DESA */
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
                    <table className="w-full text-xs text-left text-slate-700">
                      <thead className="bg-gradient-to-r from-sky-900 via-slate-900 to-teal-950 text-white font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-3">No</th>
                          <th className="py-3 px-3">Nama Desa</th>
                          <th className="py-3 px-3 text-right">Masjid</th>
                          <th className="py-3 px-3 text-right">Mushola</th>
                          <th className="py-3 px-3 text-right">Gereja Protestan</th>
                          <th className="py-3 px-3 text-right">Gereja Katolik</th>
                          <th className="py-3 px-3 text-right">Wihara</th>
                          <th className="py-3 px-3 text-right">Pura</th>
                          <th className="py-3 px-3 text-right">Sanggar</th>
                          <th className="py-3 px-3 text-right">Lainnya</th>
                          <th className="py-3 px-3 text-right font-black">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {rumahIbadahData.map((d, index) => {
                          const rowTotal = (Number(d.masjid)||0) + (Number(d.mushola)||0) + (Number(d.gerejaProtestan)||0) + (Number(d.gerejaKatolik)||0) + (Number(d.wihara)||0) + (Number(d.pura)||0) + (Number(d.sanggar)||0) + (Number(d.lainnya)||0);
                          return (
                            <tr key={d.village} className="hover:bg-sky-50/60 transition-colors">
                              <td className="py-2.5 px-3 font-mono font-bold text-slate-400">{index + 1}</td>
                              <td className="py-2.5 px-3 font-extrabold text-slate-900 font-headline">{d.village.toUpperCase()}</td>
                              <td className="py-2.5 px-3 text-right font-bold text-sky-700">{(d.masjid || 0).toLocaleString('id-ID')}</td>
                              <td className="py-2.5 px-3 text-right font-bold text-teal-700">{(d.mushola || 0).toLocaleString('id-ID')}</td>
                              <td className="py-2.5 px-3 text-right text-amber-700 font-bold">{(d.gerejaProtestan || 0).toLocaleString('id-ID')}</td>
                              <td className="py-2.5 px-3 text-right text-rose-700">{(d.gerejaKatolik || 0).toLocaleString('id-ID')}</td>
                              <td className="py-2.5 px-3 text-right text-purple-700">{(d.wihara || 0).toLocaleString('id-ID')}</td>
                              <td className="py-2.5 px-3 text-right text-indigo-700">{(d.pura || 0).toLocaleString('id-ID')}</td>
                              <td className="py-2.5 px-3 text-right text-slate-700">{(d.sanggar || 0).toLocaleString('id-ID')}</td>
                              <td className="py-2.5 px-3 text-right text-slate-500">{(d.lainnya || 0).toLocaleString('id-ID')}</td>
                              <td className="py-2.5 px-3 text-right font-black text-slate-900">{rowTotal.toLocaleString('id-ID')}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
                        <tr>
                          <td colSpan={2} className="py-3 px-3 text-left uppercase tracking-wider">Total Kecamatan</td>
                          <td className="py-3 px-3 text-right text-sky-800">{totalRumahIbadah.masjid.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-3 text-right text-teal-800">{totalRumahIbadah.mushola.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-3 text-right text-amber-800">{totalRumahIbadah.gerejaProtestan.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-3 text-right text-rose-800">{totalRumahIbadah.gerejaKatolik.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-3 text-right text-purple-800">{totalRumahIbadah.wihara.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-3 text-right text-indigo-800">{totalRumahIbadah.pura.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-3 text-right text-slate-800">{totalRumahIbadah.sanggar.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-3 text-right text-slate-700">{totalRumahIbadah.lainnya.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-3 text-right text-sky-900 font-black">{totalRumahIbadah.total.toLocaleString('id-ID')}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  /* TABLE AGAMA & KEPERCAYAAN 14 DESA */
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
                    <table className="w-full text-xs text-left text-slate-700">
                      <thead className="bg-gradient-to-r from-amber-900 via-slate-900 to-orange-950 text-white font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-3">No</th>
                          <th className="py-3 px-3">Nama Desa</th>
                          <th className="py-3 px-3 text-right">Islam</th>
                          <th className="py-3 px-3 text-right">Kristen Protestan</th>
                          <th className="py-3 px-3 text-right">Katolik</th>
                          <th className="py-3 px-3 text-right">Budha</th>
                          <th className="py-3 px-3 text-right">Hindu</th>
                          <th className="py-3 px-3 text-right">Konghucu</th>
                          <th className="py-3 px-3 text-right">Kepercayaan</th>
                          <th className="py-3 px-3 text-right">Lain-Lain</th>
                          <th className="py-3 px-3 text-right font-black">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {agamaData.map((d, index) => {
                          const rowTotal = (Number(d.islam)||0) + (Number(d.kristenProtestan)||0) + (Number(d.katolik)||0) + (Number(d.budha)||0) + (Number(d.hindu)||0) + (Number(d.konghucu)||0) + (Number(d.kepercayaan)||0) + (Number(d.lainLain)||0);
                          return (
                            <tr key={d.village} className="hover:bg-amber-50/60 transition-colors">
                              <td className="py-2.5 px-3 font-mono font-bold text-slate-400">{index + 1}</td>
                              <td className="py-2.5 px-3 font-extrabold text-slate-900 font-headline">{d.village.toUpperCase()}</td>
                              <td className="py-2.5 px-3 text-right font-bold text-sky-700">{(d.islam || 0).toLocaleString('id-ID')}</td>
                              <td className="py-2.5 px-3 text-right font-bold text-amber-700">{(d.kristenProtestan || 0).toLocaleString('id-ID')}</td>
                              <td className="py-2.5 px-3 text-right text-rose-700">{(d.katolik || 0).toLocaleString('id-ID')}</td>
                              <td className="py-2.5 px-3 text-right text-purple-700">{(d.budha || 0).toLocaleString('id-ID')}</td>
                              <td className="py-2.5 px-3 text-right text-indigo-700">{(d.hindu || 0).toLocaleString('id-ID')}</td>
                              <td className="py-2.5 px-3 text-right text-pink-700">{(d.konghucu || 0).toLocaleString('id-ID')}</td>
                              <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">{(d.kepercayaan || 0).toLocaleString('id-ID')}</td>
                              <td className="py-2.5 px-3 text-right text-slate-500">{(d.lainLain || 0).toLocaleString('id-ID')}</td>
                              <td className="py-2.5 px-3 text-right font-black text-slate-900">{rowTotal.toLocaleString('id-ID')}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
                        <tr>
                          <td colSpan={2} className="py-3 px-3 text-left uppercase tracking-wider">Total Kecamatan</td>
                          <td className="py-3 px-3 text-right text-sky-800">{totalAgama.islam.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-3 text-right text-amber-800">{totalAgama.kristenProtestan.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-3 text-right text-rose-800">{totalAgama.katolik.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-3 text-right text-purple-800">{totalAgama.budha.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-3 text-right text-indigo-800">{totalAgama.hindu.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-3 text-right text-pink-800">{totalAgama.konghucu.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-3 text-right text-emerald-800 font-bold">{totalAgama.kepercayaan.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-3 text-right text-slate-700">{totalAgama.lainLain.toLocaleString('id-ID')}</td>
                          <td className="py-3 px-3 text-right text-amber-900 font-black">{totalAgama.total.toLocaleString('id-ID')}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>

    </section>
  );
}

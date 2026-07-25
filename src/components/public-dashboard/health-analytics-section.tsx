'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { 
  HeartPulse, 
  Users, 
  Baby, 
  Activity, 
  Heart, 
  UserCheck, 
  HandHeart,
  Building2,
  ShieldAlert,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export function HealthAnalyticsSection() {
  const firestore = useFirestore();

  // Query Firestore collections for health data
  const posyanduQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'posyandu')) : null, [firestore]);
  const balitaQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'balita')) : null, [firestore]);
  const stuntingQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'stunting')) : null, [firestore]);
  const bumilKekQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'bumilKek')) : null, [firestore]);
  const lansiaQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'lansia')) : null, [firestore]);
  const disabilitasQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'disabilitas')) : null, [firestore]);
  const kaderQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'kaderPosyandu')) : null, [firestore]);

  const { data: firestorePosyandu } = useCollection<any>(posyanduQuery);
  const { data: firestoreBalita } = useCollection<any>(balitaQuery);
  const { data: firestoreStunting } = useCollection<any>(stuntingQuery);
  const { data: firestoreBumilKek } = useCollection<any>(bumilKekQuery);
  const { data: firestoreLansia } = useCollection<any>(lansiaQuery);
  const { data: firestoreDisabilitas } = useCollection<any>(disabilitasQuery);
  const { data: firestoreKader } = useCollection<any>(kaderQuery);

  // Aggregated Health Totals (with exact default fallback matching user request)
  const healthStats = useMemo(() => {
    let totalPosyandu = 90;
    let totalKader = 476;
    let totalBalita = 0;
    let totalStunting = 0;
    let totalBumilKek = 0;
    let totalLansia = 0;
    let totalDisabilitas = 0;

    if (firestorePosyandu && firestorePosyandu.length > 0) {
      totalPosyandu = firestorePosyandu.length;
    }
    if (firestoreKader && firestoreKader.length > 0) {
      totalKader = firestoreKader.length;
    }
    if (firestoreBalita && firestoreBalita.length > 0) {
      totalBalita = firestoreBalita.length;
    }
    if (firestoreStunting && firestoreStunting.length > 0) {
      totalStunting = firestoreStunting.length;
    }
    if (firestoreBumilKek && firestoreBumilKek.length > 0) {
      totalBumilKek = firestoreBumilKek.length;
    }
    if (firestoreLansia && firestoreLansia.length > 0) {
      totalLansia = firestoreLansia.length;
    }
    if (firestoreDisabilitas && firestoreDisabilitas.length > 0) {
      totalDisabilitas = firestoreDisabilitas.length;
    }

    return [
      {
        id: 'posyandu',
        label: 'Total Posyandu',
        value: totalPosyandu,
        unit: 'Posyandu',
        icon: Building2,
        color: '#E11D48',
        gradient: 'from-rose-500 to-pink-600',
        bg: 'bg-rose-50/90',
        border: 'border-rose-200/90',
        textColor: 'text-rose-700',
        badgeBg: 'bg-rose-100/90 text-rose-800 border-rose-200',
      },
      {
        id: 'kader',
        label: 'Kader Posyandu',
        value: totalKader,
        unit: 'Kader',
        icon: Users,
        color: '#9333EA',
        gradient: 'from-purple-600 to-indigo-600',
        bg: 'bg-purple-50/90',
        border: 'border-purple-200/90',
        textColor: 'text-purple-700',
        badgeBg: 'bg-purple-100/90 text-purple-800 border-purple-200',
      },
      {
        id: 'balita',
        label: 'Total Balita',
        value: totalBalita,
        unit: 'Balita',
        icon: Baby,
        color: '#0284C7',
        gradient: 'from-sky-500 to-blue-600',
        bg: 'bg-sky-50/90',
        border: 'border-sky-200/90',
        textColor: 'text-sky-700',
        badgeBg: 'bg-sky-100/90 text-sky-800 border-sky-200',
      },
      {
        id: 'stunting',
        label: 'Balita Stunting',
        value: totalStunting,
        unit: 'Kasus',
        icon: Activity,
        color: '#D97706',
        gradient: 'from-amber-500 to-orange-600',
        bg: 'bg-amber-50/90',
        border: 'border-amber-200/90',
        textColor: 'text-amber-700',
        badgeBg: 'bg-amber-100/90 text-amber-800 border-amber-200',
      },
      {
        id: 'bumilKek',
        label: 'Ibu Hamil KEK',
        value: totalBumilKek,
        unit: 'Orang',
        icon: Heart,
        color: '#0D9488',
        gradient: 'from-teal-500 to-emerald-600',
        bg: 'bg-teal-50/90',
        border: 'border-teal-200/90',
        textColor: 'text-teal-700',
        badgeBg: 'bg-teal-100/90 text-teal-800 border-teal-200',
      },
      {
        id: 'lansia',
        label: 'Total Lansia',
        value: totalLansia,
        unit: 'Lansia',
        icon: UserCheck,
        color: '#4F46E5',
        gradient: 'from-indigo-600 to-violet-600',
        bg: 'bg-indigo-50/90',
        border: 'border-indigo-200/90',
        textColor: 'text-indigo-700',
        badgeBg: 'bg-indigo-100/90 text-indigo-800 border-indigo-200',
      },
      {
        id: 'disabilitas',
        label: 'Total Disabilitas',
        value: totalDisabilitas,
        unit: 'Orang',
        icon: HandHeart,
        color: '#0891B2',
        gradient: 'from-cyan-600 to-teal-600',
        bg: 'bg-cyan-50/90',
        border: 'border-cyan-200/90',
        textColor: 'text-cyan-700',
        badgeBg: 'bg-cyan-100/90 text-cyan-800 border-cyan-200',
      },
    ];
  }, [
    firestorePosyandu,
    firestoreKader,
    firestoreBalita,
    firestoreStunting,
    firestoreBumilKek,
    firestoreLansia,
    firestoreDisabilitas,
  ]);

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 border-t border-rose-100/80 space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-1.5">
            <span className="text-[10px] sm:text-xs font-black tracking-widest text-rose-700 uppercase bg-rose-50 px-3 py-1 rounded-full border border-rose-200 shadow-2xs flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
              DATA KESEHATAN KECAMATAN
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black font-headline tracking-tight leading-tight text-slate-900">
            Data Kesehatan 14 Desa
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            Rekapitulasi Posyandu, Kader, Balita, Stunting, Ibu Hamil KEK, Lansia, dan Disabilitas di Kecamatan Gandrungmangu.
          </p>
        </div>
      </div>

      {/* 7 STAT CARDS IN ONE SINGLE COMPACT ROW (GRID 7 COLUMNS ON LARGE SCREENS) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
        {healthStats.map((stat, index) => {
          const IconComp = stat.icon;

          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.03, ease: 'easeOut' }}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`p-3 rounded-2xl ${stat.bg} ${stat.border} border shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-2`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-r ${stat.gradient} text-white flex items-center justify-center font-bold shadow-xs`}>
                  <IconComp className="w-4 h-4" />
                </div>
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border ${stat.badgeBg}`}>
                  14 Desa
                </span>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider line-clamp-1" title={stat.label}>
                  {stat.label}
                </p>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 font-headline tracking-tight mt-0.5 flex items-baseline gap-1">
                  {stat.value.toLocaleString('id-ID')}
                  <span className={`text-[10px] font-extrabold ${stat.textColor}`}>{stat.unit}</span>
                </h3>
              </div>
            </motion.div>
          );
        })}
      </div>

    </section>
  );
}

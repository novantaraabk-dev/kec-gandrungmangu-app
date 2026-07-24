'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { jalanDesaData, type JalanDesa } from '@/lib/jalan-desa-data';
import type { JalanKabupaten } from '@/lib/perangkat-data';
import { 
  Map, 
  Milestone, 
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

function formatCurrency(value: number) {
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

export function RoadAnalyticsSection() {
  const firestore = useFirestore();

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

  // Jalan Kabupaten Data
  const allJalanKabupatenList: JalanKabupaten[] = useMemo(() => {
    return firestoreJalanKabupaten || [];
  }, [firestoreJalanKabupaten]);

  // 1. Aggregated Stats for Jalan Desa
  const statsJalanDesa = useMemo(() => {
    let totalPanjang = 0;
    let totalBaik = 0;
    let totalSedang = 0;
    let totalRusakRingan = 0;
    let totalRusakBerat = 0;
    let totalRuas = allJalanDesaList.length;

    allJalanDesaList.forEach((j) => {
      const p = Number(j.panjang) || 0;
      totalPanjang += p;
      totalBaik += Number(j.baik) || 0;
      totalSedang += Number(j.sedang) || 0;
      totalRusakRingan += Number(j.rusakRingan) || 0;
      totalRusakBerat += Number(j.rusakBerat) || 0;
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
    };
  }, [allJalanDesaList]);

  // 2. Aggregated Stats for Jalan Kabupaten
  const statsJalanKabupaten = useMemo(() => {
    let totalPanjang = 0;
    let totalBaik = 0;
    let totalSedang = 0;
    let totalRusakRingan = 0;
    let totalRusakBerat = 0;
    let totalPaguUsulan = 0;
    let totalUsulanCount = 0;
    let totalRuas = allJalanKabupatenList.length;

    allJalanKabupatenList.forEach((j) => {
      const p = Number(j.panjangRuas) || 0;
      totalPanjang += p;
      totalBaik += Number(j.kondisiBaik) || 0;
      totalSedang += Number(j.kondisiSedang) || 0;
      totalRusakRingan += Number(j.kondisiRusakRingan) || 0;
      totalRusakBerat += Number(j.kondisiRusakBerat) || 0;
      totalPaguUsulan += Number(j.paguUsulan) || 0;
      if (j.usulanDesa || j.usulanMusren) totalUsulanCount++;
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
      totalPaguUsulan,
      totalUsulanCount,
    };
  }, [allJalanKabupatenList]);

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* ==================================================================== */}
        {/* KARTU 1: DATA JALAN DESA */}
        {/* ==================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-indigo-50/90 via-purple-50/40 to-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-indigo-200/90 shadow-xl shadow-indigo-500/10 hover:shadow-2xl hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between space-y-4 sm:space-y-6"
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

            {/* Animated KPI Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                whileHover={{ scale: 1.03, y: -2 }}
                className="bg-gradient-to-br from-indigo-100/90 via-indigo-50 to-white p-3.5 rounded-2xl border border-indigo-200/90 transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Total Panjang</p>
                <p className="text-xl font-black text-indigo-700 font-headline mt-0.5">{formatKm(statsJalanDesa.totalPanjang)}</p>
                <p className="text-[10px] text-indigo-600 font-bold mt-1">{statsJalanDesa.totalRuas} Ruas Terdaftar</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                whileHover={{ scale: 1.03, y: -2 }}
                className="bg-gradient-to-br from-emerald-100/90 via-emerald-50 to-white p-3.5 rounded-2xl border border-emerald-200/90 transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Kondisi Baik</p>
                <p className="text-xl font-black text-emerald-700 font-headline mt-0.5">{formatKm(statsJalanDesa.totalBaik)}</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-1">
                  {((statsJalanDesa.totalBaik / (statsJalanDesa.totalPanjang || 1)) * 100).toFixed(1)}% Dari Total
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                whileHover={{ scale: 1.03, y: -2 }}
                className="bg-gradient-to-br from-sky-100/90 via-sky-50 to-white p-3.5 rounded-2xl border border-sky-200/90 transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Kondisi Sedang</p>
                <p className="text-xl font-black text-sky-700 font-headline mt-0.5">{formatKm(statsJalanDesa.totalSedang)}</p>
                <p className="text-[10px] text-sky-600 font-bold mt-1">
                  {((statsJalanDesa.totalSedang / (statsJalanDesa.totalPanjang || 1)) * 100).toFixed(1)}% Dari Total
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
                whileHover={{ scale: 1.03, y: -2 }}
                className="bg-gradient-to-br from-rose-100/90 via-rose-50 to-white p-3.5 rounded-2xl border border-rose-200/90 transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Total Kerusakan</p>
                <p className="text-xl font-black text-rose-700 font-headline mt-0.5">{formatKm(statsJalanDesa.totalRusak)}</p>
                <p className="text-[10px] text-rose-600 font-bold mt-1">
                  {((statsJalanDesa.totalRusak / (statsJalanDesa.totalPanjang || 1)) * 100).toFixed(1)}% Perlu Perbaikan
                </p>
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
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" /> Baik</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-sm" /> Sedang</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" /> Rusak Ringan</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" /> Rusak Berat</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-indigo-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Dominasi Perkerasan: <strong className="text-indigo-700 font-bold">Rabat Beton & Aspal</strong></span>
            <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">14 Desa Terdaftar</span>
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
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-sky-50/90 via-cyan-50/40 to-white rounded-3xl p-6 sm:p-7 border border-sky-200/90 shadow-xl shadow-sky-500/10 hover:shadow-2xl hover:border-sky-300 transition-all duration-300 flex flex-col justify-between space-y-6"
        >
          <div className="space-y-6">
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sky-100 pb-4 gap-2">
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

            {/* Animated KPI Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                whileHover={{ scale: 1.03, y: -2 }}
                className="bg-gradient-to-br from-sky-100/90 via-sky-50 to-white p-3.5 rounded-2xl border border-sky-200/90 transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Total Panjang</p>
                <p className="text-xl font-black text-sky-700 font-headline mt-0.5">{formatKm(statsJalanKabupaten.totalPanjang)}</p>
                <p className="text-[10px] text-sky-600 font-bold mt-1">{statsJalanKabupaten.totalRuas} Ruas Utama</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                whileHover={{ scale: 1.03, y: -2 }}
                className="bg-gradient-to-br from-emerald-100/90 via-emerald-50 to-white p-3.5 rounded-2xl border border-emerald-200/90 transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Kondisi Baik</p>
                <p className="text-xl font-black text-emerald-700 font-headline mt-0.5">{formatKm(statsJalanKabupaten.totalBaik)}</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-1">
                  {((statsJalanKabupaten.totalBaik / (statsJalanKabupaten.totalPanjang || 1)) * 100).toFixed(1)}% Dari Total
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                whileHover={{ scale: 1.03, y: -2 }}
                className="bg-gradient-to-br from-amber-100/90 via-amber-50 to-white p-3.5 rounded-2xl border border-amber-200/90 transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Kondisi Sedang/Rusak</p>
                <p className="text-xl font-black text-amber-700 font-headline mt-0.5">{formatKm(statsJalanKabupaten.totalSedang + statsJalanKabupaten.totalRusak)}</p>
                <p className="text-[10px] text-amber-600 font-bold mt-1">
                  {(((statsJalanKabupaten.totalSedang + statsJalanKabupaten.totalRusak) / (statsJalanKabupaten.totalPanjang || 1)) * 100).toFixed(1)}% Butuh Penanganan
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
                whileHover={{ scale: 1.03, y: -2 }}
                className="bg-gradient-to-br from-indigo-100/90 via-indigo-50 to-white p-3.5 rounded-2xl border border-indigo-200/90 transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Usulan Pagu Musren</p>
                <p className="text-xl font-black text-indigo-700 font-headline mt-0.5 truncate">
                  {statsJalanKabupaten.totalPaguUsulan > 0 ? formatCurrency(statsJalanKabupaten.totalPaguUsulan) : 'Rp 0'}
                </p>
                <p className="text-[10px] text-indigo-600 font-bold mt-1">{statsJalanKabupaten.totalUsulanCount} Ruas Diusulkan</p>
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
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" /> Baik</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-sm" /> Sedang</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" /> Rusak Ringan</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" /> Rusak Berat</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-sky-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Status Pengawasan: <strong className="text-sky-700 font-bold">Dinas PUPR Kabupaten</strong></span>
            <span className="font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">Kecamatan Gandrungmangu</span>
          </div>
        </motion.div>

      </div>

    </section>
  );
}

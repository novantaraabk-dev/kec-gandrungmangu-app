'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Users, UserCheck, Award, ArrowRight, ShieldCheck, Building2, Table, ChevronDown, ChevronUp } from 'lucide-react';
import { kelembagaanDesaData, totalKelembagaan } from '@/lib/kelembagaan-data';

export function PerangkatSummarySection() {
  const [showTable, setShowTable] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mt-8 pt-8 border-t border-indigo-100/80 space-y-6"
    >
      {/* Sub-Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-black tracking-widest text-indigo-700 uppercase bg-gradient-to-r from-indigo-100 via-purple-100 to-sky-100 px-3.5 py-1.5 rounded-full border border-indigo-200 shadow-sm inline-flex items-center gap-1.5 mb-2">
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            KELEMBAGAAN & APARAT DESA
          </span>
          <h3 className="text-xl sm:text-2xl font-black font-headline text-slate-900 tracking-tight">
            Rekapitulasi Kelembagaan Desa
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            Data statistik resmi Perangkat Desa, RT/RW, dan BPD dari 14 Desa di Kecamatan Gandrungmangu.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTable(!showTable)}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3.5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <Table className="w-4 h-4 text-indigo-600" />
            <span>{showTable ? 'Sembunyikan Tabel Data' : 'Lihat Tabel 14 Desa'}</span>
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

      {/* 3 VIBRANT DISPLAY CARDS WITH EXACT DATA FROM SCREENSHOT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        
        {/* CARD 1: JUMLAH RT/RW */}
        <motion.div 
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-rose-50/90 via-orange-50/40 to-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-rose-200/90 shadow-xl shadow-rose-500/10 hover:shadow-2xl hover:border-rose-300 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 text-white flex items-center justify-center font-bold shadow-lg shadow-rose-500/30">
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-black text-rose-700 bg-rose-100/90 px-2.5 py-0.5 sm:py-1 rounded-full border border-rose-200 uppercase shadow-sm">
                LKD TERPIPA
              </span>
            </div>

            <div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Jumlah Pengurus RT / RW</p>
              <h4 className="text-2xl sm:text-3xl font-black text-slate-900 font-headline mt-0.5 sm:mt-1 tracking-tight">
                {totalKelembagaan.rtRwBpd.rtRwTotal.toLocaleString('id-ID')} RT & RW
              </h4>
              <p className="text-xs text-slate-600 font-medium mt-1">
                Terdiri dari <strong className="text-rose-700">{totalKelembagaan.rtRwBpd.rt} Ketua RT</strong> & <strong className="text-orange-700">{totalKelembagaan.rtRwBpd.rw} Ketua RW</strong> di 14 Desa.
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-5 pt-3 border-t border-rose-100 flex items-center justify-between text-xs font-bold text-rose-700">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
              584 RT & 88 RW
            </span>
            <Link href="/public/profil-perangkat" className="hover:underline flex items-center gap-1">
              <span>Rincian</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>

        {/* CARD 2: JUMLAH PERANGKAT DESA */}
        <motion.div 
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-indigo-50/90 via-purple-50/40 to-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-indigo-200/90 shadow-xl shadow-indigo-500/10 hover:shadow-2xl hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/30">
                <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-black text-indigo-700 bg-indigo-100/90 px-2.5 py-0.5 sm:py-1 rounded-full border border-indigo-200 uppercase shadow-sm">
                14 DESA TERDAFTAR
              </span>
            </div>

            <div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Jumlah Perangkat Desa</p>
              <h4 className="text-2xl sm:text-3xl font-black text-slate-900 font-headline mt-0.5 sm:mt-1 tracking-tight">
                {totalKelembagaan.perangkat.total.toLocaleString('id-ID')} Aparat
              </h4>
              <p className="text-xs text-slate-600 font-medium mt-1">
                <strong className="text-indigo-700">14 Kades</strong>, <strong className="text-indigo-700">14 Sekdes</strong>, <strong className="text-indigo-700">42 Kasi</strong>, <strong className="text-indigo-700">28 Kaur</strong>, <strong className="text-indigo-700">88 Staf</strong>, & <strong className="text-indigo-700">59 Kadus</strong>.
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-5 pt-3 border-t border-indigo-100 flex items-center justify-between text-xs font-bold text-indigo-700">
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
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-cyan-50/90 via-teal-50/40 to-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-cyan-200/90 shadow-xl shadow-cyan-500/10 hover:shadow-2xl hover:border-cyan-300 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 text-white flex items-center justify-center font-bold shadow-lg shadow-cyan-500/30">
                <Award className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-black text-cyan-800 bg-cyan-100/90 px-2.5 py-0.5 sm:py-1 rounded-full border border-cyan-200 uppercase shadow-sm">
                LEGISLATIF DESA
              </span>
            </div>

            <div>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Jumlah Anggota BPD</p>
              <h4 className="text-2xl sm:text-3xl font-black text-slate-900 font-headline mt-0.5 sm:mt-1 tracking-tight">
                {totalKelembagaan.rtRwBpd.bpd.toLocaleString('id-ID')} Anggota
              </h4>
              <p className="text-xs text-slate-600 font-medium mt-1">
                Badan Permusyawaratan Desa pengawas tata kelola APBDes & Perdes SK Bupati.
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-5 pt-3 border-t border-cyan-100 flex items-center justify-between text-xs font-bold text-cyan-800">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
              Total 96 BPD (14 Desa)
            </span>
            <Link href="/public/profil-perangkat" className="hover:underline flex items-center gap-1">
              <span>Rincian</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>

      </div>

      {/* EXPANDABLE OFFICIAL 14-VILLAGE TABLE MATCHING USER SCREENSHOT */}
      <AnimatePresence>
        {showTable && (
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
                Matriks Rekapitulasi Perangkat Desa, RT, RW, & BPD 14 Desa
              </h4>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Data Resmi Kecamatan
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
                    <th colSpan={4} className="bg-purple-900 border border-purple-800 px-3 py-2">JML RT, RW, BPD</th>
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
                    <td className="border border-purple-950 bg-purple-950 px-2.5 py-2 font-black text-amber-300">{totalKelembagaan.rtRwBpd.total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

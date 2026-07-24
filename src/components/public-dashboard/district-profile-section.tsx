'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAppSettings } from '@/lib/app-settings';
import { Building2, ShieldCheck, Landmark, CheckCircle2, Award, User, Sparkles, MapPin } from 'lucide-react';

export function DistrictProfileSection() {
  const { camatPhotoUrl, camatName, camatTitle, kecamatanMaksudTujuan } = useAppSettings();

  const displayCamatName = camatName || 'Fathan Ady Chandra, S.STP., M.M.';
  const displayCamatTitle = camatTitle || 'CAMAT GANDRUNGMANGU';
  const displayMaksudTujuan = kecamatanMaksudTujuan || 'Sistem Online Informasi & Data (SOLID) Kecamatan Gandrungmangu terintegrasi secara digital untuk mewujudkan transparansi tata kelola pemerintahan desa, akurasi data kependudukan, pemetaan infrastruktur jalan desa & kabupaten, serta percepatan pelayanan publik yang efektif dan akuntabel bagi seluruh masyarakat.';

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      
      {/* Outer Glowing Gradient Frame */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="p-[2px] rounded-[32px] bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400 shadow-2xl shadow-indigo-500/15 relative overflow-hidden"
      >
        {/* Inner Card Container */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[24px] sm:rounded-[30px] p-4 sm:p-10 relative overflow-hidden">
          
          {/* Ambient Glowing Blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: CAMAT PHOTO & NAME WITH VIBRANT FRAME & ANIMATIONS */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-4 flex flex-col items-center text-center"
            >
              <div className="relative group cursor-pointer">
                
                {/* Multi-color Animated Halo Ring */}
                <motion.div 
                  whileHover={{ scale: 1.03, rotate: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="p-1 sm:p-1.5 rounded-3xl bg-gradient-to-tr from-indigo-600 via-sky-400 to-emerald-400 shadow-xl shadow-indigo-500/30"
                >
                  <div className="w-44 h-60 sm:w-64 sm:h-80 rounded-[20px] sm:rounded-[22px] overflow-hidden border-2 border-white shadow-inner bg-gradient-to-b from-indigo-100 via-white to-sky-50 relative flex items-center justify-center">
                    {camatPhotoUrl ? (
                      <Image
                        src={camatPhotoUrl}
                        alt={displayCamatName}
                        fill
                        className="object-cover object-top group-hover:scale-108 transition-transform duration-700 ease-out"
                        priority
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 text-slate-400">
                        <User className="w-24 h-24 stroke-[1.2] text-indigo-500 mb-2 animate-bounce" />
                        <span className="text-xs font-semibold text-slate-500">Foto Camat belum diunggah</span>
                      </div>
                    )}
                    
                    {/* Vibrant Top Badge Overlay */}
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 via-indigo-600 to-sky-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 border border-white/40">
                      <Award className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
                      Kecamatan Gandrungmangu
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Below Photo Text Labels */}
              <div className="mt-5 space-y-2">
                <motion.h4 
                  whileHover={{ scale: 1.05 }}
                  className="text-base sm:text-lg font-black font-headline tracking-wide uppercase text-slate-900 drop-shadow-sm"
                >
                  {displayCamatTitle}
                </motion.h4>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="inline-block"
                >
                  <span className="text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-indigo-600 via-sky-600 to-indigo-700 px-4 py-1.5 rounded-full border border-indigo-300/40 shadow-md shadow-indigo-500/25 tracking-wide flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    {displayCamatName}
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: PROFIL & MAKSUD TUJUAN SISTEM WITH VIBRANT CARDS */}
            <motion.div 
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-8 space-y-6"
            >
              <div>
                {/* Header Badge */}
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="text-xs font-black tracking-widest text-indigo-700 uppercase bg-gradient-to-r from-indigo-100 via-sky-100 to-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-200 shadow-sm flex items-center gap-1.5">
                    <Landmark className="w-4 h-4 text-indigo-600" />
                    Profil & Maksud Tujuan Sistem
                  </span>
                </div>

                {/* Main Gradient Title */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-headline tracking-tight leading-tight bg-gradient-to-r from-indigo-900 via-indigo-700 to-sky-600 bg-clip-text text-transparent">
                  Sistem Online Informasi & Data Desa (SOLID)
                </h2>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-3 font-medium border-l-4 border-indigo-500 pl-4 py-1 bg-slate-50/80 rounded-r-xl">
                  {displayMaksudTujuan}
                </p>
              </div>

              {/* 3 COLORFUL CARDS WITH HOVER ANIMATIONS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                
                {/* CARD 1: TRANSPARANSI PUBLIK */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="bg-gradient-to-br from-indigo-50/90 via-purple-50/40 to-white p-4 sm:p-5 rounded-2xl border border-indigo-200/80 shadow-md hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-300">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-black text-indigo-700 bg-indigo-100/90 px-2 py-0.5 rounded-full border border-indigo-200 uppercase">
                        Keterbukaan
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-indigo-950 font-headline">Transparansi Publik</h4>
                    <p className="text-[11px] text-slate-600 leading-snug mt-1 font-medium">
                      Keterbukaan data anggaran, APBDes, & profil pemerintah desa secara terpadu.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-indigo-100/80 text-[10px] font-bold text-indigo-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                    <span>Real-time & Akuntabel</span>
                  </div>
                </motion.div>

                {/* CARD 2: PEMETAAN JALAN */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="bg-gradient-to-br from-sky-50/90 via-cyan-50/40 to-white p-4 sm:p-5 rounded-2xl border border-sky-200/80 shadow-md hover:shadow-lg hover:border-sky-300 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white flex items-center justify-center font-bold shadow-md shadow-sky-300">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-black text-sky-700 bg-sky-100/90 px-2 py-0.5 rounded-full border border-sky-200 uppercase">
                        Infrastruktur
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-sky-950 font-headline">Pemetaan Jalan</h4>
                    <p className="text-[11px] text-slate-600 leading-snug mt-1 font-medium">
                      Monitoring kondisi fisik & penanganan Jalan Desa serta Jalan Kabupaten.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-sky-100/80 text-[10px] font-bold text-sky-700 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-sky-600" />
                    <span>Desa & Kabupaten</span>
                  </div>
                </motion.div>

                {/* CARD 3: INTEGRASI 14 DESA */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white p-4 sm:p-5 rounded-2xl border border-emerald-200/80 shadow-md hover:shadow-lg hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-300">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-[9px] font-black text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-200 uppercase">
                        Terintegrasi
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-emerald-950 font-headline">Integrasi 14 Desa</h4>
                    <p className="text-[11px] text-slate-600 leading-snug mt-1 font-medium">
                      Satu platform terintegrasi untuk pelayanan publik Kecamatan Gandrungmangu.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-emerald-100/80 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>Gandrungmangu Unified</span>
                  </div>
                </motion.div>

              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}

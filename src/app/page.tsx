'use client';

import { Button } from '@/components/ui/button';
import { useAppSettings } from '@/lib/app-settings';
import { dataKependudukan, totalKependudukan } from '@/lib/kependudukan-data';
import { RoadAnalyticsSection } from '@/components/public-dashboard/road-analytics-section';
import { DistrictProfileSection } from '@/components/public-dashboard/district-profile-section';
import { DistrictGeographySection } from '@/components/public-dashboard/district-geography-section';
import { PerangkatSummarySection } from '@/components/public-dashboard/perangkat-summary-section';
import { P3keAnalyticsSection } from '@/components/public-dashboard/p3ke-analytics-section';
import { HealthAnalyticsSection } from '@/components/public-dashboard/health-analytics-section';
import { EconomyAnalyticsSection } from '@/components/public-dashboard/economy-analytics-section';
import { AgricultureAnalyticsSection } from '@/components/public-dashboard/agriculture-analytics-section';
import { RumahIbadahAgamaSection } from '@/components/public-dashboard/rumah-ibadah-agama-section';
import { VillageFinanceSection } from '@/components/public-dashboard/village-finance-section';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  Activity,
  BarChart3,
  Users,
  MapPin,
  Search,
  Lock,
  PlayCircle,
  PieChart,
  Home,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

function getYouTubeEmbedUrl(url: string | null): string {
  if (!url) return 'https://www.youtube.com/embed/dQw4w9WgXcQ';
  try {
    if (url.includes('youtube.com/embed/')) return url;
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtube.com/watch')) {
      const urlObj = new URL(url);
      const id = urlObj.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch (e) {
    // fallback
  }
  return 'https://www.youtube.com/embed/dQw4w9WgXcQ';
}

export default function Page() {
  const { backgroundUrl, logoUrl, profileVideoUrl } = useAppSettings();
  const embedVideoUrl = getYouTubeEmbedUrl(profileVideoUrl);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 overflow-x-hidden font-sans relative">
      {/* Background Organic Floating Blobs */}
      <div className="fixed top-20 -left-20 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none z-0 animate-pulse" />
      <div className="fixed top-1/2 -right-20 w-[30rem] h-[30rem] bg-sky-400/20 rounded-full blur-3xl pointer-events-none z-0 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="fixed bottom-10 left-1/3 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none z-0 animate-pulse" style={{ animationDelay: '4s' }} />

      {/* MODERN TOPOGRAPHIC CONTOUR OVERLAY PATTERN MATCHING REFERENCE IMAGE */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.25] mix-blend-multiply overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="topographic-contour-pattern" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
              <g fill="none" stroke="#4338CA" strokeWidth="1.2" strokeOpacity="0.22">
                {/* Major Elevation Contour Curves */}
                <path d="M -50,100 Q 50,20 150,120 T 350,80 T 450,150" />
                <path d="M -50,120 Q 50,40 150,140 T 350,100 T 450,170" />
                <path d="M -50,140 Q 50,60 150,160 T 350,120 T 450,190" />
                <path d="M -50,160 Q 50,80 150,180 T 350,140 T 450,210" />

                {/* Concentric Elevation Peaks / Hill Rings - Top Left */}
                <path d="M 60,70 C 90,40 140,50 160,80 C 180,110 140,150 90,140 C 50,130 40,90 60,70 Z" />
                <path d="M 75,80 C 95,55 130,65 145,88 C 160,110 130,138 95,130 C 65,120 60,95 75,80 Z" />
                <path d="M 90,90 C 105,72 122,78 132,94 C 142,110 120,126 100,120 C 80,112 80,98 90,90 Z" />

                {/* Lower Elevation Lines */}
                <path d="M -50,260 Q 80,180 200,280 T 450,230" />
                <path d="M -50,280 Q 80,200 200,300 T 450,250" />
                <path d="M -50,300 Q 80,220 200,320 T 450,270" />
                <path d="M -50,320 Q 80,240 200,340 T 450,290" />

                {/* Concentric Elevation Peaks / Hill Rings - Bottom Right */}
                <path d="M 240,240 C 280,200 340,210 370,250 C 400,290 360,350 300,340 C 240,330 210,270 240,240 Z" />
                <path d="M 255,255 C 288,220 330,228 352,260 C 375,292 342,332 298,324 C 252,315 230,275 255,255 Z" />
                <path d="M 270,270 C 295,240 320,245 334,270 C 348,295 324,314 295,308 C 265,300 250,285 270,270 Z" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topographic-contour-pattern)" />
        </svg>
      </div>

      {/* ------------------- ABOVE THE FOLD: HERO & TOP NAV ------------------- */}
      <div className="relative w-full bg-slate-950 text-white pt-6 pb-24 lg:pb-36 overflow-hidden">
        
        {/* Custom wallpaper background image from admin settings */}
        {backgroundUrl ? (
          <>
            <Image
              src={backgroundUrl}
              alt="Hero wallpaper background"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-indigo-950/65 to-slate-950/80 backdrop-brightness-95" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E1B4B] via-[#4338CA] to-[#0284C7]" />
        )}

        {/* Decorative Overlays */}
        <div className="absolute -top-32 -right-32 w-[40rem] h-[40rem] bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 -left-32 w-96 h-96 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* TOP NAVIGATION BAR */}
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 mb-8 lg:mb-14">
          <nav className="flex items-center justify-between bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 shadow-lg shadow-black/10">
            
            {/* LOGO & BRAND */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
              {logoUrl ? (
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 transition-transform group-hover:scale-105">
                  <Image src={logoUrl} alt="Logo" fill className="object-contain" />
                </div>
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-cyan-400/30 flex items-center justify-center border border-cyan-300/40 text-cyan-200 font-bold text-base">
                  •
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-headline font-black tracking-wider text-base sm:text-lg text-white group-hover:text-cyan-200 transition-colors">
                  SOLID
                </span>
                <span className="text-[9px] sm:text-[10px] text-cyan-200/80 font-medium -mt-1 tracking-widest uppercase">
                  Gandrungmangu
                </span>
              </div>
            </Link>

            {/* DESKOP CENTER NAV LINKS */}
            <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-100/90">
              <Link href="/" className="text-white font-semibold hover:text-cyan-200 transition-colors">
                Beranda
              </Link>
              <Link href="/public" className="hover:text-cyan-200 transition-colors">
                Layanan Publik
              </Link>
              <Link href="/pilih-desa" className="hover:text-cyan-200 transition-colors">
                Portal Desa
              </Link>
            </div>

            {/* DESKTOP ACTION BUTTONS (VISIBLE ON SM & UP) */}
            <div className="hidden sm:flex items-center gap-2 sm:gap-3">
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-medium px-4 py-2 transition-all hover:scale-105"
              >
                <Link href="/pilih-desa">
                  <Building className="mr-1.5 h-3.5 w-3.5 text-cyan-300" />
                  Operator Desa
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="rounded-full bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs sm:text-sm font-semibold px-4 py-2 shadow-md shadow-sky-500/30 transition-all hover:scale-105 border border-sky-300/40"
              >
                <Link href="/login">
                  <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                  Admin
                </Link>
              </Button>
            </div>

            {/* MOBILE HAMBURGER TOGGLE BUTTON (VISIBLE ONLY ON MOBILE <640px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
              className="sm:hidden w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center border border-white/30 transition-all shadow-md cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-amber-300" /> : <Menu className="w-5 h-5 text-white" />}
            </button>

          </nav>

          {/* MOBILE DROPDOWN DRAWER OVERLAY */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="sm:hidden mt-3 bg-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-3xl p-5 shadow-2xl space-y-4 relative z-40 text-left"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-black tracking-widest text-cyan-300 uppercase">
                    MENU NAVIGASI MOBILE
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    Kecamatan Gandrungmangu
                  </span>
                </div>

                <div className="space-y-2">
                  <Link
                    href="/public"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-sm shadow-md transition-all active:scale-98"
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-cyan-200" />
                      <span>Akses Publik</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-80" />
                  </Link>

                  <Link
                    href="/pilih-desa"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/15 transition-all active:scale-98"
                  >
                    <div className="flex items-center gap-2.5">
                      <Building className="w-4 h-4 text-cyan-300" />
                      <span>Portal Operator Desa</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-80" />
                  </Link>

                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/15 transition-all active:scale-98"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Login Admin Kecamatan</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-80" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* HERO CONTENT CONTAINER (LEFT-ALIGNED LAYOUT MATCHING MAX-W-7XL) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left flex flex-col items-start space-y-7 w-full">
          
          {/* Badge Tag */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 border border-white/20 text-xs sm:text-sm font-medium text-cyan-200">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Sistem Informasi Terpadu Desa</span>
          </div>

          {/* Main Title SOLID */}
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-7xl lg:text-8xl font-black font-headline tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 via-sky-200 to-white animate-shimmer animate-float-subtle drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] select-none"
          >
            SOLID
          </motion.h1>

          {/* Extended Sub-headline / System Name */}
          <div className="space-y-2 sm:space-y-3 max-w-3xl text-left">
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-cyan-100 font-headline leading-tight tracking-tight">
              Sistem Olah Laporan Informasi
              <br />
              & Data Desa
            </h2>
            <div className="inline-block rounded-full bg-cyan-400/15 border border-cyan-300/30 px-3.5 sm:px-5 py-1 sm:py-1.5 shadow-sm">
              <span className="text-[10px] sm:text-sm font-black tracking-widest text-sky-200 uppercase">
                KECAMATAN GANDRUNGMANGU
              </span>
            </div>
          </div>

          {/* Extended Description */}
          <p className="text-xs sm:text-lg text-slate-200/90 leading-relaxed font-normal max-w-3xl text-left">
            Memberikan kemudahan akses data dan informasi yang akurat,
            <br className="hidden sm:inline" />
            serta meningkatkan transparansi dan efisiensi dalam pengelolaan data desa.
          </p>

          {/* CTA Pill Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3 sm:gap-4 w-full sm:w-auto">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold text-xs sm:text-base px-6 sm:px-8 py-5 sm:py-6 uppercase tracking-wider glow-cyan transition-all hover:scale-105 border border-sky-300/40 w-full sm:w-auto justify-center"
            >
              <Link href="/public">
                <Globe className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" />
                Akses Publik
                <ArrowRight className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md px-6 sm:px-7 py-5 sm:py-6 text-xs sm:text-sm font-semibold transition-all hover:scale-105 w-full sm:w-auto justify-center"
            >
              <Link href="/pilih-desa">
                <Building className="mr-2 h-4 w-4 text-cyan-300" />
                Portal Operator
              </Link>
            </Button>
          </div>

          {/* Trust Indicators / Stats Row */}
          <div className="pt-4 sm:pt-6 border-t border-white/15 grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-xl text-left">
            <div>
              <p className="text-xl sm:text-3xl font-black text-white">14</p>
              <p className="text-[10px] sm:text-xs text-cyan-200/80 mt-0.5 font-medium">Desa Terhubung</p>
            </div>
            <div>
              <p className="text-xl sm:text-3xl font-black text-cyan-300">100%</p>
              <p className="text-[10px] sm:text-xs text-cyan-200/80 mt-0.5 font-medium">Transparan</p>
            </div>
            <div>
              <p className="text-xl sm:text-3xl font-black text-white">Realtime</p>
              <p className="text-[10px] sm:text-xs text-cyan-200/80 mt-0.5 font-medium">Integrasi Data</p>
            </div>
          </div>

        </div>

        {/* CENTERED ELEGANT SCROLL INDICATOR */}
        <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 text-center text-white/90 z-20 flex flex-col items-center gap-0.5 pointer-events-none select-none">
          <span className="text-[9px] sm:text-[11px] font-mono font-bold tracking-[0.35em] uppercase text-slate-200/90 drop-shadow">
            SCROLL
          </span>
          <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300 animate-bounce drop-shadow" />
        </div>

        {/* SMOOTH DARK GRADIENT FADE TRANSITION (ZERO WHITE LINE SEAM) */}
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-36 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950/90 pointer-events-none z-10" />

      </div>

      {/* PROFIL KECAMATAN & MAKSUD TUJUAN SISTEM */}
      <DistrictProfileSection />

      {/* VIDEO PROFIL KECAMATAN GANDRUNGMANGU (DIBAWAH PROFIL & MAKSUD TUJUAN) */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#0EA5E9] uppercase bg-sky-50 px-4 py-1.5 rounded-full border border-sky-100 inline-flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-[#0EA5E9]" />
            VIDEO PROFIL KECAMATAN
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-headline text-slate-900 tracking-tight">
            Video Profil Kecamatan Gandrungmangu
          </h2>
          <p className="text-sm sm:text-lg text-slate-600 font-normal">
            Saksikan tayangan profil daerah, potensi desa, serta pelayanan publik terpadu di wilayah Kecamatan Gandrungmangu.
          </p>
        </div>

        {/* Video Player Container */}
        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-950 relative group">
          <div className="aspect-video w-full relative">
            <iframe
              src={embedVideoUrl}
              title="Video Profil Kecamatan Gandrungmangu"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </div>
      </section>

      {/* PROFIL GEOGRAFI & BATAS WILAYAH KECAMATAN */}
      <DistrictGeographySection />

      {/* ------------------- DEMOGRAFI & DATA KEPENDUDUKAN TERPADU (COMPACT SINGLE ROW LAYOUT) ------------------- */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-slate-200/80 pb-6">
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-widest text-[#4F46E5] uppercase bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100 inline-flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-[#4F46E5]" />
              DEMOGRAFI KECAMATAN
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-headline text-slate-900 tracking-tight">
              Data Kependudukan Terpadu
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Rekapitulasi statistik 14 Desa di Kecamatan Gandrungmangu dalam satu panel demografi terpadu.
          </p>
        </div>

        {/* 2. UNIFIED MAIN ANALYTICS ROW (DONUT CHART & MODERN DIAGRAM 14 DESA) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* COLUMN 1: 2 STACKED CARDS (4 COLS) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4">
            
            {/* CARD 1: RASIO GENDER KESELURUHAN (COMPACT METRIC CARD AT TOP) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-gradient-to-br from-indigo-50/90 via-purple-50/40 to-white rounded-2xl p-4 sm:p-5 border border-indigo-200/90 shadow-lg shadow-indigo-500/10 hover:shadow-xl hover:border-indigo-300 transition-all"
            >
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2.5 mb-3">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-headline flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600 animate-pulse" />
                  Rasio Gender Keseluruhan
                </h3>
                <span className="text-[10px] font-black text-white bg-gradient-to-r from-indigo-600 to-purple-600 px-2.5 py-0.5 rounded-full shadow-sm">
                  {totalKependudukan.penduduk.total.toLocaleString('id-ID')} Jiwa
                </span>
              </div>

              {/* Progress Bar & Stats Grid */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-indigo-100/90 via-indigo-50 to-white p-2.5 rounded-xl border border-indigo-200/90 shadow-sm cursor-pointer transition-all"
                  >
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Laki-laki (50,8%)</p>
                    <p className="text-sm font-black text-indigo-700 font-headline mt-0.5">{totalKependudukan.penduduk.l.toLocaleString('id-ID')} Jiwa</p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-sky-100/90 via-sky-50 to-white p-2.5 rounded-xl border border-sky-200/90 shadow-sm cursor-pointer transition-all"
                  >
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Perempuan (49,2%)</p>
                    <p className="text-sm font-black text-sky-700 font-headline mt-0.5">{totalKependudukan.penduduk.p.toLocaleString('id-ID')} Jiwa</p>
                  </motion.div>
                </div>

                <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 flex items-center border border-indigo-200/80 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '50.8%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    className="bg-gradient-to-r from-indigo-600 to-purple-500 h-full rounded-l-full" 
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '49.2%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
                    className="bg-gradient-to-r from-sky-400 to-cyan-400 h-full rounded-r-full ml-0.5" 
                  />
                </div>
              </div>
            </motion.div>

            {/* CARD 2: PROPORSI KK PER DESA (PERFECTLY ALIGNED TO BOTTOM OF COLUMN 2) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-gradient-to-br from-sky-50/90 via-indigo-50/40 to-white rounded-2xl p-4 border border-sky-200/90 shadow-lg shadow-sky-500/10 hover:shadow-xl hover:border-sky-300 transition-all flex-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-sky-100 pb-2 mb-1">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-headline">Proporsi KK per Desa</h3>
                  <span className="text-[10px] font-black text-white bg-gradient-to-r from-sky-500 to-indigo-600 px-2.5 py-0.5 rounded-full shadow-sm">
                    Pie Chart
                  </span>
                </div>

                {/* Pie/Donut SVG (Centered Vertically) */}
                <div className="my-auto py-2 flex flex-col items-center justify-center">
                  <motion.div 
                    initial={{ scale: 0.85, rotate: -20, opacity: 0 }}
                    whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "backOut", delay: 0.3 }}
                    className="relative w-full max-w-[320px] aspect-square flex items-center justify-center"
                  >
                    <svg className="w-full h-full" viewBox="0 0 300 300">
                      <g transform="rotate(-90 150 150)">
                        <circle cx="150" cy="150" r="62" stroke="#F1F5F9" strokeWidth="15" fill="transparent" />
                      </g>
                      {(() => {
                        const colors = [
                          '#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6', 
                          '#EC4899', '#06B6D4', '#6366F1', '#14B8A6', '#F97316', 
                          '#3B82F6', '#A855F7', '#84CC16', '#EAB308'
                        ];
                        const sortedKK = [...dataKependudukan].sort((a, b) => b.kk.total - a.kk.total);
                        const totalKKCount = totalKependudukan.kk.total;
                        
                        const r = 62;
                        const c = 2 * Math.PI * r; // ~389.55
                        let accumulatedOffset = 0;
                        let currentAngle = -Math.PI / 2;

                        return sortedKK.map((d, i) => {
                          const portion = d.kk.total / totalKKCount;
                          const arcLength = portion * c;
                          const dasharray = `${arcLength} ${c - arcLength}`;
                          const offset = -accumulatedOffset;
                          accumulatedOffset += arcLength;

                          const sliceAngle = portion * 2 * Math.PI;
                          const midAngle = currentAngle + sliceAngle / 2;
                          currentAngle += sliceAngle;

                          const color = colors[i % colors.length];

                          const rStart = 71;
                          const rElbow = 88;
                          const x1 = 150 + rStart * Math.cos(midAngle);
                          const y1 = 150 + rStart * Math.sin(midAngle);
                          const x2 = 150 + rElbow * Math.cos(midAngle);
                          const y2 = 150 + rElbow * Math.sin(midAngle);

                          const isRight = Math.cos(midAngle) >= 0;
                          const x3 = isRight ? x2 + 5 : x2 - 5;
                          const textAnchor = isRight ? 'start' : 'end';
                          const textX = isRight ? x3 + 2 : x3 - 2;

                          return (
                            <g key={d.desa} className="group/slice cursor-pointer">
                              <circle
                                cx="150"
                                cy="150"
                                r={r}
                                stroke={color}
                                strokeWidth="15"
                                fill="transparent"
                                strokeDasharray={dasharray}
                                strokeDashoffset={offset}
                                transform="rotate(-90 150 150)"
                                className="transition-all duration-300 hover:stroke-[19] hover:opacity-100 opacity-90"
                              >
                                <title>{`${d.desa}: ${d.kk.total.toLocaleString('id-ID')} KK`}</title>
                              </circle>

                              <polyline
                                points={`${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)} ${x3.toFixed(1)},${y2.toFixed(1)}`}
                                stroke={color}
                                strokeWidth="0.85"
                                strokeDasharray="1.5,1.5"
                                fill="none"
                                className="opacity-85 transition-opacity group-hover/slice:opacity-100"
                              />
                              <circle cx={x1.toFixed(1)} cy={y1.toFixed(1)} r="1.3" fill={color} />

                              <text
                                x={textX.toFixed(1)}
                                y={y2.toFixed(1)}
                                textAnchor={textAnchor}
                                className="pointer-events-none select-none"
                              >
                                <tspan x={textX.toFixed(1)} dy="-2" className="text-[5.2px] font-bold fill-slate-800">
                                  {d.desa}
                                </tspan>
                                <tspan x={textX.toFixed(1)} dy="6" fill={color} className="text-[4.6px] font-black">
                                  {d.kk.total.toLocaleString('id-ID')} KK
                                </tspan>
                              </text>
                            </g>
                          );
                        });
                      })()}

                      <text x="150" y="145" textAnchor="middle" className="text-[19px] font-black fill-slate-900 font-headline pointer-events-none">
                        {totalKependudukan.kk.total.toLocaleString('id-ID')}
                      </text>
                      <text x="150" y="158" textAnchor="middle" className="text-[6.5px] font-bold fill-indigo-600 tracking-wider uppercase pointer-events-none">
                        TOTAL KK
                      </text>
                    </svg>
                  </motion.div>
                </div>
              </div>

              {/* Bottom 1-Line Compact Summary */}
              <div className="pt-2 border-t border-sky-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span className="bg-indigo-50/90 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100">Terbanyak: <strong className="font-bold">Layansari (3.703)</strong></span>
                <span className="bg-sky-50/90 text-sky-700 px-2 py-0.5 rounded-md border border-sky-100">Terendah: <strong className="font-bold">Rungkang (1.205)</strong></span>
              </div>
            </motion.div>

          </div>

          {/* COLUMN 2: DIAGRAM MODERN DISTRIBUSI PENDUDUK 14 DESA (8 COLS) */}
          <motion.div 
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-8 bg-gradient-to-br from-slate-50/90 via-indigo-50/40 to-white rounded-2xl p-5 sm:p-6 border border-indigo-200/90 shadow-xl shadow-indigo-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-indigo-100 pb-3 mb-4 gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-headline">Diagram Distribusi Penduduk 14 Desa</h3>
                  <p className="text-xs text-slate-500 font-medium">Pemetaan proporsi populasi Laki-laki & Perempuan per desa</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold bg-gradient-to-r from-indigo-100/90 via-sky-100/90 to-purple-50 px-3 py-1.5 rounded-xl border border-indigo-200 shadow-sm">
                  <span className="flex items-center gap-1.5 text-indigo-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block animate-pulse" />
                    Laki-laki: <strong className="font-extrabold text-slate-900">{totalKependudukan.penduduk.l.toLocaleString('id-ID')} Jiwa</strong> (50,8%)
                  </span>
                  <span className="flex items-center gap-1.5 text-sky-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block animate-pulse" />
                    Perempuan: <strong className="font-extrabold text-slate-900">{totalKependudukan.penduduk.p.toLocaleString('id-ID')} Jiwa</strong> (49,2%)
                  </span>
                </div>
              </div>

              {/* 2-COLUMN GRID DIAGRAM FOR 14 VILLAGES WITH STAGGERED ANIMATIONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {[...dataKependudukan]
                  .sort((a, b) => b.penduduk.total - a.penduduk.total)
                  .map((d, index) => {
                    const maxTotal = 12669;
                    const widthPercent = (d.penduduk.total / maxTotal) * 100;
                    const maleRatio = (d.penduduk.l / d.penduduk.total) * 100;
                    const femaleRatio = (d.penduduk.p / d.penduduk.total) * 100;

                    return (
                      <motion.div 
                        key={d.desa} 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
                        whileHover={{ x: 4, transition: { duration: 0.15 } }}
                        className="group space-y-1 cursor-pointer bg-white/70 p-2 rounded-xl border border-indigo-100/70 hover:bg-indigo-50/80 hover:border-indigo-200 transition-all shadow-sm"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-800 font-headline flex items-center gap-1 group-hover:text-indigo-600 transition-colors">
                            <span className="w-4 text-[10px] text-slate-400 font-mono text-center font-bold">#{index + 1}</span>
                            {d.desa}
                            <span className="text-[10px] text-slate-400 font-normal ml-0.5 hidden sm:inline">
                              ({d.penduduk.l.toLocaleString('id-ID')}L / {d.penduduk.p.toLocaleString('id-ID')}P)
                            </span>
                          </span>
                          <span className="text-slate-900 font-extrabold text-[11px] bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 group-hover:bg-indigo-50 group-hover:border-indigo-200 transition-colors">
                            {d.penduduk.total.toLocaleString('id-ID')} Jiwa
                          </span>
                        </div>

                        {/* Modern Animated Stacked Bar Diagram */}
                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex items-center border border-slate-200/80 group-hover:border-indigo-300 transition-colors">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${widthPercent}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 + index * 0.03, ease: "easeOut" }}
                            className="h-full rounded-full flex overflow-hidden"
                          >
                            <div 
                              className="bg-indigo-600 h-full hover:bg-indigo-700 transition-colors" 
                              style={{ width: `${maleRatio}%` }} 
                              title={`Laki-laki: ${d.penduduk.l.toLocaleString('id-ID')} Jiwa (${maleRatio.toFixed(1)}%)`}
                            />
                            <div 
                              className="bg-sky-400 h-full hover:bg-sky-500 transition-colors" 
                              style={{ width: `${femaleRatio}%` }} 
                              title={`Perempuan: ${d.penduduk.p.toLocaleString('id-ID')} Jiwa (${femaleRatio.toFixed(1)}%)`}
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })
                }
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-500 gap-1">
              <span>Total Kecamatan: <strong className="text-indigo-700">{totalKependudukan.penduduk.l.toLocaleString('id-ID')} Laki-laki</strong> | <strong className="text-sky-600">{totalKependudukan.penduduk.p.toLocaleString('id-ID')} Perempuan</strong></span>
              <span className="font-semibold text-indigo-600">14 Desa Terdaftar ({totalKependudukan.penduduk.total.toLocaleString('id-ID')} Jiwa)</span>
            </div>
          </motion.div>

        </div>

        {/* DATA RUMAH IBADAH & KEPERCAYAAN 14 DESA */}
        <RumahIbadahAgamaSection />

        {/* REKAPITULASI KELEMBAGAAN DESA (RT/RW, PERANGKAT DESA, BPD) */}
        <PerangkatSummarySection />

        {/* KEUANGAN DESA & REALISASI MONEV APBDES */}
        <VillageFinanceSection />

      </section>

      {/* NEW ANALYTICS SECTION: JALAN DESA & JALAN KABUPATEN */}
      <RoadAnalyticsSection />

      {/* DASHBOARD P3KE & PENANGGULANGAN KEMISKINAN EKSTREM */}
      <P3keAnalyticsSection />

      {/* REKAPITULASI DATA KESEHATAN (POSYANDU, KADER, BALITA, STUNTING, BUMIL KEK, LANSIA, DISABILITAS) */}
      <HealthAnalyticsSection />

      {/* DASHBOARD SEKTOR EKONOMI & KELEMBAGAAN DESA */}
      <EconomyAnalyticsSection />

      {/* DASHBOARD SEKTOR PERTANIAN & PETERNAKAN */}
      <AgricultureAnalyticsSection />



      {/* ------------------- ENHANCED FOOTER SECTION ------------------- */}
      <footer className="bg-slate-950 text-slate-300 py-14 border-t border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3 text-center md:text-left">
            {logoUrl ? (
              <div className="relative w-11 h-11">
                <Image src={logoUrl} alt="Logo" fill className="object-contain" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center font-bold">
                •
              </div>
            )}
            <div>
              <p className="text-base sm:text-lg font-extrabold text-white font-headline">SOLID - Kecamatan Gandrungmangu</p>
              <p className="text-sm text-slate-400">Sistem Olah Laporan Informasi & Data Desa</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm sm:text-base font-semibold">
            <Link href="/public" className="text-slate-300 hover:text-cyan-300 transition-colors">
              Akses Publik
            </Link>
            <Link href="/pilih-desa" className="text-slate-300 hover:text-cyan-300 transition-colors">
              Portal Operator
            </Link>
            <Link href="/login" className="text-slate-300 hover:text-cyan-300 transition-colors">
              Admin Kecamatan
            </Link>
          </div>

          <p className="text-sm text-slate-400 text-center md:text-right font-medium">
            &copy; {new Date().getFullYear()} SOLID. Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>

    </div>
  );
}

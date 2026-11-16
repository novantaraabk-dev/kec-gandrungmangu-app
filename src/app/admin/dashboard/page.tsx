'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ClipboardCheck, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { villages } from '@/lib/villages';
import { VillageDataDisplay } from '@/components/public-dashboard/village-data-display';

export default function DashboardPage() {
  const [selectedVillage, setSelectedVillage] = useState('kecamatan');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-600 mt-1">Pilih wilayah untuk melihat rekapitulasi data Kecamatan &amp; Desa.</p>
        </div>
        <Select value={selectedVillage} onValueChange={setSelectedVillage}>
            <SelectTrigger className="w-full sm:w-[280px] rounded-xl bg-white/75 backdrop-blur-md border-white/80 shadow-sm">
                <SelectValue placeholder="Pilih Wilayah..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
                <SelectItem value="kecamatan">Rekapitulasi Kecamatan</SelectItem>
                {villages.map((v) => (
                <SelectItem key={v} value={v.toLowerCase()}>{v}</SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>

      {/* Featured Teal Banner Card matching reference aesthetic */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#1b8f97] via-[#0f766e] to-[#0b4f58] p-6 text-white shadow-[0_18px_40px_-15px_rgba(15,118,110,0.45)]"
      >
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-16 -bottom-12 h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-teal-100/90">
              <Sparkles className="h-3.5 w-3.5" />
              Sistem Informasi Kecamatan Gandrungmangu
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Kelola Monitoring &amp; Evaluasi APBDes Lebih Cepat
            </h2>
            <p className="text-sm text-teal-50/85 max-w-2xl">
              Pantau realisasi anggaran per tahapan, sisa anggaran, dan cetak rekap hasil monev dalam format A4.
            </p>
          </div>
          <Button
            asChild
            className="rounded-full bg-white text-teal-900 hover:bg-teal-50 font-semibold px-5 shadow-md shrink-0 transition-transform hover:scale-[1.02]"
          >
            <Link href="/admin/monev">
              <ClipboardCheck className="mr-2 h-4 w-4 text-teal-700" />
              Buka Monev APBDes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.div>

      <VillageDataDisplay village={selectedVillage} />
    </div>
  );
}

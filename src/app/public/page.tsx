'use client';

import {
  BookOpen,
  Landmark,
  Users,
  Map,
  ClipboardList,
  Heart,
  HandHelping,
  Milestone,
} from 'lucide-react';
import { DataCard } from '@/components/public-dashboard/data-card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

const dataCards = [
  {
    title: 'APBDes per Desa',
    description: 'Rincian Anggaran Pendapatan dan Belanja Desa.',
    icon: <Landmark className="h-8 w-8" />,
    href: '/public/apbdes',
    status: 'active',
    color: 'blue',
  },
  {
    title: 'Prioritas Dana Desa',
    description: 'Fokus dan alokasi penggunaan Dana Desa tahunan.',
    icon: <ClipboardList className="h-8 w-8" />,
    href: '/public/prioritas-dana-desa',
    status: 'soon',
    color: 'green',
  },
  {
    title: 'Profil Perangkat Desa',
    description: 'Struktur organisasi dan profil aparat desa.',
    icon: <Users className="h-8 w-8" />,
    href: '/public/profil-perangkat',
    status: 'active',
    color: 'purple',
  },
  {
    title: 'Data Kependudukan',
    description: 'Informasi demografi penduduk per desa.',
    icon: <Users className="h-8 w-8" />,
    href: '/public/kependudukan',
    status: 'active',
    color: 'sky',
  },
  {
    title: 'Data Kesehatan',
    description: 'Indikator stunting dan kesehatan keluarga.',
    icon: <Heart className="h-8 w-8" />,
    href: '/public/kesehatan',
    status: 'soon',
    color: 'rose',
  },
  {
    title: 'Database Jalan Desa',
    description: 'Data kondisi dan infrastruktur jalan desa.',
    icon: <Map className="h-8 w-8" />,
    href: '/public/jalan-desa',
    status: 'active',
    color: 'orange',
  },
  {
    title: 'Jalan Kabupaten',
    description: 'Data kondisi dan infrastruktur ruas jalan kabupaten (data admin).',
    icon: <Milestone className="h-8 w-8" />,
    href: '/public/jalan-kabupaten',
    status: 'active',
    color: 'indigo',
  },
  {
    title: 'Program P3KE',
    description: 'Program Percepatan Penghapusan Kemiskinan Ekstrem.',
    icon: <HandHelping className="h-8 w-8" />,
    href: '/public/p3ke',
    status: 'soon',
    color: 'teal',
  },
];

export default function PublicDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCards = dataCards.filter((card) =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="container max-w-7xl py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl font-headline">
            Dashboard Publik
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Akses data dan informasi publik dari desa-desa di Kecamatan Gandrungmangu.
          </p>
        </div>

        <div className="relative my-10 max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Cari kategori data..."
              className="pl-12 h-12 text-lg rounded-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCards.map((card) => (
            <DataCard
              key={card.title}
              title={card.title}
              description={card.description}
              icon={card.icon}
              href={card.href}
              status={card.status as 'active' | 'soon'}
              color={card.color as any}
            />
          ))}
        </div>
      </div>
  );
}

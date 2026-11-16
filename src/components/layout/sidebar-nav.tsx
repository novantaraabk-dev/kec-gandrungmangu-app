
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCog,
  Landmark,
  Settings,
  Map,
  BookText,
  HeartPulse,
  ClipboardList,
  HandHeart,
  FileText,
  DollarSign,
  ClipboardCheck,
  Printer,
  Archive,
  University,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User } from '@/lib/auth';
import { villages } from '@/lib/villages';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface SidebarNavProps {
  role: User['role'];
  onLinkClick?: () => void;
}

interface BaseNavItem {
  label: string;
  icon: React.ElementType;
  roles: User['role'][];
}

interface LinkNavItem extends BaseNavItem {
  href: string;
  basePath?: never;
  subItems?: never;
}

interface AccordionNavItem extends BaseNavItem {
  basePath: string;
  subItems: { label: string; href: string }[];
  href?: never;
}

type NavItem = LinkNavItem | AccordionNavItem;

const NavLink = ({
  href,
  label,
  icon: Icon,
  isActive,
  onLinkClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  onLinkClick?: () => void;
}) => (
  <Link
    href={href}
    onClick={onLinkClick}
    className={cn(
      'group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200',
      isActive
        ? 'bg-gradient-to-r from-[#198f96] to-[#0f6b74] text-white font-semibold shadow-md shadow-teal-700/20'
        : 'text-slate-600 hover:bg-white/70 hover:text-teal-800 hover:translate-x-0.5'
    )}
  >
    <Icon
      className={cn(
        'h-[18px] w-[18px] transition-colors duration-200',
        isActive ? 'text-white' : 'text-teal-700/75 group-hover:text-teal-700'
      )}
    />
    <span className="truncate">{label}</span>
  </Link>
);

const NavAccordion = ({
  item,
  pathname,
  onLinkClick,
}: {
  item: AccordionNavItem;
  pathname: string;
  onLinkClick?: () => void;
}) => (
  <Accordion
    type="single"
    collapsible
    className="w-full"
    defaultValue={
      item.basePath && pathname.startsWith(item.basePath)
        ? item.label
        : undefined
    }
  >
    <AccordionItem value={item.label} className="border-none">
      <AccordionTrigger
        className={cn(
          'group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-white/70 hover:text-teal-800 hover:no-underline [&[data-state=open]]:bg-white/60 [&[data-state=open]]:text-teal-800',
          item.basePath &&
            pathname.startsWith(item.basePath) &&
            'bg-gradient-to-r from-[#198f96]/15 to-[#0f6b74]/10 text-teal-800 font-semibold'
        )}
      >
        <div className="flex items-center gap-3">
          <item.icon className="h-[18px] w-[18px] text-teal-700/80" />
          <span>{item.label}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pl-8 pt-1">
        <div className="flex flex-col gap-1 border-l border-teal-200/70 pl-2">
          {item.subItems.map((subItem) => (
            <Link
              key={subItem.href}
              href={subItem.href}
              onClick={onLinkClick}
              className={cn(
                'block rounded-lg px-3 py-1.5 text-sm text-slate-600 transition-all duration-200 hover:bg-white/70 hover:text-teal-800',
                pathname === subItem.href &&
                  'bg-gradient-to-r from-[#198f96] to-[#0f6b74] text-white font-semibold shadow-sm shadow-teal-700/20'
              )}
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

const NavCategory = ({ title }: { title: string }) => (
    <h4 className="px-3 pt-4 pb-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
        {title}
    </h4>
);


export function SidebarNav({ role, onLinkClick }: SidebarNavProps) {
  const pathname = usePathname();

  const navConfig: Record<string, NavItem[]> = {
    'BERANDA': [
        { href: '/admin/dashboard', label: 'Dashboard Admin', icon: LayoutDashboard, roles: ['admin', 'operator'] },
    ],
    'KEUANGAN DESA': [
        {
          label: 'APBDes',
          icon: Landmark,
          basePath: '/admin/apbdes',
          roles: ['admin', 'operator'],
          subItems: villages.map(v => ({ label: v, href: `/admin/apbdes/${v.toLowerCase()}` })),
        },
        { href: '/admin/spj-desa', label: 'SPJ Desa', icon: FileText, roles: ['admin', 'operator'] },
        { href: '/admin/prioritas-dana-desa', label: 'Prioritas Dana Desa', icon: DollarSign, roles: ['admin'] },
        { href: '/admin/monev', label: 'Input Hasil Monev', icon: ClipboardCheck, roles: ['admin'] },
        { href: '/admin/monev/berita-acara', label: 'Cetak Dokumen Monev', icon: Printer, roles: ['admin'] },
    ],
    'DATA & ADMINISTRASI': [
        {
          label: 'Profil Perangkat',
          icon: Users,
          basePath: '/admin/profil-perangkat',
          roles: ['admin'],
          subItems: villages.map(v => ({ label: v, href: `/admin/profil-perangkat/${v.toLowerCase()}` })),
        },
        { href: '/admin/kependudukan', label: 'Kependudukan', icon: ClipboardList, roles: ['admin', 'operator'] },
        {
          label: 'Data Kesehatan',
          icon: HeartPulse,
          basePath: '/admin/kesehatan',
          roles: ['admin', 'operator'],
          subItems: [
            { label: 'Stunting', href: '/admin/kesehatan/stunting' },
            { label: 'Ibu Hamil KEK', href: '/admin/kesehatan/bumil-kek' },
            { label: 'Jumlah Balita', href: '/admin/kesehatan/balita' },
            { label: 'Posyandu', href: '/admin/kesehatan/posyandu' },
          ],
        },
        {
          label: 'Database Jalan Desa',
          icon: Map,
          basePath: '/admin/jalan-desa',
          roles: ['admin', 'operator'],
          subItems: villages.map(v => ({ label: v, href: `/admin/jalan-desa/${v.toLowerCase()}` })),
        },
        { href: '/admin/jalan-kabupaten', label: 'Jalan Kabupaten', icon: Map, roles: ['admin'] },
        { href: '/admin/produk-hukum', label: 'Produk Hukum Desa', icon: BookText, roles: ['admin', 'operator'] },
        { href: '/admin/rekap-pbb-p2', label: 'Rekap PBB P2', icon: Landmark, roles: ['admin'] },
        { href: '/admin/linmas-desa', label: 'Linmas Desa', icon: Shield, roles: ['admin'] },
    ],
    'DATA UMUM': [
        { href: '/admin/data-umum/rumah-ibadah', label: 'Rumah Ibadah', icon: University, roles: ['admin', 'operator'] },
        { href: '/admin/data-umum/agama', label: 'Penduduk Berdasarkan Agama', icon: Users, roles: ['admin', 'operator'] },
        { href: '/admin/data-umum/pasar-desa', label: 'Pasar Desa', icon: Landmark, roles: ['admin'] },
        { href: '/admin/data-umum/bumdes', label: 'BUMDes', icon: DollarSign, roles: ['admin'] },
        { href: '/admin/data-umum/mbg', label: 'MBG', icon: HandHeart, roles: ['admin'] },
    ],
    'PROGRAM & BANTUAN': [
        {
          label: 'P3KE',
          icon: ClipboardList,
          basePath: '/admin/p3ke',
          roles: ['admin', 'operator'],
          subItems: villages.map(v => ({ label: v, href: `/admin/p3ke/${v.toLowerCase()}` })),
        },
        { href: '/admin/beneficiaries', label: 'KPM BLT-DD', icon: HandHeart, roles: ['admin', 'operator'] },
    ],
    'ARSIP': [
      { href: '/admin/arsip', label: 'Arsip Dokumen', icon: Archive, roles: ['admin'] },
    ],
    'PENGATURAN': [
        { href: '/admin/users', label: 'Manajemen User', icon: UserCog, roles: ['admin'] },
        { href: '/admin/desa-settings', label: 'Pengaturan Desa', icon: Settings, roles: ['admin'] },
        { href: '/admin/settings', label: 'Pengaturan Aplikasi', icon: Settings, roles: ['admin'] },
    ],
  };

  return (
    <nav className="grid items-start px-4 text-base font-medium">
      {Object.entries(navConfig).map(([category, items]) => (
        <React.Fragment key={category}>
            <NavCategory title={category} />
            {items.filter(item => item.roles.includes(role)).map(item =>
                item.subItems ? (
                    <NavAccordion key={item.label} item={item} pathname={pathname} onLinkClick={onLinkClick} />
                ) : (
                    item.href && (
                        <NavLink
                            key={item.href}
                            href={item.href}
                            label={item.label}
                            icon={item.icon}
                            isActive={pathname === item.href}
                            onLinkClick={onLinkClick}
                        />
                    )
                )
            )}
        </React.Fragment>
      ))}
    </nav>
  );
}

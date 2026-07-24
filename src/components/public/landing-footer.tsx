import Link from "next/link";
import { AppLogo } from "../layout/app-logo";

export function LandingFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <AppLogo theme="dark" />
            <p className="mt-4 text-sm">
              Sistem Olah Laporan Informasi & Data Desa. Memberdayakan desa melalui digitalisasi.
            </p>
          </div>
          <div className="col-span-1 md:col-start-3">
            <h3 className="font-semibold text-slate-200 tracking-wider uppercase">Tautan</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#features" className="hover:text-primary transition-colors">Fitur</Link></li>
              <li><Link href="#statistics" className="hover:text-primary transition-colors">Statistik</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Login Admin</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h3 className="font-semibold text-slate-200 tracking-wider uppercase">Kontak</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Desa Gandrungmangu</li>
              <li>Kec. Gandrungmangu</li>
              <li>Kab. Cilacap, Jawa Tengah</li>
              <li>Kode Pos 53254</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} SOLID. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

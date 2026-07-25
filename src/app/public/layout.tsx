import { PublicHeader } from '@/components/public-dashboard/public-header';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-50 text-slate-900 relative overflow-hidden font-sans">
      {/* Ambient Gradient Mesh Background (Matching Landing Page Aesthetic) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-200/35 rounded-full blur-3xl opacity-70 animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-200/35 rounded-full blur-3xl opacity-70" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative z-10">
        <PublicHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
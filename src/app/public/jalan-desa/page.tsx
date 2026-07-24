import { villages } from '@/lib/villages';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

export default function PilihDesaJalan() {
  return (
    <div className="container mx-auto max-w-5xl py-12">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-headline">
        Database Jalan Desa
      </h1>
      <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
        Pilih desa untuk melihat rincian data kondisi jalan.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {villages.map((village) => (
          <Link key={village} href={`/public/jalan-desa/${village.toLowerCase()}`}>
            <Card className="hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <span className="font-semibold">{village}</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

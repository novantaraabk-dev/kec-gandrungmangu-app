'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface DataCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  status: 'active' | 'soon';
  color: 'blue' | 'green' | 'purple' | 'sky' | 'rose' | 'orange' | 'teal';
}

export function DataCard({ title, description, icon, href, status, color }: DataCardProps) {
  const isComingSoon = status === 'soon';

  const colorClasses = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    purple: 'border-purple-500',
    sky: 'border-sky-500',
    rose: 'border-rose-500',
    orange: 'border-orange-500',
    teal: 'border-teal-500',
  };

  const iconColorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
    sky: 'bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400',
    teal: 'bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-400',
  };

  const cardContent = (
    <Card className={cn(
      "flex flex-col h-full rounded-2xl p-6 shadow-sm transition-all duration-300 ease-in-out border-t-4",
      "hover:shadow-lg hover:-translate-y-1",
      colorClasses[color],
      isComingSoon ? "bg-slate-100 dark:bg-slate-800/50 cursor-not-allowed" : "bg-card"
    )}>
      <div className={cn("mb-5 flex h-14 w-14 items-center justify-center rounded-xl", iconColorClasses[color])}>
        {icon}
      </div>
      <div className="flex-grow">
        <h3 className={cn("text-lg font-bold font-headline text-slate-800 dark:text-slate-100", isComingSoon && "text-slate-500 dark:text-slate-400")}>
            {title}
        </h3>
        <p className={cn("mt-1 text-sm text-slate-600 dark:text-slate-400", isComingSoon && "text-slate-400 dark:text-slate-500")}>
            {description}
        </p>
      </div>
      <div className="mt-6 flex items-end justify-between">
        {isComingSoon ? (
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">Segera Hadir</Badge>
        ) : (
          <span className="text-sm font-semibold text-primary group-hover:underline flex items-center">
            Lihat Data <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        )}
      </div>
    </Card>
  );

  if (isComingSoon) {
    return <div className="h-full">{cardContent}</div>;
  }

  return (
    <Link href={href} className="flex flex-col h-full group">
      {cardContent}
    </Link>
  );
}
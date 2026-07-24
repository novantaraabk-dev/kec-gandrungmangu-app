import Image from 'next/image';
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppLogoProps {
  logoUrl?: string | null;
  theme?: 'light' | 'dark';
  className?: string;
}

export function AppLogo({ logoUrl, theme = 'light', className }: AppLogoProps) {
  const isDark = theme === 'dark';
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {logoUrl ? (
        <Image src={logoUrl} alt="App Logo" width={32} height={32} className="object-contain" />
      ) : (
         <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg shrink-0",
            isDark 
              ? "bg-primary-foreground/10 text-primary-foreground" 
              : "bg-primary/10 text-primary"
          )}>
            <FileText className="h-5 w-5" />
          </div>
      )}
      <div>
        <span className={cn(
          "text-xl font-bold tracking-tight font-headline leading-tight",
          isDark ? "text-primary-foreground" : "text-slate-900"
        )}>
          SOLID
        </span>
        <p className={cn(
          "text-[10px] leading-none",
          isDark ? "text-slate-400" : "text-slate-500"
        )}>
          Sistem Olah Laporan Informasi & Data Desa
        </p>
      </div>
    </div>
  );
}

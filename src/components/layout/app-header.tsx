import type { User } from '@/lib/auth';
import { UserMenu } from '@/components/layout/user-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home } from 'lucide-react';

interface AppHeaderProps {
  user: User;
}

export function AppHeader({ user }: AppHeaderProps) {
  return (
    <div className="flex w-full items-center">
       <div className="flex-1">
        <p className="text-sm font-semibold text-teal-700 hidden md:flex items-center gap-1.5">
          <span>Selamat datang kembali, {user.name.split(' ')[0]}</span>
          <span aria-hidden="true">👋</span>
        </p>
       </div>
      <div className="ml-auto flex items-center gap-3">
        <Button asChild variant="outline" size="sm" className="rounded-full bg-white/75 border-white/80 hover:bg-white text-slate-700 shadow-sm backdrop-blur-sm">
          <Link href="/">
            <Home className="h-4 w-4 md:mr-2 text-teal-700" />
            <span className="hidden md:inline">Halaman Utama</span>
          </Link>
        </Button>
        <UserMenu user={user} />
      </div>
    </div>
  );
}

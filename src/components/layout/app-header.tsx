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
        <h1 className="text-xl font-semibold hidden md:block">Selamat Datang, {user.name.split(' ')[0]}!</h1>
       </div>
      <div className="ml-auto flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <Home className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Halaman Utama</span>
          </Link>
        </Button>
        <UserMenu user={user} />
      </div>
    </div>
  );
}

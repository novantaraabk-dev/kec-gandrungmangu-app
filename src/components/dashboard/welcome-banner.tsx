import type { User } from '@/lib/auth';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface WelcomeBannerProps {
    user: User;
}

export function WelcomeBanner({ user }: WelcomeBannerProps) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl font-bold font-headline text-foreground">
          Selamat Datang Kembali, {user.name.split(' ')[0]}!
        </CardTitle>
        <CardDescription className="text-muted-foreground mt-1">
          Berikut adalah ringkasan aktivitas dan data terbaru dari seluruh desa.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

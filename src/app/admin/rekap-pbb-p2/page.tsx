
import { getUser } from '@/lib/auth';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import RekapPbbP2ClientPage from './client-page';

export default async function RekapPbbP2Page() {
  const user = await getUser();

  if (user.role !== 'admin') {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center shadow-lg">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <CardTitle className="text-2xl font-bold">Akses Ditolak</CardTitle>
        <CardDescription className="mt-2">Hanya admin yang dapat mengakses halaman ini.</CardDescription>
        <Button asChild className="mt-6">
          <a href="/admin/dashboard">Kembali ke Dashboard</a>
        </Button>
      </Card>
    );
  }

  return <RekapPbbP2ClientPage />;
}

  
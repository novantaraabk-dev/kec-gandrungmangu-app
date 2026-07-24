'use client';
import { useUser } from '@/firebase';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const village = params.village;

  useEffect(() => {
    if (!isUserLoading && !user) {
      // Redirect to the village-specific login page
      router.push(`/desa/${village}/login`);
    }
  }, [user, isUserLoading, router, village]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}

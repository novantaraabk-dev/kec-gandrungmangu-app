import ProfilPerangkatClientPage from './client-page';
import { villages } from '@/lib/villages';
import { notFound } from 'next/navigation';
import AuthGuard from '../AuthGuard';

export default function VillageProfilPerangkatPage({ params }: { params: { village: string } }) {
  if (!villages.map(v => v.toLowerCase()).includes(params.village)) {
    notFound();
  }
  return (
    <AuthGuard>
      <ProfilPerangkatClientPage village={params.village} />
    </AuthGuard>
  );
}

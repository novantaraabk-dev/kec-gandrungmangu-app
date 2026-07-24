import JalanDesaClientPage from './client-page';
import AuthGuard from '../AuthGuard';

export default function VillageJalanDesaPage({ params }: { params: { village: string } }) {
  return (
    <AuthGuard>
      <JalanDesaClientPage village={params.village} />
    </AuthGuard>
  );
}

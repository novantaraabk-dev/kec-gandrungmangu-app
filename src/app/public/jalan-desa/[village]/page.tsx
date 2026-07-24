import { villages } from '@/lib/villages';
import { notFound } from 'next/navigation';
import JalanDesaPublicClientPage from './client-page';

export default function JalanDesaPublicPage({ params }: { params: { village: string } }) {
  const village = params.village;
  if (!villages.map(v => v.toLowerCase()).includes(village)) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <JalanDesaPublicClientPage village={village} />
    </div>
  );
}

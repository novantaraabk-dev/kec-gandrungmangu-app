import ProfilPerangkatClientPage from './client-page';

export default function ProfilPerangkatPublicPage({ params }: { params: { village: string } }) {
  return <ProfilPerangkatClientPage village={params.village} />;
}

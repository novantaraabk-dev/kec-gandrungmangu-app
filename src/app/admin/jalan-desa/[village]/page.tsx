import JalanDesaClientPage from './client-page';

export default function JalanDesaPage({ params }: { params: { village: string } }) {
  return <JalanDesaClientPage village={params.village} />;
}

import ApbdesClientPage from './client-page';

export default function ApbdesVillagePage({ params }: { params: { village: string } }) {
    return <ApbdesClientPage village={params.village} />;
}

import P3keVillageClientPage from './client-page';

export default function P3keVillagePage({ params }: { params: { village: string } }) {
    return <P3keVillageClientPage village={params.village} />;
}

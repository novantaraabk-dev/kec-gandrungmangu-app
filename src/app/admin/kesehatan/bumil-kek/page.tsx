import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HeartPulse } from 'lucide-react';
import BumilKekClientPage from './client-page';

export default function BumilKekPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Data Ibu Hamil KEK</h1>
                <p className="text-muted-foreground">Kelola data Ibu Hamil Kurang Energi Kronis.</p>
            </div>
            <BumilKekClientPage />
        </div>
    );
}

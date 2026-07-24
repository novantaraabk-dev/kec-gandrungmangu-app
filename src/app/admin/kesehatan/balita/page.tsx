import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HeartPulse } from 'lucide-react';
import BalitaClientPage from './client-page';

export default function BalitaPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Data Jumlah Balita</h1>
                <p className="text-muted-foreground">Kelola data jumlah balita per desa.</p>
            </div>
            <BalitaClientPage />
        </div>
    );
}

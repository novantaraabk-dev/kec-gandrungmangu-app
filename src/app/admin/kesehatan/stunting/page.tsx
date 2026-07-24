import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HeartPulse } from 'lucide-react';
import StuntingClientPage from './client-page';

export default function StuntingPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Data Stunting</h1>
                <p className="text-muted-foreground">Kelola data stunting anak di seluruh desa.</p>
            </div>
            <StuntingClientPage />
        </div>
    );
}

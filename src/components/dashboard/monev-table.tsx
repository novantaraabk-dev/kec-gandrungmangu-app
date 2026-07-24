import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const monevData = [
  { kegiatan: 'Pembangunan Jalan Usaha Tani', anggaran: 150000000, realisasi: 145000000, status: 'Selesai' },
  { kegiatan: 'Pemberian Makanan Tambahan (PMT)', anggaran: 50000000, realisasi: 25000000, status: 'Realisasi' },
  { kegiatan: 'Pelatihan Aparatur Desa', anggaran: 35000000, realisasi: 35000000, status: 'Selesai' },
  { kegiatan: 'Pembangunan Drainase Lingkungan', anggaran: 200000000, realisasi: 0, status: 'Perencanaan' },
  { kegiatan: 'Bantuan Langsung Tunai (BLT-DD)', anggaran: 300000000, realisasi: 75000000, status: 'Realisasi' },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

export function MonevTable() {
  const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'Selesai':
        return 'default';
      case 'Realisasi':
        return 'secondary';
      case 'Perencanaan':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  const getProgressColor = (status: string) => {
    switch(status) {
      case 'Selesai': return 'bg-green-500';
      case 'Realisasi': return 'bg-blue-500';
      default: return 'bg-primary';
    }
  }


  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Monitoring APBDes</CardTitle>
        <CardDescription>Status realisasi kegiatan terbaru.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {monevData.map((item, index) => {
            const percentage = item.anggaran > 0 ? (item.realisasi / item.anggaran) * 100 : 0;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground">{item.kegiatan}</p>
                  <Badge variant={getStatusVariant(item.status)} className={item.status === 'Selesai' ? 'bg-green-600 text-white' : ''}>
                      {item.status}
                  </Badge>
                </div>
                <Progress value={percentage} className="h-3" indicatorClassName={getProgressColor(item.status)} />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Realisasi: {formatCurrency(item.realisasi)}</span>
                  <span>Anggaran: {formatCurrency(item.anggaran)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

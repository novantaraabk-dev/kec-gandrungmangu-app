import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function StatsCards() {
  const stats = {
    pendapatan: 1250000000,
    belanja: 1175000000,
    pembiayaan: 75000000,
  };

  const statItems = [
    {
      title: 'Total Pendapatan',
      value: formatCurrency(stats.pendapatan),
      description: 'Tahun Anggaran 2024',
      icon: <DollarSign className="h-8 w-8 text-primary" />,
    },
    {
      title: 'Total Belanja',
      value: formatCurrency(stats.belanja),
      description: 'Realisasi sementara',
      icon: <ShoppingCart className="h-8 w-8 text-primary" />,
    },
    {
      title: 'Sisa Pembiayaan',
      value: formatCurrency(stats.pembiayaan),
      description: 'SilPA tahun sebelumnya',
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {statItems.map((item) => (
        <Card key={item.title} className="rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base font-medium text-muted-foreground">{item.title}</CardTitle>
              {item.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{item.value}</div>
            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

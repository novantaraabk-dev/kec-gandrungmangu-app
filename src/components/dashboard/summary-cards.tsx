import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Landmark, Newspaper } from 'lucide-react';

export function SummaryCards() {
  const summaryItems = [
    {
      title: 'Total Dokumen',
      value: '2.1k',
      description: '+15% dari bulan lalu',
      icon: <FileText className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: 'Total Anggaran',
      value: 'Rp 125 M',
      description: 'Tahun Anggaran 2024',
      icon: <Landmark className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: 'Jumlah Pengguna',
      value: '35',
      description: '2 Admin, 33 Operator',
      icon: <Users className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: 'Produk Hukum',
      value: '58',
      description: '+3 SK baru minggu ini',
      icon: <Newspaper className="h-6 w-6 text-muted-foreground" />,
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {summaryItems.map((item) => (
        <Card key={item.title} className="rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
            {item.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{item.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

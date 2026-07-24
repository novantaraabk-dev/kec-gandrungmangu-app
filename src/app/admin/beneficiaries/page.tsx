import { Search, Download, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

const beneficiaries = [
  { id: '1', name: 'Siti Aminah', nik: '330101...0001', address: 'Dusun Krajan RT 01/RW 01', period: 'Jan-Mar 2024', status: 'Aktif' },
  { id: '2', name: 'Budi Santoso', nik: '330101...0002', address: 'Dusun Kidul RT 02/RW 03', period: 'Jan-Mar 2024', status: 'Aktif' },
  { id: '3', name: 'Joko Susilo', nik: '330101...0003', address: 'Dusun Lor RT 03/RW 02', period: 'Jan-Mar 2024', status: 'Tidak Aktif' },
  { id: '4', name: 'Sri Lestari', nik: '330101...0004', address: 'Dusun Wetan RT 04/RW 01', period: 'Okt-Des 2023', status: 'Tidak Aktif' },
];

export default function BeneficiariesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">KPM BLT-DD</h1>
          <p className="text-muted-foreground">Kelola data Keluarga Penerima Manfaat BLT-Dana Desa.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar KPM</CardTitle>
          <CardDescription>Cari dan kelola semua KPM yang terdaftar.</CardDescription>
          <div className="flex items-center gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari nama atau NIK..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>NIK</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {beneficiaries.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.nik}</TableCell>
                    <TableCell>{item.address}</TableCell>
                    <TableCell>{item.period}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'Aktif' ? 'default' : 'destructive'} className={item.status === 'Aktif' ? 'bg-green-600' : ''}>{item.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

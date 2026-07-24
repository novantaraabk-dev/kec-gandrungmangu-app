'use client';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { dataKependudukan, totalKependudukan } from '@/lib/kependudukan-data';
import { Users } from 'lucide-react';


export default function PublicKependudukanPage() {
  return (
      <div className="container max-w-7xl py-8 sm:py-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-3xl font-bold font-headline">
              <Users className="h-8 w-8" />
              <span>Data Kependudukan Kecamatan Gandrungmangu</span>
            </CardTitle>
            <CardDescription>
              Data jumlah penduduk dan jumlah kepala keluarga (KK) berdasarkan jenis kelamin per desa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead rowSpan={2} className="align-bottom">No</TableHead>
                    <TableHead rowSpan={2} className="align-bottom">Desa</TableHead>
                    <TableHead colSpan={3} className="text-center border-l">Jumlah Penduduk</TableHead>
                    <TableHead colSpan={3} className="text-center border-l">Jumlah KK</TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead className="text-right border-l">Laki-laki</TableHead>
                    <TableHead className="text-right">Perempuan</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right border-l">Laki-laki</TableHead>
                    <TableHead className="text-right">Perempuan</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataKependudukan.map((data) => (
                    <TableRow key={data.no}>
                      <TableCell>{data.no}</TableCell>
                      <TableCell className="font-medium">{data.desa}</TableCell>
                      <TableCell className="text-right border-l">{data.penduduk.l.toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-right">{data.penduduk.p.toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-right font-semibold">{data.penduduk.total.toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-right border-l">{data.kk.l.toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-right">{data.kk.p.toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-right font-semibold">{data.kk.total.toLocaleString('id-ID')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={2} className="font-bold text-lg">JUMLAH</TableCell>
                    <TableCell className="text-right font-bold border-l">{totalKependudukan.penduduk.l.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right font-bold">{totalKependudukan.penduduk.p.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right font-extrabold text-base">{totalKependudukan.penduduk.total.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right font-bold border-l">{totalKependudukan.kk.l.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right font-bold">{totalKependudukan.kk.p.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right font-extrabold text-base">{totalKependudukan.kk.total.toLocaleString('id-ID')}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}

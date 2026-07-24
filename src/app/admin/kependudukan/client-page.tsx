'use client';

import { useState, useMemo, ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, writeBatch, serverTimestamp, query, where, updateDoc, deleteDoc } from 'firebase/firestore';
import type { Kependudukan } from '@/lib/perangkat-data';
import { dataKependudukan as staticKependudukanData } from '@/lib/kependudukan-data';
import { villages } from '@/lib/villages';
import { Users, PlusCircle, Download, Upload, Loader2, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { KependudukanForm } from '@/components/kependudukan/kependudukan-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export default function KependudukanClientPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [dialogMode, setDialogMode] = useState<'edit' | null>(null);
  const [selectedData, setSelectedData] = useState<Kependudukan | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const kependudukanQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'kependudukan'), where('year', '==', parseInt(filterYear)));
  }, [firestore, filterYear]);
  const { data, isLoading } = useCollection<Kependudukan>(kependudukanQuery);

  const sortedData = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => villages.indexOf(a.village) - villages.indexOf(b.village));
  }, [data]);

  const totals = useMemo(() => {
    if (!sortedData) return { penduduk_l: 0, penduduk_p: 0, penduduk_total: 0, kk_l: 0, kk_p: 0, kk_total: 0 };
    return sortedData.reduce((acc, item) => {
        acc.penduduk_l += item.penduduk_l;
        acc.penduduk_p += item.penduduk_p;
        acc.penduduk_total += item.penduduk_l + item.penduduk_p;
        acc.kk_l += item.kk_l;
        acc.kk_p += item.kk_p;
        acc.kk_total += item.kk_l + item.kk_p;
        return acc;
    }, { penduduk_l: 0, penduduk_p: 0, penduduk_total: 0, kk_l: 0, kk_p: 0, kk_total: 0 });
  }, [sortedData]);
  
  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  }, []);

  const handleSeedData = async () => {
    if (!firestore || !user) return;
    setIsProcessing(true);
    try {
        const year = parseInt(filterYear);
        const batch = writeBatch(firestore);
        staticKependudukanData.forEach(item => {
            const docId = `${item.desa.toLowerCase()}-${year}`;
            const docRef = doc(firestore, 'kependudukan', docId);
            const payload = {
                id: docId,
                village: item.desa.toLowerCase(),
                year,
                penduduk_l: item.penduduk.l,
                penduduk_p: item.penduduk.p,
                kk_l: item.kk.l,
                kk_p: item.kk.p,
                createdAt: serverTimestamp(),
                createdBy: user.uid,
            };
            batch.set(docRef, payload);
        });
        await batch.commit();
        toast({ title: 'Sukses!', description: 'Data kependudukan awal berhasil dimasukkan.' });
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Gagal', description: e.message });
    } finally {
        setIsProcessing(false);
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0] || !firestore || !user) return;
    const file = event.target.files[0];
    setIsProcessing(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json: any[] = XLSX.utils.sheet_to_json(sheet);
      
      const batch = writeBatch(firestore);
      const year = parseInt(filterYear);
      json.forEach(row => {
          const villageName = row['Desa']?.toLowerCase();
          if (!villageName) return;
          const docId = `${villageName}-${year}`;
          const docRef = doc(firestore, 'kependudukan', docId);
          batch.set(docRef, {
              id: docId,
              village: villageName,
              year,
              penduduk_l: Number(row['Penduduk Laki-laki']) || 0,
              penduduk_p: Number(row['Penduduk Perempuan']) || 0,
              kk_l: Number(row['KK Laki-laki']) || 0,
              kk_p: Number(row['KK Perempuan']) || 0,
              createdAt: serverTimestamp(),
              createdBy: user.uid
          }, { merge: true });
      });
      await batch.commit();
      toast({ title: 'Sukses!', description: 'Data kependudukan berhasil diimpor.' });
    } catch(e: any) {
      toast({ variant: 'destructive', title: 'Gagal Impor', description: e.message });
    } finally {
      setIsProcessing(false);
      event.target.value = '';
    }
  };

  const handleExportExcel = () => {
    if (!sortedData) return;
    const dataToExport = sortedData.map(item => ({
      'Desa': item.village.charAt(0).toUpperCase() + item.village.slice(1),
      'Penduduk Laki-laki': item.penduduk_l,
      'Penduduk Perempuan': item.penduduk_p,
      'Total Penduduk': item.penduduk_l + item.penduduk_p,
      'KK Laki-laki': item.kk_l,
      'KK Perempuan': item.kk_p,
      'Total KK': item.kk_l + item.kk_p
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Kependudukan');
    XLSX.writeFile(workbook, `Data_Kependudukan_${filterYear}.xlsx`);
  };

  const handleFormSubmit = async (values: any) => {
    if (!firestore || !user || !selectedData) return;
    setIsSubmitting(true);
    try {
        const docRef = doc(firestore, 'kependudukan', selectedData.id);
        await updateDoc(docRef, { ...values, updatedAt: serverTimestamp(), updatedBy: user.uid });
        toast({ title: "Sukses!", description: `Data kependudukan telah diperbarui.` });
        setDialogMode(null);
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Gagal Menyimpan', description: e.message });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = (item: Kependudukan) => {
    setSelectedData(item);
    setIsDeleteAlertOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!firestore || !selectedData) return;
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(firestore, 'kependudukan', selectedData.id));
      toast({ title: 'Sukses!', description: 'Data kependudukan telah dihapus.' });
      setIsDeleteAlertOpen(false);
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Gagal Menghapus', description: e.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Data Kependudukan</h1>
          <p className="text-muted-foreground">Rincian data kependudukan per desa di Kecamatan Gandrungmangu.</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="flex items-center gap-2"><Users className="h-6 w-6" />Tabel Data Kependudukan</CardTitle>
                    <CardDescription>Data jumlah penduduk dan jumlah kepala keluarga (KK).</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline"><label htmlFor="excel-upload" className="cursor-pointer flex items-center">{isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Upload className="mr-2 h-4 w-4"/>}Impor</label></Button>
                    <Input id="excel-upload" type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileChange} disabled={isProcessing}/>
                    <Button variant="outline" onClick={handleExportExcel} disabled={!data || data.length === 0}><Download className="mr-2 h-4 w-4" /> Ekspor</Button>
                </div>
            </div>
            <div className="pt-4">
                <Select value={filterYear} onValueChange={setFilterYear}>
                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="Pilih Tahun..." /></SelectTrigger>
                    <SelectContent>{availableYears.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead rowSpan={2} className="align-bottom">Aksi</TableHead>
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
                  {isLoading ? (
                    <TableRow><TableCell colSpan={9} className="text-center h-24"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>
                  ) : sortedData && sortedData.length > 0 ? (
                    sortedData.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setSelectedData(item); setDialogMode('edit'); }}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(item)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Hapus</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{item.village.charAt(0).toUpperCase() + item.village.slice(1)}</TableCell>
                        <TableCell className="text-right border-l">{item.penduduk_l.toLocaleString('id-ID')}</TableCell>
                        <TableCell className="text-right">{item.penduduk_p.toLocaleString('id-ID')}</TableCell>
                        <TableCell className="text-right font-semibold">{(item.penduduk_l + item.penduduk_p).toLocaleString('id-ID')}</TableCell>
                        <TableCell className="text-right border-l">{item.kk_l.toLocaleString('id-ID')}</TableCell>
                        <TableCell className="text-right">{item.kk_p.toLocaleString('id-ID')}</TableCell>
                        <TableCell className="text-right font-semibold">{(item.kk_l + item.kk_p).toLocaleString('id-ID')}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={9} className="text-center h-48">
                        <h3 className="font-semibold">Data Kosong</h3><p className="text-muted-foreground text-sm">Tidak ada data untuk tahun {filterYear}.</p>
                        <Button onClick={handleSeedData} disabled={isProcessing} className="mt-4">{isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />} {isProcessing ? 'Memproses...' : 'Gunakan Data Awal'}</Button>
                    </TableCell></TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow className="bg-muted/50">
                    <TableCell colSpan={3} className="font-bold text-lg">JUMLAH</TableCell>
                    <TableCell className="text-right font-bold border-l">{totals.penduduk_l.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right font-bold">{totals.penduduk_p.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right font-extrabold text-base">{totals.penduduk_total.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right font-bold border-l">{totals.kk_l.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right font-bold">{totals.kk_p.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right font-extrabold text-base">{totals.kk_total.toLocaleString('id-ID')}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogMode !== null} onOpenChange={() => setDialogMode(null)}>
        <DialogContent className="sm:max-w-xl"><DialogHeader><DialogTitle>Edit Data Kependudukan</DialogTitle></DialogHeader><KependudukanForm data={selectedData} onSubmit={handleFormSubmit} onCancel={() => setDialogMode(null)} isLoading={isSubmitting}/></DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Anda Yakin?</AlertDialogTitle><AlertDialogDescription>Tindakan ini akan menghapus data kependudukan untuk <span className="font-bold">{selectedData?.village}</span> secara permanen.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} className={cn(buttonVariants({ variant: 'destructive' }))} disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Hapus</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}

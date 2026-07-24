'use client';

import { useState, useMemo, ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import type { JalanKabupaten } from '@/lib/perangkat-data';
import { Loader2, PlusCircle, Pencil, Trash2, Upload, Map, Milestone, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { JalanKabupatenForm } from '@/components/jalan-kabupaten/jalan-kabupaten-form';

function capitalizeFirstLetter(string: string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const formatNumber = (value?: number) => {
    if (value === undefined || value === null || isNaN(value)) return '0';
    return new Intl.NumberFormat('id-ID').format(value);
};

export default function JalanKabupatenClientPage({ village }: { village: string }) {
  const isKecamatanView = village === 'kecamatan';
  const pageTitle = isKecamatanView ? 'Rekapitulasi Kecamatan' : `Desa ${capitalizeFirstLetter(village)}`;

  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | null>(null);
  const [selectedItem, setSelectedItem] = useState<JalanKabupaten | null>(null);
  const [itemToDelete, setItemToDelete] = useState<JalanKabupaten | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const jalanKabupatenQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    if (isKecamatanView) return collection(firestore, 'jalanKabupaten');
    return query(collection(firestore, 'jalanKabupaten'), where('village', '==', village));
  }, [firestore, village, isKecamatanView]);

  const { data: jalanList, isLoading } = useCollection<JalanKabupaten>(jalanKabupatenQuery);
  
  const summary = useMemo(() => {
    if (!jalanList) return { totalRuas: 0, totalPanjang: 0, totalUsulan: 0 };
    const totalPanjang = jalanList.reduce((acc, jalan) => acc + (Number(jalan.panjangRuas) || 0), 0);
    const totalUsulan = jalanList.filter(j => j.usulanDesa || j.usulanMusren).length;
    return { totalRuas: jalanList.length, totalPanjang, totalUsulan };
  }, [jalanList]);

  const handleFormSubmit = async (values: any) => {
    if (!firestore || !user) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        panjangRuas: Number(values.panjangRuas) || 0,
        lebarRuas: Number(values.lebarRuas) || 0,
        kondisiBaik: Number(values.kondisiBaik) || 0,
        kondisiSedang: Number(values.kondisiSedang) || 0,
        kondisiRusakRingan: Number(values.kondisiRusakRingan) || 0,
        kondisiRusakBerat: Number(values.kondisiRusakBerat) || 0,
        paguUsulan: Number(values.paguUsulan) || 0,
        panjangUsulan: Number(values.panjangUsulan) || 0,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      };

      if (dialogMode === 'edit' && selectedItem) {
        await updateDoc(doc(firestore, "jalanKabupaten", selectedItem.id), payload);
        toast({ title: 'Sukses', description: `Data untuk ruas ${values.namaRuas} telah diperbarui.` });
      } else {
        await addDoc(collection(firestore, "jalanKabupaten"), { ...payload, createdAt: serverTimestamp(), createdBy: user.uid });
        toast({ title: 'Sukses', description: `Data untuk ruas ${values.namaRuas} telah ditambahkan.` });
      }
      setDialogMode(null);
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Gagal Menyimpan', description: e.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;
    if (!firestore || !user) return toast({ variant: 'destructive', title: 'Error', description: 'Pengguna tidak terautentikasi.' });

    setIsProcessing(true);
    const file = event.target.files[0];
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json: any[] = XLSX.utils.sheet_to_json(sheet);

      const batch = writeBatch(firestore);
      const collectionRef = collection(firestore, 'jalanKabupaten');

      json.forEach(row => {
        const docRef = doc(collectionRef);
        batch.set(docRef, {
          village: isKecamatanView ? 'kecamatan' : village, // Or parse from Excel if available
          noRuas: String(row['NO RUAS'] || ''),
          namaRuas: row['NAMA RUAS'] || '',
          pangkalRuas: row['PANGKAL RUAS'] || '',
          ujungRuas: row['UJUNG RUAS'] || '',
          panjangRuas: Number(row['PANJANG RUAS (Meter)']) || 0,
          lebarRuas: Number(row['LEBAR RUAS (Meter)']) || 0,
          kondisiBaik: Number(row['KONDISI BAIK (Meter)']) || 0,
          kondisiSedang: Number(row['KONDISI RUSAK SEDANG (Meter)']) || 0,
          kondisiRusakRingan: Number(row['KONDISI RUSAK RINGAN (Meter)']) || 0,
          kondisiRusakBerat: Number(row['KONDISI RUSAK BERAT (Meter)']) || 0,
          usulanMusren: row['USULAN MUSREN 2026'] || '',
          usulanDesa: row['USULAN DESA'] || '',
          paguUsulan: Number(row['PAGU USULAN']) || 0,
          panjangUsulan: Number(row['PANJANG USULAN']) || 0,
          createdAt: serverTimestamp(),
          createdBy: user.uid,
        });
      });
      await batch.commit();
      toast({ title: "Sukses!", description: `${json.length} baris data berhasil diimpor.` });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Gagal Mengimpor", description: e.message });
    } finally {
      setIsProcessing(false);
      event.target.value = '';
    }
  };

  const handleDelete = (item: JalanKabupaten) => {
    setItemToDelete(item);
    setDialogMode(null);
  };
  
  const confirmDelete = async () => {
    if (!itemToDelete || !firestore) return;
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(firestore, 'jalanKabupaten', itemToDelete.id));
      toast({ title: 'Sukses', description: `Data ruas jalan ${itemToDelete.namaRuas} telah dihapus.` });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Gagal Menghapus', description: e.message });
    } finally {
      setIsSubmitting(false);
      setItemToDelete(null);
    }
  };
  
  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Database Jalan Kabupaten</h1>
          <p className="text-muted-foreground">{pageTitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Ruas Jalan</CardTitle><Milestone className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{formatNumber(summary.totalRuas)}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Panjang Ruas</CardTitle><Map className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{formatNumber(summary.totalPanjang)} M</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Ruas dengan Usulan</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{formatNumber(summary.totalUsulan)}</div></CardContent></Card>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Data Ruas Jalan Kabupaten</CardTitle>
              <div className="flex gap-2">
                <Button onClick={() => setDialogMode('add')}><PlusCircle className="mr-2 h-4 w-4" /> Input Manual</Button>
                <Button asChild variant="outline"><label htmlFor="excel-upload" className="cursor-pointer flex items-center">{isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Upload className="mr-2 h-4 w-4"/>}{isProcessing ? 'Memproses...' : 'Impor Excel'}</label></Button>
                <Input id="excel-upload" type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileChange} disabled={isProcessing}/>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Ruas</TableHead>
                    <TableHead>Nama Ruas</TableHead>
                    <TableHead>Panjang (M)</TableHead>
                    <TableHead>Lebar (M)</TableHead>
                    <TableHead>Kondisi Baik (M)</TableHead>
                    <TableHead>Kondisi Sedang (M)</TableHead>
                    <TableHead>Kondisi Rusak Ringan (M)</TableHead>
                    <TableHead>Kondisi Rusak Berat (M)</TableHead>
                    <TableHead>Usulan</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow><TableCell colSpan={10} className="text-center h-24"><Loader2 className="mx-auto h-8 w-8 animate-spin"/></TableCell></TableRow> :
                  !jalanList || jalanList.length === 0 ? <TableRow><TableCell colSpan={10} className="text-center h-24">Belum ada data.</TableCell></TableRow> :
                  jalanList.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono">{item.noRuas}</TableCell>
                      <TableCell className="font-medium">{item.namaRuas}</TableCell>
                      <TableCell>{formatNumber(item.panjangRuas)}</TableCell>
                      <TableCell>{formatNumber(item.lebarRuas)}</TableCell>
                      <TableCell className="text-green-600">{formatNumber(item.kondisiBaik)}</TableCell>
                      <TableCell className="text-blue-600">{formatNumber(item.kondisiSedang)}</TableCell>
                      <TableCell className="text-yellow-600">{formatNumber(item.kondisiRusakRingan)}</TableCell>
                      <TableCell className="text-red-600 font-medium">{formatNumber(item.kondisiRusakBerat)}</TableCell>
                      <TableCell>{item.usulanDesa || item.usulanMusren || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => { setSelectedItem(item); setDialogMode('edit'); }}><Pencil className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogMode !== null} onOpenChange={isOpen => !isOpen && setDialogMode(null)}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'edit' ? 'Edit Data Jalan Kabupaten' : 'Tambah Data Jalan Kabupaten'}</DialogTitle>
            <DialogDescription>
              {dialogMode === 'edit' ? `Memperbarui data untuk ruas ${selectedItem?.namaRuas}` : 'Isi formulir untuk menambahkan data baru.'}
            </DialogDescription>
          </DialogHeader>
          <JalanKabupatenForm 
            data={selectedItem} 
            onSubmit={handleFormSubmit} 
            onCancel={() => setDialogMode(null)} 
            onDelete={selectedItem ? () => handleDelete(selectedItem) : undefined}
            isLoading={isSubmitting}
            showVillageInput={isKecamatanView}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!itemToDelete} onOpenChange={isOpen => !isOpen && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>Anda yakin ingin menghapus data ruas <span className="font-bold">{itemToDelete?.namaRuas}</span>? Tindakan ini tidak dapat diurungkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isSubmitting} className={cn(buttonVariants({ variant: 'destructive' }))}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Trash2 className="mr-2 h-4 w-4"/>} Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

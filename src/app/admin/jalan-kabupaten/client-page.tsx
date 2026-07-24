'use client';

import { useState, useMemo, ChangeEvent, useEffect } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import type { JalanKabupaten } from '@/lib/perangkat-data';
import { Loader2, PlusCircle, Pencil, Trash2, Upload, Map, Milestone, TrendingUp, Search, MoreHorizontal } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { JalanKabupatenForm } from '@/components/jalan-kabupaten/jalan-kabupaten-form';
import { villages } from '@/lib/villages';
import { buttonVariants } from '@/components/ui/button';


function capitalizeWords(str: string) {
    if (!str) return '';
    return str.split(',').map(word => 
        word.trim().charAt(0).toUpperCase() + word.trim().slice(1)
    ).join(', ');
}

const formatNumber = (value?: number) => {
    if (value === undefined || value === null || isNaN(value)) return '0';
    return new Intl.NumberFormat('id-ID').format(value);
};

export default function JalanKabupatenClientPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | null>(null);
  const [selectedItem, setSelectedItem] = useState<JalanKabupaten | null>(null);
  const [itemToDelete, setItemToDelete] = useState<JalanKabupaten | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterVillage, setFilterVillage] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteAllAlertOpen, setIsDeleteAllAlertOpen] = useState(false);

  const jalanKabupatenQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'jalanKabupaten');
  }, [firestore]);

  const { data: allJalanList, isLoading } = useCollection<JalanKabupaten>(jalanKabupatenQuery);
  
  const filteredJalanList = useMemo(() => {
    if (!allJalanList) return [];
    return allJalanList
        .filter(item => filterVillage === 'all' || item.village.toLowerCase().includes(filterVillage))
        .filter(item => 
            item.namaRuas.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.noRuas.toLowerCase().includes(searchTerm.toLowerCase())
        );
  }, [allJalanList, filterVillage, searchTerm]);

  const summary = useMemo(() => {
    const dataToSummarize = filteredJalanList;
    if (!dataToSummarize) return { totalRuas: 0, totalPanjang: 0, totalUsulan: 0 };
    const totalPanjang = dataToSummarize.reduce((acc, jalan) => acc + (Number(jalan.panjangRuas) || 0), 0);
    const totalUsulan = dataToSummarize.filter(j => j.usulanDesa || j.usulanMusren).length;
    return { totalRuas: dataToSummarize.length, totalPanjang, totalUsulan };
  }, [filteredJalanList]);

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

      const parseNumber = (value: any) => {
          if (typeof value === 'number') return value;
          if (typeof value === 'string') {
              return Number(value.replace(/[^0-9,.]/g, '').replace(',', '.')) || 0;
          }
          return 0;
      };

      json.forEach(row => {
        const docRef = doc(collectionRef);
        batch.set(docRef, {
          village: String(row['DESA'] || '').toLowerCase(),
          noRuas: String(row['NO RUAS'] || ''),
          namaRuas: row['NAMA RUAS JALAN'] || '',
          pangkalRuas: row['PANGKAL RUAS'] || '',
          ujungRuas: row['UJUNG RUAS'] || '',
          panjangRuas: parseNumber(row['Panjang (M)']),
          lebarRuas: parseNumber(row['Lebar (M)']),
          kondisiBaik: parseNumber(row['BAIK (Meter)']),
          kondisiSedang: parseNumber(row['SEDANG (Meter)']),
          kondisiRusakRingan: parseNumber(row['RUSAK RINGAN (Meter)']),
          kondisiRusakBerat: parseNumber(row['RUSAK BERAT (Meter)']),
          usulanMusren: row['USULAN RKPD 2026'] || '',
          usulanDesa: row['USULAN DESA'] || '',
          paguUsulan: parseNumber(row['PAGU USULAN RKPD 2026']),
          panjangUsulan: parseNumber(row['PANJANG USULAN']),
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

  const deleteAllData = async () => {
    if (!firestore || !allJalanList) return;
    setIsSubmitting(true);
    try {
        const batch = writeBatch(firestore);
        allJalanList.forEach(item => {
            const docRef = doc(firestore, 'jalanKabupaten', item.id);
            batch.delete(docRef);
        });
        await batch.commit();
        toast({ title: 'Sukses!', description: 'Semua data jalan kabupaten telah dihapus.' });
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Gagal Menghapus', description: 'Terjadi kesalahan saat menghapus semua data.' });
    } finally {
        setIsSubmitting(false);
        setIsDeleteAllAlertOpen(false);
    }
  };
  
  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Database Jalan Kabupaten</h1>
          <p className="text-muted-foreground">Rekapitulasi data ruas jalan kabupaten di seluruh Kecamatan Gandrungmangu.</p>
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
                <Button variant="destructive" onClick={() => setIsDeleteAllAlertOpen(true)} disabled={isSubmitting || isLoading || !allJalanList || allJalanList.length === 0}>
                  <Trash2 className="mr-2 h-4 w-4" /> Hapus Semua
                </Button>
              </div>
            </div>
             <div className="flex items-center gap-4 pt-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Cari nama atau nomor ruas..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <Select value={filterVillage} onValueChange={setFilterVillage}>
                    <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filter Desa" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Desa</SelectItem>
                        {villages.map(v => (<SelectItem key={v} value={v.toLowerCase()}>{v}</SelectItem>))}
                    </SelectContent>
                </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aksi</TableHead>
                    <TableHead>Desa</TableHead>
                    <TableHead>No Ruas</TableHead>
                    <TableHead>Nama Ruas Jalan</TableHead>
                    <TableHead>Pangkal Ruas</TableHead>
                    <TableHead>Ujung Ruas</TableHead>
                    <TableHead>Panjang (M)</TableHead>
                    <TableHead>Lebar (M)</TableHead>
                    <TableHead>BAIK (Meter)</TableHead>
                    <TableHead>SEDANG (Meter)</TableHead>
                    <TableHead>RUSAK RINGAN (Meter)</TableHead>
                    <TableHead>RUSAK BERAT (Meter)</TableHead>
                    <TableHead>Usulan RKPD 2026</TableHead>
                    <TableHead>Usulan Desa</TableHead>
                    <TableHead>Pagu Usulan RKPD 2026</TableHead>
                    <TableHead>Panjang Usulan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <TableRow><TableCell colSpan={16} className="text-center h-24"><Loader2 className="mx-auto h-8 w-8 animate-spin"/></TableCell></TableRow> :
                  !filteredJalanList || filteredJalanList.length === 0 ? <TableRow><TableCell colSpan={16} className="text-center h-24">Belum ada data.</TableCell></TableRow> :
                  filteredJalanList.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Buka menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setSelectedItem(item); setDialogMode('edit'); }}>
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(item)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Hapus</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell className="font-medium">{capitalizeWords(item.village)}</TableCell>
                      <TableCell className="font-mono">{item.noRuas}</TableCell>
                      <TableCell className="font-medium">{item.namaRuas}</TableCell>
                      <TableCell>{item.pangkalRuas}</TableCell>
                      <TableCell>{item.ujungRuas}</TableCell>
                      <TableCell>{formatNumber(item.panjangRuas)}</TableCell>
                      <TableCell>{formatNumber(item.lebarRuas)}</TableCell>
                      <TableCell className="text-green-600">{formatNumber(item.kondisiBaik)}</TableCell>
                      <TableCell className="text-blue-600">{formatNumber(item.kondisiSedang)}</TableCell>
                      <TableCell className="text-yellow-600">{formatNumber(item.kondisiRusakRingan)}</TableCell>
                      <TableCell className="text-red-600 font-medium">{formatNumber(item.kondisiRusakBerat)}</TableCell>
                      <TableCell>{item.usulanMusren || '-'}</TableCell>
                      <TableCell>{item.usulanDesa || '-'}</TableCell>
                      <TableCell>{formatNumber(item.paguUsulan)}</TableCell>
                      <TableCell>{formatNumber(item.panjangUsulan)}</TableCell>
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
            isLoading={isSubmitting}
            showVillageInput={true}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
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
      
      <AlertDialog open={isDeleteAllAlertOpen} onOpenChange={setIsDeleteAllAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus Semua Data</AlertDialogTitle>
            <AlertDialogDescription>
                Anda yakin ingin menghapus **SEMUA** data jalan kabupaten? Tindakan ini tidak dapat diurungkan dan akan menghapus {allJalanList?.length || 0} data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={deleteAllData} disabled={isSubmitting} className={cn(buttonVariants({ variant: 'destructive' }))}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Trash2 className="mr-2 h-4 w-4"/>} Ya, Hapus Semua
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

'use client';

import { useState, useMemo, type ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import type { PasarDesa } from '@/lib/perangkat-data';
import { villages } from '@/lib/villages';
import { Landmark, PlusCircle, Download, Loader2, MoreHorizontal, Pencil, Trash2, Search, Upload } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { PasarDesaForm } from '@/components/data-umum/pasar-desa-form';

function capitalizeFirstLetter(string: string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function PasarDesaClientPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const [filterVillage, setFilterVillage] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | null>(null);
  const [selectedData, setSelectedData] = useState<PasarDesa | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const pasarDesaQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'pasarDesa');
  }, [firestore]);
  const { data, isLoading } = useCollection<PasarDesa>(pasarDesaQuery);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data
      .filter(item => filterVillage === 'all' || item.village === filterVillage)
      .filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.perdesNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [data, filterVillage, searchTerm]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;
    if (!firestore || !user) {
      toast({ variant: 'destructive', title: 'Error', description: 'Pengguna tidak terautentikasi.' });
      return;
    }

    const file = event.target.files[0];
    setIsProcessing(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json: any[] = XLSX.utils.sheet_to_json(worksheet);
      
      const expectedHeaders = ['Desa', 'Nama Pasar', 'Nomor Perdes'];
      const actualHeaders = Object.keys(json[0] || {});
      const hasAllHeaders = expectedHeaders.every(h => actualHeaders.includes(h));
      if (!hasAllHeaders) {
        throw new Error(`Format Excel tidak sesuai. Pastikan kolom berikut ada: ${expectedHeaders.join(', ')}`);
      }

      const batch = writeBatch(firestore);
      const collectionRef = collection(firestore, 'pasarDesa');

      json.forEach(row => {
        const villageName = row['Desa']?.toLowerCase();
        if (!villageName || !villages.map(v => v.toLowerCase()).includes(villageName)) {
            console.warn(`Skipping row with invalid village name: ${row['Desa']}`);
            return;
        }

        const docRef = doc(collectionRef); // auto-generate ID
        const payload = {
          village: villageName,
          name: row['Nama Pasar'],
          perdesNumber: row['Nomor Perdes'] || '',
          createdAt: serverTimestamp(),
          createdBy: user.uid,
        };
        batch.set(docRef, payload);
      });

      await batch.commit();
      toast({ title: "Sukses!", description: `Data Pasar Desa berhasil diimpor.` });

    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Gagal Mengimpor', description: error.message });
    } finally {
      setIsProcessing(false);
      event.target.value = '';
    }
  };

  const handleExportExcel = () => {
    if (!filteredData || filteredData.length === 0) {
      toast({ variant: 'destructive', title: 'Tidak ada data untuk diekspor.' });
      return;
    }
    const dataToExport = filteredData.map((item, index) => ({
      'NO': index + 1,
      'Desa': capitalizeFirstLetter(item.village),
      'Nama Pasar': item.name,
      'Nomor Perdes': item.perdesNumber,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Pasar Desa');
    XLSX.writeFile(workbook, 'Data_Pasar_Desa_Kecamatan_Gandrungmangu.xlsx');
  };

  const handleFormSubmit = async (values: any) => {
    if (!firestore || !user) return;
    setIsSubmitting(true);
    
    try {
        if (dialogMode === 'edit' && selectedData) {
            const docRef = doc(firestore, 'pasarDesa', (selectedData as any).id);
            await updateDoc(docRef, { ...values, updatedAt: serverTimestamp(), updatedBy: user.uid });
            toast({ title: "Sukses!", description: `Data pasar desa telah diperbarui.` });
        } else {
            await addDoc(collection(firestore, 'pasarDesa'), { ...values, createdAt: serverTimestamp(), createdBy: user.uid });
            toast({ title: "Sukses!", description: `Data pasar desa baru telah ditambahkan.` });
        }
        setDialogMode(null);
    } catch (error) {
        toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Terjadi kesalahan." });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleDelete = (item: PasarDesa) => {
    setSelectedData(item);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!firestore || !selectedData) return;
    
    setIsSubmitting(true);
    try {
        await deleteDoc(doc(firestore, 'pasarDesa', (selectedData as any).id));
        toast({ title: "Sukses!", description: `Data pasar desa telah dihapus.` });
        setIsDeleteAlertOpen(false);
    } catch (error) {
        toast({ variant: "destructive", title: "Gagal Menghapus", description: "Terjadi kesalahan." });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Data Pasar Desa</h1>
            <p className="text-muted-foreground">Kelola data pasar desa di seluruh kecamatan.</p>
        </div>

        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2"><Landmark className="h-6 w-6"/> Daftar Pasar Desa</CardTitle>
                        <CardDescription>Data pasar desa yang terdaftar di sistem.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => setDialogMode('add')}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Manual</Button>
                        <Button asChild variant="outline">
                           <label htmlFor="excel-upload-pasar" className="cursor-pointer">
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                            {isProcessing ? 'Memproses...' : 'Impor Excel'}
                           </label>
                        </Button>
                        <Input id="excel-upload-pasar" type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileChange} disabled={isProcessing}/>
                        <Button variant="outline" onClick={handleExportExcel}><Download className="mr-2 h-4 w-4" /> Ekspor Excel</Button>
                    </div>
                </div>
                 <div className="flex items-center gap-4 pt-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Cari nama pasar atau nomor perdes..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                                <TableHead>Nama Pasar</TableHead>
                                <TableHead>Nomor Perdes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow><TableCell colSpan={4} className="text-center h-24"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>
                            ) : filteredData.length > 0 ? (
                                filteredData.map((item) => (
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
                                        <TableCell className="font-medium">{capitalizeFirstLetter(item.village)}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.perdesNumber}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={4} className="text-center h-24">Tidak ada data pasar desa.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
      </div>

      <Dialog open={dialogMode !== null} onOpenChange={() => setDialogMode(null)}>
        <DialogContent className="sm:max-w-xl"><DialogHeader><DialogTitle>{dialogMode === 'edit' ? 'Edit Data Pasar Desa' : 'Tambah Data Pasar Desa'}</DialogTitle></DialogHeader><PasarDesaForm data={selectedData} onSubmit={(v) => handleFormSubmit(v)} onCancel={() => setDialogMode(null)} isLoading={isSubmitting}/></DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Anda Yakin?</AlertDialogTitle>
                <AlertDialogDescription>Tindakan ini akan menghapus data pasar desa <span className="font-bold">{selectedData?.name}</span> secara permanen.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={() => confirmDelete()} className={cn("bg-destructive text-destructive-foreground hover:bg-destructive/90")} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Hapus
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}

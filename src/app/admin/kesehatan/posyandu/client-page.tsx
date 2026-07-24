
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
import type { PosyanduKader } from '@/lib/perangkat-data';
import { villages } from '@/lib/villages';
import { HeartPulse, PlusCircle, Download, Loader2, MoreHorizontal, Pencil, Trash2, Search, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { PosyanduForm } from '@/components/kesehatan/posyandu-form';

function capitalizeFirstLetter(string: string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function PosyanduClientPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const [filterVillage, setFilterVillage] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | null>(null);
  const [selectedData, setSelectedData] = useState<PosyanduKader | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const posyanduQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'posyanduKaders');
  }, [firestore]);
  const { data, isLoading } = useCollection<PosyanduKader>(posyanduQuery);

  const groupedData = useMemo(() => {
    if (!data) return {};
    
    const filtered = data
      .filter(item => filterVillage === 'all' || item.village === filterVillage)
      .filter(item => 
        item.posyanduName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kaderName.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return filtered.reduce((acc, item) => {
      const key = `${item.village}-${item.posyanduName}`;
      if (!acc[key]) {
        acc[key] = {
          village: item.village,
          posyanduName: item.posyanduName,
          kaders: [],
        };
      }
      acc[key].kaders.push(item);
      return acc;
    }, {} as Record<string, { village: string; posyanduName: string; kaders: PosyanduKader[] }>);
  }, [data, filterVillage, searchTerm]);
  
  const sortedGroupedData = useMemo(() => Object.values(groupedData).sort((a,b) => a.posyanduName.localeCompare(b.posyanduName)), [groupedData]);

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
      
      const expectedHeaders = ['Desa', 'Posyandu', 'Nama Kader'];
      const actualHeaders = Object.keys(json[0] || {});
      const hasAllHeaders = expectedHeaders.every(h => actualHeaders.includes(h));
      if (!hasAllHeaders) {
        throw new Error(`Format Excel tidak sesuai. Pastikan kolom berikut ada: ${expectedHeaders.join(', ')}`);
      }

      const batch = writeBatch(firestore);
      const collectionRef = collection(firestore, 'posyanduKaders');

      json.forEach(row => {
        const villageName = row['Desa']?.toLowerCase();
        if (!villageName || !villages.map(v => v.toLowerCase()).includes(villageName)) {
            console.warn(`Skipping row with invalid village name: ${row['Desa']}`);
            return;
        }

        const docRef = doc(collectionRef); // auto-generate ID
        const payload = {
          village: villageName,
          posyanduName: row['Posyandu'],
          kaderName: row['Nama Kader'],
          createdAt: serverTimestamp(),
          createdBy: user.uid,
        };
        batch.set(docRef, payload);
      });

      await batch.commit();
      toast({ title: "Sukses!", description: `Data Kader Posyandu berhasil diimpor.` });

    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Gagal Mengimpor', description: error.message });
    } finally {
      setIsProcessing(false);
      event.target.value = '';
    }
  };

  const handleExportExcel = () => {
    if (!data) return;
    const dataToExport = data.map((item) => ({
      'Desa': capitalizeFirstLetter(item.village),
      'Posyandu': item.posyanduName,
      'Nama Kader': item.kaderName,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Posyandu');
    XLSX.writeFile(workbook, 'Data_Kader_Posyandu.xlsx');
  };

  const handleFormSubmit = async (values: any) => {
    if (!firestore || !user) return;
    setIsSubmitting(true);
    
    try {
        if (dialogMode === 'edit' && selectedData) {
            const docRef = doc(firestore, 'posyanduKaders', selectedData.id);
            await updateDoc(docRef, { ...values, updatedAt: serverTimestamp(), updatedBy: user.uid });
            toast({ title: "Sukses!", description: `Data kader telah diperbarui.` });
        } else {
            await addDoc(collection(firestore, 'posyanduKaders'), { ...values, createdAt: serverTimestamp(), createdBy: user.uid });
            toast({ title: "Sukses!", description: `Data kader baru telah ditambahkan.` });
        }
        setDialogMode(null);
    } catch (error) {
        toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Terjadi kesalahan." });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleDelete = (item: PosyanduKader) => {
    setSelectedData(item);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!firestore || !selectedData) return;
    
    setIsSubmitting(true);
    try {
        await deleteDoc(doc(firestore, 'posyanduKaders', selectedData.id));
        toast({ title: "Sukses!", description: `Data kader telah dihapus.` });
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
            <h1 className="text-3xl font-bold font-headline">Data Posyandu & Kader</h1>
            <p className="text-muted-foreground">Kelola data Posyandu dan kader di seluruh kecamatan.</p>
        </div>

        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2"><HeartPulse className="h-6 w-6"/> Daftar Posyandu & Kader</CardTitle>
                        <CardDescription>Data Posyandu dan kader yang terdaftar di sistem.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => setDialogMode('add')}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Manual</Button>
                        <Button asChild variant="outline">
                           <label htmlFor="excel-upload-posyandu" className="cursor-pointer">
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                            {isProcessing ? 'Memproses...' : 'Impor Excel'}
                           </label>
                        </Button>
                        <Input id="excel-upload-posyandu" type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileChange} disabled={isProcessing}/>
                        <Button variant="outline" onClick={handleExportExcel}><Download className="mr-2 h-4 w-4" /> Ekspor Excel</Button>
                    </div>
                </div>
                 <div className="flex items-center gap-4 pt-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Cari nama posyandu atau kader..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                                <TableHead>Desa</TableHead>
                                <TableHead>Nama Posyandu</TableHead>
                                <TableHead>Nama Kader</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow><TableCell colSpan={4} className="text-center h-24"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>
                            ) : sortedGroupedData.length > 0 ? (
                                sortedGroupedData.map((group, groupIndex) => (
                                    group.kaders.map((kader, kaderIndex) => (
                                        <TableRow key={kader.id}>
                                            {kaderIndex === 0 && (
                                                <TableCell rowSpan={group.kaders.length} className="font-medium align-top border-b">
                                                    {capitalizeFirstLetter(group.village)}
                                                </TableCell>
                                            )}
                                            {kaderIndex === 0 && (
                                                <TableCell rowSpan={group.kaders.length} className="align-top border-b">
                                                    {group.posyanduName}
                                                </TableCell>
                                            )}
                                            <TableCell>{kader.kaderName}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => { setSelectedData(kader); setDialogMode('edit'); }}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDelete(kader)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Hapus</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={4} className="text-center h-24">Tidak ada data Posyandu.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
      </div>

      <Dialog open={dialogMode !== null} onOpenChange={() => setDialogMode(null)}>
        <DialogContent className="sm:max-w-xl"><DialogHeader><DialogTitle>{dialogMode === 'edit' ? 'Edit Data Kader' : 'Tambah Data Kader'}</DialogTitle></DialogHeader><PosyanduForm data={selectedData} onSubmit={(v) => handleFormSubmit(v)} onCancel={() => setDialogMode(null)} isLoading={isSubmitting}/></DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Anda Yakin?</AlertDialogTitle>
                <AlertDialogDescription>Tindakan ini akan menghapus data kader <span className="font-bold">{selectedData?.kaderName}</span> secara permanen.</AlertDialogDescription>
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

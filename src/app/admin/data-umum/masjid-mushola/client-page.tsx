'use client';

import { useState, useMemo, ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import type { Masjid, Mushola } from '@/lib/perangkat-data';
import { villages } from '@/lib/villages';
import { University, PlusCircle, Upload, Loader2, MoreHorizontal, Pencil, Trash2, Download } from 'lucide-react';
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
import { MasjidForm } from '@/components/data-umum/masjid-form';
import { MusholaForm } from '@/components/data-umum/mushola-form';

function capitalizeFirstLetter(string: string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function MasjidMusholaClientPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const [filterVillage, setFilterVillage] = useState('all');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Masjid state
  const masjidsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'masjids') : null, [firestore]);
  const { data: masjidData, isLoading: isLoadingMasjid } = useCollection<Masjid>(masjidsCollection);
  const [masjidDialogMode, setMasjidDialogMode] = useState<'add' | 'edit' | null>(null);
  const [selectedMasjid, setSelectedMasjid] = useState<Masjid | null>(null);
  const [isMasjidDeleteAlertOpen, setIsMasjidDeleteAlertOpen] = useState(false);

  // Mushola state
  const musholasCollection = useMemoFirebase(() => firestore ? collection(firestore, 'musholas') : null, [firestore]);
  const { data: musholaData, isLoading: isLoadingMushola } = useCollection<Mushola>(musholasCollection);
  const [musholaDialogMode, setMusholaDialogMode] = useState<'add' | 'edit' | null>(null);
  const [selectedMushola, setSelectedMushola] = useState<Mushola | null>(null);
  const [isMusholaDeleteAlertOpen, setIsMusholaDeleteAlertOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredMasjidData = useMemo(() => {
    if (!masjidData) return [];
    return masjidData.filter(item => filterVillage === 'all' || item.village === filterVillage);
  }, [masjidData, filterVillage]);

  const filteredMusholaData = useMemo(() => {
    if (!musholaData) return [];
    return musholaData.filter(item => filterVillage === 'all' || item.village === filterVillage);
  }, [musholaData, filterVillage]);

  const handleExportExcel = (type: 'masjid' | 'mushola') => {
    const dataToExport = type === 'masjid' ? filteredMasjidData : filteredMusholaData;
    if (!dataToExport || dataToExport.length === 0) {
      toast({ variant: 'destructive', title: 'Tidak ada data untuk diekspor.' });
      return;
    }

    const formattedData = dataToExport.map((item, index) => ({
      'NO': index + 1,
      'NAMA DESA': capitalizeFirstLetter(item.village),
      [type === 'masjid' ? 'NAMA MASJID' : 'NAMA MUSHOLA']: item.name,
      'ALAMAT': item.address,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Data ${capitalizeFirstLetter(type)}`);
    XLSX.writeFile(workbook, `Data_${capitalizeFirstLetter(type)}_Kecamatan_Gandrungmangu.xlsx`);
  };

  const handleExcelImport = async (event: ChangeEvent<HTMLInputElement>, type: 'masjid' | 'mushola') => {
    if (!event.target.files?.[0]) return;
    if (!firestore || !user) {
        toast({ variant: "destructive", title: "Error", description: "Pengguna tidak terautentikasi." });
        return;
    }
    
    const file = event.target.files[0];
    setIsProcessing(true);

    try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet);

        const collectionName = type === 'masjid' ? 'masjids' : 'musholas';
        const nameKey = type === 'masjid' ? 'NAMA MASJID' : 'NAMA MUSHOLA';
        const expectedHeaders = ['NO', 'NAMA DESA', nameKey, 'ALAMAT'];
        const actualHeaders = Object.keys(json[0] || {});
        if (!expectedHeaders.every(h => actualHeaders.includes(h))) {
            throw new Error(`Format Excel tidak sesuai. Pastikan kolom ${expectedHeaders.join(', ')} ada.`);
        }

        const batch = writeBatch(firestore);
        const collectionRef = collection(firestore, collectionName);
        json.forEach(row => {
            const villageName = row['NAMA DESA']?.toLowerCase();
            if (!villageName) return;

            const docRef = doc(collectionRef);
            const payload = {
                village: villageName,
                name: row[nameKey],
                address: row['ALAMAT'],
                createdAt: serverTimestamp(),
                createdBy: user.uid,
            };
            batch.set(docRef, payload);
        });

        await batch.commit();
        toast({ title: "Sukses!", description: `Data ${type} berhasil diimpor.` });

    } catch (error: any) {
        toast({ variant: "destructive", title: "Gagal Mengimpor", description: error.message });
    } finally {
        setIsProcessing(false);
        event.target.value = '';
    }
  };

  const handleFormSubmit = async (values: any, type: 'masjid' | 'mushola') => {
    if (!firestore || !user) return;
    setIsSubmitting(true);
    const collectionName = type === 'masjid' ? 'masjids' : 'musholas';
    const dialogMode = type === 'masjid' ? masjidDialogMode : musholaDialogMode;
    const selectedData = type === 'masjid' ? selectedMasjid : selectedMushola;

    try {
        if (dialogMode === 'edit' && selectedData) {
            const docRef = doc(firestore, collectionName, (selectedData as any).id);
            await updateDoc(docRef, { ...values, updatedAt: serverTimestamp(), updatedBy: user.uid });
            toast({ title: "Sukses!", description: `Data ${type} telah diperbarui.` });
        } else {
            await addDoc(collection(firestore, collectionName), { ...values, createdAt: serverTimestamp(), createdBy: user.uid });
            toast({ title: "Sukses!", description: `Data ${type} telah ditambahkan.` });
        }
        if (type === 'masjid') setMasjidDialogMode(null);
        else setMusholaDialogMode(null);
    } catch (error) {
        toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Terjadi kesalahan." });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleDelete = (item: Masjid | Mushola, type: 'masjid' | 'mushola') => {
    if (type === 'masjid') {
        setSelectedMasjid(item as Masjid);
        setIsMasjidDeleteAlertOpen(true);
    } else {
        setSelectedMushola(item as Mushola);
        setIsMusholaDeleteAlertOpen(true);
    }
  };

  const confirmDelete = async (type: 'masjid' | 'mushola') => {
    if (!firestore) return;
    const collectionName = type === 'masjid' ? 'masjids' : 'musholas';
    const itemToDelete = type === 'masjid' ? selectedMasjid : selectedMushola;
    if (!itemToDelete) return;
    
    setIsSubmitting(true);
    try {
        await deleteDoc(doc(firestore, collectionName, (itemToDelete as any).id));
        toast({ title: "Sukses!", description: `Data ${type} telah dihapus.` });
        if (type === 'masjid') setIsMasjidDeleteAlertOpen(false);
        else setIsMusholaDeleteAlertOpen(false);
    } catch (error) {
        toast({ variant: "destructive", title: "Gagal Menghapus", description: "Terjadi kesalahan." });
    } finally {
        setIsSubmitting(false);
    }
  };

  const isLoading = isLoadingMasjid || isLoadingMushola;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
            <div>
                <h1 className="text-3xl font-bold font-headline">Data Masjid & Mushola</h1>
                <p className="text-muted-foreground">Kelola data tempat ibadah di seluruh kecamatan.</p>
            </div>
             <div className="flex items-center gap-4">
                <Select value={filterVillage} onValueChange={setFilterVillage}>
                    <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filter Desa" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Desa</SelectItem>
                        {villages.map(v => (<SelectItem key={v} value={v.toLowerCase()}>{v}</SelectItem>))}
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Jumlah Masjid</span>
                        <span className="text-3xl font-bold">{filteredMasjidData.length}</span>
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Jumlah Mushola</span>
                        <span className="text-3xl font-bold">{filteredMusholaData.length}</span>
                    </CardTitle>
                </CardHeader>
            </Card>
        </div>

        <Tabs defaultValue="masjid" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="masjid">Masjid</TabsTrigger>
            <TabsTrigger value="mushola">Mushola</TabsTrigger>
          </TabsList>
          
          <TabsContent value="masjid">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Daftar Masjid</CardTitle>
                            <CardDescription>Data masjid yang terdaftar di sistem.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                             <Button onClick={() => setMasjidDialogMode('add')}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Manual</Button>
                             <Button asChild variant="outline"><label htmlFor="excel-upload-masjid" className="cursor-pointer">{isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}{isProcessing ? 'Memproses...' : 'Impor Excel'}</label></Button>
                             <Input id="excel-upload-masjid" type="file" accept=".xlsx, .xls" className="hidden" onChange={(e) => handleExcelImport(e, 'masjid')} disabled={isProcessing}/>
                             <Button variant="outline" onClick={() => handleExportExcel('masjid')}><Download className="mr-2 h-4 w-4" /> Ekspor Excel</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable data={filteredMasjidData} isLoading={isLoading} type="masjid" onEdit={(item) => { setSelectedMasjid(item); setMasjidDialogMode('edit'); }} onDelete={(item) => handleDelete(item, 'masjid')} />
                </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="mushola">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Daftar Mushola</CardTitle>
                            <CardDescription>Data mushola yang terdaftar di sistem.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                             <Button onClick={() => setMusholaDialogMode('add')}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Manual</Button>
                             <Button asChild variant="outline"><label htmlFor="excel-upload-mushola" className="cursor-pointer">{isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}{isProcessing ? 'Memproses...' : 'Impor Excel'}</label></Button>
                             <Input id="excel-upload-mushola" type="file" accept=".xlsx, .xls" className="hidden" onChange={(e) => handleExcelImport(e, 'mushola')} disabled={isProcessing}/>
                             <Button variant="outline" onClick={() => handleExportExcel('mushola')}><Download className="mr-2 h-4 w-4" /> Ekspor Excel</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable data={filteredMusholaData} isLoading={isLoading} type="mushola" onEdit={(item) => { setSelectedMushola(item); setMusholaDialogMode('edit'); }} onDelete={(item) => handleDelete(item, 'mushola')} />
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={masjidDialogMode !== null} onOpenChange={() => setMasjidDialogMode(null)}>
        <DialogContent><DialogHeader><DialogTitle>{masjidDialogMode === 'edit' ? 'Edit Data Masjid' : 'Tambah Data Masjid'}</DialogTitle></DialogHeader><MasjidForm data={selectedMasjid} onSubmit={(v) => handleFormSubmit(v, 'masjid')} onCancel={() => setMasjidDialogMode(null)} isLoading={isSubmitting}/></DialogContent>
      </Dialog>
      <AlertDialog open={isMasjidDeleteAlertOpen} onOpenChange={setIsMasjidDeleteAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Anda Yakin?</AlertDialogTitle><AlertDialogDescription>Tindakan ini akan menghapus data masjid <span className="font-bold">{selectedMasjid?.name}</span> secara permanen.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel><AlertDialogAction onClick={() => confirmDelete('masjid')} className={cn("bg-destructive text-destructive-foreground hover:bg-destructive/90")} disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Hapus</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>

      <Dialog open={musholaDialogMode !== null} onOpenChange={() => setMusholaDialogMode(null)}>
        <DialogContent><DialogHeader><DialogTitle>{musholaDialogMode === 'edit' ? 'Edit Data Mushola' : 'Tambah Data Mushola'}</DialogTitle></DialogHeader><MusholaForm data={selectedMushola} onSubmit={(v) => handleFormSubmit(v, 'mushola')} onCancel={() => setMusholaDialogMode(null)} isLoading={isSubmitting}/></DialogContent>
      </Dialog>
      <AlertDialog open={isMusholaDeleteAlertOpen} onOpenChange={setIsMusholaDeleteAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Anda Yakin?</AlertDialogTitle><AlertDialogDescription>Tindakan ini akan menghapus data mushola <span className="font-bold">{selectedMushola?.name}</span> secara permanen.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel><AlertDialogAction onClick={() => confirmDelete('mushola')} className={cn("bg-destructive text-destructive-foreground hover:bg-destructive/90")} disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Hapus</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </>
  );
}

function DataTable({ data, isLoading, type, onEdit, onDelete }: { data: (Masjid | Mushola)[], isLoading: boolean, type: 'masjid' | 'mushola', onEdit: (item: any) => void, onDelete: (item: any) => void }) {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Aksi</TableHead>
                        <TableHead>Desa</TableHead>
                        <TableHead>Nama {type === 'masjid' ? 'Masjid' : 'Mushola'}</TableHead>
                        <TableHead>Alamat</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow><TableCell colSpan={4} className="text-center h-24"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>
                    ) : data.length > 0 ? (
                        data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onEdit(item)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onDelete(item)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Hapus</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                <TableCell className="font-medium">{capitalizeFirstLetter(item.village)}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.address}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow><TableCell colSpan={4} className="text-center h-24">Tidak ada data.</TableCell></TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

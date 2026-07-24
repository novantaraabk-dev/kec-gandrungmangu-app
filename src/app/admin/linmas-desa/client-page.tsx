'use client';

import { useState, useMemo, ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, writeBatch, query, where, getDocs, setDoc } from 'firebase/firestore';
import type { LinmasMember, SkLinmas } from '@/lib/perangkat-data';
import { villages } from '@/lib/villages';
import { Shield, PlusCircle, Download, Loader2, MoreHorizontal, Pencil, Trash2, Search, Upload, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { LinmasForm } from '@/components/linmas/linmas-form';
import { useAppSettings } from '@/lib/app-settings';
import { Label } from '@/components/ui/label';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwC7P8gr8O5zxcUzeKOFoS2uxZ_Zhw5P_S-EoSFzFVELKRpIxq6gsIfqW_UNoKKhB2Agw/exec';

const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

function capitalizeFirstLetter(string: string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function LinmasClientPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const { arsipDriveFolderIds } = useAppSettings();

  // Common State
  const [filterVillage, setFilterVillage] = useState('all');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Anggota Linmas State
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | null>(null);
  const [selectedData, setSelectedData] = useState<LinmasMember | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const linmasQuery = useMemoFirebase(() => firestore ? collection(firestore, 'linmas') : null, [firestore]);
  const { data: linmasData, isLoading: isLoadingLinmas } = useCollection<LinmasMember>(linmasQuery);

  // SK Linmas State
  const [skFile, setSkFile] = useState<File | null>(null);
  const [skVillage, setSkVillage] = useState('');
  const skLinmasQuery = useMemoFirebase(() => firestore ? collection(firestore, 'skLinmas') : null, [firestore]);
  const { data: skLinmasData, isLoading: isLoadingSk } = useCollection<SkLinmas>(skLinmasQuery);
  const [skToDelete, setSkToDelete] = useState<SkLinmas | null>(null);
  const [isSkDeleteAlertOpen, setIsSkDeleteAlertOpen] = useState(false);

  const filteredLinmasData = useMemo(() => {
    if (!linmasData) return [];
    return linmasData
      .filter(item => filterVillage === 'all' || item.village === filterVillage)
      .filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jabatan.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [linmasData, filterVillage, searchTerm]);

  const filteredSkData = useMemo(() => {
    if (!skLinmasData) return [];
    return skLinmasData.filter(item => filterVillage === 'all' || item.village === filterVillage);
  }, [skLinmasData, filterVillage]);

  // --- ANGGOTA LINMAS HANDLERS ---

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;
    if (!firestore || !user) return toast({ variant: 'destructive', title: 'Error', description: 'Pengguna tidak terautentikasi.' });

    setIsProcessing(true);
    const file = event.target.files[0];
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json: any[] = XLSX.utils.sheet_to_json(worksheet);
      
      const batch = writeBatch(firestore);
      json.forEach(row => {
        const villageName = row['Desa']?.toLowerCase();
        if (villageName && villages.map(v => v.toLowerCase()).includes(villageName)) {
          batch.set(doc(collection(firestore, 'linmas')), {
            village: villageName,
            name: row['Nama'] || '',
            jabatan: row['Jabatan'] || 'Anggota',
            createdAt: serverTimestamp(),
            createdBy: user.uid,
          });
        }
      });
      await batch.commit();
      toast({ title: "Sukses!", description: "Data anggota Linmas berhasil diimpor." });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Gagal Mengimpor', description: error.message });
    } finally {
      setIsProcessing(false);
      event.target.value = '';
    }
  };

  const handleExportExcel = () => {
    if (!filteredLinmasData.length) return toast({ variant: 'destructive', title: 'Tidak ada data untuk diekspor.' });
    const dataToExport = filteredLinmasData.map(item => ({
      'Desa': capitalizeFirstLetter(item.village),
      'Nama': item.name,
      'Jabatan': item.jabatan,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Linmas');
    XLSX.writeFile(workbook, `Data_Linmas.xlsx`);
  };

  const handleFormSubmit = async (values: any) => {
    if (!firestore || !user) return;
    setIsSubmitting(true);
    try {
      if (dialogMode === 'edit' && selectedData) {
        await updateDoc(doc(firestore, 'linmas', selectedData.id), { ...values, updatedAt: serverTimestamp(), updatedBy: user.uid });
        toast({ title: "Sukses!", description: "Data anggota Linmas telah diperbarui." });
      } else {
        await addDoc(collection(firestore, 'linmas'), { ...values, createdAt: serverTimestamp(), createdBy: user.uid });
        toast({ title: "Sukses!", description: "Data anggota Linmas baru telah ditambahkan." });
      }
      setDialogMode(null);
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Terjadi kesalahan." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (item: LinmasMember) => {
    setSelectedData(item);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!firestore || !selectedData) return;
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(firestore, 'linmas', selectedData.id));
      toast({ title: "Sukses!", description: "Data anggota Linmas telah dihapus." });
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal Menghapus", description: "Terjadi kesalahan." });
    } finally {
      setIsDeleteAlertOpen(false);
      setIsSubmitting(false);
    }
  };

  // --- SK LINMAS HANDLERS ---
  
  const handleSkUpload = async () => {
    if (!skFile || !skVillage) return toast({ variant: 'destructive', title: 'Data Tidak Lengkap', description: 'Pilih desa dan file SK.' });
    if (!user || !firestore) return toast({ variant: 'destructive', title: 'Error', description: 'Pengguna tidak terautentikasi.' });

    const folderId = arsipDriveFolderIds?.['TRANTIBUM'];
    if (!folderId) return toast({ variant: "destructive", title: "Folder Drive Belum Diatur", description: `ID Folder untuk kategori "TRANTIBUM" belum diatur di Pengaturan Aplikasi.` });
    
    setIsProcessing(true);
    try {
        const desiredFileName = `SK_LINMAS_${skVillage.toUpperCase()}_${new Date().getFullYear()}.${skFile.name.split('.').pop()}`;
        const base64File = await toBase64(skFile);
        
        const payload = { fileData: base64File, fileName: desiredFileName, fileType: skFile.type, folderId };
        const res = await fetch(APPS_SCRIPT_URL, { method: 'POST', redirect: "follow", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error(`Server merespons dengan status ${res.status}.`);
        const result = await res.json();
        if (result.status !== 'SUCCESS') throw new Error(`Skrip Google Apps error: ${result.message}`);

        const docId = `sk-linmas-${skVillage}`;
        await setDoc(doc(firestore, 'skLinmas', docId), {
            id: docId,
            village: skVillage,
            fileUrl: result.fileUrl,
            createdAt: serverTimestamp(),
            createdBy: user.uid,
        }, { merge: true });

        toast({ title: "Sukses!", description: `SK Linmas untuk Desa ${capitalizeFirstLetter(skVillage)} berhasil diunggah.` });
        setSkFile(null);
        setSkVillage('');
    } catch (error: any) {
        toast({ variant: "destructive", title: "Gagal Mengunggah", description: error.message });
    } finally {
        setIsProcessing(false);
    }
  };

  const handleSkDelete = async (sk: SkLinmas) => {
    setSkToDelete(sk);
    setIsSkDeleteAlertOpen(true);
  };
  
  const confirmSkDelete = async () => {
    if (!firestore || !skToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(firestore, 'skLinmas', skToDelete.id));
      toast({ title: "Sukses!", description: "Dokumen SK Linmas telah dihapus." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Gagal Menghapus", description: error.message });
    } finally {
      setIsSkDeleteAlertOpen(false);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Data Perlindungan Masyarakat (Linmas)</h1>
          <p className="text-muted-foreground">Kelola data anggota dan SK Linmas di seluruh kecamatan.</p>
        </div>

        <Tabs defaultValue="anggota">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="anggota">Anggota Linmas</TabsTrigger>
            <TabsTrigger value="sk">SK Linmas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="anggota">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2"><Shield className="h-6 w-6"/>Daftar Anggota Linmas</CardTitle>
                    <CardDescription>Data anggota Linmas yang terdaftar di sistem.</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setDialogMode('add')}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Manual</Button>
                    <Button asChild variant="outline"><label htmlFor="excel-upload" className="cursor-pointer">{isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}Impor</label></Button>
                    <Input id="excel-upload" type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileChange} disabled={isProcessing}/>
                    <Button variant="outline" onClick={handleExportExcel}><Download className="mr-2 h-4 w-4" /> Ekspor</Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Cari nama atau jabatan..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
                  <Select value={filterVillage} onValueChange={setFilterVillage}><SelectTrigger className="w-[200px]"><SelectValue placeholder="Filter Desa" /></SelectTrigger><SelectContent><SelectItem value="all">Semua Desa</SelectItem>{villages.map(v => (<SelectItem key={v} value={v.toLowerCase()}>{v}</SelectItem>))}</SelectContent></Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto"><Table>
                  <TableHeader><TableRow><TableHead>Aksi</TableHead><TableHead>Desa</TableHead><TableHead>Nama</TableHead><TableHead>Jabatan</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {isLoadingLinmas ? <TableRow><TableCell colSpan={4} className="text-center h-24"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>
                    : filteredLinmasData.length > 0 ? filteredLinmasData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setSelectedData(item); setDialogMode('edit'); }}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem><DropdownMenuItem onClick={() => handleDelete(item)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Hapus</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell>
                        <TableCell className="font-medium">{capitalizeFirstLetter(item.village)}</TableCell><TableCell>{item.name}</TableCell><TableCell>{item.jabatan}</TableCell>
                      </TableRow>
                    )) : <TableRow><TableCell colSpan={4} className="text-center h-24">Tidak ada data anggota Linmas.</TableCell></TableRow>}
                  </TableBody>
                </Table></div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sk">
            <Card>
              <CardHeader>
                <CardTitle>Upload SK Linmas</CardTitle>
                <CardDescription>Unggah dokumen Surat Keputusan (SK) Linmas per desa.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2"><Label>Desa</Label><Select value={skVillage} onValueChange={setSkVillage}><SelectTrigger><SelectValue placeholder="Pilih Desa..." /></SelectTrigger><SelectContent>{villages.map(v => (<SelectItem key={v} value={v.toLowerCase()}>{v}</SelectItem>))}</SelectContent></Select></div>
                  <div className="space-y-2"><Label>File SK (PDF)</Label><Input type="file" accept=".pdf" className="cursor-pointer" onChange={(e) => setSkFile(e.target.files?.[0] || null)}/></div>
                  <Button onClick={handleSkUpload} disabled={isProcessing} className="self-end">{isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Upload className="mr-2 h-4 w-4"/>}Unggah SK</Button>
                </div>
                <div className="pt-4"><CardDescription>Daftar SK yang telah diunggah.</CardDescription></div>
                <div className="overflow-x-auto"><Table>
                  <TableHeader><TableRow><TableHead>Desa</TableHead><TableHead>Tanggal Upload</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {isLoadingSk ? <TableRow><TableCell colSpan={3} className="text-center h-24"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>
                    : skLinmasData && skLinmasData.length > 0 ? skLinmasData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{capitalizeFirstLetter(item.village)}</TableCell>
                        <TableCell>{item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString('id-ID') : '-'}</TableCell>
                        <TableCell className="text-right space-x-2"><a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({variant: 'outline'}))}><FileText className="mr-2 h-4 w-4" />Lihat</a><Button variant="destructive" size="icon" onClick={() => handleSkDelete(item)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                      </TableRow>
                    )) : <TableRow><TableCell colSpan={3} className="text-center h-24">Belum ada SK yang diunggah.</TableCell></TableRow>}
                  </TableBody>
                </Table></div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={dialogMode !== null} onOpenChange={() => setDialogMode(null)}>
        <DialogContent className="sm:max-w-xl"><DialogHeader><DialogTitle>{dialogMode === 'edit' ? 'Edit Anggota Linmas' : 'Tambah Anggota Linmas'}</DialogTitle></DialogHeader><LinmasForm data={selectedData} onSubmit={handleFormSubmit} onCancel={() => setDialogMode(null)} isLoading={isSubmitting}/></DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Anda Yakin?</AlertDialogTitle><AlertDialogDescription>Tindakan ini akan menghapus data <span className="font-bold">{selectedData?.name}</span> secara permanen.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} className={cn(buttonVariants({ variant: "destructive" }))} disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Hapus</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isSkDeleteAlertOpen} onOpenChange={setIsSkDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Anda Yakin?</AlertDialogTitle><AlertDialogDescription>Tindakan ini akan menghapus SK Linmas untuk desa <span className="font-bold">{skToDelete?.village}</span> secara permanen.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel><AlertDialogAction onClick={confirmSkDelete} className={cn(buttonVariants({ variant: "destructive" }))} disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Hapus</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

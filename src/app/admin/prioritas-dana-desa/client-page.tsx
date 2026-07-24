'use client';

import { useState, useMemo, ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, Loader2, Search, Trash2, Upload, Pencil } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase, useUser, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, deleteDoc, doc, writeBatch, serverTimestamp, updateDoc } from 'firebase/firestore';
import { villages } from '@/lib/villages';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import type { PrioritasDanaDesa } from '@/lib/perangkat-data';
import { useToast } from '@/hooks/use-toast';

function capitalizeFirstLetter(string: string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return 'N/A';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

interface ExcelRow {
  'NAMA DESA': string;
  'STATUS DESA': string;
  'PAGU DANA DESA REGULER': number;
  'KPM BLT': number;
  'TOTAL BULAN BLT': number;
  'BLT DANA DESA': number;
  'Ketahanan Iklim': number;
  'Layanan Kesehatan': number;
  'Ketahanan Pangan': number;
  'Infrastruktur PKTD': number;
  'Infrastruktur Digital': number;
  'Jumlah Pagu Prioritas': number;
  'Jumlah Pagu Non Prioritas': number;
}


export default function PrioritasDanaDesaClientPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const [filterVillage, setFilterVillage] = useState('all');
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
  const [docToDelete, setDocToDelete] = useState<PrioritasDanaDesa | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PrioritasDanaDesa | null>(null);

  const [statusDesa, setStatusDesa] = useState('');
  const [paguDanaDesa, setPaguDanaDesa] = useState('');
  const [jumlahKpm, setJumlahKpm] = useState('');
  const [totalBulanBlt, setTotalBulanBlt] = useState('');
  const [totalAnggaranBlt, setTotalAnggaranBlt] = useState('');
  const [totalAnggaranIklim, setTotalAnggaranIklim] = useState('');
  const [totalAnggaranKesehatan, setTotalAnggaranKesehatan] = useState('');
  const [totalAnggaranPangan, setTotalAnggaranPangan] = useState('');
  const [totalAnggaranInfrastruktur, setTotalAnggaranInfrastruktur] = useState('');
  const [totalAnggaranDigital, setTotalAnggaranDigital] = useState('');
  const [jumlahPaguPrioritas, setJumlahPaguPrioritas] = useState('');
  const [jumlahPaguNonPrioritas, setJumlahPaguNonPrioritas] = useState('');

  const dataCollection = useMemoFirebase(() => firestore ? collection(firestore, 'prioritasDanaDesa') : null, [firestore]);
  const { data: allData, isLoading } = useCollection<PrioritasDanaDesa>(dataCollection);

  const filteredData = useMemo(() => {
    if (!allData) return [];
    return [...allData]
      .filter(doc => filterVillage === 'all' || doc.village.toLowerCase() === filterVillage.toLowerCase())
      .filter(doc => filterYear === 'all' || doc.year.toString() === filterYear)
      .sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
  }, [allData, filterVillage, filterYear]);
  
  const handleDeleteClick = (doc: PrioritasDanaDesa) => {
    setDocToDelete(doc);
    setIsDeleteAlertOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!docToDelete || !firestore) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(firestore, 'prioritasDanaDesa', docToDelete.id));
      toast({ title: 'Sukses', description: 'Data prioritas dana desa telah dihapus.' });
      setIsDeleteAlertOpen(false);
      setDocToDelete(null);
    } catch(e: any) {
       toast({ variant: 'destructive', title: 'Gagal Menghapus', description: 'Terjadi kesalahan saat menghapus data.' });
    } finally {
      setIsDeleting(false);
    }
  }

  const handleEditClick = (item: PrioritasDanaDesa) => {
    setSelectedItem(item);
    setStatusDesa(item.statusDesa || '');
    setPaguDanaDesa(String(item.paguDanaDesa || ''));
    setJumlahKpm(String(item.jumlahKpm || ''));
    setTotalBulanBlt(String(item.totalBulanBlt || ''));
    setTotalAnggaranBlt(String(item.totalAnggaranBlt || ''));
    setTotalAnggaranIklim(String(item.totalAnggaranIklim || ''));
    setTotalAnggaranKesehatan(String(item.totalAnggaranKesehatan || ''));
    setTotalAnggaranPangan(String(item.totalAnggaranPangan || ''));
    setTotalAnggaranInfrastruktur(String(item.totalAnggaranInfrastruktur || ''));
    setTotalAnggaranDigital(String(item.totalAnggaranDigital || ''));
    setJumlahPaguPrioritas(String(item.jumlahPaguPrioritas || ''));
    setJumlahPaguNonPrioritas(String(item.jumlahPaguNonPrioritas || ''));
    setIsEditOpen(true);
  };
  
  const handleUpdate = async () => {
    if (!selectedItem || !firestore || !user) {
        toast({ variant: 'destructive', title: 'Error', description: 'Item tidak dipilih atau pengguna tidak terautentikasi.'});
        return;
    }
    setIsEditing(true);

    const payload: Partial<PrioritasDanaDesa> = {
        statusDesa,
        paguDanaDesa: Number(paguDanaDesa) || 0,
        jumlahKpm: Number(jumlahKpm) || 0,
        totalBulanBlt: Number(totalBulanBlt) || 0,
        totalAnggaranBlt: Number(totalAnggaranBlt) || 0,
        totalAnggaranIklim: Number(totalAnggaranIklim) || 0,
        totalAnggaranKesehatan: Number(totalAnggaranKesehatan) || 0,
        totalAnggaranPangan: Number(totalAnggaranPangan) || 0,
        totalAnggaranInfrastruktur: Number(totalAnggaranInfrastruktur) || 0,
        totalAnggaranDigital: Number(totalAnggaranDigital) || 0,
        jumlahPaguPrioritas: Number(jumlahPaguPrioritas) || 0,
        jumlahPaguNonPrioritas: Number(jumlahPaguNonPrioritas) || 0,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
    };
    
    try {
        const docRef = doc(firestore, 'prioritasDanaDesa', selectedItem.id);
        await updateDoc(docRef, payload);
        toast({ title: 'Sukses!', description: 'Data prioritas dana desa berhasil diperbarui.'});
        setIsEditOpen(false);
        setSelectedItem(null);
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Gagal Memperbarui', description: e.message });
    } finally {
        setIsEditing(false);
    }
  };
  
  const availableYears = useMemo(() => {
    if (!allData) return [new Date().getFullYear().toString()];
    const years = new Set(allData.map(d => d.year.toString()));
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [allData]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || filterYear === 'all') {
      if (filterYear === 'all') {
        toast({ variant: "destructive", title: "Tahun Belum Dipilih", description: "Silakan pilih tahun sebelum mengimpor file." });
      }
      return;
    }
    
    const file = event.target.files[0];
    setIsProcessing(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const json: any[] = XLSX.utils.sheet_to_json(worksheet);

      const expectedHeaders = [
        'NAMA DESA', 'STATUS DESA', 'PAGU DANA DESA REGULER',
        'KPM BLT', 'TOTAL BULAN BLT', 'BLT DANA DESA',
        'Ketahanan Iklim', 'Layanan Kesehatan', 'Ketahanan Pangan',
        'Infrastruktur PKTD', 'Infrastruktur Digital',
        'Jumlah Pagu Prioritas', 'Jumlah Pagu Non Prioritas'
      ];
      const actualHeaders = Object.keys(json[0] || {});
      const hasAllHeaders = expectedHeaders.every(h => actualHeaders.includes(h));

      if (!hasAllHeaders) {
        throw new Error('Format file Excel tidak sesuai. Pastikan semua kolom yang diperlukan ada.');
      }

      await handleSaveToFirestore(json as ExcelRow[]);

    } catch (error: any) {
      toast({ variant: "destructive", title: "Gagal Mengimpor", description: error.message });
    } finally {
      setIsProcessing(false);
      event.target.value = '';
    }
  };

  const handleSaveToFirestore = async (rows: ExcelRow[]) => {
    if (!firestore || !user || filterYear === 'all') return;

    try {
        const batch = writeBatch(firestore);
        const year = parseInt(filterYear);

        rows.forEach(row => {
          const villageName = row['NAMA DESA']?.toLowerCase();
          if (!villageName || !villages.map(v => v.toLowerCase()).includes(villageName)) {
            console.warn(`Skipping row with invalid village name: ${row['NAMA DESA']}`);
            return;
          }

          const docId = `${villageName}-${year}`;
          const docRef = doc(firestore, 'prioritasDanaDesa', docId);

          const payload: Partial<PrioritasDanaDesa> = {
            id: docId,
            village: villageName,
            year: year,
            statusDesa: row['STATUS DESA'],
            paguDanaDesa: Number(row['PAGU DANA DESA REGULER']) || 0,
            jumlahKpm: Number(row['KPM BLT']) || 0,
            totalBulanBlt: Number(row['TOTAL BULAN BLT']) || 0,
            totalAnggaranBlt: Number(row['BLT DANA DESA']) || 0,
            totalAnggaranIklim: Number(row['Ketahanan Iklim']) || 0,
            totalAnggaranKesehatan: Number(row['Layanan Kesehatan']) || 0,
            totalAnggaranPangan: Number(row['Ketahanan Pangan']) || 0,
            totalAnggaranInfrastruktur: Number(row['Infrastruktur PKTD']) || 0,
            totalAnggaranDigital: Number(row['Infrastruktur Digital']) || 0,
            jumlahPaguPrioritas: Number(row['Jumlah Pagu Prioritas']) || 0,
            jumlahPaguNonPrioritas: Number(row['Jumlah Pagu Non Prioritas']) || 0,
            updatedAt: serverTimestamp(),
            updatedBy: user.uid,
          };
          
          batch.set(docRef, payload, { merge: true });
        });
        
        await batch.commit();
        toast({ title: "Sukses!", description: `Data prioritas dana desa untuk tahun ${year} berhasil diimpor.` });

    } catch (serverError: any) {
        console.error("Firestore batch save error:", serverError);
        const contextualError = new FirestorePermissionError({
            path: `prioritasDanaDesa/*`,
            operation: 'write',
        });
        errorEmitter.emit('permission-error', contextualError);
        toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Penyimpanan data gagal. Periksa izin akses Anda." });
    }
  };


  return (
    <>
      <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold font-headline">Data Prioritas Dana Desa</h1>
            <p className="text-muted-foreground">Kelola data prioritas penggunaan Dana Desa dari seluruh desa.</p>
        </div>
        <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-6 w-6" />
                <span>Daftar Input Prioritas Dana Desa</span>
            </CardTitle>
            <CardDescription>
                Tinjau, cari, dan kelola semua data yang diunggah oleh operator desa atau impor melalui Excel.
            </CardDescription>
            <div className="flex flex-wrap items-center gap-4 pt-4">
                <Select value={filterVillage} onValueChange={setFilterVillage}>
                <SelectTrigger className="w-full sm:w-auto flex-1 min-w-[180px]">
                    <SelectValue placeholder="Filter Desa" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua Desa</SelectItem>
                    {villages.map(v => (
                    <SelectItem key={v} value={v.toLowerCase()}>{v}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
                 <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="w-full sm:w-auto flex-1 min-w-[150px]">
                    <SelectValue placeholder="Filter Tahun" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua Tahun</SelectItem>
                    {availableYears.map(y => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                   <label htmlFor="excel-upload" className="cursor-pointer">
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    {isProcessing ? 'Memproses...' : 'Impor Excel'}
                   </label>
                </Button>
                <Input id="excel-upload" type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileChange} disabled={isProcessing || filterYear === 'all'}/>
            </div>
            </CardHeader>
            <CardContent>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Aksi</TableHead>
                            <TableHead>Desa/Tahun</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Pagu DD</TableHead>
                            <TableHead>KPM BLT</TableHead>
                            <TableHead>Bulan BLT</TableHead>
                            <TableHead>Anggaran BLT</TableHead>
                            <TableHead>Iklim</TableHead>
                            <TableHead>Kesehatan</TableHead>
                            <TableHead>Pangan</TableHead>
                            <TableHead>Infra PKTD</TableHead>
                            <TableHead>Digital</TableHead>
                            <TableHead>Pagu Prioritas</TableHead>
                            <TableHead>Pagu Non-Prioritas</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={14} className="text-center h-24">
                            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                            </TableCell>
                        </TableRow>
                        ) : filteredData.length > 0 ? (
                        filteredData.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="space-x-1">
                                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEditClick(item)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDeleteClick(item)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                                <TableCell className="font-medium whitespace-nowrap">
                                    {capitalizeFirstLetter(item.village)}
                                    <p className="text-xs text-muted-foreground">{item.year}</p>
                                </TableCell>
                                <TableCell>{item.statusDesa || '-'}</TableCell>
                                <TableCell className="whitespace-nowrap">{formatCurrency(item.paguDanaDesa)}</TableCell>
                                <TableCell>{item.jumlahKpm}</TableCell>
                                <TableCell>{item.totalBulanBlt}</TableCell>
                                <TableCell className="whitespace-nowrap">{formatCurrency(item.totalAnggaranBlt)}</TableCell>
                                <TableCell className="whitespace-nowrap">{formatCurrency(item.totalAnggaranIklim)}</TableCell>
                                <TableCell className="whitespace-nowrap">{formatCurrency(item.totalAnggaranKesehatan)}</TableCell>
                                <TableCell className="whitespace-nowrap">{formatCurrency(item.totalAnggaranPangan)}</TableCell>
                                <TableCell className="whitespace-nowrap">{formatCurrency(item.totalAnggaranInfrastruktur)}</TableCell>
                                <TableCell className="whitespace-nowrap">{formatCurrency(item.totalAnggaranDigital)}</TableCell>
                                <TableCell className="whitespace-nowrap">{formatCurrency(item.jumlahPaguPrioritas)}</TableCell>
                                <TableCell className="whitespace-nowrap">{formatCurrency(item.jumlahPaguNonPrioritas)}</TableCell>
                            </TableRow>
                        ))
                        ) : (
                        <TableRow>
                            <TableCell colSpan={14} className="text-center h-24">
                            Tidak ada data prioritas yang ditemukan.
                            </TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-24">
                            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : filteredData.length > 0 ? (
                        filteredData.map((item) => (
                            <Card key={item.id} className="p-4 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg">{capitalizeFirstLetter(item.village)}</h3>
                                        <p className="text-sm text-muted-foreground">{item.year} - {item.statusDesa || 'N/A'}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEditClick(item)}>
                                          <Pencil className="h-4 w-4" />
                                      </Button>
                                      <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDeleteClick(item)}>
                                          <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm pt-4 border-t">
                                    <div><span className="text-muted-foreground">Pagu DD:</span><p className="font-semibold">{formatCurrency(item.paguDanaDesa)}</p></div>
                                    <div><span className="text-muted-foreground">Anggaran BLT:</span><p className="font-semibold">{formatCurrency(item.totalAnggaranBlt)}</p></div>
                                    <div><span className="text-muted-foreground">Jml KPM:</span><p className="font-semibold">{item.jumlahKpm}</p></div>
                                    <div><span className="text-muted-foreground">Bulan BLT:</span><p className="font-semibold">{item.totalBulanBlt}</p></div>
                                    <div><span className="text-muted-foreground">Iklim:</span><p className="font-semibold">{formatCurrency(item.totalAnggaranIklim)}</p></div>
                                    <div><span className="text-muted-foreground">Kesehatan:</span><p className="font-semibold">{formatCurrency(item.totalAnggaranKesehatan)}</p></div>
                                    <div><span className="text-muted-foreground">Pangan:</span><p className="font-semibold">{formatCurrency(item.totalAnggaranPangan)}</p></div>
                                    <div><span className="text-muted-foreground">Infra PKTD:</span><p className="font-semibold">{formatCurrency(item.totalAnggaranInfrastruktur)}</p></div>
                                    <div><span className="text-muted-foreground">Digital:</span><p className="font-semibold">{formatCurrency(item.totalAnggaranDigital)}</p></div>
                                    <div className="col-span-2 pt-2 border-t mt-2"><span className="text-muted-foreground">Pagu Prioritas:</span><p className="font-semibold">{formatCurrency(item.jumlahPaguPrioritas)}</p></div>
                                    <div className="col-span-2"><span className="text-muted-foreground">Pagu Non Prioritas:</span><p className="font-semibold">{formatCurrency(item.jumlahPaguNonPrioritas)}</p></div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center h-24 flex items-center justify-center">
                            <p>Tidak ada data prioritas yang ditemukan.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>Edit Prioritas Dana Desa {selectedItem?.year}</DialogTitle>
                <DialogDescription>Perbarui alokasi anggaran untuk Desa {capitalizeFirstLetter(selectedItem?.village || '')}.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[70vh] pr-6">
                <div className="space-y-6 pr-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="statusDesa">Status Desa</Label><Input id="statusDesa" placeholder="Maju, Berkembang, dll." value={statusDesa} onChange={(e) => setStatusDesa(e.target.value)} /></div>
                        <div className="space-y-2"><Label htmlFor="paguDanaDesa">Pagu Dana Desa Reguler</Label><Input id="paguDanaDesa" type="number" placeholder="0" value={paguDanaDesa} onChange={(e) => setPaguDanaDesa(e.target.value)} /></div>
                    </div>
                    <Card>
                        <CardHeader><CardTitle>BLT DD</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2"><Label htmlFor="bltKpm">Jumlah KPM</Label><Input id="bltKpm" type="number" placeholder="0" value={jumlahKpm} onChange={(e) => setJumlahKpm(e.target.value)} /></div>
                            <div className="space-y-2"><Label htmlFor="totalBulanBlt">Total Bulan</Label><Input id="totalBulanBlt" type="number" placeholder="0" value={totalBulanBlt} onChange={(e) => setTotalBulanBlt(e.target.value)} /></div>
                            <div className="space-y-2"><Label htmlFor="bltAnggaran">Total Anggaran BLT</Label><Input id="bltAnggaran" type="number" placeholder="0" value={totalAnggaranBlt} onChange={(e) => setTotalAnggaranBlt(e.target.value)} /></div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Alokasi Prioritas</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2"><Label htmlFor="iklimAnggaran">Ketahanan Iklim</Label><Input id="iklimAnggaran" type="number" placeholder="Total Anggaran" value={totalAnggaranIklim} onChange={(e) => setTotalAnggaranIklim(e.target.value)} /></div>
                            <div className="space-y-2"><Label htmlFor="kesehatanAnggaran">Layanan Kesehatan</Label><Input id="kesehatanAnggaran" type="number" placeholder="Total Anggaran" value={totalAnggaranKesehatan} onChange={(e) => setTotalAnggaranKesehatan(e.target.value)} /></div>
                            <div className="space-y-2"><Label htmlFor="panganAnggaran">Ketahanan Pangan</Label><Input id="panganAnggaran" type="number" placeholder="Total Anggaran" value={totalAnggaranPangan} onChange={(e) => setTotalAnggaranPangan(e.target.value)} /></div>
                            <div className="space-y-2"><Label htmlFor="infrastrukturAnggaran">Infrastruktur PKTD</Label><Input id="infrastrukturAnggaran" type="number" placeholder="Total Anggaran" value={totalAnggaranInfrastruktur} onChange={(e) => setTotalAnggaranInfrastruktur(e.target.value)} /></div>
                            <div className="space-y-2"><Label htmlFor="digitalAnggaran">Infrastruktur Digital</Label><Input id="digitalAnggaran" type="number" placeholder="Total Anggaran" value={totalAnggaranDigital} onChange={(e) => setTotalAnggaranDigital(e.target.value)} /></div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Jumlah Pagu</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="jumlahPaguPrioritas">Jumlah Pagu Prioritas</Label><Input id="jumlahPaguPrioritas" type="number" placeholder="0" value={jumlahPaguPrioritas} onChange={(e) => setJumlahPaguPrioritas(e.target.value)} /></div>
                            <div className="space-y-2"><Label htmlFor="jumlahPaguNonPrioritas">Jumlah Pagu Non Prioritas</Label><Input id="jumlahPaguNonPrioritas" type="number" placeholder="0" value={jumlahPaguNonPrioritas} onChange={(e) => setJumlahPaguNonPrioritas(e.target.value)} /></div>
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>
            <DialogFooter className="pt-4 mt-4 border-t">
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>Batal</Button>
                <Button onClick={handleUpdate} disabled={isEditing}>
                    {isEditing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                    Simpan Perubahan
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda Yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus data Prioritas Dana Desa untuk <span className="font-bold">{docToDelete ? `${capitalizeFirstLetter(docToDelete.village)} tahun ${docToDelete.year}` : ''}</span> secara permanen. Data ini tidak dapat dipulihkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className={cn(buttonVariants({ variant: "destructive" }))} disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

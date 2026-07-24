
'use client';

import { useState, useMemo, ChangeEvent, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, writeBatch, query, orderBy, getDoc } from 'firebase/firestore';
import type { PbbP2, PbbP2Payment } from '@/lib/perangkat-data';
import { villages } from '@/lib/villages';
import { Landmark, PlusCircle, Download, Loader2, MoreHorizontal, Pencil, Trash2, Search, Upload, FileImage, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { PbbP2Form } from '@/components/rekap-pbb-p2/pbb-form';
import { PbbPaymentForm, PbbPaymentFormValues } from '@/components/rekap-pbb-p2/pbb-payment-form';

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

const formatCurrency = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);

const PaymentHistory = ({ pbbId, village, year }: { pbbId: string, village: string, year: string }) => {
    const firestore = useFirestore();
    const paymentsQuery = useMemoFirebase(() => {
        if (!firestore || !pbbId) return null;
        return query(collection(firestore, 'pbbP2', pbbId, 'payments'), orderBy('paymentDate', 'desc'));
    }, [firestore, pbbId]);

    const { data: payments, isLoading } = useCollection<PbbP2Payment>(paymentsQuery);
    
    if(isLoading) return <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

    return (
        <div>
            <DialogHeader>
                <DialogTitle>Riwayat Setoran PBB - {capitalizeFirstLetter(village)} {year}</DialogTitle>
                <DialogDescription>Daftar semua setoran yang telah tercatat.</DialogDescription>
            </DialogHeader>
            <div className="mt-4 max-h-[60vh] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tanggal Setor</TableHead>
                            <TableHead className="text-right">Jumlah (Rp)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!payments || payments.length === 0 ? (
                            <TableRow><TableCell colSpan={2} className="h-24 text-center">Belum ada riwayat setoran.</TableCell></TableRow>
                        ) : (
                            payments.map(p => (
                                <TableRow key={p.id}>
                                    <TableCell>{p.paymentDate}</TableCell>
                                    <TableCell className="text-right font-medium">{formatCurrency(p.amount)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};


export default function RekapPbbP2ClientPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedPbbForDetails, setSelectedPbbForDetails] = useState<PbbP2 | null>(null);

  const [selectedData, setSelectedData] = useState<PbbP2 | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pbbQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'pbbP2');
  }, [firestore]);
  const { data, isLoading } = useCollection<PbbP2>(pbbQuery);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(item => item.year.toString() === filterYear);
  }, [data, filterYear]);
  
  const availableYears = useMemo(() => {
    if (!data) return [new Date().getFullYear().toString()];
    const years = Array.from(new Set(data.map(item => item.year.toString())));
    if (!years.includes(new Date().getFullYear().toString())) {
        years.push(new Date().getFullYear().toString());
    }
    return years.sort((a,b) => Number(b) - Number(a));
  }, [data]);

  const handleFileUpload = async (file: File, folderId: string, desiredFileName: string) => {
    // This function can be used for image uploads if needed, similar to other pages
    const base64File = await toBase64(file);
    const payload = { fileData: base64File, fileName: desiredFileName, fileType: file.type, folderId };
    const res = await fetch(APPS_SCRIPT_URL, { method: 'POST', redirect: "follow", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
    if (!res.ok) throw new Error(`Server responded with ${res.status}`);
    const result = await res.json();
    if (result.status !== 'SUCCESS') throw new Error(`Google Apps Script error: ${result.message}`);
    return result.fileUrl;
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;
    if (!firestore || !user) return toast({ variant: 'destructive', title: 'Error', description: 'Pengguna tidak terautentikasi.' });

    const file = event.target.files[0];
    setIsProcessing(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json: any[] = XLSX.utils.sheet_to_json(worksheet);
      
      const batch = writeBatch(firestore);
      const collectionRef = collection(firestore, 'pbbP2');

      const getRowValue = (row: any, keys: string[]) => {
        for (const key of keys) {
            const rowKey = Object.keys(row).find(k => k.toLowerCase().trim() === key.toLowerCase().trim());
            if (rowKey && row[rowKey] !== undefined) {
                return row[rowKey];
            }
        }
        return undefined;
      }

      json.forEach(row => {
        const villageValue = getRowValue(row, ['desa', 'nama desa']);
        const villageName = villageValue ? String(villageValue).toLowerCase().trim() : '';

        if (!villageName) {
            console.warn("Skipping row with no village name:", row);
            return;
        }
        
        if (!villages.map(v => v.toLowerCase()).includes(villageName)) {
            console.warn(`Skipping row with invalid village name: '${villageName}'`, row);
            return;
        }

        const docId = `${villageName}-${filterYear}`;
        const docRef = doc(collectionRef, docId);
        
        const pagu = Number(getRowValue(row, ['pagu pbb p2', 'pagu'])) || 0;
        const totalSppt = Number(getRowValue(row, ['total sppt', 'sppt'])) || 0;
        const terbayar = Number(getRowValue(row, ['terbayar'])) || 0;

        const payload = {
          id: docId,
          village: villageName,
          year: Number(filterYear),
          pagu,
          totalSppt,
          terbayar,
          createdAt: serverTimestamp(),
          createdBy: user.uid,
          updatedAt: serverTimestamp(),
          updatedBy: user.uid,
        };
        batch.set(docRef, payload, { merge: true });
      });

      await batch.commit();
      toast({ title: "Sukses!", description: `Data PBB P2 berhasil diimpor untuk tahun ${filterYear}.` });

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
    const dataToExport = filteredData.map(item => {
        const sisa = item.pagu - item.terbayar;
        const persentase = item.pagu > 0 ? (item.terbayar / item.pagu) * 100 : 0;
        return {
          'DESA': capitalizeFirstLetter(item.village),
          'PAGU PBB P2': item.pagu,
          'TOTAL SPPT': item.totalSppt,
          'TERBAYAR': item.terbayar,
          'SISA BELUM TERBAYAR': sisa,
          'PERSENTASE TERBAYAR': `${persentase.toFixed(2)}%`,
        }
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap PBB P2');
    XLSX.writeFile(workbook, `Rekap_PBB_P2_${filterYear}.xlsx`);
  };

  const handleFormSubmit = async (values: any, imageFile: File | null) => {
    if (!firestore || !user) return;
    setIsSubmitting(true);
    
    try {
        let imageUrl = selectedData?.imageUrl || '';
        // Note: Image upload logic needs a destination folder ID from settings, which is not defined for PBB.
        // if (imageFile) {
        //   const folderId = "YOUR_PBB_FOLDER_ID"; // This needs to be set in admin settings
        //   const desiredFileName = `PBB_${values.village}_${values.year}.${imageFile.name.split('.').pop()}`;
        //   imageUrl = await handleFileUpload(imageFile, folderId, desiredFileName);
        // }

        if (dialogMode === 'edit' && selectedData) {
            const docRef = doc(firestore, 'pbbP2', selectedData.id);
            await updateDoc(docRef, { ...values, imageUrl, updatedAt: serverTimestamp(), updatedBy: user.uid });
            toast({ title: "Sukses!", description: `Data PBB P2 telah diperbarui.` });
        } else {
            const docId = `${values.village.toLowerCase()}-${values.year}`;
            const docRef = doc(firestore, 'pbbP2', docId);
            await addDoc(collection(firestore, 'pbbP2'), { ...values, id: docId, imageUrl, createdAt: serverTimestamp(), createdBy: user.uid });
            toast({ title: "Sukses!", description: `Data PBB P2 baru telah ditambahkan.` });
        }
        setDialogMode(null);
    } catch (error: any) {
        toast({ variant: "destructive", title: "Gagal Menyimpan", description: error.message });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handlePaymentSubmit = async (values: PbbPaymentFormValues) => {
    if (!firestore || !user) return;
    setIsSubmitting(true);
    const { village, paymentDate, amount } = values;
    const year = Number(filterYear);
    const docId = `${village.toLowerCase()}-${year}`;
    const pbbDocRef = doc(firestore, 'pbbP2', docId);

    try {
        const pbbDocSnap = await getDoc(pbbDocRef);
        if (!pbbDocSnap.exists()) {
            toast({ variant: 'destructive', title: 'Data Tidak Ditemukan', description: `Data PBB untuk desa ${village} tahun ${year} belum ada. Silakan impor atau buat data master terlebih dahulu.` });
            setIsSubmitting(false);
            return;
        }

        const batch = writeBatch(firestore);

        const paymentCollectionRef = collection(firestore, 'pbbP2', docId, 'payments');
        const newPaymentRef = doc(paymentCollectionRef);
        batch.set(newPaymentRef, {
            pbbP2Id: docId,
            amount: amount,
            paymentDate: paymentDate,
            createdAt: serverTimestamp(),
            createdBy: user.uid,
        });

        const currentData = pbbDocSnap.data() as PbbP2;
        const newTerbayar = (currentData.terbayar || 0) + amount;
        batch.update(pbbDocRef, { 
            terbayar: newTerbayar,
            updatedAt: serverTimestamp(),
            updatedBy: user.uid,
        });
        
        await batch.commit();

        toast({ title: 'Sukses!', description: 'Pembayaran berhasil ditambahkan.' });
        setIsPaymentDialogOpen(false);
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'Gagal Menyimpan', description: e.message });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleDelete = (item: PbbP2) => {
    setSelectedData(item);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!firestore || !selectedData) return;
    
    setIsSubmitting(true);
    try {
        await deleteDoc(doc(firestore, 'pbbP2', selectedData.id));
        toast({ title: "Sukses!", description: `Data PBB P2 telah dihapus.` });
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
            <h1 className="text-3xl font-bold font-headline">Rekapitulasi PBB P2</h1>
            <p className="text-muted-foreground">Kelola data Pajak Bumi dan Bangunan Perdesaan dan Perkotaan.</p>
        </div>

        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2"><Landmark className="h-6 w-6"/> Daftar Rekap PBB P2</CardTitle>
                        <CardDescription>Data PBB P2 yang terdaftar di sistem.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => setIsPaymentDialogOpen(true)}><PlusCircle className="mr-2 h-4 w-4" /> Input Bayar</Button>
                        <Button asChild variant="outline">
                           <label htmlFor="excel-upload-pbb" className="cursor-pointer">
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                            {isProcessing ? 'Memproses...' : 'Impor Excel'}
                           </label>
                        </Button>
                        <Input id="excel-upload-pbb" type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileChange} disabled={isProcessing}/>
                        <Button variant="outline" onClick={handleExportExcel}><Download className="mr-2 h-4 w-4" /> Ekspor Excel</Button>
                    </div>
                </div>
                 <div className="flex items-center gap-4 pt-4">
                    <Select value={filterYear} onValueChange={setFilterYear}>
                        <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filter Tahun" /></SelectTrigger>
                        <SelectContent>{availableYears.map(y => (<SelectItem key={y} value={y}>{y}</SelectItem>))}</SelectContent>
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
                                <TableHead>Pagu PBB P2</TableHead>
                                <TableHead>Total SPPT</TableHead>
                                <TableHead>Terbayar</TableHead>
                                <TableHead>Sisa Belum Terbayar</TableHead>
                                <TableHead>Persentase Terbayar</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow><TableCell colSpan={7} className="text-center h-24"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>
                            ) : filteredData.length > 0 ? (
                                filteredData.map((item) => {
                                    const sisa = item.pagu - item.terbayar;
                                    const persentase = item.pagu > 0 ? (item.terbayar / item.pagu) * 100 : 0;
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => { setSelectedPbbForDetails(item); setIsDetailsDialogOpen(true); }}><FileText className="mr-2 h-4 w-4"/>Lihat Rincian</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => { setSelectedData(item); setDialogMode('edit'); }}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                                        {item.imageUrl && <DropdownMenuItem asChild><a href={item.imageUrl} target="_blank" rel="noopener noreferrer" download><Download className="mr-2 h-4 w-4" />Download Bukti</a></DropdownMenuItem>}
                                                        <DropdownMenuItem onClick={() => handleDelete(item)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Hapus</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                            <TableCell className="font-medium">{capitalizeFirstLetter(item.village)}</TableCell>
                                            <TableCell>{formatCurrency(item.pagu)}</TableCell>
                                            <TableCell>{item.totalSppt}</TableCell>
                                            <TableCell>{formatCurrency(item.terbayar)}</TableCell>
                                            <TableCell className={sisa > 0 ? 'text-destructive' : ''}>{formatCurrency(sisa)}</TableCell>
                                            <TableCell className="font-semibold">{persentase.toFixed(2)}%</TableCell>
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <TableRow><TableCell colSpan={7} className="text-center h-24">Tidak ada data PBB P2 untuk tahun {filterYear}.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
      </div>

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-xl"><DialogHeader><DialogTitle>Input Setoran PBB</DialogTitle><DialogDescription>Masukkan detail setoran PBB untuk tahun {filterYear}.</DialogDescription></DialogHeader><PbbPaymentForm onSubmit={handlePaymentSubmit} onCancel={() => setIsPaymentDialogOpen(false)} isLoading={isSubmitting}/></DialogContent>
      </Dialog>
      
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-md">
            {selectedPbbForDetails && (
                <PaymentHistory pbbId={selectedPbbForDetails.id} village={selectedPbbForDetails.village} year={selectedPbbForDetails.year.toString()} />
            )}
        </DialogContent>
      </Dialog>

      <Dialog open={dialogMode !== null} onOpenChange={() => setDialogMode(null)}>
        <DialogContent className="sm:max-w-xl"><DialogHeader><DialogTitle>{dialogMode === 'edit' ? 'Edit Data PBB P2' : 'Tambah Data PBB P2'}</DialogTitle></DialogHeader><PbbP2Form data={selectedData} onSubmit={handleFormSubmit} onCancel={() => setDialogMode(null)} isLoading={isSubmitting}/></DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Anda Yakin?</AlertDialogTitle>
                <AlertDialogDescription>Tindakan ini akan menghapus data PBB P2 untuk desa <span className="font-bold">{selectedData?.village}</span> tahun <span className="font-bold">{selectedData?.year}</span> secara permanen.</AlertDialogDescription>
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

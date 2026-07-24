'use client';

import { useState, useMemo, ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, Loader2, Landmark, Download, Pencil, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirestore, useUser, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError, WithId } from '@/firebase';
import { collection, doc, writeBatch, getDocs, getDoc, serverTimestamp, query, addDoc, updateDoc, setDoc } from 'firebase/firestore';
import type { ApbdesEntry, ApbdesDetail } from '@/lib/perangkat-data';
import { ApbdesForm } from '@/components/apbdes/apbdes-form';


function capitalizeFirstLetter(string: string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function ApbdesClientPage({ village }: { village: string }) {
  const villageTitle = capitalizeFirstLetter(village);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit' | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<WithId<ApbdesDetail> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const year = new Date().getFullYear();
  const apbdesId = `${village.toLowerCase()}-${year}`;

  const apbdesDetailsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'apbdes', apbdesId, 'details'));
  }, [firestore, apbdesId]);

  const { data: apbdesData, isLoading: isLoadingData } = useCollection<ApbdesDetail>(apbdesDetailsQuery);

  const summaryData = useMemo(() => {
    if (!apbdesData || apbdesData.length === 0) {
      return {
        expenditureByField: new Map<string, number>(),
        byFundingSource: new Map<string, number>(),
        totalRevenue: 0,
        expenditureByFundingSource: new Map<string, number>(),
        totalExpenditure: 0,
      };
    }

    const revenues = apbdesData.filter(item => item.category.toLowerCase().includes('pendapatan'));
    const expenditures = apbdesData.filter(item => !item.category.toLowerCase().includes('pendapatan'));

    const expenditureByField = expenditures
      .reduce((acc, item) => {
        const fieldName = item.category.replace(/belanja/i, '').replace(/bidang/i, '').trim();
        acc.set(fieldName, (acc.get(fieldName) || 0) + item.amount);
        return acc;
      }, new Map<string, number>());
      
    const byFundingSource = revenues
      .reduce((acc, item) => {
        const source = item.fundingSource || 'Lainnya';
        acc.set(source, (acc.get(source) || 0) + item.amount);
        return acc;
    }, new Map<string, number>());
    
    const expenditureByFundingSource = expenditures
      .reduce((acc, item) => {
        const source = item.fundingSource || 'Lainnya';
        acc.set(source, (acc.get(source) || 0) + item.amount);
        return acc;
      }, new Map<string, number>());

    const totalRevenue = revenues.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenditure = expenditures.reduce((sum, item) => sum + item.amount, 0);

    return { expenditureByField, byFundingSource, totalRevenue, expenditureByFundingSource, totalExpenditure };
  }, [apbdesData]);

  const sortedApbdesData = useMemo(() => {
    if (!apbdesData) return [];
    return [...apbdesData].sort((a, b) => 
      (a.activityCode || "").localeCompare(b.activityCode || "", undefined, { numeric: true, sensitivity: 'base' })
    );
  }, [apbdesData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  const updateApbdesSummary = async () => {
    if (!firestore || !user) return;
    
    const detailsCollectionRef = collection(firestore, 'apbdes', apbdesId, 'details');
    const detailsSnapshot = await getDocs(detailsCollectionRef);
    const allDetails = detailsSnapshot.docs.map(doc => doc.data() as ApbdesDetail);

    let totalRevenue = 0;
    let totalExpenditure = 0;
    const revenueSources: Record<string, number> = {};
    
    allDetails.forEach(entry => {
      const cleanAmount = Number(entry.amount) || 0;

      if (String(entry.category).toLowerCase().includes('pendapatan')) {
        totalRevenue += cleanAmount;
        const source = entry.fundingSource || 'Lainnya';
        revenueSources[source] = (revenueSources[source] || 0) + cleanAmount;
      } else if (String(entry.category).toLowerCase().includes('belanja')) {
        totalExpenditure += cleanAmount;
      }
    });
    
    const summaryDocRef = doc(firestore, 'apbdes', apbdesId);
    const summaryDocSnap = await getDoc(summaryDocRef);
    const payload = {
        revenue: totalRevenue,
        expenditure: totalExpenditure,
        financing: summaryDocSnap.exists() ? (summaryDocSnap.data().financing || 0) : 0,
        revenueSources,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
    };
    
    if (summaryDocSnap.exists()) {
        await updateDoc(summaryDocRef, payload);
    } else {
        await setDoc(summaryDocRef, {
            id: apbdesId,
            year,
            village: village.toLowerCase(),
            ...payload,
            createdAt: serverTimestamp(),
            createdBy: user.uid,
        });
    }
  };

  const handleFormSubmit = async (values: any) => {
    if (!firestore || !user) return;
    setIsSubmitting(true);
    try {
        if (formMode === 'edit' && selectedDetail) {
            const docRef = doc(firestore, 'apbdes', apbdesId, 'details', selectedDetail.id);
            await updateDoc(docRef, { ...values, updatedAt: serverTimestamp(), updatedBy: user.uid });
            toast({ title: 'Sukses', description: `Data rincian telah diperbarui.` });
        } else {
            const detailsCollectionRef = collection(firestore, 'apbdes', apbdesId, 'details');
            await addDoc(detailsCollectionRef, {
                ...values,
                apbdesId,
                village: village.toLowerCase(),
                year,
                createdAt: serverTimestamp(),
                createdBy: user.uid
            });
            toast({ title: 'Sukses', description: `Rincian baru telah ditambahkan.` });
        }

        await updateApbdesSummary();
        toast({ title: 'Ringkasan Diperbarui', description: `Total anggaran telah dihitung ulang.` });
        
        setIsFormOpen(false);

    } catch (e: any) {
        console.error("Error submitting form: ", e);
        toast({ variant: 'destructive', title: 'Gagal Menyimpan', description: 'Terjadi kesalahan saat menyimpan data.' });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleAddManualClick = () => {
    setFormMode('add');
    setSelectedDetail(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (detail: WithId<ApbdesDetail>) => {
    setFormMode('edit');
    setSelectedDetail(detail);
    setIsFormOpen(true);
  };


  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    setIsProcessing(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const json: any[] = XLSX.utils.sheet_to_json(worksheet);

      const expectedHeaders = ['Bidang', 'Kode Kegiatan', 'Kode', 'Nama Kegiatan', 'Anggaran', 'Sumber Dana'];
      const actualHeaders = Object.keys(json[0] || {});
      const hasAllHeaders = expectedHeaders.every(h => actualHeaders.includes(h));

      if (!hasAllHeaders) {
        throw new Error('Format file Excel tidak sesuai. Pastikan kolom Bidang, Kode Kegiatan, Kode, Nama Kegiatan, Anggaran, dan Sumber Dana ada.');
      }

      const entries: ApbdesEntry[] = json.map(row => ({
        Bidang: row['Bidang'],
        'Kode Kegiatan': row['Kode Kegiatan'],
        Kode: row['Kode'],
        'Nama Kegiatan': row['Nama Kegiatan'],
        Anggaran: row['Anggaran'],
        'Sumber Dana': row['Sumber Dana'],
      }));

      await handleSaveToFirestore(entries);

    } catch (error: any) {
      toast({ variant: "destructive", title: "Gagal Mengimpor", description: error.message });
    } finally {
      setIsProcessing(false);
      event.target.value = '';
    }
  };

  const handleSaveToFirestore = async (entries: ApbdesEntry[]) => {
    if (!firestore || !user) {
        toast({ variant: "destructive", title: "Error", description: "Firestore atau pengguna tidak tersedia." });
        return;
    };
    if (entries.length === 0) return;

    try {
        const batch = writeBatch(firestore);

        const detailsCollectionRef = collection(firestore, 'apbdes', apbdesId, 'details');
        const summaryDocRef = doc(firestore, 'apbdes', apbdesId);
        
        const existingDetailsSnapshot = await getDocs(detailsCollectionRef);
        const summaryDocSnap = await getDoc(summaryDocRef);

        existingDetailsSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        let totalRevenue = 0;
        let totalExpenditure = 0;
        const revenueSources: Record<string, number> = {};
        
        entries.forEach(entry => {
          const detailDocRef = doc(detailsCollectionRef); 
          const amount = typeof entry.Anggaran === 'string' ? parseFloat(entry.Anggaran.replace(/[^0-9,-]+/g,"").replace(',','.')) : entry.Anggaran;
          const cleanAmount = isNaN(amount) ? 0 : amount;

          batch.set(detailDocRef, {
            apbdesId,
            village: village.toLowerCase(),
            year,
            description: entry['Nama Kegiatan'],
            amount: cleanAmount,
            category: entry.Bidang,
            code: entry.Kode,
            activityCode: entry['Kode Kegiatan'],
            fundingSource: entry['Sumber Dana'],
            createdAt: serverTimestamp(),
            createdBy: user.uid,
          });

          if (String(entry.Bidang).toLowerCase().includes('pendapatan')) {
            totalRevenue += cleanAmount;
            const source = entry['Sumber Dana'] || 'Lainnya';
            revenueSources[source] = (revenueSources[source] || 0) + cleanAmount;
          } else if (String(entry.Bidang).toLowerCase().includes('belanja')) {
            totalExpenditure += cleanAmount;
          }
        });

        const payload = {
            revenue: totalRevenue,
            expenditure: totalExpenditure,
            financing: 0,
            revenueSources,
            updatedAt: serverTimestamp(),
            updatedBy: user.uid,
        };

        if (summaryDocSnap.exists()) {
            batch.update(summaryDocRef, payload);
        } else {
            batch.set(summaryDocRef, {
                id: apbdesId,
                year,
                village: village.toLowerCase(),
                ...payload,
                createdAt: serverTimestamp(),
                createdBy: user.uid,
            });
        }
        
        await batch.commit();

        toast({ title: "Sukses!", description: `Data APBDes untuk ${villageTitle} berhasil diimpor dan disimpan.` });

    } catch (serverError: any) {
        console.error("Firestore batch save error:", serverError);
        const contextualError = new FirestorePermissionError({
            path: `apbdes/${apbdesId} (and details)`,
            operation: 'write',
            requestResourceData: { detailsCount: entries.length, note: "Atomic batch import operation failed." }
        });
        errorEmitter.emit('permission-error', contextualError);
        toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Penyimpanan data gagal. Periksa izin akses Anda dan coba lagi." });
    }
  };

  const deleteAllData = async (showToast = true): Promise<void> => {
    if (!firestore) throw new Error("Firestore not initialized.");
    
    try {
        const detailsQuery = query(collection(firestore, 'apbdes', apbdesId, 'details'));
        const detailsSnapshot = await getDocs(detailsQuery);
        
        const batch = writeBatch(firestore);

        detailsSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        const summaryDocRef = doc(firestore, 'apbdes', apbdesId);
        batch.delete(summaryDocRef);

        await batch.commit();

        if (showToast) {
            toast({ title: "Berhasil", description: `Semua data APBDes untuk ${villageTitle} tahun ${year} telah dihapus.` });
        }
    } catch (serverError: any) {
        const contextualError = new FirestorePermissionError({
            path: `apbdes/${apbdesId}/*`,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', contextualError);
        throw serverError; 
    }
  };

  const handleDeleteAction = () => {
    setIsDeleting(true);
    deleteAllData(true)
      .catch(() => {
          toast({ variant: "destructive", title: "Gagal Menghapus", description: "Terjadi kesalahan saat menghapus data." });
      })
      .finally(() => {
          setIsDeleting(false);
          setIsDeleteAlertOpen(false);
      });
  }

  const handleDownloadExcel = () => {
    if (!sortedApbdesData || sortedApbdesData.length === 0) {
      toast({
        variant: "destructive",
        title: "Tidak ada data",
        description: "Tidak ada data untuk diunduh.",
      });
      return;
    }

    const dataToExport = sortedApbdesData.map(item => ({
      'Bidang': item.category,
      'Kode Kegiatan': item.activityCode,
      'Kode': item.code,
      'Nama Kegiatan': item.description,
      'Anggaran': item.amount,
      'Sumber Dana': item.fundingSource,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'APBDes');
    XLSX.writeFile(workbook, `APBDes_${villageTitle}_${year}.xlsx`);
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Manajemen APBDes: Desa {villageTitle}</h1>
          <p className="text-muted-foreground">Impor, lihat, dan kelola data Anggaran Pendapatan dan Belanja Desa.</p>
        </div>

        {apbdesData && apbdesData.length > 0 && !isLoadingData && (
          <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold font-headline">Ringkasan APBDes {year}</h2>
                <p className="text-muted-foreground">Total pendapatan, belanja, dan rincian per bidang.</p>
            </div>
            
            {summaryData.byFundingSource.size > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Rincian Pendapatan per Sumber Dana</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {Array.from(summaryData.byFundingSource.entries()).map(([source, total]) => (
                        <div key={source} className="flex flex-col justify-between rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground capitalize">{source}</p>
                            <p className="text-lg font-bold mt-1">{formatCurrency(total)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t mt-4 pt-4 flex justify-between items-center font-bold text-lg">
                        <span>Total Pendapatan</span>
                        <span>{formatCurrency(summaryData.totalRevenue)}</span>
                    </div>
                  </CardContent>
                </Card>
            )}

            {summaryData.expenditureByFundingSource.size > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Rincian Belanja per Sumber Dana</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {Array.from(summaryData.expenditureByFundingSource.entries()).map(([source, total]) => (
                        <div key={source} className="flex flex-col justify-between rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground capitalize">{source}</p>
                            <p className="text-lg font-bold mt-1">{formatCurrency(total)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
            )}

            {summaryData.expenditureByField.size > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Rincian Belanja per Bidang</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {Array.from(summaryData.expenditureByField.entries()).map(([field, total]) => (
                        <div key={field} className="flex flex-col justify-between rounded-lg border p-4">
                            <p className="text-sm text-muted-foreground capitalize">{field.toLowerCase()}</p>
                            <p className="text-lg font-bold mt-1">{formatCurrency(total)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t mt-4 pt-4 flex justify-between items-center font-bold text-lg">
                        <span>Total Belanja</span>
                        <span>{formatCurrency(summaryData.totalExpenditure)}</span>
                    </div>
                  </CardContent>
                </Card>
            )}
          </div>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Landmark className="h-6 w-6" />
                  <span>Data APBDes Tahun {year}</span>
                </CardTitle>
                <CardDescription>
                  Impor file Excel, input manual, atau lihat data yang sudah ada di bawah ini.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleAddManualClick}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Input Manual
                </Button>
                <Button asChild variant="outline">
                   <label htmlFor="excel-upload" className="cursor-pointer">
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    {isProcessing ? 'Memproses...' : 'Impor Excel'}
                   </label>
                </Button>
                <Input id="excel-upload" type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileChange} disabled={isProcessing}/>
                {apbdesData && apbdesData.length > 0 && (
                  <>
                    <Button variant="outline" onClick={handleDownloadExcel}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Excel
                    </Button>
                    <Button variant="destructive" onClick={() => setIsDeleteAlertOpen(true)} disabled={isDeleting}>
                        {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                        Hapus Semua Data
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aksi</TableHead>
                    <TableHead>Bidang</TableHead>
                    <TableHead>Kode Kegiatan</TableHead>
                    <TableHead>Kode</TableHead>
                    <TableHead>Nama Kegiatan</TableHead>
                    <TableHead>Anggaran</TableHead>
                    <TableHead>Sumber Dana</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingData && (
                     <TableRow><TableCell colSpan={7} className="text-center h-24"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>
                  )}
                  {!isLoadingData && sortedApbdesData && sortedApbdesData.length > 0 ? (
                    sortedApbdesData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEditClick(item)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.activityCode}</TableCell>
                        <TableCell>{item.code}</TableCell>
                        <TableCell className="font-medium">{item.description}</TableCell>
                        <TableCell>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.amount)}</TableCell>
                        <TableCell>{item.fundingSource}</TableCell>
                      </TableRow>
                    ))
                  ) : !isLoadingData && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-24">
                        Belum ada data APBDes untuk tahun ini. Silakan impor file Excel atau input manual.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{formMode === 'add' ? 'Input Rincian APBDes' : 'Edit Rincian APBDes'}</DialogTitle>
            <DialogDescription>
              {formMode === 'add' ? 'Isi formulir di bawah ini untuk menambahkan rincian baru.' : `Mengedit: ${selectedDetail?.description}`}
            </DialogDescription>
          </DialogHeader>
          <ApbdesForm 
            detail={selectedDetail}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>


      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus **semua** data APBDes untuk Desa {villageTitle} tahun {year} secara permanen. Tindakan ini tidak dapat diurungkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAction} disabled={isDeleting} className={cn(buttonVariants({ variant: "destructive" }))}>
             {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus Semua
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

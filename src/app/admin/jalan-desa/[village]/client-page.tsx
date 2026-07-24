'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
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
import { type JalanDesa, jalanDesaData } from '@/lib/jalan-desa-data';
import { Pencil, Map, Trash2, PlusCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { JalanDesaForm } from '@/components/jalan-desa/jalan-desa-form';
import { cn } from '@/lib/utils';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, writeBatch } from 'firebase/firestore';


function capitalizeFirstLetter(string: string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function JalanDesaClientPage({ village }: { village: string }) {
  const villageTitle = capitalizeFirstLetter(village);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const villageKey = village.toLowerCase();

  const jalanDesaQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'jalanDesa'), where('village', '==', villageKey));
  }, [firestore, villageKey]);

  const { data: jalanList, isLoading: isLoadingData } = useCollection<JalanDesa>(jalanDesaQuery);

  const [selectedJalan, setSelectedJalan] = useState<JalanDesa | null>(null);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const [jalanToDelete, setJalanToDelete] = useState<JalanDesa | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const totals = useMemo(() => {
    if (!jalanList) return { totalPanjang: 0, totalRusak: 0 };
    const totalPanjang = jalanList.reduce((acc, jalan) => acc + (Number(jalan.panjang) || 0), 0);
    const totalRusak = jalanList.reduce((acc, jalan) => acc + (Number(jalan.rusakRingan) || 0) + (Number(jalan.rusakBerat) || 0), 0);
    return { totalPanjang, totalRusak };
  }, [jalanList]);

  const handleSeedData = async () => {
    if (!firestore || !user) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Anda harus login untuk memasukkan data awal.',
        });
        return;
    }
    
    const dataToSeed = jalanDesaData[villageKey];
    if (!dataToSeed || dataToSeed.length === 0) {
        toast({
            variant: 'destructive',
            title: 'Data Awal Tidak Ditemukan',
            description: `Tidak ada data jalan untuk desa ${villageTitle} di file sumber.`,
        });
        return;
    }

    setIsSeeding(true);

    try {
        const batch = writeBatch(firestore);
        const collectionRef = collection(firestore, 'jalanDesa');

        dataToSeed.forEach((jalan) => {
            const docRef = doc(collectionRef); // auto-generate ID
            const { id, ...restOfJalan } = jalan;
            const newJalanData = {
                ...restOfJalan,
                village: villageKey,
                createdAt: serverTimestamp(),
                createdBy: user.uid,
            };
            batch.set(docRef, newJalanData);
        });

        await batch.commit();

        toast({
            title: 'Sukses!',
            description: `Data jalan untuk desa ${villageTitle} berhasil dimasukkan ke database.`,
        });

    } catch (error) {
        console.error("Error seeding data:", error);
        toast({
            variant: 'destructive',
            title: 'Gagal Memasukkan Data',
            description: 'Terjadi kesalahan saat menyimpan data awal ke database.',
        });
    } finally {
        setIsSeeding(false);
    }
  };

  const handleEditClick = (jalan: JalanDesa) => {
    setSelectedJalan(jalan);
    setDialogMode('edit');
  };
  
  const handleAddClick = () => {
    setSelectedJalan(null);
    setDialogMode('add');
  };

  const handleDeleteClick = (jalan: JalanDesa) => {
    setJalanToDelete(jalan);
    setDialogMode(null); // Close edit dialog
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!jalanToDelete || !firestore) return;
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(firestore, "jalanDesa", jalanToDelete.id));
      toast({
        title: 'Data Dihapus',
        description: `Data untuk jalan ${jalanToDelete.namaJalan} telah dihapus.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Gagal Menghapus',
        description: 'Terjadi kesalahan saat menghapus data.',
      });
      console.error(error);
    } finally {
      setIsDeleteAlertOpen(false);
      setJalanToDelete(null);
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (!firestore || !user) return;
    setIsSubmitting(true);
    try {
        if (dialogMode === 'edit' && selectedJalan) {
            const docRef = doc(firestore, "jalanDesa", selectedJalan.id);
            await updateDoc(docRef, { 
                ...data, 
                updatedAt: serverTimestamp(), 
                updatedBy: user.uid 
            });
            toast({
                title: 'Sukses',
                description: `Data untuk ${data.namaJalan} telah diperbarui.`,
            });
        } else if (dialogMode === 'add') {
            const maxNoUrut = jalanList && jalanList.length > 0 ? Math.max(...jalanList.map(j => j.noUrut)) : 0;
            const newJalanData = {
                ...data,
                village: villageKey,
                noUrut: maxNoUrut + 1,
                createdAt: serverTimestamp(),
                createdBy: user.uid,
            };
            await addDoc(collection(firestore, "jalanDesa"), newJalanData);
            toast({
                title: 'Sukses',
                description: `Data untuk ${newJalanData.namaJalan} telah ditambahkan.`,
            });
        }
    } catch (error) {
      console.error("Error saving jalan desa data:", error);
       toast({
            variant: 'destructive',
            title: 'Gagal',
            description: 'Gagal menyimpan data jalan.',
        });
    } finally {
        setIsSubmitting(false);
        setDialogMode(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Database Jalan Desa: {villageTitle}</h1>
          <p className="text-muted-foreground">Kelola data kondisi jalan untuk desa {villageTitle}.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Panjang Jalan</CardTitle>
                    <Map className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totals.totalPanjang.toLocaleString('id-ID')} M</div>
                    <p className="text-xs text-muted-foreground">Total panjang semua ruas jalan desa</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Kerusakan Jalan</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totals.totalRusak.toLocaleString('id-ID')} M</div>
                    <p className="text-xs text-muted-foreground">Total panjang jalan rusak ringan & berat</p>
                </CardContent>
            </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Map className="h-6 w-6" />
                        <span>Data Jalan Desa</span>
                    </CardTitle>
                    <CardDescription>
                        Klik tombol "Edit" untuk melihat detail lengkap dan mengedit kondisi jalan.
                    </CardDescription>
                </div>
                <Button onClick={handleAddClick}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah Jalan
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Jalan</TableHead>
                    <TableHead>Panjang (M)</TableHead>
                    <TableHead>Lebar (M)</TableHead>
                    <TableHead>Jenis Perkerasan</TableHead>
                    <TableHead>Kerusakan (M)</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingData && (
                     <TableRow><TableCell colSpan={7} className="text-center h-24"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>
                  )}
                  {!isLoadingData && jalanList && jalanList.length > 0 ? (
                    jalanList.map((jalan) => {
                      const kerusakan = (Number(jalan.rusakRingan) || 0) + (Number(jalan.rusakBerat) || 0);
                      return (
                      <TableRow key={jalan.id}>
                        <TableCell>{jalan.noUrut}</TableCell>
                        <TableCell className="font-medium">{jalan.namaJalan}</TableCell>
                        <TableCell>{jalan.panjang}</TableCell>
                        <TableCell>{jalan.lebar}</TableCell>
                        <TableCell>{jalan.jenisPerkerasan}</TableCell>
                         <TableCell className={kerusakan > 0 ? 'text-destructive font-medium' : ''}>
                            {kerusakan > 0 ? kerusakan.toLocaleString('id-ID') : '0'}
                          </TableCell>
                        <TableCell className="text-right">
                            <Button variant="outline" size="sm" onClick={() => handleEditClick(jalan)}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </Button>
                        </TableCell>
                      </TableRow>
                      )
                    })
                  ) : !isLoadingData && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-48 py-8">
                        <h3 className="font-semibold text-lg">Data Jalan Kosong</h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto mt-1">
                          Database jalan untuk desa ini masih kosong. Masukkan data awal dari file sumber untuk memulai.
                        </p>
                        <Button onClick={handleSeedData} disabled={isSeeding} className="mt-4">
                          {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                          {isSeeding ? 'Memproses...' : 'Masukkan Data Awal'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        <Dialog open={dialogMode !== null} onOpenChange={(isOpen) => !isOpen && setDialogMode(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-headline text-3xl font-bold">
                {dialogMode === 'edit' ? 'Edit Data Jalan' : 'Tambah Data Jalan Baru'}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === 'edit'
                  ? `Perbarui informasi untuk: ${selectedJalan?.namaJalan}`
                  : 'Isi formulir di bawah untuk menambahkan data jalan baru.'}
              </DialogDescription>
            </DialogHeader>
            <JalanDesaForm 
                jalan={selectedJalan}
                onSubmit={handleFormSubmit}
                onCancel={() => setDialogMode(null)}
                isLoading={isSubmitting}
                onDelete={selectedJalan ? () => handleDeleteClick(selectedJalan) : undefined}
            />
          </DialogContent>
        </Dialog>
      </div>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus data jalan untuk <span className="font-bold">{jalanToDelete?.namaJalan}</span> secara permanen. Tindakan ini tidak dapat diurungkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isSubmitting} className={cn(buttonVariants({ variant: "destructive" }))}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

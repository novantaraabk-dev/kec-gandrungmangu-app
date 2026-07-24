
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { ClipboardList, MoreHorizontal, Pencil, Trash2, PlusCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import type { P3keIntervention } from '@/lib/perangkat-data';
import { P3keForm } from '@/components/p3ke/p3ke-form';
import { vervalP3keData } from '@/lib/p3ke-verval-data';

function capitalizeFirstLetter(string: string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function P3keVillageClientPage({ village }: { village: string }) {
  const villageTitle = capitalizeFirstLetter(village);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const villageKey = village.toLowerCase();

  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | null>(null);
  const [selectedIntervention, setSelectedIntervention] = useState<P3keIntervention | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const p3keQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'p3keInterventions'), where('village', '==', villageKey));
  }, [firestore, villageKey]);
  const { data: interventions, isLoading } = useCollection<P3keIntervention>(p3keQuery);

  const villageVervalData = useMemo(() => {
    return vervalP3keData.find(d => d.desa.toLowerCase() === villageKey);
  }, [villageKey]);

  const handleAddClick = () => {
    setSelectedIntervention(null);
    setDialogMode('add');
  };

  const handleEditClick = (intervention: P3keIntervention) => {
    setSelectedIntervention(intervention);
    setDialogMode('edit');
  };

  const handleDeleteClick = (intervention: P3keIntervention) => {
    setSelectedIntervention(intervention);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedIntervention || !firestore) return;
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(firestore, "p3keInterventions", selectedIntervention.id));
      toast({
        title: "Sukses!",
        description: "Data intervensi P3KE telah dihapus.",
      });
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast({
        variant: "destructive",
        title: "Gagal Menghapus",
        description: "Terjadi kesalahan saat menghapus data.",
      });
    } finally {
      setIsDeleteAlertOpen(false);
      setSelectedIntervention(null);
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (values: any) => {
    if (!firestore || !user) return;
    setIsSubmitting(true);

    try {
      if (dialogMode === 'edit' && selectedIntervention) {
        const docRef = doc(firestore, "p3keInterventions", selectedIntervention.id);
        await updateDoc(docRef, {
          ...values,
          updatedAt: serverTimestamp(),
          updatedBy: user.uid,
        });
        toast({
          title: "Sukses!",
          description: "Data intervensi P3KE telah diperbarui.",
        });
      } else {
        await addDoc(collection(firestore, "p3keInterventions"), {
          ...values,
          village: villageKey,
          createdAt: serverTimestamp(),
          createdBy: user.uid,
        });
        toast({
          title: "Sukses!",
          description: "Data intervensi P3KE telah berhasil disimpan.",
        });
      }
      setDialogMode(null);
      setSelectedIntervention(null);
    } catch (error) {
      console.error("Error saving document: ", error);
      toast({
        variant: "destructive",
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan data ke server.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const vervalIndicators = villageVervalData ? [
      { label: 'KRT', value: villageVervalData.krt },
      { label: 'ART', value: villageVervalData.art },
      { label: 'Tidak Punya Jamban', value: villageVervalData.tidakPunyaJamban },
      { label: 'RTLH', value: villageVervalData.rtlh },
      { label: 'Tidak Punya Listrik', value: villageVervalData.tidakPunyaListrik },
      { label: 'Tidak Punya Sumber Air', value: villageVervalData.tidakPunyaSumberAir },
      { label: 'Anak Tidak Sekolah', value: villageVervalData.anakTidakSekolah },
      { label: 'Disabilitas', value: villageVervalData.disabilitas },
      { label: 'Tidak Bekerja', value: villageVervalData.tidakBekerja },
      { label: 'Resiko Stunting', value: villageVervalData.resikoStunting },
  ] : [];

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold font-headline">Data P3KE: Desa {villageTitle}</h1>
                <p className="text-muted-foreground">Kelola data Pensasaran Percepatan Penghapusan Kemiskinan Ekstrem untuk desa {villageTitle}.</p>
            </div>
             <Button onClick={handleAddClick}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Input Intervensi
            </Button>
        </div>

        {villageVervalData && (
          <Card>
            <CardHeader>
              <CardTitle>Verval P3KE</CardTitle>
              <CardDescription>Data verifikasi dan validasi Pensasaran Percepatan Penghapusan Kemiskinan Ekstrem.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {vervalIndicators.map(indicator => (
                        <TableHead key={indicator.label} className="text-center">{indicator.label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      {vervalIndicators.map(indicator => (
                        <TableCell key={indicator.label} className="text-center font-semibold text-lg">{indicator.value.toLocaleString('id-ID')}</TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-6 w-6" />
                <span>Daftar Intervensi P3KE</span>
            </CardTitle>
            <CardDescription>
                Data intervensi yang diinput oleh operator desa akan muncul di sini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Aksi</TableHead>
                    <TableHead>Jenis Intervensi</TableHead>
                    <TableHead>Penerima</TableHead>
                    <TableHead>Total Anggaran</TableHead>
                    <TableHead>Sumber Anggaran</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                      </TableCell>
                    </TableRow>
                  )}
                  {!isLoading && interventions && interventions.length > 0 ? interventions.map((item) => (
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
                                <DropdownMenuItem onClick={() => handleEditClick(item)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteClick(item)} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Hapus</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell className="font-medium">{item.jenisIntervensi}</TableCell>
                      <TableCell>{item.jumlahPenerima}</TableCell>
                      <TableCell>{item.totalAnggaran}</TableCell>
                      <TableCell>{item.sumberAnggaran}</TableCell>
                    </TableRow>
                  )) : !isLoading && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">
                        Belum ada data intervensi P3KE untuk desa ini.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogMode !== null} onOpenChange={(isOpen) => {
          if (!isOpen) {
              setDialogMode(null);
              setSelectedIntervention(null);
          }
      }}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{dialogMode === 'edit' ? 'Edit Intervensi P3KE' : 'Input Intervensi P3KE'}</DialogTitle>
                <DialogDescription>{dialogMode === 'edit' ? 'Perbarui data intervensi di bawah ini.' : 'Isi formulir untuk menambahkan data intervensi baru.'}</DialogDescription>
            </DialogHeader>
            <P3keForm 
                intervention={selectedIntervention}
                onSubmit={handleFormSubmit}
                onCancel={() => setDialogMode(null)}
                isLoading={isSubmitting}
            />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini akan menghapus data intervensi <span className="font-bold">{selectedIntervention?.jenisIntervensi}</span> secara permanen. Tindakan ini tidak dapat diurungkan.
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

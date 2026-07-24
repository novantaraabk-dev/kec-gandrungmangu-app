'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HeartPulse, Loader2, Search, Trash2, Pencil, MoreHorizontal } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { villages } from '@/lib/villages';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { JumlahBalita } from '@/lib/perangkat-data';
import { useToast } from '@/hooks/use-toast';
import { JumlahBalitaForm } from '@/components/kesehatan/jumlah-balita-form';

const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function capitalizeFirstLetter(string: string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function BalitaClientPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const [filterVillage, setFilterVillage] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [docToDelete, setDocToDelete] = useState<JumlahBalita | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  
  const [docToEdit, setDocToEdit] = useState<JumlahBalita | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const balitaCollection = useMemoFirebase(() => firestore ? collection(firestore, 'jumlahBalita') : null, [firestore]);
  const { data: allBalitaData, isLoading } = useCollection<JumlahBalita>(balitaCollection);

  const filteredData = useMemo(() => {
    if (!allBalitaData) return [];
    return allBalitaData
      .filter(doc => filterVillage === 'all' || doc.village.toLowerCase() === filterVillage.toLowerCase())
      .filter(doc => {
        const periode = `${months[Number(doc.bulan) - 1]} ${doc.tahun}`;
        return periode.toLowerCase().includes(searchTerm.toLowerCase());
      })
      .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
  }, [allBalitaData, filterVillage, searchTerm]);
  
  const handleDeleteClick = (doc: JumlahBalita) => {
    setDocToDelete(doc);
    setIsDeleteAlertOpen(true);
  };
  
  const handleEditClick = (doc: JumlahBalita) => {
    setDocToEdit(doc);
    setIsEditOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!docToDelete || !firestore) return;
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(firestore, 'jumlahBalita', docToDelete.id));
      toast({ title: 'Sukses', description: 'Data jumlah balita telah dihapus.' });
      setIsDeleteAlertOpen(false);
      setDocToDelete(null);
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Gagal Menghapus', description: 'Terjadi kesalahan saat menghapus data.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleFormSubmit = async (values: any) => {
    if (!docToEdit || !firestore || !user) return;
    setIsSubmitting(true);
    try {
        const docRef = doc(firestore, 'jumlahBalita', docToEdit.id);
        await updateDoc(docRef, { ...values, updatedAt: serverTimestamp(), updatedBy: user.uid });
        toast({ title: 'Sukses', description: 'Data jumlah balita berhasil diperbarui.'});
        setIsEditOpen(false);
        setDocToEdit(null);
    } catch (e:any) {
        toast({ variant: 'destructive', title: 'Gagal', description: 'Gagal memperbarui data.'});
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartPulse className="h-6 w-6" />
            <span>Daftar Data Jumlah Balita</span>
          </CardTitle>
          <CardDescription>
            Tinjau, cari, dan kelola semua data jumlah balita yang diunggah oleh operator desa.
          </CardDescription>
          <div className="flex items-center gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Cari periode (e.g., Januari 2024)..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterVillage} onValueChange={setFilterVillage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Desa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Desa</SelectItem>
                {villages.map(v => (
                  <SelectItem key={v} value={v.toLowerCase()}>{v}</SelectItem>
                ))}
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
                  <TableHead>Periode</TableHead>
                  <TableHead>Jumlah Laki-laki</TableHead>
                  <TableHead>Jumlah Perempuan</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    </TableCell>
                  </TableRow>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => handleEditClick(item)}><Pencil className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleDeleteClick(item)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4"/>Hapus</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell className="font-medium">{capitalizeFirstLetter(item.village)}</TableCell>
                      <TableCell>{months[Number(item.bulan) - 1]} {item.tahun}</TableCell>
                      <TableCell>{item.jumlahLakiLaki}</TableCell>
                      <TableCell>{item.jumlahPerempuan}</TableCell>
                      <TableCell>{item.jumlahLakiLaki + item.jumlahPerempuan}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      Tidak ada data jumlah balita yang ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Data Jumlah Balita</DialogTitle>
                <DialogDescription>Perbarui detail untuk {docToEdit?.village} periode {docToEdit && `${months[Number(docToEdit.bulan)-1]} ${docToEdit.tahun}`}.</DialogDescription>
            </DialogHeader>
            {docToEdit && <JumlahBalitaForm data={docToEdit} onSubmit={handleFormSubmit} onCancel={() => setIsEditOpen(false)} isLoading={isSubmitting}/>}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda Yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus data jumlah balita untuk periode <span className="font-bold">{docToDelete ? `${months[Number(docToDelete.bulan) - 1]} ${docToDelete.tahun}` : ''}</span> secara permanen. Data ini tidak dapat dipulihkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className={cn(buttonVariants({ variant: "destructive" }))} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

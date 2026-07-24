'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, Loader2, MoreHorizontal, Search, Trash2 } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { villages } from '@/lib/villages';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import type { SpjDocument } from '@/lib/perangkat-data';
import { useToast } from '@/hooks/use-toast';

const formatFirebaseTimestamp = (timestamp: Timestamp) => {
  if (!timestamp) return 'N/A';
  return format(timestamp.toDate(), 'd MMM yyyy, HH:mm');
};

function capitalizeFirstLetter(string: string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function SpjDesaClientPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const [filterVillage, setFilterVillage] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [docToDelete, setDocToDelete] = useState<SpjDocument | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const spjCollection = useMemoFirebase(() => firestore ? collection(firestore, 'spjDocuments') : null, [firestore]);
  const { data: allSpjDocuments, isLoading } = useCollection<SpjDocument>(spjCollection);

  const filteredSpjDocuments = useMemo(() => {
    if (!allSpjDocuments) return [];
    return allSpjDocuments
      .filter(doc => filterVillage === 'all' || doc.village.toLowerCase() === filterVillage.toLowerCase())
      .filter(doc => 
        doc.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.sourceOfFunds.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.month.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
  }, [allSpjDocuments, filterVillage, searchTerm]);
  
  const handleDeleteClick = (doc: SpjDocument) => {
    setDocToDelete(doc);
    setIsDeleteAlertOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!docToDelete || !firestore) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(firestore, 'spjDocuments', docToDelete.id));
      toast({ title: 'Sukses', description: 'Dokumen SPJ telah dihapus.' });
      setIsDeleteAlertOpen(false);
      setDocToDelete(null);
    } catch(e: any) {
      toast({ variant: 'destructive', title: 'Gagal Menghapus', description: 'Terjadi kesalahan saat menghapus data.' });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Dokumen SPJ Desa</h1>
          <p className="text-muted-foreground">Kelola dan tinjau semua dokumen SPJ dari seluruh desa.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              <span>Daftar SPJ Terunggah</span>
            </CardTitle>
            <CardDescription>
              Tinjau, cari, dan kelola semua SPJ yang diunggah oleh operator desa.
            </CardDescription>
            <div className="flex items-center gap-4 pt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari kegiatan, bidang, sumber dana..." 
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
                    <TableHead>Bulan</TableHead>
                    <TableHead>Kegiatan</TableHead>
                    <TableHead>Sumber Dana</TableHead>
                    <TableHead>Tanggal Upload</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                      </TableCell>
                    </TableRow>
                  ) : filteredSpjDocuments.length > 0 ? (
                    filteredSpjDocuments.map((item) => (
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
                                <DropdownMenuItem asChild>
                                  <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                                    <FileText className="mr-2 h-4 w-4" />
                                    <span>Lihat File</span>
                                  </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteClick(item)} className="text-destructive cursor-pointer">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Hapus</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                        <TableCell className="font-medium">{capitalizeFirstLetter(item.village)}</TableCell>
                        <TableCell>{capitalizeFirstLetter(item.month)}</TableCell>
                        <TableCell>
                            <div className="font-medium">{item.activity}</div>
                            <div className="text-xs text-muted-foreground">{item.field}</div>
                        </TableCell>
                        <TableCell><Badge variant="secondary">{item.sourceOfFunds}</Badge></TableCell>
                        <TableCell>{formatFirebaseTimestamp(item.createdAt)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        Tidak ada dokumen SPJ yang ditemukan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda Yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus dokumen SPJ untuk kegiatan <span className="font-bold">{docToDelete?.activity}</span> secara permanen. Data ini tidak dapat dipulihkan.
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

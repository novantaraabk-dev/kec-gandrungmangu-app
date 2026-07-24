'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BookText, FileText, Loader2, MoreHorizontal, Search, Trash2 } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { villages } from '@/lib/villages';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import type { RegulationDocument } from '@/lib/perangkat-data';
import { useToast } from '@/hooks/use-toast';

const formatFirebaseTimestamp = (timestamp: Timestamp) => {
  if (!timestamp) return 'N/A';
  return format(timestamp.toDate(), 'd MMM yyyy, HH:mm');
};

function capitalizeFirstLetter(string: string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function ProdukHukumClientPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const [filterVillage, setFilterVillage] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [docToDelete, setDocToDelete] = useState<RegulationDocument | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const regulationsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'regulations') : null, [firestore]);
  const { data: allRegulations, isLoading } = useCollection<RegulationDocument>(regulationsCollection);

  const filteredRegulations = useMemo(() => {
    if (!allRegulations) return [];
    return allRegulations
      .filter(doc => filterVillage === 'all' || doc.village.toLowerCase() === filterVillage.toLowerCase())
      .filter(doc => filterType === 'all' || doc.type === filterType)
      .filter(doc => 
        doc.about.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
  }, [allRegulations, filterVillage, filterType, searchTerm]);
  
  const handleDeleteClick = (doc: RegulationDocument) => {
    setDocToDelete(doc);
    setIsDeleteAlertOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!docToDelete || !firestore) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(firestore, 'regulations', docToDelete.id));
      toast({ title: 'Sukses', description: 'Produk hukum telah dihapus.' });
      setIsDeleteAlertOpen(false);
      setDocToDelete(null);
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Gagal Menghapus', description: 'Terjadi kesalahan saat menghapus data.' });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Produk Hukum Desa</h1>
          <p className="text-muted-foreground">Kelola dan tinjau semua dokumen Perdes, Perkades, dan SK dari seluruh desa.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookText className="h-6 w-6" />
              <span>Daftar Regulasi Terunggah</span>
            </CardTitle>
            <CardDescription>
              Tinjau, cari, dan kelola semua produk hukum yang diunggah oleh operator desa.
            </CardDescription>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari perihal, nomor, atau jenis regulasi..." 
                  className="pl-10" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterVillage} onValueChange={setFilterVillage}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter Desa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Desa</SelectItem>
                  {villages.map(v => (
                    <SelectItem key={v} value={v.toLowerCase()}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter Jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis</SelectItem>
                  <SelectItem value="Perdes">Perdes</SelectItem>
                  <SelectItem value="Perkades">Perkades</SelectItem>
                  <SelectItem value="SK">SK</SelectItem>
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
                    <TableHead>Jenis</TableHead>
                    <TableHead>Perihal</TableHead>
                    <TableHead>Nomor Dokumen</TableHead>
                    <TableHead>Tanggal Upload</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                      </TableCell>
                    </TableRow>
                  ) : filteredRegulations.length > 0 ? (
                    filteredRegulations.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{capitalizeFirstLetter(item.village)}</TableCell>
                        <TableCell><Badge variant="secondary">{item.type}</Badge></TableCell>
                        <TableCell>{item.about}</TableCell>
                        <TableCell>{item.number}</TableCell>
                        <TableCell>{formatFirebaseTimestamp(item.createdAt)}</TableCell>
                        <TableCell className="text-right">
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
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        Tidak ada dokumen yang ditemukan.
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
              Tindakan ini akan menghapus dokumen <span className="font-bold">{docToDelete?.about}</span> secara permanen. Data ini tidak dapat dipulihkan.
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

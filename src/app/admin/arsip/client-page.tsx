'use client';

import { useState, useMemo, type ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, deleteDoc, type Timestamp } from 'firebase/firestore';
import { useAppSettings } from '@/lib/app-settings';
import type { ArsipDokumen } from '@/lib/perangkat-data';
import { Archive, Upload, Loader2, FileText, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
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
import { cn } from '@/lib/utils';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwC7P8gr8O5zxcUzeKOFoS2uxZ_Zhw5P_S-EoSFzFVELKRpIxq6gsIfqW_UNoKKhB2Agw/exec';

const docCategories = ["PM", "TAPEM", "TRANTIBUM", "KESRA", "UMUM & PELAYANAN", "PKA"];
const docTypes = ["Surat Edaran", "SK", "Perbub", "Perda", "Lainnya"];

const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const formatFirebaseTimestamp = (timestamp: Timestamp) => {
  if (!timestamp) return 'N/A';
  return format(timestamp.toDate(), 'd MMM yyyy, HH:mm');
};

export default function ArsipClientPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const { arsipDriveFolderIds } = useAppSettings();

  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [customType, setCustomType] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [docToDelete, setDocToDelete] = useState<ArsipDokumen | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const arsipCollection = useMemoFirebase(() => firestore ? collection(firestore, 'arsipDokumen') : null, [firestore]);
  const { data: documents, isLoading } = useCollection<ArsipDokumen>(arsipCollection);
  
  const sortedDocuments = useMemo(() => {
    if (!documents) return [];
    return [...documents].sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
  }, [documents]);

  const handleFileUpload = async (file: File, folderId: string, desiredFileName: string) => {
    if (!file || !folderId || !desiredFileName) {
        throw new Error("Data tidak lengkap untuk unggah file.");
    }
    const base64File = await toBase64(file);
    if (!base64File || typeof base64File !== 'string') {
        throw new Error("Gagal mengubah file menjadi format base64.");
    }

    const payload = {
        fileData: base64File,
        fileName: desiredFileName,
        fileType: file.type || 'application/octet-stream',
        folderId: folderId
    };

    try {
        const res = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            redirect: "follow",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Respons error dari server:", errorText);
            throw new Error(`Gagal mengunggah file. Server merespons dengan status ${res.status}. Pesan: ${errorText}`);
        }

        const result = await res.json();
        if (result.status !== 'SUCCESS') {
            throw new Error(`Kesalahan Skrip Google Apps: ${result.message}. ${result.stack ? 'Stack: ' + result.stack : ''}`);
        }
        return result.fileUrl;
    } catch (error) {
        console.error("Error saat fetch ke Apps Script:", error);
        throw new Error('Gagal menghubungi server unggahan. Periksa koneksi internet dan coba lagi.');
    }
  };

  const resetForm = () => {
    setCategory('');
    setType('');
    setCustomType('');
    setTitle('');
    setFile(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async () => {
    const finalType = type === 'Lainnya' ? customType : type;
    if (!category || !finalType || !title || !file) {
      toast({ variant: "destructive", title: "Data Tidak Lengkap", description: "Harap isi semua kolom yang wajib diisi dan pilih file." });
      return;
    }
    
    const folderId = arsipDriveFolderIds?.[category as keyof typeof arsipDriveFolderIds];
    if (!folderId) {
      toast({ variant: "destructive", title: "Folder Drive Belum Diatur", description: `ID Folder untuk kategori "${category}" belum diatur di halaman Pengaturan Aplikasi.` });
      return;
    }

    if (!user || !firestore) {
        toast({ variant: "destructive", title: "Error", description: "Pengguna tidak terautentikasi." });
        return;
    }

    setIsUploading(true);
    try {
      const extension = file.name.split('.').pop() || 'pdf';
      const desiredFileName = `[${category}] ${title}.${extension}`;
      const fileUrl = await handleFileUpload(file, folderId, desiredFileName);

      await addDoc(collection(firestore, 'arsipDokumen'), {
        category,
        type: finalType,
        title,
        fileUrl,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
      });

      toast({ title: "Sukses!", description: "Dokumen berhasil diarsipkan." });
      resetForm();
    } catch (error: any) {
      console.error(error);
      toast({ variant: "destructive", title: "Gagal Mengunggah", description: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteClick = (doc: ArsipDokumen) => {
    setDocToDelete(doc);
    setIsDeleteAlertOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!docToDelete || !firestore) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(firestore, 'arsipDokumen', docToDelete.id));
      toast({ title: "Sukses!", description: `Dokumen "${docToDelete.title}" telah dihapus.` });
    } catch (e: any) {
      console.error("Error deleting document:", e);
      toast({ variant: "destructive", title: "Gagal Menghapus", description: "Terjadi kesalahan saat menghapus dokumen." });
    } finally {
      setIsDeleting(false);
      setIsDeleteAlertOpen(false);
      setDocToDelete(null);
    }
  };

  const categoryColors: Record<string, string> = {
    "PM": "data-[state=active]:bg-chart-1 data-[state=active]:text-primary-foreground",
    "TAPEM": "data-[state=active]:bg-chart-2 data-[state=active]:text-primary-foreground",
    "TRANTIBUM": "data-[state=active]:bg-chart-3 data-[state=active]:text-primary-foreground",
    "KESRA": "data-[state=active]:bg-chart-4 data-[state=active]:text-primary-foreground",
    "UMUM & PELAYANAN": "data-[state=active]:bg-chart-5 data-[state=active]:text-primary-foreground",
    "PKA": "data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground",
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Arsip Dokumen Penting</h1>
          <p className="text-muted-foreground">Kelola arsip dokumen untuk PM, TAPEM, TRANTIBUM, KESRA, UMUM & PELAYANAN, dan PKA.</p>
        </div>

        <Card>
          <CardHeader><CardTitle>Upload Dokumen Baru</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category"><SelectValue placeholder="Pilih Kategori..." /></SelectTrigger>
                  <SelectContent>{docCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Jenis Dokumen</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="type"><SelectValue placeholder="Pilih Jenis..." /></SelectTrigger>
                  <SelectContent>{docTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {type === 'Lainnya' && (
                <div className="space-y-2">
                  <Label htmlFor="customType">Sebutkan Jenis Lainnya</Label>
                  <Input id="customType" placeholder="Jenis dokumen" value={customType} onChange={(e) => setCustomType(e.target.value)} />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Judul / Perihal Dokumen</Label>
              <Input id="title" placeholder="Masukkan judul atau perihal dokumen" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file-upload">File Dokumen</Label>
              <Input id="file-upload" type="file" className="cursor-pointer" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
            <Button onClick={handleSubmit} disabled={isUploading}>
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              {isUploading ? 'Mengunggah...' : 'Upload & Arsipkan'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Arsip Dokumen</CardTitle>
            <CardDescription>Dokumen yang telah diarsipkan akan muncul di sini, dikelompokkan per kategori.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="flex justify-center items-center h-24">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <Tabs defaultValue={docCategories[0]} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
                        {docCategories.map((category) => (
                            <TabsTrigger 
                              key={category} 
                              value={category}
                              className={cn(
                                "font-bold",
                                categoryColors[category as keyof typeof categoryColors]
                              )}
                            >
                              {category}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {docCategories.map((category) => {
                        const categoryDocs = sortedDocuments.filter(doc => doc.category === category);
                        return (
                            <TabsContent key={category} value={category} className="mt-4">
                                <div className="overflow-x-auto rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Aksi</TableHead>
                                                <TableHead>Jenis</TableHead>
                                                <TableHead>Judul Dokumen</TableHead>
                                                <TableHead>Tanggal Upload</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {categoryDocs.length > 0 ? (
                                                categoryDocs.map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="space-x-2">
                                                            <Button asChild variant="outline" size="icon" className="h-8 w-8">
                                                              <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                                                                  <FileText className="h-4 w-4" />
                                                              </a>
                                                            </Button>
                                                            <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDeleteClick(item)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell>{item.type}</TableCell>
                                                        <TableCell className="font-medium">{item.title}</TableCell>
                                                        <TableCell>{formatFirebaseTimestamp(item.createdAt)}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center h-24">Belum ada dokumen untuk kategori ini.</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                        )
                    })}
                </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda Yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus dokumen <span className="font-bold">{docToDelete?.title}</span> secara permanen.
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

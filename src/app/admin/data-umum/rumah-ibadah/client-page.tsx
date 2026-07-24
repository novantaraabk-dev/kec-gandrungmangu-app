'use client';

import { useState, useMemo, ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { defaultRumahIbadahData, type RumahIbadah } from '@/lib/rumah-ibadah-data';
import { villages } from '@/lib/villages';
import { 
  University, 
  PlusCircle, 
  Upload, 
  Loader2, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Download, 
  FileSpreadsheet,
  RefreshCw,
  Search,
  Church,
  Home
} from 'lucide-react';
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
import { RumahIbadahForm } from '@/components/data-umum/rumah-ibadah-form';

function capitalizeFirstLetter(string: string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export default function RumahIbadahClientPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Firestore Collection
  const rumahIbadahCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'rumahIbadah') : null),
    [firestore]
  );
  const { data: firestoreData, isLoading } = useCollection<RumahIbadah>(rumahIbadahCollection);

  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | null>(null);
  const [selectedItem, setSelectedItem] = useState<RumahIbadah | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isDeleteAllAlertOpen, setIsDeleteAllAlertOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Combined Data (Firestore Collection Data)
  const displayData: RumahIbadah[] = useMemo(() => {
    if (!firestoreData) return [];
    return firestoreData.map((d, i) => ({
      ...d,
      no: i + 1,
      total: (Number(d.masjid) || 0) + 
             (Number(d.mushola) || 0) + 
             (Number(d.gerejaProtestan) || 0) + 
             (Number(d.gerejaKatolik) || 0) + 
             (Number(d.wihara) || 0) + 
             (Number(d.pura) || 0) + 
             (Number(d.sanggar) || 0) + 
             (Number(d.lainnya) || 0)
    }));
  }, [firestoreData]);

  // Filtered by Search
  const filteredData = useMemo(() => {
    if (!searchQuery) return displayData;
    const q = searchQuery.toLowerCase();
    return displayData.filter(item => item.village.toLowerCase().includes(q));
  }, [displayData, searchQuery]);

  // Calculate Totals
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, curr) => {
        acc.masjid += Number(curr.masjid) || 0;
        acc.mushola += Number(curr.mushola) || 0;
        acc.gerejaProtestan += Number(curr.gerejaProtestan) || 0;
        acc.gerejaKatolik += Number(curr.gerejaKatolik) || 0;
        acc.wihara += Number(curr.wihara) || 0;
        acc.pura += Number(curr.pura) || 0;
        acc.sanggar += Number(curr.sanggar) || 0;
        acc.lainnya += Number(curr.lainnya) || 0;
        acc.total += curr.total || 0;
        return acc;
      },
      { masjid: 0, mushola: 0, gerejaProtestan: 0, gerejaKatolik: 0, wihara: 0, pura: 0, sanggar: 0, lainnya: 0, total: 0 }
    );
  }, [filteredData]);

  // Download Sample Excel Format (Columns: No | Nama Desa | Masjid | Mushola | Gereja protestan | Gereja katolik | Wihara | Pura | Sanggar | Lainnya)
  const handleDownloadTemplate = () => {
    const formattedData = defaultRumahIbadahData.map((item, index) => ({
      'No': index + 1,
      'Nama Desa': item.village,
      'Masjid': item.masjid,
      'Mushola': item.mushola,
      'Gereja protestan': item.gerejaProtestan,
      'Gereja katolik': item.gerejaKatolik,
      'Wihara': item.wihara,
      'Pura': item.pura,
      'Sanggar': item.sanggar,
      'Lainnya': item.lainnya,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rumah Ibadah');
    XLSX.writeFile(workbook, 'Format_Impor_Rumah_Ibadah.xlsx');

    toast({
      title: 'Format Berhasil Diunduh!',
      description: 'Gunakan file ini untuk diisi dan diimpor kembali ke sistem.',
    });
  };

  // Export Current Data to Excel
  const handleExportCurrentData = () => {
    const formattedData = filteredData.map((item, index) => ({
      'No': index + 1,
      'Nama Desa': item.village.toUpperCase(),
      'Masjid': item.masjid,
      'Mushola': item.mushola,
      'Gereja protestan': item.gerejaProtestan,
      'Gereja katolik': item.gerejaKatolik,
      'Wihara': item.wihara,
      'Pura': item.pura,
      'Sanggar': item.sanggar,
      'Lainnya': item.lainnya,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Rumah Ibadah');
    XLSX.writeFile(workbook, 'Data_Rumah_Ibadah_Kecamatan_Gandrungmangu.xlsx');

    toast({
      title: 'Data Berhasil Diekspor!',
      description: `Menyimpan ${filteredData.length} baris data desa ke file Excel.`,
    });
  };

  // Import Excel File (Format: No | Nama Desa | Masjid | Mushola | Gereja protestan | Gereja katolik | Wihara | Pura | Sanggar | Lainnya)
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !firestore) return;

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const bstr = e.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData = XLSX.utils.sheet_to_json<any>(ws);

        if (rawData.length === 0) {
          toast({ variant: 'destructive', title: 'File Kosong', description: 'Tidak ada data ditemukan dalam file.' });
          setIsProcessing(false);
          return;
        }

        const batch = writeBatch(firestore);

        rawData.forEach((row, index) => {
          // Normalize Keys (Flexible matching for case variations)
          const getVal = (possibleKeys: string[]) => {
            for (const key of possibleKeys) {
              const matchingKey = Object.keys(row).find(
                k => k.trim().toLowerCase() === key.toLowerCase()
              );
              if (matchingKey && row[matchingKey] !== undefined) {
                return Number(row[matchingKey]) || 0;
              }
            }
            return 0;
          };

          const desaName = row['Nama Desa'] || row['NAMA DESA'] || row['Desa'] || row['DESA'] || `DESA ${index + 1}`;
          const villageUpper = String(desaName).trim().toUpperCase();

          const docRef = doc(collection(firestore, 'rumahIbadah'));
          const payload: RumahIbadah = {
            village: villageUpper,
            masjid: getVal(['Masjid', 'MASJID']),
            mushola: getVal(['Mushola', 'MUSHOLA', 'Musola', 'MUSOLA']),
            gerejaProtestan: getVal(['Gereja protestan', 'Gereja Protestan', 'GEREJA PROTESTAN', 'Protestan']),
            gerejaKatolik: getVal(['Gereja katolik', 'Gereja Katolik', 'GEREJA KATOLIK', 'Katolik']),
            wihara: getVal(['Wihara', 'WIHARA', 'Vihara', 'VIHARA']),
            pura: getVal(['Pura', 'PURA']),
            sanggar: getVal(['Sanggar', 'SANGGAR']),
            lainnya: getVal(['Lainnya', 'LAINNYA', 'Lain-Lain', 'Lain Lain']),
          };

          batch.set(docRef, payload);
        });

        await batch.commit();

        toast({
          title: 'Sukses Impor Excel!',
          description: `${rawData.length} baris data rumah ibadah berhasil diimpor ke sistem.`,
        });
      } catch (err: any) {
        console.error('Error importing excel:', err);
        toast({
          variant: 'destructive',
          title: 'Gagal Impor Excel',
          description: err.message || 'Format file tidak sesuai.',
        });
      } finally {
        setIsProcessing(false);
        event.target.value = '';
      }
    };

    reader.readAsBinaryString(file);
  };

  // Seed Default 14-Village Data to Firestore
  const handleSeedDefaultData = async () => {
    if (!firestore) return;
    setIsProcessing(true);
    try {
      const batch = writeBatch(firestore);
      defaultRumahIbadahData.forEach((item) => {
        const docRef = doc(collection(firestore, 'rumahIbadah'));
        batch.set(docRef, {
          village: item.village.toUpperCase(),
          masjid: item.masjid,
          mushola: item.mushola,
          gerejaProtestan: item.gerejaProtestan,
          gerejaKatolik: item.gerejaKatolik,
          wihara: item.wihara,
          pura: item.pura,
          sanggar: item.sanggar,
          lainnya: item.lainnya,
        });
      });
      await batch.commit();
      toast({
        title: 'Inisialisasi Berhasil!',
        description: 'Data default rumah ibadah 14 Desa berhasil disimpan ke Firestore.',
      });
    } catch (err: any) {
      console.error('Error seeding default data:', err);
      toast({ variant: 'destructive', title: 'Gagal Inisialisasi', description: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  // Form Submit (Add / Edit)
  const handleFormSubmit = async (data: Omit<RumahIbadah, 'id'>) => {
    if (!firestore) return;
    setIsSubmitting(true);
    try {
      if (dialogMode === 'edit' && selectedItem?.id) {
        await updateDoc(doc(firestore, 'rumahIbadah', selectedItem.id), data);
        toast({ title: 'Sukses', description: 'Data rumah ibadah berhasil diperbarui.' });
      } else {
        await addDoc(collection(firestore, 'rumahIbadah'), data);
        toast({ title: 'Sukses', description: 'Data rumah ibadah berhasil ditambahkan.' });
      }
      setDialogMode(null);
      setSelectedItem(null);
    } catch (err: any) {
      console.error('Submit error:', err);
      toast({ variant: 'destructive', title: 'Gagal', description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Single Record
  const confirmDelete = async () => {
    if (!selectedItem?.id || !firestore) return;
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(firestore, 'rumahIbadah', selectedItem.id));
      toast({ title: 'Sukses', description: 'Data berhasil dihapus.' });
      setIsDeleteAlertOpen(false);
      setSelectedItem(null);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Gagal', description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete All Records
  const confirmDeleteAll = async () => {
    if (!firestore || !firestoreData || firestoreData.length === 0) return;
    setIsSubmitting(true);
    try {
      const batch = writeBatch(firestore);
      firestoreData.forEach((item) => {
        if (item.id) {
          batch.delete(doc(firestore, 'rumahIbadah', item.id));
        }
      });
      await batch.commit();
      toast({
        title: 'Sukses Hapus Semua Data!',
        description: `${firestoreData.length} baris data rumah ibadah berhasil dihapus dari database.`,
      });
      setIsDeleteAllAlertOpen(false);
    } catch (err: any) {
      console.error('Error deleting all records:', err);
      toast({
        variant: 'destructive',
        title: 'Gagal Hapus Semua Data',
        description: err.message || 'Terjadi kesalahan saat menghapus data.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">
            <University className="w-3.5 h-3.5 text-indigo-600" />
            DATA UMUM KECAMATAN
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-headline text-slate-900 tracking-tight">
            Data Rumah Ibadah
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pengelolaan data tempat ibadah (Masjid, Mushola, Gereja, Wihara, Pura, Sanggar) per desa di Kecamatan Gandrungmangu.
          </p>
        </div>

        {/* TOP ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Download Sample Excel Format */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadTemplate}
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold text-xs"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Unduh Format Excel
          </Button>

          {/* Import Excel */}
          <Button
            asChild
            size="sm"
            variant="default"
            disabled={isProcessing}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-md"
          >
            <label>
              {isProcessing ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-1.5" />
              )}
              {isProcessing ? 'Mengimpor...' : 'Impor Excel'}
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isProcessing}
              />
            </label>
          </Button>

          {/* Export Current Data */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCurrentData}
            className="border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs"
          >
            <FileSpreadsheet className="w-4 h-4 mr-1.5 text-emerald-600" />
            Ekspor Data
          </Button>

          {/* Add Data Manually */}
          <Button
            size="sm"
            onClick={() => { setSelectedItem(null); setDialogMode('add'); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Tambah Manual
          </Button>

          {/* Delete All Data Button */}
          {firestoreData && firestoreData.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteAllAlertOpen(true)}
              disabled={isSubmitting}
              className="font-bold text-xs shadow-md"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Hapus Semua Data
            </Button>
          )}
        </div>
      </div>

      {/* METRIC SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-200 shadow-sm">
          <CardHeader className="p-3">
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Masjid</CardDescription>
            <CardTitle className="text-xl font-black text-slate-900 mt-1">{totals.masjid.toLocaleString('id-ID')}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-sky-50 to-white border-sky-200 shadow-sm">
          <CardHeader className="p-3">
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-sky-700">Mushola</CardDescription>
            <CardTitle className="text-xl font-black text-slate-900 mt-1">{totals.mushola.toLocaleString('id-ID')}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200 shadow-sm">
          <CardHeader className="p-3">
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Gereja (Prot. & Kat.)</CardDescription>
            <CardTitle className="text-xl font-black text-slate-900 mt-1">{(totals.gerejaProtestan + totals.gerejaKatolik).toLocaleString('id-ID')}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200 shadow-sm">
          <CardHeader className="p-3">
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Wihara / Pura / Sanggar</CardDescription>
            <CardTitle className="text-xl font-black text-slate-900 mt-1">{(totals.wihara + totals.pura + totals.sanggar).toLocaleString('id-ID')}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200 shadow-sm col-span-2 sm:col-span-4 lg:col-span-1">
          <CardHeader className="p-3">
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Total Bangunan</CardDescription>
            <CardTitle className="text-xl font-black text-indigo-700 mt-1">{totals.total.toLocaleString('id-ID')}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* TABLE CARD */}
      <Card className="border-slate-200 shadow-md">
        <CardHeader className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold font-headline">Tabel Rekapitulasi Rumah Ibadah 14 Desa</CardTitle>
            <CardDescription className="text-xs">
              Format Kolom: No | Nama Desa | Masjid | Mushola | Gereja protestan | Gereja katolik | Wihara | Pura | Sanggar | Lainnya
            </CardDescription>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Cari desa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="w-full text-xs">
              <TableHeader className="bg-slate-100 font-bold uppercase text-[10px] tracking-wider text-slate-700">
                <TableRow>
                  <TableHead className="w-12 text-center">No</TableHead>
                  <TableHead>Nama Desa</TableHead>
                  <TableHead className="text-right">Masjid</TableHead>
                  <TableHead className="text-right">Mushola</TableHead>
                  <TableHead className="text-right">Gereja protestan</TableHead>
                  <TableHead className="text-right">Gereja katolik</TableHead>
                  <TableHead className="text-right">Wihara</TableHead>
                  <TableHead className="text-right">Pura</TableHead>
                  <TableHead className="text-right">Sanggar</TableHead>
                  <TableHead className="text-right">Lainnya</TableHead>
                  <TableHead className="text-right font-black">Total</TableHead>
                  <TableHead className="w-16 text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-slate-100 font-medium">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8 text-slate-500">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
                      Memuat data rumah ibadah...
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-12 text-slate-500">
                      <div className="flex flex-col items-center justify-center space-y-3 max-w-md mx-auto">
                        <University className="w-10 h-10 text-slate-300 stroke-[1.5]" />
                        <p className="text-sm font-semibold text-slate-700">Belum ada data rumah ibadah tersimpan di database Firestore.</p>
                        <p className="text-xs text-slate-400">Silakan impor file Excel atau lakukan inisialisasi data default 14 desa.</p>
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                          <Button
                            asChild
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow cursor-pointer"
                          >
                            <label>
                              <Upload className="w-4 h-4 mr-1.5" />
                              Impor Dari Excel
                              <input
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                className="hidden"
                                onChange={handleFileUpload}
                                disabled={isProcessing}
                              />
                            </label>
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleSeedDefaultData}
                            disabled={isProcessing}
                            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold text-xs"
                          >
                            {isProcessing ? (
                              <Loader2 className="w-4 h-4 mr-1.5 animate-spin text-indigo-600" />
                            ) : (
                              <RefreshCw className="w-4 h-4 mr-1.5 text-indigo-600" />
                            )}
                            Inisialisasi Data Default 14 Desa
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item, index) => (
                    <TableRow key={item.id || item.village} className="hover:bg-indigo-50/50 transition-colors">
                      <TableCell className="text-center font-mono font-bold text-slate-400">{index + 1}</TableCell>
                      <TableCell className="font-extrabold text-slate-900 font-headline">{item.village.toUpperCase()}</TableCell>
                      <TableCell className="text-right font-bold text-indigo-700">{(item.masjid || 0).toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-right font-bold text-sky-700">{(item.mushola || 0).toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-right text-blue-700">{(item.gerejaProtestan || 0).toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-right text-indigo-600">{(item.gerejaKatolik || 0).toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-right text-amber-700">{(item.wihara || 0).toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-right text-orange-700">{(item.pura || 0).toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-right text-purple-700">{(item.sanggar || 0).toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-right text-slate-600">{(item.lainnya || 0).toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-right font-black text-slate-900">{(item.total || 0).toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setSelectedItem(item); setDialogMode('edit'); }}>
                              <Pencil className="mr-2 h-4 w-4 text-indigo-600" />
                              Edit
                            </DropdownMenuItem>
                            {item.id && (
                              <DropdownMenuItem onClick={() => { setSelectedItem(item); setIsDeleteAlertOpen(true); }} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>

              {/* TOTAL ROW FOOTER */}
              {filteredData.length > 0 && (
                <tfoot className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
                  <TableRow>
                    <TableCell colSpan={2} className="text-left uppercase tracking-wider py-3">TOTAL KECAMATAN</TableCell>
                    <TableCell className="text-right text-indigo-800">{totals.masjid.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right text-sky-800">{totals.mushola.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right text-blue-800">{totals.gerejaProtestan.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right text-indigo-800">{totals.gerejaKatolik.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right text-amber-800">{totals.wihara.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right text-orange-800">{totals.pura.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right text-purple-800">{totals.sanggar.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right text-slate-700">{totals.lainnya.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right text-indigo-900 font-black">{totals.total.toLocaleString('id-ID')}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </tfoot>
              )}
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ADD / EDIT DIALOG */}
      <Dialog open={dialogMode !== null} onOpenChange={(open) => { if (!open) setDialogMode(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'edit' ? 'Edit Data Rumah Ibadah Desa' : 'Tambah Data Rumah Ibadah Desa'}</DialogTitle>
            <DialogDescription>Isi jumlah rumah ibadah untuk desa yang dipilih.</DialogDescription>
          </DialogHeader>
          <RumahIbadahForm
            initialData={selectedItem}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* DELETE ALERT DIALOG */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Rumah Ibadah Desa?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data rumah ibadah desa <strong className="text-slate-900">{selectedItem?.village}</strong>? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white font-bold">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* DELETE ALL CONFIRMATION ALERT DIALOG */}
      <AlertDialog open={isDeleteAllAlertOpen} onOpenChange={setIsDeleteAllAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Hapus Seluruh Data Rumah Ibadah?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus seluruh data (<strong className="text-slate-900">{firestoreData?.length || 0} baris desa</strong>) dari database? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAll} className="bg-red-600 hover:bg-red-700 text-white font-bold">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              Ya, Hapus Seluruh Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

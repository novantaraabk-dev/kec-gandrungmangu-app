
'use client';

import { useState, useMemo, ChangeEvent } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { villages } from '@/lib/villages';
import { useFirestore, useUser, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, doc, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import type { ApbdesDetail, Monev } from '@/lib/perangkat-data';
import { ClipboardCheck, Edit, Loader2, Trash2, Printer, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
  switch (status) {
    case 'SPJ Lengkap': return 'default';
    case 'SPJ Belum Lengkap': return 'secondary';
    default: return 'outline';
  }
};

export default function MonevClientPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const [selectedVillage, setSelectedVillage] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedBidang, setSelectedBidang] = useState<string>('Semua Bidang');
  const [selectedSumberDana, setSelectedSumberDana] = useState<string>('Semua Sumber');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedActivity, setSelectedActivity] = useState<ApbdesDetail | null>(null);
  const [currentMonev, setCurrentMonev] = useState<Partial<Monev> | null>(null);

  // Form state
  const [realization, setRealization] = useState('');
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [volumeValue, setVolumeValue] = useState('');
  const [volumeUnit, setVolumeUnit] = useState('');
  const [tanggalRealisasi, setTanggalRealisasi] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  
  const [monevToDelete, setMonevToDelete] = useState<Monev | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const apbdesId = selectedVillage ? `${selectedVillage}-${selectedYear}` : null;
  
  const villageSettingsRef = useMemoFirebase(() => (firestore && selectedVillage) ? doc(firestore, 'villageSettings', selectedVillage) : null, [firestore, selectedVillage]);
  const { data: villageSettings } = useDoc<{ spjDriveFolderId?: string }>(villageSettingsRef);

  const activitiesQuery = useMemoFirebase(() => {
    if (!firestore || !apbdesId) return null;
    return query(collection(firestore, 'apbdes', apbdesId, 'details'), where('category', 'not-in', ['Pendapatan']));
  }, [firestore, apbdesId]);
  const { data: allActivitiesForYear, isLoading: isLoadingActivities } = useCollection<ApbdesDetail>(activitiesQuery);

  const monevQuery = useMemoFirebase(() => {
    if (!firestore || !selectedVillage) return null;
    return query(collection(firestore, 'monev'), where('village', '==', selectedVillage), where('year', '==', parseInt(selectedYear)));
  }, [firestore, selectedVillage, selectedYear]);
  const { data: monevData, isLoading: isLoadingMonev } = useCollection<Monev>(monevQuery);
  
  const monevMap = useMemo(() => {
    if (!monevData) return new Map<string, Monev>();
    return new Map(monevData.map(m => [m.apbdesDetailId, m]));
  }, [monevData]);

  const uniqueBidang = useMemo(() => {
    if (!allActivitiesForYear) return [];
    return ['Semua Bidang', ...Array.from(new Set(allActivitiesForYear.map(a => a.category)))];
  }, [allActivitiesForYear]);

  const uniqueSumberDana = useMemo(() => {
    if (!allActivitiesForYear) return [];
    const sources = allActivitiesForYear.map(a => a.fundingSource).filter(Boolean);
    return ['Semua Sumber', ...Array.from(new Set(sources))];
  }, [allActivitiesForYear]);

  const filteredActivities = useMemo(() => {
    if (!allActivitiesForYear) return [];
    return allActivitiesForYear.filter(activity => {
        const bidangMatch = selectedBidang === 'Semua Bidang' || activity.category === selectedBidang;
        const sumberDanaMatch = selectedSumberDana === 'Semua Sumber' || activity.fundingSource === selectedSumberDana;
        return bidangMatch && sumberDanaMatch;
    });
  }, [allActivitiesForYear, selectedBidang, selectedSumberDana]);

  const rekapData = useMemo(() => {
    if (!allActivitiesForYear || !monevMap) return [];
    return allActivitiesForYear.filter(activity => monevMap.has(activity.id));
  }, [allActivitiesForYear, monevMap]);

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
            throw new Error(`Gagal mengunggah file. Server merespons dengan status ${res.status}.`);
        }

        const result = await res.json();
        if (result.status !== 'SUCCESS') {
            throw new Error(`Kesalahan Skrip Google Apps: ${result.message}.`);
        }
        return result.fileUrl;
    } catch (error) {
        throw error;
    }
  };

  const handleFotoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = (activity: ApbdesDetail) => {
    const existingMonev = monevMap.get(activity.id);
    setSelectedActivity(activity);
    setCurrentMonev(existingMonev || null);
    setRealization(existingMonev ? String(existingMonev.realization) : '');
    setStatus(existingMonev ? existingMonev.status : '');
    setNotes(existingMonev ? existingMonev.notes || '' : '');
    setVolumeValue(existingMonev?.volume?.value || '');
    setVolumeUnit(existingMonev?.volume?.unit || '');
    setTanggalRealisasi(existingMonev?.tanggalRealisasi || '');
    setFotoFile(null);
    setFotoPreview(null);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async () => {
    if (!firestore || !user || !selectedActivity) return;

    setIsSubmitting(true);
    try {
      const realisasiNum = parseFloat(realization);
      if (isNaN(realisasiNum)) {
        toast({ variant: 'destructive', title: 'Input Tidak Valid', description: 'Realisasi harus berupa angka.' });
        setIsSubmitting(false);
        return;
      }
      if (!status) {
        toast({ variant: 'destructive', title: 'Input Tidak Lengkap', description: 'Status harus dipilih.' });
        setIsSubmitting(false);
        return;
      }
      if (!volumeValue || !volumeUnit) {
        toast({ variant: 'destructive', title: 'Input Tidak Lengkap', description: 'Volume dan Satuan harus diisi.' });
        setIsSubmitting(false);
        return;
      }
      
      let fotoUrlToSave = currentMonev?.fotoUrl || '';
      if (fotoFile) {
        const folderId = villageSettings?.spjDriveFolderId;
        if (!folderId) {
            toast({ variant: "destructive", title: "Folder Tidak Ditemukan", description: `ID Folder Google Drive untuk desa ${selectedVillage} belum diatur. Upload foto dibatalkan.` });
        } else {
          try {
              const uploadDate = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
              const extension = fotoFile.name.split('.').pop() || 'jpg';
              const desiredFileName = `MONEV_${selectedVillage}_${uploadDate}_${selectedActivity.id}.${extension}`;
              fotoUrlToSave = await handleFileUpload(fotoFile, folderId, desiredFileName);
          } catch(uploadError: any) {
              toast({ variant: 'destructive', title: 'Gagal Upload Foto', description: uploadError.message });
          }
        }
      }

      const monevDocId = currentMonev?.id || doc(collection(firestore, 'monev')).id;
      const monevRef = doc(firestore, 'monev', monevDocId);

      const dataToSave: Monev = {
        ...(currentMonev as Monev),
        id: monevDocId,
        village: selectedVillage,
        apbdesDetailId: selectedActivity.id,
        year: selectedActivity.year,
        activity: selectedActivity.description,
        apbdesCode: selectedActivity.activityCode,
        fundingSource: selectedActivity.fundingSource,
        budget: selectedActivity.amount,
        realization: realisasiNum,
        status,
        notes,
        volume: { value: volumeValue, unit: volumeUnit },
        tanggalRealisasi: tanggalRealisasi,
        fotoUrl: fotoUrlToSave,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
        ...(currentMonev ? {} : { createdAt: serverTimestamp(), createdBy: user.uid }),
      };

      await setDoc(monevRef, dataToSave, { merge: true });

      toast({ title: 'Sukses!', description: 'Data Monev berhasil disimpan.' });
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Gagal Menyimpan', description: 'Terjadi kesalahan: ' + error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMonevClick = (monev: Monev) => {
    setMonevToDelete(monev);
    setIsDeleteAlertOpen(true);
  };
  
  const confirmDeleteMonev = async () => {
    if (!monevToDelete || !firestore) return;
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(firestore, 'monev', monevToDelete.id));
      toast({ title: 'Sukses', description: 'Data Monev telah dihapus.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Gagal Menghapus', description: error.message });
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setIsDeleteAlertOpen(false);
      setMonevToDelete(null);
    }
  };

  const getPrintableHtml = () => {
    const villageTitle = capitalizeFirstLetter(selectedVillage);
    return `
      <html>
        <head>
          <title>Rekapitulasi Monev - Desa ${villageTitle} - ${selectedYear}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Arial:wght@400;700&display=swap');
            @page { size: A4 landscape; margin: 1cm; }
            body { font-family: Arial, sans-serif; font-size: 9pt; color: #333; }
            .print-container { padding: 0.5rem; }
            .header { text-align: center; margin-bottom: 1.5rem; }
            .header h1 { font-size: 14pt; font-weight: bold; margin-bottom: 0.2rem; }
            .header h3 { font-size: 12pt; font-weight: bold; margin-top: 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 6px; text-align: left; }
            th { font-weight: bold; background-color: #f2f2f2; font-size: 10pt;}
            td { word-wrap: break-word; }
            .nowrap { white-space: nowrap; }
            .text-right { text-align: right; }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="header">
              <h1>Rekapitulasi Hasil Monitoring dan Evaluasi</h1>
              <h3>Desa: ${villageTitle} - Tahun Anggaran: ${selectedYear}</h3>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Kode Rekening</th>
                  <th>Kegiatan</th>
                  <th class="text-right">Anggaran</th>
                  <th class="text-right">Realisasi</th>
                  <th class="nowrap">Volume</th>
                  <th class="nowrap">Tgl Realisasi</th>
                  <th>Status</th>
                  <th>Catatan</th>
                </tr>
              </thead>
              <tbody>
                ${rekapData
                  .map((activity) => {
                    const monevItem = monevMap.get(activity.id);
                    if (!monevItem) return "";
                    return `
                      <tr>
                        <td class="nowrap">${monevItem.apbdesCode || '-'}</td>
                        <td>${monevItem.activity}</td>
                        <td class="text-right">${formatCurrency(monevItem.budget)}</td>
                        <td class="text-right">${formatCurrency(monevItem.realization)}</td>
                        <td class="nowrap">${monevItem.volume ? `${monevItem.volume.value} ${monevItem.volume.unit}` : "-"}</td>
                        <td class="nowrap">${monevItem.tanggalRealisasi || "-"}</td>
                        <td>${monevItem.status}</td>
                        <td>${monevItem.notes || "-"}</td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;
  };

  const handlePrint = () => {
    if (!rekapData || rekapData.length === 0) return toast({ variant: "destructive", title: "Tidak Ada Data" });
    const printContent = getPrintableHtml();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
      setTimeout(() => { // ensure content is loaded
        printWindow.print();
        printWindow.onafterprint = () => printWindow.close();
      }, 500);
    } else {
      toast({ variant: "destructive", title: "Gagal Membuka Jendela Cetak", description: "Browser Anda mungkin memblokir pop-up." });
    }
  };

  const handleDownloadPdf = async () => {
    if (!rekapData || rekapData.length === 0) return toast({ variant: "destructive", title: "Tidak Ada Data" });
  
    const villageTitle = capitalizeFirstLetter(selectedVillage);
    const fileName = `Rekap-Monev-${villageTitle}-${selectedYear}.pdf`;
  
    const reportElement = document.createElement('div');
    reportElement.style.position = 'absolute';
    reportElement.style.left = '-9999px';
    reportElement.style.width = '1123px';
  
    reportElement.innerHTML = getPrintableHtml();
    document.body.appendChild(reportElement);
  
    try {
      const canvas = await html2canvas(reportElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'a4',
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName);
    } catch (err) {
      console.error("Error generating PDF:", err);
      toast({ variant: "destructive", title: "Gagal Membuat PDF" });
    } finally {
      document.body.removeChild(reportElement);
    }
  };

  const getPrintableActivitiesHtml = () => {
    const villageTitle = capitalizeFirstLetter(selectedVillage);
    return `
      <html>
        <head>
          <title>Daftar Kegiatan APBDes - Desa ${villageTitle} - ${selectedYear}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Arial:wght@400;700&display=swap');
            @page { size: A4 landscape; margin: 1cm; }
            body { font-family: Arial, sans-serif; font-size: 12px; color: #333; }
            .print-container { padding: 0.5rem; }
            .header { text-align: center; margin-bottom: 1.5rem; }
            .header h1 { font-size: 14pt; font-weight: bold; margin-bottom: 0.2rem; }
            .header h3 { font-size: 12pt; font-weight: bold; margin-top: 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 6px; text-align: left; font-size: 12px;}
            th { font-weight: bold; background-color: #f2f2f2;}
            td { word-wrap: break-word; }
            .nowrap { white-space: nowrap; }
            .text-right { text-align: right; }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="header">
              <h1>Daftar Kegiatan APBDes</h1>
              <h3>Desa: ${villageTitle} - Tahun Anggaran: ${selectedYear}</h3>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Kode Kegiatan</th>
                  <th>Kegiatan</th>
                  <th class="text-right">Anggaran</th>
                  <th>Sumber Dana</th>
                  <th class="text-right">Realisasi</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${filteredActivities
                  .map((activity) => {
                    const monevItem = monevMap.get(activity.id);
                    return `
                      <tr>
                        <td class="nowrap">${activity.activityCode || '-'}</td>
                        <td>${activity.description}</td>
                        <td class="text-right">${formatCurrency(activity.amount)}</td>
                        <td>${activity.fundingSource || '-'}</td>
                        <td class="text-right">${monevItem ? formatCurrency(monevItem.realization) : '-'}</td>
                        <td>${monevItem ? monevItem.status : 'Belum dievaluasi'}</td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;
  };

  const handlePrintActivities = () => {
    if (!filteredActivities || filteredActivities.length === 0) return toast({ variant: "destructive", title: "Tidak Ada Data" });
    const printContent = getPrintableActivitiesHtml();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
      setTimeout(() => { // ensure content is loaded
        printWindow.print();
        printWindow.onafterprint = () => printWindow.close();
      }, 500);
    } else {
      toast({ variant: "destructive", title: "Gagal Membuka Jendela Cetak", description: "Browser Anda mungkin memblokir pop-up." });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Input Hasil Monev APBDes</h1>
          <p className="text-muted-foreground">Pilih desa dan tahun untuk melihat kegiatan dan menginput hasil monitoring & evaluasi.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-6 w-6" />
                <span>Daftar Kegiatan APBDes</span>
            </CardTitle>
            <CardDescription>Filter berdasarkan desa, tahun, bidang, dan sumber dana untuk memulai.</CardDescription>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Select value={selectedVillage} onValueChange={setSelectedVillage}>
                <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Pilih Desa..." /></SelectTrigger>
                <SelectContent>{villages.map(v => <SelectItem key={v} value={v.toLowerCase()}>{v}</SelectItem>)}</SelectContent>
              </Select>
               <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full sm:w-[120px]"><SelectValue placeholder="Tahun..." /></SelectTrigger>
                <SelectContent>{[new Date().getFullYear(), new Date().getFullYear()-1].map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={selectedBidang} onValueChange={setSelectedBidang} disabled={!selectedVillage}>
                <SelectTrigger className="w-full sm:w-[220px]"><SelectValue placeholder="Pilih Bidang..." /></SelectTrigger>
                <SelectContent>{uniqueBidang.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
              </Select>
               <Select value={selectedSumberDana} onValueChange={setSelectedSumberDana} disabled={!selectedVillage}>
                <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Pilih Sumber Dana..." /></SelectTrigger>
                <SelectContent>{uniqueSumberDana.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              <Button variant="outline" onClick={handlePrintActivities} disabled={!filteredActivities || filteredActivities.length === 0}>
                <Printer className="mr-2 h-4 w-4" /> Cetak Daftar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aksi</TableHead>
                    <TableHead>Kode Kegiatan</TableHead>
                    <TableHead>Kegiatan</TableHead>
                    <TableHead>Anggaran</TableHead>
                    <TableHead>Sumber Dana</TableHead>
                    <TableHead>Realisasi</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(isLoadingActivities || isLoadingMonev) && selectedVillage ? (
                    <TableRow><TableCell colSpan={7} className="text-center h-24"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>
                  ) : !selectedVillage ? (
                     <TableRow><TableCell colSpan={7} className="text-center h-24">Silakan pilih desa untuk menampilkan data.</TableCell></TableRow>
                  ) : filteredActivities.length > 0 ? (
                    filteredActivities.map((item) => {
                      const monevItem = monevMap.get(item.id);
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => handleEditClick(item)}>
                                <Edit className="mr-2 h-4 w-4" /> Input/Edit
                            </Button>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{item.activityCode}</TableCell>
                          <TableCell className="font-medium">{item.description}</TableCell>
                          <TableCell>{formatCurrency(item.amount)}</TableCell>
                          <TableCell>{item.fundingSource}</TableCell>
                          <TableCell className={monevItem ? 'font-semibold' : 'text-muted-foreground'}>{monevItem ? formatCurrency(monevItem.realization) : '-'}</TableCell>
                          <TableCell>
                            {monevItem ? (
                              <Badge variant={getStatusVariant(monevItem.status)} className={monevItem.status === 'SPJ Lengkap' ? 'bg-green-600' : ''}>{monevItem.status}</Badge>
                            ) : (
                              <Badge variant="outline">Belum dievaluasi</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                     <TableRow><TableCell colSpan={7} className="text-center h-24">Tidak ada data kegiatan APBDes untuk filter yang dipilih.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {rekapData.length > 0 && (
            <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Rekap Hasil Monev</CardTitle>
                        <CardDescription>Daftar kegiatan yang telah dievaluasi untuk Desa terpilih.</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer className="mr-2 h-4 w-4" />
                            Cetak
                        </Button>
                        <Button onClick={handleDownloadPdf}>
                            <Download className="mr-2 h-4 w-4" />
                            Unduh PDF
                        </Button>
                      </div>
                  </div>
                </CardHeader>
                <CardContent>
                     <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Aksi</TableHead>
                                    <TableHead>Kegiatan</TableHead>
                                    <TableHead>Anggaran</TableHead>
                                    <TableHead>Realisasi</TableHead>
                                    <TableHead>Volume</TableHead>
                                    <TableHead>Tgl Realisasi</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Foto</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rekapData.map(activity => {
                                    const monevItem = monevMap.get(activity.id);
                                    if (!monevItem) return null;
                                    return (
                                        <TableRow key={`rekap-${activity.id}`}>
                                            <TableCell>
                                                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDeleteMonevClick(monevItem)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                            <TableCell className="font-medium">{activity.description}</TableCell>
                                            <TableCell>{formatCurrency(activity.amount)}</TableCell>
                                            <TableCell className="font-semibold">{formatCurrency(monevItem.realization)}</TableCell>
                                            <TableCell>{monevItem.volume ? `${monevItem.volume.value} ${monevItem.volume.unit}` : '-'}</TableCell>
                                            <TableCell>{monevItem.tanggalRealisasi || '-'}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(monevItem.status)} className={monevItem.status === 'SPJ Lengkap' ? 'bg-green-600' : ''}>{monevItem.status}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                {monevItem.fotoUrl ? (
                                                    <a href={monevItem.fotoUrl} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>Lihat</a>
                                                ) : '-'}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                  <DialogTitle>Input Hasil Monev</DialogTitle>
                  <DialogDescription>
                      <span className="font-semibold block">{selectedActivity?.description}</span>
                      <span className="block">Anggaran: {formatCurrency(selectedActivity?.amount || 0)}</span>
                  </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[60vh] pr-6">
                <div className="grid gap-4 py-4 pr-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <Label>Realisasi (Rp)</Label>
                          <Input type="number" value={realization} onChange={(e) => setRealization(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                          <Label>Status</Label>
                          <Select value={status} onValueChange={setStatus}>
                              <SelectTrigger><SelectValue placeholder="Pilih status SPJ..." /></SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="SPJ Lengkap">SPJ Lengkap</SelectItem>
                                  <SelectItem value="SPJ Belum Lengkap">SPJ Belum Lengkap</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Volume</Label>
                        <Input placeholder="Nilai, cth: 100" value={volumeValue} onChange={(e) => setVolumeValue(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Satuan Volume</Label>
                        <Select value={volumeUnit} onValueChange={setVolumeUnit}>
                            <SelectTrigger><SelectValue placeholder="Pilih satuan..." /></SelectTrigger>
                            <SelectContent>
                                {['Unit', 'Panjang', 'Orang', 'Bulan', 'Tahun', 'Paket'].map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                            </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tanggalRealisasi">Tanggal Realisasi (Opsional)</Label>
                      <Input id="tanggalRealisasi" type="date" value={tanggalRealisasi} onChange={(e) => setTanggalRealisasi(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="foto">Foto Kegiatan (Opsional)</Label>
                      {(fotoPreview || currentMonev?.fotoUrl) && (
                          <div className="relative w-full h-40 bg-muted rounded-md mt-2">
                              <Image src={fotoPreview || currentMonev!.fotoUrl!} alt="Preview Foto" layout="fill" className="rounded-md object-contain" />
                          </div>
                      )}
                      <Input id="foto" type="file" className="cursor-pointer" accept="image/*" onChange={handleFotoFileChange} />
                    </div>
                    <div className="grid w-full gap-1.5">
                      <Label htmlFor="notes">Catatan (Opsional)</Label>
                      <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Tambahkan catatan monev di sini..." />
                    </div>
                </div>
              </ScrollArea>
              <DialogFooter className="pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Batal</Button>
                  <Button onClick={handleFormSubmit} disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Simpan Hasil Monev
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda Yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus data monev untuk kegiatan <span className="font-bold">{monevToDelete?.activity}</span> secara permanen. Data ini tidak dapat dipulihkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMonev} disabled={isSubmitting} className={cn(buttonVariants({ variant: "destructive" }))}>
             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

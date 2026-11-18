
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
import { ClipboardCheck, Edit, Loader2, Trash2, Printer, Download, Search, Users, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const formatTanggalIndonesia = (dateStr: string) => {
  if (!dateStr) return '....................';
  const date = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(date.getTime())) return '....................';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const TAHAP_OPTIONS = ['Tahap I', 'Tahap II', 'Tahap III'] as const;
type TahapMonev = (typeof TAHAP_OPTIONS)[number];

const TAHAP_ORDER: Record<TahapMonev, number> = {
  'Tahap I': 1,
  'Tahap II': 2,
  'Tahap III': 3,
};

const normalizeTahap = (tahap?: string): TahapMonev => {
  if (tahap === 'Tahap II' || tahap === 'Tahap III') return tahap;
  return 'Tahap I';
};

const compareActivityCode = (a?: string, b?: string): number => {
  const codeA = (a ?? '').trim();
  const codeB = (b ?? '').trim();
  if (!codeA && !codeB) return 0;
  if (!codeA) return 1;
  if (!codeB) return -1;
  return codeA.localeCompare(codeB, undefined, { numeric: true, sensitivity: 'base' });
};

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
  const [selectedTahap, setSelectedTahap] = useState<TahapMonev>('Tahap I');
  const [selectedBidang, setSelectedBidang] = useState<string>('Semua Bidang');
  const [selectedSumberDana, setSelectedSumberDana] = useState<string>('Semua Sumber');
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  // Rekap signature & date settings state
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const [rekapMonevDate, setRekapMonevDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [kadesName, setKadesName] = useState<string>('');
  const [timMonevMembers, setTimMonevMembers] = useState<{ name: string; jabatan: string }[]>(
    Array.from({ length: 3 }, () => ({ name: '', jabatan: '' }))
  );

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
    const targetOrder = TAHAP_ORDER[selectedTahap];
    const map = new Map<string, Monev>();
    for (const item of monevData) {
      const itemOrder = TAHAP_ORDER[normalizeTahap(item.tahap)];
      if (itemOrder > targetOrder) continue;
      const existing = map.get(item.apbdesDetailId);
      if (!existing || itemOrder > TAHAP_ORDER[normalizeTahap(existing.tahap)]) {
        map.set(item.apbdesDetailId, item);
      }
    }
    return map;
  }, [monevData, selectedTahap]);

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
    const queryText = searchQuery.trim().toLowerCase();
    return allActivitiesForYear
      .filter(activity => {
        const bidangMatch = selectedBidang === 'Semua Bidang' || activity.category === selectedBidang;
        const sumberDanaMatch = selectedSumberDana === 'Semua Sumber' || activity.fundingSource === selectedSumberDana;
        const searchMatch =
          !queryText ||
          (activity.activityCode ?? '').toLowerCase().includes(queryText) ||
          (activity.description ?? '').toLowerCase().includes(queryText);
        return bidangMatch && sumberDanaMatch && searchMatch;
      })
      .sort((a, b) => compareActivityCode(a.activityCode, b.activityCode));
  }, [allActivitiesForYear, selectedBidang, selectedSumberDana, searchQuery]);

  const rekapData = useMemo(() => {
    if (!allActivitiesForYear || !monevMap) return [];
    return allActivitiesForYear
      .filter(activity => monevMap.has(activity.id))
      .sort((a, b) => {
        const codeA = monevMap.get(a.id)?.apbdesCode ?? a.activityCode;
        const codeB = monevMap.get(b.id)?.apbdesCode ?? b.activityCode;
        return compareActivityCode(codeA, codeB);
      });
  }, [allActivitiesForYear, monevMap]);

  const printableRekapData = useMemo(() => {
    if (!allActivitiesForYear) return [];
    return [...allActivitiesForYear].sort((a, b) => {
      const codeA = monevMap.get(a.id)?.apbdesCode ?? a.activityCode;
      const codeB = monevMap.get(b.id)?.apbdesCode ?? b.activityCode;
      return compareActivityCode(codeA, codeB);
    });
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
            const tahapSlug = selectedTahap.replace(/\s+/g, '');
            const extension = fotoFile.name.split('.').pop() || 'jpg';
            const desiredFileName = `MONEV_${selectedVillage}_${tahapSlug}_${uploadDate}_${selectedActivity.id}.${extension}`;
            fotoUrlToSave = await handleFileUpload(fotoFile, folderId, desiredFileName);
          } catch (uploadError: unknown) {
            const msg = uploadError instanceof Error ? uploadError.message : 'Terjadi kesalahan saat mengunggah foto.';
            toast({ variant: 'destructive', title: 'Gagal Upload Foto', description: msg });
          }
        }
      }

      const isSameTahap = Boolean(currentMonev?.id && normalizeTahap(currentMonev.tahap) === selectedTahap);
      const monevDocId = isSameTahap ? currentMonev!.id! : doc(collection(firestore, 'monev')).id;
      const monevRef = doc(firestore, 'monev', monevDocId);

      const dataToSave: Monev = {
        ...(isSameTahap ? (currentMonev as Monev) : ({} as Monev)),
        id: monevDocId,
        village: selectedVillage,
        apbdesDetailId: selectedActivity.id,
        year: selectedActivity.year,
        tahap: selectedTahap,
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
        ...(isSameTahap ? {} : { createdAt: serverTimestamp(), createdBy: user.uid }),
      };

      await setDoc(monevRef, dataToSave, { merge: true });

      toast({ title: 'Sukses!', description: 'Data Monev berhasil disimpan.' });
      setIsDialogOpen(false);
    } catch (error: unknown) {
      console.error(error);
      const msg = error instanceof Error ? error.message : 'Terjadi kesalahan';
      toast({ variant: 'destructive', title: 'Gagal Menyimpan', description: 'Terjadi kesalahan: ' + msg });
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
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Terjadi kesalahan';
      toast({ variant: 'destructive', title: 'Gagal Menghapus', description: msg });
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setIsDeleteAlertOpen(false);
      setMonevToDelete(null);
    }
  };

  const handleTimMonevChange = (index: number, field: 'name' | 'jabatan', value: string) => {
    setTimMonevMembers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddTimMonevRow = () => {
    setTimMonevMembers(prev => [...prev, { name: '', jabatan: '' }]);
  };

  const handleRemoveTimMonevRow = (index: number) => {
    setTimMonevMembers(prev => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  const getPrintableHtml = (forPdf = false) => {
    const villageTitle = capitalizeFirstLetter(selectedVillage);
    const formattedMonevDate = formatTanggalIndonesia(rekapMonevDate);

    const summaryBySourceMap = new Map<string, { budget: number; realization: number; sisa: number }>();
    for (const activity of printableRekapData) {
      const monevItem = monevMap.get(activity.id);
      const source = (monevItem?.fundingSource || activity.fundingSource || 'Lainnya').trim() || 'Lainnya';
      const budget = monevItem ? monevItem.budget : activity.amount;
      const realization = monevItem ? monevItem.realization : 0;
      const current = summaryBySourceMap.get(source) ?? { budget: 0, realization: 0, sisa: 0 };
      current.budget += budget;
      current.realization += realization;
      current.sisa += budget - realization;
      summaryBySourceMap.set(source, current);
    }
    const summaryRows = Array.from(summaryBySourceMap.entries()).sort(([a], [b]) => a.localeCompare(b));
    const grandTotal = summaryRows.reduce(
      (acc, [, val]) => ({
        budget: acc.budget + val.budget,
        realization: acc.realization + val.realization,
        sisa: acc.sisa + val.sisa,
      }),
      { budget: 0, realization: 0, sisa: 0 }
    );

    const renderRekapRow = (activity: ApbdesDetail) => {
      const monevItem = monevMap.get(activity.id);
      if (!monevItem) {
        return `
          <tr class="data-row">
            <td class="nowrap">${activity.activityCode || '-'}</td>
            <td>${activity.description}</td>
            <td class="text-right">${formatCurrency(activity.amount)}</td>
            <td class="text-right">-</td>
            <td class="text-right">${formatCurrency(activity.amount)}</td>
            <td class="nowrap">-</td>
            <td class="nowrap">-</td>
            <td>Kegiatan Belum Realisasi</td>
            <td>-</td>
          </tr>
        `;
      }
      const itemTahap = normalizeTahap(monevItem.tahap);
      const sisaAnggaran = monevItem.budget - monevItem.realization;
      return `
        <tr class="data-row">
          <td class="nowrap">${monevItem.apbdesCode || activity.activityCode || '-'}</td>
          <td>${monevItem.activity || activity.description}</td>
          <td class="text-right">${formatCurrency(monevItem.budget)}</td>
          <td class="text-right">${formatCurrency(monevItem.realization)}</td>
          <td class="text-right">${formatCurrency(sisaAnggaran)}</td>
          <td class="nowrap">${monevItem.volume ? `${monevItem.volume.value} ${monevItem.volume.unit}` : "-"}</td>
          <td class="nowrap">${monevItem.tanggalRealisasi || "-"}</td>
          <td>${monevItem.status} (${itemTahap})</td>
          <td>${monevItem.notes || "-"}</td>
        </tr>
      `;
    };

    return `
      <html>
        <head>
          <title>Rekapitulasi Monev - Desa ${villageTitle} - ${selectedYear} - ${selectedTahap}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Arial:wght@400;700&display=swap');
            @page { size: A4 landscape; margin: 1cm; }
            body { font-family: Arial, sans-serif; font-size: 9pt; color: #333; margin: 0; background: #fff; }
            .print-container { padding: ${forPdf ? '38px' : '0'}; background: #fff; color: #333; font-family: Arial, sans-serif; font-size: 9pt; }
            .header { text-align: center; margin-bottom: 1.25rem; }
            .header h1 { font-size: 14pt; font-weight: bold; margin: 0 0 0.25rem 0; }
            .header h3 { font-size: 11.5pt; font-weight: bold; margin: 0 0 0.25rem 0; }
            .header .date-subtitle { font-size: 10pt; margin: 0; color: #333; }
            table.data-table { width: 100%; border-collapse: collapse; }
            table.data-table thead { display: table-header-group; }
            table.data-table tr.data-row { break-inside: avoid; page-break-inside: avoid; }
            table.data-table th, table.data-table td { border: 1px solid #ccc; padding: 6px; text-align: left; font-size: 9pt; }
            table.data-table th { font-weight: bold; background-color: #f2f2f2; font-size: 9.5pt; }
            table.data-table td { word-wrap: break-word; }
            .nowrap { white-space: nowrap; }
            .text-right { text-align: right; }
            .last-page-sheet { page-break-before: always; break-before: page; page-break-inside: avoid; break-inside: avoid; padding-top: ${forPdf ? '4px' : '0'}; }
            .summary-section { margin-top: 0; break-inside: avoid; page-break-inside: avoid; }
            .summary-title { font-size: 9.5pt; font-weight: bold; margin-bottom: 4px; }
            table.summary-table { width: 100%; border-collapse: collapse; }
            table.summary-table th, table.summary-table td { border: 1px solid #ccc !important; padding: 3px 6px !important; text-align: left; font-size: 8pt; line-height: 1.2; }
            table.summary-table th { font-weight: bold; background-color: #f2f2f2; font-size: 8.5pt; }
            table.summary-table th.text-right, table.summary-table td.text-right { text-align: right; }
            .signature-section { margin-top: 12px; padding-top: 0; break-inside: avoid; page-break-inside: avoid; }
            .signature-date { text-align: center; margin-bottom: 8px; font-size: 9pt; }
            .signature-columns { display: flex; justify-content: space-between; align-items: flex-start; gap: 28px; }
            .signature-left { width: 62%; }
            .signature-right { width: 34%; text-align: center; }
            .signature-title { text-align: center; font-size: 9.5pt; font-weight: bold; margin-bottom: 6px; }
            table.tim-table { width: 100%; border-collapse: collapse; }
            table.tim-table td { border: none !important; padding: 14px 4px 4px 4px !important; font-size: 9pt; vertical-align: bottom; text-align: left; }
            .tim-no { width: 24px; }
            .tim-name { width: 36%; }
            .tim-jabatan { width: 32%; }
            .tim-sign { width: 28%; letter-spacing: 1px; }
            .kades-space { height: 70px; }
            .kades-name { font-weight: bold; font-size: 9.5pt; }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="header">
              <h1>Rekapitulasi Hasil Monitoring dan Evaluasi APBDes</h1>
              <h3>Desa: ${villageTitle} - Tahun Anggaran: ${selectedYear} - ${selectedTahap}</h3>
              <p class="date-subtitle">Tanggal Monev : ${formattedMonevDate}</p>
            </div>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Kode Rekening</th>
                  <th>Kegiatan</th>
                  <th class="text-right">Anggaran</th>
                  <th class="text-right">Realisasi</th>
                  <th class="text-right">Sisa Anggaran</th>
                  <th class="nowrap">Volume</th>
                  <th class="nowrap">Tgl Realisasi</th>
                  <th>Status</th>
                  <th>Catatan</th>
                </tr>
              </thead>
              <tbody>
                ${printableRekapData.map(renderRekapRow).join("")}
              </tbody>
            </table>
            <div class="last-page-sheet">
              <div class="summary-section">
                <div class="summary-title">Rekapitulasi Per Sumber Anggaran — Desa ${villageTitle} (${selectedYear} - ${selectedTahap})</div>
                <table class="summary-table">
                  <thead>
                    <tr>
                      <th>Sumber Anggaran</th>
                      <th class="text-right">Total Anggaran</th>
                      <th class="text-right">Total Penyerapan (Realisasi)</th>
                      <th class="text-right">Total Belum Diserap (Sisa)</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${summaryRows.map(([source, val]) => `
                      <tr>
                        <td>${source}</td>
                        <td class="text-right">${formatCurrency(val.budget)}</td>
                        <td class="text-right">${formatCurrency(val.realization)}</td>
                        <td class="text-right">${formatCurrency(val.sisa)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th>Total Keseluruhan</th>
                      <th class="text-right">${formatCurrency(grandTotal.budget)}</th>
                      <th class="text-right">${formatCurrency(grandTotal.realization)}</th>
                      <th class="text-right">${formatCurrency(grandTotal.sisa)}</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div class="signature-section">
                <div class="signature-date">Gandrungmangu, ${formattedMonevDate}</div>
                <div class="signature-columns">
                  <div class="signature-left">
                    <div class="signature-title">Tim Monev</div>
                    <table class="tim-table">
                      <tbody>
                        ${timMonevMembers.map((member, i) => {
      const memberName = member.name.trim() || '';
      const memberJabatan = member.jabatan.trim() || '';
      return `
                            <tr>
                              <td class="tim-no">${i + 1}.</td>
                              <td class="tim-name">${memberName}</td>
                              <td class="tim-jabatan">${memberJabatan}</td>
                              <td class="tim-sign">.....................</td>
                            </tr>
                          `;
    }).join('')}
                      </tbody>
                    </table>
                  </div>
                  <div class="signature-right">
                    <div class="signature-title">Kepala Desa ${villageTitle}</div>
                    <div class="kades-space"></div>
                    <div class="kades-name">${kadesName.trim() || '.....................'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const handlePrint = () => {
    if (!printableRekapData || printableRekapData.length === 0) return toast({ variant: "destructive", title: "Tidak Ada Data" });
    const printContent = getPrintableHtml(false);
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
    if (!printableRekapData || printableRekapData.length === 0) return toast({ variant: "destructive", title: "Tidak Ada Data" });

    const villageTitle = capitalizeFirstLetter(selectedVillage);
    const tahapSlug = selectedTahap.replace(/\s+/g, '-');
    const fileName = `Rekap-Monev-${villageTitle}-${selectedYear}-${tahapSlug}.pdf`;

    const reportElement = document.createElement('div');
    reportElement.style.position = 'absolute';
    reportElement.style.left = '-9999px';
    reportElement.style.width = '1123px';
    reportElement.style.backgroundColor = '#ffffff';

    reportElement.innerHTML = getPrintableHtml(true);
    document.body.appendChild(reportElement);

    try {
      const canvas = await html2canvas(reportElement, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const domWidth = reportElement.offsetWidth;
      const domHeight = reportElement.scrollHeight;
      const pageHeightDom = domWidth * (pdfHeight / pdfWidth);
      const scaleFactor = canvas.width / domWidth;

      const containerTop = reportElement.getBoundingClientRect().top;
      const rowElements = Array.from(reportElement.querySelectorAll('table.data-table tr.data-row'));
      const lastSheet = reportElement.querySelector('.last-page-sheet');
      const lastSheetTop = lastSheet ? lastSheet.getBoundingClientRect().top - containerTop : domHeight;

      const breakPoints: number[] = [0];
      let currentStart = 0;

      // Paginate main data table up to lastSheetTop
      while (currentStart + pageHeightDom - 38 < lastSheetTop) {
        const maxBottom = currentStart + pageHeightDom - 38;
        let candidateBreak = currentStart;

        for (const row of rowElements) {
          const rowBottom = row.getBoundingClientRect().bottom - containerTop;
          if (rowBottom > currentStart && rowBottom <= maxBottom) {
            candidateBreak = rowBottom;
          }
        }

        if (candidateBreak <= currentStart) {
          candidateBreak = Math.min(currentStart + pageHeightDom - 38, lastSheetTop);
        }

        breakPoints.push(candidateBreak);
        currentStart = candidateBreak;
      }

      // Always place .last-page-sheet on its own dedicated final page
      if (lastSheet && lastSheetTop > currentStart) {
        breakPoints.push(lastSheetTop);
      }
      breakPoints.push(domHeight);

      for (let i = 0; i < breakPoints.length - 1; i++) {
        const startY = breakPoints[i];
        const endY = breakPoints[i + 1];
        const chunkHeightDom = endY - startY;
        if (chunkHeightDom <= 0) continue;

        if (i > 0) pdf.addPage();

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.ceil(chunkHeightDom * scaleFactor);
        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(
            canvas,
            0,
            Math.floor(startY * scaleFactor),
            canvas.width,
            pageCanvas.height,
            0,
            0,
            canvas.width,
            pageCanvas.height
          );
          const yOffsetMm = i === 0 ? 0 : 10;
          const maxAvailHeightMm = pdfHeight - yOffsetMm - 4;
          let drawWidthMm = pdfWidth;
          let drawHeightMm = (chunkHeightDom * pdfWidth) / domWidth;
          if (drawHeightMm > maxAvailHeightMm) {
            const fitRatio = maxAvailHeightMm / drawHeightMm;
            drawWidthMm = pdfWidth * fitRatio;
            drawHeightMm = maxAvailHeightMm;
          }
          const xOffsetMm = (pdfWidth - drawWidthMm) / 2;
          pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', xOffsetMm, yOffsetMm, drawWidthMm, drawHeightMm);
        }
      }

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
          <title>Daftar Kegiatan APBDes - Desa ${villageTitle} - ${selectedYear} - ${selectedTahap}</title>
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
              <h3>Desa: ${villageTitle} - Tahun Anggaran: ${selectedYear} - ${selectedTahap}</h3>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Kode Kegiatan</th>
                  <th>Kegiatan</th>
                  <th class="text-right">Anggaran</th>
                  <th>Sumber Dana</th>
                  <th class="text-right">Realisasi</th>
                  <th class="text-right">Sisa Anggaran</th>
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
                        <td class="text-right">${monevItem ? formatCurrency(activity.amount - monevItem.realization) : '-'}</td>
                        <td>${monevItem ? `${monevItem.status} (${normalizeTahap(monevItem.tahap)})` : 'Belum dievaluasi'}</td>
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

        <Tabs defaultValue="kegiatan" className="space-y-4">
          <TabsList>
            <TabsTrigger value="kegiatan">Daftar Kegiatan APBDes</TabsTrigger>
            <TabsTrigger value="rekap">
              Rekap Hasil Monev{rekapData.length > 0 ? ` (${rekapData.length})` : ''}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kegiatan">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-6 w-6" />
                  <span>Daftar Kegiatan APBDes</span>
                </CardTitle>
                <CardDescription>Filter berdasarkan desa, tahun, tahap, bidang, sumber dana, kode kegiatan, dan kegiatan.</CardDescription>
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <Select value={selectedVillage} onValueChange={setSelectedVillage}>
                    <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Pilih Desa..." /></SelectTrigger>
                    <SelectContent>{villages.map(v => <SelectItem key={v} value={v.toLowerCase()}>{v}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-full sm:w-[120px]"><SelectValue placeholder="Tahun..." /></SelectTrigger>
                    <SelectContent>{[new Date().getFullYear(), new Date().getFullYear() - 1].map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={selectedTahap} onValueChange={(v) => setSelectedTahap(v as TahapMonev)}>
                    <SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="Pilih Tahap..." /></SelectTrigger>
                    <SelectContent>
                      {TAHAP_OPTIONS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={selectedBidang} onValueChange={setSelectedBidang} disabled={!selectedVillage}>
                    <SelectTrigger className="w-full sm:w-[220px]"><SelectValue placeholder="Pilih Bidang..." /></SelectTrigger>
                    <SelectContent>{uniqueBidang.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={selectedSumberDana} onValueChange={setSelectedSumberDana} disabled={!selectedVillage}>
                    <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Pilih Sumber Dana..." /></SelectTrigger>
                    <SelectContent>{uniqueSumberDana.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <div className="relative w-full sm:w-[280px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari Kode Kegiatan atau Kegiatan..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      disabled={!selectedVillage}
                      className="pl-9"
                    />
                  </div>
                  <Button variant="outline" onClick={handlePrintActivities} disabled={!filteredActivities || filteredActivities.length === 0}>
                    <Printer className="mr-2 h-4 w-4" /> Cetak Daftar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto lg:overflow-x-visible">
                  <Table className="w-full lg:table-fixed text-xs">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="px-2 py-2.5 lg:w-[104px]">Aksi</TableHead>
                        <TableHead className="px-2 py-2.5 lg:w-[82px]">Kode</TableHead>
                        <TableHead className="px-2 py-2.5">Kegiatan</TableHead>
                        <TableHead className="px-2 py-2.5 lg:w-[108px] text-right">Anggaran</TableHead>
                        <TableHead className="px-2 py-2.5 lg:w-[78px]">Sumber</TableHead>
                        <TableHead className="px-2 py-2.5 lg:w-[108px] text-right">Realisasi</TableHead>
                        <TableHead className="px-2 py-2.5 lg:w-[108px] text-right">Sisa Anggaran</TableHead>
                        <TableHead className="px-2 py-2.5 lg:w-[125px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(isLoadingActivities || isLoadingMonev) && selectedVillage ? (
                        <TableRow><TableCell colSpan={8} className="text-center h-24"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>
                      ) : !selectedVillage ? (
                        <TableRow><TableCell colSpan={8} className="text-center h-24">Silakan pilih desa untuk menampilkan data.</TableCell></TableRow>
                      ) : filteredActivities.length > 0 ? (
                        filteredActivities.map((item) => {
                          const monevItem = monevMap.get(item.id);
                          return (
                            <TableRow key={item.id}>
                              <TableCell className="px-2 py-2">
                                <Button variant="outline" size="sm" className="h-7 px-2 text-[11px] whitespace-nowrap" onClick={() => handleEditClick(item)}>
                                  <Edit className="mr-1 h-3 w-3 shrink-0" /> Input/Edit
                                </Button>
                              </TableCell>
                              <TableCell className="px-2 py-2 font-mono text-[11px] whitespace-nowrap">{item.activityCode}</TableCell>
                              <TableCell className="px-2 py-2 font-medium whitespace-normal break-words leading-snug">{item.description}</TableCell>
                              <TableCell className="px-2 py-2 text-right whitespace-nowrap">{formatCurrency(item.amount)}</TableCell>
                              <TableCell className="px-2 py-2 whitespace-normal break-words">{item.fundingSource}</TableCell>
                              <TableCell className={cn("px-2 py-2 text-right whitespace-nowrap", monevItem ? 'font-semibold' : 'text-muted-foreground')}>{monevItem ? formatCurrency(monevItem.realization) : '-'}</TableCell>
                              <TableCell className={cn("px-2 py-2 text-right whitespace-nowrap", monevItem ? 'font-medium' : 'text-muted-foreground')}>{monevItem ? formatCurrency(item.amount - monevItem.realization) : '-'}</TableCell>
                              <TableCell className="px-2 py-2">
                                {monevItem ? (
                                  <div className="flex flex-wrap items-center gap-1">
                                    <Badge variant={getStatusVariant(monevItem.status)} className={cn("text-[10px] px-1.5 py-0.5 leading-tight", monevItem.status === 'SPJ Lengkap' ? 'bg-green-600' : '')}>{monevItem.status}</Badge>
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 leading-tight">{normalizeTahap(monevItem.tahap)}</Badge>
                                  </div>
                                ) : (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 leading-tight">Belum dievaluasi</Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow><TableCell colSpan={8} className="text-center h-24">Tidak ada data kegiatan APBDes untuk filter yang dipilih.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rekap">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle>Rekap Hasil Monev</CardTitle>
                    <CardDescription>Daftar kegiatan yang telah dievaluasi untuk Desa terpilih ({selectedTahap}).</CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Select value={selectedTahap} onValueChange={(v) => setSelectedTahap(v as TahapMonev)}>
                      <SelectTrigger className="w-[135px]"><SelectValue placeholder="Pilih Tahap..." /></SelectTrigger>
                      <SelectContent>
                        {TAHAP_OPTIONS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => setIsSignatureDialogOpen(true)} disabled={!selectedVillage}>
                      <Users className="mr-2 h-4 w-4" />
                      Tim Monev &amp; Kades
                    </Button>
                    <Button variant="outline" onClick={handlePrint} disabled={printableRekapData.length === 0}>
                      <Printer className="mr-2 h-4 w-4" />
                      Cetak
                    </Button>
                    <Button onClick={handleDownloadPdf} disabled={printableRekapData.length === 0}>
                      <Download className="mr-2 h-4 w-4" />
                      Unduh PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto lg:overflow-x-visible">
                  <Table className="w-full lg:table-fixed text-xs">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="px-2 py-2.5 lg:w-[44px]">Aksi</TableHead>
                        <TableHead className="px-2 py-2.5 lg:w-[24%]">Kegiatan</TableHead>
                        <TableHead className="px-2 py-2.5 lg:w-[104px] text-right">Anggaran</TableHead>
                        <TableHead className="px-2 py-2.5 lg:w-[104px] text-right">Realisasi</TableHead>
                        <TableHead className="px-2 py-2.5 lg:w-[104px] text-right">Sisa Anggaran</TableHead>
                        <TableHead className="px-2 py-2.5 lg:w-[76px]">Volume</TableHead>
                        <TableHead className="px-2 py-2.5 lg:w-[88px]">Tgl Realisasi</TableHead>
                        <TableHead className="px-2 py-2.5 lg:w-[130px]">Status</TableHead>
                        <TableHead className="px-2 py-2.5 lg:w-[58px] text-center">Foto</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!selectedVillage ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center h-24">Silakan pilih desa pada tab Daftar Kegiatan APBDes untuk menampilkan data.</TableCell>
                        </TableRow>
                      ) : rekapData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center h-24">Belum ada kegiatan yang dievaluasi untuk desa dan tahun terpilih.</TableCell>
                        </TableRow>
                      ) : (
                        rekapData.map(activity => {
                          const monevItem = monevMap.get(activity.id);
                          if (!monevItem) return null;
                          return (
                            <TableRow key={`rekap-${activity.id}`}>
                              <TableCell className="px-2 py-2">
                                <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => handleDeleteMonevClick(monevItem)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </TableCell>
                              <TableCell className="px-2 py-2 font-medium whitespace-normal break-words leading-snug">{activity.description}</TableCell>
                              <TableCell className="px-2 py-2 text-right whitespace-nowrap">{formatCurrency(activity.amount)}</TableCell>
                              <TableCell className="px-2 py-2 text-right font-semibold whitespace-nowrap">{formatCurrency(monevItem.realization)}</TableCell>
                              <TableCell className="px-2 py-2 text-right font-medium whitespace-nowrap">{formatCurrency(activity.amount - monevItem.realization)}</TableCell>
                              <TableCell className="px-2 py-2 whitespace-normal break-words">{monevItem.volume ? `${monevItem.volume.value} ${monevItem.volume.unit}` : '-'}</TableCell>
                              <TableCell className="px-2 py-2 whitespace-nowrap">{monevItem.tanggalRealisasi || '-'}</TableCell>
                              <TableCell className="px-2 py-2">
                                <div className="flex flex-wrap items-center gap-1">
                                  <Badge variant={getStatusVariant(monevItem.status)} className={cn("text-[10px] px-1.5 py-0.5 leading-tight", monevItem.status === 'SPJ Lengkap' ? 'bg-green-600' : '')}>{monevItem.status}</Badge>
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 leading-tight">{normalizeTahap(monevItem.tahap)}</Badge>
                                </div>
                              </TableCell>
                              <TableCell className="px-2 py-2 text-center">
                                {monevItem.fotoUrl ? (
                                  <a href={monevItem.fotoUrl} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'h-7 px-2 text-[11px]')}>Lihat</a>
                                ) : '-'}
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Input Hasil Monev ({selectedTahap})</DialogTitle>
            <DialogDescription>
              <span className="font-semibold block">{selectedActivity?.description}</span>
              <span className="block">Anggaran: {formatCurrency(selectedActivity?.amount || 0)} &bull; {selectedTahap}</span>
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

      <Dialog open={isSignatureDialogOpen} onOpenChange={setIsSignatureDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pengaturan Penandatanganan Rekap Monev</DialogTitle>
            <DialogDescription>
              Isi tanggal monev, nama Kepala Desa, serta nama dan jabatan anggota Tim Monev untuk dicetak pada Rekap Hasil Monev.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="grid gap-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="rekapMonevDate">Tanggal Monev</Label>
                <Input
                  id="rekapMonevDate"
                  type="date"
                  value={rekapMonevDate}
                  onChange={(e) => setRekapMonevDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kadesName">Nama Kepala Desa {selectedVillage ? capitalizeFirstLetter(selectedVillage) : ''}</Label>
                <Input
                  id="kadesName"
                  placeholder="Contoh: Salimun"
                  value={kadesName}
                  onChange={(e) => setKadesName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Tim Monev</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddTimMonevRow}>
                    <Plus className="mr-1 h-4 w-4" />
                    Tambah Baris
                  </Button>
                </div>
                <div className="space-y-2">
                  {timMonevMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-6 text-sm font-medium text-muted-foreground">{index + 1}.</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                        <Input
                          placeholder={`Nama Anggota ${index + 1}`}
                          value={member.name}
                          onChange={(e) => handleTimMonevChange(index, 'name', e.target.value)}
                        />
                        <Input
                          placeholder={`Jabatan Anggota ${index + 1}`}
                          value={member.jabatan}
                          onChange={(e) => handleTimMonevChange(index, 'jabatan', e.target.value)}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-destructive hover:text-destructive"
                        onClick={() => handleRemoveTimMonevRow(index)}
                        disabled={timMonevMembers.length <= 1}
                        title="Hapus baris"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="pt-4 border-t">
            <Button type="button" onClick={() => setIsSignatureDialogOpen(false)}>
              Simpan &amp; Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

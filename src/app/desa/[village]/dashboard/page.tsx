'use client';

import { useState, useMemo, ChangeEvent, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Users, BarChart2, BookOpen, PlusCircle, ClipboardCheck, Loader2, MoreHorizontal, Pencil, Trash2, HeartPulse, Landmark, DollarSign, MapIcon, Printer } from 'lucide-react';
import { villages } from '@/lib/villages';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFirestore, useUser, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, where, doc, updateDoc, deleteDoc, Timestamp, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { P3keIntervention, SpjDocument, RegulationDocument, Stunting, BumilKek, JumlahBalita, PrioritasDanaDesa, Monev } from '@/lib/perangkat-data';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import AuthGuard from '../AuthGuard';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwC7P8gr8O5zxcUzeKOFoS2uxZ_Zhw5P_S-EoSFzFVELKRpIxq6gsIfqW_UNoKKhB2Agw/exec';

function capitalizeFirstLetter(string: string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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

const formatCurrency = (value: number) => {
  if (isNaN(value)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const SpjHistoryList = ({ documents, onDelete }: { documents: SpjDocument[] | null, onDelete: (doc: SpjDocument) => void }) => {
  return (
    <div className="py-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bulan</TableHead>
            <TableHead>Kegiatan</TableHead>
            <TableHead>Sumber Anggaran</TableHead>
            <TableHead>Tanggal Upload</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents && documents.length > 0 ? documents.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{capitalizeFirstLetter(item.month)}</TableCell>
              <TableCell>
                <div className="font-medium">{item.activity}</div>
                <div className="text-xs text-muted-foreground">{item.field}</div>
              </TableCell>
              <TableCell>{item.sourceOfFunds}</TableCell>
              <TableCell>
                {formatFirebaseTimestamp(item.createdAt)}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8")}>
                  <FileText className="mr-2 h-4 w-4" /> Lihat
                </a>
                 <Button variant="destructive" size="sm" className="h-8" onClick={() => onDelete(item)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24">Belum ada dokumen SPJ yang diunggah.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const ProdukHukumHistoryList = ({ documents, onDelete }: { documents: RegulationDocument[] | null, onDelete: (doc: RegulationDocument) => void }) => {
  return (
    <div className="py-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jenis</TableHead>
            <TableHead>Perihal</TableHead>
            <TableHead>Nomor Dokumen</TableHead>
            <TableHead>Tanggal Upload</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents && documents.length > 0 ? documents.map((item) => (
            <TableRow key={item.id}>
              <TableCell><Badge variant="secondary">{item.type}</Badge></TableCell>
              <TableCell className="font-medium">{item.about}</TableCell>
              <TableCell>{item.number}</TableCell>
              <TableCell>{formatFirebaseTimestamp(item.createdAt)}</TableCell>
              <TableCell className="text-right space-x-2">
                <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8")}>
                  <FileText className="mr-2 h-4 w-4" /> Lihat
                </a>
                 <Button variant="destructive" size="sm" className="h-8" onClick={() => onDelete(item)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24">Belum ada produk hukum yang diunggah.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const P3keHistoryList = ({ interventions, onEdit, onDelete }: { interventions: P3keIntervention[] | null, onEdit: (i: P3keIntervention) => void, onDelete: (i: P3keIntervention) => void }) => {
  return (
    <div className="py-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jenis Intervensi</TableHead>
            <TableHead>Penerima</TableHead>
            <TableHead>Total Anggaran</TableHead>
            <TableHead>Sumber Anggaran</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interventions && interventions.length > 0 ? interventions.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.jenisIntervensi}</TableCell>
              <TableCell>{item.jumlahPenerima}</TableCell>
              <TableCell>{item.totalAnggaran}</TableCell>
              <TableCell><Badge variant="secondary">{item.sumberAnggaran}</Badge></TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Buka menu</span><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(item)}><Pencil className="mr-2 h-4 w-4" /><span>Edit</span></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(item)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /><span>Hapus</span></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow><TableCell colSpan={5} className="text-center h-24">Belum ada data intervensi P3KE.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const StuntingHistoryList = ({ documents, onDelete }: { documents: Stunting[] | null, onDelete: (doc: Stunting) => void }) => (
    <div className="py-4"><Table><TableHeader><TableRow><TableHead>Nama Anak</TableHead><TableHead>Usia (Bulan)</TableHead><TableHead>Tinggi (cm)</TableHead><TableHead>Tgl Ukur</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader><TableBody>
      {documents && documents.length > 0 ? documents.map((item) => (<TableRow key={item.id}><TableCell className="font-medium">{item.namaAnak}</TableCell><TableCell>{item.usiaBulan}</TableCell><TableCell>{item.tinggiBadanCm}</TableCell><TableCell>{item.tanggalPengukuran}</TableCell><TableCell className="text-right"><Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => onDelete(item)}><Trash2 className="h-4 w-4" /></Button></TableCell></TableRow>
      )) : (<TableRow><TableCell colSpan={5} className="text-center h-24">Belum ada data stunting.</TableCell></TableRow>)}
    </TableBody></Table></div>
);
  
const BumilKekHistoryList = ({ documents, onDelete }: { documents: BumilKek[] | null, onDelete: (doc: BumilKek) => void }) => (
    <div className="py-4"><Table><TableHeader><TableRow><TableHead>Nama Ibu</TableHead><TableHead>Usia Hamil (Minggu)</TableHead><TableHead>LILA (cm)</TableHead><TableHead>Tgl Periksa</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader><TableBody>
      {documents && documents.length > 0 ? documents.map((item) => (<TableRow key={item.id}><TableCell className="font-medium">{item.namaIbu}</TableCell><TableCell>{item.usiaKehamilanMinggu}</TableCell><TableCell>{item.lingkarLenganAtasCm}</TableCell><TableCell>{item.tanggalPemeriksaan}</TableCell><TableCell className="text-right"><Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => onDelete(item)}><Trash2 className="h-4 w-4" /></Button></TableCell></TableRow>
      )) : (<TableRow><TableCell colSpan={5} className="text-center h-24">Belum ada data Bumil KEK.</TableCell></TableRow>)}
    </TableBody></Table></div>
);
  
const BalitaHistoryList = ({ documents, onDelete }: { documents: JumlahBalita[] | null, onDelete: (doc: JumlahBalita) => void }) => (
    <div className="py-4"><Table><TableHeader><TableRow><TableHead>Periode</TableHead><TableHead>Jumlah Laki-laki</TableHead><TableHead>Jumlah Perempuan</TableHead><TableHead>Total</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader><TableBody>
      {documents && documents.length > 0 ? documents.map((item) => (<TableRow key={item.id}><TableCell className="font-medium">{months[Number(item.bulan) - 1]} {item.tahun}</TableCell><TableCell>{item.jumlahLakiLaki}</TableCell><TableCell>{item.jumlahPerempuan}</TableCell><TableCell>{item.jumlahLakiLaki + item.jumlahPerempuan}</TableCell><TableCell className="text-right"><Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => onDelete(item)}><Trash2 className="h-4 w-4" /></Button></TableCell></TableRow>
      )) : (<TableRow><TableCell colSpan={5} className="text-center h-24">Belum ada data jumlah balita.</TableCell></TableRow>)}
    </TableBody></Table></div>
);

const MonevResult = ({ data, isLoading }: { data: Monev[] | null, isLoading: boolean }) => {
    const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
        switch (status) {
            case 'SPJ Lengkap': return 'default';
            case 'SPJ Belum Lengkap': return 'secondary';
            default: return 'outline';
        }
    };
    
    if (isLoading) {
        return <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }
    
    if (!data || data.length === 0) {
        return <p className="text-center text-muted-foreground py-8">Belum ada data Monev dari admin kecamatan untuk tahun ini.</p>;
    }
  
    return (
      <ScrollArea className="h-[60vh]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode Kegiatan</TableHead>
              <TableHead>Kegiatan</TableHead>
              <TableHead>Sumber Dana</TableHead>
              <TableHead>Anggaran</TableHead>
              <TableHead>Realisasi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Catatan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-xs">{item.apbdesCode || '-'}</TableCell>
                <TableCell className="font-medium">{item.activity || '-'}</TableCell>
                <TableCell>{item.fundingSource || '-'}</TableCell>
                <TableCell>{formatCurrency(item.budget)}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(item.realization)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(item.status)} className={item.status === 'SPJ Lengkap' ? 'bg-green-600' : ''}>{item.status}</Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground italic">{item.notes || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    );
};


export default function VillageDashboardPage() {
    const params = useParams();
    const village = params.village as string;
    const { toast } = useToast();
    const firestore = useFirestore();
    const { user } = useUser();
    
    if (!villages.map(v => v.toLowerCase()).includes(village)) { notFound(); }
    const villageName = capitalizeFirstLetter(village);
    const villageKey = village.toLowerCase();

    // Data Fetching
    const villageSettingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'villageSettings', villageKey) : null, [firestore, villageKey]);
    const { data: villageSettings } = useDoc<{spjDriveFolderId?: string, produkHukumDriveFolderId?: string}>(villageSettingsRef);
    
    const spjQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'spjDocuments'), where('village', '==', villageKey)) : null, [firestore, villageKey]);
    const { data: spjData } = useCollection<SpjDocument>(spjQuery);

    const regulationsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'regulations'), where('village', '==', villageKey)) : null, [firestore, villageKey]);
    const { data: regulationsData } = useCollection<RegulationDocument>(regulationsQuery);

    const p3keInterventionsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'p3keInterventions'), where('village', '==', villageKey)) : null, [firestore, villageKey]);
    const { data: p3keData } = useCollection<P3keIntervention>(p3keInterventionsQuery);

    const stuntingQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'stunting'), where('village', '==', villageKey)) : null, [firestore, villageKey]);
    const { data: stuntingData } = useCollection<Stunting>(stuntingQuery);

    const bumilKekQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'bumilKek'), where('village', '==', villageKey)) : null, [firestore, villageKey]);
    const { data: bumilKekData } = useCollection<BumilKek>(bumilKekQuery);

    const balitaQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'jumlahBalita'), where('village', '==', villageKey)) : null, [firestore, villageKey]);
    const { data: balitaData } = useCollection<JumlahBalita>(balitaQuery);
    
    const currentYear = useMemo(() => new Date().getFullYear(), []);
    const prioritasDocId = useMemo(() => `${villageKey}-${currentYear}`, [villageKey, currentYear]);
    const prioritasDocRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'prioritasDanaDesa', prioritasDocId);
    }, [firestore, prioritasDocId]);
    const { data: prioritasData } = useDoc<PrioritasDanaDesa>(prioritasDocRef);
    
    const monevQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'monev'), where('village', '==', villageKey), where('year', '==', currentYear));
    }, [firestore, villageKey, currentYear]);
    const { data: monevData, isLoading: isLoadingMonev } = useCollection<Monev>(monevQuery);


    // State Management
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const [isSpjHistoryOpen, setIsSpjHistoryOpen] = useState(false);
    const [isSpjUploadOpen, setIsSpjUploadOpen] = useState(false);
    const [isProdukHukumHistoryOpen, setIsProdukHukumHistoryOpen] = useState(false);
    const [isProdukHukumUploadOpen, setIsProdukHukumUploadOpen] = useState(false);
    const [isP3keHistoryOpen, setIsP3keHistoryOpen] = useState(false);
    const [isP3keFormOpen, setIsP3keFormOpen] = useState(false);
    const [isKesehatanOpen, setIsKesehatanOpen] = useState(false);
    const [isPrioritasFormOpen, setIsPrioritasFormOpen] = useState(false);
    const [isMonevResultOpen, setIsMonevResultOpen] = useState(false);

    const [spjToDelete, setSpjToDelete] = useState<SpjDocument | null>(null);
    const [isSpjDeleteAlertOpen, setIsSpjDeleteAlertOpen] = useState(false);
    const [produkHukumToDelete, setProdukHukumToDelete] = useState<RegulationDocument | null>(null);
    const [isProdukHukumDeleteAlertOpen, setIsProdukHukumDeleteAlertOpen] = useState(false);
    const [p3keToDelete, setP3keToDelete] = useState<P3keIntervention | null>(null);
    const [isP3keDeleteAlertOpen, setIsP3keDeleteAlertOpen] = useState(false);
    const [stuntingToDelete, setStuntingToDelete] = useState<Stunting | null>(null);
    const [isStuntingDeleteAlertOpen, setIsStuntingDeleteAlertOpen] = useState(false);
    const [bumilKekToDelete, setBumilKekToDelete] = useState<BumilKek | null>(null);
    const [isBumilKekDeleteAlertOpen, setIsBumilKekDeleteAlertOpen] = useState(false);
    const [balitaToDelete, setBalitaToDelete] = useState<JumlahBalita | null>(null);
    const [isBalitaDeleteAlertOpen, setIsBalitaDeleteAlertOpen] = useState(false);
    const [isPrioritasDeleteAlertOpen, setIsPrioritasDeleteAlertOpen] = useState(false);

    // Form State
    const [spjFile, setSpjFile] = useState<File | null>(null);
    const [spjBulan, setSpjBulan] = useState('');
    const [spjBidang, setSpjBidang] = useState('');
    const [spjSumber, setSpjSumber] = useState('');
    const [spjKegiatan, setSpjKegiatan] = useState('');
    
    const [hukumFile, setHukumFile] = useState<File | null>(null);
    const [hukumJenis, setHukumJenis] = useState('');
    const [hukumPerihal, setHukumPerihal] = useState('');
    const [hukumNomor, setHukumNomor] = useState('');

    const [p3keToEdit, setP3keToEdit] = useState<P3keIntervention | null>(null);
    const [jenisIntervensi, setJenisIntervensi] = useState('');
    const [jumlahPenerima, setJumlahPenerima] = useState('');
    const [totalAnggaran, setTotalAnggaran] = useState('');
    const [sumberAnggaran, setSumberAnggaran] = useState('');

    const [stuntingNama, setStuntingNama] = useState('');
    const [stuntingUsia, setStuntingUsia] = useState('');
    const [stuntingTinggi, setStuntingTinggi] = useState('');
    const [stuntingTanggal, setStuntingTanggal] = useState('');

    const [bumilNama, setBumilNama] = useState('');
    const [bumilUsia, setBumilUsia] = useState('');
    const [bumilLila, setBumilLila] = useState('');
    const [bumilTanggal, setBumilTanggal] = useState('');

    const [balitaTahun, setBalitaTahun] = useState(new Date().getFullYear().toString());
    const [balitaBulan, setBalitaBulan] = useState('');
    const [balitaLaki, setBalitaLaki] = useState('');
    const [balitaPerempuan, setBalitaPerempuan] = useState('');
    
    // New state for Prioritas Dana Desa
    const [statusDesa, setStatusDesa] = useState('');
    const [paguDanaDesa, setPaguDanaDesa] = useState('');
    const [bltKpm, setBltKpm] = useState<string>('');
    const [totalBulanBlt, setTotalBulanBlt] = useState('');
    const [bltAnggaran, setBltAnggaran] = useState<string>('');
    const [iklimAnggaran, setIklimAnggaran] = useState<string>('');
    const [kesehatanAnggaran, setKesehatanAnggaran] = useState<string>('');
    const [panganAnggaran, setPanganAnggaran] = useState<string>('');
    const [infrastrukturAnggaran, setInfrastrukturAnggaran] = useState<string>('');
    const [digitalAnggaran, setDigitalAnggaran] = useState<string>('');
    const [jumlahPaguPrioritas, setJumlahPaguPrioritas] = useState('');
    const [jumlahPaguNonPrioritas, setJumlahPaguNonPrioritas] = useState('');


    // Effect to pre-fill form when prioritas data is loaded
    useEffect(() => {
        if (prioritasData) {
            setStatusDesa(prioritasData.statusDesa || '');
            setPaguDanaDesa(String(prioritasData.paguDanaDesa || ''));
            setBltKpm(String(prioritasData.jumlahKpm || ''));
            setTotalBulanBlt(String(prioritasData.totalBulanBlt || ''));
            setBltAnggaran(String(prioritasData.totalAnggaranBlt || ''));
            setIklimAnggaran(String(prioritasData.totalAnggaranIklim || ''));
            setKesehatanAnggaran(String(prioritasData.totalAnggaranKesehatan || ''));
            setPanganAnggaran(String(prioritasData.totalAnggaranPangan || ''));
            setInfrastrukturAnggaran(String(prioritasData.totalAnggaranInfrastruktur || ''));
            setDigitalAnggaran(String(prioritasData.totalAnggaranDigital || ''));
            setJumlahPaguPrioritas(String(prioritasData.jumlahPaguPrioritas || ''));
            setJumlahPaguNonPrioritas(String(prioritasData.jumlahPaguNonPrioritas || ''));
        } else {
            setStatusDesa('');
            setPaguDanaDesa('');
            setBltKpm('');
            setTotalBulanBlt('');
            setBltAnggaran('');
            setIklimAnggaran('');
            setKesehatanAnggaran('');
            setPanganAnggaran('');
            setInfrastrukturAnggaran('');
            setDigitalAnggaran('');
            setJumlahPaguPrioritas('');
            setJumlahPaguNonPrioritas('');
        }
    }, [prioritasData]);


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
                throw new Error(`Kesalahan Skrip Google Apps: ${result.message}. ${result.stack ? 'Stack: ' + result.stack : ''}`);
            }
            return result.fileUrl;
        } catch (error) {
            throw error;
        }
    };
    
    const handleSpjSubmit = async () => {
        if (!spjFile || !spjBulan || !spjBidang || !spjSumber || !spjKegiatan || !user || !firestore) return toast({ variant: "destructive", title: "Data Tidak Lengkap", description: "Harap isi semua kolom dan pilih file." });
        
        const folderId = villageSettings?.spjDriveFolderId;
        if (!folderId) return toast({ variant: "destructive", title: "Folder Tidak Ditemukan", description: "ID Folder Google Drive untuk SPJ belum diatur oleh Admin." });

        setIsSubmitting(true);
        try {
            const extension = spjFile.name.split('.').pop() || 'pdf';
            const desiredFileName = `${spjBidang} | ${spjKegiatan} | ${spjSumber} | ${spjBulan}.${extension}`;

            const fileUrl = await handleFileUpload(spjFile, folderId, desiredFileName);
            await addDoc(collection(firestore, 'spjDocuments'), { village: villageKey, year: new Date().getFullYear(), month: spjBulan, field: spjBidang, activity: spjKegiatan, sourceOfFunds: spjSumber, fileUrl, createdAt: serverTimestamp(), createdBy: user.uid });
            toast({ title: "Sukses!", description: "Dokumen SPJ berhasil diunggah." });
            setIsSpjUploadOpen(false);
        } catch (error: any) {
            console.error(error);
            toast({ variant: "destructive", title: "Gagal Mengunggah", description: error.message });
        } finally { setIsSubmitting(false); }
    };

    const handleProdukHukumSubmit = async () => {
        if (!hukumFile || !hukumJenis || !hukumPerihal || !hukumNomor || !user || !firestore) return toast({ variant: "destructive", title: "Data Tidak Lengkap", description: "Harap isi semua kolom dan pilih file." });
        
        const folderId = villageSettings?.produkHukumDriveFolderId;
        if (!folderId) return toast({ variant: "destructive", title: "Folder Tidak Ditemukan", description: "ID Folder Google Drive untuk Produk Hukum belum diatur oleh Admin." });

        setIsSubmitting(true);
        try {
            const extension = hukumFile.name.split('.').pop() || 'pdf';
            const uploadDate = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
            const desiredFileName = `${hukumJenis} | ${hukumPerihal} | ${uploadDate}.${extension}`;

            const fileUrl = await handleFileUpload(hukumFile, folderId, desiredFileName);
            await addDoc(collection(firestore, 'regulations'), { village: villageKey, type: hukumJenis, about: hukumPerihal, number: hukumNomor, date: new Date().toISOString(), fileUrl, createdAt: serverTimestamp(), createdBy: user.uid });
            toast({ title: "Sukses!", description: "Produk hukum berhasil diunggah." });
            setIsProdukHukumUploadOpen(false);
        } catch (error: any) {
            console.error(error);
            toast({ variant: "destructive", title: "Gagal Mengunggah", description: error.message });
        } finally { setIsSubmitting(false); }
    };

    const handleP3keSubmit = async () => {
        if (!jenisIntervensi || !jumlahPenerima || !totalAnggaran || !sumberAnggaran || !firestore || !user) return toast({ variant: "destructive", title: "Data Tidak Lengkap", description: "Harap isi semua kolom." });

        setIsSubmitting(true);
        try {
            const payload = { village: villageKey, jenisIntervensi, jumlahPenerima, totalAnggaran, sumberAnggaran, updatedBy: user.uid, updatedAt: serverTimestamp() };
            if (p3keToEdit) {
                await updateDoc(doc(firestore, "p3keInterventions", p3keToEdit.id), payload);
                toast({ title: "Sukses!", description: "Data intervensi P3KE telah diperbarui." });
            } else {
                await addDoc(collection(firestore, "p3keInterventions"), { ...payload, createdBy: user.uid, createdAt: serverTimestamp() });
                toast({ title: "Sukses!", description: "Data intervensi P3KE telah disimpan." });
            }
            setIsP3keFormOpen(false); setP3keToEdit(null);
        } catch (error: any) {
            console.error("Error saving P3KE document: ", error);
            toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Terjadi kesalahan saat menyimpan data." });
        } finally { setIsSubmitting(false); }
    };

    const handleOpenP3keAddForm = () => {
        setP3keToEdit(null); setJenisIntervensi(''); setJumlahPenerima(''); setTotalAnggaran(''); setSumberAnggaran('');
        setIsP3keHistoryOpen(false); setIsP3keFormOpen(true);
    };

    const handleP3keEdit = (intervention: P3keIntervention) => {
        setP3keToEdit(intervention); setJenisIntervensi(intervention.jenisIntervensi); setJumlahPenerima(intervention.jumlahPenerima); setTotalAnggaran(intervention.totalAnggaran); setSumberAnggaran(intervention.sumberAnggaran);
        setIsP3keHistoryOpen(false); setIsP3keFormOpen(true);
    };

    const handleHealthSubmit = async (type: 'stunting' | 'bumil' | 'balita') => {
        if (!firestore || !user) return;
        setIsSubmitting(true);
        try {
            if (type === 'stunting') {
                if (!stuntingNama || !stuntingUsia || !stuntingTinggi || !stuntingTanggal) return toast({ variant: 'destructive', title: 'Data Stunting Tidak Lengkap' });
                await addDoc(collection(firestore, 'stunting'), { village: villageKey, namaAnak: stuntingNama, usiaBulan: Number(stuntingUsia), tinggiBadanCm: Number(stuntingTinggi), tanggalPengukuran: stuntingTanggal, createdAt: serverTimestamp(), createdBy: user.uid });
                setStuntingNama(''); setStuntingUsia(''); setStuntingTinggi(''); setStuntingTanggal('');
            } else if (type === 'bumil') {
                if (!bumilNama || !bumilUsia || !bumilLila || !bumilTanggal) return toast({ variant: 'destructive', title: 'Data Bumil KEK Tidak Lengkap' });
                await addDoc(collection(firestore, 'bumilKek'), { village: villageKey, namaIbu: bumilNama, usiaKehamilanMinggu: Number(bumilUsia), lingkarLenganAtasCm: Number(bumilLila), tanggalPemeriksaan: bumilTanggal, createdAt: serverTimestamp(), createdBy: user.uid });
                setBumilNama(''); setBumilUsia(''); setBumilLila(''); setBumilTanggal('');
            } else if (type === 'balita') {
                if (!balitaTahun || !balitaBulan || !balitaLaki || !balitaPerempuan) return toast({ variant: 'destructive', title: 'Data Jumlah Balita Tidak Lengkap' });
                await addDoc(collection(firestore, 'jumlahBalita'), { village: villageKey, tahun: Number(balitaTahun), bulan: balitaBulan, jumlahLakiLaki: Number(balitaLaki), jumlahPerempuan: Number(balitaPerempuan), createdAt: serverTimestamp(), createdBy: user.uid });
                setBalitaLaki(''); setBalitaPerempuan('');
            }
            toast({ title: "Sukses!", description: "Data kesehatan berhasil disimpan." });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Gagal Menyimpan Data', description: e.message });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handlePrioritasSubmit = async () => {
        if (!user || !firestore) {
            toast({ variant: "destructive", title: "Error", description: "Pengguna tidak terautentikasi." });
            return;
        }

        setIsSubmitting(true);
        try {
            const payload: Partial<PrioritasDanaDesa> = {
                statusDesa: statusDesa,
                paguDanaDesa: Number(paguDanaDesa) || 0,
                jumlahKpm: Number(bltKpm) || 0,
                totalBulanBlt: Number(totalBulanBlt) || 0,
                totalAnggaranBlt: Number(bltAnggaran) || 0,
                totalAnggaranIklim: Number(iklimAnggaran) || 0,
                totalAnggaranKesehatan: Number(kesehatanAnggaran) || 0,
                totalAnggaranPangan: Number(panganAnggaran) || 0,
                totalAnggaranInfrastruktur: Number(infrastrukturAnggaran) || 0,
                totalAnggaranDigital: Number(digitalAnggaran) || 0,
                jumlahPaguPrioritas: Number(jumlahPaguPrioritas) || 0,
                jumlahPaguNonPrioritas: Number(jumlahPaguNonPrioritas) || 0,
                updatedAt: serverTimestamp(),
                updatedBy: user.uid,
            };

            const docRef = doc(firestore, 'prioritasDanaDesa', prioritasDocId);

            if (prioritasData) {
                await updateDoc(docRef, payload);
            } else {
                await setDoc(docRef, {
                    ...payload,
                    id: prioritasDocId,
                    village: villageKey,
                    year: currentYear,
                    createdAt: serverTimestamp(),
                    createdBy: user.uid,
                });
            }
            toast({ title: "Sukses!", description: "Data prioritas dana desa berhasil disimpan." });
            setIsPrioritasFormOpen(false);

        } catch (error: any) {
            console.error("Error saving prioritas data: ", error);
            toast({ variant: "destructive", title: "Gagal Menyimpan", description: "Terjadi kesalahan saat menyimpan data." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletePrioritas = async () => {
      if (!firestore || !prioritasDocId) return;
  
      setIsDeleting(true);
      try {
          const docRef = doc(firestore, 'prioritasDanaDesa', prioritasDocId);
          await deleteDoc(docRef);
          toast({ title: "Sukses!", description: `Data prioritas dana desa untuk tahun ${currentYear} telah dihapus.` });
          setIsPrioritasDeleteAlertOpen(false);
      } catch (error: any) {
          toast({ variant: "destructive", title: "Gagal Menghapus", description: "Terjadi kesalahan saat menghapus data." });
      } finally {
          setIsDeleting(false);
      }
    };

    const handleDeleteClick = (doc: any, type: 'spj' | 'hukum' | 'p3ke' | 'stunting' | 'bumil' | 'balita') => {
        if (type === 'spj') { setSpjToDelete(doc as SpjDocument); setIsSpjDeleteAlertOpen(true); }
        else if (type === 'hukum') { setProdukHukumToDelete(doc as RegulationDocument); setIsProdukHukumDeleteAlertOpen(true); }
        else if (type === 'p3ke') { setP3keToDelete(doc as P3keIntervention); setIsP3keDeleteAlertOpen(true); }
        else if (type === 'stunting') { setStuntingToDelete(doc as Stunting); setIsStuntingDeleteAlertOpen(true); }
        else if (type === 'bumil') { setBumilKekToDelete(doc as BumilKek); setIsBumilKekDeleteAlertOpen(true); }
        else if (type === 'balita') { setBalitaToDelete(doc as JumlahBalita); setIsBalitaDeleteAlertOpen(true); }
    };
    
    const confirmDelete = async (type: 'spj' | 'hukum' | 'p3ke' | 'stunting' | 'bumil' | 'balita') => {
        if (!firestore) return;
        setIsDeleting(true);
        let docToDelete: any, collectionName: string, title: string;

        switch(type) {
            case 'spj': docToDelete = spjToDelete; collectionName = 'spjDocuments'; title = 'SPJ'; break;
            case 'hukum': docToDelete = produkHukumToDelete; collectionName = 'regulations'; title = 'Produk Hukum'; break;
            case 'p3ke': docToDelete = p3keToDelete; collectionName = 'p3keInterventions'; title = 'Intervensi P3KE'; break;
            case 'stunting': docToDelete = stuntingToDelete; collectionName = 'stunting'; title = 'Data Stunting'; break;
            case 'bumil': docToDelete = bumilKekToDelete; collectionName = 'bumilKek'; title = 'Data Bumil KEK'; break;
            case 'balita': docToDelete = balitaToDelete; collectionName = 'jumlahBalita'; title = 'Data Jumlah Balita'; break;
            default: setIsDeleting(false); return;
        }

        if (!docToDelete) {
            setIsDeleting(false);
            return;
        }

        try {
            await deleteDoc(doc(firestore, collectionName, docToDelete.id));
            toast({ title: "Sukses!", description: `Dokumen ${title} telah dihapus.` });
        } catch (error: any) {
            console.error(`Error deleting ${title} document: `, error);
            toast({ variant: "destructive", title: "Gagal Menghapus", description: error.message });
        } finally {
            switch(type) {
                case 'spj': setIsSpjDeleteAlertOpen(false); setSpjToDelete(null); break;
                case 'hukum': setIsProdukHukumDeleteAlertOpen(false); setProdukHukumToDelete(null); break;
                case 'p3ke': setIsP3keDeleteAlertOpen(false); setP3keToDelete(null); break;
                case 'stunting': setIsStuntingDeleteAlertOpen(false); setStuntingToDelete(null); break;
                case 'bumil': setIsBumilKekDeleteAlertOpen(false); setBumilKekToDelete(null); break;
                case 'balita': setIsBalitaDeleteAlertOpen(false); setBalitaToDelete(null); break;
            }
            setIsDeleting(false);
        }
    };

    const handlePrintMonev = () => {
        if (!monevData || monevData.length === 0) {
            toast({ variant: 'destructive', title: 'Tidak Ada Data', description: 'Tidak ada data monev untuk dicetak.' });
            return;
        }

        const printContent = `
            <html>
            <head>
                <title>Cetak Hasil Monev - Desa ${villageName}</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        font-size: 10pt; 
                    }
                    @page {
                        size: A4 landscape;
                        margin: 1cm;
                    }
                    h1, h3 { text-align: center; }
                    h1 { margin-bottom: 0.5rem; }
                    h3 { margin-top: 0; margin-bottom: 1.5rem; }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                    }
                    th, td { 
                        border: 1px solid #000; 
                        padding: 8px; 
                        text-align: left; 
                        word-wrap: break-word;
                    }
                    th { 
                        background-color: #f2f2f2; 
                    }
                </style>
            </head>
            <body>
                <h1>Hasil Monitoring dan Evaluasi</h1>
                <h3>Desa: ${villageName} - Tahun: ${currentYear}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Kode Kegiatan</th>
                            <th>Kegiatan</th>
                            <th>Sumber Dana</th>
                            <th>Anggaran</th>
                            <th>Realisasi</th>
                            <th>Status</th>
                            <th>Catatan</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${monevData.map(item => `
                        <tr>
                            <td>${item.apbdesCode || '-'}</td>
                            <td>${item.activity || '-'}</td>
                            <td>${item.fundingSource || '-'}</td>
                            <td>${formatCurrency(item.budget)}</td>
                            <td>${formatCurrency(item.realization)}</td>
                            <td>${item.status || '-'}</td>
                            <td>${item.notes || '-'}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(printContent);
            printWindow.document.close();
            // A timeout is sometimes necessary to allow the document to parse before printing.
            setTimeout(() => {
                printWindow.print();
                printWindow.onafterprint = () => printWindow.close();
            }, 500);
        } else {
            toast({
                variant: "destructive",
                title: "Gagal Membuka Jendela Cetak",
                description: "Browser Anda mungkin memblokir pop-up. Mohon izinkan pop-up untuk situs ini.",
            });
        }
    };

    const DashboardCard = ({ icon, title, description, color, onClick, href }: {
      icon: React.ReactNode;
      title: string;
      description: string;
      color: 'blue' | 'purple' | 'green' | 'orange' | 'indigo' | 'slate';
      onClick?: () => void;
      href?: string;
    }) => {
      const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        purple: 'bg-purple-100 text-purple-600',
        green: 'bg-green-100 text-green-600',
        orange: 'bg-orange-100 text-orange-600',
        indigo: 'bg-indigo-100 text-indigo-600',
        slate: 'bg-slate-100 text-slate-600',
      };
    
      const cardContent = (
        <Card className="flex h-full flex-col rounded-2xl p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
            <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-lg", colorClasses[color])}>
              {icon}
            </div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </Card>
      );
    
      if (href) {
        return <Link href={href} className="flex flex-col">{cardContent}</Link>;
      }
      
      return <div onClick={onClick} className="cursor-pointer flex flex-col">{cardContent}</div>;
    };
    
    const dashboardItems = [
        {
          title: "Dokumen SPJ APBDes",
          description: "Kelola dan arsipkan laporan pertanggungjawaban desa.",
          icon: <FileText className="h-6 w-6" />,
          color: "blue",
          onClick: () => setIsSpjHistoryOpen(true),
        },
        {
          title: "Data APBDes",
          description: "Impor dan sinkronisasi anggaran tahunan desa.",
          icon: <Landmark className="h-6 w-6" />,
          color: "blue",
          href: `/admin/apbdes/${villageKey}`,
        },
        {
          title: "Produk Hukum Desa",
          description: "Arsipkan peraturan dan keputusan desa.",
          icon: <BookOpen className="h-6 w-6" />,
          color: "purple",
          onClick: () => setIsProdukHukumHistoryOpen(true),
        },
        {
          title: "Intervensi P3KE 2026",
          description: "Kelola program pengentasan kemiskinan ekstrem.",
          icon: <ClipboardCheck className="h-6 w-6" />,
          color: "green",
          onClick: () => setIsP3keHistoryOpen(true),
        },
        {
          title: "Data Kesehatan Desa",
          description: "Pantau indikator stunting dan kesehatan keluarga.",
          icon: <HeartPulse className="h-6 w-6" />,
          color: "green",
          onClick: () => setIsKesehatanOpen(true),
        },
        {
          title: "Prioritas Dana Desa",
          description: "Atur fokus penggunaan anggaran desa.",
          icon: <DollarSign className="h-6 w-6" />,
          color: "blue",
          onClick: () => setIsPrioritasFormOpen(true),
        },
        {
          title: "Update Jalan Desa",
          description: "Perbarui data kondisi infrastruktur desa.",
          icon: <MapIcon className="h-6 w-6" />,
          color: "orange",
          href: `/desa/${villageKey}/jalan-desa`,
        },
        {
          title: "Profil Perangkat Desa",
          description: "Kelola data perangkat dan kelembagaan desa.",
          icon: <Users className="h-6 w-6" />,
          color: "slate",
          href: `/desa/${villageKey}/profil-perangkat`,
        },
        {
          title: "Hasil Monitoring & Evaluasi",
          description: "Tinjau hasil evaluasi dari kecamatan.",
          icon: <BarChart2 className="h-6 w-6" />,
          color: "indigo",
          onClick: () => setIsMonevResultOpen(true),
        },
    ];

    return (
      <AuthGuard>
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline">Dashboard Operator Desa ${villageName}</h1>
                <p className="text-muted-foreground">Selamat datang! Kelola data dan laporan desa Anda di sini.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {dashboardItems.map((item, index) => (
                <DashboardCard
                  key={index}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                  color={item.color as any}
                  onClick={item.onClick}
                  href={item.href}
                />
              ))}
            </div>
        </div>

        <Dialog open={isSpjHistoryOpen} onOpenChange={setIsSpjHistoryOpen}>
            <DialogContent className="sm:max-w-4xl"><DialogHeader><DialogTitle>Riwayat Upload SPJ APBDes</DialogTitle><DialogDescription>Daftar dokumen SPJ yang telah diunggah.</DialogDescription></DialogHeader><div className="flex justify-end"><Button onClick={() => { setIsSpjHistoryOpen(false); setIsSpjUploadOpen(true); }}><PlusCircle className="mr-2 h-4 w-4" />Upload SPJ</Button></div><SpjHistoryList documents={spjData} onDelete={(doc) => handleDeleteClick(doc, 'spj')}/></DialogContent>
        </Dialog>
        <Dialog open={isSpjUploadOpen} onOpenChange={setIsSpjUploadOpen}>
            <DialogContent><DialogHeader><DialogTitle>Upload Dokumen SPJ APBDes</DialogTitle><DialogDescription>Isi formulir untuk mengunggah SPJ.</DialogDescription></DialogHeader><div className="grid grid-cols-2 gap-x-4 gap-y-4 py-4"><div className="col-span-2 space-y-2"><Label htmlFor="bulan">Bulan</Label><Select onValueChange={setSpjBulan}><SelectTrigger id="bulan"><SelectValue placeholder="Pilih bulan..." /></SelectTrigger><SelectContent>{months.map((m) => (<SelectItem key={m} value={m.toLowerCase()}>{m}</SelectItem>))}</SelectContent></Select></div><div className="space-y-2"><Label htmlFor="bidang">Bidang</Label><Select onValueChange={setSpjBidang}><SelectTrigger id="bidang"><SelectValue placeholder="Pilih bidang..." /></SelectTrigger><SelectContent><SelectItem value="pemerintahan">Penyelenggaraan Pemerintahan Desa</SelectItem><SelectItem value="pembangunan">Pelaksanaan Pembangunan Desa</SelectItem><SelectItem value="pembinaan">Pembinaan Kemasyarakatan</SelectItem><SelectItem value="pemberdayaan">Pemberdayaan Masyarakat</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label htmlFor="sumber-anggaran">Sumber Anggaran</Label><Select onValueChange={setSpjSumber}><SelectTrigger id="sumber-anggaran"><SelectValue placeholder="Pilih sumber..." /></SelectTrigger><SelectContent><SelectItem value="dds">Dana Desa (DDS)</SelectItem><SelectItem value="add">Alokasi Dana Desa (ADD)</SelectItem><SelectItem value="pad">Pendapatan Asli Desa (PAD)</SelectItem><SelectItem value="lainnya">Lainnya</SelectItem></SelectContent></Select></div><div className="col-span-2 space-y-2"><Label htmlFor="jenis-kegiatan">Jenis Kegiatan</Label><Input id="jenis-kegiatan" placeholder="Contoh: Pembangunan Jalan Usaha Tani" onChange={(e) => setSpjKegiatan(e.target.value)} /></div><div className="col-span-2 space-y-2"><Label htmlFor="spj-file">File Dokumen SPJ (PDF)</Label><Input id="spj-file" type="file" className="cursor-pointer" accept="application/pdf" onChange={(e) => setSpjFile(e.target.files?.[0] || null)} /></div><div className="col-span-2 pt-2"><Button className="w-full" onClick={handleSpjSubmit} disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengunggah...</> : <><Upload className="mr-2 h-4 w-4" />Upload SPJ</>}</Button></div></div></DialogContent>
        </Dialog>
        <AlertDialog open={isSpjDeleteAlertOpen} onOpenChange={setIsSpjDeleteAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Anda Yakin?</AlertDialogTitle><AlertDialogDescription>Tindakan ini akan menghapus dokumen SPJ untuk kegiatan <span className="font-bold">{spjToDelete?.activity}</span> secara permanen.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel><AlertDialogAction onClick={() => confirmDelete('spj')} className={cn(buttonVariants({ variant: "destructive" }))} disabled={isDeleting}>{isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Hapus</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>

        <Dialog open={isProdukHukumHistoryOpen} onOpenChange={setIsProdukHukumHistoryOpen}>
          <DialogContent className="sm:max-w-4xl"><DialogHeader><DialogTitle>Riwayat Upload Produk Hukum</DialogTitle><DialogDescription>Daftar dokumen hukum yang telah diunggah.</DialogDescription></DialogHeader><div className="flex justify-end"><Button onClick={() => { setIsProdukHukumHistoryOpen(false); setIsProdukHukumUploadOpen(true); }}><PlusCircle className="mr-2 h-4 w-4" />Upload Produk Hukum</Button></div><ProdukHukumHistoryList documents={regulationsData} onDelete={(doc) => handleDeleteClick(doc, 'hukum')} /></DialogContent>
        </Dialog>
        <Dialog open={isProdukHukumUploadOpen} onOpenChange={setIsProdukHukumUploadOpen}>
            <DialogContent><DialogHeader><DialogTitle>Upload Produk Hukum</DialogTitle><DialogDescription>Isi formulir untuk mengunggah dokumen.</DialogDescription></DialogHeader><div className="grid grid-cols-2 gap-x-4 gap-y-4 py-4"><div className="col-span-2 space-y-2"><Label htmlFor="jenis-regulasi">Jenis Regulasi</Label><Select onValueChange={setHukumJenis}><SelectTrigger id="jenis-regulasi"><SelectValue placeholder="Pilih jenis..." /></SelectTrigger><SelectContent><SelectItem value="Perdes">Perdes</SelectItem><SelectItem value="Perkades">Perkades</SelectItem><SelectItem value="SK">SK</SelectItem></SelectContent></Select></div><div className="col-span-2 sm:col-span-1 space-y-2"><Label htmlFor="perihal-dokumen">Perihal Dokumen</Label><Input id="perihal-dokumen" placeholder="Contoh: Penjabaran APBDes 2024" onChange={(e) => setHukumPerihal(e.target.value)} /></div><div className="col-span-2 sm:col-span-1 space-y-2"><Label htmlFor="nomor-dokumen">Nomor Dokumen</Label><Input id="nomor-dokumen" placeholder="Contoh: 141/05/TAHUN 2024" onChange={(e) => setHukumNomor(e.target.value)}/></div><div className="col-span-2 space-y-2"><Label htmlFor="regulasi-file">File Dokumen (PDF)</Label><Input id="regulasi-file" type="file" className="cursor-pointer" accept="application/pdf" onChange={(e) => setHukumFile(e.target.files?.[0] || null)} /></div><div className="col-span-2 pt-2"><Button className="w-full" onClick={handleProdukHukumSubmit} disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Mengunggah...</> : <><Upload className="mr-2 h-4 w-4" />Upload Dokumen</>}</Button></div></div></DialogContent>
        </Dialog>
        <AlertDialog open={isProdukHukumDeleteAlertOpen} onOpenChange={setIsProdukHukumDeleteAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Anda Yakin?</AlertDialogTitle><AlertDialogDescription>Tindakan ini akan menghapus produk hukum <span className="font-bold">{produkHukumToDelete?.about}</span> secara permanen.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel><AlertDialogAction onClick={() => confirmDelete('hukum')} className={cn(buttonVariants({ variant: "destructive" }))} disabled={isDeleting}>{isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Hapus</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>

        <Dialog open={isP3keHistoryOpen} onOpenChange={setIsP3keHistoryOpen}>
          <DialogContent className="sm:max-w-4xl"><DialogHeader><DialogTitle>Riwayat Intervensi P3KE</DialogTitle><DialogDescription>Daftar intervensi P3KE yang telah diinput.</DialogDescription></DialogHeader><div className="flex justify-end"><Button onClick={handleOpenP3keAddForm}><PlusCircle className="mr-2 h-4 w-4" />Input Intervensi</Button></div><P3keHistoryList interventions={p3keData} onEdit={handleP3keEdit} onDelete={(doc) => handleDeleteClick(doc, 'p3ke')} /></DialogContent>
        </Dialog>
        <Dialog open={isP3keFormOpen} onOpenChange={(isOpen) => { if (!isOpen) setP3keToEdit(null); setIsP3keFormOpen(isOpen); }}>
            <DialogContent><DialogHeader><DialogTitle>{p3keToEdit ? 'Edit Intervensi P3KE' : 'Input Intervensi P3KE'}</DialogTitle><DialogDescription>{p3keToEdit ? 'Perbarui data intervensi.' : 'Isi formulir untuk data intervensi baru.'}</DialogDescription></DialogHeader><div className="grid grid-cols-1 gap-y-4 py-4"><div className="space-y-2"><Label htmlFor="jenis-intervensi">Jenis Intervensi</Label><Input id="jenis-intervensi" placeholder="Contoh: Jambanisasi" value={jenisIntervensi} onChange={(e) => setJenisIntervensi(e.target.value)} /></div><div className="space-y-2"><Label htmlFor="jumlah-penerima">Jumlah Penerima</Label><Input id="jumlah-penerima" placeholder="Contoh: 5 orang" value={jumlahPenerima} onChange={(e) => setJumlahPenerima(e.target.value)} /></div><div className="space-y-2"><Label htmlFor="total-anggaran-p3ke">Total Anggaran</Label><Input id="total-anggaran-p3ke" placeholder="Rp 15.000.000" value={totalAnggaran} onChange={(e) => setTotalAnggaran(e.target.value)} /></div><div className="space-y-2"><Label htmlFor="sumber-anggaran-p3ke">Sumber Anggaran</Label><Select onValueChange={setSumberAnggaran} value={sumberAnggaran}><SelectTrigger id="sumber-anggaran-p3ke"><SelectValue placeholder="Pilih sumber..." /></SelectTrigger><SelectContent><SelectItem value="Dana Desa">Dana Desa</SelectItem><SelectItem value="Bansus">Bansus</SelectItem><SelectItem value="Banprov">Banprov</SelectItem><SelectItem value="Pokir">Pokir</SelectItem><SelectItem value="APBN">APBN</SelectItem><SelectItem value="CSR">CSR</SelectItem><SelectItem value="Sumber Lainnya">Sumber Lainnya</SelectItem></SelectContent></Select></div><div className="pt-2"><Button onClick={handleP3keSubmit} disabled={isSubmitting} className="w-full">{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : <><PlusCircle className="mr-2 h-4 w-4" />{p3keToEdit ? 'Simpan Perubahan' : 'Simpan Intervensi'}</>}</Button></div></div></DialogContent>
        </Dialog>
        <AlertDialog open={isP3keDeleteAlertOpen} onOpenChange={setIsP3keDeleteAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Anda yakin?</AlertDialogTitle><AlertDialogDescription>Tindakan ini akan menghapus intervensi <span className="font-bold">{p3keToDelete?.jenisIntervensi}</span> secara permanen.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel><AlertDialogAction onClick={() => confirmDelete('p3ke')} className={cn(buttonVariants({ variant: "destructive" }))} disabled={isDeleting}>{isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Hapus</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      
        <Dialog open={isKesehatanOpen} onOpenChange={setIsKesehatanOpen}>
            <DialogContent className="sm:max-w-4xl"><DialogHeader><DialogTitle>Kelola Data Kesehatan</DialogTitle><DialogDescription>Pilih jenis data untuk diinput atau dilihat riwayatnya.</DialogDescription></DialogHeader>
            <Tabs defaultValue="stunting" className="w-full pt-4">
                <TabsList className="grid w-full grid-cols-3"><TabsTrigger value="stunting">Stunting</TabsTrigger><TabsTrigger value="bumil-kek">Ibu Hamil KEK</TabsTrigger><TabsTrigger value="balita">Jumlah Balita</TabsTrigger></TabsList>
                <TabsContent value="stunting" className="mt-4"><Card><CardHeader><CardTitle>Input Data Stunting</CardTitle></CardHeader><CardContent><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Nama Anak</Label><Input value={stuntingNama} onChange={e => setStuntingNama(e.target.value)} placeholder="Nama lengkap anak"/></div><div className="space-y-2"><Label>Tanggal Pengukuran</Label><Input value={stuntingTanggal} onChange={e => setStuntingTanggal(e.target.value)} placeholder="DD-MM-YYYY"/></div><div className="space-y-2"><Label>Usia (Bulan)</Label><Input value={stuntingUsia} onChange={e => setStuntingUsia(e.target.value)} type="number" placeholder="Contoh: 24"/></div><div className="space-y-2"><Label>Tinggi Badan (cm)</Label><Input value={stuntingTinggi} onChange={e => setStuntingTinggi(e.target.value)} type="number" placeholder="Contoh: 85.5"/></div></div><Button onClick={() => handleHealthSubmit('stunting')} disabled={isSubmitting} className="mt-4 w-full">{isSubmitting ? <Loader2 className="animate-spin mr-2"/> : <PlusCircle className="mr-2"/>}Simpan Data Stunting</Button><StuntingHistoryList documents={stuntingData} onDelete={doc => handleDeleteClick(doc, 'stunting')} /></CardContent></Card></TabsContent>
                <TabsContent value="bumil-kek" className="mt-4"><Card><CardHeader><CardTitle>Input Data Ibu Hamil KEK</CardTitle></CardHeader><CardContent><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Nama Ibu</Label><Input value={bumilNama} onChange={e => setBumilNama(e.target.value)} placeholder="Nama lengkap ibu"/></div><div className="space-y-2"><Label>Tanggal Pemeriksaan</Label><Input value={bumilTanggal} onChange={e => setBumilTanggal(e.target.value)} placeholder="DD-MM-YYYY"/></div><div className="space-y-2"><Label>Usia Kehamilan (Minggu)</Label><Input value={bumilUsia} onChange={e => setBumilUsia(e.target.value)} type="number" placeholder="Contoh: 20"/></div><div className="space-y-2"><Label>Lingkar Lengan Atas (cm)</Label><Input value={bumilLila} onChange={e => setBumilLila(e.target.value)} type="number" placeholder="Contoh: 22.5"/></div></div><Button onClick={() => handleHealthSubmit('bumil')} disabled={isSubmitting} className="mt-4 w-full">{isSubmitting ? <Loader2 className="animate-spin mr-2"/> : <PlusCircle className="mr-2"/>}Simpan Data Bumil KEK</Button><BumilKekHistoryList documents={bumilKekData} onDelete={doc => handleDeleteClick(doc, 'bumil')} /></CardContent></Card></TabsContent>
                <TabsContent value="balita" className="mt-4"><Card><CardHeader><CardTitle>Input Data Jumlah Balita</CardTitle></CardHeader><CardContent><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Tahun</Label><Input value={balitaTahun} onChange={e => setBalitaTahun(e.target.value)} type="number"/></div><div className="space-y-2"><Label>Bulan</Label><Select value={balitaBulan} onValueChange={setBalitaBulan}><SelectTrigger><SelectValue placeholder="Pilih bulan..."/></SelectTrigger><SelectContent>{months.map((m, i) => (<SelectItem key={m} value={(i+1).toString()}>{m}</SelectItem>))}</SelectContent></Select></div><div className="space-y-2"><Label>Jumlah Laki-laki</Label><Input value={balitaLaki} onChange={e => setBalitaLaki(e.target.value)} type="number" placeholder="0"/></div><div className="space-y-2"><Label>Jumlah Perempuan</Label><Input value={balitaPerempuan} onChange={e => setBalitaPerempuan(e.target.value)} type="number" placeholder="0"/></div></div><Button onClick={() => handleHealthSubmit('balita')} disabled={isSubmitting} className="mt-4 w-full">{isSubmitting ? <Loader2 className="animate-spin mr-2"/> : <PlusCircle className="mr-2"/>}Simpan Jumlah Balita</Button><BalitaHistoryList documents={balitaData} onDelete={doc => handleDeleteClick(doc, 'balita')} /></CardContent></Card></TabsContent>
            </Tabs>
            </DialogContent>
        </Dialog>
        
        <Dialog open={isPrioritasFormOpen} onOpenChange={setIsPrioritasFormOpen}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Prioritas Dana Desa ${currentYear}</DialogTitle>
                    <DialogDescription>Input atau perbarui alokasi anggaran untuk ${villageName}.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[70vh] pr-6">
                    <div className="space-y-6 pr-2">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label htmlFor="statusDesa">Status Desa</Label><Input id="statusDesa" placeholder="Maju, Berkembang, dll." value={statusDesa} onChange={(e) => setStatusDesa(e.target.value)} /></div>
                            <div className="space-y-2"><Label htmlFor="paguDanaDesa">Pagu Dana Desa Reguler</Label><Input id="paguDanaDesa" type="number" placeholder="0" value={paguDanaDesa} onChange={(e) => setPaguDanaDesa(e.target.value)} /></div>
                        </div>
                        <Card>
                            <CardHeader><CardTitle>BLT DD</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2"><Label htmlFor="bltKpm">Jumlah KPM</Label><Input id="bltKpm" type="number" placeholder="0" value={bltKpm} onChange={(e) => setBltKpm(e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="totalBulanBlt">Total Bulan</Label><Input id="totalBulanBlt" type="number" placeholder="0" value={totalBulanBlt} onChange={(e) => setTotalBulanBlt(e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="bltAnggaran">Total Anggaran BLT</Label><Input id="bltAnggaran" type="number" placeholder="0" value={bltAnggaran} onChange={(e) => setBltAnggaran(e.target.value)} /></div>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>Alokasi Prioritas</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2"><Label htmlFor="iklimAnggaran">Ketahanan Iklim</Label><Input id="iklimAnggaran" type="number" placeholder="Total Anggaran" value={iklimAnggaran} onChange={(e) => setIklimAnggaran(e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="kesehatanAnggaran">Layanan Kesehatan</Label><Input id="kesehatanAnggaran" type="number" placeholder="Total Anggaran" value={kesehatanAnggaran} onChange={(e) => setKesehatanAnggaran(e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="panganAnggaran">Ketahanan Pangan</Label><Input id="panganAnggaran" type="number" placeholder="Total Anggaran" value={panganAnggaran} onChange={(e) => setPanganAnggaran(e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="infrastrukturAnggaran">Infrastruktur PKTD</Label><Input id="infrastrukturAnggaran" type="number" placeholder="Total Anggaran" value={infrastrukturAnggaran} onChange={(e) => setInfrastrukturAnggaran(e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="digitalAnggaran">Infrastruktur Digital</Label><Input id="digitalAnggaran" type="number" placeholder="Total Anggaran" value={digitalAnggaran} onChange={(e) => setDigitalAnggaran(e.target.value)} /></div>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>Jumlah Pagu</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               <div className="space-y-2"><Label htmlFor="jumlahPaguPrioritas">Jumlah Pagu Prioritas</Label><Input id="jumlahPaguPrioritas" type="number" placeholder="0" value={jumlahPaguPrioritas} onChange={(e) => setJumlahPaguPrioritas(e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="jumlahPaguNonPrioritas">Jumlah Pagu Non Prioritas</Label><Input id="jumlahPaguNonPrioritas" type="number" placeholder="0" value={jumlahPaguNonPrioritas} onChange={(e) => setJumlahPaguNonPrioritas(e.target.value)} /></div>
                            </CardContent>
                        </Card>
                    </div>
                </ScrollArea>
                <DialogFooter className="pt-4 mt-4 border-t sm:justify-between">
                    <div>
                        {prioritasData && (
                            <Button
                                variant="destructive"
                                onClick={() => setIsPrioritasDeleteAlertOpen(true)}
                                disabled={isSubmitting}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus Data Tahun Ini
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsPrioritasFormOpen(false)}>Batal</Button>
                        <Button onClick={handlePrioritasSubmit} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <PlusCircle className="mr-2 h-4 w-4" />}
                            {prioritasData ? 'Simpan Perubahan' : 'Simpan Data'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog open={isMonevResultOpen} onOpenChange={setIsMonevResultOpen}>
          <DialogContent className="sm:max-w-4xl">
              <DialogHeader>
                  <DialogTitle>Hasil Monitoring dan Evaluasi</DialogTitle>
                  <DialogDescription>Berikut adalah status realisasi kegiatan terbaru dari admin kecamatan.</DialogDescription>
              </DialogHeader>
              <MonevResult data={monevData} isLoading={isLoadingMonev} />
              <DialogFooter className="pt-4">
                  <Button type="button" onClick={handlePrintMonev}><Printer className="mr-2 h-4 w-4"/>Cetak</Button>
              </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isPrioritasDeleteAlertOpen} onOpenChange={setIsPrioritasDeleteAlertOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Anda Yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                    Tindakan ini akan menghapus data Prioritas Dana Desa untuk tahun ${currentYear} secara permanen. Data ini tidak dapat dipulihkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeletePrioritas} disabled={isDeleting} className={cn(buttonVariants({ variant: "destructive" }))}>
                        {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Hapus'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={isStuntingDeleteAlertOpen} onOpenChange={setIsStuntingDeleteAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Anda Yakin?</AlertDialogTitle><AlertDialogDescription>Tindakan ini akan menghapus data stunting untuk anak <span className="font-bold">{stuntingToDelete?.namaAnak}</span> secara permanen.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel><AlertDialogAction onClick={() => confirmDelete('stunting')} className={cn(buttonVariants({ variant: "destructive" }))} disabled={isDeleting}>{isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Hapus</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
        <AlertDialog open={isBumilKekDeleteAlertOpen} onOpenChange={setIsBumilKekDeleteAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Anda Yakin?</AlertDialogTitle><AlertDialogDescription>Tindakan ini akan menghapus data Bumil KEK untuk <span className="font-bold">{bumilKekToDelete?.namaIbu}</span> secara permanen.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel><AlertDialogAction onClick={() => confirmDelete('bumil')} className={cn(buttonVariants({ variant: "destructive" }))} disabled={isDeleting}>{isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Hapus</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
        <AlertDialog open={isBalitaDeleteAlertOpen} onOpenChange={setIsBalitaDeleteAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Anda Yakin?</AlertDialogTitle><AlertDialogDescription>Tindakan ini akan menghapus data jumlah balita untuk periode <span className="font-bold">{months[Number(balitaToDelete?.bulan)-1]} {balitaToDelete?.tahun}</span> secara permanen.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel><AlertDialogAction onClick={() => confirmDelete('balita')} className={cn(buttonVariants({ variant: "destructive" }))} disabled={isDeleting}>{isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Hapus</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      </AuthGuard>
    );
}

    
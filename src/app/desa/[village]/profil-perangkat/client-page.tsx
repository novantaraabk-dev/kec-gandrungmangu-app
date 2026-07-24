'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Calendar, Briefcase, Hash, Scroll, Building, UserCheck, Pencil, Trash2, PlusCircle, ShieldCheck, Award, Loader2 } from 'lucide-react';
import { type Perangkat, type BpdMember, type RtRwMember } from '@/lib/perangkat-data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
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
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PerangkatForm } from '@/components/perangkat/perangkat-form';
import { BpdForm } from '@/components/perangkat/bpd-form';
import { RtRwForm } from '@/components/perangkat/rt-rw-form';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

function capitalizeFirstLetter(string: string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value?: React.ReactNode }) {
  if (!value || value === '' || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="flex items-start gap-4">
      <div className="text-muted-foreground flex-shrink-0 w-5 h-5 pt-1">{icon}</div>
      <div className="flex-grow">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-base text-foreground leading-snug">{value}</p>
      </div>
    </div>
  );
}

function ProfileCard({ perangkat, onEdit, onDelete }: { perangkat: Perangkat; onEdit: (p: Perangkat) => void; onDelete: (p: Perangkat) => void; }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col group min-h-[140px] items-center justify-center p-4 text-center rounded-2xl shadow-sm">
          <h3 className="font-headline font-bold text-lg text-foreground group-hover:text-primary transition-colors">{perangkat.name}</h3>
          <p className="text-sm text-muted-foreground">{perangkat.title}</p>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="font-headline text-3xl font-bold">{perangkat.name}</DialogTitle>
          <DialogDescription className="text-xl text-primary font-medium pt-1">{perangkat.title}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 py-6">
          <DetailItem icon={<User />} label="Jenis Kelamin" value={perangkat.gender === 'L' ? 'Laki-laki' : perangkat.gender === 'P' ? 'Perempuan' : perangkat.gender} />
          <DetailItem icon={<Calendar />} label="Tempat, Tgl Lahir" value={perangkat.birthPlace && perangkat.birthDate ? `${perangkat.birthPlace}, ${perangkat.birthDate}`: perangkat.birthPlace || perangkat.birthDate} />
          <DetailItem icon={<UserCheck />} label="Umur" value={perangkat.age} />
          <DetailItem icon={<Building />} label="Pendidikan" value={perangkat.education} />
          <DetailItem icon={<Scroll />} label="Agama" value={perangkat.religion} />
          <DetailItem icon={<Hash />} label="No. SK Pengangkatan" value={perangkat.skNumber} />
          <DetailItem icon={<Calendar />} label="Tgl. SK Pengangkatan" value={perangkat.skDate} />
          <DetailItem icon={<Calendar />} label="Tgl. Pelantikan" value={perangkat.inaugurationDate} />
          <DetailItem icon={<Briefcase />} label="Masa Kerja" value={perangkat.workPeriod} />
          <DetailItem icon={<Calendar />} label="Pensiun" value={perangkat.retirementDate} />
          <DetailItem icon={<Briefcase />} label="Sisa Masa Kerja" value={perangkat.remainingWorkPeriod} />
        </div>
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="outline" onClick={() => onEdit(perangkat)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={() => onDelete(perangkat)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BpdProfileCard({ member, onEdit, onDelete }: { member: BpdMember; onEdit: (m: BpdMember) => void; onDelete: (m: BpdMember) => void; }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col group min-h-[140px] items-center justify-center p-4 text-center rounded-2xl shadow-sm">
          <h3 className="font-headline font-bold text-lg text-foreground group-hover:text-primary transition-colors">{member.name}</h3>
          <p className="text-sm text-primary font-semibold">{member.status}</p>
          <p className="text-xs text-muted-foreground">{member.bpdStatus}</p>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="font-headline text-3xl font-bold">{member.name}</DialogTitle>
          <DialogDescription className="text-xl text-primary font-medium pt-1">{member.status}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 py-6">
          <DetailItem icon={<ShieldCheck />} label="Status BPD" value={member.bpdStatus} />
          <DetailItem icon={<Award />} label="Jabatan BPD" value={member.status} />
          <DetailItem icon={<Calendar />} label="Tempat, Tgl Lahir" value={member.birthPlace && member.birthDate ? `${member.birthPlace}, ${member.birthDate}` : member.birthPlace || member.birthDate} />
          <DetailItem icon={<Building />} label="Pendidikan" value={member.education} />
          <DetailItem icon={<Scroll />} label="Agama" value={member.religion} />
          <DetailItem icon={<Briefcase />} label="Pekerjaan" value={member.occupation} />
          <DetailItem icon={<Hash />} label="No. SK Bupati" value={member.skNumber} />
          <DetailItem icon={<Calendar />} label="Tanggal SK" value={member.skDate} />
          <DetailItem icon={<Calendar />} label="Periode Jabatan" value={member.tenurePeriod} />
        </div>
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="outline" onClick={() => onEdit(member)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={() => onDelete(member)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function ProfilPerangkatClientPage({ village }: { village: string }) {
  const { toast } = useToast();
  const villageKey = village.toLowerCase();
  const villageTitle = capitalizeFirstLetter(village);
  const firestore = useFirestore();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Firestore Data ---
  const perangkatQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'perangkat'), where('village', '==', villageKey));
  }, [firestore, villageKey]);
  const { data: perangkatList, isLoading: isLoadingPerangkat } = useCollection<Perangkat>(perangkatQuery);

  const bpdQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'bpd'), where('village', '==', villageKey));
  }, [firestore, villageKey]);
  const { data: bpdList, isLoading: isLoadingBpd } = useCollection<BpdMember>(bpdQuery);

  const rtRwQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'rtRw'), where('village', '==', villageKey));
  }, [firestore, villageKey]);
  const { data: rtRwList, isLoading: isLoadingRtRw } = useCollection<RtRwMember>(rtRwQuery);

  const rtRwGroupedByDusun = useMemo(() => {
    if (!rtRwList) return {};
    return rtRwList.reduce((acc, member) => {
      const { dusun } = member;
      if (!dusun) return acc;
      if (!acc[dusun]) {
        acc[dusun] = [];
      }
      acc[dusun].push(member);
      return acc;
    }, {} as Record<string, RtRwMember[]>);
  }, [rtRwList]);

  // --- State for Dialogs and Forms ---
  const [perangkatDialogMode, setPerangkatDialogMode] = useState<'edit' | 'add' | null>(null);
  const [selectedPerangkat, setSelectedPerangkat] = useState<Perangkat | null>(null);
  const [isPerangkatConfirmDeleteDialogOpen, setIsPerangkatConfirmDeleteDialogOpen] = useState(false);

  const [bpdDialogMode, setBpdDialogMode] = useState<'edit' | 'add' | null>(null);
  const [selectedBpdMember, setSelectedBpdMember] = useState<BpdMember | null>(null);
  const [isBpdConfirmDeleteDialogOpen, setIsBpdConfirmDeleteDialogOpen] = useState(false);

  const [rtRwDialogMode, setRtRwDialogMode] = useState<'edit' | 'add' | null>(null);
  const [selectedRtRwMember, setSelectedRtRwMember] = useState<RtRwMember | null>(null);
  const [isRtRwConfirmDeleteDialogOpen, setIsRtRwConfirmDeleteDialogOpen] = useState(false);

  // --- Handlers for Perangkat Desa ---
  const handlePerangkatEditClick = (perangkat: Perangkat) => {
    setSelectedPerangkat(perangkat);
    setPerangkatDialogMode('edit');
  };
  const handlePerangkatAddClick = () => {
    setSelectedPerangkat(null);
    setPerangkatDialogMode('add');
  };
  const handlePerangkatDeleteClick = (perangkat: Perangkat) => {
    setSelectedPerangkat(perangkat);
    setIsPerangkatConfirmDeleteDialogOpen(true);
  };
  const confirmPerangkatDelete = async () => {
    if (!selectedPerangkat || !firestore) return;
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(firestore, "perangkat", selectedPerangkat.id));
      toast({ title: "Berhasil", description: `Data untuk ${selectedPerangkat.name} telah dihapus.` });
    } catch (error) {
      console.error("Error deleting perangkat:", error);
      toast({ variant: "destructive", title: "Gagal", description: "Gagal menghapus data perangkat." });
    } finally {
      setIsPerangkatConfirmDeleteDialogOpen(false);
      setSelectedPerangkat(null);
      setIsSubmitting(false);
    }
  };
  const handlePerangkatFormSubmit = async (data: any) => {
    if (!firestore || !user) return;
    setIsSubmitting(true);
    try {
      if (perangkatDialogMode === 'edit' && selectedPerangkat) {
        const docRef = doc(firestore, "perangkat", selectedPerangkat.id);
        await updateDoc(docRef, { ...data, updatedAt: serverTimestamp(), updatedBy: user.uid });
        toast({ title: "Berhasil", description: `Data untuk ${data.name} telah diperbarui.` });
      } else {
        await addDoc(collection(firestore, "perangkat"), { ...data, village: villageKey, createdAt: serverTimestamp(), createdBy: user.uid });
        toast({ title: "Berhasil", description: `Data untuk ${data.name} telah ditambahkan.` });
      }
      setPerangkatDialogMode(null);
      setSelectedPerangkat(null);
    } catch (error) {
      console.error("Error saving perangkat:", error);
      toast({ variant: "destructive", title: "Gagal", description: "Gagal menyimpan data perangkat." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Handlers for BPD ---
  const handleBpdEditClick = (member: BpdMember) => {
    setSelectedBpdMember(member);
    setBpdDialogMode('edit');
  };
  const handleBpdAddClick = () => {
    setSelectedBpdMember(null);
    setBpdDialogMode('add');
  };
  const handleBpdDeleteClick = (member: BpdMember) => {
    setSelectedBpdMember(member);
    setIsBpdConfirmDeleteDialogOpen(true);
  };
  const confirmBpdDelete = async () => {
    if (!selectedBpdMember || !firestore) return;
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(firestore, "bpd", selectedBpdMember.id));
      toast({ title: "Berhasil", description: `Data BPD untuk ${selectedBpdMember.name} telah dihapus.` });
    } catch (error) {
      console.error("Error deleting BPD member:", error);
      toast({ variant: "destructive", title: "Gagal", description: "Gagal menghapus data BPD." });
    } finally {
      setIsBpdConfirmDeleteDialogOpen(false);
      setSelectedBpdMember(null);
      setIsSubmitting(false);
    }
  };
  const handleBpdFormSubmit = async (data: any) => {
     if (!firestore || !user) return;
    setIsSubmitting(true);
    try {
      if (bpdDialogMode === 'edit' && selectedBpdMember) {
        const docRef = doc(firestore, "bpd", selectedBpdMember.id);
        await updateDoc(docRef, { ...data, updatedAt: serverTimestamp(), updatedBy: user.uid });
        toast({ title: "Berhasil", description: `Data BPD untuk ${data.name} telah diperbarui.` });
      } else {
        await addDoc(collection(firestore, "bpd"), { ...data, village: villageKey, createdAt: serverTimestamp(), createdBy: user.uid });
        toast({ title: "Berhasil", description: `Data BPD untuk ${data.name} telah ditambahkan.` });
      }
      setBpdDialogMode(null);
      setSelectedBpdMember(null);
    } catch (error) {
       console.error("Error saving BPD member:", error);
       toast({ variant: "destructive", title: "Gagal", description: "Gagal menyimpan data BPD." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Handlers for RT/RW ---
  const handleRtRwEditClick = (member: RtRwMember) => {
    setSelectedRtRwMember(member);
    setRtRwDialogMode('edit');
  };
  const handleRtRwAddClick = () => {
    setSelectedRtRwMember(null);
    setRtRwDialogMode('add');
  };
  const handleRtRwDeleteClick = (member: RtRwMember) => {
    setSelectedRtRwMember(member);
    setIsRtRwConfirmDeleteDialogOpen(true);
  };
  const confirmRtRwDelete = async () => {
    if (!selectedRtRwMember || !firestore) return;
    setIsSubmitting(true);
    try {
      await deleteDoc(doc(firestore, "rtRw", selectedRtRwMember.id));
      toast({ title: "Berhasil", description: `Data RT/RW untuk ${selectedRtRwMember.name} telah dihapus.` });
    } catch (error) {
       console.error("Error deleting RT/RW member:", error);
       toast({ variant: "destructive", title: "Gagal", description: "Gagal menghapus data RT/RW." });
    } finally {
      setIsRtRwConfirmDeleteDialogOpen(false);
      setSelectedRtRwMember(null);
      setIsSubmitting(false);
    }
  };
  const handleRtRwFormSubmit = async (data: any) => {
    if (!firestore || !user) return;
    setIsSubmitting(true);
    try {
      if (rtRwDialogMode === 'edit' && selectedRtRwMember) {
        const docRef = doc(firestore, "rtRw", selectedRtRwMember.id);
        await updateDoc(docRef, { ...data, updatedAt: serverTimestamp(), updatedBy: user.uid });
        toast({ title: "Berhasil", description: `Data RT/RW untuk ${data.name} telah diperbarui.` });
      } else {
        await addDoc(collection(firestore, "rtRw"), { ...data, village: villageKey, createdAt: serverTimestamp(), createdBy: user.uid });
        toast({ title: "Berhasil", description: `Data RT/RW untuk ${data.name} telah ditambahkan.` });
      }
      setRtRwDialogMode(null);
      setSelectedRtRwMember(null);
    } catch (error) {
       console.error("Error saving RT/RW member:", error);
       toast({ variant: "destructive", title: "Gagal", description: "Gagal menyimpan data RT/RW." });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isLoading = isLoadingPerangkat || isLoadingBpd || isLoadingRtRw;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-headline">Profil Perangkat Desa {capitalizeFirstLetter(village)}</h1>
            <p className="text-muted-foreground">Struktur organisasi Perangkat Desa, BPD, dan RT/RW.</p>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="pemerintah-desa" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pemerintah-desa">Pemerintah Desa</TabsTrigger>
              <TabsTrigger value="bpd">BPD</TabsTrigger>
              <TabsTrigger value="rt-rw">RT/RW</TabsTrigger>
            </TabsList>

            <TabsContent value="pemerintah-desa" className="mt-6">
              <div className="text-right mb-6">
                <Button onClick={handlePerangkatAddClick}>
                  <PlusCircle className="mr-2"/>
                  Tambah Perangkat
                </Button>
              </div>
              {perangkatList && perangkatList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {perangkatList.map((item) => (
                    <ProfileCard key={item.id} perangkat={item} onEdit={handlePerangkatEditClick} onDelete={handlePerangkatDeleteClick} />
                  ))}
                </div>
              ) : (
                <Card>
                    <CardContent className="p-6 text-center">
                        <p>Data perangkat desa untuk {villageTitle} tidak tersedia.</p>
                        <p className="text-sm text-muted-foreground mt-2">Anda bisa mulai dengan menambahkan data perangkat baru.</p>
                    </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="bpd" className="mt-6">
              <div className="text-right mb-6">
                <Button onClick={handleBpdAddClick}>
                  <PlusCircle className="mr-2"/>
                  Tambah Anggota BPD
                </Button>
              </div>
              {bpdList && bpdList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {bpdList.map((item) => (
                    <BpdProfileCard key={item.id} member={item} onEdit={handleBpdEditClick} onDelete={handleBpdDeleteClick} />
                  ))}
                </div>
              ) : (
                <Card>
                    <CardContent className="p-6 text-center">
                        <p>Data BPD untuk {villageTitle} tidak tersedia.</p>
                        <p className="text-sm text-muted-foreground mt-2">Anda bisa mulai dengan menambahkan anggota BPD baru.</p>
                    </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="rt-rw" className="mt-6">
              <div className="text-right mb-6">
                  <Button onClick={handleRtRwAddClick}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Tambah RT/RW
                  </Button>
              </div>
              {Object.keys(rtRwGroupedByDusun).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(rtRwGroupedByDusun).map(([dusun, members]) => {
                    const groupedByRw = members.reduce((acc, member) => {
                      const { rw } = member;
                      if (!rw) return acc;
                      if (!acc[rw]) {
                        acc[rw] = [];
                      }
                      acc[rw].push(member);
                      return acc;
                    }, {} as Record<string, RtRwMember[]>);

                    return (
                      <div key={dusun}>
                        <h2 className="text-2xl font-bold font-headline mb-4">{dusun}</h2>
                        <div className="space-y-4">
                          {Object.entries(groupedByRw).map(([rw, rtMembers]) => (
                            <Card key={rw}>
                              <CardHeader>
                                <CardTitle>{rw}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-3">
                                  {rtMembers.map((member) => (
                                    <li key={member.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                      <div>
                                          <span className="text-muted-foreground">{member.position}</span>
                                          <span className="font-semibold block sm:inline sm:ml-2">{member.name}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleRtRwEditClick(member)}>
                                              <Pencil className="h-4 w-4" />
                                          </Button>
                                          <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleRtRwDeleteClick(member)}>
                                              <Trash2 className="h-4 w-4" />
                                          </Button>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p>Data RT/RW untuk {capitalizeFirstLetter(village)} tidak tersedia.</p>
                     <p className="text-sm text-muted-foreground mt-2">Anda bisa mulai dengan menambahkan data RT/RW baru.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Perangkat Edit/Add Dialog */}
      <Dialog open={perangkatDialogMode !== null} onOpenChange={(isOpen) => !isOpen && setPerangkatDialogMode(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline text-3xl font-bold">
              {perangkatDialogMode === 'edit' ? 'Edit Data Perangkat' : 'Tambah Perangkat Desa'}
            </DialogTitle>
            <DialogDescription>
              {perangkatDialogMode === 'edit' ? `Memperbarui data untuk ${selectedPerangkat?.name}` : 'Isi formulir di bawah ini untuk menambahkan data baru.'}
            </DialogDescription>
          </DialogHeader>
          <PerangkatForm 
            perangkat={selectedPerangkat}
            onSubmit={handlePerangkatFormSubmit}
            onCancel={() => setPerangkatDialogMode(null)}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      
      {/* Perangkat Delete Confirmation Dialog */}
      <AlertDialog open={isPerangkatConfirmDeleteDialogOpen} onOpenChange={setIsPerangkatConfirmDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat diurungkan. Data untuk <span className="font-bold">{selectedPerangkat?.name}</span> akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPerangkatDelete} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

       {/* BPD Edit/Add Dialog */}
      <Dialog open={bpdDialogMode !== null} onOpenChange={(isOpen) => !isOpen && setBpdDialogMode(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline text-3xl font-bold">
              {bpdDialogMode === 'edit' ? 'Edit Data Anggota BPD' : 'Tambah Anggota BPD'}
            </DialogTitle>
            <DialogDescription>
              {bpdDialogMode === 'edit' ? `Memperbarui data untuk ${selectedBpdMember?.name}` : 'Isi formulir di bawah ini untuk menambahkan data baru.'}
            </DialogDescription>
          </DialogHeader>
          <BpdForm 
            bpdMember={selectedBpdMember}
            onSubmit={handleBpdFormSubmit}
            onCancel={() => setBpdDialogMode(null)}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      
      {/* BPD Delete Confirmation Dialog */}
      <AlertDialog open={isBpdConfirmDeleteDialogOpen} onOpenChange={setIsBpdConfirmDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat diurungkan. Data untuk <span className="font-bold">{selectedBpdMember?.name}</span> akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBpdDelete} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* RT/RW Edit/Add Dialog */}
      <Dialog open={rtRwDialogMode !== null} onOpenChange={(isOpen) => !isOpen && setRtRwDialogMode(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline text-3xl font-bold">
              {rtRwDialogMode === 'edit' ? 'Edit Data RT/RW' : 'Tambah Data RT/RW'}
            </DialogTitle>
            <DialogDescription>
              {rtRwDialogMode === 'edit' ? `Memperbarui data untuk ${selectedRtRwMember?.name}` : 'Isi formulir di bawah ini untuk menambahkan data baru.'}
            </DialogDescription>
          </DialogHeader>
          <RtRwForm 
            rtRwMember={selectedRtRwMember}
            onSubmit={handleRtRwFormSubmit}
            onCancel={() => setRtRwDialogMode(null)}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      
      {/* RT/RW Delete Confirmation Dialog */}
      <AlertDialog open={isRtRwConfirmDeleteDialogOpen} onOpenChange={setIsRtRwConfirmDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat diurungkan. Data untuk <span className="font-bold">{selectedRtRwMember?.name}</span> akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRtRwDelete} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

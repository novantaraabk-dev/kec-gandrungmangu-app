'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Calendar, Briefcase, Hash, Scroll, Building, UserCheck, Loader2, ShieldCheck, Award } from 'lucide-react';
import { type Perangkat, type BpdMember, type RtRwMember } from '@/lib/perangkat-data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

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

function ProfileCard({ perangkat }: { perangkat: Perangkat; }) {
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
      </DialogContent>
    </Dialog>
  );
}

function BpdProfileCard({ member }: { member: BpdMember; }) {
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
      </DialogContent>
    </Dialog>
  );
}


export default function ProfilPerangkatClientPage({ village }: { village: string }) {
  const villageKey = village.toLowerCase();
  const villageTitle = capitalizeFirstLetter(village);
  const firestore = useFirestore();
  
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
  
  const isLoading = isLoadingPerangkat || isLoadingBpd || isLoadingRtRw;

  return (
    <>
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold font-headline text-slate-800 dark:text-slate-100">Profil Perangkat Desa {villageTitle}</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Struktur organisasi Perangkat Desa, BPD, dan RT/RW.</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <Tabs defaultValue="pemerintah-desa" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pemerintah-desa">Pemerintah Desa</TabsTrigger>
                <TabsTrigger value="bpd">BPD</TabsTrigger>
                <TabsTrigger value="rt-rw">RT/RW</TabsTrigger>
              </TabsList>

              <TabsContent value="pemerintah-desa" className="mt-6">
                {perangkatList && perangkatList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {perangkatList.map((item) => (
                      <ProfileCard key={item.id} perangkat={item} />
                    ))}
                  </div>
                ) : (
                  <Card><CardContent className="p-6 text-center"><p>Data perangkat desa tidak tersedia.</p></CardContent></Card>
                )}
              </TabsContent>

              <TabsContent value="bpd" className="mt-6">
                {bpdList && bpdList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {bpdList.map((item) => (
                      <BpdProfileCard key={item.id} member={item} />
                    ))}
                  </div>
                ) : (
                  <Card><CardContent className="p-6 text-center"><p>Data BPD tidak tersedia.</p></CardContent></Card>
                )}
              </TabsContent>

              <TabsContent value="rt-rw" className="mt-6">
                {Object.keys(rtRwGroupedByDusun).length > 0 ? (
                  <div className="space-y-6">
                    {Object.entries(rtRwGroupedByDusun).map(([dusun, members]) => {
                      const groupedByRw = members.reduce((acc, member) => {
                        const { rw } = member;
                        if (!rw) return acc;
                        if (!acc[rw]) { acc[rw] = []; }
                        acc[rw].push(member);
                        return acc;
                      }, {} as Record<string, RtRwMember[]>);

                      return (
                        <div key={dusun}>
                          <h2 className="text-2xl font-bold font-headline mb-4">{dusun}</h2>
                          <div className="space-y-4">
                            {Object.entries(groupedByRw).map(([rw, rtMembers]) => (
                              <Card key={rw}><CardHeader><CardTitle>{rw}</CardTitle></CardHeader><CardContent><ul className="space-y-3">
                                    {rtMembers.map((member) => (
                                      <li key={member.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                        <div>
                                            <span className="text-muted-foreground">{member.position}</span>
                                            <span className="font-semibold block sm:inline sm:ml-2">{member.name}</span>
                                        </div>
                                      </li>
                                    ))}
                                  </ul></CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Card><CardContent className="p-6 text-center"><p>Data RT/RW tidak tersedia.</p></CardContent></Card>
                )}
              </TabsContent>
            </Tabs>
        </div>
      )}
    </>
  );
}

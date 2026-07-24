'use client';
import React, { useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Users, Building, MapPin, DollarSign, ListChecks, Heart, HandHelping, Map, University, Landmark } from 'lucide-react';
import { dataKependudukan, type KependudukanData } from '@/lib/kependudukan-data';
import { vervalP3keData } from '@/lib/p3ke-verval-data';
import type { Apbdes, PrioritasDanaDesa, JalanDesa, Perangkat, BpdMember, RtRwMember, Stunting, BumilKek, P3keIntervention, JalanKabupaten, Masjid, Mushola, PasarDesa, Mbg, JumlahBalita, PosyanduKader, PbbP2 } from '@/lib/perangkat-data';
import { useDoc } from '@/firebase/firestore/use-doc';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

function formatCurrency(value?: number) {
    if (value === undefined || value === null || isNaN(value)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900',
    green: 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-900',
    yellow: 'bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800',
    purple: 'bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-900',
    cyan: 'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-900',
    rose: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900',
    orange: 'bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-800',
    indigo: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-900',
    teal: 'bg-teal-50 dark:bg-teal-950/50 border-teal-200 dark:border-teal-900',
};

type StatCardColor = keyof typeof colorClasses;

function StatCard({ title, children, icon, color = 'blue' }: { title: string, children: React.ReactNode, icon: React.ReactNode, color?: StatCardColor }) {
    return (
        <Card className={cn(
            "rounded-2xl shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 p-4",
            colorClasses[color]
        )}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 p-0">
                <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center p-0 pt-2">
                {children}
            </CardContent>
        </Card>
    );
}

export function VillageDataDisplay({ village }: { village: string }) {
    const firestore = useFirestore();
    const isKecamatanView = village === 'kecamatan';
    const currentYear = new Date().getFullYear();

    // Queries
    const apbdesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        const baseQuery = collection(firestore, 'apbdes');
        if (isKecamatanView) return query(baseQuery, where('year', '==', currentYear));
        return query(baseQuery, where('village', '==', village), where('year', '==', currentYear));
    }, [firestore, village, isKecamatanView, currentYear]);

    const prioritasCollectionQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        const baseQuery = collection(firestore, 'prioritasDanaDesa');
        if(isKecamatanView) return query(baseQuery, where('year', '==', currentYear));
        return query(baseQuery, where('village', '==', village), where('year', '==', currentYear));
    }, [firestore, village, isKecamatanView, currentYear]);
    
    const jalanDesaQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        const baseQuery = collection(firestore, 'jalanDesa');
        if (isKecamatanView) return baseQuery;
        return query(baseQuery, where('village', '==', village));
    }, [firestore, village, isKecamatanView]);

    const jalanKabupatenQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'jalanKabupaten');
    }, [firestore]);

    const perangkatQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        const baseQuery = collection(firestore, 'perangkat');
        if (isKecamatanView) return baseQuery;
        return query(baseQuery, where('village', '==', village));
    }, [firestore, village, isKecamatanView]);

    const bpdQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        const baseQuery = collection(firestore, 'bpd');
        if (isKecamatanView) return baseQuery;
        return query(baseQuery, where('village', '==', village));
    }, [firestore, village, isKecamatanView]);

    const rtRwQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        const baseQuery = collection(firestore, 'rtRw');
        if (isKecamatanView) return baseQuery;
        return query(baseQuery, where('village', '==', village));
    }, [firestore, village, isKecamatanView]);

    const stuntingQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        const baseQuery = collection(firestore, 'stunting');
        if (isKecamatanView) return baseQuery;
        return query(baseQuery, where('village', '==', village));
    }, [firestore, village, isKecamatanView]);

    const bumilKekQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        const baseQuery = collection(firestore, 'bumilKek');
        if (isKecamatanView) return baseQuery;
        return query(baseQuery, where('village', '==', village));
    }, [firestore, village, isKecamatanView]);

    const balitaQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        const baseQuery = collection(firestore, 'jumlahBalita');
        if (isKecamatanView) return query(baseQuery, where('year', '==', currentYear)); // For kecamatan, let's stick to current year for balita count
        return query(baseQuery, where('village', '==', village), where('year', '==', currentYear));
    }, [firestore, village, isKecamatanView, currentYear]);

    const posyanduKaderQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        const baseQuery = collection(firestore, 'posyanduKaders');
        if (isKecamatanView) return baseQuery;
        return query(baseQuery, where('village', '==', village));
    }, [firestore, village, isKecamatanView]);

    const p3keQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        const baseQuery = collection(firestore, 'p3keInterventions');
        if (isKecamatanView) return baseQuery;
        return query(baseQuery, where('village', '==', village));
    }, [firestore, village, isKecamatanView]);

    const masjidQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        const baseQuery = collection(firestore, 'masjids');
        if (isKecamatanView) return baseQuery;
        return query(baseQuery, where('village', '==', village));
    }, [firestore, village, isKecamatanView]);

    const musholaQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        const baseQuery = collection(firestore, 'musholas');
        if (isKecamatanView) return baseQuery;
        return query(baseQuery, where('village', '==', village));
    }, [firestore, village, isKecamatanView]);

    const pasarDesaQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        const baseQuery = collection(firestore, 'pasarDesa');
        if (isKecamatanView) return baseQuery;
        return query(baseQuery, where('village', '==', village));
    }, [firestore, village, isKecamatanView]);

    const mbgQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        const baseQuery = collection(firestore, 'mbg');
        if (isKecamatanView) return baseQuery;
        return query(baseQuery, where('village', '==', village));
    }, [firestore, village, isKecamatanView]);

    const pbbQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        const baseQuery = collection(firestore, 'pbbP2');
        if (isKecamatanView) return query(baseQuery, where('year', '==', currentYear));
        return query(baseQuery, where('village', '==', village), where('year', '==', currentYear));
    }, [firestore, village, isKecamatanView, currentYear]);
    
    // Hooks
    const { data: apbdesData, isLoading: isLoadingApbdes } = useCollection<Apbdes>(apbdesQuery);
    const { data: prioritasData, isLoading: isLoadingPrioritas } = useCollection<PrioritasDanaDesa>(prioritasCollectionQuery);
    const { data: jalanData, isLoading: isLoadingJalan } = useCollection<JalanDesa>(jalanDesaQuery);
    const { data: jalanKabupatenData, isLoading: isLoadingJalanKabupaten } = useCollection<JalanKabupaten>(jalanKabupatenQuery);
    const { data: perangkatData, isLoading: isLoadingPerangkat } = useCollection<Perangkat>(perangkatQuery);
    const { data: bpdData, isLoading: isLoadingBpd } = useCollection<BpdMember>(bpdQuery);
    const { data: rtRwData, isLoading: isLoadingRtRw } = useCollection<RtRwMember>(rtRwQuery);
    const { data: stuntingData, isLoading: isLoadingStunting } = useCollection<Stunting>(stuntingQuery);
    const { data: bumilKekData, isLoading: isLoadingBumilKek } = useCollection<BumilKek>(bumilKekQuery);
    const { data: balitaData, isLoading: isLoadingBalita } = useCollection<JumlahBalita>(balitaQuery);
    const { data: posyanduKaderData, isLoading: isLoadingPosyanduKader } = useCollection<PosyanduKader>(posyanduKaderQuery);
    const { data: p3keData, isLoading: isLoadingP3ke } = useCollection<P3keIntervention>(p3keQuery);
    const { data: masjidData, isLoading: isLoadingMasjid } = useCollection<Masjid>(masjidQuery);
    const { data: musholaData, isLoading: isLoadingMushola } = useCollection<Mushola>(musholaQuery);
    const { data: pasarDesaData, isLoading: isLoadingPasarDesa } = useCollection<PasarDesa>(pasarDesaQuery);
    const { data: mbgData, isLoading: isLoadingMbg } = useCollection<Mbg>(mbgQuery);
    const { data: pbbData, isLoading: isLoadingPbb } = useCollection<PbbP2>(pbbQuery);
    
    // Aggregations
    const apbdesSummary = useMemo(() => {
        if (!apbdesData) return { revenue: 0, expenditure: 0, sources: {} as Record<string, number> };
        return apbdesData.reduce((acc, doc) => {
            acc.revenue += doc.revenue || 0;
            acc.expenditure += doc.expenditure || 0;
            if (doc.revenueSources) {
                for (const [source, amount] of Object.entries(doc.revenueSources)) {
                    acc.sources[source] = (acc.sources[source] || 0) + (amount as number);
                }
            }
            return acc;
        }, { revenue: 0, expenditure: 0, sources: {} as Record<string, number> });
    }, [apbdesData]);

    const prioritasSummary = useMemo(() => {
        if (!prioritasData) return { pagu: 0, prioritas: 0, nonPrioritas: 0, blt: 0, iklim: 0, kesehatan: 0, pangan: 0, infrastruktur: 0, digital: 0 };
        return prioritasData.reduce((acc, doc) => {
            acc.pagu += doc.paguDanaDesa || 0;
            acc.prioritas += doc.jumlahPaguPrioritas || 0;
            acc.nonPrioritas += doc.jumlahPaguNonPrioritas || 0;
            acc.blt += doc.totalAnggaranBlt || 0;
            acc.iklim += doc.totalAnggaranIklim || 0;
            acc.kesehatan += doc.totalAnggaranKesehatan || 0;
            acc.pangan += doc.totalAnggaranPangan || 0;
            acc.infrastruktur += doc.totalAnggaranInfrastruktur || 0;
            acc.digital += doc.totalAnggaranDigital || 0;
            return acc;
        }, { pagu: 0, prioritas: 0, nonPrioritas: 0, blt: 0, iklim: 0, kesehatan: 0, pangan: 0, infrastruktur: 0, digital: 0 });
    }, [prioritasData]);

    const jalanSummary = useMemo(() => {
        if (!jalanData) return { count: 0, total: 0, rusak: 0, percentage: 0, cost: 0 };
        const summary = jalanData.reduce((acc, doc) => {
            acc.total += Number(doc.panjang) || 0;
            const rusak = (Number(doc.rusakRingan) || 0) + (Number(doc.rusakBerat) || 0);
            acc.rusak += rusak;
            return acc;
        }, { total: 0, rusak: 0 });
    
        const percentage = summary.total > 0 ? ((summary.total - summary.rusak) / summary.total) * 100 : 100;
        const cost = summary.rusak * 900000;
    
        return {
            count: jalanData.length,
            total: summary.total,
            rusak: summary.rusak,
            percentage: percentage,
            cost: cost
        };
    }, [jalanData]);

    const jalanKabupatenSummary = useMemo(() => {
        if (!jalanKabupatenData) return { count: 0, roads: [], proposals: [] };
    
        const filteredRoads = isKecamatanView
            ? jalanKabupatenData
            : jalanKabupatenData.filter(road => road.village.toLowerCase().split(',').map(v => v.trim()).includes(village));
    
        const roads = filteredRoads.map(road => ({
            ...road,
            panjangRusak: (Number(road.kondisiRusakRingan) || 0) + (Number(road.kondisiRusakBerat) || 0)
        }));

        const proposals = roads
            .filter(road => road.usulanDesa)
            .map(road => ({
                id: road.id,
                usulan: road.usulanDesa,
                pagu: road.paguUsulan,
                panjang: road.panjangUsulan,
                namaRuas: road.namaRuas,
            }));
    
        return {
            count: roads.length,
            roads,
            proposals
        };
    }, [jalanKabupatenData, isKecamatanView, village]);

    const kelembagaanSummary = useMemo(() => {
        if (!rtRwData || !perangkatData || !bpdData) {
          return { perangkat: 0, bpd: 0, dusun: 0, rw: 0, rt: 0 };
        }
    
        const dusunSet = new Set<string>();
        const rwSet = new Set<string>();
        const rtSet = new Set<string>();
    
        rtRwData.forEach(member => {
          if (member.dusun) dusunSet.add(member.dusun);
          if (member.dusun && member.rw) rwSet.add(`${member.dusun}-${member.rw}`);
          if (member.dusun && member.rw && member.rt) rtSet.add(`${member.dusun}-${member.rw}-${member.rt}`);
        });
    
        return {
          perangkat: perangkatData.length,
          bpd: bpdData.length,
          dusun: dusunSet.size,
          rw: rwSet.size,
          rt: rtSet.size,
        };
    }, [perangkatData, bpdData, rtRwData]);
    
    const kependudukanSummary = useMemo(() => {
        const data = isKecamatanView ? dataKependudukan : dataKependudukan.filter(d => d.desa.toLowerCase() === village);
        return data.reduce((acc, d) => {
            acc.penduduk.l += d.penduduk.l;
            acc.penduduk.p += d.penduduk.p;
            acc.penduduk.total += d.penduduk.total;
            acc.kk.l += d.kk.l;
            acc.kk.p += d.kk.p;
            acc.kk.total += d.kk.total;
            return acc;
        }, { penduduk: { l: 0, p: 0, total: 0 }, kk: { l: 0, p: 0, total: 0 } });
    }, [isKecamatanView, village]);
    
    const p3keVervalSummary = useMemo(() => {
        const data = isKecamatanView ? vervalP3keData : vervalP3keData.filter(d => d.desa.toLowerCase() === village);
        return data.reduce((acc, d) => {
            acc.art += d.art;
            acc.krt += d.krt;
            acc.tidakPunyaJamban += d.tidakPunyaJamban;
            acc.rtlh += d.rtlh;
            acc.tidakPunyaListrik += d.tidakPunyaListrik;
            acc.tidakPunyaSumberAir += d.tidakPunyaSumberAir;
            acc.anakTidakSekolah += d.anakTidakSekolah;
            acc.disabilitas += d.disabilitas;
            acc.tidakBekerja += d.tidakBekerja;
            acc.resikoStunting += d.resikoStunting;
            return acc;
        }, {
            art: 0, krt: 0, tidakPunyaJamban: 0, rtlh: 0, tidakPunyaListrik: 0,
            tidakPunyaSumberAir: 0, anakTidakSekolah: 0, disabilitas: 0,
            tidakBekerja: 0, resikoStunting: 0
        });
    }, [isKecamatanView, village]);

    const p3keSummary = {
        interventions: p3keData?.length || 0,
    };
    
    const kesehatanSummary = useMemo(() => {
        if (!stuntingData || !bumilKekData || !balitaData || !posyanduKaderData) {
            return { stunting: 0, bumilKek: 0, balita: 0, posyandu: 0, kader: 0 };
        }
        const posyanduSet = new Set(posyanduKaderData.map(p => p.village + '|' + p.posyanduName));

        let totalBalita = 0;
        if (isKecamatanView) {
            // For kecamatan view, sum the latest month's data for each village in the current year
            const latestByVillage: Record<string, JumlahBalita> = {};
            balitaData.forEach(d => {
                if (!latestByVillage[d.village] || Number(d.bulan) > Number(latestByVillage[d.village].bulan)) {
                    latestByVillage[d.village] = d;
                }
            });
            totalBalita = Object.values(latestByVillage).reduce((acc, v) => acc + (v.jumlahLakiLaki || 0) + (v.jumlahPerempuan || 0), 0);
        } else {
            // For single village view, find the latest month's data
            const latest = balitaData.sort((a,b) => Number(b.bulan) - Number(a.bulan))[0];
            if (latest) {
                totalBalita = (latest.jumlahLakiLaki || 0) + (latest.jumlahPerempuan || 0);
            }
        }
        
        return {
            stunting: stuntingData.length,
            bumilKek: bumilKekData.length,
            balita: totalBalita,
            posyandu: posyanduSet.size,
            kader: posyanduKaderData.length,
        };
    }, [stuntingData, bumilKekData, balitaData, posyanduKaderData, isKecamatanView]);

    const dataUmumSummary = useMemo(() => {
        return {
            masjid: masjidData?.length || 0,
            mushola: musholaData?.length || 0,
            pasarDesa: pasarDesaData?.length || 0,
            mbg: mbgData?.length || 0,
        };
    }, [masjidData, musholaData, pasarDesaData, mbgData]);

    const pbbSummary = useMemo(() => {
        if (!pbbData) return { pagu: 0, sppt: 0, terbayar: 0, sisa: 0, persentase: 0 };
        const summary = pbbData.reduce((acc, doc) => {
            acc.pagu += doc.pagu || 0;
            acc.sppt += doc.totalSppt || 0;
            acc.terbayar += doc.terbayar || 0;
            return acc;
        }, { pagu: 0, sppt: 0, terbayar: 0, sisa: 0, persentase: 0 });

        summary.sisa = summary.pagu - summary.terbayar;
        summary.persentase = summary.pagu > 0 ? (summary.terbayar / summary.pagu) * 100 : 0;

        return summary;
    }, [pbbData]);

    const isLoading = isLoadingApbdes || isLoadingPrioritas || isLoadingJalan || isLoadingPerangkat || isLoadingBpd || isLoadingRtRw || isLoadingStunting || isLoadingBumilKek || isLoadingP3ke || isLoadingJalanKabupaten || isLoadingMasjid || isLoadingMushola || isLoadingPasarDesa || isLoadingMbg || isLoadingBalita || isLoadingPosyanduKader || isLoadingPbb;

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    const villageTitle = isKecamatanView ? 'Rekapitulasi Kecamatan' : `Data Desa ${village.charAt(0).toUpperCase() + village.slice(1)}`;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold font-headline">{villageTitle}</h2>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <StatCard title="Anggaran Pendapatan APBDes" icon={<DollarSign className="h-5 w-5 text-blue-600" />} color="blue">
                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        {Object.entries(apbdesSummary.sources).map(([source, amount]) => (
                             <div className="flex justify-between" key={source}><span>{source}</span><span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(amount)}</span></div>
                        ))}
                        <div className="flex justify-between font-bold border-t pt-2 mt-2 text-slate-800 dark:text-slate-200"><span>Total Pendapatan</span><span>{formatCurrency(apbdesSummary.revenue)}</span></div>
                    </div>
                </StatCard>
                <StatCard title="Pagu Dana Desa" icon={<ListChecks className="h-5 w-5 text-green-600" />} color="green">
                     <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                         <div className="flex justify-between font-bold"><span>Pagu DD</span><span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(prioritasSummary.pagu)}</span></div>
                         <div className="flex justify-between"><span>Pagu Prioritas</span><span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(prioritasSummary.prioritas)}</span></div>
                         <div className="flex justify-between"><span>Pagu Non-Prioritas</span><span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(prioritasSummary.nonPrioritas)}</span></div>
                         <div className="pt-2 border-t font-semibold text-slate-800 dark:text-slate-200">Anggaran Prioritas:</div>
                         <div className="flex justify-between pl-2"><span>- BLT</span><span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(prioritasSummary.blt)}</span></div>
                         <div className="flex justify-between pl-2"><span>- Iklim</span><span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(prioritasSummary.iklim)}</span></div>
                         <div className="flex justify-between pl-2"><span>- Kesehatan</span><span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(prioritasSummary.kesehatan)}</span></div>
                         <div className="flex justify-between pl-2"><span>- Pangan</span><span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(prioritasSummary.pangan)}</span></div>
                         <div className="flex justify-between pl-2"><span>- Infra PKTD</span><span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(prioritasSummary.infrastruktur)}</span></div>
                         <div className="flex justify-between pl-2"><span>- Digital</span><span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(prioritasSummary.digital)}</span></div>
                     </div>
                </StatCard>
                <StatCard title="Jalan Desa" icon={<MapPin className="h-5 w-5 text-yellow-600" />} color="yellow">
                     <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                         <div className="flex justify-between"><span>Jumlah Jalan</span><span className="font-semibold text-slate-800 dark:text-slate-200">{jalanSummary.count.toLocaleString('id-ID')}</span></div>
                         <div className="flex justify-between"><span>Total Panjang</span><span className="font-semibold text-slate-800 dark:text-slate-200">{jalanSummary.total.toLocaleString('id-ID')} M</span></div>
                         <div className="flex justify-between"><span>Total Kerusakan</span><span className="font-semibold text-destructive">{jalanSummary.rusak.toLocaleString('id-ID')} M</span></div>
                         <div className="flex justify-between"><span>Persentase Kondisi Baik</span><span className="font-semibold text-green-600">{jalanSummary.percentage.toFixed(2)}%</span></div>
                         <div className="flex justify-between pt-2 border-t font-bold"><span>Estimasi Penyelesaian</span><span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(jalanSummary.cost)}</span></div>
                    </div>
                </StatCard>
                <StatCard title="Jalan Kabupaten" icon={<Map className="h-5 w-5 text-indigo-600" />} color="indigo">
                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex justify-between font-bold">
                            <span>Jumlah Ruas</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{jalanKabupatenSummary.count.toLocaleString('id-ID')}</span>
                        </div>
                        {jalanKabupatenSummary.roads.length > 0 && (
                            <ScrollArea className="h-24 mt-2">
                                <div className="space-y-2">
                                    {jalanKabupatenSummary.roads.map((road, index) => (
                                        <p key={road.id} className="text-xs">
                                           {index + 1}. Ruas {road.noRuas}, {road.namaRuas}, Panjang {road.panjangRuas?.toLocaleString('id-ID')} M, Ruas Rusak {road.panjangRusak.toLocaleString('id-ID')} M
                                        </p>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                        {jalanKabupatenSummary.proposals.length > 0 && (
                            <div className="pt-3 mt-3 border-t">
                                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Usulan RKPD 2026</h4>
                                <ScrollArea className="h-24">
                                    <div className="space-y-2">
                                        {jalanKabupatenSummary.proposals.map(prop => (
                                            <div key={prop.id} className="text-xs">
                                                <p className="font-semibold">{prop.usulan}</p>
                                                <p>Pagu: {formatCurrency(prop.pagu)} | Panjang: {prop.panjang?.toLocaleString('id-ID')} M</p>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        )}
                    </div>
                </StatCard>
                <StatCard title="Kelembagaan Desa" icon={<Users className="h-5 w-5 text-purple-600" />} color="purple">
                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                         <div className="flex justify-between"><span>Perangkat Desa</span><span className="font-semibold text-slate-800 dark:text-slate-200">{kelembagaanSummary.perangkat} orang</span></div>
                         <div className="flex justify-between"><span>Anggota BPD</span><span className="font-semibold text-slate-800 dark:text-slate-200">{kelembagaanSummary.bpd} orang</span></div>
                         <div className="flex justify-between"><span>Jumlah Dusun</span><span className="font-semibold text-slate-800 dark:text-slate-200">{kelembagaanSummary.dusun}</span></div>
                         <div className="flex justify-between"><span>Jumlah RW</span><span className="font-semibold text-slate-800 dark:text-slate-200">{kelembagaanSummary.rw}</span></div>
                         <div className="flex justify-between"><span>Jumlah RT</span><span className="font-semibold text-slate-800 dark:text-slate-200">{kelembagaanSummary.rt}</span></div>
                    </div>
                </StatCard>
                <StatCard title="Kependudukan" icon={<Building className="h-5 w-5 text-cyan-600" />} color="cyan">
                     <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex justify-between font-bold">
                            <span>Total Penduduk</span>
                            <span className="text-slate-800 dark:text-slate-200">{kependudukanSummary.penduduk.total.toLocaleString('id-ID')} Jiwa</span>
                        </div>
                        <div className="flex justify-between pl-4">
                            <span>- Laki-laki</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{kependudukanSummary.penduduk.l.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between pl-4">
                            <span>- Perempuan</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{kependudukanSummary.penduduk.p.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between font-bold pt-2 border-t">
                            <span>Total KK</span>
                            <span className="text-slate-800 dark:text-slate-200">{kependudukanSummary.kk.total.toLocaleString('id-ID')} KK</span>
                        </div>
                        <div className="flex justify-between pl-4">
                            <span>- Laki-laki</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{kependudukanSummary.kk.l.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between pl-4">
                            <span>- Perempuan</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{kependudukanSummary.kk.p.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                </StatCard>
                <StatCard title="Data Kesehatan" icon={<Heart className="h-5 w-5 text-rose-600" />} color="rose">
                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                         <div className="flex justify-between"><span>Kasus Stunting</span><span className="font-semibold text-slate-800 dark:text-slate-200">{kesehatanSummary.stunting} anak</span></div>
                         <div className="flex justify-between"><span>Ibu Hamil KEK</span><span className="font-semibold text-slate-800 dark:text-slate-200">{kesehatanSummary.bumilKek} orang</span></div>
                         <div className="flex justify-between"><span>Jumlah Balita</span><span className="font-semibold text-slate-800 dark:text-slate-200">{kesehatanSummary.balita.toLocaleString('id-ID')} anak</span></div>
                         <div className="flex justify-between"><span>Jumlah Posyandu</span><span className="font-semibold text-slate-800 dark:text-slate-200">{kesehatanSummary.posyandu}</span></div>
                         <div className="flex justify-between"><span>Jumlah Kader</span><span className="font-semibold text-slate-800 dark:text-slate-200">{kesehatanSummary.kader} orang</span></div>
                    </div>
                </StatCard>
                 <StatCard title="Intervensi P3KE" icon={<HandHelping className="h-5 w-5 text-orange-600" />} color="orange">
                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <div className="font-bold text-slate-800 dark:text-slate-200">Verval P3KE</div>
                        <div className="flex justify-between"><span>Jml KRT</span><span className="font-semibold text-slate-800 dark:text-slate-200">{p3keVervalSummary.krt.toLocaleString('id-ID')}</span></div>
                        <div className="flex justify-between"><span>Jml ART</span><span className="font-semibold text-slate-800 dark:text-slate-200">{p3keVervalSummary.art.toLocaleString('id-ID')}</span></div>
                        <div className="font-semibold pt-2 border-t text-slate-800 dark:text-slate-200">Prioritas Intervensi:</div>
                        <div className="pl-2 space-y-1">
                            <div className="flex justify-between"><span>- Tidak Punya Jamban</span><span className="font-semibold text-slate-800 dark:text-slate-200">{p3keVervalSummary.tidakPunyaJamban.toLocaleString('id-ID')}</span></div>
                            <div className="flex justify-between"><span>- RTLH</span><span className="font-semibold text-slate-800 dark:text-slate-200">{p3keVervalSummary.rtlh.toLocaleString('id-ID')}</span></div>
                            <div className="flex justify-between"><span>- Tidak Punya Listrik</span><span className="font-semibold text-slate-800 dark:text-slate-200">{p3keVervalSummary.tidakPunyaListrik.toLocaleString('id-ID')}</span></div>
                            <div className="flex justify-between"><span>- Tidak Punya Sumber Air</span><span className="font-semibold text-slate-800 dark:text-slate-200">{p3keVervalSummary.tidakPunyaSumberAir.toLocaleString('id-ID')}</span></div>
                            <div className="flex justify-between"><span>- Anak Tidak Sekolah</span><span className="font-semibold text-slate-800 dark:text-slate-200">{p3keVervalSummary.anakTidakSekolah.toLocaleString('id-ID')}</span></div>
                            <div className="flex justify-between"><span>- Disabilitas</span><span className="font-semibold text-slate-800 dark:text-slate-200">{p3keVervalSummary.disabilitas.toLocaleString('id-ID')}</span></div>
                            <div className="flex justify-between"><span>- Tidak Bekerja</span><span className="font-semibold text-slate-800 dark:text-slate-200">{p3keVervalSummary.tidakBekerja.toLocaleString('id-ID')}</span></div>
                            <div className="flex justify-between"><span>- Resiko Stunting</span><span className="font-semibold text-slate-800 dark:text-slate-200">{p3keVervalSummary.resikoStunting.toLocaleString('id-ID')}</span></div>
                        </div>
                        <div className="font-bold pt-2 border-t text-slate-800 dark:text-slate-200">Intervensi P3KE</div>
                        <div className="flex justify-between"><span>Jml. Program</span><span className="font-semibold text-slate-800 dark:text-slate-200">{p3keSummary.interventions}</span></div>
                    </div>
                </StatCard>
                <StatCard title="Data Umum" icon={<University className="h-5 w-5 text-teal-600" />} color="teal">
                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                         <div className="flex justify-between"><span>Jml Masjid</span><span className="font-semibold text-slate-800 dark:text-slate-200">{dataUmumSummary.masjid}</span></div>
                         <div className="flex justify-between"><span>Jml Mushola</span><span className="font-semibold text-slate-800 dark:text-slate-200">{dataUmumSummary.mushola}</span></div>
                         <div className="flex justify-between"><span>Jml Pasar Desa</span><span className="font-semibold text-slate-800 dark:text-slate-200">{dataUmumSummary.pasarDesa}</span></div>
                         <div className="flex justify-between"><span>Jml MBG</span><span className="font-semibold text-slate-800 dark:text-slate-200">{dataUmumSummary.mbg}</span></div>
                    </div>
                </StatCard>
                <StatCard title={`Rekap PBB-P2 ${currentYear}`} icon={<Landmark className="h-5 w-5 text-purple-600" />} color="purple">
                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                         <div className="flex justify-between"><span>Pagu PBB P2</span><span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(pbbSummary.pagu)}</span></div>
                         <div className="flex justify-between"><span>Total SPPT</span><span className="font-semibold text-slate-800 dark:text-slate-200">{pbbSummary.sppt.toLocaleString('id-ID')}</span></div>
                         <div className="flex justify-between"><span>Terbayar</span><span className="font-semibold text-green-600">{formatCurrency(pbbSummary.terbayar)}</span></div>
                         <div className="flex justify-between"><span>Sisa Belum Terbayar</span><span className="font-semibold text-destructive">{formatCurrency(pbbSummary.sisa)}</span></div>
                         <div className="flex justify-between font-bold pt-2 border-t"><span>Persentase</span><span className="font-semibold text-slate-800 dark:text-slate-200">{pbbSummary.persentase.toFixed(2)}%</span></div>
                    </div>
                </StatCard>
            </div>
        </div>
    );
}

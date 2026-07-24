'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { villages } from '@/lib/villages';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Schemas
const stuntingSchema = z.object({
  desa: z.string().min(1, 'Desa harus dipilih'),
  namaAnak: z.string().min(1, 'Nama anak tidak boleh kosong'),
  usiaBulan: z.coerce.number().min(0, 'Usia tidak boleh negatif'),
  tinggiBadanCm: z.coerce.number().min(0, 'Tinggi badan tidak boleh negatif'),
  tanggalPengukuran: z.string().min(1, 'Tanggal pengukuran tidak boleh kosong'),
});

const bumilKekSchema = z.object({
  desa: z.string().min(1, 'Desa harus dipilih'),
  namaIbu: z.string().min(1, 'Nama ibu tidak boleh kosong'),
  usiaKehamilanMinggu: z.coerce.number().min(0, 'Usia kehamilan tidak boleh negatif'),
  lingkarLenganAtasCm: z.coerce.number().min(0, 'LILA tidak boleh negatif'),
  tanggalPemeriksaan: z.string().min(1, 'Tanggal pemeriksaan tidak boleh kosong'),
});

const jumlahBalitaSchema = z.object({
  desa: z.string().min(1, 'Desa harus dipilih'),
  tahun: z.coerce.number().min(2000, 'Tahun tidak valid'),
  bulan: z.coerce.number().min(1, 'Bulan tidak valid').max(12, 'Bulan tidak valid'),
  jumlahLakiLaki: z.coerce.number().min(0, 'Jumlah tidak boleh negatif'),
  jumlahPerempuan: z.coerce.number().min(0, 'Jumlah tidak boleh negatif'),
});

type StuntingFormValues = z.infer<typeof stuntingSchema>;
type BumilKekFormValues = z.infer<typeof bumilKekSchema>;
type JumlahBalitaFormValues = z.infer<typeof jumlahBalitaSchema>;

interface HealthDataFormProps {
  onFormSubmit: () => void;
}

export function HealthDataForm({ onFormSubmit }: HealthDataFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('stunting');

  const stuntingForm = useForm<StuntingFormValues>({ resolver: zodResolver(stuntingSchema) });
  const bumilKekForm = useForm<BumilKekFormValues>({ resolver: zodResolver(bumilKekSchema) });
  const jumlahBalitaForm = useForm<JumlahBalitaFormValues>({ resolver: zodResolver(jumlahBalitaSchema), defaultValues: {
    tahun: new Date().getFullYear(),
    bulan: new Date().getMonth() + 1,
  } });

  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  const handleSubmit = async (values: any) => {
    if (!firestore) return;
    setIsLoading(true);

    let collectionName = '';
    let data:any = {};
    let formToReset: any = null;

    switch (activeTab) {
      case 'stunting':
        collectionName = 'stunting';
        data = values as StuntingFormValues;
        formToReset = stuntingForm;
        break;
      case 'ibu-hamil-kek':
        collectionName = 'bumilKek';
        data = values as BumilKekFormValues;
        formToReset = bumilKekForm;
        break;
      case 'jumlah-balita':
        collectionName = 'jumlahBalita';
        data = values as JumlahBalitaFormValues;
        formToReset = jumlahBalitaForm;
        break;
      default:
        setIsLoading(false);
        return;
    }
    
    try {
      await addDoc(collection(firestore, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
      });
      toast({
        title: 'Sukses!',
        description: `Data ${activeTab} berhasil dikirim.`,
      });
      onFormSubmit();
      if(formToReset) formToReset.reset();

    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        variant: 'destructive',
        title: 'Gagal',
        description: 'Terjadi kesalahan saat mengirim data. Pastikan Anda memiliki izin yang benar.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="stunting" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="stunting">Data Stunting</TabsTrigger>
        <TabsTrigger value="ibu-hamil-kek">Ibu Hamil KEK</TabsTrigger>
        <TabsTrigger value="jumlah-balita">Jumlah Balita</TabsTrigger>
      </TabsList>

      {/* Stunting Tab */}
      <TabsContent value="stunting">
        <Form {...stuntingForm}>
          <form onSubmit={stuntingForm.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
             <FormField
                control={stuntingForm.control}
                name="desa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desa</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Pilih desa" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {villages.map(village => <SelectItem key={village} value={village}>{village}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField control={stuntingForm.control} name="namaAnak" render={({ field }) => (<FormItem><FormLabel>Nama Anak</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={stuntingForm.control} name="usiaBulan" render={({ field }) => (<FormItem><FormLabel>Usia (Bulan)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={stuntingForm.control} name="tinggiBadanCm" render={({ field }) => (<FormItem><FormLabel>Tinggi Badan (cm)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={stuntingForm.control} name="tanggalPengukuran" render={({ field }) => (<FormItem><FormLabel>Tanggal Pengukuran</FormLabel><FormControl><Input type="date" {...field} defaultValue={getTodayDateString()}/></FormControl><FormMessage /></FormItem>)} />
            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Kirim Data Stunting</Button>
          </form>
        </Form>
      </TabsContent>

      {/* Ibu Hamil KEK Tab */}
      <TabsContent value="ibu-hamil-kek">
        <Form {...bumilKekForm}>
          <form onSubmit={bumilKekForm.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
             <FormField
                control={bumilKekForm.control}
                name="desa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desa</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Pilih desa" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {villages.map(village => <SelectItem key={village} value={village}>{village}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField control={bumilKekForm.control} name="namaIbu" render={({ field }) => (<FormItem><FormLabel>Nama Ibu</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={bumilKekForm.control} name="usiaKehamilanMinggu" render={({ field }) => (<FormItem><FormLabel>Usia Kehamilan (Minggu)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={bumilKekForm.control} name="lingkarLenganAtasCm" render={({ field }) => (<FormItem><FormLabel>Lingkar Lengan Atas (cm)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={bumilKekForm.control} name="tanggalPemeriksaan" render={({ field }) => (<FormItem><FormLabel>Tanggal Pemeriksaan</FormLabel><FormControl><Input type="date" {...field} defaultValue={getTodayDateString()} /></FormControl><FormMessage /></FormItem>)} />
            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Kirim Data Ibu Hamil</Button>
          </form>
        </Form>
      </TabsContent>

      {/* Jumlah Balita Tab */}
      <TabsContent value="jumlah-balita">
        <Form {...jumlahBalitaForm}>
          <form onSubmit={jumlahBalitaForm.handleSubmit(handleSubmit)} className="space-y-4 mt-4">
             <FormField
                control={jumlahBalitaForm.control}
                name="desa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desa</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Pilih desa" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {villages.map(village => <SelectItem key={village} value={village}>{village}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField control={jumlahBalitaForm.control} name="tahun" render={({ field }) => (<FormItem><FormLabel>Tahun</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={jumlahBalitaForm.control} name="bulan" render={({ field }) => (<FormItem><FormLabel>Bulan</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={jumlahBalitaForm.control} name="jumlahLakiLaki" render={({ field }) => (<FormItem><FormLabel>Jumlah Balita Laki-laki</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={jumlahBalitaForm.control} name="jumlahPerempuan" render={({ field }) => (<FormItem><FormLabel>Jumlah Balita Perempuan</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Kirim Data Jumlah Balita</Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
}

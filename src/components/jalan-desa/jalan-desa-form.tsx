'use client';

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
import { type JalanDesa } from '@/lib/jalan-desa-data';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  namaJalan: z.string().min(1, 'Nama jalan tidak boleh kosong.'),
  panjang: z.string().optional(),
  lebar: z.string().optional(),
  pangkal: z.string().optional(),
  ujung: z.string().optional(),
  jenisPerkerasan: z.string().optional(),
  rencanaPerkerasan: z.string().optional(),
  totalAnggaran: z.string().optional(),
  baik: z.string().optional(),
  sedang: z.string().optional(),
  rusakRingan: z.string().optional(),
  rusakBerat: z.string().optional(),
});

type JalanDesaFormValues = z.infer<typeof formSchema>;

interface JalanDesaFormProps {
  jalan?: JalanDesa | null;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
}

export function JalanDesaForm({ jalan, onSubmit, onCancel, onDelete, isLoading }: JalanDesaFormProps) {
  const isEditMode = !!jalan;
  
  const form = useForm<JalanDesaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      namaJalan: jalan?.namaJalan || '',
      panjang: String(jalan?.panjang ?? ''),
      lebar: String(jalan?.lebar ?? ''),
      pangkal: jalan?.pangkal || '',
      ujung: jalan?.ujung || '',
      jenisPerkerasan: jalan?.jenisPerkerasan || '',
      rencanaPerkerasan: jalan?.rencanaPerkerasan || '',
      totalAnggaran: jalan?.totalAnggaran || '',
      baik: String(jalan?.baik ?? ''),
      sedang: String(jalan?.sedang ?? ''),
      rusakRingan: String(jalan?.rusakRingan ?? ''),
      rusakBerat: String(jalan?.rusakBerat ?? ''),
    },
  });

  const handleSubmit = (values: JalanDesaFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 flex flex-col">
        <ScrollArea className="h-[60vh] pr-6 -mr-6">
            <div className="space-y-4 pr-6">
                <FormField control={form.control} name="namaJalan" render={({ field }) => (
                    <FormItem><FormLabel>Nama Jalan</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="panjang" render={({ field }) => (
                        <FormItem><FormLabel>Panjang (M)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="lebar" render={({ field }) => (
                        <FormItem><FormLabel>Lebar (M)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="pangkal" render={({ field }) => (
                        <FormItem><FormLabel>Pangkal</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="ujung" render={({ field }) => (
                        <FormItem><FormLabel>Ujung</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="jenisPerkerasan" render={({ field }) => (
                    <FormItem><FormLabel>Jenis Perkerasan Awal</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                
                <h4 className="font-semibold text-foreground pt-4 border-t">Kondisi Jalan (Meter)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <FormField control={form.control} name="baik" render={({ field }) => (
                        <FormItem><FormLabel>Baik</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="sedang" render={({ field }) => (
                        <FormItem><FormLabel>Sedang</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="rusakRingan" render={({ field }) => (
                        <FormItem><FormLabel>Rusak Ringan</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="rusakBerat" render={({ field }) => (
                        <FormItem><FormLabel>Rusak Berat</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>

                <h4 className="font-semibold text-foreground pt-4 border-t">Perencanaan</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="rencanaPerkerasan" render={({ field }) => (
                        <FormItem><FormLabel>Rencana Perkerasan</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="totalAnggaran" render={({ field }) => (
                        <FormItem><FormLabel>Total Anggaran (Rp)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </div>
        </ScrollArea>
        
        <DialogFooter className="pt-6 mt-auto sm:justify-between -ml-6 -mr-6 -mb-6 px-6 py-4 bg-muted/50 rounded-b-lg">
            <div>
                 {isEditMode && onDelete && (
                    <Button type="button" variant="destructive" onClick={onDelete} disabled={isLoading}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus Data
                    </Button>
                 )}
            </div>
            <div className='flex gap-2'>
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    Batal
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Simpan
                </Button>
            </div>
        </DialogFooter>
      </form>
    </Form>
  );
}

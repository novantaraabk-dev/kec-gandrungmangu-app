'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Stunting } from '@/lib/perangkat-data';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  namaAnak: z.string().min(1, 'Nama anak tidak boleh kosong.'),
  usiaBulan: z.preprocess((val) => Number(val), z.number().min(0, 'Usia harus angka positif.')),
  tinggiBadanCm: z.preprocess((val) => Number(val), z.number().min(0, 'Tinggi badan harus angka positif.')),
  tanggalPengukuran: z.string().min(1, 'Tanggal pengukuran tidak boleh kosong.'),
});

type FormValues = z.infer<typeof formSchema>;

interface StuntingFormProps {
  data: Partial<Stunting>;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function StuntingForm({ data, onSubmit, onCancel, isLoading }: StuntingFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      namaAnak: data.namaAnak || '',
      usiaBulan: data.usiaBulan || 0,
      tinggiBadanCm: data.tinggiBadanCm || 0,
      tanggalPengukuran: data.tanggalPengukuran || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="namaAnak" render={({ field }) => (
          <FormItem><FormLabel>Nama Anak</FormLabel><FormControl><Input placeholder="Nama lengkap anak" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="usiaBulan" render={({ field }) => (
            <FormItem><FormLabel>Usia (Bulan)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="tinggiBadanCm" render={({ field }) => (
            <FormItem><FormLabel>Tinggi Badan (cm)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="tanggalPengukuran" render={({ field }) => (
          <FormItem><FormLabel>Tanggal Pengukuran</FormLabel><FormControl><Input placeholder="DD-MM-YYYY" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Batal</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

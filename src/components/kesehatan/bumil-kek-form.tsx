'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { BumilKek } from '@/lib/perangkat-data';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  namaIbu: z.string().min(1, 'Nama ibu tidak boleh kosong.'),
  usiaKehamilanMinggu: z.preprocess((val) => Number(val), z.number().min(0, 'Usia kehamilan harus angka positif.')),
  lingkarLenganAtasCm: z.preprocess((val) => Number(val), z.number().min(0, 'LILA harus angka positif.')),
  tanggalPemeriksaan: z.string().min(1, 'Tanggal pemeriksaan tidak boleh kosong.'),
});

type FormValues = z.infer<typeof formSchema>;

interface BumilKekFormProps {
  data: Partial<BumilKek>;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function BumilKekForm({ data, onSubmit, onCancel, isLoading }: BumilKekFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      namaIbu: data.namaIbu || '',
      usiaKehamilanMinggu: data.usiaKehamilanMinggu || 0,
      lingkarLenganAtasCm: data.lingkarLenganAtasCm || 0,
      tanggalPemeriksaan: data.tanggalPemeriksaan || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="namaIbu" render={({ field }) => (
          <FormItem><FormLabel>Nama Ibu</FormLabel><FormControl><Input placeholder="Nama lengkap ibu hamil" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="usiaKehamilanMinggu" render={({ field }) => (
            <FormItem><FormLabel>Usia Kehamilan (Minggu)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="lingkarLenganAtasCm" render={({ field }) => (
            <FormItem><FormLabel>LILA (cm)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="tanggalPemeriksaan" render={({ field }) => (
          <FormItem><FormLabel>Tanggal Pemeriksaan</FormLabel><FormControl><Input placeholder="DD-MM-YYYY" {...field} /></FormControl><FormMessage /></FormItem>
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

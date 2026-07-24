'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { JumlahBalita } from '@/lib/perangkat-data';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const formSchema = z.object({
  tahun: z.preprocess((val) => Number(val), z.number().min(2000, 'Tahun tidak valid.')),
  bulan: z.string().min(1, 'Bulan harus dipilih.'),
  jumlahLakiLaki: z.preprocess((val) => Number(val), z.number().min(0, 'Jumlah harus non-negatif.')),
  jumlahPerempuan: z.preprocess((val) => Number(val), z.number().min(0, 'Jumlah harus non-negatif.')),
});

type FormValues = z.infer<typeof formSchema>;

interface JumlahBalitaFormProps {
  data: Partial<JumlahBalita>;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function JumlahBalitaForm({ data, onSubmit, onCancel, isLoading }: JumlahBalitaFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tahun: data.tahun || new Date().getFullYear(),
      bulan: data.bulan || '',
      jumlahLakiLaki: data.jumlahLakiLaki || 0,
      jumlahPerempuan: data.jumlahPerempuan || 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="tahun" render={({ field }) => (
            <FormItem><FormLabel>Tahun</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="bulan" render={({ field }) => (
            <FormItem><FormLabel>Bulan</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih bulan..." /></SelectTrigger></FormControl>
                <SelectContent>{months.map((m, i) => (<SelectItem key={m} value={(i + 1).toString()}>{m}</SelectItem>))}</SelectContent>
              </Select><FormMessage />
            </FormItem>
          )} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="jumlahLakiLaki" render={({ field }) => (
            <FormItem><FormLabel>Jumlah Laki-laki</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="jumlahPerempuan" render={({ field }) => (
            <FormItem><FormLabel>Jumlah Perempuan</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
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

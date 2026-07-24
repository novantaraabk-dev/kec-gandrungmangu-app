'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Kependudukan } from '@/lib/perangkat-data';
import { DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  penduduk_l: z.preprocess((val) => Number(val), z.number().min(0, "Jumlah harus non-negatif")),
  penduduk_p: z.preprocess((val) => Number(val), z.number().min(0, "Jumlah harus non-negatif")),
  kk_l: z.preprocess((val) => Number(val), z.number().min(0, "Jumlah harus non-negatif")),
  kk_p: z.preprocess((val) => Number(val), z.number().min(0, "Jumlah harus non-negatif")),
});

type FormValues = z.infer<typeof formSchema>;

interface KependudukanFormProps {
  data?: Partial<Kependudukan> | null;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function KependudukanForm({ data, onSubmit, onCancel, isLoading }: KependudukanFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      penduduk_l: data?.penduduk_l || 0,
      penduduk_p: data?.penduduk_p || 0,
      kk_l: data?.kk_l || 0,
      kk_p: data?.kk_p || 0,
    },
  });

  return (
    <Form {...form}>
        <DialogDescription>
            Memperbarui data untuk Desa {data?.village ? data.village.charAt(0).toUpperCase() + data.village.slice(1) : ''} tahun {data?.year}.
        </DialogDescription>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <div className='space-y-4'>
            <h4 className='font-medium'>Jumlah Penduduk</h4>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="penduduk_l" render={({ field }) => (<FormItem><FormLabel>Laki-laki</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="penduduk_p" render={({ field }) => (<FormItem><FormLabel>Perempuan</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
        </div>
         <div className='space-y-4'>
            <h4 className='font-medium'>Jumlah Kepala Keluarga (KK)</h4>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="kk_l" render={({ field }) => (<FormItem><FormLabel>Laki-laki</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="kk_p" render={({ field }) => (<FormItem><FormLabel>Perempuan</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
        </div>
        
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

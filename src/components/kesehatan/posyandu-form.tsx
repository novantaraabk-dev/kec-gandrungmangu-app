
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PosyanduKader } from '@/lib/perangkat-data';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { villages } from '@/lib/villages';

const formSchema = z.object({
  village: z.string().min(1, 'Desa harus dipilih.'),
  posyanduName: z.string().min(1, 'Nama Posyandu tidak boleh kosong.'),
  kaderName: z.string().min(1, 'Nama Kader tidak boleh kosong.'),
});

type FormValues = z.infer<typeof formSchema>;

interface PosyanduFormProps {
  data?: Partial<PosyanduKader> | null;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PosyanduForm({ data, onSubmit, onCancel, isLoading }: PosyanduFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      village: data?.village || '',
      posyanduName: data?.posyanduName || '',
      kaderName: data?.kaderName || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="village" render={({ field }) => (
            <FormItem><FormLabel>Desa</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Desa..." /></SelectTrigger></FormControl><SelectContent>{villages.map(v => <SelectItem key={v} value={v.toLowerCase()}>{v}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="posyanduName" render={({ field }) => (
            <FormItem><FormLabel>Nama Posyandu</FormLabel><FormControl><Input placeholder="Contoh: Anggrek 1" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="kaderName" render={({ field }) => (
            <FormItem><FormLabel>Nama Kader</FormLabel><FormControl><Input placeholder="Nama lengkap kader" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
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

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PasarDesa } from '@/lib/perangkat-data';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { villages } from '@/lib/villages';

const formSchema = z.object({
  village: z.string().min(1, 'Desa harus dipilih.'),
  name: z.string().min(1, 'Nama pasar tidak boleh kosong.'),
  perdesNumber: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PasarDesaFormProps {
  data?: Partial<PasarDesa> | null;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PasarDesaForm({ data, onSubmit, onCancel, isLoading }: PasarDesaFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      village: data?.village || '',
      name: data?.name || '',
      perdesNumber: data?.perdesNumber || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="village" render={({ field }) => (
            <FormItem><FormLabel>Desa</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Desa..." /></SelectTrigger></FormControl><SelectContent>{villages.map(v => <SelectItem key={v} value={v.toLowerCase()}>{v}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Nama Pasar Desa</FormLabel><FormControl><Input placeholder="Contoh: Pasar Gandrung" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="perdesNumber" render={({ field }) => (
            <FormItem><FormLabel>Nomor Perdes</FormLabel><FormControl><Input placeholder="Nomor Peraturan Desa" {...field} /></FormControl><FormMessage /></FormItem>
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

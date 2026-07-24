'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Mbg } from '@/lib/perangkat-data';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { villages } from '@/lib/villages';

const formSchema = z.object({
  village: z.string().min(1, 'Desa harus dipilih.'),
  name: z.string().min(1, 'Nama MBG tidak boleh kosong.'),
  address: z.string().min(1, 'Alamat tidak boleh kosong.'),
});

type FormValues = z.infer<typeof formSchema>;

interface MbgFormProps {
  data?: Partial<Mbg> | null;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function MbgForm({ data, onSubmit, onCancel, isLoading }: MbgFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      village: data?.village || '',
      name: data?.name || '',
      address: data?.address || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="village" render={({ field }) => (
            <FormItem><FormLabel>Desa</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Desa..." /></SelectTrigger></FormControl><SelectContent>{villages.map(v => <SelectItem key={v} value={v.toLowerCase()}>{v}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Nama MBG</FormLabel><FormControl><Input placeholder="Contoh: MBG Sejahtera" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="address" render={({ field }) => (
            <FormItem><FormLabel>Alamat</FormLabel><FormControl><Input placeholder="Alamat lengkap MBG" {...field} /></FormControl><FormMessage /></FormItem>
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

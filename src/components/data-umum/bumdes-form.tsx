'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Bumdes } from '@/lib/perangkat-data';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { villages } from '@/lib/villages';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  village: z.string().min(1, 'Desa harus dipilih.'),
  name: z.string().min(1, 'Nama BUMDes tidak boleh kosong.'),
  establishmentAct: z.string().optional(),
  ahuNumber: z.string().optional(),
  directorName: z.string().optional(),
  businessType: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BumdesFormProps {
  data?: Partial<Bumdes> | null;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function BumdesForm({ data, onSubmit, onCancel, isLoading }: BumdesFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      village: data?.village || '',
      name: data?.name || '',
      establishmentAct: data?.establishmentAct || '',
      ahuNumber: data?.ahuNumber || '',
      directorName: data?.directorName || '',
      businessType: data?.businessType || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ScrollArea className="max-h-[60vh] pr-6">
          <div className="space-y-4 pr-2">
            <FormField control={form.control} name="village" render={({ field }) => (
                <FormItem><FormLabel>Desa</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Desa..." /></SelectTrigger></FormControl><SelectContent>{villages.map(v => <SelectItem key={v} value={v.toLowerCase()}>{v}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Nama BUMDes</FormLabel><FormControl><Input placeholder="Contoh: BUMDes Maju Bersama" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="establishmentAct" render={({ field }) => (
                <FormItem><FormLabel>Akta Pendirian</FormLabel><FormControl><Input placeholder="Nomor Akta" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="ahuNumber" render={({ field }) => (
                <FormItem><FormLabel>Nomor AHU</FormLabel><FormControl><Input placeholder="AHU-XXXXX" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="directorName" render={({ field }) => (
                <FormItem><FormLabel>Nama Direktur</FormLabel><FormControl><Input placeholder="Nama Lengkap" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="businessType" render={({ field }) => (
                <FormItem><FormLabel>Jenis Usaha</FormLabel><FormControl><Input placeholder="Contoh: Perdagangan, Jasa" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        </ScrollArea>
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

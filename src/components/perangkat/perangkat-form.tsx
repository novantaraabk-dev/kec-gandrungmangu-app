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
import { Perangkat } from '@/lib/perangkat-data';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama tidak boleh kosong." }),
  title: z.string().min(1, { message: "Jabatan tidak boleh kosong." }),
  gender: z.string().optional(),
  birthPlace: z.string().optional(),
  birthDate: z.string().optional(),
  education: z.string().optional(),
  religion: z.string().optional(),
  skNumber: z.string().optional(),
  skDate: z.string().optional(),
  inaugurationDate: z.string().optional(),
  // age, workPeriod, retirementDate, remainingWorkPeriod are derived, so not in the form
});

type PerangkatFormValues = z.infer<typeof formSchema>;

interface PerangkatFormProps {
  perangkat?: Perangkat | null;
  onSubmit: (values: PerangkatFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PerangkatForm({ perangkat, onSubmit, onCancel, isLoading }: PerangkatFormProps) {
  const form = useForm<PerangkatFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: perangkat?.name || '',
      title: perangkat?.title || '',
      gender: perangkat?.gender || '',
      birthPlace: perangkat?.birthPlace || '',
      birthDate: perangkat?.birthDate || '',
      education: perangkat?.education || '',
      religion: perangkat?.religion || '',
      skNumber: perangkat?.skNumber || '',
      skDate: perangkat?.skDate || '',
      inaugurationDate: perangkat?.inaugurationDate || '',
    },
  });

  const handleSubmit = (values: PerangkatFormValues) => {
    onSubmit(values);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <ScrollArea className="h-[60vh] pr-6">
          <div className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Nama</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Jabatan</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="gender" render={({ field }) => (
                <FormItem><FormLabel>Jenis Kelamin (L/P)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="birthPlace" render={({ field }) => (
                <FormItem><FormLabel>Tempat Lahir</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="birthDate" render={({ field }) => (
                <FormItem><FormLabel>Tanggal Lahir</FormLabel><FormControl><Input placeholder="DD/MM/YYYY" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="education" render={({ field }) => (
                <FormItem><FormLabel>Pendidikan</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="religion" render={({ field }) => (
                <FormItem><FormLabel>Agama</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="skNumber" render={({ field }) => (
                <FormItem><FormLabel>No. SK Pengangkatan</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="skDate" render={({ field }) => (
                <FormItem><FormLabel>Tgl. SK Pengangkatan</FormLabel><FormControl><Input placeholder="DD/MM/YYYY" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="inaugurationDate" render={({ field }) => (
                <FormItem><FormLabel>Tgl. Pelantikan</FormLabel><FormControl><Input placeholder="DD/MM/YYYY" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        </ScrollArea>
        <DialogFooter className="pt-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

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
import { BpdMember } from '@/lib/perangkat-data';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama tidak boleh kosong." }),
  status: z.string().min(1, { message: "Status jabatan tidak boleh kosong." }),
  bpdStatus: z.string().optional(),
  birthPlace: z.string().optional(),
  birthDate: z.string().optional(),
  education: z.string().optional(),
  religion: z.string().optional(),
  occupation: z.string().optional(),
  skNumber: z.string().optional(),
  skDate: z.string().optional(),
  tenurePeriod: z.string().optional(),
});

type BpdFormValues = z.infer<typeof formSchema>;

interface BpdFormProps {
  bpdMember?: BpdMember | null;
  onSubmit: (values: BpdFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function BpdForm({ bpdMember, onSubmit, onCancel, isLoading }: BpdFormProps) {
  const form = useForm<BpdFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: bpdMember?.name || '',
      status: bpdMember?.status || '',
      bpdStatus: bpdMember?.bpdStatus || '',
      birthPlace: bpdMember?.birthPlace || '',
      birthDate: bpdMember?.birthDate || '',
      education: bpdMember?.education || '',
      religion: bpdMember?.religion || '',
      occupation: bpdMember?.occupation || '',
      skNumber: bpdMember?.skNumber || '',
      skDate: bpdMember?.skDate || '',
      tenurePeriod: bpdMember?.tenurePeriod || '',
    },
  });

  const handleSubmit = (values: BpdFormValues) => {
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
            <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem><FormLabel>Jabatan (Ketua, Anggota, dll)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="bpdStatus" render={({ field }) => (
                <FormItem><FormLabel>Status BPD (Definitif/Antarwaktu)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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
             <FormField control={form.control} name="occupation" render={({ field }) => (
                <FormItem><FormLabel>Pekerjaan</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="skNumber" render={({ field }) => (
                <FormItem><FormLabel>No. SK</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="skDate" render={({ field }) => (
                <FormItem><FormLabel>Tanggal SK</FormLabel><FormControl><Input placeholder="DD/MM/YYYY" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="tenurePeriod" render={({ field }) => (
                <FormItem><FormLabel>Periode Jabatan</FormLabel><FormControl><Input placeholder="YYYY-YYYY" {...field} /></FormControl><FormMessage /></FormItem>
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

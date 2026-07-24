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
import { type RtRwMember } from '@/lib/perangkat-data';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama tidak boleh kosong." }),
  position: z.string().min(1, { message: "Jabatan tidak boleh kosong." }),
  dusun: z.string().min(1, { message: "Dusun tidak boleh kosong." }),
  rw: z.string().min(1, { message: "RW tidak boleh kosong." }),
  rt: z.string().min(1, { message: "RT tidak boleh kosong." }),
});

type RtRwFormValues = z.infer<typeof formSchema>;

interface RtRwFormProps {
  rtRwMember?: RtRwMember | null;
  onSubmit: (values: RtRwFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function RtRwForm({ rtRwMember, onSubmit, onCancel, isLoading }: RtRwFormProps) {
  const form = useForm<RtRwFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: rtRwMember?.name || '',
      position: rtRwMember?.position || '',
      dusun: rtRwMember?.dusun || '',
      rw: rtRwMember?.rw || '',
      rt: rtRwMember?.rt || '',
    },
  });

  const handleSubmit = (values: RtRwFormValues) => {
    onSubmit(values);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <ScrollArea className="h-[60vh] pr-6 -mr-6">
          <div className="space-y-4 pr-6">
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Nama</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="position" render={({ field }) => (
                <FormItem><FormLabel>Jabatan (Contoh: KETUA RT 01 / RW 01)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="dusun" render={({ field }) => (
                <FormItem><FormLabel>Dusun</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="rw" render={({ field }) => (
                    <FormItem><FormLabel>RW (Contoh: RW 01)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="rt" render={({ field }) => (
                    <FormItem><FormLabel>RT (Contoh: RT 01)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="pt-6 mt-auto sm:justify-end -ml-6 -mr-6 -mb-6 px-6 py-4 bg-muted/50 rounded-b-lg">
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

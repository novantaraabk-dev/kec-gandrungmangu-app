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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { P3keIntervention } from '@/lib/perangkat-data';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2, PlusCircle } from 'lucide-react';

const formSchema = z.object({
  jenisIntervensi: z.string().min(1, 'Jenis intervensi tidak boleh kosong.'),
  jumlahPenerima: z.string().min(1, 'Jumlah penerima tidak boleh kosong.'),
  totalAnggaran: z.string().min(1, 'Total anggaran tidak boleh kosong.'),
  sumberAnggaran: z.string().min(1, 'Sumber anggaran harus dipilih.'),
});

type P3keFormValues = z.infer<typeof formSchema>;

interface P3keFormProps {
  intervention?: Partial<P3keIntervention> | null;
  onSubmit: (values: P3keFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function P3keForm({ intervention, onSubmit, onCancel, isLoading }: P3keFormProps) {
  const isEditMode = !!intervention;

  const form = useForm<P3keFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jenisIntervensi: intervention?.jenisIntervensi || '',
      jumlahPenerima: intervention?.jumlahPenerima || '',
      totalAnggaran: intervention?.totalAnggaran || '',
      sumberAnggaran: intervention?.sumberAnggaran || '',
    },
  });
  
  const handleSubmit = (values: P3keFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="jenisIntervensi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Intervensi</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Jambanisasi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jumlahPenerima"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah Penerima Manfaat</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: 5 orang" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalAnggaran"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Anggaran</FormLabel>
              <FormControl>
                <Input placeholder="Rp 15.000.000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sumberAnggaran"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sumber Anggaran</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih sumber..." />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Dana Desa">Dana Desa</SelectItem>
                        <SelectItem value="Bansus">Bansus</SelectItem>
                        <SelectItem value="Banprov">Banprov</SelectItem>
                        <SelectItem value="Pokir">Pokir</SelectItem>
                        <SelectItem value="APBN">APBN</SelectItem>
                        <SelectItem value="CSR">CSR</SelectItem>
                        <SelectItem value="Sumber Lainnya">Sumber Lainnya</SelectItem>
                    </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                {isLoading ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Simpan Intervensi')}
            </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

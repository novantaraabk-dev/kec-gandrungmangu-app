'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { JalanKabupaten } from '@/lib/perangkat-data';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  village: z.string().min(1, 'Desa harus diisi.'),
  noRuas: z.string().min(1, 'Nomor Ruas tidak boleh kosong.'),
  namaRuas: z.string().min(1, 'Nama Ruas Jalan tidak boleh kosong.'),
  pangkalRuas: z.string().optional(),
  ujungRuas: z.string().optional(),
  panjangRuas: z.string().optional(),
  lebarRuas: z.string().optional(),
  kondisiBaik: z.string().optional(),
  kondisiSedang: z.string().optional(),
  kondisiRusakRingan: z.string().optional(),
  kondisiRusakBerat: z.string().optional(),
  usulanMusren: z.string().optional(),
  usulanDesa: z.string().optional(),
  paguUsulan: z.string().optional(),
  panjangUsulan: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface JalanKabupatenFormProps {
  data?: Partial<JalanKabupaten> | null;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
  showVillageInput?: boolean;
}

export function JalanKabupatenForm({ data, onSubmit, onCancel, onDelete, isLoading, showVillageInput = false }: JalanKabupatenFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      village: data?.village || '',
      noRuas: data?.noRuas || '',
      namaRuas: data?.namaRuas || '',
      pangkalRuas: data?.pangkalRuas || '',
      ujungRuas: data?.ujungRuas || '',
      panjangRuas: String(data?.panjangRuas ?? ''),
      lebarRuas: String(data?.lebarRuas ?? ''),
      kondisiBaik: String(data?.kondisiBaik ?? ''),
      kondisiSedang: String(data?.kondisiSedang ?? ''),
      kondisiRusakRingan: String(data?.kondisiRusakRingan ?? ''),
      kondisiRusakBerat: String(data?.kondisiRusakBerat ?? ''),
      usulanMusren: data?.usulanMusren || '',
      usulanDesa: data?.usulanDesa || '',
      paguUsulan: String(data?.paguUsulan ?? ''),
      panjangUsulan: String(data?.panjangUsulan ?? ''),
    },
  });
  
  useEffect(() => {
    form.reset({
        village: data?.village || '',
        noRuas: data?.noRuas || '',
        namaRuas: data?.namaRuas || '',
        pangkalRuas: data?.pangkalRuas || '',
        ujungRuas: data?.ujungRuas || '',
        panjangRuas: String(data?.panjangRuas ?? ''),
        lebarRuas: String(data?.lebarRuas ?? ''),
        kondisiBaik: String(data?.kondisiBaik ?? ''),
        kondisiSedang: String(data?.kondisiSedang ?? ''),
        kondisiRusakRingan: String(data?.kondisiRusakRingan ?? ''),
        kondisiRusakBerat: String(data?.kondisiRusakBerat ?? ''),
        usulanMusren: data?.usulanMusren || '',
        usulanDesa: data?.usulanDesa || '',
        paguUsulan: String(data?.paguUsulan ?? ''),
        panjangUsulan: String(data?.panjangUsulan ?? ''),
    });
  }, [data, form.reset]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ScrollArea className="h-[60vh] pr-6 -mr-6">
          <div className="space-y-4 pr-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {showVillageInput && (
                <FormField control={form.control} name="village" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desa</FormLabel>
                    <FormControl>
                        <Input placeholder="Contoh: gandrungmangu, karanganyar" {...field} />
                    </FormControl>
                    <FormDescription>
                        Bisa diisi lebih dari satu desa, pisahkan dengan koma.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
              <FormField control={form.control} name="noRuas" render={({ field }) => (<FormItem><FormLabel>No Ruas</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="namaRuas" render={({ field }) => (<FormItem className={showVillageInput ? 'md:col-span-1' : 'md:col-span-2'}><FormLabel>Nama Ruas Jalan</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="pangkalRuas" render={({ field }) => (<FormItem><FormLabel>Pangkal Ruas</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="ujungRuas" render={({ field }) => (<FormItem><FormLabel>Ujung Ruas</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="panjangRuas" render={({ field }) => (<FormItem><FormLabel>Panjang (M)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="lebarRuas" render={({ field }) => (<FormItem><FormLabel>Lebar (M)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <h4 className="font-semibold pt-2 border-t">Kondisi (Meter)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField control={form.control} name="kondisiBaik" render={({ field }) => (<FormItem><FormLabel>BAIK (Meter)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="kondisiSedang" render={({ field }) => (<FormItem><FormLabel>SEDANG (Meter)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="kondisiRusakRingan" render={({ field }) => (<FormItem><FormLabel>RUSAK RINGAN (Meter)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="kondisiRusakBerat" render={({ field }) => (<FormItem><FormLabel>RUSAK BERAT (Meter)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <h4 className="font-semibold pt-2 border-t">Usulan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="usulanDesa" render={({ field }) => (<FormItem><FormLabel>Usulan Desa</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="usulanMusren" render={({ field }) => (<FormItem><FormLabel>Usulan RKPD 2026</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="paguUsulan" render={({ field }) => (<FormItem><FormLabel>Pagu Usulan RKPD 2026</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="panjangUsulan" render={({ field }) => (<FormItem><FormLabel>Panjang Usulan</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="pt-6 sm:justify-between">
            <div>
              {onDelete && (
                <Button type="button" variant="destructive" onClick={onDelete} disabled={isLoading}>
                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                </Button>
              )}
            </div>
            <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Batal</Button>
                <Button type="submit" disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Simpan</Button>
            </div>
        </DialogFooter>
      </form>
    </Form>
  );
}

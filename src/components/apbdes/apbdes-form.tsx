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
import { type ApbdesDetail } from '@/lib/perangkat-data';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  category: z.string().min(1, 'Bidang tidak boleh kosong.'),
  activityCode: z.string().min(1, 'Kode Kegiatan tidak boleh kosong.'),
  code: z.string().min(1, 'Kode tidak boleh kosong.'),
  description: z.string().min(1, 'Nama Kegiatan tidak boleh kosong.'),
  amount: z.preprocess(
    (a) => parseFloat(String(a).replace(/[^0-9.-]+/g, '')),
    z.number().positive('Anggaran harus berupa angka positif.')
  ),
  fundingSource: z.string().min(1, 'Sumber Dana tidak boleh kosong.'),
});

type ApbdesFormValues = z.infer<typeof formSchema>;

interface ApbdesFormProps {
  detail?: Partial<ApbdesDetail> | null;
  onSubmit: (values: ApbdesFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const sumberDanaOptions = ["DDS", "ADD", "PBH", "DLL", "PAD", "PBK", "PBP", "SWD"];
const bidangOptions = [
  "Pendapatan",
  "BIDANG PENYELENGGARAN PEMERINTAHAN DESA",
  "BIDANG PELAKSANAAN PEMBANGUNAN DESA",
  "BIDANG PEMBINAAN KEMASYARAKATAN",
  "BIDANG PEMBERDAYAAN MASYARAKAT",
  "BIDANG PENANGGULANGAN BENCANA, DARURAT DAN MENDESAK DESA",
];

export function ApbdesForm({ detail, onSubmit, onCancel, isLoading }: ApbdesFormProps) {
  const form = useForm<ApbdesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: detail?.category || '',
      activityCode: detail?.activityCode || '',
      code: detail?.code || '',
      description: detail?.description || '',
      amount: detail?.amount || 0,
      fundingSource: detail?.fundingSource || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ScrollArea className="h-[60vh] pr-6 -mr-6">
            <div className="space-y-4 pr-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bidang</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Bidang..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bidangOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="activityCode" render={({ field }) => (
                        <FormItem><FormLabel>Kode Kegiatan</FormLabel><FormControl><Input placeholder="Contoh: 01.10.01" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="code" render={({ field }) => (
                        <FormItem><FormLabel>Kode</FormLabel><FormControl><Input placeholder="Contoh: 1.1" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Nama Kegiatan</FormLabel><FormControl><Input placeholder="Contoh: Penyediaan Penghasilan Tetap dan Tunjangan Kepala Desa" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <FormField control={form.control} name="amount" render={({ field }) => (
                        <FormItem><FormLabel>Anggaran (Rp)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField
                      control={form.control}
                      name="fundingSource"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sumber Dana</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih Sumber Dana..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sumberDanaOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
            </div>
        </ScrollArea>
        
        <DialogFooter className="pt-6">
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


'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { PbbP2 } from '@/lib/perangkat-data';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { villages } from '@/lib/villages';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';

const formSchema = z.object({
  village: z.string().min(1, 'Desa harus dipilih.'),
  year: z.preprocess((val) => Number(String(val)), z.number().min(2000, 'Tahun tidak valid.')),
  pagu: z.preprocess((val) => Number(String(val)), z.number().min(0, 'Pagu tidak boleh negatif.')),
  totalSppt: z.preprocess((val) => Number(String(val)), z.number().min(0, 'Total SPPT tidak boleh negatif.')),
  terbayar: z.preprocess((val) => Number(String(val)), z.number().min(0, 'Nilai terbayar tidak boleh negatif.')),
});

type FormValues = z.infer<typeof formSchema>;

interface PbbP2FormProps {
  data?: Partial<PbbP2> | null;
  onSubmit: (values: FormValues, imageFile: File | null) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PbbP2Form({ data, onSubmit, onCancel, isLoading }: PbbP2FormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(data?.imageUrl || null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      village: data?.village || '',
      year: data?.year || new Date().getFullYear(),
      pagu: data?.pagu || 0,
      totalSppt: data?.totalSppt || 0,
      terbayar: data?.terbayar || 0,
    },
  });

  useEffect(() => {
    form.reset({
      village: data?.village || '',
      year: data?.year || new Date().getFullYear(),
      pagu: data?.pagu || 0,
      totalSppt: data?.totalSppt || 0,
      terbayar: data?.terbayar || 0,
    });
    setImagePreview(data?.imageUrl || null);
    setImageFile(null);
  }, [data, form]);
  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = (values: FormValues) => {
    onSubmit(values, imageFile);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <ScrollArea className="max-h-[60vh] pr-6">
          <div className="space-y-4 pr-2">
            <FormField control={form.control} name="village" render={({ field }) => (
                <FormItem><FormLabel>Desa</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Desa..." /></SelectTrigger></FormControl><SelectContent>{villages.map(v => <SelectItem key={v} value={v.toLowerCase()}>{v}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="year" render={({ field }) => (
                <FormItem><FormLabel>Tahun</FormLabel><FormControl><Input type="number" placeholder="Tahun rekapitulasi" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="pagu" render={({ field }) => (
                <FormItem><FormLabel>Pagu PBB P2</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="totalSppt" render={({ field }) => (
                <FormItem><FormLabel>Total SPPT</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="terbayar" render={({ field }) => (
                <FormItem><FormLabel>Terbayar</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <div className="space-y-2">
                <FormLabel htmlFor="image-upload">Bukti Bayar (JPG/PNG, Opsional)</FormLabel>
                {imagePreview && (
                    <div className="relative w-full h-40 bg-muted rounded-md mt-2">
                        <Image src={imagePreview} alt="Preview Bukti Bayar" layout="fill" className="rounded-md object-contain" />
                    </div>
                )}
                <Input id="image-upload" type="file" accept="image/jpeg, image/png" className="cursor-pointer" onChange={handleImageChange} />
             </div>
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

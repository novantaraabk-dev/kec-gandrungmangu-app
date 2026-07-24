
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { villages } from '@/lib/villages';

const formSchema = z.object({
  village: z.string().min(1, 'Desa harus dipilih.'),
  paymentDate: z.string().min(1, 'Tanggal setor tidak boleh kosong.'),
  amount: z.preprocess((val) => Number(String(val).replace(/[^0-9.-]+/g, "")), z.number().min(1, 'Nominal setoran harus lebih dari 0.')),
});

export type PbbPaymentFormValues = z.infer<typeof formSchema>;

interface PbbPaymentFormProps {
  onSubmit: (values: PbbPaymentFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PbbPaymentForm({ onSubmit, onCancel, isLoading }: PbbPaymentFormProps) {
  const form = useForm<PbbPaymentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { village: '', paymentDate: '', amount: 0 },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="village" render={({ field }) => (
            <FormItem><FormLabel>Desa</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih Desa..." /></SelectTrigger></FormControl><SelectContent>{villages.map(v => <SelectItem key={v} value={v.toLowerCase()}>{v}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="paymentDate" render={({ field }) => (
            <FormItem><FormLabel>Tanggal Setor</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="amount" render={({ field }) => (
            <FormItem><FormLabel>Nominal Setoran (Rp)</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Batal</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Setoran
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

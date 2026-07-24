'use client';

import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { villages } from '@/lib/villages';
import { regulationTemplates, RegulationType } from '@/lib/regulation-templates';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  desa: z.string().min(1, { message: "Desa harus dipilih." }),
  type: z.string().min(1, { message: "Jenis dokumen harus dipilih." }),
  template: z.string().optional(),
  number: z.string().min(1, { message: "Nomor dokumen tidak boleh kosong." }),
  date: z.string().min(1, { message: "Tanggal tidak boleh kosong." }),
  about: z.string().min(1, { message: "Perihal tidak boleh kosong." }),
  file: z.any().refine(file => file?.length == 1, 'File harus diunggah.'),
});

type RegulationFormValues = z.infer<typeof formSchema>;

interface RegulationFormProps {
  onFormSubmit: () => void;
}

export function RegulationForm({ onFormSubmit }: RegulationFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<RegulationType | null>(null);

  const form = useForm<RegulationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      desa: '',
      type: '',
      template: '',
      number: '',
      date: '',
      about: '',
    },
  });

  const handleTypeChange = (value: string) => {
    form.setValue('type', value);
    form.setValue('about', '');
    form.setValue('template', '');
    setSelectedType(value as RegulationType);
  }

  const handleTemplateChange = (value: string) => {
    form.setValue('template', value);
    if(value){
      const [type, about] = value.split('||');
      form.setValue('about', about);
    } else {
      form.setValue('about', '');
    }
  }

  async function onSubmit(values: RegulationFormValues) {
    setIsLoading(true);
    // Simulate file upload and form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(values);
    setIsLoading(false);
    toast({
      title: "Berhasil",
      description: `Produk hukum "${values.about}" telah berhasil diunggah.`,
    });
    form.reset();
    setSelectedType(null);
    onFormSubmit(); // Close the dialog
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="desa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Desa</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih desa Anda" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {villages.map(village => (
                    <SelectItem key={village} value={village.toLowerCase()}>{village}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Dokumen</FormLabel>
              <Select onValueChange={handleTypeChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis produk hukum" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Perdes">Perdes (Peraturan Desa)</SelectItem>
                  <SelectItem value="Perkades">Perkades (Peraturan Kepala Desa)</SelectItem>
                  <SelectItem value="SK">SK (Surat Keputusan)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {selectedType && regulationTemplates[selectedType] && (
           <FormField
            control={form.control}
            name="template"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gunakan Template (Opsional)</FormLabel>
                 <Select onValueChange={handleTemplateChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Pilih template umum untuk ${selectedType}...`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">-- Tanpa Template --</SelectItem>
                    {regulationTemplates[selectedType].map(template => (
                      <SelectItem key={template.name} value={`${template.name}||${template.about}`}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Perihal Dokumen</FormLabel>
              <FormControl>
                <Textarea placeholder="Contoh: Tentang Anggaran Pendapatan dan Belanja Desa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Nomor Dokumen</FormLabel>
                <FormControl>
                    <Input placeholder="Contoh: 01/2024" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Tanggal Penetapan</FormLabel>
                <FormControl>
                    <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
            control={form.control}
            name="file"
            render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                <FormLabel>Upload Dokumen (PDF)</FormLabel>
                <FormControl>
                    <Input 
                        type="file" 
                        accept=".pdf"
                        onChange={(event) => onChange(event.target.files)}
                        {...fieldProps}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mengunggah...
            </>
          ) : (
            "Kirim Dokumen"
          )}
        </Button>
      </form>
    </Form>
  );
}

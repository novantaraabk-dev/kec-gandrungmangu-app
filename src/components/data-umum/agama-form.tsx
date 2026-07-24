'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { villages } from '@/lib/villages';
import type { PendudukAgama } from '@/lib/penduduk-agama-data';
import { Loader2 } from 'lucide-react';

interface AgamaFormProps {
  initialData?: PendudukAgama | null;
  onSubmit: (data: Omit<PendudukAgama, 'id'>) => Promise<void>;
  isSubmitting: boolean;
}

export function AgamaForm({ initialData, onSubmit, isSubmitting }: AgamaFormProps) {
  const [village, setVillage] = useState(initialData?.village || villages[0].toUpperCase());
  const [islam, setIslam] = useState(initialData?.islam || 0);
  const [kristenProtestan, setKristenProtestan] = useState(initialData?.kristenProtestan || 0);
  const [katolik, setKatolik] = useState(initialData?.katolik || 0);
  const [budha, setBudha] = useState(initialData?.budha || 0);
  const [hindu, setHindu] = useState(initialData?.hindu || 0);
  const [konghucu, setKonghucu] = useState(initialData?.konghucu || 0);
  const [kepercayaan, setKepercayaan] = useState(initialData?.kepercayaan || 0);
  const [lainLain, setLainLain] = useState(initialData?.lainLain || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      village: village.toUpperCase(),
      islam: Number(islam) || 0,
      kristenProtestan: Number(kristenProtestan) || 0,
      katolik: Number(katolik) || 0,
      budha: Number(budha) || 0,
      hindu: Number(hindu) || 0,
      konghucu: Number(konghucu) || 0,
      kepercayaan: Number(kepercayaan) || 0,
      lainLain: Number(lainLain) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="village" className="text-xs font-bold uppercase tracking-wider">Nama Desa</Label>
        <Select value={village} onValueChange={setVillage}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Pilih Desa" />
          </SelectTrigger>
          <SelectContent>
            {villages.map((v) => (
              <SelectItem key={v} value={v.toUpperCase()}>
                {v.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="islam" className="text-xs font-bold">Islam</Label>
          <Input
            id="islam"
            type="number"
            min="0"
            value={islam}
            onChange={(e) => setIslam(Number(e.target.value))}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="kristenProtestan" className="text-xs font-bold">Kristen Protestan</Label>
          <Input
            id="kristenProtestan"
            type="number"
            min="0"
            value={kristenProtestan}
            onChange={(e) => setKristenProtestan(Number(e.target.value))}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="katolik" className="text-xs font-bold">Katolik</Label>
          <Input
            id="katolik"
            type="number"
            min="0"
            value={katolik}
            onChange={(e) => setKatolik(Number(e.target.value))}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="budha" className="text-xs font-bold">Budha</Label>
          <Input
            id="budha"
            type="number"
            min="0"
            value={budha}
            onChange={(e) => setBudha(Number(e.target.value))}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="hindu" className="text-xs font-bold">Hindu</Label>
          <Input
            id="hindu"
            type="number"
            min="0"
            value={hindu}
            onChange={(e) => setHindu(Number(e.target.value))}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="konghucu" className="text-xs font-bold">Konghucu</Label>
          <Input
            id="konghucu"
            type="number"
            min="0"
            value={konghucu}
            onChange={(e) => setKonghucu(Number(e.target.value))}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="kepercayaan" className="text-xs font-bold">Kepercayaan</Label>
          <Input
            id="kepercayaan"
            type="number"
            min="0"
            value={kepercayaan}
            onChange={(e) => setKepercayaan(Number(e.target.value))}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="lainLain" className="text-xs font-bold">Lain-Lain</Label>
          <Input
            id="lainLain"
            type="number"
            min="0"
            value={lainLain}
            onChange={(e) => setLainLain(Number(e.target.value))}
            required
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            'Simpan Data'
          )}
        </Button>
      </div>
    </form>
  );
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { villages } from '@/lib/villages';
import type { RumahIbadah } from '@/lib/rumah-ibadah-data';
import { Loader2 } from 'lucide-react';

interface RumahIbadahFormProps {
  initialData?: RumahIbadah | null;
  onSubmit: (data: Omit<RumahIbadah, 'id'>) => Promise<void>;
  isSubmitting: boolean;
}

export function RumahIbadahForm({ initialData, onSubmit, isSubmitting }: RumahIbadahFormProps) {
  const [village, setVillage] = useState(initialData?.village || villages[0].toUpperCase());
  const [masjid, setMasjid] = useState(initialData?.masjid || 0);
  const [mushola, setMushola] = useState(initialData?.mushola || 0);
  const [gerejaProtestan, setGerejaProtestan] = useState(initialData?.gerejaProtestan || 0);
  const [gerejaKatolik, setGerejaKatolik] = useState(initialData?.gerejaKatolik || 0);
  const [wihara, setWihara] = useState(initialData?.wihara || 0);
  const [pura, setPura] = useState(initialData?.pura || 0);
  const [sanggar, setSanggar] = useState(initialData?.sanggar || 0);
  const [lainnya, setLainnya] = useState(initialData?.lainnya || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      village: village.toUpperCase(),
      masjid: Number(masjid) || 0,
      mushola: Number(mushola) || 0,
      gerejaProtestan: Number(gerejaProtestan) || 0,
      gerejaKatolik: Number(gerejaKatolik) || 0,
      wihara: Number(wihara) || 0,
      pura: Number(pura) || 0,
      sanggar: Number(sanggar) || 0,
      lainnya: Number(lainnya) || 0,
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
          <Label htmlFor="masjid" className="text-xs font-bold">Masjid</Label>
          <Input
            id="masjid"
            type="number"
            min="0"
            value={masjid}
            onChange={(e) => setMasjid(Number(e.target.value))}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="mushola" className="text-xs font-bold">Mushola</Label>
          <Input
            id="mushola"
            type="number"
            min="0"
            value={mushola}
            onChange={(e) => setMushola(Number(e.target.value))}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="gerejaProtestan" className="text-xs font-bold">Gereja Protestan</Label>
          <Input
            id="gerejaProtestan"
            type="number"
            min="0"
            value={gerejaProtestan}
            onChange={(e) => setGerejaProtestan(Number(e.target.value))}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="gerejaKatolik" className="text-xs font-bold">Gereja Katolik</Label>
          <Input
            id="gerejaKatolik"
            type="number"
            min="0"
            value={gerejaKatolik}
            onChange={(e) => setGerejaKatolik(Number(e.target.value))}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="wihara" className="text-xs font-bold">Wihara</Label>
          <Input
            id="wihara"
            type="number"
            min="0"
            value={wihara}
            onChange={(e) => setWihara(Number(e.target.value))}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="pura" className="text-xs font-bold">Pura</Label>
          <Input
            id="pura"
            type="number"
            min="0"
            value={pura}
            onChange={(e) => setPura(Number(e.target.value))}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="sanggar" className="text-xs font-bold">Sanggar</Label>
          <Input
            id="sanggar"
            type="number"
            min="0"
            value={sanggar}
            onChange={(e) => setSanggar(Number(e.target.value))}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="lainnya" className="text-xs font-bold">Lainnya</Label>
          <Input
            id="lainnya"
            type="number"
            min="0"
            value={lainnya}
            onChange={(e) => setLainnya(Number(e.target.value))}
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

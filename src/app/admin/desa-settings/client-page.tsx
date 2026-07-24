'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { villages } from '@/lib/villages';
import { Loader2, Save } from 'lucide-react';
import type { User } from '@/lib/auth';

interface VillageSetting {
  id: string;
  villageName: string;
  spjDriveFolderId?: string;
  produkHukumDriveFolderId?: string;
}

export default function DesaSettingsClientPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const settingsCollectionRef = useMemoFirebase(() => {
    return firestore ? collection(firestore, 'villageSettings') : null;
  }, [firestore]);

  const { data: villageSettings, isLoading: isLoadingSettings } = useCollection<VillageSetting>(settingsCollectionRef);

  const [settingsMap, setSettingsMap] = useState<Record<string, Partial<VillageSetting>>>({});
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (villageSettings) {
      const newMap: Record<string, Partial<VillageSetting>> = {};
      villageSettings.forEach(setting => {
        newMap[setting.villageName.toLowerCase()] = setting;
      });
      setSettingsMap(newMap);
    }
  }, [villageSettings]);

  const handleInputChange = (village: string, field: 'spjDriveFolderId' | 'produkHukumDriveFolderId', value: string) => {
    const villageKey = village.toLowerCase();
    setSettingsMap(prev => ({
      ...prev,
      [villageKey]: {
        ...(prev[villageKey] || {}),
        villageName: village,
        [field]: value,
      }
    }));
  };

  const handleSave = async (village: string) => {
    if (!firestore || !user) {
      toast({ variant: 'destructive', title: 'Error', description: 'Anda harus login untuk menyimpan.' });
      return;
    }
    const villageKey = village.toLowerCase();
    const villageData = settingsMap[villageKey];

    if (!villageData || (!villageData.spjDriveFolderId && !villageData.produkHukumDriveFolderId)) {
        toast({ variant: 'destructive', title: 'Data Kurang', description: 'Harap isi setidaknya satu ID Folder.' });
        return;
    }

    setIsSaving(prev => ({ ...prev, [villageKey]: true }));

    try {
      const docRef = doc(firestore, 'villageSettings', villageKey);
      await setDoc(docRef, {
        id: villageKey,
        villageName: village,
        spjDriveFolderId: villageData.spjDriveFolderId || '',
        produkHukumDriveFolderId: villageData.produkHukumDriveFolderId || '',
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      }, { merge: true });

      toast({ title: 'Berhasil', description: `Pengaturan untuk Desa ${village} telah disimpan.` });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Gagal Menyimpan', description: 'Terjadi kesalahan saat menyimpan data.' });
    } finally {
      setIsSaving(prev => ({ ...prev, [villageKey]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Pengaturan Desa</h1>
        <p className="text-muted-foreground">
          Kelola ID Folder Google Drive untuk setiap desa. ID ini digunakan untuk menyimpan dokumen SPJ dan Produk Hukum.
        </p>
      </div>

      {isLoadingSettings && (
        <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!isLoadingSettings && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {villages.map(village => {
            const villageKey = village.toLowerCase();
            const currentSettings = settingsMap[villageKey] || {};
            const saving = isSaving[villageKey] || false;

            return (
              <Card key={village}>
                <CardHeader>
                  <CardTitle>{village}</CardTitle>
                  <CardDescription>Masukkan ID Folder dari URL Google Drive.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`spj-${villageKey}`}>ID Folder SPJ</Label>
                    <Input
                      id={`spj-${villageKey}`}
                      placeholder="Contoh: 1a2b3c..."
                      value={currentSettings.spjDriveFolderId || ''}
                      onChange={(e) => handleInputChange(village, 'spjDriveFolderId', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`hukum-${villageKey}`}>ID Folder Produk Hukum</Label>
                    <Input
                      id={`hukum-${villageKey}`}
                      placeholder="Contoh: 4d5e6f..."
                      value={currentSettings.produkHukumDriveFolderId || ''}
                      onChange={(e) => handleInputChange(village, 'produkHukumDriveFolderId', e.target.value)}
                    />
                  </div>
                  <Button onClick={() => handleSave(village)} disabled={saving} className="w-full">
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {saving ? 'Menyimpan...' : 'Simpan'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

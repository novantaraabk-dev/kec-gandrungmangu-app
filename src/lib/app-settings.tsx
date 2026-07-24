'use client';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import placeholderData from '@/lib/placeholder-images.json';

export interface AppSettings {
  logoUrl: string | null;
  backgroundUrl: string | null;
  villageBackgroundUrl: string | null;
  arsipDriveFolderIds: Record<string, string> | null;
  profileVideoUrl: string | null;
  camatPhotoUrl: string | null;
  camatName: string | null;
  camatTitle: string | null;
  kecamatanMaksudTujuan: string | null;
}

const AppSettingsContext = createContext<AppSettings>({
  logoUrl: null,
  backgroundUrl: null,
  villageBackgroundUrl: null,
  arsipDriveFolderIds: null,
  profileVideoUrl: null,
  camatPhotoUrl: null,
  camatName: 'Fathan Ady Chandra, S.STP., M.M.',
  camatTitle: 'Camat Gandrungmangu',
  kecamatanMaksudTujuan: 'Sistem Online Informasi & Data (SOLID) Kecamatan Gandrungmangu terintegrasi secara digital untuk mewujudkan transparansi tata kelola pemerintahan desa, akurasi data kependudukan, pemetaan infrastruktur jalan desa & kabupaten, serta percepatan pelayanan publik yang efektif dan akuntabel bagi seluruh masyarakat.',
});

export const AppSettingsProvider = ({ children }: { children: ReactNode }) => {
  const firestore = useFirestore();
  
  const settingsDocRef = useMemoFirebase(() => {
    return firestore ? doc(firestore, 'settings', 'global') : null;
  }, [firestore]);

  const { data: settingsData } = useDoc<any>(settingsDocRef, { suppressGlobalError: true });

  const [settings, setSettings] = useState<AppSettings>({
    logoUrl: placeholderData.placeholderImages.find(p => p.id === 'app-logo')?.imageUrl || null,
    backgroundUrl: placeholderData.placeholderImages.find(p => p.id === 'hero-background')?.imageUrl || null,
    villageBackgroundUrl: placeholderData.placeholderImages.find(p => p.id === 'village-background')?.imageUrl || null,
    arsipDriveFolderIds: null,
    profileVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    camatPhotoUrl: null,
    camatName: 'Fathan Ady Chandra, S.STP., M.M.',
    camatTitle: 'Camat Gandrungmangu',
    kecamatanMaksudTujuan: 'Sistem Online Informasi & Data (SOLID) Kecamatan Gandrungmangu terintegrasi secara digital untuk mewujudkan transparansi tata kelola pemerintahan desa, akurasi data kependudukan, pemetaan infrastruktur jalan desa & kabupaten, serta percepatan pelayanan publik yang efektif dan akuntabel bagi seluruh masyarakat.',
  });

  useEffect(() => {
    if (settingsData) {
      setSettings(prevSettings => ({
        logoUrl: settingsData.logoUrl || prevSettings.logoUrl,
        backgroundUrl: settingsData.backgroundUrl || prevSettings.backgroundUrl,
        villageBackgroundUrl: settingsData.villageBackgroundUrl || prevSettings.villageBackgroundUrl,
        arsipDriveFolderIds: settingsData.arsipDriveFolderIds || prevSettings.arsipDriveFolderIds,
        profileVideoUrl: settingsData.profileVideoUrl || prevSettings.profileVideoUrl,
        camatPhotoUrl: settingsData.camatPhotoUrl || prevSettings.camatPhotoUrl,
        camatName: settingsData.camatName || prevSettings.camatName,
        camatTitle: settingsData.camatTitle || prevSettings.camatTitle,
        kecamatanMaksudTujuan: settingsData.kecamatanMaksudTujuan || prevSettings.kecamatanMaksudTujuan,
      }));
    }
  }, [settingsData]);

  return (
    <AppSettingsContext.Provider value={settings}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => useContext(AppSettingsContext);
'use client';

import { useState, type ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Loader2, AlertCircle, Save, UserCheck } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAppSettings } from '@/lib/app-settings';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';

interface GlobalSettingsData {
  arsipDriveFolderIds?: Record<string, string>;
  profileVideoUrl?: string;
  camatName?: string;
  camatTitle?: string;
  kecamatanMaksudTujuan?: string;
}

const docCategories = ["PM", "TAPEM", "TRANTIBUM", "KESRA", "UMUM & PELAYANAN", "PKA"];

export default function SettingsClientPage() {
  // --- Konfigurasi Cloudinary ---
  const cloudinaryCloudName = 'dgsxujjb1'; 
  const cloudinaryLogoUploadPreset = 'LogoDesa'; 
  const cloudinaryBgUploadPreset = 'UploadBeground';
  const cloudinaryVillageBgUploadPreset = 'BegroundDesa';
  // ---------------------------------

  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const { logoUrl, backgroundUrl, villageBackgroundUrl, camatPhotoUrl, camatName: appCamatName, camatTitle: appCamatTitle, kecamatanMaksudTujuan: appMaksudTujuan } = useAppSettings();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [bgPreview, setBgPreview] = useState<string | null>(null);
  const [isBgUploading, setIsBgUploading] = useState(false);

  const [villageBgFile, setVillageBgFile] = useState<File | null>(null);
  const [villageBgPreview, setVillageBgPreview] = useState<string | null>(null);
  const [isVillageBgUploading, setIsVillageBgUploading] = useState(false);

  // States for Camat Photo & Profile
  const [camatFile, setCamatFile] = useState<File | null>(null);
  const [camatPreview, setCamatPreview] = useState<string | null>(null);
  const [isCamatUploading, setIsCamatUploading] = useState(false);

  const [camatNameDraft, setCamatNameDraft] = useState<string | null>(null);
  const [camatTitleDraft, setCamatTitleDraft] = useState<string | null>(null);
  const [maksudTujuanDraft, setMaksudTujuanDraft] = useState<string | null>(null);
  const [isCamatSaving, setIsCamatSaving] = useState(false);

  const [arsipFolderIdsDraft, setArsipFolderIdsDraft] = useState<Record<string, string> | null>(null);
  const [isArsipSaving, setIsArsipSaving] = useState(false);

  const [youtubeUrlDraft, setYoutubeUrlDraft] = useState<string | null>(null);
  const [isVideoSaving, setIsVideoSaving] = useState(false);
  const { profileVideoUrl: currentProfileVideoUrl } = useAppSettings();

  const isConfigured = (cloudinaryCloudName as string) !== 'YOUR_CLOUD_NAME';
  
  const settingsDoc = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'global') : null, [firestore]);
  const { data: globalSettings } = useDoc<GlobalSettingsData>(settingsDoc);

  const camatName = camatNameDraft ?? globalSettings?.camatName ?? appCamatName ?? 'Fathan Ady Chandra, S.STP., M.M.';
  const camatTitle = camatTitleDraft ?? globalSettings?.camatTitle ?? appCamatTitle ?? 'Camat Gandrungmangu';
  const maksudTujuan = maksudTujuanDraft ?? globalSettings?.kecamatanMaksudTujuan ?? appMaksudTujuan ?? '';
  const arsipFolderIds = arsipFolderIdsDraft ?? globalSettings?.arsipDriveFolderIds ?? {};
  const youtubeUrl = youtubeUrlDraft ?? globalSettings?.profileVideoUrl ?? currentProfileVideoUrl ?? '';

  const setCamatName = (value: string) => setCamatNameDraft(value);
  const setCamatTitle = (value: string) => setCamatTitleDraft(value);
  const setMaksudTujuan = (value: string) => setMaksudTujuanDraft(value);
  const setYoutubeUrl = (value: string) => setYoutubeUrlDraft(value);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void, setPreview: (url: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (type: 'logo' | 'background' | 'villageBackground' | 'camatPhoto') => {
    let file, setLoading: (loading: boolean) => void, setFile: (file: File | null) => void, setPreview: (url: string | null) => void, uploadPreset: string;

    if (type === 'logo') {
        file = logoFile; setLoading = setIsLogoUploading; setFile = setLogoFile; setPreview = setLogoPreview; uploadPreset = cloudinaryLogoUploadPreset;
    } else if (type === 'background') {
        file = bgFile; setLoading = setIsBgUploading; setFile = setBgFile; setPreview = setBgPreview; uploadPreset = cloudinaryBgUploadPreset;
    } else if (type === 'villageBackground') {
        file = villageBgFile; setLoading = setIsVillageBgUploading; setFile = setVillageBgFile; setPreview = setVillageBgPreview; uploadPreset = cloudinaryVillageBgUploadPreset;
    } else {
        file = camatFile; setLoading = setIsCamatUploading; setFile = setCamatFile; setPreview = setCamatPreview; uploadPreset = cloudinaryLogoUploadPreset;
    }

    if (!file || !user || !firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'File, pengguna, atau layanan Firebase tidak ditemukan.' });
      return;
    }
    
    if (!isConfigured) {
        toast({ variant: 'destructive', title: 'Konfigurasi Cloudinary Diperlukan', description: 'Silakan isi Cloud Name dan Upload Preset Anda di dalam file kode.' });
        return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || 'Gagal mengunggah ke Cloudinary.');
      }

      const data = await response.json();
      const downloadURL = data.secure_url;

      const settingsDocRef = doc(firestore, 'settings', 'global');
      const dataToUpdate: Record<string, unknown> = {
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      };

      let descriptionText = '';
      if (type === 'logo') {
        dataToUpdate.logoUrl = downloadURL;
        descriptionText = 'Logo';
      } else if (type === 'background') {
        dataToUpdate.backgroundUrl = downloadURL;
        descriptionText = 'Gambar latar belakang';
      } else if (type === 'villageBackground') {
        dataToUpdate.villageBackgroundUrl = downloadURL;
        descriptionText = 'Latar belakang desa';
      } else if (type === 'camatPhoto') {
        dataToUpdate.camatPhotoUrl = downloadURL;
        descriptionText = 'Foto Camat';
      }

      await setDoc(settingsDocRef, dataToUpdate, { merge: true });

      toast({
        title: "Upload Berhasil",
        description: `${descriptionText} telah berhasil diperbarui via Cloudinary.`,
      });

    } catch (error: unknown) {
      console.error("Proses unggah Cloudinary gagal:", error);
      const msg = error instanceof Error ? error.message : "Terjadi galat yang tidak diketahui saat mengunggah.";
      toast({
        variant: "destructive",
        title: "Upload Gagal",
        description: msg,
        duration: 9000
      });
    } finally {
      setLoading(false);
      setFile(null);
      setPreview(null);
    }
  };

  const handleCamatProfileSave = async () => {
    if (!firestore || !user) return;
    setIsCamatSaving(true);
    try {
      const settingsDocRef = doc(firestore, 'settings', 'global');
      await setDoc(settingsDocRef, {
        camatName,
        camatTitle,
        kecamatanMaksudTujuan: maksudTujuan,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      }, { merge: true });

      toast({
        title: "Sukses",
        description: "Profil Camat dan Redaksi Maksud Tujuan berhasil diperbarui.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data profil Camat.";
      toast({
        variant: "destructive",
        title: "Gagal Menyimpan",
        description: msg,
      });
    } finally {
      setIsCamatSaving(false);
    }
  };

  const handleArsipFolderIdChange = (category: string, value: string) => {
    setArsipFolderIdsDraft(prev => ({
      ...(prev ?? globalSettings?.arsipDriveFolderIds ?? {}),
      [category]: value,
    }));
  };

  const handleArsipFolderSave = async () => {
    if (!firestore || !user) return;
    setIsArsipSaving(true);
    try {
      const settingsDocRef = doc(firestore, 'settings', 'global');
      await setDoc(settingsDocRef, {
        arsipDriveFolderIds: arsipFolderIds,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      }, { merge: true });
      toast({ title: 'Sukses', description: 'ID Folder Google Drive untuk Arsip berhasil diperbarui.' });
    } catch {
      toast({ variant: 'destructive', title: 'Gagal', description: 'Gagal menyimpan ID Folder Arsip.' });
    } finally {
      setIsArsipSaving(false);
    }
  };

  const handleVideoSave = async () => {
    if (!firestore || !user) return;
    setIsVideoSaving(true);
    try {
      const settingsDocRef = doc(firestore, 'settings', 'global');
      await setDoc(settingsDocRef, {
        profileVideoUrl: youtubeUrl,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      }, { merge: true });
      toast({ title: 'Sukses', description: 'URL Video Profil berhasil diperbarui.' });
    } catch {
      toast({ variant: 'destructive', title: 'Gagal', description: 'Gagal menyimpan URL Video Profil.' });
    } finally {
      setIsVideoSaving(false);
    }
  };

  const currentLogo = logoPreview || logoUrl;
  const currentBg = bgPreview || backgroundUrl;
  const currentVillageBg = villageBgPreview || villageBackgroundUrl;
  const currentCamatPhoto = camatPreview || camatPhotoUrl;

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Pengaturan Aplikasi</h1>
        <p className="text-muted-foreground">Kelola logo, latar belakang, foto Camat, dan konfigurasi umum sistem.</p>
      </div>

      {!isConfigured && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle font-headline>Konfigurasi Cloudinary Diperlukan</AlertTitle>
          <AlertDescription>
            Fitur unggah gambar tidak akan berfungsi karena Cloud Name atau Upload Preset belum diatur di dalam kode.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        
        {/* LOGO SETTINGS */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Logo Aplikasi</CardTitle>
            <CardDescription>Unggah logo baru untuk ditampilkan di header aplikasi (via Cloudinary).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative h-40 w-full border rounded-md flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-2">
              {currentLogo ? (
                <Image src={currentLogo} alt="Logo preview" fill className="object-contain p-2" />
              ) : (
                <span className="text-xs text-muted-foreground">Tidak ada logo</span>
              )}
            </div>
            <Input 
              id="logo-upload" 
              type="file" 
              accept="image/png, image/jpeg, image/svg+xml"
              onChange={(e) => handleFileChange(e, setLogoFile, setLogoPreview)}
              disabled={isLogoUploading || !isConfigured}
              className='cursor-pointer'
            />
            <Button onClick={() => handleUpload('logo')} disabled={!logoFile || isLogoUploading || !isConfigured}>
              {isLogoUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              {isLogoUploading ? 'Mengunggah...' : 'Upload Logo'}
            </Button>
          </CardContent>
        </Card>

        {/* HERO BACKGROUND SETTINGS */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Gambar Latar Belakang Beranda</CardTitle>
            <CardDescription>Unggah gambar latar baru untuk bagian Hero di halaman utama (via Cloudinary).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative h-40 w-full border rounded-md flex items-center justify-center bg-slate-50 dark:bg-slate-900">
              {currentBg ? (
                <Image src={currentBg} alt="Background preview" fill className="rounded-md object-cover" />
              ) : (
                <span className="text-xs text-muted-foreground">Tidak ada latar belakang</span>
              )}
            </div>
            <Input 
              id="bg-upload" 
              type="file" 
              accept="image/png, image/jpeg"
              onChange={(e) => handleFileChange(e, setBgFile, setBgPreview)}
              disabled={isBgUploading || !isConfigured}
              className='cursor-pointer'
            />
            <Button onClick={() => handleUpload('background')} disabled={!bgFile || isBgUploading || !isConfigured}>
              {isBgUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              {isBgUploading ? 'Mengunggah...' : 'Upload Latar Beranda'}
            </Button>
          </CardContent>
        </Card>

        {/* ==================================================================== */}
        {/* CARD BARU: PENGATURAN PROFIL CAMAT & MAKSUD TUJUAN (CLAUDINARY) */}
        {/* ==================================================================== */}
        <Card className="lg:col-span-2 border-indigo-100 shadow-md">
          <CardHeader className="bg-indigo-50/50 border-b border-indigo-100">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-600" />
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">Profil Camat & Redaksi Maksud Tujuan</CardTitle>
                <CardDescription className="text-xs text-slate-500">Unggah foto Camat ke Cloudinary dan kelola nama, jabatan, serta redaksi maksud tujuan sistem.</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              
              {/* Foto Camat Upload Box */}
              <div className="space-y-3">
                <Label className="text-xs font-bold text-slate-700">Foto Resmi Camat (Cloudinary)</Label>
                <div className="relative h-64 w-full border-2 border-dashed border-indigo-200 rounded-2xl flex flex-col items-center justify-center bg-indigo-50/40 overflow-hidden">
                  {currentCamatPhoto ? (
                    <Image src={currentCamatPhoto} alt="Foto Camat Preview" fill className="object-cover object-top" />
                  ) : (
                    <div className="text-center p-4 text-slate-400">
                      <Upload className="w-10 h-10 mx-auto text-indigo-400 mb-2" />
                      <span className="text-xs font-medium">Pilih foto Camat</span>
                    </div>
                  )}
                </div>

                <Input 
                  id="camat-photo-upload" 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp"
                  onChange={(e) => handleFileChange(e, setCamatFile, setCamatPreview)}
                  disabled={isCamatUploading || !isConfigured}
                  className='cursor-pointer text-xs'
                />
                
                <Button 
                  onClick={() => handleUpload('camatPhoto')} 
                  disabled={!camatFile || isCamatUploading || !isConfigured}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  {isCamatUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  {isCamatUploading ? 'Mengunggah ke Cloudinary...' : 'Upload Foto Camat'}
                </Button>
              </div>

              {/* Text Fields: Nama, Jabatan, Redaksi */}
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="camat-title" className="text-xs font-bold text-slate-700">Jabatan Beliau</Label>
                    <Input
                      id="camat-title"
                      placeholder="Contoh: Camat Gandrungmangu"
                      value={camatTitle}
                      onChange={(e) => setCamatTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="camat-name" className="text-xs font-bold text-slate-700">Nama Lengkap & Gelar</Label>
                    <Input
                      id="camat-name"
                      placeholder="Contoh: Fathan Ady Chandra, S.STP., M.M."
                      value={camatName}
                      onChange={(e) => setCamatName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="maksud-tujuan" className="text-xs font-bold text-slate-700">Redaksi Maksud & Tujuan Sistem SOLID</Label>
                  <Textarea
                    id="maksud-tujuan"
                    rows={5}
                    placeholder="Tuliskan isi redaksi maksud dan tujuan sistem ini..."
                    value={maksudTujuan}
                    onChange={(e) => setMaksudTujuan(e.target.value)}
                    className="text-xs leading-relaxed"
                  />
                </div>

                <Button 
                  onClick={handleCamatProfileSave} 
                  disabled={isCamatSaving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  {isCamatSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {isCamatSaving ? 'Menyimpan...' : 'Simpan Profil & Maksud Tujuan'}
                </Button>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* VILLAGE BACKGROUND SETTINGS */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Gambar Latar Belakang Halaman Desa</CardTitle>
            <CardDescription>Unggah gambar latar baru untuk halaman spesifik desa (via Cloudinary).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative h-40 w-full border rounded-md flex items-center justify-center bg-slate-50 dark:bg-slate-900">
              {currentVillageBg ? (
                <Image src={currentVillageBg} alt="Village background preview" fill className="rounded-md object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-xs text-muted-foreground">Preview</span>
                </div>
              )}
            </div>
            <Input 
              id="village-bg-upload" 
              type="file" 
              accept="image/png, image/jpeg"
              onChange={(e) => handleFileChange(e, setVillageBgFile, setVillageBgPreview)}
              disabled={isVillageBgUploading || !isConfigured}
              className='cursor-pointer'
            />
            <Button onClick={() => handleUpload('villageBackground')} disabled={!villageBgFile || isVillageBgUploading || !isConfigured}>
              {isVillageBgUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              {isVillageBgUploading ? 'Mengunggah...' : 'Upload Latar Desa'}
            </Button>
          </CardContent>
        </Card>
        
        {/* GOOGLE DRIVE ARSIP SETTINGS */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Folder Arsip Google Drive</CardTitle>
            <CardDescription>Atur ID Folder Google Drive untuk setiap kategori arsip dokumen.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {docCategories.map(category => (
                <div key={category} className="space-y-2">
                  <Label htmlFor={`folder-${category}`}>{category}</Label>
                  <Input
                    id={`folder-${category}`}
                    placeholder="Contoh: 1a2b3c..."
                    value={arsipFolderIds[category] || ''}
                    onChange={(e) => handleArsipFolderIdChange(category, e.target.value)}
                    disabled={isArsipSaving}
                  />
                </div>
              ))}
            </div>
            <Button onClick={handleArsipFolderSave} disabled={isArsipSaving}>
              {isArsipSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isArsipSaving ? 'Menyimpan...' : 'Simpan Semua ID Folder Arsip'}
            </Button>
          </CardContent>
        </Card>

        {/* YOUTUBE PROFILE VIDEO SETTINGS */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Video Profil Kecamatan</CardTitle>
            <CardDescription>Masukkan URL Video YouTube Profil Kecamatan Gandrungmangu untuk ditampilkan di Landing Page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="youtube-url">URL Video YouTube</Label>
              <Input
                id="youtube-url"
                placeholder="Contoh: https://www.youtube.com/watch?v=dQw4w9WgXcQ atau https://youtu.be/..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                disabled={isVideoSaving}
              />
            </div>
            <Button onClick={handleVideoSave} disabled={isVideoSaving}>
              {isVideoSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isVideoSaving ? 'Menyimpan...' : 'Simpan URL Video Profil'}
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

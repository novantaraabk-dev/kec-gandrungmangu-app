'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UploadCloud, Activity, Route } from 'lucide-react';
import { RegulationForm } from './regulation-form';
import { HealthDataForm } from './health-data-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { villages } from '@/lib/villages';
import { jalanDesaData, type JalanDesa } from '@/lib/jalan-desa-data';
import { JalanDesaForm } from '@/components/jalan-desa/jalan-desa-form';
import { useToast } from '@/hooks/use-toast';


export function PublicActions() {
  const [isRegulationDialogOpen, setIsRegulationDialogOpen] = useState(false);
  const [isHealthDialogOpen, setIsHealthDialogOpen] = useState(false);
  const [isRoadProgressDialogOpen, setIsRoadProgressDialogOpen] = useState(false);

  // State for Road Progress Form
  const { toast } = useToast();
  const [selectedVillage, setSelectedVillage] = useState<string>('');
  const [selectedRoad, setSelectedRoad] = useState<string>('');
  const [availableRoads, setAvailableRoads] = useState<JalanDesa[]>([]);
  const [currentRoadData, setCurrentRoadData] = useState<JalanDesa | null>(null);

  const handleVillageChange = (village: string) => {
    setSelectedVillage(village);
    setSelectedRoad('');
    setCurrentRoadData(null);
    const villageKey = village.toLowerCase();
    setAvailableRoads(jalanDesaData[villageKey] || []);
  };

  const handleRoadChange = (roadId: string) => {
    setSelectedRoad(roadId);
    const road = availableRoads.find(r => String(r.id) === roadId);
    setCurrentRoadData(road || null);
  };
  
  const handleRoadFormSubmit = (updatedJalan: JalanDesa) => {
    // In a real app, you would send this data to your backend
    console.log('Submitting road progress:', updatedJalan);
    setIsRoadProgressDialogOpen(false);
    toast({
      title: "Laporan Terkirim",
      description: `Progres untuk ${updatedJalan.namaJalan} telah berhasil dikirim. Terima kasih atas partisipasi Anda.`,
    });
    // Reset state
    setSelectedVillage('');
    setSelectedRoad('');
    setCurrentRoadData(null);
  };
  
  const publicActionCards = [
    {
      title: 'Upload Produk Hukum',
      description: 'Bagikan Perdes, Perkades, atau SK untuk transparansi desa.',
      icon: <UploadCloud className="w-8 h-8 text-primary" />,
      action: () => setIsRegulationDialogOpen(true),
    },
    {
      title: 'Input Data Kesehatan',
      description: 'Laporkan data stunting, ibu hamil KEK, atau jumlah balita.',
      icon: <Activity className="w-8 h-8 text-primary" />,
      action: () => setIsHealthDialogOpen(true),
    },
    {
      title: 'Input Progres Jalan',
      description: 'Perbarui informasi kondisi jalan di wilayah desa Anda.',
      icon: <Route className="w-8 h-8 text-primary" />,
      action: () => setIsRoadProgressDialogOpen(true),
    },
  ];

  return (
    <>
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline text-foreground">
          Dasbor Publik SOLID
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
          Berpartisipasi secara aktif dalam transparansi dan pembangunan desa dengan melaporkan data secara mandiri.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {publicActionCards.map((card) => (
             <Card key={card.title} className="text-left flex flex-col hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-start justify-between">
                  <CardTitle>{card.title}</CardTitle>
                  {card.icon}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{card.description}</CardDescription>
              </CardContent>
              <CardFooter>
                 <Button onClick={card.action} className="w-full">
                  Mulai Input
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {/* --- DIALOGS --- */}

      <Dialog open={isRegulationDialogOpen} onOpenChange={setIsRegulationDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Upload Produk Hukum Desa</DialogTitle>
            <DialogDescription>
              Isi formulir di bawah ini untuk mengunggah dokumen hukum desa Anda.
            </DialogDescription>
          </DialogHeader>
          <RegulationForm onFinished={() => setIsRegulationDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isHealthDialogOpen} onOpenChange={setIsHealthDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Input Data Kesehatan</DialogTitle>
            <DialogDescription>
              Pilih jenis data yang ingin Anda laporkan dan isi formulirnya.
            </DialogDescription>
          </DialogHeader>
          <HealthDataForm onFinished={() => setIsHealthDialogOpen(false)}/>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isRoadProgressDialogOpen} onOpenChange={setIsRoadProgressDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Input Progres Pembangunan Jalan</DialogTitle>
            <DialogDescription>
              Pilih desa dan ruas jalan, lalu perbarui informasi progres kondisinya.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select onValueChange={handleVillageChange} value={selectedVillage}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Desa" />
                </SelectTrigger>
                <SelectContent>
                  {villages.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select onValueChange={handleRoadChange} value={selectedRoad} disabled={!selectedVillage}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Ruas Jalan" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoads.length > 0 ? (
                    availableRoads.map(r => <SelectItem key={r.id} value={String(r.id)}>{r.namaJalan}</SelectItem>)
                  ) : (
                    <SelectItem value="-" disabled>Pilih desa terlebih dahulu</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            {currentRoadData && (
              <JalanDesaForm 
                jalan={currentRoadData}
                onSubmit={handleRoadFormSubmit}
                onCancel={() => setIsRoadProgressDialogOpen(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

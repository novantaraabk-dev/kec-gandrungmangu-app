'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { villages } from '@/lib/villages';
import { Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function capitalizeFirstLetter(string: string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getDayAndFullDate(dateStr: string): { day: string, fullDate: string } {
    if (!dateStr) return { day: '[HARI]', fullDate: '[TANGGAL]' };
    const date = new Date(`${dateStr}T12:00:00`); 
    const day = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(date);
    const fullDate = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    return { day, fullDate };
}


export default function BeritaAcaraClientPage() {
  const { toast } = useToast();
  const [selectedVillage, setSelectedVillage] = useState('');
  const [monevDate, setMonevDate] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedYear2, setSelectedYear2] = useState((new Date().getFullYear() - 1).toString());
  const [kadesName, setKadesName] = useState('');

  const [documentType, setDocumentType] = useState('apbdes');
  const [teamCount, setTeamCount] = useState(5);
  const [monitoringTeam, setMonitoringTeam] = useState<{ name: string; jabatan: string }[]>([
    { name: 'Muhammad Rodlin, S.Ag., M.M.', jabatan: 'Camat Gandrungmangu' },
    { name: 'Novantara ABK', jabatan: 'Kasi PM' },
    { name: 'Heri Sunarko', jabatan: 'Kasi Tapem' },
    { name: 'Aan Nurur Rahman, S.T.', jabatan: 'PD' },
    { name: 'Deni Kusmiyati', jabatan: 'PLD' },
  ]);
  
  const [activityPhotos, setActivityPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  useEffect(() => {
    const newTeam = [...monitoringTeam];
    if (teamCount > newTeam.length) {
      for (let i = newTeam.length; i < teamCount; i++) {
        newTeam.push({ name: '', jabatan: '' });
      }
    } else {
      newTeam.length = teamCount;
    }
    setMonitoringTeam(newTeam);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamCount]);
  
  useEffect(() => {
    // Cleanup function to revoke Object URLs on component unmount
    return () => {
      photoPreviews.forEach(URL.revokeObjectURL);
    };
  }, [photoPreviews]);

  const handleTeamChange = (index: number, field: 'name' | 'jabatan', value: string) => {
    const newTeam = [...monitoringTeam];
    newTeam[index] = { ...newTeam[index], [field]: value };
    setMonitoringTeam(newTeam);
  };
  
  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    photoPreviews.forEach(URL.revokeObjectURL);

    if (e.target.files) {
        const files = Array.from(e.target.files);
        setActivityPhotos(files);

        if (files.length > 0) {
            const previews = files.map(file => URL.createObjectURL(file));
            setPhotoPreviews(previews);
        } else {
            setPhotoPreviews([]);
        }
    }
  };

  const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const handlePrint = async () => {
    if (!selectedVillage || !monevDate || !selectedYear) {
      toast({
        variant: 'destructive',
        title: 'Data Tidak Lengkap',
        description: 'Silakan pilih jenis dokumen, desa, tanggal monev, dan tahun anggaran.',
      });
      return;
    }

    const { day, fullDate } = getDayAndFullDate(monevDate);
    const dateForSignature = new Date(`${monevDate}T12:00:00`).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    
    // Dynamic content based on document type
    const isApbdes = documentType === 'apbdes';
    const docTitle = isApbdes ? 'BERITA ACARA' : 'BERITA ACARA MONITORING FISIK';
    const docSubtitle = isApbdes 
      ? `MONITORING LAPORAN APBDes ${selectedYear2}` 
      : `EVALUASI FISIK KEGIATAN TAHUN ${selectedYear}`;
    
    const mainParagraph = isApbdes
        ? `<p>Dalam rangka pelaksanaan implementasi Undang Undang Desa no 6 tahun 2014 di Desa ${capitalizeFirstLetter(selectedVillage)} Kecamatan Gandrungmangu, Pada hari ini ${day} tanggal ${fullDate} telah dilakukan monitoring dan evaluasi kegiatan pembangunan desa tahun anggaran ${selectedYear2} dan ${selectedYear} oleh Tim Fasilitasi Kecamatan Gandrungmangu yang dihadiri Pemerintah desa dan Perwakilan BPD sesuai terlampir daftar hadir.</p>`
        : `<p>Berdasarkan hasil monitoring dan evaluasi fisik kegiatan yang dilaksanakan oleh Tim Monitoring Kecamatan Gandrungmangu di Desa ${capitalizeFirstLetter(selectedVillage)} pada hari ini ${day} tanggal ${fullDate} terhadap pelaksanaan kegiatan pembangunan desa yang didanai dari berbagai sumber pendanaan Tahun Anggaran ${selectedYear}, dengan ini kami sampaikan hasil monitoring dan evaluasi sebagai berikut:</p>`;
        
    const recommendationTitle = isApbdes ? 'Rekomendasi Tim Monitoring Kecamatan:' : 'Rekomendasi dan Catatan Lapangan:';
    const recommendationContent = isApbdes 
        ? 'Kekurangan berkas SPJ dan program kegiatan yang belum terlaksana untuk segera ditindaklanjuti maksimal hingga akhir bulan tahun ${selectedYear}.'
        : 'Agar Saudara Kepala Desa segera menindaklanjuti hasil monitoring dan evaluasi fisik di lapangan dan segera menyelesaikan administrasi pertanggungjawaban kegiatan.';

    const signersList = monitoringTeam
      .filter(member => member.name && member.jabatan)
      .map((member, index) => `
        <tr>
            <td style="padding: 2px 0; vertical-align: top;">${index + 1}.</td>
            <td style="padding: 2px 5px; vertical-align: top;">${member.name}</td>
            <td style="padding: 2px 5px; vertical-align: top;">(${member.jabatan})</td>
            <td style="padding: 2px 5px; width: 40%; vertical-align: top;">: ....................</td>
        </tr>
    `).join('');

    let photoHtml = '';
    if (documentType === 'fisik' && activityPhotos.length > 0) {
        const photoPromises = activityPhotos.map(async (file, index) => {
            const base64 = await toBase64(file);
            return `
                <div style="margin-bottom: 20px; text-align: center; page-break-inside: avoid;">
                    <p style="text-align: left; font-weight: bold; margin-bottom: 10px; text-indent: 0;">Gambar ${index + 1}:</p>
                    <img src="${base64}" style="max-width: 80%; border: 1px solid #ccc; display: inline-block;" />
                </div>
            `;
        });
        const photoElements = await Promise.all(photoPromises);
        photoHtml = `
            <div style="margin-top: 40px; page-break-before: always;">
                <div class="header" style="text-decoration: underline; margin-bottom: 24px;">LAMPIRAN FOTO KEGIATAN</div>
                ${photoElements.join('')}
            </div>
        `;
    }
    
    const kadesSignatureHtml = kadesName 
        ? `<div class="name">${kadesName}</div>`
        : `<div class="name">( .............................. )</div>`;


    const printContent = `
        <html>
        <head>
            <title>${docTitle} ${selectedVillage} ${selectedYear}</title>
            <style>
                body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; margin: 2cm; }
                .header, .sub-header { text-align: center; font-weight: bold; }
                .header { font-size: 14pt; text-decoration: underline; margin-bottom: 4px; }
                .sub-header { font-size: 12pt; margin-bottom: 24px;}
                p { text-align: justify; text-indent: 4em; margin-top: 1em; margin-bottom: 1em; }
                .content-list { padding-left: 6em; margin: 0; }
                .section-title { font-weight: bold; text-decoration: underline; padding-left: 2em;}
                .signature-section { margin-top: 40px; width: 100%; page-break-inside: avoid; }
                .signature-section table { width: 100%; border-collapse: collapse; }
                .signature-section td { vertical-align: top; padding: 5px; }
                .signature-block { text-align: center; }
                .signature-block .title { font-weight: bold; }
                .signature-block .name { margin-top: 80px; font-weight: bold; text-decoration: underline; }
                .signer-list table { width: 100%; text-align: left; }
            </style>
        </head>
        <body>
            <div class="header">${docTitle}</div>
            <div class="sub-header">${docSubtitle}</div>
            
            ${mainParagraph}
            
            <p style="text-indent: 0;">Adapun kegiatan monitoring meliputi:</p>
            <ol class="content-list">
                <li>Dokumen Pelaksanaan</li>
                <li>Administrasi Keuangan Desa</li>
                <li>Monitoring pelaksanaan kegiatan di lapangan</li>
            </ol>
            
            <div class="section-title">Hasil Monitoring kegiatan:</div>
            <p style="padding-left: 2em; text-indent: 0;">Hasil Monitoring Terlampir</p>

            <div class="section-title">${recommendationTitle}</div>
            <p style="padding-left: 2em; text-indent: 0;">${recommendationContent}</p>
            
            <div class="section-title">Tanggapan dari pihak desa:</div>
            <p style="padding-left: 2em; text-indent: 0;">
                Desa ${capitalizeFirstLetter(selectedVillage)} menerima hasil monitoring dan evaluasi dari pihak Tim Kecamatan Gandrungmangu, dan akan segera memenuhi dan menindaklanjuti kekurangan berkas SPJ dan program kegiatan yang belum terlaksana.
            </p>

            <p>
                Demikian Berita Acara ini dibuat agar dipergunakan sebagaimana mestinya dan menjadi acuan bagi Desa ${capitalizeFirstLetter(selectedVillage)} untuk terus meningkatkan kinerja kegiatan.
            </p>

            <div class="signature-section">
                <table>
                    <tr>
                        <td style="width: 50%;">
                            <div class="signature-block">
                                <div class="title">Yang Dikunjungi,</div>
                                <div class="title">Kepala Desa</div>
                                ${kadesSignatureHtml}
                            </div>
                        </td>
                        <td style="width: 50%;">
                             <div style="text-align: left; margin-bottom: 10px;">Gandrungmangu, ${dateForSignature}</div>
                             <div class="signer-list">
                                <div style="text-align: left; font-weight: bold; margin-bottom: 10px;">Tim Monitoring Kecamatan</div>
                                <table><tbody>${signersList}</tbody></table>
                             </div>
                        </td>
                    </tr>
                </table>
            </div>
            ${photoHtml}
        </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
            printWindow.onafterprint = () => printWindow.close();
        }, 500);
    } else {
        toast({ variant: 'destructive', title: 'Gagal Membuka Jendela Cetak' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Cetak Berita Acara Monev</h1>
        <p className="text-muted-foreground">Pilih jenis dokumen, desa, dan tanggal untuk membuat Berita Acara.</p>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Parameter Dokumen</CardTitle>
          <CardDescription>Isi detail di bawah ini untuk mencetak dokumen.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Jenis Berita Acara</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger><SelectValue placeholder="Pilih Jenis Dokumen..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="apbdes">Berita Acara Monev APBDes</SelectItem>
                <SelectItem value="fisik">Berita Acara Monev Fisik</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Desa</Label>
            <Select value={selectedVillage} onValueChange={setSelectedVillage}>
              <SelectTrigger><SelectValue placeholder="Pilih Desa..." /></SelectTrigger>
              <SelectContent>{villages.map(v => <SelectItem key={v} value={v.toLowerCase()}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tanggal Monev</Label>
            <Input type="date" value={monevDate} onChange={e => setMonevDate(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Tahun Anggaran 1</Label>
                <Select value={selectedYear2} onValueChange={setSelectedYear2}>
                    <SelectTrigger><SelectValue placeholder="Tahun..." /></SelectTrigger>
                    <SelectContent>{[new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2].map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Tahun Anggaran 2</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger><SelectValue placeholder="Tahun..." /></SelectTrigger>
                    <SelectContent>{[new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2].map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
                </Select>
            </div>
          </div>
          
          {documentType === 'fisik' && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-medium text-lg">Lampiran Foto Kegiatan</h3>
              <div className="space-y-2">
                  <Label htmlFor="photos">Upload Foto (bisa lebih dari satu)</Label>
                  <Input 
                      id="photos" 
                      type="file" 
                      multiple
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="cursor-pointer"
                  />
              </div>
              {photoPreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {photoPreviews.map((preview, index) => (
                          <div key={index} className="relative aspect-square">
                              <Image src={preview} alt={`Preview ${index + 1}`} layout="fill" className="rounded-md object-cover" />
                          </div>
                      ))}
                  </div>
              )}
            </div>
          )}

          <div className="space-y-4 pt-4 border-t">
             <h3 className="font-medium text-lg">Penanda Tangan</h3>
            <div className="space-y-2">
                <Label htmlFor="kadesName">Nama Kepala Desa</Label>
                <Input 
                    id="kadesName"
                    placeholder="Nama Lengkap Kepala Desa" 
                    value={kadesName} 
                    onChange={e => setKadesName(e.target.value)}
                />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium text-lg">Tim Monitoring Kecamatan</h3>
            <div className="space-y-2">
                <Label htmlFor="teamCount">Jumlah Tim</Label>
                <Input 
                    id="teamCount" 
                    type="number" 
                    value={teamCount} 
                    onChange={e => setTeamCount(Math.max(0, parseInt(e.target.value) || 0))}
                    min="0"
                />
            </div>
            <div className="max-h-48 overflow-y-auto space-y-3 pr-2">
              {monitoringTeam.map((member, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      <Input 
                          placeholder={`Nama Tim ${index + 1}`} 
                          value={member.name} 
                          onChange={e => handleTeamChange(index, 'name', e.target.value)} 
                      />
                      <Input 
                          placeholder={`Jabatan Tim ${index + 1}`} 
                          value={member.jabatan} 
                          onChange={e => handleTeamChange(index, 'jabatan', e.target.value)} 
                      />
                  </div>
              ))}
            </div>
          </div>

          <Button onClick={handlePrint} className="w-full mt-4">
            <Printer className="mr-2 h-4 w-4" />
            Cetak Berita Acara
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

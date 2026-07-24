export const regulationTemplates = {
  Perdes: [
    { name: "Perdes APBDes", about: "Tentang Anggaran Pendapatan dan Belanja Desa" },
    { name: "Perdes RPJMDes", about: "Tentang Rencana Pembangunan Jangka Menengah Desa (6 tahun)" },
    { name: "Perdes RKPDes", about: "Tentang Rencana Kerja Pemerintah Desa (tahunan)" },
    { name: "Perdes Pungutan Desa", about: "Tentang Pungutan Desa" },
    { name: "Perdes Pembentukan BUMDes", about: "Tentang Pembentukan Badan Usaha Milik Desa" },
    { name: "Perdes Penetapan Aset Desa", about: "Tentang Penetapan Aset Desa" },
    { name: "Perdes Tata Ruang / Batas Desa", about: "Tentang Tata Ruang / Batas Desa" },
    { name: "Perdes Kewenangan Desa", about: "Tentang Kewenangan Desa" },
    { name: "Perdes Lembaga Kemasyarakatan Desa", about: "Tentang Lembaga Kemasyarakatan Desa (LPM, Karang Taruna, PKK, dll)" },
  ],
  Perkades: [
    { name: "Perkades Penjabaran APBDes", about: "Tentang Penjabaran APBDes" },
    { name: "Perkades Standar Operasional Prosedur (SOP)", about: "Tentang Standar Operasional Prosedur (SOP)" },
    { name: "Perkades Tata Naskah Dinas", about: "Tentang Tata Naskah Dinas" },
    { name: "Perkades Pengelolaan Keuangan Desa", about: "Tentang Pengelolaan Keuangan Desa" },
    { name: "Perkades Pengangkatan Perangkat Desa", about: "Tentang Pengangkatan Perangkat Desa" },
    { name: "Perkades Pembentukan Tim / Panitia", about: "Tentang Pembentukan Tim / Panitia" },
    { name: "Perkades Pengelolaan Aset", about: "Tentang Pengelolaan Aset" },
    { name: "Perkades Pembagian Tugas Perangkat Desa", about: "Tentang Pembagian Tugas Perangkat Desa" },
  ],
  SK: [
    { name: "SK Pengangkatan Perangkat Desa", about: "Tentang Pengangkatan Perangkat Desa" },
    { name: "SK Pengangkatan Kader (Posyandu, KPM, dll)", about: "Tentang Pengangkatan Kader (Posyandu, KPM, dll)" },
    { name: "SK Penetapan KPM BLT Dana Desa", about: "Tentang Penetapan KPM BLT Dana Desa" },
    { name: "SK Tim Pelaksana Kegiatan (TPK)", about: "Tentang Tim Pelaksana Kegiatan (TPK)" },
    { name: "SK PPKD", about: "Tentang Pejabat Pengelola Keuangan Desa" },
    { name: "SK Operator Desa", about: "Tentang Operator Desa" },
    { name: "SK Panitia Pilkades", about: "Tentang Panitia Pilkades" },
    { name: "SK Penetapan APBDes (Lampiran teknis)", about: "Tentang Penetapan APBDes (Lampiran teknis)" },
  ],
};

export type RegulationType = keyof typeof regulationTemplates;

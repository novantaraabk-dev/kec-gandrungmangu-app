




export type Perangkat = {
  id: string;
  name: string;
  title: string;
  village?: string;
  birthPlace?: string;
  birthDate?: string;
  gender?: 'L' | 'P' | string;
  age?: string;
  education?: string;
  religion?: string;
  skNumber?: string;
  skDate?: string;
  inaugurationDate?: string;
  workPeriod?: string;
  retirementDate?: string;
  remainingWorkPeriod?: string;
  createdAt?: any;
  createdBy?: string;
  updatedAt?: any;
  updatedBy?: string;
};

export type PerangkatData = {
  [key: string]: Omit<Perangkat, 'id' | 'village'>[];
};

export const perangkatData: PerangkatData = {};

export type BpdMember = {
    id: string;
    village?: string;
    name: string;
    bpdStatus: string;
    status: string;
    birthPlace?: string;
    birthDate?: string;
    education?: string;
    religion?: string;
    occupation?: string;
    skNumber?: string;
    tenurePeriod?: string;
    skDate?: string;
    period?: string;
    createdAt?: any;
    createdBy?: string;
    updatedAt?: any;
    updatedBy?: string;
};
  
export type BpdData = {
    [key: string]: Omit<BpdMember, 'id' | 'village'>[];
};

export const bpdData: BpdData = {};

export interface RtRwMember {
  id: string;
  village?: string;
  dusun: string;
  rw: string;
  rt: string;
  position: string;
  name: string;
  createdAt?: any;
  createdBy?: string;
  updatedAt?: any;
  updatedBy?: string;
}

export type RtRwData = {
  [key: string]: Omit<RtRwMember, 'id' | 'village'>[];
};

export const rtRwData: RtRwData = {};

export interface P3keIntervention {
  id: string;
  village: string;
  jenisIntervensi: string;
  jumlahPenerima: string;
  totalAnggaran: string;
  sumberAnggaran: string;
  createdAt: any; 
  createdBy: string;
  updatedAt?: any;
  updatedBy?: string;
}

export interface SpjDocument {
  id: string;
  village: string;
  year: number;
  month: string;
  field: string;
  activity: string;
  sourceOfFunds: string;
  fileUrl: string;
  createdAt: any;
  createdBy: string;
}

export interface RegulationDocument {
  id: string;
  village: string;
  type: string;
  about: string;
  number: string;
  date: string;
  fileUrl: string;
  createdAt: any;
  createdBy: string;
}

export interface ApbdesEntry {
  Bidang: string;
  'Kode Kegiatan': string;
  Kode: string;
  'Nama Kegiatan': string;
  Anggaran: string | number;
  'Sumber Dana': string;
}

export interface ApbdesDetail {
    id: string;
    apbdesId: string;
    village: string;
    year: number;
    description: string;
    amount: number;
    category: string;
    code: string;
    activityCode: string;
    fundingSource: string;
    createdAt: any;
    createdBy: string;
}

export interface Apbdes {
  id: string;
  year: number;
  village: string;
  revenue: number;
  revenueSources: Record<string, number>;
  expenditure: number;
  financing: number;
  createdAt: any;
  createdBy: string;
  updatedAt?: any;
  updatedBy?: string;
}

export interface Stunting {
  id: string;
  village: string;
  namaAnak: string;
  usiaBulan: number;
  tinggiBadanCm: number;
  tanggalPengukuran: string;
  createdAt: any;
  createdBy: string;
  updatedAt?: any;
  updatedBy?: string;
}

export interface BumilKek {
  id: string;
  village: string;
  namaIbu: string;
  usiaKehamilanMinggu: number;
  lingkarLenganAtasCm: number;
  tanggalPemeriksaan: string;
  createdAt: any;
  createdBy: string;
  updatedAt?: any;
  updatedBy?: string;
}

export interface JumlahBalita {
  id: string;
  village: string;
  tahun: number;
  bulan: string;
  jumlahLakiLaki: number;
  jumlahPerempuan: number;
  createdAt: any;
  createdBy: string;
  updatedAt?: any;
  updatedBy?: string;
}

export interface PrioritasDanaDesa {
  id: string;
  village: string;
  year: number;
  statusDesa?: string;
  paguDanaDesa?: number;
  jumlahKpm?: number;
  totalBulanBlt?: number;
  totalAnggaranBlt?: number;
  totalAnggaranIklim?: number;
  totalAnggaranKesehatan?: number;
  totalAnggaranPangan?: number;
  totalAnggaranInfrastruktur?: number;
  totalAnggaranDigital?: number;
  jumlahPaguPrioritas?: number;
  jumlahPaguNonPrioritas?: number;
  createdAt: any;
  createdBy: string;
  updatedAt?: any;
  updatedBy?: string;
}

export interface Monev {
  id: string;
  village: string;
  apbdesDetailId: string;
  year: number;
  tahap?: 'Tahap I' | 'Tahap II' | 'Tahap III' | string;
  activity: string;
  apbdesCode: string;
  fundingSource: string;
  budget: number;
  realization: number;
  status: 'SPJ Lengkap' | 'SPJ Belum Lengkap' | string;
  notes?: string;
  volume: {
    value: string;
    unit: string;
  };
  tanggalRealisasi?: string;
  fotoUrl?: string;
  createdAt: any;
  createdBy: string;
  updatedAt?: any;
  updatedBy?: string;
}

export interface ArsipDokumen {
  id: string;
  category: string;
  type: string;
  customType?: string;
  title: string;
  fileUrl: string;
  createdAt: any;
  createdBy: string;
}

export interface JalanKabupaten {
  id: string;
  village: string;
  noRuas: string;
  namaRuas: string;
  pangkalRuas?: string;
  ujungRuas?: string;
  panjangRuas?: number;
  lebarRuas?: number;
  kondisiBaik?: number;
  kondisiSedang?: number;
  kondisiRusakRingan?: number;
  kondisiRusakBerat?: number;
  usulanMusren?: string;
  usulanDesa?: string;
  paguUsulan?: number;
  panjangUsulan?: number;
  createdAt: any;
  createdBy: string;
  updatedAt?: any;
  updatedBy?: string;
}

// Data Umum Types
export interface Masjid {
    id: string;
    village: string;
    name: string;
    address: string;
    createdAt: any;
    createdBy: string;
    updatedAt?: any;
    updatedBy?: string;
}

export interface Mushola {
    id: string;
    village: string;
    name: string;
    address: string;
    createdAt: any;
    createdBy: string;
    updatedAt?: any;
    updatedBy?: string;
}

export interface PasarDesa {
    id: string;
    village: string;
    name: string;
    perdesNumber: string;
    createdAt: any;
    createdBy: string;
    updatedAt?: any;
    updatedBy?: string;
}

export interface Bumdes {
    id: string;
    village: string;
    name: string;
    establishmentAct: string;
    ahuNumber: string;
    directorName: string;
    businessType: string;
    createdAt: any;
    createdBy: string;
    updatedAt?: any;
    updatedBy?: string;
}

export interface Mbg {
    id: string;
    village: string;
    name: string;
    address: string;
    createdAt: any;
    createdBy: string;
    updatedAt?: any;
    updatedBy?: string;
}

export interface Kependudukan {
  id: string;
  village: string;
  year: number;
  penduduk_l: number;
  penduduk_p: number;
  kk_l: number;
  kk_p: number;
  createdAt: any;
  createdBy: string;
  updatedAt?: any;
  updatedBy?: string;
}

export interface PbbP2 {
  id: string;
  village: string;
  year: number;
  pagu: number;
  totalSppt: number;
  terbayar: number;
  imageUrl?: string;
  createdAt: any;
  createdBy: string;
  updatedAt?: any;
  updatedBy?: string;
}

export interface PbbP2Payment {
  id: string;
  pbbP2Id: string;
  amount: number;
  paymentDate: string;
  createdAt: any;
  createdBy: string;
}

export interface PosyanduKader {
  id: string;
  village: string;
  posyanduName: string;
  kaderName: string;
  createdAt: any;
  createdBy: string;
  updatedAt?: any;
  updatedBy?: string;
}

export interface LinmasMember {
  id: string;
  village: string;
  name: string;
  jabatan: 'Danton' | 'Anggota' | string;
  createdAt: any;
  createdBy: string;
  updatedAt?: any;
  updatedBy?: string;
}

export interface SkLinmas {
  id: string;
  village: string;
  fileUrl: string;
  createdAt: any;
  createdBy: string;
}

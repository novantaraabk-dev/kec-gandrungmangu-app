export interface RumahIbadah {
  id?: string;
  no?: number;
  village: string;
  masjid: number;
  mushola: number;
  gerejaProtestan: number;
  gerejaKatolik: number;
  wihara: number;
  pura: number;
  sanggar: number;
  lainnya: number;
  total?: number;
}

export const defaultRumahIbadahData: RumahIbadah[] = [
  { no: 1, village: 'BULUSARI', masjid: 14, mushola: 32, gerejaProtestan: 1, gerejaKatolik: 0, wihara: 0, pura: 0, sanggar: 0, lainnya: 0 },
  { no: 2, village: 'CINANGSI', masjid: 16, mushola: 38, gerejaProtestan: 1, gerejaKatolik: 1, wihara: 0, pura: 0, sanggar: 0, lainnya: 0 },
  { no: 3, village: 'CISUMUR', masjid: 22, mushola: 45, gerejaProtestan: 2, gerejaKatolik: 1, wihara: 0, pura: 0, sanggar: 0, lainnya: 0 },
  { no: 4, village: 'GANDRUNGMANGU', masjid: 28, mushola: 56, gerejaProtestan: 4, gerejaKatolik: 2, wihara: 1, pura: 0, sanggar: 0, lainnya: 0 },
  { no: 5, village: 'GANDRUNGMANIS', masjid: 15, mushola: 30, gerejaProtestan: 1, gerejaKatolik: 0, wihara: 0, pura: 0, sanggar: 0, lainnya: 0 },
  { no: 6, village: 'GINTUNGREJA', masjid: 12, mushola: 26, gerejaProtestan: 0, gerejaKatolik: 0, wihara: 0, pura: 0, sanggar: 0, lainnya: 0 },
  { no: 7, village: 'KARANGANYAR', masjid: 13, mushola: 28, gerejaProtestan: 1, gerejaKatolik: 0, wihara: 0, pura: 0, sanggar: 0, lainnya: 0 },
  { no: 8, village: 'KARANGGINTUNG', masjid: 20, mushola: 42, gerejaProtestan: 1, gerejaKatolik: 1, wihara: 0, pura: 0, sanggar: 0, lainnya: 0 },
  { no: 9, village: 'KERTAJAYA', masjid: 14, mushola: 31, gerejaProtestan: 1, gerejaKatolik: 0, wihara: 0, pura: 0, sanggar: 0, lainnya: 0 },
  { no: 10, village: 'LAYANSARI', masjid: 19, mushola: 44, gerejaProtestan: 2, gerejaKatolik: 1, wihara: 0, pura: 0, sanggar: 0, lainnya: 0 },
  { no: 11, village: 'MUKTISARI', masjid: 18, mushola: 39, gerejaProtestan: 1, gerejaKatolik: 1, wihara: 0, pura: 0, sanggar: 0, lainnya: 0 },
  { no: 12, village: 'RUNGKANG', masjid: 8, mushola: 18, gerejaProtestan: 0, gerejaKatolik: 0, wihara: 0, pura: 0, sanggar: 0, lainnya: 0 },
  { no: 13, village: 'SIDAURIP', masjid: 15, mushola: 33, gerejaProtestan: 1, gerejaKatolik: 0, wihara: 0, pura: 0, sanggar: 0, lainnya: 0 },
  { no: 14, village: 'WRINGINHARJO', masjid: 16, mushola: 35, gerejaProtestan: 1, gerejaKatolik: 1, wihara: 0, pura: 0, sanggar: 0, lainnya: 0 },
];

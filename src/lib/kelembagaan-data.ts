export interface DesaKelembagaan {
  no: number;
  desa: string;
  perangkat: {
    kades: number;
    sekdes: number;
    kasi: number;
    kaur: number;
    staf: number;
    kadus: number;
    total: number;
  };
  rtRwBpd: {
    rt: number;
    rw: number;
    bpd: number;
    total: number;
  };
}

export const kelembagaanDesaData: DesaKelembagaan[] = [
  { no: 1, desa: 'Gandrungmangu', perangkat: { kades: 1, sekdes: 1, kasi: 3, kaur: 2, staf: 7, kadus: 7, total: 21 }, rtRwBpd: { rt: 43, rw: 7, bpd: 7, total: 107 } },
  { no: 2, desa: 'Gandrungmanis', perangkat: { kades: 1, sekdes: 1, kasi: 3, kaur: 2, staf: 2, kadus: 5, total: 14 }, rtRwBpd: { rt: 45, rw: 12, bpd: 7, total: 121 } },
  { no: 3, desa: 'Cisumur', perangkat: { kades: 1, sekdes: 1, kasi: 3, kaur: 2, staf: 5, kadus: 6, total: 18 }, rtRwBpd: { rt: 56, rw: 8, bpd: 7, total: 135 } },
  { no: 4, desa: 'Karanganyar', perangkat: { kades: 1, sekdes: 1, kasi: 3, kaur: 2, staf: 10, kadus: 2, total: 19 }, rtRwBpd: { rt: 41, rw: 4, bpd: 7, total: 97 } },
  { no: 5, desa: 'Cinangsi', perangkat: { kades: 1, sekdes: 1, kasi: 3, kaur: 2, staf: 4, kadus: 4, total: 15 }, rtRwBpd: { rt: 43, rw: 7, bpd: 7, total: 107 } },
  { no: 6, desa: 'Karanggintung', perangkat: { kades: 1, sekdes: 1, kasi: 3, kaur: 2, staf: 6, kadus: 5, total: 18 }, rtRwBpd: { rt: 51, rw: 6, bpd: 7, total: 121 } },
  { no: 7, desa: 'Rungkang', perangkat: { kades: 1, sekdes: 1, kasi: 3, kaur: 2, staf: 5, kadus: 2, total: 14 }, rtRwBpd: { rt: 20, rw: 3, bpd: 5, total: 51 } },
  { no: 8, desa: 'Sidaurip', perangkat: { kades: 1, sekdes: 1, kasi: 3, kaur: 2, staf: 3, kadus: 4, total: 14 }, rtRwBpd: { rt: 45, rw: 8, bpd: 7, total: 113 } },
  { no: 9, desa: 'Gintungreja', perangkat: { kades: 1, sekdes: 1, kasi: 3, kaur: 2, staf: 6, kadus: 4, total: 17 }, rtRwBpd: { rt: 43, rw: 5, bpd: 7, total: 103 } },
  { no: 10, desa: 'Layansari', perangkat: { kades: 1, sekdes: 1, kasi: 3, kaur: 2, staf: 5, kadus: 4, total: 16 }, rtRwBpd: { rt: 56, rw: 8, bpd: 7, total: 135 } },
  { no: 11, desa: 'Bulusari', perangkat: { kades: 1, sekdes: 1, kasi: 3, kaur: 2, staf: 6, kadus: 3, total: 16 }, rtRwBpd: { rt: 38, rw: 6, bpd: 7, total: 95 } },
  { no: 12, desa: 'Muktisari', perangkat: { kades: 1, sekdes: 1, kasi: 3, kaur: 2, staf: 7, kadus: 5, total: 19 }, rtRwBpd: { rt: 31, rw: 5, bpd: 7, total: 79 } },
  { no: 13, desa: 'Wringinharjo', perangkat: { kades: 1, sekdes: 1, kasi: 3, kaur: 2, staf: 8, kadus: 3, total: 18 }, rtRwBpd: { rt: 35, rw: 4, bpd: 7, total: 85 } },
  { no: 14, desa: 'Kertajaya', perangkat: { kades: 1, sekdes: 1, kasi: 3, kaur: 2, staf: 6, kadus: 5, total: 18 }, rtRwBpd: { rt: 37, rw: 5, bpd: 7, total: 91 } },
];

export const totalKelembagaan = {
  perangkat: {
    kades: 14,
    sekdes: 14,
    kasi: 42,
    kaur: 28,
    staf: 88,
    kadus: 59,
    total: 245
  },
  rtRwBpd: {
    rt: 584,
    rw: 88,
    rtRwTotal: 672,
    bpd: 96,
    total: 768
  }
};

export interface KependudukanData {
  no: number;
  desa: string;
  penduduk: {
    l: number;
    p: number;
    total: number;
  };
  kk: {
    l: number;
    p: number;
    total: number;
  };
}

export const dataKependudukan: KependudukanData[] = [
  { no: 1, desa: 'GANDRUNGMANGU', penduduk: { l: 5966, p: 5766, total: 11732 }, kk: { l: 2918, p: 663, total: 3581 } },
  { no: 2, desa: 'GANDRUNGMANIS', penduduk: { l: 3792, p: 3987, total: 7779 }, kk: { l: 2697, p: 584, total: 3281 } },
  { no: 3, desa: 'CISUMUR', penduduk: { l: 6426, p: 6163, total: 12589 }, kk: { l: 2951, p: 256, total: 3207 } },
  { no: 4, desa: 'KARANGANYAR', penduduk: { l: 4132, p: 4431, total: 8563 }, kk: { l: 2220, p: 303, total: 2523 } },
  { no: 5, desa: 'CINANGSI', penduduk: { l: 4126, p: 4017, total: 8143 }, kk: { l: 2136, p: 443, total: 2579 } },
  { no: 6, desa: 'KARANGGINTUNG', penduduk: { l: 5540, p: 5301, total: 10841 }, kk: { l: 3070, p: 469, total: 3539 } },
  { no: 7, desa: 'RUNGKANG', penduduk: { l: 1756, p: 1731, total: 3487 }, kk: { l: 1047, p: 158, total: 1205 } },
  { no: 8, desa: 'SIDAURIP', penduduk: { l: 4498, p: 4459, total: 8957 }, kk: { l: 2222, p: 494, total: 2716 } },
  { no: 9, desa: 'GINTUNGREJA', penduduk: { l: 4020, p: 3638, total: 7658 }, kk: { l: 2008, p: 417, total: 2425 } },
  { no: 10, desa: 'BULUSARI', penduduk: { l: 4720, p: 4496, total: 9216 }, kk: { l: 2361, p: 532, total: 2893 } },
  { no: 11, desa: 'LAYANSARI', penduduk: { l: 6503, p: 6166, total: 12669 }, kk: { l: 3113, p: 590, total: 3703 } },
  { no: 12, desa: 'MUKTISARI', penduduk: { l: 4027, p: 3875, total: 7902 }, kk: { l: 1908, p: 310, total: 2218 } },
  { no: 13, desa: 'WRINGINHARJO', penduduk: { l: 4677, p: 4373, total: 9050 }, kk: { l: 2033, p: 466, total: 2499 } },
  { no: 14, desa: 'KERTAJAYA', penduduk: { l: 3824, p: 3578, total: 7402 }, kk: { l: 2023, p: 333, total: 2356 } },
];

export const totalKependudukan: KependudukanData = {
  no: 0,
  desa: 'JUMLAH',
  penduduk: { l: 64007, p: 61981, total: 125988 },
  kk: { l: 32707, p: 6018, total: 38725 },
};
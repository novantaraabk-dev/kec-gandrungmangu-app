export interface DesaGeografi {
  no: number;
  desa: string;
  luasKm2: number;
  persentaseLuas: number; // %
  jarakKeKecKm: number; // km
  jarakKeKabKm: number; // km
}

export const geografiDesaData: DesaGeografi[] = [
  { no: 1, desa: 'Cisumur', luasKm2: 10.69, persentaseLuas: 8.96, jarakKeKecKm: 6, jarakKeKabKm: 52 },
  { no: 2, desa: 'Sidaurip', luasKm2: 17.04, persentaseLuas: 14.29, jarakKeKecKm: 5, jarakKeKabKm: 50 },
  { no: 3, desa: 'Gintungreja', luasKm2: 6.10, persentaseLuas: 5.12, jarakKeKecKm: 8, jarakKeKabKm: 55 },
  { no: 4, desa: 'Layansari', luasKm2: 7.55, persentaseLuas: 6.34, jarakKeKecKm: 5, jarakKeKabKm: 46 },
  { no: 5, desa: 'Gandrungmanis', luasKm2: 4.62, persentaseLuas: 3.87, jarakKeKecKm: 1, jarakKeKabKm: 45 },
  { no: 6, desa: 'Bulusari', luasKm2: 5.09, persentaseLuas: 4.27, jarakKeKecKm: 2, jarakKeKabKm: 45 },
  { no: 7, desa: 'Gandrungmangu', luasKm2: 4.57, persentaseLuas: 3.83, jarakKeKecKm: 1, jarakKeKabKm: 45 },
  { no: 8, desa: 'Wringinharjo', luasKm2: 6.43, persentaseLuas: 5.39, jarakKeKecKm: 7, jarakKeKabKm: 52 },
  { no: 9, desa: 'Karanganyar', luasKm2: 11.07, persentaseLuas: 9.28, jarakKeKecKm: 7, jarakKeKabKm: 56 },
  { no: 10, desa: 'Muktisari', luasKm2: 14.21, persentaseLuas: 11.92, jarakKeKecKm: 3, jarakKeKabKm: 45 },
  { no: 11, desa: 'Kertajaya', luasKm2: 6.88, persentaseLuas: 5.77, jarakKeKecKm: 9, jarakKeKabKm: 54 },
  { no: 12, desa: 'Cinangsi', luasKm2: 7.17, persentaseLuas: 6.01, jarakKeKecKm: 14, jarakKeKabKm: 58 },
  { no: 13, desa: 'Karanggintung', luasKm2: 9.88, persentaseLuas: 8.29, jarakKeKecKm: 16, jarakKeKabKm: 60 },
  { no: 14, desa: 'Rungkang', luasKm2: 7.95, persentaseLuas: 6.67, jarakKeKecKm: 12, jarakKeKabKm: 63 },
];

export const totalGeografiKecamatan = {
  luasTotalKm2: 119.26,
  persentaseKabupaten: 5.04,
  ketinggianMdpl: 15,
  jarakKeIbukotaKabKm: 73,
  batasWilayah: {
    utara: 'Kecamatan Karangpucung',
    timur: 'Kecamatan Bantarsari dan Kabupaten Banyumas',
    selatan: 'Kecamatan Patimuan dan Kecamatan Kampung Laut',
    barat: 'Kecamatan Sidareja, Kecamatan Kedungreja, dan Kecamatan Karangpucung',
  },
  highlights: {
    terluas: { desa: 'Sidaurip', luasKm2: 17.04, persentaseLuas: 14.29 },
    terkecil: { desa: 'Gandrungmangu', luasKm2: 4.57, persentaseLuas: 3.83 },
    terdekatKec: { desa: ['Gandrungmanis', 'Gandrungmangu'], jarakKm: 1 },
    terjauhKec: { desa: 'Karanggintung', jarakKm: 16 },
    terdekatKab: { desa: ['Gandrungmanis', 'Bulusari', 'Gandrungmangu', 'Muktisari'], jarakKm: 45 },
    terjauhKab: { desa: 'Rungkang', jarakKm: 63 },
  }
};

export interface SppgMbgData {
  no: number;
  namaSppg: string;
  status: 'AKTIF' | 'BELUM AKTIF';
  alamat: string;
  namaYayasan: string;
  tanggalOperasion: string;
  sppiPicMitra: string;
  noWa: string;
  ket: string;
  village: string;
}

export const sppgMbgDataset: SppgMbgData[] = [
  {
    no: 1,
    namaSppg: 'SPPG Cilacap Gandrungmangu Gandrungmanis 1',
    status: 'AKTIF',
    alamat: 'Jalan Gatot Subroto RT 01 RW 010, Gandrungmanis, Gandrungmangu',
    namaYayasan: 'Intan Persada Bercahaya',
    tanggalOperasion: '13-Agu-25',
    sppiPicMitra: 'Rofingurutab, S.PD.I.,M.Pd.',
    noWa: '085712880041',
    ket: 'ToA Kedungreja',
    village: 'Gandrungmanis'
  },
  {
    no: 2,
    namaSppg: 'SPPG Cilacap Gandrungmangu Gandrungmanis 2',
    status: 'AKTIF',
    alamat: 'Gandrungmanis RT 003 RW 001, Gandrungmanis, Kec. Gandrungmangu',
    namaYayasan: 'Lukman Hikmah Barokah (Novita)',
    tanggalOperasion: '19-Agu-25',
    sppiPicMitra: 'Alfi Zaidatussholihah, S.Pd.',
    noWa: '085876005611',
    ket: 'ToA Wanareja',
    village: 'Gandrungmanis'
  },
  {
    no: 3,
    namaSppg: 'SPPG Cilacap Gandrungmangu Wringinharjo',
    status: 'AKTIF',
    alamat: 'Jalan Raya Karangpucung - Sidareja, Desa Wringinharjo, Gandrungmangu',
    namaYayasan: 'Arrohman Tinggarjaya',
    tanggalOperasion: '19-Agu-25',
    sppiPicMitra: 'Kholiluzzahrah Siswoyo, S.T.',
    noWa: '082241975015',
    ket: 'ToA Maos',
    village: 'Wringinharjo'
  },
  {
    no: 4,
    namaSppg: 'SPPG Cilacap Gandrungmangu Gandrungmangu',
    status: 'AKTIF',
    alamat: 'Jl. Nahdayan RT 05 RW 03, Gandrungmangu',
    namaYayasan: 'Ikhlas Berbagi Cilacap (LP Ma\'arif NU)',
    tanggalOperasion: '27-Okt-25',
    sppiPicMitra: 'Faiz Tamimi, S.Pd.',
    noWa: '085780185379',
    ket: 'Warlok Gandrung/KORCAM',
    village: 'Gandrungmangu'
  },
  {
    no: 5,
    namaSppg: 'SPPG Cilacap Gandrungmangu Gandrungmangu 2',
    status: 'AKTIF',
    alamat: 'Gandrungmangu, Kabupaten Cilacap, Jawa Tengah (belakang pasar)',
    namaYayasan: 'Manna Karya Sejahtera',
    tanggalOperasion: '13-Apr-26',
    sppiPicMitra: 'Davi Setiawan Nur, S.H.',
    noWa: '085373156188',
    ket: 'ToA Aceh',
    village: 'Gandrungmangu'
  },
  {
    no: 6,
    namaSppg: 'SPPG Cilacap Gandrungmangu Cisumur',
    status: 'AKTIF',
    alamat: 'Purwodadi RT 006 RW 003, Desa Cisumur, Gandrungmangu',
    namaYayasan: 'Bumi Mutiara Insani',
    tanggalOperasion: '19-Jan-26',
    sppiPicMitra: 'Hasna Nur Amalia, S.K.M.',
    noWa: '085201678552',
    ket: 'Warlok Gandrungmangu',
    village: 'Cisumur'
  },
  {
    no: 7,
    namaSppg: 'SPPG Cilacap Gandrungmangu Cisumur 2',
    status: 'AKTIF',
    alamat: 'Dusun Kaligubet, Desa Cisumur Kec Gandrungmangu',
    namaYayasan: 'Hasim Syarif',
    tanggalOperasion: '08-Jan-26',
    sppiPicMitra: 'Devis Arif Wibowo, S.S.',
    noWa: '0895334378129',
    ket: 'ToA PWT Selatan',
    village: 'Cisumur'
  },
  {
    no: 8,
    namaSppg: 'SPPG Cilacap Gandrungmangu Cisumur 3',
    status: 'AKTIF',
    alamat: 'Jalan Kartadiwirya RT. 001 RW. 005 Desa Cisumur, Kec. Gandrungmangu',
    namaYayasan: 'Karangjati Sehat Jaya',
    tanggalOperasion: '02-Mar-26',
    sppiPicMitra: 'Achmad Lutfi Andriyanto, S.K.M.',
    noWa: '081249722686',
    ket: 'ToA Boyolali',
    village: 'Cisumur'
  },
  {
    no: 9,
    namaSppg: 'SPPG Cilacap Gandrungmangu Cinangsi 1',
    status: 'AKTIF',
    alamat: 'Desa Cinangsi RT 02 RW 03, Gandrungmangu',
    namaYayasan: 'Cahaya Insan Mas',
    tanggalOperasion: '02-Mar-26',
    sppiPicMitra: 'Candra Prasetyo Wibowo, S.Pd.',
    noWa: '087733197844',
    ket: 'ToA Sukoharjo',
    village: 'Cinangsi'
  },
  {
    no: 10,
    namaSppg: 'SPPG Cilacap Gandrungmangu Cinangsi 2',
    status: 'BELUM AKTIF',
    alamat: 'Desa Cinangsi RT 02 RW 03, Gandrungmangu',
    namaYayasan: 'Sembah Amal Surga',
    tanggalOperasion: 'blm ops',
    sppiPicMitra: 'Bayu Pratama, S1 Agribisnis pertanian',
    noWa: '085768365022',
    ket: 'ToA Jambi',
    village: 'Cinangsi'
  },
  {
    no: 11,
    namaSppg: 'SPPG Cilacap Gandrungmangu Cinangsi 3',
    status: 'BELUM AKTIF',
    alamat: 'Gudang Kayu Bpk. Kartiman, Cinangsi',
    namaYayasan: 'Satria Muda Ajibarang',
    tanggalOperasion: 'blm ops',
    sppiPicMitra: 'Wybren Agung Mukti, D4/S1 Teknik Informatika',
    noWa: '082166985122',
    ket: 'ToA Tapanuli Utara',
    village: 'Cinangsi'
  },
  {
    no: 12,
    namaSppg: 'SPPG Cilacap Gandrungmangu Gandrungmangu 3',
    status: 'BELUM AKTIF',
    alamat: 'Dusun Kebanaran RT 02 RW 05 Desa Gandrungmangu Kec. Gandrungmangu',
    namaYayasan: 'REZA HARFI (NU)',
    tanggalOperasion: 'proses persiapan',
    sppiPicMitra: 'Lutfi Hakim',
    noWa: '085225575097',
    ket: 'PiC/Mitra',
    village: 'Gandrungmangu'
  },
  {
    no: 13,
    namaSppg: 'SPPG Cilacap Gandrungmangu Gandrungmanis 3',
    status: 'BELUM AKTIF',
    alamat: 'Jalan A Yani RT 004 RW 006 Desa Gandrungmanis, Kec. Gandrungmangu',
    namaYayasan: 'Tunas Nusantara Indonesia',
    tanggalOperasion: 'proses persiapan',
    sppiPicMitra: 'Titiek Haryati Harun',
    noWa: '087780485758',
    ket: 'PiC/Mitra',
    village: 'Gandrungmanis'
  },
  {
    no: 14,
    namaSppg: 'SPPG Cilacap Gandrungmangu Bulusari',
    status: 'BELUM AKTIF',
    alamat: 'Dusun Karanggandul, Desa Bulusari, Gandrungmangu',
    namaYayasan: 'Ganesa',
    tanggalOperasion: 'proses persiapan',
    sppiPicMitra: 'Lily Sabrina',
    noWa: '085878405070',
    ket: 'PiC/Mitra',
    village: 'Bulusari'
  },
  {
    no: 15,
    namaSppg: 'SPPG Cilacap Gandrungmangu Karanganyar',
    status: 'BELUM AKTIF',
    alamat: 'Jalan Raya Sidareja-Karangpucung, Ciloning RT01/04, Karanganyar, Gandrungmangu, Cilacap',
    namaYayasan: 'Pamuji Makmur Sejahtera (Tato)',
    tanggalOperasion: 'proses persiapan',
    sppiPicMitra: 'Aryza Rio Prastowo',
    noWa: '085157976690',
    ket: 'PiC/Mitra',
    village: 'Karanganyar'
  },
  {
    no: 16,
    namaSppg: 'SPPG Cilacap Gandrungmangu Layansari',
    status: 'BELUM AKTIF',
    alamat: 'JL. Bima RT 04 RW 05, Desa Layansari, Kec. Gandrungmangu, Kab. Cilacap, Jawa Tengah 53254',
    namaYayasan: 'Youth Development Forum Indonesia Berkarya (MUI)',
    tanggalOperasion: 'proses persiapan',
    sppiPicMitra: 'Muallifatur Rosidah',
    noWa: '087848165357',
    ket: 'PiC/Mitra',
    village: 'Layansari'
  },
  {
    no: 17,
    namaSppg: 'SPPG Cilacap Gandrungmangu Gandrungmangu 4',
    status: 'BELUM AKTIF',
    alamat: 'Buluwangi, Gandrungmangu',
    namaYayasan: 'Cahaya Insan Mas',
    tanggalOperasion: 'Proses persiapan',
    sppiPicMitra: 'Ihfar Sugiarto',
    noWa: '082243760149',
    ket: 'PiC/Mitra',
    village: 'Gandrungmangu'
  }
];

export const sppgMbgSummary = {
  total: 17,
  aktif: 9,
  belumAktif: 8
};

export interface PendudukAgama {
  id?: string;
  no?: number;
  village: string;
  islam: number;
  kristenProtestan: number;
  katolik: number;
  budha: number;
  hindu: number;
  konghucu: number;
  kepercayaan: number;
  lainLain: number;
  total?: number;
}

export const defaultPendudukAgamaData: PendudukAgama[] = [
  { no: 1, village: 'BULUSARI', islam: 8250, kristenProtestan: 35, katolik: 12, budha: 0, hindu: 2, konghucu: 0, kepercayaan: 0, lainLain: 0 },
  { no: 2, village: 'CINANGSI', islam: 8690, kristenProtestan: 42, katolik: 18, budha: 1, hindu: 0, konghucu: 0, kepercayaan: 0, lainLain: 0 },
  { no: 3, village: 'CISUMUR', islam: 10760, kristenProtestan: 58, katolik: 24, budha: 2, hindu: 1, konghucu: 0, kepercayaan: 0, lainLain: 0 },
  { no: 4, village: 'GANDRUNGMANGU', islam: 11620, kristenProtestan: 145, katolik: 68, budha: 8, hindu: 5, konghucu: 2, kepercayaan: 0, lainLain: 0 },
  { no: 5, village: 'GANDRUNGMANIS', islam: 7680, kristenProtestan: 28, katolik: 14, budha: 0, hindu: 0, konghucu: 0, kepercayaan: 0, lainLain: 0 },
  { no: 6, village: 'GINTUNGREJA', islam: 6840, kristenProtestan: 19, katolik: 8, budha: 0, hindu: 0, konghucu: 0, kepercayaan: 0, lainLain: 0 },
  { no: 7, village: 'KARANGANYAR', islam: 7150, kristenProtestan: 22, katolik: 10, budha: 0, hindu: 0, konghucu: 0, kepercayaan: 0, lainLain: 0 },
  { no: 8, village: 'KARANGGINTUNG', islam: 10240, kristenProtestan: 48, katolik: 20, budha: 3, hindu: 1, konghucu: 0, kepercayaan: 0, lainLain: 0 },
  { no: 9, village: 'KERTAJAYA', islam: 7420, kristenProtestan: 31, katolik: 15, budha: 0, hindu: 0, konghucu: 0, kepercayaan: 0, lainLain: 0 },
  { no: 10, village: 'LAYANSARI', islam: 10180, kristenProtestan: 64, katolik: 28, budha: 4, hindu: 2, konghucu: 0, kepercayaan: 0, lainLain: 0 },
  { no: 11, village: 'MUKTISARI', islam: 9350, kristenProtestan: 51, katolik: 21, budha: 1, hindu: 0, konghucu: 0, kepercayaan: 0, lainLain: 0 },
  { no: 12, village: 'RUNGKANG', islam: 3120, kristenProtestan: 12, katolik: 5, budha: 0, hindu: 0, konghucu: 0, kepercayaan: 0, lainLain: 0 },
  { no: 13, village: 'SIDAURIP', islam: 7890, kristenProtestan: 38, katolik: 16, budha: 1, hindu: 0, konghucu: 0, kepercayaan: 0, lainLain: 0 },
  { no: 14, village: 'WRINGINHARJO', islam: 7910, kristenProtestan: 40, katolik: 17, budha: 0, hindu: 1, konghucu: 0, kepercayaan: 0, lainLain: 0 },
];

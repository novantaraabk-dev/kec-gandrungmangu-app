'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  School, 
  Users, 
  UserCheck, 
  BookOpen, 
  Award, 
  PieChart as PieChartIcon, 
  BarChart3, 
  Search, 
  Sparkles, 
  Building2,
  ChevronRight,
  Filter,
  CheckCircle2,
  TrendingUp,
  Layers,
  FileSpreadsheet,
  ChevronDown
} from 'lucide-react';

export interface EducationInstitution {
  no: number;
  jenjang: 'TK' | 'KB' | 'TPA' | 'SPS' | 'SD' | 'SMP' | 'SMA' | 'SMK' | 'SLB' | 'PKBM';
  npsn: string;
  nama: string;
  status: 'Negeri' | 'Swasta';
  guru: number;
  tendik: number;
  totalPtk: number;
  siswa: number;
}

export const educationDataset: EducationInstitution[] = [
  // TK (1 - 22)
  { no: 1, jenjang: 'TK', npsn: '20351282', nama: 'TK AISYIYAH BUSTANUL ATHFAL', status: 'Swasta', guru: 3, tendik: 2, totalPtk: 5, siswa: 25 },
  { no: 2, jenjang: 'TK', npsn: '20351281', nama: 'TK DHARMA WANITA', status: 'Swasta', guru: 4, tendik: 1, totalPtk: 5, siswa: 23 },
  { no: 3, jenjang: 'TK', npsn: '20351290', nama: 'TK DIPONEGORO', status: 'Swasta', guru: 6, tendik: 2, totalPtk: 8, siswa: 74 },
  { no: 4, jenjang: 'TK', npsn: '20351291', nama: 'TK DIPONEGORO', status: 'Swasta', guru: 8, tendik: 1, totalPtk: 9, siswa: 93 },
  { no: 5, jenjang: 'TK', npsn: '20351297', nama: 'TK DIPONEGORO Desa Sidaurip', status: 'Swasta', guru: 4, tendik: 1, totalPtk: 5, siswa: 45 },
  { no: 6, jenjang: 'TK', npsn: '20351295', nama: 'TK HANDAYANI', status: 'Swasta', guru: 3, tendik: 2, totalPtk: 5, siswa: 35 },
  { no: 7, jenjang: 'TK', npsn: '69855710', nama: 'TK HANDAYANI', status: 'Swasta', guru: 0, tendik: 1, totalPtk: 1, siswa: 22 },
  { no: 8, jenjang: 'TK', npsn: '20351284', nama: 'TK ISLAM AL IRSYAD', status: 'Swasta', guru: 5, tendik: 1, totalPtk: 6, siswa: 83 },
  { no: 9, jenjang: 'TK', npsn: '20351292', nama: 'TK ISLAM AL KARIM', status: 'Swasta', guru: 8, tendik: 1, totalPtk: 9, siswa: 100 },
  { no: 10, jenjang: 'TK', npsn: '20351301', nama: 'TK IT (ISLAM TERPADU) INSAN KAMIL', status: 'Swasta', guru: 9, tendik: 4, totalPtk: 13, siswa: 118 },
  { no: 11, jenjang: 'TK', npsn: '20351534', nama: 'TK KARTINI', status: 'Swasta', guru: 4, tendik: 1, totalPtk: 5, siswa: 34 },
  { no: 12, jenjang: 'TK', npsn: '20351298', nama: 'TK KASIH IBU', status: 'Swasta', guru: 1, tendik: 1, totalPtk: 2, siswa: 25 },
  { no: 13, jenjang: 'TK', npsn: '70060509', nama: 'TK MANBAUL HIKMAH', status: 'Swasta', guru: 0, tendik: 1, totalPtk: 1, siswa: 0 },
  { no: 14, jenjang: 'TK', npsn: '20351283', nama: 'TK MASYITOH', status: 'Swasta', guru: 4, tendik: 1, totalPtk: 5, siswa: 56 },
  { no: 15, jenjang: 'TK', npsn: '20351279', nama: 'TK PERTIWI', status: 'Swasta', guru: 2, tendik: 1, totalPtk: 3, siswa: 38 },
  { no: 16, jenjang: 'TK', npsn: '69956997', nama: 'TK PERTIWI', status: 'Swasta', guru: 3, tendik: 1, totalPtk: 4, siswa: 25 },
  { no: 17, jenjang: 'TK', npsn: '20351277', nama: 'TK PERTIWI DHARMA WANITA', status: 'Swasta', guru: 4, tendik: 3, totalPtk: 7, siswa: 57 },
  { no: 18, jenjang: 'TK', npsn: '20351280', nama: 'TK PERTIWI PAMARDISIWI', status: 'Swasta', guru: 2, tendik: 2, totalPtk: 4, siswa: 37 },
  { no: 19, jenjang: 'TK', npsn: '20351289', nama: 'TK PGRI', status: 'Swasta', guru: 3, tendik: 1, totalPtk: 4, siswa: 14 },
  { no: 20, jenjang: 'TK', npsn: '20351285', nama: 'TK SIWI ASIH', status: 'Swasta', guru: 1, tendik: 1, totalPtk: 2, siswa: 7 },
  { no: 21, jenjang: 'TK', npsn: '69899594', nama: 'TK SUDIRMAN', status: 'Swasta', guru: 4, tendik: 1, totalPtk: 5, siswa: 60 },
  { no: 22, jenjang: 'TK', npsn: '20351287', nama: 'TK YOS SUDARSO', status: 'Swasta', guru: 4, tendik: 0, totalPtk: 4, siswa: 26 },

  // KB (23 - 46)
  { no: 23, jenjang: 'KB', npsn: '69855914', nama: 'KB AL - HUSNA', status: 'Swasta', guru: 1, tendik: 1, totalPtk: 2, siswa: 25 },
  { no: 24, jenjang: 'KB', npsn: '70010572', nama: 'KB AL WAFA', status: 'Swasta', guru: 3, tendik: 1, totalPtk: 4, siswa: 43 },
  { no: 25, jenjang: 'KB', npsn: '69945357', nama: 'KB AR ROHMAN', status: 'Swasta', guru: 2, tendik: 1, totalPtk: 3, siswa: 25 },
  { no: 26, jenjang: 'KB', npsn: '69855907', nama: 'KB ASSYIFA', status: 'Swasta', guru: 2, tendik: 1, totalPtk: 3, siswa: 11 },
  { no: 27, jenjang: 'KB', npsn: '69855920', nama: 'KB EL- WILDAN', status: 'Swasta', guru: 1, tendik: 1, totalPtk: 2, siswa: 12 },
  { no: 28, jenjang: 'KB', npsn: '69855908', nama: 'KB KIHAJAR DEWANTARA', status: 'Swasta', guru: 2, tendik: 1, totalPtk: 3, siswa: 24 },
  { no: 29, jenjang: 'KB', npsn: '69855918', nama: 'KB NURUL JANNAH', status: 'Swasta', guru: 2, tendik: 1, totalPtk: 3, siswa: 25 },
  { no: 30, jenjang: 'KB', npsn: '69855919', nama: 'KB TUNAS BANGSA', status: 'Swasta', guru: 2, tendik: 2, totalPtk: 4, siswa: 30 },
  { no: 31, jenjang: 'KB', npsn: '69855916', nama: 'PAUD AL YASYA', status: 'Swasta', guru: 2, tendik: 0, totalPtk: 2, siswa: 16 },
  { no: 32, jenjang: 'KB', npsn: '69814216', nama: 'PAUD AL - HUSNA', status: 'Swasta', guru: 3, tendik: 0, totalPtk: 3, siswa: 31 },
  { no: 33, jenjang: 'KB', npsn: '69855912', nama: 'PAUD AL AMANAH', status: 'Swasta', guru: 2, tendik: 1, totalPtk: 3, siswa: 42 },
  { no: 34, jenjang: 'KB', npsn: '69855905', nama: 'PAUD AL HIKMAH', status: 'Swasta', guru: 2, tendik: 1, totalPtk: 3, siswa: 43 },
  { no: 35, jenjang: 'KB', npsn: '69855913', nama: 'PAUD AL-AMIN', status: 'Swasta', guru: 2, tendik: 1, totalPtk: 3, siswa: 35 },
  { no: 36, jenjang: 'KB', npsn: '69855910', nama: 'PAUD AN NIDA', status: 'Swasta', guru: 3, tendik: 1, totalPtk: 4, siswa: 60 },
  { no: 37, jenjang: 'KB', npsn: '69855915', nama: 'PAUD AN-NUR', status: 'Swasta', guru: 2, tendik: 1, totalPtk: 3, siswa: 24 },
  { no: 38, jenjang: 'KB', npsn: '69945358', nama: 'PAUD ASSIDIK', status: 'Swasta', guru: 2, tendik: 1, totalPtk: 3, siswa: 27 },
  { no: 39, jenjang: 'KB', npsn: '69855917', nama: 'PAUD DARUL ATHFAL', status: 'Swasta', guru: 3, tendik: 0, totalPtk: 3, siswa: 30 },
  { no: 40, jenjang: 'KB', npsn: '69855911', nama: 'PAUD FADILAH', status: 'Swasta', guru: 5, tendik: 1, totalPtk: 6, siswa: 83 },
  { no: 41, jenjang: 'KB', npsn: '69855921', nama: 'PAUD IMAM GHOZALI', status: 'Swasta', guru: 3, tendik: 1, totalPtk: 4, siswa: 19 },
  { no: 42, jenjang: 'KB', npsn: '69900589', nama: 'PAUD ISTIQOMAH', status: 'Swasta', guru: 2, tendik: 1, totalPtk: 3, siswa: 29 },
  { no: 43, jenjang: 'KB', npsn: '69915806', nama: 'PAUD PERTIWI', status: 'Swasta', guru: 0, tendik: 2, totalPtk: 2, siswa: 20 },
  { no: 44, jenjang: 'KB', npsn: '69908412', nama: 'PAUD QURROTA A`YUN', status: 'Swasta', guru: 2, tendik: 2, totalPtk: 4, siswa: 31 },
  { no: 45, jenjang: 'KB', npsn: '69855909', nama: 'PAUD SIWI LESTARI', status: 'Swasta', guru: 4, tendik: 1, totalPtk: 5, siswa: 34 },
  { no: 46, jenjang: 'KB', npsn: '69907314', nama: 'PAUD TERPADU INSAN KAMIL', status: 'Swasta', guru: 1, tendik: 1, totalPtk: 2, siswa: 33 },

  // TPA & SPS (47 - 50)
  { no: 47, jenjang: 'TPA', npsn: '69856123', nama: 'TPA ASSYIFA', status: 'Swasta', guru: 0, tendik: 1, totalPtk: 1, siswa: 18 },
  { no: 48, jenjang: 'TPA', npsn: '69856124', nama: 'TPA I JAZUL ATHFAL', status: 'Swasta', guru: 6, tendik: 0, totalPtk: 6, siswa: 39 },
  { no: 49, jenjang: 'SPS', npsn: '69856149', nama: 'POS PAUD KENCANA', status: 'Swasta', guru: 0, tendik: 2, totalPtk: 2, siswa: 1 },
  { no: 50, jenjang: 'SPS', npsn: '69856152', nama: 'POS PAUD MELATI', status: 'Swasta', guru: 2, tendik: 1, totalPtk: 3, siswa: 22 },

  // SD (51 - 109)
  { no: 51, jenjang: 'SD', npsn: '69867967', nama: 'SD CAHAYA GANDRUNGMANGU', status: 'Swasta', guru: 13, tendik: 2, totalPtk: 15, siswa: 308 },
  { no: 52, jenjang: 'SD', npsn: '20300764', nama: 'SD ISLAM AL IRSYAD GINTUNGREJA', status: 'Swasta', guru: 8, tendik: 4, totalPtk: 12, siswa: 208 },
  { no: 53, jenjang: 'SD', npsn: '20338723', nama: 'SD MUHAMMADIYAH GANDRUNGMANIS', status: 'Swasta', guru: 6, tendik: 1, totalPtk: 7, siswa: 129 },
  { no: 54, jenjang: 'SD', npsn: '20338726', nama: 'SD NEGERI BULUSARI 01 GANDRUNGMANGU', status: 'Negeri', guru: 8, tendik: 1, totalPtk: 9, siswa: 218 },
  { no: 55, jenjang: 'SD', npsn: '20338727', nama: 'SD NEGERI BULUSARI 02 GANDRUNGMANGU', status: 'Negeri', guru: 7, tendik: 2, totalPtk: 9, siswa: 99 },
  { no: 56, jenjang: 'SD', npsn: '20338728', nama: 'SD NEGERI BULUSARI 03 GANDRUNGMANGU', status: 'Negeri', guru: 5, tendik: 2, totalPtk: 7, siswa: 28 },
  { no: 57, jenjang: 'SD', npsn: '20338729', nama: 'SD NEGERI BULUSARI 04 GANDRUNGMANGU', status: 'Negeri', guru: 6, tendik: 3, totalPtk: 9, siswa: 143 },
  { no: 58, jenjang: 'SD', npsn: '20301383', nama: 'SD NEGERI CINANGSI 01 GANDRUNGMANGU', status: 'Negeri', guru: 7, tendik: 1, totalPtk: 8, siswa: 162 },
  { no: 59, jenjang: 'SD', npsn: '20301382', nama: 'SD NEGERI CINANGSI 02 GANDRUNGMANGU', status: 'Negeri', guru: 8, tendik: 2, totalPtk: 10, siswa: 97 },
  { no: 60, jenjang: 'SD', npsn: '20301381', nama: 'SD NEGERI CINANGSI 03 GANDRUNGMANGU', status: 'Negeri', guru: 8, tendik: 1, totalPtk: 9, siswa: 83 },
  { no: 61, jenjang: 'SD', npsn: '20301380', nama: 'SD NEGERI CINANGSI 04 GANDRUNGMANGU', status: 'Negeri', guru: 6, tendik: 2, totalPtk: 8, siswa: 64 },
  { no: 62, jenjang: 'SD', npsn: '20340918', nama: 'SD NEGERI CISUMUR 01 GANDRUNGMANGU', status: 'Negeri', guru: 6, tendik: 1, totalPtk: 7, siswa: 203 },
  { no: 63, jenjang: 'SD', npsn: '20301489', nama: 'SD NEGERI CISUMUR 02 GANDRUNGMANGU', status: 'Negeri', guru: 5, tendik: 3, totalPtk: 8, siswa: 117 },
  { no: 64, jenjang: 'SD', npsn: '20338739', nama: 'SD NEGERI CISUMUR 04 GANDRUNGMANGU', status: 'Negeri', guru: 5, tendik: 3, totalPtk: 8, siswa: 111 },
  { no: 65, jenjang: 'SD', npsn: '20338741', nama: 'SD NEGERI GANDRUNGMANGU 01 GANDRUNGMANGU', status: 'Negeri', guru: 12, tendik: 2, totalPtk: 14, siswa: 309 },
  { no: 66, jenjang: 'SD', npsn: '20354669', nama: 'SD NEGERI GANDRUNGMANGU 02 GANDRUNGMANGU', status: 'Negeri', guru: 8, tendik: 1, totalPtk: 9, siswa: 63 },
  { no: 67, jenjang: 'SD', npsn: '20338742', nama: 'SD NEGERI GANDRUNGMANGU 03 GANDRUNGMANGU', status: 'Negeri', guru: 7, tendik: 1, totalPtk: 8, siswa: 80 },
  { no: 68, jenjang: 'SD', npsn: '20338743', nama: 'SD NEGERI GANDRUNGMANGU 04 GANDRUNGMANGU', status: 'Negeri', guru: 6, tendik: 1, totalPtk: 7, siswa: 83 },
  { no: 69, jenjang: 'SD', npsn: '20338744', nama: 'SD NEGERI GANDRUNGMANGU 05 GANDRUNGMANGU', status: 'Negeri', guru: 7, tendik: 3, totalPtk: 10, siswa: 169 },
  { no: 70, jenjang: 'SD', npsn: '20301442', nama: 'SD NEGERI GANDRUNGMANGU 06 GANDRUNGMANGU', status: 'Negeri', guru: 6, tendik: 4, totalPtk: 10, siswa: 86 },
  { no: 71, jenjang: 'SD', npsn: '20338745', nama: 'SD NEGERI GANDRUNGMANIS 01 GANDRUNGMANGU', status: 'Negeri', guru: 10, tendik: 2, totalPtk: 12, siswa: 221 },
  { no: 72, jenjang: 'SD', npsn: '20301441', nama: 'SD NEGERI GANDRUNGMANIS 02 GANDRUNGMANGU', status: 'Negeri', guru: 7, tendik: 0, totalPtk: 7, siswa: 226 },
  { no: 73, jenjang: 'SD', npsn: '20338747', nama: 'SD NEGERI GINTUNGREJA 01 GANDRUNGMANGU', status: 'Negeri', guru: 8, tendik: 1, totalPtk: 9, siswa: 163 },
  { no: 74, jenjang: 'SD', npsn: '20338748', nama: 'SD NEGERI GINTUNGREJA 02 GANDRUNGMANGU', status: 'Negeri', guru: 7, tendik: 3, totalPtk: 10, siswa: 80 },
  { no: 75, jenjang: 'SD', npsn: '20301436', nama: 'SD NEGERI GINTUNGREJA 03 GANDRUNGMANGU', status: 'Negeri', guru: 6, tendik: 2, totalPtk: 8, siswa: 68 },
  { no: 76, jenjang: 'SD', npsn: '20338751', nama: 'SD NEGERI KARANGANYAR 01 GANDRUNGMANGU', status: 'Negeri', guru: 7, tendik: 3, totalPtk: 10, siswa: 109 },
  { no: 77, jenjang: 'SD', npsn: '20338752', nama: 'SD NEGERI KARANGANYAR 02 GANDRUNGMANGU', status: 'Negeri', guru: 6, tendik: 1, totalPtk: 7, siswa: 76 },
  { no: 78, jenjang: 'SD', npsn: '20338753', nama: 'SD NEGERI KARANGANYAR 03 GANDRUNGMANGU', status: 'Negeri', guru: 8, tendik: 1, totalPtk: 9, siswa: 83 },
  { no: 79, jenjang: 'SD', npsn: '20338754', nama: 'SD NEGERI KARANGANYAR 04 GANDRUNGMANGU', status: 'Negeri', guru: 6, tendik: 0, totalPtk: 6, siswa: 80 },
  { no: 80, jenjang: 'SD', npsn: '20338755', nama: 'SD NEGERI KARANGANYAR 05 GANDRUNGMANGU', status: 'Negeri', guru: 7, tendik: 0, totalPtk: 7, siswa: 54 },
  { no: 81, jenjang: 'SD', npsn: '20338756', nama: 'SD NEGERI KARANGANYAR 06 GANDRUNGMANGU', status: 'Negeri', guru: 7, tendik: 0, totalPtk: 7, siswa: 105 },
  { no: 82, jenjang: 'SD', npsn: '20338757', nama: 'SD NEGERI KARANGGINTUNG 01 GANDRUNGMANGU', status: 'Negeri', guru: 7, tendik: 3, totalPtk: 10, siswa: 86 },
  { no: 83, jenjang: 'SD', npsn: '20338758', nama: 'SD NEGERI KARANGGINTUNG 02 GANDRUNGMANGU', status: 'Negeri', guru: 8, tendik: 2, totalPtk: 10, siswa: 115 },
  { no: 84, jenjang: 'SD', npsn: '20338759', nama: 'SD NEGERI KARANGGINTUNG 03 GANDRUNGMANGU', status: 'Negeri', guru: 7, tendik: 3, totalPtk: 10, siswa: 84 },
  { no: 85, jenjang: 'SD', npsn: '20301129', nama: 'SD NEGERI KARANGGINTUNG 04 GANDRUNGMANGU', status: 'Negeri', guru: 6, tendik: 3, totalPtk: 9, siswa: 151 },
  { no: 86, jenjang: 'SD', npsn: '20338760', nama: 'SD NEGERI KARANGGINTUNG 05 GANDRUNGMANGU', status: 'Negeri', guru: 7, tendik: 2, totalPtk: 9, siswa: 57 },
  { no: 87, jenjang: 'SD', npsn: '20338761', nama: 'SD NEGERI KARANGGINTUNG 06 GANDRUNGMANGU', status: 'Negeri', guru: 7, tendik: 2, totalPtk: 9, siswa: 82 },
  { no: 88, jenjang: 'SD', npsn: '20301128', nama: 'SD NEGERI KARANGGINTUNG 07 GANDRUNGMANGU', status: 'Negeri', guru: 6, tendik: 3, totalPtk: 9, siswa: 73 },
  { no: 89, jenjang: 'SD', npsn: '20338766', nama: 'SD NEGERI KERTAJAYA 01 GANDRUNGMANGU', status: 'Negeri', guru: 6, tendik: 3, totalPtk: 9, siswa: 108 },
  { no: 90, jenjang: 'SD', npsn: '20301306', nama: 'SD NEGERI KERTAJAYA 02 GANDRUNGMANGU', status: 'Negeri', guru: 7, tendik: 1, totalPtk: 8, siswa: 65 },
  { no: 91, jenjang: 'SD', npsn: '20338767', nama: 'SD NEGERI KERTAJAYA 03 GANDRUNGMANGU', status: 'Negeri', guru: 6, tendik: 1, totalPtk: 7, siswa: 95 },
  { no: 92, jenjang: 'SD', npsn: '20338768', nama: 'SD NEGERI KERTAJAYA 04 GANDRUNGMANGU', status: 'Negeri', guru: 8, tendik: 3, totalPtk: 11, siswa: 94 },
  { no: 93, jenjang: 'SD', npsn: '20338485', nama: 'SD NEGERI LAYANSARI 01 GANDRUNGMANGU', status: 'Negeri', guru: 12, tendik: 2, totalPtk: 14, siswa: 336 },
  { no: 94, jenjang: 'SD', npsn: '20338771', nama: 'SD NEGERI LAYANSARI 02 GANDRUNGMANGU', status: 'Negeri', guru: 8, tendik: 2, totalPtk: 10, siswa: 114 },
  { no: 95, jenjang: 'SD', npsn: '20300342', nama: 'SD NEGERI LAYANSARI 03 GANDRUNGMANGU', status: 'Negeri', guru: 6, tendik: 5, totalPtk: 11, siswa: 204 },
  { no: 96, jenjang: 'SD', npsn: '20338773', nama: 'SD NEGERI MUKTISARI 01 GANDRUNGMANGU', status: 'Negeri', guru: 8, tendik: 2, totalPtk: 10, siswa: 172 },
  { no: 97, jenjang: 'SD', npsn: '20338774', nama: 'SD NEGERI MUKTISARI 02 GANDRUNGMANGU', status: 'Negeri', guru: 7, tendik: 1, totalPtk: 8, siswa: 77 },
  { no: 98, jenjang: 'SD', npsn: '20338775', nama: 'SD NEGERI MUKTISARI 03 GANDRUNGMANGU', status: 'Negeri', guru: 9, tendik: 1, totalPtk: 10, siswa: 174 },
  { no: 99, jenjang: 'SD', npsn: '20338779', nama: 'SD NEGERI RUNGKANG 01 GANDRUNGMANGU', status: 'Negeri', guru: 6, tendik: 2, totalPtk: 8, siswa: 88 },
  { no: 100, jenjang: 'SD', npsn: '20338780', nama: 'SD NEGERI RUNGKANG 02 GANDRUNGMANGU', status: 'Negeri', guru: 8, tendik: 3, totalPtk: 11, siswa: 95 },
  { no: 101, jenjang: 'SD', npsn: '20338781', nama: 'SD NEGERI RUNGKANG 03 GANDRUNGMANGU', status: 'Negeri', guru: 6, tendik: 2, totalPtk: 8, siswa: 45 },
  { no: 102, jenjang: 'SD', npsn: '20338782', nama: 'SD NEGERI SIDAURIP 01 GANDRUNGMANGU', status: 'Negeri', guru: 7, tendik: 2, totalPtk: 9, siswa: 74 },
  { no: 103, jenjang: 'SD', npsn: '20338783', nama: 'SD NEGERI SIDAURIP 02 GANDRUNGMANGU', status: 'Negeri', guru: 8, tendik: 0, totalPtk: 8, siswa: 115 },
  { no: 104, jenjang: 'SD', npsn: '20338784', nama: 'SD NEGERI SIDAURIP 03 GANDRUNGMANGU', status: 'Negeri', guru: 8, tendik: 4, totalPtk: 12, siswa: 182 },
  { no: 105, jenjang: 'SD', npsn: '20338785', nama: 'SD NEGERI SIDAURIP 04 GANDRUNGMANGU', status: 'Negeri', guru: 6, tendik: 0, totalPtk: 6, siswa: 89 },
  { no: 106, jenjang: 'SD', npsn: '20338797', nama: 'SD NEGERI WRINGINHARJO 01 GANDRUNGMANGU', status: 'Negeri', guru: 6, tendik: 2, totalPtk: 8, siswa: 101 },
  { no: 107, jenjang: 'SD', npsn: '20338798', nama: 'SD NEGERI WRINGINHARJO 02 GANDRUNGMANGU', status: 'Negeri', guru: 5, tendik: 3, totalPtk: 8, siswa: 116 },
  { no: 108, jenjang: 'SD', npsn: '20338799', nama: 'SD NEGERI WRINGINHARJO 03 GANDRUNGMANGU', status: 'Negeri', guru: 7, tendik: 3, totalPtk: 10, siswa: 148 },
  { no: 109, jenjang: 'SD', npsn: '20338800', nama: 'SD NEGERI WRINGINHARJO 04 GANDRUNGMANGU', status: 'Negeri', guru: 8, tendik: 1, totalPtk: 9, siswa: 105 },

  // SMP (110 - 122)
  { no: 110, jenjang: 'SMP', npsn: '20331737', nama: 'SMP ISLAM AL IRSYAD GANDRUNGMANGU', status: 'Swasta', guru: 9, tendik: 3, totalPtk: 12, siswa: 91 },
  { no: 111, jenjang: 'SMP', npsn: '20300476', nama: 'SMP KRISTEN GANDRUNGMANGU', status: 'Swasta', guru: 3, tendik: 1, totalPtk: 4, siswa: 6 },
  { no: 112, jenjang: 'SMP', npsn: '20338572', nama: 'SMP MIFTAHUL FALAH GANDRUNGMANGU', status: 'Swasta', guru: 9, tendik: 2, totalPtk: 11, siswa: 21 },
  { no: 113, jenjang: 'SMP', npsn: '20300496', nama: 'SMP MUHAMMADIYAH GANDRUNGMANGU', status: 'Swasta', guru: 6, tendik: 4, totalPtk: 10, siswa: 56 },
  { no: 114, jenjang: 'SMP', npsn: '20300515', nama: 'SMP NEGERI 3 GANDRUNGMANGU', status: 'Negeri', guru: 26, tendik: 7, totalPtk: 33, siswa: 562 },
  { no: 115, jenjang: 'SMP', npsn: '20300592', nama: 'SMP NEGERI 1 GANDRUNGMANGU', status: 'Negeri', guru: 43, tendik: 12, totalPtk: 55, siswa: 739 },
  { no: 116, jenjang: 'SMP', npsn: '20300529', nama: 'SMP NEGERI 2 GANDRUNGMANGU', status: 'Negeri', guru: 24, tendik: 7, totalPtk: 31, siswa: 458 },
  { no: 117, jenjang: 'SMP', npsn: '20338424', nama: 'SMP NEGERI SATU ATAP 1 GANDRUNGMANGU', status: 'Negeri', guru: 14, tendik: 3, totalPtk: 17, siswa: 281 },
  { no: 118, jenjang: 'SMP', npsn: '20300449', nama: 'SMP NURUL HUDA GANDRUNGMANGU', status: 'Swasta', guru: 16, tendik: 4, totalPtk: 20, siswa: 238 },
  { no: 119, jenjang: 'SMP', npsn: '20300440', nama: 'SMP PGRI 5 GANDRUNGMANGU', status: 'Swasta', guru: 2, tendik: 2, totalPtk: 4, siswa: 14 },
  { no: 120, jenjang: 'SMP', npsn: '20331753', nama: 'SMP PGRI 6 GANDRUNGMANGU 2', status: 'Swasta', guru: 4, tendik: 4, totalPtk: 8, siswa: 37 },
  { no: 121, jenjang: 'SMP', npsn: '20300462', nama: 'SMP PURNAMA GANDRUNGMANGU', status: 'Swasta', guru: 6, tendik: 2, totalPtk: 8, siswa: 48 },
  { no: 122, jenjang: 'SMP', npsn: '20331757', nama: 'SMP YOS SOEDARSO SIDAURIP GANDRUNGMANGU', status: 'Swasta', guru: 4, tendik: 3, totalPtk: 7, siswa: 60 },

  // SMA & SMK (123 - 126)
  { no: 123, jenjang: 'SMA', npsn: '20300627', nama: 'SMA PGRI 4 GANDRUNGMANGU', status: 'Swasta', guru: 6, tendik: 4, totalPtk: 10, siswa: 86 },
  { no: 124, jenjang: 'SMA', npsn: '20300622', nama: 'SMA YA BAKII 2 GANDRUNGMANGU', status: 'Swasta', guru: 14, tendik: 6, totalPtk: 20, siswa: 521 },
  { no: 125, jenjang: 'SMK', npsn: '69851435', nama: 'SMK AL HIKMAH GANDRUNGMANGU', status: 'Swasta', guru: 5, tendik: 3, totalPtk: 8, siswa: 34 },
  { no: 126, jenjang: 'SMK', npsn: '20300717', nama: 'SMK BOEDI OETOMO 2 GANDRUNGMANGU', status: 'Swasta', guru: 62, tendik: 37, totalPtk: 99, siswa: 1328 },

  // SLB & PKBM (127 - 128)
  { no: 127, jenjang: 'SLB', npsn: '70033265', nama: 'SLB PUTRA MANDIRI 2 GANDRUNGMANGU', status: 'Swasta', guru: 5, tendik: 2, totalPtk: 7, siswa: 55 },
  { no: 128, jenjang: 'PKBM', npsn: 'P9999421', nama: 'PKBM ASSYIFA JAYA', status: 'Swasta', guru: 2, tendik: 1, totalPtk: 3, siswa: 41 }
];

export function EducationAnalyticsSection() {
  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'paud' | 'sd' | 'smp' | 'smasmk' | 'slbpkbm'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTable, setShowTable] = useState(false);

  // Compute Aggregations for each category (Negeri vs Swasta)
  const categoryDetails = useMemo(() => {
    const filterItems = (fn: (d: EducationInstitution) => boolean) => educationDataset.filter(fn);

    const getStats = (items: EducationInstitution[]) => {
      const negeri = items.filter(i => i.status === 'Negeri');
      const swasta = items.filter(i => i.status === 'Swasta');

      const sum = (arr: EducationInstitution[]) => ({
        sekolah: arr.length,
        siswa: arr.reduce((a, b) => a + b.siswa, 0),
        guru: arr.reduce((a, b) => a + b.guru, 0),
        tendik: arr.reduce((a, b) => a + b.tendik, 0),
        totalPtk: arr.reduce((a, b) => a + b.totalPtk, 0),
      });

      return {
        total: sum(items),
        negeri: sum(negeri),
        swasta: sum(swasta),
        items,
      };
    };

    const paud = getStats(filterItems(d => ['TK', 'KB', 'TPA', 'SPS'].includes(d.jenjang)));
    const sd = getStats(filterItems(d => d.jenjang === 'SD'));
    const smp = getStats(filterItems(d => d.jenjang === 'SMP'));
    const smaSmk = getStats(filterItems(d => ['SMA', 'SMK'].includes(d.jenjang)));
    const slbPkbm = getStats(filterItems(d => ['SLB', 'PKBM'].includes(d.jenjang)));
    const all = getStats(educationDataset);

    return {
      all: { id: 'all', name: 'Semua Kategori (Ikhtisar)', desc: '128 Satuan Pendidikan Se-Kecamatan', data: all, color: '#0EA5E9' },
      paud: { id: 'paud', name: 'TK, KB, TPA, SPS', desc: 'PAUD & Pendidikan Usia Dini', data: paud, color: '#0D9488' },
      sd: { id: 'sd', name: 'Kategori SD', desc: 'Sekolah Dasar (56 Negeri, 3 Swasta)', data: sd, color: '#0284C7' },
      smp: { id: 'smp', name: 'Kategori SMP', desc: 'Sekolah Menengah Pertama (4 Negeri, 9 Swasta)', data: smp, color: '#4F46E5' },
      smasmk: { id: 'smasmk', name: 'Kategori SMA & SMK', desc: 'Sekolah Menengah Atas & Kejuruan', data: smaSmk, color: '#D97706' },
      slbpkbm: { id: 'slbpkbm', name: 'Kategori SLB & PKBM', desc: 'Sekolah Luar Biasa & PKBM Non-Formal', data: slbPkbm, color: '#E11D48' },
    };
  }, []);

  const currentCategory = categoryDetails[activeCategoryTab];

  // Filtered Items for Table View
  const filteredItems = useMemo(() => {
    return currentCategory.data.items.filter(item => {
      const q = searchQuery.toLowerCase();
      return item.nama.toLowerCase().includes(q) || item.npsn.includes(q) || item.jenjang.toLowerCase().includes(q);
    });
  }, [currentCategory, searchQuery]);

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-sky-50/70 rounded-3xl border border-indigo-300/90 shadow-md my-6 space-y-8">
      
      {/* SECTION HEADER & TITLE */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-sky-100 pb-4 sm:pb-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-[10px] sm:text-xs font-black tracking-widest text-sky-800 uppercase bg-sky-50 px-3.5 py-1.5 rounded-full border border-sky-200 shadow-xs flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-sky-600" />
              SEKTOR PENDIDIKAN KECAMATAN
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl lg:text-4xl font-black font-headline tracking-tight leading-tight text-slate-900">
            Sektor Pendidikan 14 Desa
          </h2>

          <p className="text-xs sm:text-base text-slate-600 leading-relaxed mt-1 font-medium max-w-3xl">
            Perbandingan Grafik & Statistik Sekolah Negeri vs Swasta untuk Kategori TK/KB/TPA/SPS, SD, SMP, SMA/SMK, dan SLB/PKBM.
          </p>
        </div>

        {/* STAT BADGE SUMMARY IN HEADER */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-700 text-white p-3.5 rounded-2xl shadow-md self-start lg:self-auto">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
            <School className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[10px] text-sky-100 font-bold uppercase block tracking-wider">Total Peserta Didik</span>
            <span className="text-xl font-black font-headline tracking-tight">13.676 Siswa</span>
          </div>
        </div>
      </div>

      {/* CATEGORY TAB SELECTOR (PERMASING-MASING KATEGORI) */}
      <div className="flex items-center gap-1.5 bg-slate-200/90 p-1.5 rounded-2xl border border-slate-300 shadow-inner flex-wrap">
        {[
          { key: 'all', label: '🌐 semua Kategori' },
          { key: 'paud', label: '🧸 TK, KB, TPA, SPS' },
          { key: 'sd', label: '🎒 Kategori SD' },
          { key: 'smp', label: '📘 Kategori SMP' },
          { key: 'smasmk', label: '🎓 Kategori SMA & SMK' },
          { key: 'slbpkbm', label: '🌱 Kategori SLB & PKBM' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategoryTab(tab.key as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategoryTab === tab.key
                ? 'bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white shadow-md scale-102'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/70'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* MAIN CONTENT FOR SELECTED CATEGORY (NEGERI VS SWASTA COMPARISON) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategoryTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          
          {/* 4 SUMMARY STAT CARDS (NEGERI VS SWASTA IN SELECTED CATEGORY) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            
            {/* 1. Total Sekolah Negeri vs Swasta */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Jumlah Sekolah</span>
                <School className="w-4 h-4 text-sky-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-headline">
                {currentCategory.data.total.sekolah} <span className="text-xs font-normal text-slate-500">Unit</span>
              </h3>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">Negeri: {currentCategory.data.negeri.sekolah}</span>
                <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Swasta: {currentCategory.data.swasta.sekolah}</span>
              </div>
            </div>

            {/* 2. Jumlah Siswa Negeri vs Swasta */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Jumlah Siswa</span>
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-headline">
                {currentCategory.data.total.siswa.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">Siswa</span>
              </h3>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">Negeri: {currentCategory.data.negeri.siswa.toLocaleString('id-ID')}</span>
                <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Swasta: {currentCategory.data.swasta.siswa.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* 3. Jumlah Guru Negeri vs Swasta */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pendidik (Guru)</span>
                <GraduationCap className="w-4 h-4 text-teal-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-headline">
                {currentCategory.data.total.guru} <span className="text-xs font-normal text-slate-500">Guru</span>
              </h3>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">Negeri: {currentCategory.data.negeri.guru}</span>
                <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Swasta: {currentCategory.data.swasta.guru}</span>
              </div>
            </div>

            {/* 4. Total PTK Negeri vs Swasta */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total PTK</span>
                <Award className="w-4 h-4 text-rose-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-headline">
                {currentCategory.data.total.totalPtk} <span className="text-xs font-normal text-slate-500">PTK</span>
              </h3>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">Negeri: {currentCategory.data.negeri.totalPtk}</span>
                <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Swasta: {currentCategory.data.swasta.totalPtk}</span>
              </div>
            </div>

          </div>

          {/* 2 COMPARISON CHARTS (SIDE BY SIDE: NEGERI VS SWASTA) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT 6 COLS: GRAFIK STACKED COMPARISON NEGERI VS SWASTA */}
            <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 font-headline flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-600" />
                    Grafik Perbandingan Negeri vs Swasta
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Analisis {currentCategory.name}</p>
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200">
                  {currentCategory.data.total.sekolah} Sekolah
                </span>
              </div>

              {/* BAR 1: JUMLAH SEKOLAH NEGERI VS SWASTA */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">🏫 Jumlah Sekolah (Satuan Pendidikan)</span>
                  <span className="text-slate-900">{currentCategory.data.total.sekolah} Unit</span>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden flex border border-slate-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${currentCategory.data.total.sekolah > 0 ? (currentCategory.data.negeri.sekolah / currentCategory.data.total.sekolah) * 100 : 0}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-indigo-600 flex items-center justify-center text-[9px] font-black text-white"
                  >
                    {currentCategory.data.negeri.sekolah > 0 ? `${currentCategory.data.negeri.sekolah} Negeri` : ''}
                  </motion.div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${currentCategory.data.total.sekolah > 0 ? (currentCategory.data.swasta.sekolah / currentCategory.data.total.sekolah) * 100 : 0}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-purple-500 flex items-center justify-center text-[9px] font-black text-white"
                  >
                    {currentCategory.data.swasta.sekolah > 0 ? `${currentCategory.data.swasta.sekolah} Swasta` : ''}
                  </motion.div>
                </div>
              </div>

              {/* BAR 2: JUMLAH SISWA NEGERI VS SWASTA */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">👨‍🎓 Jumlah Siswa / Peserta Didik</span>
                  <span className="text-slate-900">{currentCategory.data.total.siswa.toLocaleString('id-ID')} Siswa</span>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden flex border border-slate-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${currentCategory.data.total.siswa > 0 ? (currentCategory.data.negeri.siswa / currentCategory.data.total.siswa) * 100 : 0}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-indigo-600 flex items-center justify-center text-[9px] font-black text-white"
                  >
                    {currentCategory.data.negeri.siswa > 0 ? `${currentCategory.data.negeri.siswa.toLocaleString('id-ID')} Negeri` : ''}
                  </motion.div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${currentCategory.data.total.siswa > 0 ? (currentCategory.data.swasta.siswa / currentCategory.data.total.siswa) * 100 : 0}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-purple-500 flex items-center justify-center text-[9px] font-black text-white"
                  >
                    {currentCategory.data.swasta.siswa > 0 ? `${currentCategory.data.swasta.siswa.toLocaleString('id-ID')} Swasta` : ''}
                  </motion.div>
                </div>
              </div>

              {/* BAR 3: JUMLAH GURU NEGERI VS SWASTA */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">👩‍🏫 Pendidik (Guru)</span>
                  <span className="text-slate-900">{currentCategory.data.total.guru} Guru</span>
                </div>
                <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden flex border border-slate-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${currentCategory.data.total.guru > 0 ? (currentCategory.data.negeri.guru / currentCategory.data.total.guru) * 100 : 0}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-indigo-600 flex items-center justify-center text-[9px] font-black text-white"
                  >
                    {currentCategory.data.negeri.guru > 0 ? `${currentCategory.data.negeri.guru} Negeri` : ''}
                  </motion.div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${currentCategory.data.total.guru > 0 ? (currentCategory.data.swasta.guru / currentCategory.data.total.guru) * 100 : 0}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-purple-500 flex items-center justify-center text-[9px] font-black text-white"
                  >
                    {currentCategory.data.swasta.guru > 0 ? `${currentCategory.data.swasta.guru} Swasta` : ''}
                  </motion.div>
                </div>
              </div>

              {/* LEGEND BADGES */}
              <div className="pt-2 flex items-center justify-between text-xs font-bold border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-indigo-700">
                  <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" />
                  <span>Sekolah Negeri</span>
                </div>
                <div className="flex items-center gap-1.5 text-purple-700">
                  <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
                  <span>Sekolah Swasta</span>
                </div>
              </div>
            </div>

            {/* RIGHT 6 COLS: RINGKASAN PERSENTASE STATUS */}
            <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 font-headline flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-sky-600" />
                  Persentase Proporsi Status ({currentCategory.name})
                </h3>
                <p className="text-xs text-slate-500 font-medium">Distribusi siswa dan pengajar berdasarkan status lembaga</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                
                {/* Card Status Negeri */}
                <div className="p-4 rounded-2xl bg-indigo-50/90 border border-indigo-200 space-y-2">
                  <span className="text-xs font-extrabold text-indigo-900 uppercase block">STATUS NEGERI</span>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-700">
                      Sekolah: <strong className="text-indigo-900">{currentCategory.data.negeri.sekolah} Unit</strong>
                    </p>
                    <p className="text-xs text-slate-700">
                      Siswa: <strong className="text-indigo-900">{currentCategory.data.negeri.siswa.toLocaleString('id-ID')} Siswa</strong>
                    </p>
                    <p className="text-xs text-slate-700">
                      Guru: <strong className="text-indigo-900">{currentCategory.data.negeri.guru} Personel</strong>
                    </p>
                  </div>
                  <span className="text-[10px] font-black text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200 inline-block">
                    {currentCategory.data.total.sekolah > 0 ? ((currentCategory.data.negeri.sekolah / currentCategory.data.total.sekolah) * 100).toFixed(1) : 0}% Lembaga
                  </span>
                </div>

                {/* Card Status Swasta */}
                <div className="p-4 rounded-2xl bg-purple-50/90 border border-purple-200 space-y-2">
                  <span className="text-xs font-extrabold text-purple-900 uppercase block">STATUS SWASTA</span>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-700">
                      Sekolah: <strong className="text-purple-900">{currentCategory.data.swasta.sekolah} Unit</strong>
                    </p>
                    <p className="text-xs text-slate-700">
                      Siswa: <strong className="text-purple-900">{currentCategory.data.swasta.siswa.toLocaleString('id-ID')} Siswa</strong>
                    </p>
                    <p className="text-xs text-slate-700">
                      Guru: <strong className="text-purple-900">{currentCategory.data.swasta.guru} Personel</strong>
                    </p>
                  </div>
                  <span className="text-[10px] font-black text-purple-700 bg-white px-2 py-0.5 rounded-full border border-purple-200 inline-block">
                    {currentCategory.data.total.sekolah > 0 ? ((currentCategory.data.swasta.sekolah / currentCategory.data.total.sekolah) * 100).toFixed(1) : 0}% Lembaga
                  </span>
                </div>

              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
                ℹ️ Kategori <strong className="text-slate-900">{currentCategory.name}</strong> mencakup {currentCategory.desc}.
              </div>
            </div>

          </div>

          {/* INTERACTIVE TABLE OF SCHOOLS IN THIS CATEGORY (COLLAPSIBLE / HIDDEN BY DEFAULT) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all">
            {/* TOGGLE ACCORDION BUTTON HEADER */}
            <button
              onClick={() => setShowTable(!showTable)}
              className="w-full p-4 sm:p-5 flex items-center justify-between bg-gradient-to-r from-slate-50 via-sky-50/30 to-white hover:bg-sky-50/70 transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold shadow-2xs group-hover:bg-sky-600 group-hover:text-white transition-all">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 font-headline flex items-center gap-2">
                    Daftar Satuan Pendidikan ({currentCategory.name})
                    <span className="text-xs font-black text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200">
                      {filteredItems.length} Sekolah
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {showTable ? 'Klik untuk menyembunyikan rincian tabel sekolah' : 'Klik untuk menampilkan rincian tabel 128 sekolah terdaftar'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-sky-700 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200 group-hover:bg-sky-600 group-hover:text-white transition-all hidden sm:inline-block">
                  {showTable ? 'Sembunyikan Tabel' : 'Tampilkan Tabel'}
                </span>
                <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 transition-transform duration-300 ${showTable ? 'rotate-180 bg-sky-600 text-white' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </button>

            {/* EXPANDABLE TABLE CONTENT */}
            <AnimatePresence>
              {showTable && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="p-5 sm:p-6 border-t border-slate-200 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                    <p className="text-xs text-slate-500 font-medium">Menampilkan {filteredItems.length} sekolah terdaftar (Gunakan pencarian untuk memfilter data)</p>

                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Cari sekolah / NPSN..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 w-48 sm:w-64"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase tracking-wider text-[10px] border-b border-slate-200">
                        <tr>
                          <th className="p-3 text-center w-12">No</th>
                          <th className="p-3">Jenjang</th>
                          <th className="p-3">NPSN</th>
                          <th className="p-3">Nama Satuan Pendidikan</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-center">Guru</th>
                          <th className="p-3 text-center">Tendik</th>
                          <th className="p-3 text-center">Total PTK</th>
                          <th className="p-3 text-right">Peserta Didik</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-medium">
                        {filteredItems.length > 0 ? (
                          filteredItems.map((item, idx) => (
                            <tr key={`${item.npsn}-${idx}`} className="hover:bg-sky-50/50 transition-colors">
                              <td className="p-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-100 text-slate-800 border border-slate-200">
                                  {item.jenjang}
                                </span>
                              </td>
                              <td className="p-3 font-mono text-slate-500">{item.npsn}</td>
                              <td className="p-3 font-bold text-slate-900">{item.nama}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  item.status === 'Negeri' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="p-3 text-center font-bold text-teal-700">{item.guru}</td>
                              <td className="p-3 text-center font-bold text-amber-700">{item.tendik}</td>
                              <td className="p-3 text-center font-black text-slate-900">{item.totalPtk}</td>
                              <td className="p-3 text-right font-black text-sky-700 font-headline">
                                {item.siswa.toLocaleString('id-ID')}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={9} className="p-8 text-center text-slate-400 font-medium">
                              Tidak ada data sekolah yang cocok dengan pencarian &quot;{searchQuery}&quot;.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </motion.div>
      </AnimatePresence>

    </section>
  );
}

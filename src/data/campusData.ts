/**
 * ============================================================================
 * DATA KAMPUS INSTIKI — SESUAI DENAH RESMI KAMPUS (GEDUNG 1–6 & FASILITAS)
 * Jl. Tukad Pakerisan No. 97, Panjer, Denpasar
 * ============================================================================
 * Logika Kode Ruang INSTIKI:
 *   Digit 1 = Nomor Gedung (1–6)
 *   Digit 2 = Nomor Lantai (1–5)
 *   Contoh  : R.541 = Gedung 5, Lantai 4 (Lab DKV)
 *             R.422 = Gedung 4, Lantai 2 (Mushola)
 *             R.213 = Gedung 2, Lantai 1 (Ruang BAAK)
 */

export type BuildingId = 'G1' | 'G2' | 'G3' | 'G4' | 'G5' | 'G6' | 'OUTDOOR';

export type RoomCategory =
  | 'Layanan & Info'
  | 'Laboratorium'
  | 'Ruang Kelas'
  | 'Area Ibadah'
  | 'Pimpinan & Kantor'
  | 'Fasilitas';

export interface StartPoint {
  id: string;
  name: string;
  shortName: string;
  vehicleType: 'Motor' | 'Mobil' | 'Pejalan Kaki';
  x: number;
  y: number;
  desc: string;
}

export interface RoomItem {
  id: string;
  code: string;
  name: string;
  cat: RoomCategory;
  desc: string;
  buildingId: BuildingId;
  buildingName: string;
  floor: number;
  floorLabel: string;
  x: number;
  y: number;
}

export interface BuildingFloor {
  floor: number;
  label: string;
  rooms: Omit<RoomItem, 'id' | 'buildingId' | 'buildingName' | 'floor' | 'floorLabel' | 'x' | 'y'>[];
}

export interface BuildingInfo {
  id: Exclude<BuildingId, 'OUTDOOR'>;
  name: string;
  subtitle: string;
  quickTag: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  floors: BuildingFloor[];
}

export interface OutdoorFacility {
  id: string;
  name: string;
  code: string;
  cat: RoomCategory;
  x: number;
  y: number;
  w: number;
  h: number;
  desc: string;
}

export interface CourseSchedule {
  id: string;
  code: string;
  name: string;
  lecturer: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  startTime: string;
  endTime: string;
  roomId: string;
  classCode: string;
  prodi: 'TI' | 'DKV' | 'BD' | 'SK';
  isUpcoming?: boolean;
}

export interface StudentProfile {
  id: string;
  name: string;
  nim: string;
  role: 'aktif' | 'maba' | 'tamu';
  prodi: 'TI' | 'DKV' | 'Umum';
  prodiLabel: string;
  defaultStartId: string;
  isGuest?: boolean;
}

export const STUDENT_PROFILES: StudentProfile[] = [
  {
    id: 'mhs-ti',
    name: 'I Made Aditya (TI)',
    nim: '2301010042',
    role: 'aktif',
    prodi: 'TI',
    prodiLabel: 'Mahasiswa Aktif • Teknik Informatika',
    defaultStartId: 'parkir_depan',
  },
  {
    id: 'mhs-dkv',
    name: 'Ni Luh Sari (DKV)',
    nim: '2402020118',
    role: 'aktif',
    prodi: 'DKV',
    prodiLabel: 'Mahasiswa Aktif • Desain Komunikasi Visual',
    defaultStartId: 'parkir_belakang',
  },
  {
    id: 'maba',
    name: 'Mahasiswa Baru (Maba)',
    nim: 'Orientasi Kampus',
    role: 'maba',
    prodi: 'Umum',
    prodiLabel: 'Mahasiswa Baru • Akses Semua Gedung',
    defaultStartId: 'parkir_depan',
    isGuest: true,
  },
  {
    id: 'tamu',
    name: 'Tamu / Pengunjung',
    nim: 'Mode Pengunjung',
    role: 'tamu',
    prodi: 'Umum',
    prodiLabel: 'Tamu Kampus • Front Office & Layanan',
    defaultStartId: 'gerbang',
    isGuest: true,
  },
];

export const START_POINTS: StartPoint[] = [
  {
    id: 'parkir_depan',
    name: 'Parkir Depan',
    shortName: 'Parkir Depan (Motor)',
    vehicleType: 'Motor',
    x: 92,
    y: 375,
    desc: 'Area parkir motor depan dekat Patung Garuda & Gedung 1',
  },
  {
    id: 'parkir_belakang',
    name: 'Parkir Belakang',
    shortName: 'Parkir Belakang',
    vehicleType: 'Motor',
    x: 118,
    y: 38,
    desc: 'Area parkir belakang dekat Jalan Keluar & Gedung 5',
  },
  {
    id: 'gerbang',
    name: 'Gerbang / Garuda',
    shortName: 'Patung Garuda (Masuk)',
    vehicleType: 'Pejalan Kaki',
    x: 120,
    y: 418,
    desc: 'Titik kedatangan di gerbang utama Jl. Tukad Pakerisan No. 97',
  },
];

export const BUILDINGS: BuildingInfo[] = [
  {
    id: 'G1',
    name: 'Gedung 1',
    subtitle: 'Pusat Layanan, Perpustakaan & Lab A–C',
    quickTag: 'Front Office',
    x: 68,
    y: 312,
    w: 62,
    h: 46,
    color: '#be123c',
    floors: [
      {
        floor: 1,
        label: 'Lantai 1 (11x)',
        rooms: [
          {
            code: 'FRONT OFFICE',
            name: 'Front Office',
            cat: 'Layanan & Info',
            desc: 'Pusat informasi utama & layanan tamu di Gedung 1 Lantai 1.',
          },
          {
            code: 'ADM. KEUANGAN',
            name: 'Administrasi Keuangan',
            cat: 'Layanan & Info',
            desc: 'Loket pembayaran UKT & administrasi keuangan mahasiswa.',
          },
          {
            code: 'R.111',
            name: 'Lab MCL (R.111)',
            cat: 'Laboratorium',
            desc: 'Laboratorium Multimedia & Creative Learning.',
          },
          {
            code: 'R.112',
            name: 'Lab A (R.112)',
            cat: 'Laboratorium',
            desc: 'Laboratorium Komputer A untuk praktikum pemrograman.',
          },
          {
            code: 'R.113',
            name: 'Lab B (R.113)',
            cat: 'Laboratorium',
            desc: 'Laboratorium Komputer B.',
          },
        ],
      },
      {
        floor: 2,
        label: 'Lantai 2 (12x)',
        rooms: [
          {
            code: 'R.121',
            name: 'Ruang BK (R.121)',
            cat: 'Layanan & Info',
            desc: 'Ruang Bimbingan Konseling mahasiswa.',
          },
          {
            code: 'R.122',
            name: 'Ruang Kelas 122',
            cat: 'Ruang Kelas',
            desc: 'Ruang perkuliahan teori Gedung 1 Lt. 2 (122–124).',
          },
          {
            code: 'R.123',
            name: 'Ruang Kelas 123',
            cat: 'Ruang Kelas',
            desc: 'Ruang perkuliahan teori Gedung 1 Lt. 2.',
          },
          {
            code: 'R.124',
            name: 'Ruang Kelas 124',
            cat: 'Ruang Kelas',
            desc: 'Ruang perkuliahan teori Gedung 1 Lt. 2.',
          },
          {
            code: 'R.125',
            name: 'Lab C (R.125)',
            cat: 'Laboratorium',
            desc: 'Laboratorium Komputer C.',
          },
        ],
      },
      {
        floor: 3,
        label: 'Lantai 3 (13x)',
        rooms: [
          {
            code: 'R.131',
            name: 'Lab Legasi (R.131)',
            cat: 'Laboratorium',
            desc: 'Laboratorium Riset & Legasi.',
          },
          {
            code: 'R.132',
            name: 'Perpustakaan (R.132)',
            cat: 'Fasilitas',
            desc: 'Perpustakaan Kampus INSTIKI & ruang baca.',
          },
        ],
      },
    ],
  },
  {
    id: 'G2',
    name: 'Gedung 2',
    subtitle: 'BAAK, Prodi, Dekanat, Aula & Rooftop',
    quickTag: 'R. BAAK & Prodi',
    x: 68,
    y: 252,
    w: 62,
    h: 46,
    color: '#0369a1',
    floors: [
      {
        floor: 1,
        label: 'Lantai 1 (21x)',
        rooms: [
          {
            code: 'R.212',
            name: 'R. WR. III (212)',
            cat: 'Pimpinan & Kantor',
            desc: 'Ruang Wakil Rektor III Bidang Kemahasiswaan.',
          },
          {
            code: 'R.213',
            name: 'R. BAAK / BAKK (213)',
            cat: 'Layanan & Info',
            desc: 'Biro Administrasi Akademik & Kemahasiswaan (Pusat Informasi).',
          },
          {
            code: 'R.214',
            name: 'R. Prodi (214)',
            cat: 'Pimpinan & Kantor',
            desc: 'Ruang Program Studi (TI, SK, DKV, Bisnis Digital).',
          },
          {
            code: 'R.215',
            name: 'R. Dekan (215)',
            cat: 'Pimpinan & Kantor',
            desc: 'Ruang Dekan Fakultas.',
          },
          {
            code: 'R.218',
            name: 'R. WR. I (218)',
            cat: 'Pimpinan & Kantor',
            desc: 'Ruang Wakil Rektor I Bidang Akademik.',
          },
        ],
      },
      {
        floor: 2,
        label: 'Lantai 2 (22x)',
        rooms: [
          {
            code: 'R.221',
            name: 'R. Transit Dosen & Lab D (221)',
            cat: 'Pimpinan & Kantor',
            desc: 'Ruang Transit Dosen & Laboratorium D.',
          },
          {
            code: 'R.222',
            name: 'Lab DPM (222)',
            cat: 'Laboratorium',
            desc: 'Laboratorium DPM.',
          },
          {
            code: 'R.223-224',
            name: 'Lab Sertifikasi (223, 224)',
            cat: 'Laboratorium',
            desc: 'Ruang uji kompetensi & sertifikasi profesi.',
          },
          {
            code: 'R.225',
            name: 'R. Marketing (225)',
            cat: 'Pimpinan & Kantor',
            desc: 'Ruang Marketing & Admisi.',
          },
        ],
      },
      {
        floor: 3,
        label: 'Lantai 3 (23x)',
        rooms: [
          {
            code: 'R.231',
            name: 'Aula INSTIKI (231)',
            cat: 'Fasilitas',
            desc: 'Aula utama untuk seminar, yudisium, dan acara kampus.',
          },
          {
            code: 'R.221-241',
            name: 'R. Kelas (221–241)',
            cat: 'Ruang Kelas',
            desc: 'Deretan ruang kelas Gedung 2.',
          },
        ],
      },
      {
        floor: 4,
        label: 'Rooftop / Lt. 4 (24x)',
        rooms: [
          {
            code: 'R.241',
            name: 'Rooftop & Area Ibadah (241)',
            cat: 'Area Ibadah',
            desc: 'Pura / Area Ibadah di Rooftop Gedung 2.',
          },
        ],
      },
    ],
  },
  {
    id: 'G3',
    name: 'Gedung 3',
    subtitle: 'Rektorat, Ruang Dosen, Studio & Kelas',
    quickTag: 'R. Dosen & Rektor',
    x: 68,
    y: 192,
    w: 62,
    h: 46,
    color: '#4338ca',
    floors: [
      {
        floor: 1,
        label: 'Lantai 1 (31x)',
        rooms: [
          {
            code: 'R.311',
            name: 'R. Rektor (311)',
            cat: 'Pimpinan & Kantor',
            desc: 'Ruang Rektor INSTIKI.',
          },
          {
            code: 'R.312',
            name: 'R. Rapat I (312)',
            cat: 'Pimpinan & Kantor',
            desc: 'Ruang Rapat Pimpinan I.',
          },
          {
            code: 'R.313',
            name: 'R. Dosen (313)',
            cat: 'Pimpinan & Kantor',
            desc: 'Ruang Dosen Utama untuk bimbingan & konsultasi.',
          },
          {
            code: 'R.314',
            name: 'R. WR IV (314)',
            cat: 'Pimpinan & Kantor',
            desc: 'Ruang Wakil Rektor IV.',
          },
          {
            code: 'R.315',
            name: 'R. Rapat II (315)',
            cat: 'Pimpinan & Kantor',
            desc: 'Ruang Rapat II.',
          },
          {
            code: 'R.316',
            name: 'R. WR II (316)',
            cat: 'Pimpinan & Kantor',
            desc: 'Ruang Wakil Rektor II.',
          },
          {
            code: 'R.317',
            name: 'R. Teknisi (317)',
            cat: 'Layanan & Info',
            desc: 'Ruang Teknisi IT & Pemeliharaan.',
          },
        ],
      },
      {
        floor: 2,
        label: 'Lantai 2 (32x)',
        rooms: [
          {
            code: 'R.321',
            name: 'R. Studio I (321)',
            cat: 'Laboratorium',
            desc: 'Studio Desain / Multimedia I.',
          },
          {
            code: 'R.322',
            name: 'R. Studio II (322)',
            cat: 'Laboratorium',
            desc: 'Studio Desain / Multimedia II.',
          },
          {
            code: 'PAMERAN',
            name: 'Area Pameran',
            cat: 'Fasilitas',
            desc: 'Area pameran karya mahasiswa.',
          },
          {
            code: 'R.323-329',
            name: 'R. Kelas (323–329)',
            cat: 'Ruang Kelas',
            desc: 'Ruang perkuliahan Gedung 3 Lantai 2.',
          },
        ],
      },
      {
        floor: 3,
        label: 'Lantai 3 (33x)',
        rooms: [
          {
            code: 'R.331-339',
            name: 'R. Kelas (331–339)',
            cat: 'Ruang Kelas',
            desc: 'Ruang perkuliahan Gedung 3 Lantai 3.',
          },
        ],
      },
      {
        floor: 4,
        label: 'Lantai 4 (34x)',
        rooms: [
          {
            code: 'R.341-344',
            name: 'R. Kelas (341–344)',
            cat: 'Ruang Kelas',
            desc: 'Ruang perkuliahan Gedung 3 Lantai 4.',
          },
        ],
      },
    ],
  },
  {
    id: 'G6',
    name: 'Gedung 6',
    subtitle: 'Cafetaria, Lab Android, Lab H & Lab I',
    quickTag: 'Lab H & Lab I',
    x: 68,
    y: 128,
    w: 62,
    h: 48,
    color: '#0f766e',
    floors: [
      {
        floor: 1,
        label: 'Lantai 1 (61x)',
        rooms: [
          {
            code: 'KANTIN-G6',
            name: 'Kantin / Cafetaria Gedung 6',
            cat: 'Fasilitas',
            desc: 'Area kantin & cafetaria di lantai dasar Gedung 6.',
          },
          {
            code: 'R.611-614',
            name: 'R. Kelas Dasar (61x)',
            cat: 'Ruang Kelas',
            desc: 'Ruang kelas lantai dasar Gedung 6.',
          },
        ],
      },
      {
        floor: 2,
        label: 'Lantai 2 (62x)',
        rooms: [
          {
            code: 'R.621',
            name: 'Lab Android (621)',
            cat: 'Laboratorium',
            desc: 'Laboratorium Pemrograman Mobile & Android.',
          },
          {
            code: 'R.623',
            name: 'Lab H (623)',
            cat: 'Laboratorium',
            desc: 'Laboratorium Komputer H.',
          },
          {
            code: 'R.622-624',
            name: 'R. Kelas (621–624)',
            cat: 'Ruang Kelas',
            desc: 'Ruang kelas Gedung 6 Lantai 2.',
          },
        ],
      },
      {
        floor: 3,
        label: 'Lantai 3 (63x)',
        rooms: [
          {
            code: 'R.632',
            name: 'Lab I (632)',
            cat: 'Laboratorium',
            desc: 'Laboratorium Komputer I.',
          },
          {
            code: 'R.631',
            name: 'R. Kelas (631)',
            cat: 'Ruang Kelas',
            desc: 'Ruang kelas Gedung 6 Lantai 3.',
          },
        ],
      },
    ],
  },
  {
    id: 'G5',
    name: 'Gedung 5',
    subtitle: 'Lab G, Lab Jaringan, Lab DKV & R. Gym',
    quickTag: 'Lab DKV & Jaringan',
    x: 68,
    y: 66,
    w: 62,
    h: 48,
    color: '#b45309',
    floors: [
      {
        floor: 1,
        label: 'Lantai 1 (51x)',
        rooms: [
          {
            code: 'R.511-514',
            name: 'R. Kelas (511–514)',
            cat: 'Ruang Kelas',
            desc: 'Ruang kelas Gedung 5 Lantai 1.',
          },
        ],
      },
      {
        floor: 2,
        label: 'Lantai 2 (52x)',
        rooms: [
          {
            code: 'R.524',
            name: 'Lab G (524)',
            cat: 'Laboratorium',
            desc: 'Laboratorium Komputer G.',
          },
          {
            code: 'R.521-523',
            name: 'R. Kelas (521–523)',
            cat: 'Ruang Kelas',
            desc: 'Ruang kelas Gedung 5 Lantai 2.',
          },
        ],
      },
      {
        floor: 3,
        label: 'Lantai 3 (53x)',
        rooms: [
          {
            code: 'R.534',
            name: 'Lab Jaringan (534)',
            cat: 'Laboratorium',
            desc: 'Laboratorium Jaringan Komputer & Infrastruktur.',
          },
          {
            code: 'R.531-533',
            name: 'R. Kelas (531–533)',
            cat: 'Ruang Kelas',
            desc: 'Ruang kelas Gedung 5 Lantai 3.',
          },
        ],
      },
      {
        floor: 4,
        label: 'Lantai 4 (54x)',
        rooms: [
          {
            code: 'R.541',
            name: 'Lab DKV (541)',
            cat: 'Laboratorium',
            desc: 'Laboratorium Desain Komunikasi Visual.',
          },
          {
            code: 'R.542',
            name: 'R. Kelas (542)',
            cat: 'Ruang Kelas',
            desc: 'Ruang kelas Gedung 5 Lantai 4.',
          },
        ],
      },
      {
        floor: 5,
        label: 'Lantai 5 (55x)',
        rooms: [
          {
            code: 'R.551',
            name: 'R. Gym (551)',
            cat: 'Fasilitas',
            desc: 'Fasilitas kebugaran / Gym mahasiswa di Lantai 5.',
          },
        ],
      },
    ],
  },
  {
    id: 'G4',
    name: 'Gedung 4',
    subtitle: 'Lab Kendali, BEM, Poliklinik, Mushola, Lab E–F',
    quickTag: 'Gedung 4 & Mushola',
    x: 204,
    y: 158,
    w: 96,
    h: 46,
    color: '#15803d',
    floors: [
      {
        floor: 1,
        label: 'Lantai 1 (41x)',
        rooms: [
          {
            code: 'R.411',
            name: 'Lab Kendali (411)',
            cat: 'Laboratorium',
            desc: 'Laboratorium Sistem Kendali & Elektronika.',
          },
          {
            code: 'R.412-413',
            name: 'R. Kelas (412–413)',
            cat: 'Ruang Kelas',
            desc: 'Ruang kelas Gedung 4 Lantai 1.',
          },
          {
            code: 'R.414',
            name: 'R. BEM (414)',
            cat: 'Fasilitas',
            desc: 'Sekretariat Badan Eksekutif Mahasiswa (BEM).',
          },
          {
            code: 'R.415',
            name: 'R. Poliklinik (415)',
            cat: 'Layanan & Info',
            desc: 'Layanan kesehatan & P3K kampus.',
          },
        ],
      },
      {
        floor: 2,
        label: 'Lantai 2 (42x)',
        rooms: [
          {
            code: 'R.421',
            name: 'R. Inbis (421)',
            cat: 'Fasilitas',
            desc: 'Ruang Inkubator Bisnis Mahasiswa.',
          },
          {
            code: 'R.422',
            name: 'Mushola (422)',
            cat: 'Area Ibadah',
            desc: 'Mushola utama kampus di Gedung 4 Lantai 2.',
          },
          {
            code: 'R.423',
            name: 'R. Kelas (423)',
            cat: 'Ruang Kelas',
            desc: 'Ruang kelas Gedung 4 Lantai 2.',
          },
          {
            code: 'R.424',
            name: 'Lab E (424)',
            cat: 'Laboratorium',
            desc: 'Laboratorium Komputer E.',
          },
          {
            code: 'R.425',
            name: 'Lab F (425)',
            cat: 'Laboratorium',
            desc: 'Laboratorium Komputer F.',
          },
        ],
      },
    ],
  },
];

export const OUTDOOR_FACILITIES: OutdoorFacility[] = [
  {
    id: 'BASKET',
    name: 'Lapangan Basket',
    code: 'LAP-BASKET',
    cat: 'Fasilitas',
    x: 204,
    y: 222,
    w: 96,
    h: 44,
    desc: 'Lapangan basket outdoor di sisi tengah kanan dekat Gedung 4.',
  },
  {
    id: 'PANGGUNG',
    name: 'Panggung Utama',
    code: 'PANGGUNG',
    cat: 'Fasilitas',
    x: 204,
    y: 278,
    w: 96,
    h: 34,
    desc: 'Panggung acara kemahasiswaan di bawah Lapangan Basket.',
  },
  {
    id: 'LOUNGE',
    name: 'Instiki Lounge / Kantin',
    code: 'KANTIN',
    cat: 'Fasilitas',
    x: 204,
    y: 322,
    w: 96,
    h: 38,
    desc: 'Kantin utama & Instiki Lounge di sisi kanan dekat gerbang masuk.',
  },
];

// Flattened directory of every real INSTIKI room + outdoor facility
export const ALL_ROOMS: RoomItem[] = (() => {
  const list: RoomItem[] = [];
  for (const b of BUILDINGS) {
    for (const f of b.floors) {
      for (const r of f.rooms) {
        list.push({
          id: `${b.id}_${r.code}`,
          code: r.code,
          name: r.name,
          cat: r.cat,
          desc: r.desc,
          buildingId: b.id,
          buildingName: b.name,
          floor: f.floor,
          floorLabel: f.label,
          x: b.x + b.w / 2,
          y: b.y + b.h / 2,
        });
      }
    }
  }
  for (const o of OUTDOOR_FACILITIES) {
    list.push({
      id: o.id,
      code: o.code,
      name: o.name,
      cat: o.cat,
      desc: o.desc,
      buildingId: 'OUTDOOR',
      buildingName: 'Area Luar Kampus',
      floor: 1,
      floorLabel: 'Area Terbuka',
      x: o.x + o.w / 2,
      y: o.y + o.h / 2,
    });
  }
  return list;
})();

export function getRoomById(roomId: string): RoomItem | undefined {
  return ALL_ROOMS.find((r) => r.id === roomId);
}

export function getBuildingById(buildingId: string): BuildingInfo | undefined {
  return BUILDINGS.find((b) => b.id === buildingId);
}

export const COURSE_SCHEDULES: CourseSchedule[] = [
  {
    id: 'mk-hci',
    code: 'IF304',
    name: 'Human Computer Interaction',
    lecturer: 'Dr. Desak Made Dwi Utami Putra, S.Si., M.Cs',
    day: 'Senin',
    startTime: '08:00',
    endTime: '10:30',
    roomId: 'G1_R.112',
    classCode: 'TI-A',
    prodi: 'TI',
    isUpcoming: true,
  },
  {
    id: 'mk-android',
    code: 'IF308',
    name: 'Pemrograman Mobile & Android',
    lecturer: 'I Putu Gede Surya, S.Kom., M.T',
    day: 'Senin',
    startTime: '13:00',
    endTime: '15:30',
    roomId: 'G6_R.621',
    classCode: 'TI-A',
    prodi: 'TI',
  },
  {
    id: 'mk-jarkom',
    code: 'IF312',
    name: 'Keamanan Jaringan & Cloud',
    lecturer: 'Made Arya Wijaya, S.T., M.Kom',
    day: 'Selasa',
    startTime: '09:00',
    endTime: '11:30',
    roomId: 'G5_R.534',
    classCode: 'TI-A',
    prodi: 'TI',
  },
  {
    id: 'mk-basdat',
    code: 'IF205',
    name: 'Sistem Basis Data',
    lecturer: 'Dr. Desak Made Dwi Utami Putra, S.Si., M.Cs',
    day: 'Rabu',
    startTime: '10:30',
    endTime: '13:00',
    roomId: 'G4_R.424',
    classCode: 'TI-A',
    prodi: 'TI',
  },
  {
    id: 'mk-algo',
    code: 'IF201',
    name: 'Struktur Data & Algoritma',
    lecturer: 'Kadek Bagus Pratama, M.Cs',
    day: 'Kamis',
    startTime: '08:00',
    endTime: '10:30',
    roomId: 'G3_R.331-339',
    classCode: 'TI-A',
    prodi: 'TI',
  },
  {
    id: 'mk-etika',
    code: 'IF315',
    name: 'Etika Profesi & Bisnis Digital',
    lecturer: 'Ni Wayan Lestari, S.E., M.M',
    day: 'Jumat',
    startTime: '10:00',
    endTime: '12:00',
    roomId: 'G1_R.122',
    classCode: 'TI-A',
    prodi: 'TI',
  },
  // DKV Courses
  {
    id: 'mk-dkv-1',
    code: 'DK201',
    name: 'Tipografi & Desain Komunikasi',
    lecturer: 'I Gusti Ngurah Agung, S.Sn., M.Ds',
    day: 'Senin',
    startTime: '08:30',
    endTime: '11:00',
    roomId: 'G5_R.541',
    classCode: 'DKV-B',
    prodi: 'DKV',
    isUpcoming: true,
  },
  {
    id: 'mk-dkv-2',
    code: 'DK204',
    name: 'Studio Ilustrasi & Multimedia',
    lecturer: 'Putu Indah Permata, M.Ds',
    day: 'Senin',
    startTime: '13:30',
    endTime: '16:00',
    roomId: 'G3_R.321',
    classCode: 'DKV-B',
    prodi: 'DKV',
  },
  {
    id: 'mk-dkv-3',
    code: 'DK209',
    name: 'Seminar Desain & Pameran Karya',
    lecturer: 'Komang Adi Putra, S.Sn., M.Sn',
    day: 'Rabu',
    startTime: '09:00',
    endTime: '11:30',
    roomId: 'G2_R.231',
    classCode: 'DKV-B',
    prodi: 'DKV',
  },
];

/** Landmarks for "Tersesat?" instant re-routing (Prinsip 6: Prevent Errors / Recovery) */
export const RECOVER_LANDMARKS: StartPoint[] = [
  {
    id: 'gerbang',
    name: 'Patung Garuda / Gerbang',
    shortName: 'Patung Garuda (G1)',
    vehicleType: 'Pejalan Kaki',
    x: 120,
    y: 418,
    desc: 'Area Patung Garuda & Gerbang Utama Jl. Tukad Pakerisan',
  },
  {
    id: 'pos_g1',
    name: 'Depan Gedung 1 (Front Office)',
    shortName: 'Depan Gedung 1',
    vehicleType: 'Pejalan Kaki',
    x: 130,
    y: 335,
    desc: 'Selasar jalan utama depan Gedung 1',
  },
  {
    id: 'pos_g2',
    name: 'Depan Gedung 2 (BAAK)',
    shortName: 'Depan Gedung 2',
    vehicleType: 'Pejalan Kaki',
    x: 130,
    y: 275,
    desc: 'Selasar jalan utama depan Gedung 2',
  },
  {
    id: 'pos_lounge',
    name: 'Instiki Lounge / Kantin',
    shortName: 'Instiki Lounge',
    vehicleType: 'Pejalan Kaki',
    x: 204,
    y: 341,
    desc: 'Sisi kanan dekat Instiki Lounge & Panggung Utama',
  },
  {
    id: 'pos_basket',
    name: 'Lapangan Basket',
    shortName: 'Lapangan Basket',
    vehicleType: 'Pejalan Kaki',
    x: 204,
    y: 244,
    desc: 'Area tengah kanan depan Lapangan Basket & Gedung 4',
  },
  {
    id: 'pos_g6',
    name: 'Cafetaria Gedung 6',
    shortName: 'Cafetaria Gedung 6',
    vehicleType: 'Pejalan Kaki',
    x: 130,
    y: 152,
    desc: 'Sisi kiri jalan utama depan Gedung 6',
  },
];

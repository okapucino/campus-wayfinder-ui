export type AppTab = 'home' | 'map' | 'schedule' | 'assistant';

export type MappingGroup = 'A' | 'B' | 'C';

export interface HciInsightItem {
  category: 'Kelompok A: 7 Prinsip HCI' | 'Kelompok B: Desain Interaksi' | 'Kelompok C: Kognisi HCI';
  principle: string;
  application: string;
}

export interface HciMappingRow {
  group: MappingGroup;
  feature: string;
  principle: string;
  reason: string;
}

export const MAPPING_DATA: HciMappingRow[] = [
  // A. 7 PRINSIP DASAR HCI (Pertemuan 1)
  {
    group: 'A',
    feature: 'Selector Profil (TI / DKV / Maba / Tamu) & Mode Ramah Akses',
    principle: 'A1. Know the User',
    reason:
      'Menyesuaikan sapaan, daftar MatKul, saran cepat, dan jalur aksesibilitas sesuai kemampuan serta kebutuhan target pengguna.',
  },
  {
    group: 'A',
    feature: 'Alur 3 Langkah (Parkir → MatKul / Ruangan → Peta G1–G6 & Lantai)',
    principle: 'A2. Understand the Task',
    reason:
      'Fokus pada alur nyata mahasiswa saat tiba di parkiran kampus hingga masuk ke ruang kelas sesuai MatKul tanpa menu berlebihan.',
  },
  {
    group: 'A',
    feature: 'Jadwal Hari Ini, Catatan Spot Parkir & Riwayat Tujuan',
    principle: 'A3. Reduce Memory Load (5–9 STM)',
    reason:
      'Mahasiswa tidak perlu menghafal kode gedung/lantai (G1–G6) atau posisi parkir karena jadwal, riwayat, dan spot parkir tampil ringkas.',
  },
  {
    group: 'A',
    feature: 'Tata Letak 4 Tab, Ikon Lucide & Format Kode Ruang R.xxx',
    principle: 'A4. Strive for Consistency',
    reason:
      'Seluruh kartu MatKul, direktori gedung, dan tombol navigasi memakai pola warna, ikon, dan format kode ruang yang seragam.',
  },
  {
    group: 'A',
    feature: 'Banner Kelas Berikutnya & Modal Konfirmasi (Reset / Hapus Riwayat / Ganti Rute)',
    principle: 'A5. Remind Users',
    reason:
      'Mengingatkan kelas yang segera dimulai serta meminta konfirmasi sebelum menghapus data penting atau menimpa rute aktif.',
  },
  {
    group: 'A',
    feature: 'Tombol Urungkan (Undo) di Toast, Validasi Input & Fitur "Tersesat?"',
    principle: 'A6. Prevent Errors / Reversal of Action',
    reason:
      'Memungkinkan pembatalan instan jika salah menghapus riwayat/catatan parkir, mencegah input kosong, dan re-routing dari patokan terdekat.',
  },
  {
    group: 'A',
    feature: 'Tab Tanya WayFinder (Dialog Bahasa Sehari-hari)',
    principle: 'A7. Naturalness',
    reason:
      'Menjawab pertanyaan lokasi ruang atau MatKul dengan percakapan alami mahasiswa beserta tombol langsung ke rute peta.',
  },

  // B. 5 PRINSIP DESAIN INTERAKSI (Pertemuan 2)
  {
    group: 'B',
    feature: 'Header Asal → Tujuan, Switcher Peta Kampus/Lantai & Stepper',
    principle: 'B1. Visibility',
    reason:
      'Titik awal parkir, gedung tujuan, lantai aktif, dan instruksi langkah berikutnya selalu terlihat jelas di layar.',
  },
  {
    group: 'B',
    feature: 'Toast Notifikasi, Status "Tersimpan", Simulasi Jalan & Badge Tiba',
    principle: 'B2. Feedback',
    reason:
      'Memberikan umpan balik visual seketika setiap aksi dilakukan, termasuk animasi rute & posisi berjalan pada denah.',
  },
  {
    group: 'B',
    feature: 'Filter Lantai Dinamis per Gedung (Lt. 1–5) & Tombol Kirim Disabled',
    principle: 'B3. Constraints',
    reason:
      'Membatasi pilihan tidak valid—misal Gedung 4 hanya mengaktifkan Lantai 1–2 sementara Lantai 3–5 dinonaktifkan otomatis.',
  },
  {
    group: 'B',
    feature: 'Konsistensi Internal (Antar Tab) & Eksternal (Ikon Peta Standar)',
    principle: 'B4. Consistency',
    reason:
      'Menggunakan pola kolom pencarian, pin lokasi, dan tombol arah yang sudah familiar dari aplikasi peta sehari-hari.',
  },
  {
    group: 'B',
    feature: 'Kartu Gedung Interaktif (G1–G6), Bayangan Tombol & Hover State',
    principle: 'B5. Affordance',
    reason:
      'Bentuk gedung pada SVG, tombol berbayang, dan efek hover memberi petunjuk visual jelas bahwa elemen dapat diketuk.',
  },

  // C. 5 PROSES KOGNISI (Pertemuan 3)
  {
    group: 'C',
    feature: 'Pengelompokan Blok Info, Card Border, Spasi & Kontras Tinggi',
    principle: 'C1. Atensi',
    reason:
      'Memisahkan Pusat Informasi, Area Ibadah, Jadwal Hari Ini, dan Ruangan per Gedung agar mata cepat memindai informasi relevan.',
  },
  {
    group: 'C',
    feature: 'Ikon Universal (Motor, Masjid/Pura, Buku, Lab, Basket)',
    principle: 'C2. Persepsi',
    reason:
      'Menggunakan simbol visual akrab sehingga fungsi setiap lokasi langsung dipahami sebelum membaca teks detail.',
  },
  {
    group: 'C',
    feature: 'Autocomplete Pencarian, Chip Kategori & Riwayat Terakhir',
    principle: 'C3. Memori (Recognize > Recall)',
    reason:
      'Pengguna cukup mengenali nama MatKul, kategori ruang, atau riwayat yang muncul daripada mengingat nomor ruang dari nol.',
  },
  {
    group: 'C',
    feature: 'Istilah Kampus INSTIKI (Maba, BAAK, Front Office, Instiki Lounge, R.xxx)',
    principle: 'C4. Kebahasaan',
    reason:
      'Menggunakan kosakata alami mahasiswa INSTIKI Panjer sehingga terasa dekat dan mudah dipahami.',
  },
  {
    group: 'C',
    feature: 'Tombol Panduan (?) Aturan Digit Gedung/Lantai & Empty State Konstruktif',
    principle: 'C5. Metakognisi',
    reason:
      'Membantu pengguna memahami logika kode ruang (Digit 1 = Gedung, Digit 2 = Lantai) dan memberi solusi saat pencarian/jadwal kosong.',
  },
];

export const HCI_INSIGHTS_BY_TAB: Record<
  AppTab,
  { title: string; summary: string; items: HciInsightItem[] }
> = {
  home: {
    title: 'Layar Beranda: Parkiran, Pengingat MatKul & Layanan Cepat',
    summary:
      'Menghubungkan titik parkir (Depan, Belakang, Gerbang/Patung Garuda) dengan jadwal MatKul hari ini serta pintasan Pusat Informasi & Area Ibadah.',
    items: [
      {
        category: 'Kelompok A: 7 Prinsip HCI',
        principle: '03. Reduce Memory Load & 05. Remind Users',
        application:
          'Jadwal MatKul hari ini, banner kelas berikutnya, serta catatan spot parkir (dengan Undo) menjaga beban memori tetap ringan.',
      },
      {
        category: 'Kelompok C: Kognisi HCI',
        principle: 'Atensi & Memori (Recognize > Recall)',
        application:
          'Blok Pusat Informasi (Front Office G1, BAAK G2), Area Ibadah (Mushola G4, Pura G2), dan riwayat dikelompokkan tegas.',
      },
    ],
  },
  map: {
    title: 'Layar Peta Kampus (G1–G6) & Denah Lantai',
    summary:
      'Menampilkan denah resmi INSTIKI (Gedung 1–6, Lapangan Basket, Panggung Utama, Instiki Lounge) beserta Denah Lantai & panduan step-by-step.',
    items: [
      {
        category: 'Kelompok B: Desain Interaksi',
        principle: 'Visibility, Constraints & Feedback',
        application:
          'Switcher Peta Kampus ↔ Denah Lantai menonaktifkan lantai yang tidak ada di gedung terpilih (Constraints), disertai simulasi rute berjalan.',
      },
      {
        category: 'Kelompok A: 7 Prinsip HCI',
        principle: '06. Prevent Errors / Reversal & 01. Know the User',
        application:
          'Mode Ramah Akses (Tanpa Tangga) & tombol "Tersesat?" memungkinkan pemulihan cepat dari patokan sekitar.',
      },
    ],
  },
  schedule: {
    title: 'Layar Jadwal MatKul & Direktori Gedung (G1–G6)',
    summary:
      'Menggabungkan jadwal kuliah per hari dengan direktori seluruh ruang resmi Gedung 1–6 dan Area Luar.',
    items: [
      {
        category: 'Kelompok C: Kognisi HCI',
        principle: 'Atensi (Pengelompokan) & Metakognisi',
        application:
          'Filter per Gedung (G1–G6) & Kategori mempermudah scanning; tab hari Sabtu menarasikan kondisi kosong beserta tombol solusi.',
      },
      {
        category: 'Kelompok A: 7 Prinsip HCI',
        principle: '04. Strive for Consistency',
        application:
          'Badge kode ruang (R.541, R.213, R.422) mengikuti pola seragam Digit 1 = Gedung, Digit 2 = Lantai.',
      },
    ],
  },
  assistant: {
    title: 'Layar Tanya WayFinder (Naturalness)',
    summary:
      'Dialog bahasa alami untuk menanyakan lokasi gedung, lab, mushola, maupun ruang kuliah.',
    items: [
      {
        category: 'Kelompok A: 7 Prinsip HCI',
        principle: '07. Naturalness',
        application:
          'Menjawab pertanyaan santai ("Dimana ruang BAAK?", "Kelas HCI di mana?") lengkap dengan tombol buka rute peta.',
      },
      {
        category: 'Kelompok B: Desain Interaksi',
        principle: 'Constraints',
        application:
          'Tombol Kirim dinonaktifkan saat kolom input kosong untuk mencegah pengiriman pertanyaan kosong.',
      },
    ],
  },
};

export type AppTab = 'home' | 'map' | 'schedule' | 'assistant';

export interface HciInsightItem {
  category: '7 Prinsip HCI (Pert. 1)' | 'Desain Interaksi (Pert. 2)' | 'Kognisi HCI (Pert. 3)';
  principle: string;
  application: string;
}

export const HCI_INSIGHTS_BY_TAB: Record<AppTab, { title: string; summary: string; items: HciInsightItem[] }> = {
  home: {
    title: 'Layar Beranda & Pemilihan Parkiran/MatKul',
    summary:
      'Dirancang agar mahasiswa yang baru turun dari kendaraan di parkiran langsung melihat titik awal dan kelas terdekat tanpa harus mengingat kode ruangan.',
    items: [
      {
        category: '7 Prinsip HCI (Pert. 1)',
        principle: '03. Reduce Memory Load (5–9 STM)',
        application:
          'Jadwal hari ini otomatis muncul dalam kartu ringkas (Jam, MatKul, Ruangan, Lantai) sehingga mahasiswa tidak perlu menghafal kode ruang.',
      },
      {
        category: '7 Prinsip HCI (Pert. 1)',
        principle: '05. Remind Users & Refresh Memory',
        application:
          'Banner pengingat kelas berikutnya & kartu "Lokasi Parkir Tersimpan" menyegarkan memori pengguna saat terburu-buru.',
      },
      {
        category: 'Desain Interaksi (Pert. 2)',
        principle: 'Visibility & Affordance',
        application:
          'Tombol aksi utama "Arahkan ke Kelas" dan pilihan 3 area parkiran dibuat kontras dan tampak jelas dapat diketuk.',
      },
      {
        category: 'Kognisi HCI (Pert. 3)',
        principle: 'Atensi & Memori (Recognize > Recall)',
        application:
          'Pengelompokan kartu jadwal dengan border/spasi tegas + daftar "Riwayat Terakhir" agar pengguna cukup mengenali tujuan.',
      },
    ],
  },
  map: {
    title: 'Layar Peta 2D Multi-Lantai & Panduan Langkah',
    summary:
      'Menghubungkan titik parkiran ke ruang kelas secara visual lewat denah 2D interaktif per lantai dan instruksi turn-by-turn yang alami.',
    items: [
      {
        category: '7 Prinsip HCI (Pert. 1)',
        principle: '01. Know the User & Aksesibilitas',
        application:
          'Tersedia toggle "Rute Lift (Tanpa Tangga)" yang otomatis menghitung ulang jalur melewati Lift Kampus.',
      },
      {
        category: '7 Prinsip HCI (Pert. 1)',
        principle: '06. Prevent Errors / Reversal of Action',
        application:
          'Fitur "Tersesat? Pilih Patokan Terdekat" memungkinkan pengguna melakukan re-routing cepat tanpa mengulang dari awal.',
      },
      {
        category: 'Desain Interaksi (Pert. 2)',
        principle: 'Feedback & Constraints',
        application:
          'Animasi garis rute, titik posisi berjalan, perpindahan tab lantai otomatis, serta status "Tiba di Tujuan" memberi feedback langsung.',
      },
      {
        category: 'Kognisi HCI (Pert. 3)',
        principle: 'Persepsi & Kebahasaan',
        application:
          'Ikon universal (parkir, tangga, lift, pin tujuan) dipadukan dengan patokan nyata seperti "Sebelah Lobi Utama" atau "Dekat Kantin".',
      },
    ],
  },
  schedule: {
    title: 'Layar Jadwal Kuliah & Direktori Ruangan',
    summary:
      'Menyajikan daftar mata kuliah Senin–Jumat serta direktori seluruh ruangan kampus yang dikelompokkan berdasarkan hari dan lantai.',
    items: [
      {
        category: 'Kognisi HCI (Pert. 3)',
        principle: 'Atensi (Pengelompokan & Keterbacaan)',
        application:
          'Data jadwal dan ruangan dikelompokkan per Hari / per Lantai dengan kontras tinggi (mirip contoh tabel terstruktur di Slide Pertemuan 3).',
      },
      {
        category: 'Kognisi HCI (Pert. 3)',
        principle: 'Metakognisi pada Empty State',
        application:
          'Saat pencarian tidak ditemukan atau hari libur (Sabtu), sistem menarasikan kondisi dan menawarkan tombol solusi langsung ("Lihat Semua Ruangan").',
      },
      {
        category: '7 Prinsip HCI (Pert. 1)',
        principle: '04. Strive for Consistency',
        application:
          'Setiap kartu ruangan memakai badge lantai dan tombol navigasi dengan posisi serta warna yang konsisten.',
      },
    ],
  },
  assistant: {
    title: 'Layar Tanya Cepat (Natural Language WayFinder)',
    summary:
      'Terinspirasi langsung dari Slide 23 Pertemuan 1 tentang prinsip Naturalness: dialog berbasis bahasa alami untuk menanyakan lokasi kelas.',
    items: [
      {
        category: '7 Prinsip HCI (Pert. 1)',
        principle: '07. Naturalness (Interaksi Alami)',
        application:
          'Pengguna dapat bertanya dengan bahasa sehari-hari ("Kelas HCI di mana?", "Parkir terdekat ke R.302?") dan langsung mendapat tombol rute.',
      },
      {
        category: 'Kognisi HCI (Pert. 3)',
        principle: 'Kebahasaan sesuai Target Pengguna',
        application:
          'Gaya bahasa santai, ringkas, dan jelas disesuaikan dengan karakter mahasiswa INSTIKI.',
      },
      {
        category: 'Desain Interaksi (Pert. 2)',
        principle: 'Efisiensi & Utility',
        application:
          'Chip pertanyaan cepat mengurangi ketikan manual dan langsung menghubungkan jawaban ke peta navigasi.',
      },
    ],
  },
};

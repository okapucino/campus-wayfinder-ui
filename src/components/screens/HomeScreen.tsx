import React, { useState } from 'react';
import {
  ALL_ROOMS,
  COURSE_SCHEDULES,
  CourseSchedule,
  START_POINTS,
  STUDENT_PROFILES,
  StudentProfile,
  getRoomById,
} from '../../data/campusData';
import { InstikiLogo } from '../InstikiLogo';
import {
  Accessibility,
  ArrowRight,
  Bell,
  Bike,
  CheckCircle2,
  ChevronRight,
  Clock,
  History,
  Info,
  MapPin,
  Search,
  Sparkles,
  X,
} from 'lucide-react';

interface HomeScreenProps {
  profile: StudentProfile;
  onChangeProfile: (p: StudentProfile) => void;
  selectedStartId: string;
  onSelectStart: (startId: string) => void;
  parkingNote: string;
  onSaveParkingNote: (newNote: string) => boolean;
  accessibleOnly: boolean;
  onToggleAccessible: () => void;
  recentRoomIds: string[];
  onConfirmClearHistory: () => void;
  onStartRouteToRoom: (roomId: string, course?: CourseSchedule) => void;
  onOpenAssistant: (presetQuery?: string) => void;
  onOpenSchedule: () => void;
  onOpenCampusMap: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  onChangeProfile,
  selectedStartId,
  onSelectStart,
  parkingNote,
  onSaveParkingNote,
  accessibleOnly,
  onToggleAccessible,
  recentRoomIds,
  onConfirmClearHistory,
  onStartRouteToRoom,
  onOpenAssistant,
  onOpenSchedule,
  onOpenCampusMap,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState(false);
  const [tempNote, setTempNote] = useState(parkingNote);

  const activeStart =
    START_POINTS.find((p) => p.id === selectedStartId) ?? START_POINTS[0];

  const myCourses = profile.isGuest
    ? COURSE_SCHEDULES
    : COURSE_SCHEDULES.filter((c) => c.prodi === profile.prodi);

  const todayCourses = myCourses.filter((c) => c.day === 'Senin');
  const upcomingCourse = todayCourses.find((c) => c.isUpcoming) ?? todayCourses[0];
  const upcomingRoom = upcomingCourse ? getRoomById(upcomingCourse.roomId) : undefined;

  const q = searchQuery.trim().toLowerCase();
  const matchedCourses = q
    ? COURSE_SCHEDULES.filter((c) => {
        const rm = getRoomById(c.roomId);
        return (
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.lecturer.toLowerCase().includes(q) ||
          (rm?.name.toLowerCase().includes(q) ?? false) ||
          (rm?.code.toLowerCase().includes(q) ?? false)
        );
      }).slice(0, 4)
    : [];

  const matchedRooms = q
    ? ALL_ROOMS.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.code.toLowerCase().includes(q) ||
          r.buildingName.toLowerCase().includes(q)
      ).slice(0, 5)
    : [];

  const roleGreeting = {
    maba: 'Selamat datang Maba! Mulai dari Front Office (G1) atau Ruang BAAK (G2).',
    aktif: `Om Swastyastu, ${profile.name.split(' ')[0]}! Cek rute dari parkiran ke ruang kelasmu.`,
    tamu: 'Selamat datang di Kampus INSTIKI. Pusat Informasi ada di Gedung 1 Lt. 1.',
  }[profile.role];

  return (
    <div className="space-y-3.5 pb-5">
      {/* Top Hero Header (INSTIKI Navy + Official Logo) */}
      <div className="bg-gradient-to-br from-[#141E46] via-[#1A2352] to-[#26347A] text-white px-4 pt-3 pb-4 rounded-b-3xl shadow-md">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="bg-white rounded-lg px-1.5 py-1 shadow-xs flex items-center justify-center shrink-0">
              <InstikiLogo variant="mark" />
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-sm tracking-tight block truncate">
                INSTIKI WayFinder
              </span>
              <span className="text-[10px] text-slate-300 block truncate">
                Parkiran ➔ Gedung 1–6 & Ruang Kelas
              </span>
            </div>
          </div>

          <select
            aria-label="Pilih Profil Pengguna"
            value={profile.id}
            onChange={(e) => {
              const found = STUDENT_PROFILES.find((p) => p.id === e.target.value);
              if (found) onChangeProfile(found);
            }}
            className="bg-white/15 hover:bg-white/20 text-white text-[11px] font-semibold px-2 py-1.5 rounded-xl border border-white/20 outline-none cursor-pointer max-w-[135px] truncate"
          >
            {STUDENT_PROFILES.map((p) => (
              <option key={p.id} value={p.id} className="text-slate-900">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Role Greeting + Accessibility Quick Toggle */}
        <div className="flex items-center justify-between gap-2 mb-3 bg-white/10 border border-white/15 rounded-xl px-2.5 py-2">
          <p className="text-[11px] text-slate-100 leading-snug">{roleGreeting}</p>
          <button
            type="button"
            onClick={onToggleAccessible}
            className={`shrink-0 px-2 py-1 rounded-lg text-[10px] font-extrabold border inline-flex items-center gap-1 transition cursor-pointer ${
              accessibleOnly
                ? 'bg-emerald-500 text-white border-emerald-400'
                : 'bg-white/15 text-slate-100 border-white/25 hover:bg-white/25'
            }`}
          >
            <Accessibility className="w-3 h-3" />
            <span>{accessibleOnly ? 'Ramah Akses ON' : 'Ramah Akses'}</span>
          </button>
        </div>

        {/* Quick Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari MatKul atau ruang (R.541, Lab DKV, BAAK, Mushola)..."
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs font-medium shadow-sm outline-none focus:ring-2 focus:ring-amber-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Hapus pencarian"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Live Search Dropdown Results */}
      {q && (
        <div className="px-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Hasil Pencarian ({matchedCourses.length + matchedRooms.length})
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[11px] text-red-600 font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>

            {matchedCourses.length === 0 && matchedRooms.length === 0 ? (
              <div className="py-3 text-center space-y-2">
                <p className="text-xs font-bold text-slate-700">
                  Ruangan atau MatKul "{searchQuery}" tidak ditemukan di denah G1–G6.
                </p>
                <p className="text-[11px] text-slate-500">
                  Coba cari kode ruang seperti "R.541", "R.213", "Lab A", atau "Mushola".
                </p>
                <button
                  type="button"
                  onClick={onOpenSchedule}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-[#1A2352] px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  Lihat Direktori Gedung G1–G6
                </button>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-56 overflow-y-auto phone-scroll">
                {matchedCourses.map((c) => {
                  const r = getRoomById(c.roomId);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        onStartRouteToRoom(c.roomId, c);
                        setSearchQuery('');
                      }}
                      className="w-full text-left flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200/80 transition cursor-pointer"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{c.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {r?.name} ({r?.buildingName}, {r?.floorLabel}) • {c.day}
                        </p>
                      </div>
                      <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-red-600">
                        Rute <ArrowRight className="w-3 h-3" />
                      </span>
                    </button>
                  );
                })}
                {matchedRooms.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      onStartRouteToRoom(r.id);
                      setSearchQuery('');
                    }}
                    className="w-full text-left flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 transition cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{r.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {r.buildingName} • {r.floorLabel}
                      </p>
                    </div>
                    <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-[#1A2352]">
                      Rute <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="px-4 space-y-3.5">
        {/* Prinsip 5: Remind Users — Upcoming MatKul Banner */}
        {!profile.isGuest && upcomingCourse && upcomingRoom && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-200/70 px-1.5 py-0.5 rounded">
                  Kelas Berikutnya • 15 Mnt Lagi
                </span>
                <p className="text-xs font-extrabold text-slate-900 mt-1 truncate">
                  {upcomingCourse.name}
                </p>
                <p className="text-[11px] text-slate-600">
                  {upcomingRoom.name} • {upcomingRoom.buildingName} (Lt. {upcomingRoom.floor})
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onStartRouteToRoom(upcomingCourse.roomId, upcomingCourse)}
              className="mt-2.5 w-full py-2 px-3 rounded-xl bg-[#D32F2F] hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <span>Mulai Rute dari {activeStart.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 1. Start Point Selector (Real INSTIKI Parking + Gerbang) */}
        <section aria-labelledby="start-heading" className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 id="start-heading" className="text-xs font-extrabold text-slate-800">
              1. Titik Awal Kamu Sekarang
            </h2>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Tersimpan
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {START_POINTS.map((sp) => {
              const selected = sp.id === selectedStartId;
              return (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => onSelectStart(sp.id)}
                  className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                    selected
                      ? 'bg-[#1A2352] text-white border-[#1A2352] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sp.id === 'gerbang' ? (
                    <MapPin className="w-4 h-4 mx-auto mb-1" />
                  ) : (
                    <Bike className="w-4 h-4 mx-auto mb-1" />
                  )}
                  <div className="text-[10px] font-bold leading-tight">{sp.name}</div>
                </button>
              );
            })}
          </div>

          {/* Inline Parking Note with Validation + Undo Toast */}
          <div className="pt-2 border-t border-slate-100">
            {editingNote ? (
              <form
                className="flex items-center gap-1.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  const ok = onSaveParkingNote(tempNote);
                  if (ok) setEditingNote(false);
                }}
              >
                <input
                  type="text"
                  value={tempNote}
                  onChange={(e) => setTempNote(e.target.value)}
                  placeholder="Contoh: Baris B2 dekat Pos Satpam"
                  className="flex-1 text-[11px] bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#1A2352]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg cursor-pointer"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setEditingNote(false)}
                  className="text-[11px] font-bold bg-slate-200 text-slate-700 px-2 py-1.5 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="text-slate-600 truncate">
                  <strong className="text-slate-800">Catatan Spot:</strong>{' '}
                  {parkingNote || 'Belum ada catatan'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setTempNote(parkingNote);
                    setEditingNote(true);
                  }}
                  className="text-[#D32F2F] font-bold hover:underline shrink-0 cursor-pointer"
                >
                  Ubah
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Pusat Informasi & Area Ibadah (Atensi & Persepsi — from Real Campus Data) */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-2.5">
            <div className="text-[10px] font-extrabold text-blue-800 uppercase flex items-center gap-1 mb-1.5">
              <Info className="w-3.5 h-3.5" /> Pusat Informasi
            </div>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => onStartRouteToRoom('G1_FRONT OFFICE')}
                className="w-full text-left bg-white hover:bg-blue-100/60 border border-blue-100 rounded-lg px-2 py-1.5 text-[11px] font-bold text-slate-800 cursor-pointer flex justify-between"
              >
                <span>Front Office</span>
                <span className="text-blue-700">G1 Lt.1</span>
              </button>
              <button
                type="button"
                onClick={() => onStartRouteToRoom('G2_R.213')}
                className="w-full text-left bg-white hover:bg-blue-100/60 border border-blue-100 rounded-lg px-2 py-1.5 text-[11px] font-bold text-slate-800 cursor-pointer flex justify-between"
              >
                <span>Ruang BAAK</span>
                <span className="text-blue-700">G2 Lt.1</span>
              </button>
            </div>
          </div>

          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-2.5">
            <div className="text-[10px] font-extrabold text-emerald-800 uppercase flex items-center gap-1 mb-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Area Ibadah
            </div>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => onStartRouteToRoom('G4_R.422')}
                className="w-full text-left bg-white hover:bg-emerald-100/60 border border-emerald-100 rounded-lg px-2 py-1.5 text-[11px] font-bold text-slate-800 cursor-pointer flex justify-between"
              >
                <span>Mushola</span>
                <span className="text-emerald-700">G4 Lt.2</span>
              </button>
              <button
                type="button"
                onClick={() => onStartRouteToRoom('G2_R.241')}
                className="w-full text-left bg-white hover:bg-emerald-100/60 border border-emerald-100 rounded-lg px-2 py-1.5 text-[11px] font-bold text-slate-800 cursor-pointer flex justify-between"
              >
                <span>Pura / Rooftop</span>
                <span className="text-emerald-700">G2 Lt.4</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Today's MatKul Schedule Cards (Prinsip 3: Reduce Memory Load) */}
        <section aria-labelledby="today-heading" className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 id="today-heading" className="text-xs font-extrabold text-slate-800">
              2. Jadwal MatKul Hari Ini (Senin)
            </h2>
            <button
              type="button"
              onClick={onOpenSchedule}
              className="text-[11px] font-bold text-[#1A2352] inline-flex items-center gap-0.5 hover:underline cursor-pointer"
            >
              Semua Jadwal <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {todayCourses.slice(0, 3).map((course) => {
              const room = getRoomById(course.roomId);
              return (
                <div
                  key={course.id}
                  className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs hover:border-red-300 transition"
                >
                  <div className="flex items-center justify-between gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {course.code} • {course.classCode}
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-red-50 text-[#D32F2F] border border-red-200">
                      {room?.buildingId} Lt. {room?.floor} • {room?.code}
                    </span>
                  </div>
                  <h3 className="text-xs font-extrabold text-slate-900 mt-1">{course.name}</h3>
                  <p className="text-[11px] text-slate-500 truncate">{course.lecturer}</p>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium min-w-0">
                      <span className="inline-flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {course.startTime}–{course.endTime}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="font-bold text-[#1A2352] truncate">{room?.name}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onStartRouteToRoom(course.roomId, course)}
                      className="shrink-0 inline-flex items-center gap-1 bg-[#1A2352] hover:bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
                    >
                      Arahkan <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Destinations with Clear + Undo */}
        <section className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-amber-600" />
              Riwayat Tujuan Terakhir
            </h2>
            {recentRoomIds.length > 0 && (
              <button
                type="button"
                onClick={onConfirmClearHistory}
                className="text-[10px] font-bold text-red-600 hover:underline cursor-pointer"
              >
                Hapus Semua
              </button>
            )}
          </div>

          {recentRoomIds.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {recentRoomIds.map((rid) => {
                const room = getRoomById(rid);
                if (!room) return null;
                return (
                  <button
                    key={rid}
                    type="button"
                    onClick={() => onStartRouteToRoom(rid)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-red-50 border border-slate-200 text-[11px] font-semibold text-slate-700 hover:text-red-800 cursor-pointer"
                  >
                    <span>{room.code}</span>
                    <span className="text-slate-400">({room.buildingId})</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-[11px] text-slate-400">Belum ada riwayat tujuan.</p>
          )}
        </section>

        {/* Primary CTA: Open Full Campus Map G1-G6 */}
        <button
          type="button"
          onClick={onOpenCampusMap}
          className="w-full py-2.5 px-3 rounded-xl bg-[#D32F2F] hover:bg-red-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition"
        >
          <MapPin className="w-4 h-4" />
          <span>Buka Peta Kampus INSTIKI (Gedung 1–6)</span>
        </button>

        {/* Prinsip 7: Naturalness Quick Ask */}
        <button
          type="button"
          onClick={() => onOpenAssistant('Dimana ruang BAAK?')}
          className="w-full text-left bg-gradient-to-r from-indigo-50 to-sky-50 border border-indigo-200 rounded-2xl p-3 flex items-center justify-between gap-2 hover:border-indigo-300 transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1A2352] text-amber-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Bingung? Tanya WayFinder</p>
              <p className="text-[11px] text-slate-600">
                Contoh: "Dimana ruang BAAK?" atau "Lokasi Lab DKV?"
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  CAMPUS_NODES,
  COURSE_SCHEDULES,
  CourseSchedule,
  PARKING_SPOTS,
  STUDENT_PROFILES,
  StudentProfile,
} from '../../data/campusData';
import { getNodeById } from '../../utils/pathfinder';
import {
  Bell,
  Car,
  Bike,
  Search,
  MapPin,
  ArrowRight,
  Clock,
  History,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  X,
} from 'lucide-react';

interface HomeScreenProps {
  profile: StudentProfile;
  onChangeProfile: (p: StudentProfile) => void;
  selectedParkingId: string;
  onSelectParking: (parkingNodeId: string) => void;
  parkingNote: string;
  onChangeParkingNote: (note: string) => void;
  recentRoomIds: string[];
  onStartRouteToRoom: (roomId: string, course?: CourseSchedule) => void;
  onOpenAssistant: (presetQuery?: string) => void;
  onOpenSchedule: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  onChangeProfile,
  selectedParkingId,
  onSelectParking,
  parkingNote,
  onChangeParkingNote,
  recentRoomIds,
  onStartRouteToRoom,
  onOpenAssistant,
  onOpenSchedule,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState(false);
  const [tempNote, setTempNote] = useState(parkingNote);

  const activeParking =
    PARKING_SPOTS.find((p) => p.nodeId === selectedParkingId) ?? PARKING_SPOTS[0];

  // Filter courses for active profile (or all for Guest/Maba)
  const myCourses = profile.isGuest
    ? COURSE_SCHEDULES
    : COURSE_SCHEDULES.filter((c) => c.prodi === profile.prodi);

  // "Hari ini" simulated as Senin so today's classes are always rich & visible for demo
  const todayCourses = myCourses.filter((c) => c.day === 'Senin');
  const upcomingCourse = todayCourses.find((c) => c.isUpcoming) ?? todayCourses[0];
  const upcomingRoom = upcomingCourse ? getNodeById(upcomingCourse.roomId) : undefined;

  // Quick search across courses + rooms
  const q = searchQuery.trim().toLowerCase();
  const matchedCourses = q
    ? COURSE_SCHEDULES.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.lecturer.toLowerCase().includes(q) ||
          (getNodeById(c.roomId)?.label.toLowerCase().includes(q) ?? false)
      )
    : [];

  const matchedRooms = q
    ? CAMPUS_NODES.filter(
        (n) =>
          (n.kind === 'room' || n.kind === 'facility') &&
          (n.label.toLowerCase().includes(q) ||
            (n.description?.toLowerCase().includes(q) ?? false))
      )
    : [];

  return (
    <div className="space-y-4 pb-5">
      {/* Top Hero Header (INSTIKI Navy) */}
      <div className="bg-gradient-to-br from-[#141E46] via-[#1A2352] to-[#26347A] text-white px-4 pt-3 pb-5 rounded-b-3xl shadow-md">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-[#D32F2F] text-white font-extrabold text-xs shadow-xs">
                IN
              </span>
              <span className="font-extrabold text-sm tracking-tight">INSTIKI WayFinder</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Navigasi Parkiran ➔ Ruang Kelas
            </p>
          </div>

          {/* Profile Switcher Pill (Prinsip 1: Know the User) */}
          <select
            aria-label="Pilih Profil Pengguna"
            value={profile.id}
            onChange={(e) => {
              const found = STUDENT_PROFILES.find((p) => p.id === e.target.value);
              if (found) onChangeProfile(found);
            }}
            className="bg-white/15 hover:bg-white/20 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-xl border border-white/20 outline-none cursor-pointer max-w-[148px] truncate"
          >
            {STUDENT_PROFILES.map((p) => (
              <option key={p.id} value={p.id} className="text-slate-900">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* User Greeting */}
        <div className="mb-3">
          <p className="text-xs text-amber-300 font-semibold">
            Om Swastyastu, {profile.name.split(' ')[0]}!
          </p>
          <p className="text-[11px] text-slate-200">{profile.prodiLabel}</p>
        </div>

        {/* Quick Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari MatKul, kode ruang (Lab 2, R.302), dosen..."
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
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-3 space-y-2.5">
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
                <p className="text-xs font-semibold text-slate-700">
                  Tidak menemukan "{searchQuery}"
                </p>
                <p className="text-[11px] text-slate-500">
                  Coba ketik nama ruangan seperti "Lab 2", "R.302", atau "HCI".
                </p>
                <button
                  type="button"
                  onClick={onOpenSchedule}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-[#1A2352] px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  Lihat Semua Ruangan
                </button>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-56 overflow-y-auto phone-scroll">
                {matchedCourses.map((c) => {
                  const r = getNodeById(c.roomId);
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
                          {r?.label} (Lt. {r?.floor}) • {c.day}, {c.startTime}
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
                      <p className="text-xs font-bold text-slate-900 truncate">{r.label}</p>
                      <p className="text-[11px] text-slate-500 truncate">
                        Lantai {r.floor} • {r.landmark ?? r.description}
                      </p>
                    </div>
                    <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-[#1A2352]">
                      Arahkan <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="px-4 space-y-4">
        {/* Prinsip 5: Remind Users — Next Class Banner */}
        {upcomingCourse && upcomingRoom && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-200/70 px-1.5 py-0.5 rounded">
                    Kelas Berikutnya • 15 Mnt Lagi
                  </span>
                </div>
                <p className="text-xs font-extrabold text-slate-900 mt-1 truncate">
                  {upcomingCourse.name}
                </p>
                <p className="text-[11px] text-slate-600">
                  {upcomingRoom.label} (Lantai {upcomingRoom.floor}) • {upcomingCourse.startTime}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onStartRouteToRoom(upcomingCourse.roomId, upcomingCourse)}
              className="mt-2.5 w-full py-2 px-3 rounded-xl bg-[#D32F2F] hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <span>Mulai Rute dari {activeParking.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Step 1: Pilih / Simpan Lokasi Parkir (Start Point) */}
        <section aria-labelledby="parking-heading" className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 id="parking-heading" className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">
              1. Titik Awal: Lokasi Parkir Kamu
            </h2>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Tersimpan
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {PARKING_SPOTS.map((spot) => {
              const selected = spot.nodeId === selectedParkingId;
              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => onSelectParking(spot.nodeId)}
                  className={`text-left p-2.5 rounded-2xl border transition flex items-center gap-2.5 cursor-pointer ${
                    selected
                      ? 'bg-blue-50/90 border-blue-500 ring-1 ring-blue-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl ${spot.badgeColor} text-white flex items-center justify-center shrink-0`}
                  >
                    {spot.vehicleType === 'Mobil' ? (
                      <Car className="w-4 h-4" />
                    ) : (
                      <Bike className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{spot.name}</p>
                      {selected && (
                        <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                          Aktif
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{spot.areaHint}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Reminder Note for Where User Parked (Prinsip 5: Refresh Memory) */}
          <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
            {editingNote ? (
              <form
                className="flex items-center gap-1.5 w-full"
                onSubmit={(e) => {
                  e.preventDefault();
                  onChangeParkingNote(tempNote);
                  setEditingNote(false);
                }}
              >
                <input
                  type="text"
                  value={tempNote}
                  onChange={(e) => setTempNote(e.target.value)}
                  placeholder="Misal: Baris 2 dekat pohon kamboja"
                  className="flex-1 text-[11px] bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="text-[11px] font-bold bg-[#1A2352] text-white px-2.5 py-1 rounded-lg cursor-pointer"
                >
                  Simpan
                </button>
              </form>
            ) : (
              <>
                <div className="flex items-center gap-1.5 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <p className="text-[11px] text-slate-600 truncate">
                    <span className="font-semibold text-slate-800">Catatan Spot:</span>{' '}
                    {parkingNote || 'Belum ada catatan'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTempNote(parkingNote);
                    setEditingNote(true);
                  }}
                  className="text-[11px] font-bold text-blue-700 hover:underline shrink-0 cursor-pointer"
                >
                  Ubah
                </button>
              </>
            )}
          </div>
        </section>

        {/* Step 2: Jadwal MatKul Hari Ini (Prinsip 3: Reduce Memory Load) */}
        <section aria-labelledby="today-heading" className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 id="today-heading" className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">
              2. Pilih MatKul Hari Ini (Senin)
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
            {todayCourses.map((course) => {
              const room = getNodeById(course.roomId);
              return (
                <div
                  key={course.id}
                  className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs hover:border-red-300 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {course.code} • {course.classCode}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                          Lt. {room?.floor}
                        </span>
                      </div>
                      <h3 className="text-xs font-extrabold text-slate-900 mt-1">
                        {course.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 truncate">{course.lecturer}</p>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {course.startTime}–{course.endTime}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="font-bold text-[#1A2352]">{room?.label}</span>
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

        {/* Recent Destinations (Pertemuan 3: Recognize > Recall) */}
        {recentRoomIds.length > 0 && (
          <section className="space-y-1.5">
            <h2 className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
              <History className="w-3.5 h-3.5" /> Riwayat Tujuan Terakhir
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {recentRoomIds.map((rid) => {
                const room = getNodeById(rid);
                if (!room) return null;
                return (
                  <button
                    key={rid}
                    type="button"
                    onClick={() => onStartRouteToRoom(rid)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-[#1A2352] text-[11px] font-semibold text-slate-700 shadow-2xs cursor-pointer"
                  >
                    <MapPin className="w-3 h-3 text-red-600" />
                    <span>{room.shortLabel ?? room.label}</span>
                    <span className="text-slate-400">(Lt.{room.floor})</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Prinsip 7: Naturalness Quick Ask Card */}
        <button
          type="button"
          onClick={() => onOpenAssistant('Kelas Human Computer Interaction di mana?')}
          className="w-full text-left bg-gradient-to-r from-indigo-50 to-sky-50 border border-indigo-200 rounded-2xl p-3 flex items-center justify-between gap-2 hover:border-indigo-300 transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1A2352] text-amber-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Bingung? Tanya WayFinder</p>
              <p className="text-[11px] text-slate-600">
                Contoh: "Kelas HCI di mana?" atau "Parkir terdekat ke R.302?"
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </button>
      </div>
    </div>
  );
};

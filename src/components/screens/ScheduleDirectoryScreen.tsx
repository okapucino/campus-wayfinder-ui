import React, { useState } from 'react';
import {
  ALL_ROOMS,
  BUILDINGS,
  COURSE_SCHEDULES,
  CourseSchedule,
  RoomCategory,
  StudentProfile,
  getRoomById,
} from '../../data/campusData';
import {
  ArrowRight,
  Building2,
  Calendar,
  Clock,
  Search,
  Sparkles,
} from 'lucide-react';

interface ScheduleDirectoryScreenProps {
  profile: StudentProfile;
  onStartRouteToRoom: (roomId: string, course?: CourseSchedule) => void;
}

const DAYS: CourseSchedule['day'][] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const CATEGORIES: ('Semua' | RoomCategory)[] = [
  'Semua',
  'Layanan & Info',
  'Laboratorium',
  'Ruang Kelas',
  'Area Ibadah',
  'Pimpinan & Kantor',
  'Fasilitas',
];

export const ScheduleDirectoryScreen: React.FC<ScheduleDirectoryScreenProps> = ({
  profile,
  onStartRouteToRoom,
}) => {
  const [subTab, setSubTab] = useState<'schedule' | 'rooms'>('schedule');
  const [selectedDay, setSelectedDay] = useState<string>('Semua');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('Semua');
  const [selectedCat, setSelectedCat] = useState<'Semua' | RoomCategory>('Semua');
  const [filterText, setFilterText] = useState('');

  const myCourses = profile.isGuest
    ? COURSE_SCHEDULES
    : COURSE_SCHEDULES.filter((c) => c.prodi === profile.prodi);

  const q = filterText.trim().toLowerCase();

  const filteredCourses = myCourses.filter((c) => {
    const matchesDay = selectedDay === 'Semua' || c.day === selectedDay;
    const room = getRoomById(c.roomId);
    const matchesText =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      (room?.name.toLowerCase().includes(q) ?? false) ||
      (room?.code.toLowerCase().includes(q) ?? false);
    return matchesDay && matchesText;
  });

  const filteredRooms = ALL_ROOMS.filter((r) => {
    const matchesBld = selectedBuilding === 'Semua' || r.buildingId === selectedBuilding;
    const matchesCat = selectedCat === 'Semua' || r.cat === selectedCat;
    const matchesText =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.code.toLowerCase().includes(q) ||
      r.buildingName.toLowerCase().includes(q);
    return matchesBld && matchesCat && matchesText;
  });

  return (
    <div className="p-4 space-y-3 pb-6">
      <div>
        <h1 className="text-base font-extrabold text-slate-900">
          Jadwal & Direktori Gedung (G1–G6)
        </h1>
        <p className="text-[11px] text-slate-500">
          {profile.isGuest
            ? 'Semua jadwal kuliah & daftar lengkap ruangan INSTIKI'
            : `Jadwal ${profile.name} & direktori lengkap Gedung 1–6`}
        </p>
      </div>

      {/* Segmented Control */}
      <div className="grid grid-cols-2 bg-slate-200/80 p-1 rounded-xl gap-1">
        <button
          type="button"
          onClick={() => setSubTab('schedule')}
          className={`py-2 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition cursor-pointer ${
            subTab === 'schedule'
              ? 'bg-white text-[#1A2352] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" /> Jadwal MatKul
        </button>
        <button
          type="button"
          onClick={() => setSubTab('rooms')}
          className={`py-2 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition cursor-pointer ${
            subTab === 'rooms'
              ? 'bg-white text-[#1A2352] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" /> Gedung & Ruang ({ALL_ROOMS.length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder={
            subTab === 'schedule'
              ? 'Filter nama MatKul, kode, atau ruang...'
              : 'Filter kode ruang (R.541), lab, atau gedung...'
          }
          className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs outline-none focus:border-[#1A2352]"
        />
      </div>

      {subTab === 'schedule' ? (
        <div className="space-y-3">
          {/* Day Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 phone-scroll">
            {['Semua', ...DAYS].map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold border transition cursor-pointer ${
                  selectedDay === day
                    ? 'bg-[#1A2352] text-white border-[#1A2352]'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {filteredCourses.length === 0 ? (
            /* Metacognition Empty State */
            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center space-y-2.5 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-extrabold text-slate-900">
                Wah, tidak ada jadwal kuliah di{' '}
                {selectedDay === 'Semua' ? 'pencarian ini' : `hari ${selectedDay}`}!
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Daripada bingung mencari manual, kamu bisa melihat jadwal hari Senin atau
                menjelajahi direktori lengkap Gedung 1–6.
              </p>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDay('Senin');
                    setFilterText('');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#1A2352] text-white text-[11px] font-bold cursor-pointer"
                >
                  Lihat Jadwal Senin
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubTab('rooms');
                    setFilterText('');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-red-50 text-[#D32F2F] border border-red-200 text-[11px] font-bold cursor-pointer"
                >
                  Cek Gedung G1–G6
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCourses.map((course) => {
                const room = getRoomById(course.roomId);
                return (
                  <div
                    key={course.id}
                    className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-50 text-[#1A2352]">
                        {course.day} • {course.code}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-[#D32F2F] border border-red-200">
                        {room?.buildingId} Lt. {room?.floor} • {room?.code}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xs font-extrabold text-slate-900">{course.name}</h3>
                      <p className="text-[11px] text-slate-500">{course.lecturer}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-semibold text-slate-600 inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {course.startTime} – {course.endTime}
                      </span>
                      <button
                        type="button"
                        onClick={() => onStartRouteToRoom(course.roomId, course)}
                        className="inline-flex items-center gap-1 bg-[#D32F2F] hover:bg-red-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                      >
                        Rute ke Kelas <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Building Filter + Count */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-slate-600">
              Menampilkan {filteredRooms.length} lokasi
            </span>
            <select
              aria-label="Filter Gedung"
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              className="text-[11px] font-bold bg-white border border-slate-300 rounded-lg px-2 py-1 cursor-pointer"
            >
              <option value="Semua">Semua Gedung (G1–G6)</option>
              {BUILDINGS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
              <option value="OUTDOOR">Area Luar Kampus</option>
            </select>
          </div>

          {/* Category Chips (Recognize > Recall) */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 phone-scroll">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer ${
                  selectedCat === cat
                    ? 'bg-[#D32F2F] text-white border-[#D32F2F]'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredRooms.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center space-y-2">
              <p className="text-xs font-bold text-slate-800">
                Tidak ada ruangan yang cocok dengan filter ini.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedBuilding('Semua');
                  setSelectedCat('Semua');
                  setFilterText('');
                }}
                className="px-3 py-1.5 rounded-xl bg-[#1A2352] text-white text-[11px] font-bold cursor-pointer"
              >
                Reset Filter Direktori
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              {filteredRooms.map((r) => (
                <div
                  key={r.id}
                  className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-red-50 text-[#D32F2F] border border-red-200">
                        {r.code}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate">
                        {r.buildingName} • {r.floorLabel}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 mt-0.5 truncate">
                      {r.name}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onStartRouteToRoom(r.id)}
                    className="shrink-0 px-2.5 py-1.5 rounded-lg bg-[#1A2352] hover:bg-[#D32F2F] text-white text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition"
                  >
                    Rute <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  CAMPUS_NODES,
  COURSE_SCHEDULES,
  CourseSchedule,
  FloorNumber,
  StudentProfile,
} from '../../data/campusData';
import { getNodeById } from '../../utils/pathfinder';
import {
  ArrowRight,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Search,
  Sparkles,
} from 'lucide-react';

interface ScheduleDirectoryScreenProps {
  profile: StudentProfile;
  onStartRouteToRoom: (roomId: string, course?: CourseSchedule) => void;
}

const DAYS: CourseSchedule['day'][] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu' as any];

export const ScheduleDirectoryScreen: React.FC<ScheduleDirectoryScreenProps> = ({
  profile,
  onStartRouteToRoom,
}) => {
  const [subTab, setSubTab] = useState<'schedule' | 'rooms'>('schedule');
  const [selectedDay, setSelectedDay] = useState<string>('Semua');
  const [selectedFloor, setSelectedFloor] = useState<FloorNumber | 'all'>('all');
  const [filterText, setFilterText] = useState('');

  const myCourses = profile.isGuest
    ? COURSE_SCHEDULES
    : COURSE_SCHEDULES.filter((c) => c.prodi === profile.prodi);

  const filteredCourses = myCourses.filter((c) => {
    const matchesDay = selectedDay === 'Semua' || c.day === selectedDay;
    const q = filterText.trim().toLowerCase();
    const room = getNodeById(c.roomId);
    const matchesText =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      (room?.label.toLowerCase().includes(q) ?? false);
    return matchesDay && matchesText;
  });

  const allRooms = CAMPUS_NODES.filter(
    (n) => n.kind === 'room' || n.kind === 'facility'
  ).filter((n) => {
    const matchesFloor = selectedFloor === 'all' || n.floor === selectedFloor;
    const q = filterText.trim().toLowerCase();
    const matchesText =
      !q ||
      n.label.toLowerCase().includes(q) ||
      (n.description?.toLowerCase().includes(q) ?? false);
    return matchesFloor && matchesText;
  });

  // Group rooms by floor (Pertemuan 3: Pengelompokan Informasi)
  const groupedFloors: FloorNumber[] = ([1, 2, 3, 4] as FloorNumber[]).filter((fl) =>
    allRooms.some((r) => r.floor === fl)
  );

  return (
    <div className="p-4 space-y-3.5 pb-6">
      <div>
        <h1 className="text-base font-extrabold text-slate-900">Jadwal & Ruang Kampus</h1>
        <p className="text-[11px] text-slate-500">
          {profile.isGuest
            ? 'Menampilkan seluruh jadwal & direktori ruangan INSTIKI'
            : `Jadwal ${profile.name} (${profile.prodi}) & direktori ruangan`}
        </p>
      </div>

      {/* Segmented Control */}
      <div className="grid grid-cols-2 bg-slate-200/75 p-1 rounded-xl gap-1">
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
          <Building2 className="w-3.5 h-3.5" /> Direktori Ruangan
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder={
            subTab === 'schedule'
              ? 'Filter nama MatKul, kode, atau ruang...'
              : 'Filter nama ruangan atau fasilitas...'
          }
          className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs outline-none focus:border-[#1A2352]"
        />
      </div>

      {subTab === 'schedule' ? (
        <div className="space-y-3">
          {/* Day Filter Chips */}
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
            /* Metacognition Empty State (Pertemuan 3 Slide 42-43) */
            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center space-y-2.5 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-extrabold text-slate-900">
                Wah, tidak ada jadwal kuliah di {selectedDay === 'Semua' ? 'pencarian ini' : `hari ${selectedDay}`}!
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Daripada bingung mencari manual, kamu bisa langsung melihat jadwal hari Senin atau
                menjelajahi direktori seluruh ruangan kampus.
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
                  className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold cursor-pointer"
                >
                  Cek Semua Ruangan
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCourses.map((course) => {
                const room = getNodeById(course.roomId);
                return (
                  <div
                    key={course.id}
                    className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-50 text-[#1A2352]">
                        {course.day} • {course.code}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                        {room?.label} (Lt. {room?.floor})
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
          {/* Floor Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(['all', 1, 2, 3, 4] as const).map((fl) => (
              <button
                key={String(fl)}
                type="button"
                onClick={() => setSelectedFloor(fl)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold border transition cursor-pointer ${
                  selectedFloor === fl
                    ? 'bg-[#1A2352] text-white border-[#1A2352]'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {fl === 'all' ? 'Semua Lantai' : `Lantai ${fl}`}
              </button>
            ))}
          </div>

          {groupedFloors.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center space-y-2">
              <p className="text-xs font-bold text-slate-800">Ruangan tidak ditemukan</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedFloor('all');
                  setFilterText('');
                }}
                className="px-3 py-1.5 rounded-xl bg-[#1A2352] text-white text-[11px] font-bold cursor-pointer"
              >
                Tampilkan Semua Ruangan
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {groupedFloors.map((floor) => {
                const roomsInFloor = allRooms.filter((r) => r.floor === floor);
                return (
                  <div key={floor} className="space-y-1.5">
                    <h3 className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider px-1">
                      Lantai {floor} ({roomsInFloor.length} lokasi)
                    </h3>
                    <div className="space-y-1.5">
                      {roomsInFloor.map((room) => (
                        <div
                          key={room.id}
                          className="bg-white border border-slate-200 rounded-2xl p-2.5 flex items-center justify-between gap-2 shadow-2xs"
                        >
                          <div className="flex items-start gap-2 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-slate-100 text-[#1A2352] flex items-center justify-center shrink-0 mt-0.5">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {room.label}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate">
                                {room.description ?? room.landmark}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => onStartRouteToRoom(room.id)}
                            className="shrink-0 px-2.5 py-1.5 rounded-xl bg-[#1A2352] hover:bg-slate-800 text-white text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            Rute <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useMemo, useState } from 'react';
import {
  COURSE_SCHEDULES,
  CourseSchedule,
  STUDENT_PROFILES,
  StudentProfile,
} from './data/campusData';
import { AppTab, HCI_INSIGHTS_BY_TAB } from './data/hciInsights';
import { findCampusRoute } from './utils/pathfinder';
import { HomeScreen } from './components/screens/HomeScreen';
import { MapNavigationScreen } from './components/screens/MapNavigationScreen';
import { ScheduleDirectoryScreen } from './components/screens/ScheduleDirectoryScreen';
import { AssistantScreen } from './components/screens/AssistantScreen';
import {
  BookOpen,
  CalendarDays,
  Home,
  Info,
  Map as MapIcon,
  MessageCircleQuestion,
  RotateCcw,
  Smartphone,
  Sparkles,
  Wifi,
  BatteryCharging,
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [profile, setProfile] = useState<StudentProfile>(STUDENT_PROFILES[0]);
  const [selectedParkingId, setSelectedParkingId] = useState<string>('parkir-depan');
  const [parkingNote, setParkingNote] = useState<string>('Baris B2 dekat Pos Satpam');
  const [selectedEndId, setSelectedEndId] = useState<string | null>('f2-lab2');
  const [activeCourse, setActiveCourse] = useState<CourseSchedule | null>(COURSE_SCHEDULES[0]);
  const [accessibleOnly, setAccessibleOnly] = useState<boolean>(false);
  const [recentRoomIds, setRecentRoomIds] = useState<string[]>(['f2-lab2', 'f4-smart403', 'f1-aula']);
  const [assistantQuery, setAssistantQuery] = useState<string | null>(null);
  const [showInspector, setShowInspector] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2400);
  };

  const route = useMemo(() => {
    if (!selectedEndId) return null;
    return findCampusRoute(selectedParkingId, selectedEndId, { accessibleOnly });
  }, [selectedParkingId, selectedEndId, accessibleOnly]);

  const handleChangeProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    setSelectedParkingId(newProfile.defaultParkingId);
    triggerToast(`Profil beralih ke ${newProfile.name}`);
  };

  const handleSelectParking = (parkingNodeId: string) => {
    setSelectedParkingId(parkingNodeId);
    triggerToast('Lokasi parkir diperbarui');
  };

  const handleStartRouteToRoom = (
    roomId: string,
    course?: CourseSchedule,
    overrideStartId?: string
  ) => {
    if (overrideStartId) {
      setSelectedParkingId(overrideStartId);
    }
    setSelectedEndId(roomId);
    setActiveCourse(course ?? null);
    setRecentRoomIds((prev) => [roomId, ...prev.filter((id) => id !== roomId)].slice(0, 4));
    setActiveTab('map');
  };

  const runScenario = (scenario: 1 | 2 | 3) => {
    if (scenario === 1) {
      setProfile(STUDENT_PROFILES[0]);
      setSelectedParkingId('parkir-depan');
      setAccessibleOnly(false);
      setSelectedEndId('f2-lab2');
      setActiveCourse(COURSE_SCHEDULES[0]);
      setActiveTab('map');
      triggerToast('Skenario 1: Rute ke Kelas HCI (Lab 2)');
    } else if (scenario === 2) {
      setProfile(STUDENT_PROFILES[2]);
      setSelectedParkingId('parkir-belakang');
      setAccessibleOnly(false);
      setSelectedEndId('f4-smart403');
      setActiveCourse(COURSE_SCHEDULES[3]);
      setActiveTab('map');
      triggerToast('Skenario 2: Maba menuju Smart Classroom 403');
    } else {
      setProfile(STUDENT_PROFILES[1]);
      setSelectedParkingId('parkir-mobil');
      setAccessibleOnly(true);
      setSelectedEndId('f3-lab-dkv');
      setActiveCourse(COURSE_SCHEDULES[6]);
      setActiveTab('map');
      triggerToast('Skenario 3: Mode Aksesibilitas Lift aktif');
    }
  };

  const handleReset = () => {
    setProfile(STUDENT_PROFILES[0]);
    setSelectedParkingId('parkir-depan');
    setParkingNote('Baris B2 dekat Pos Satpam');
    setSelectedEndId('f2-lab2');
    setActiveCourse(COURSE_SCHEDULES[0]);
    setAccessibleOnly(false);
    setActiveTab('home');
    triggerToast('Prototype direset ke kondisi awal');
  };

  const currentInsight = HCI_INSIGHTS_BY_TAB[activeTab];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Desktop Presentation Studio Header (hidden on very small phones if desired, shown nicely on desktop) */}
      <header className="hidden sm:flex items-center justify-between px-5 py-3 bg-slate-900/90 border-b border-slate-800 backdrop-blur sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D32F2F] to-red-700 flex items-center justify-center font-extrabold text-xs text-white shadow-sm">
            IN
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold text-white">
                INSTIKI WayFinder — Interactive UI Prototype
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                UTS HCI
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Navigasi Kampus: Dari Parkiran ke Ruang Kelas Sesuai Mata Kuliah
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowInspector((s) => !s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border inline-flex items-center gap-1.5 transition cursor-pointer ${
              showInspector
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{showInspector ? 'Tutup Panel Teori HCI' : 'Inspeksi Teori HCI'}</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </header>

      {/* Main Presentation Stage */}
      <main className="flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 sm:p-6 max-w-7xl w-full mx-auto">
        {/* Left/Center: Mobile Device Prototype Frame */}
        <div className="w-full sm:w-auto flex flex-col items-center shrink-0">
          {/* Phone Outer Bezel */}
          <div className="w-full sm:w-[390px] sm:h-[780px] min-h-screen sm:min-h-0 bg-[#F8FAFC] text-slate-900 sm:rounded-[44px] sm:border-[10px] sm:border-slate-800 sm:shadow-[0_24px_70px_rgba(0,0,0,0.65)] flex flex-col overflow-hidden relative">
            {/* Simulated Mobile Status Bar */}
            <div className="bg-[#141E46] text-white px-5 pt-2.5 pb-1.5 flex items-center justify-between text-[11px] font-bold shrink-0 select-none">
              <span>07:45</span>
              {/* Dynamic Island / Notch */}
              <div className="hidden sm:block w-24 h-4 bg-slate-950 rounded-full" />
              <div className="flex items-center gap-1.5 text-slate-200">
                <Wifi className="w-3.5 h-3.5" />
                <BatteryCharging className="w-4 h-4" />
              </div>
            </div>

            {/* Feedback Toast inside Phone (Prinsip Desain: Feedback) */}
            {toastMessage && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 z-40 w-[86%] pointer-events-none">
                <div className="bg-slate-900/95 text-white text-[11px] font-bold px-3.5 py-2 rounded-xl shadow-lg text-center border border-slate-700">
                  {toastMessage}
                </div>
              </div>
            )}

            {/* Scrollable Mobile Viewport */}
            <div className="flex-1 overflow-y-auto phone-scroll bg-[#F4F6FA]">
              {activeTab === 'home' && (
                <HomeScreen
                  profile={profile}
                  onChangeProfile={handleChangeProfile}
                  selectedParkingId={selectedParkingId}
                  onSelectParking={handleSelectParking}
                  parkingNote={parkingNote}
                  onChangeParkingNote={setParkingNote}
                  recentRoomIds={recentRoomIds}
                  onStartRouteToRoom={handleStartRouteToRoom}
                  onOpenAssistant={(q) => {
                    if (q) setAssistantQuery(q);
                    setActiveTab('assistant');
                  }}
                  onOpenSchedule={() => setActiveTab('schedule')}
                />
              )}

              {activeTab === 'map' && (
                <MapNavigationScreen
                  route={route}
                  selectedStartId={selectedParkingId}
                  selectedEndId={selectedEndId}
                  activeCourse={activeCourse}
                  accessibleOnly={accessibleOnly}
                  onToggleAccessible={() => {
                    setAccessibleOnly((prev) => {
                      const next = !prev;
                      triggerToast(
                        next
                          ? 'Rute dihitung ulang via Lift (Tanpa Tangga)'
                          : 'Rute normal (Tangga / Tercepat) aktif'
                      );
                      return next;
                    });
                  }}
                  onChangeStart={(id) => {
                    setSelectedParkingId(id);
                    triggerToast('Titik awal rute diperbarui');
                  }}
                  onChangeEnd={(id) => {
                    setSelectedEndId(id);
                    setActiveCourse(null);
                  }}
                  onBackHome={() => setActiveTab('home')}
                />
              )}

              {activeTab === 'schedule' && (
                <ScheduleDirectoryScreen
                  profile={profile}
                  onStartRouteToRoom={handleStartRouteToRoom}
                />
              )}

              {activeTab === 'assistant' && (
                <AssistantScreen
                  initialQuery={assistantQuery}
                  onClearInitialQuery={() => setAssistantQuery(null)}
                  onStartRouteToRoom={handleStartRouteToRoom}
                />
              )}
            </div>

            {/* Persistent Bottom Navigation Bar (Prinsip 4: Strive for Consistency) */}
            <nav
              aria-label="Navigasi Utama Aplikasi"
              className="bg-white border-t border-slate-200 px-2 py-1.5 grid grid-cols-4 shrink-0"
            >
              {[
                { id: 'home' as AppTab, label: 'Beranda', icon: Home },
                { id: 'map' as AppTab, label: 'Peta Rute', icon: MapIcon },
                { id: 'schedule' as AppTab, label: 'Jadwal', icon: CalendarDays },
                { id: 'assistant' as AppTab, label: 'Tanya', icon: MessageCircleQuestion },
              ].map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition cursor-pointer ${
                      active
                        ? 'text-[#D32F2F] bg-red-50/70'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'stroke-[2.5]' : ''}`} />
                    <span className="text-[10px] font-bold mt-0.5">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* iOS-style Home Indicator */}
            <div className="hidden sm:flex justify-center py-1.5 bg-white shrink-0">
              <div className="w-28 h-1 rounded-full bg-slate-300" />
            </div>
          </div>
        </div>

        {/* Right Side: UTS Presentation & HCI Theory Inspector Panel (Desktop) */}
        {showInspector && (
          <aside className="hidden sm:block flex-1 max-w-xl w-full space-y-4">
            {/* Quick UTS Demo Scenarios */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Skenario Demo Presentasi UTS
                </h2>
                <span className="text-[11px] text-slate-400 inline-flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" /> Klik untuk simulasi cepat
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => runScenario(1)}
                  className="text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-red-500/60 transition cursor-pointer"
                >
                  <p className="text-[11px] font-extrabold text-white">1. Kelas HCI</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Parkir Depan ➔ Lab Komputer 2 (Lt. 2)
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => runScenario(2)}
                  className="text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/60 transition cursor-pointer"
                >
                  <p className="text-[11px] font-extrabold text-white">2. Maba ke Lt. 4</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Parkir Belakang ➔ Smart Class 403
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => runScenario(3)}
                  className="text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-sky-500/60 transition cursor-pointer"
                >
                  <p className="text-[11px] font-extrabold text-white">3. Rute Lift</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Parkir Mobil ➔ Lab DKV (Tanpa Tangga)
                  </p>
                </button>
              </div>
            </div>

            {/* Live HCI Theory Breakdown per Active Screen */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    Inspeksi Materi Pertemuan 1–3
                  </span>
                  <h2 className="text-sm font-extrabold text-white mt-0.5">
                    {currentInsight.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {currentInsight.summary}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                {currentInsight.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-white">{item.principle}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 shrink-0">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {item.application}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Note for Customizing Campus Data */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-300 leading-relaxed">
                <span className="font-bold text-white">Catatan Edit Data Kampus:</span> Seluruh
                nama parkiran, kode ruang, denah 2D per lantai, dan jadwal MatKul saat ini memakai
                contoh realistis di <code className="text-amber-300">src/data/campusData.ts</code>{' '}
                agar mudah disesuaikan dengan denah asli INSTIKI sebelum pengumpulan UTS.
              </div>
            </div>
          </aside>
        )}
      </main>
    </div>
  );
}

export default App;

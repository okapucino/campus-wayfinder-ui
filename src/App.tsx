import React, { useMemo, useState } from 'react';
import {
  BuildingId,
  COURSE_SCHEDULES,
  CourseSchedule,
  STUDENT_PROFILES,
  StudentProfile,
  getRoomById,
} from './data/campusData';
import {
  AppTab,
  HCI_INSIGHTS_BY_TAB,
  MAPPING_DATA,
  MappingGroup,
} from './data/hciInsights';
import { computeCampusRoute } from './utils/pathfinder';
import { HomeScreen } from './components/screens/HomeScreen';
import { MapNavigationScreen } from './components/screens/MapNavigationScreen';
import { ScheduleDirectoryScreen } from './components/screens/ScheduleDirectoryScreen';
import { AssistantScreen } from './components/screens/AssistantScreen';
import { InstikiLogo } from './components/InstikiLogo';
import {
  ConfirmModal,
  GuideModal,
  ToastItem,
  ToastStack,
} from './components/Modals';
import {
  BatteryCharging,
  BookOpen,
  CalendarDays,
  Home,
  Map as MapIcon,
  MessageCircleQuestion,
  RotateCcw,
  Sparkles,
  Table2,
  Wifi,
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [profile, setProfile] = useState<StudentProfile>(STUDENT_PROFILES[0]);
  const [selectedStartId, setSelectedStartId] = useState<string>('parkir_depan');
  const [parkingNote, setParkingNote] = useState<string>('Baris B2 dekat Pos Satpam');
  const [selectedDestRoomId, setSelectedDestRoomId] = useState<string>('G1_R.112');
  const [activeCourse, setActiveCourse] = useState<CourseSchedule | null>(COURSE_SCHEDULES[0]);
  const [accessibleOnly, setAccessibleOnly] = useState<boolean>(false);

  // Dual map mode state (Campus G1-G6 vs Building Floor Plan)
  const [mapMode, setMapMode] = useState<'campus' | 'floor'>('campus');
  const [selectedBuildingId, setSelectedBuildingId] =
    useState<Exclude<BuildingId, 'OUTDOOR'>>('G1');
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [navActive, setNavActive] = useState<boolean>(false);

  const [recentRoomIds, setRecentRoomIds] = useState<string[]>([
    'G1_R.112',
    'G5_R.541',
    'G4_R.422',
    'G2_R.213',
  ]);
  const [assistantQuery, setAssistantQuery] = useState<string | null>(null);

  // Modals & Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [guideOpen, setGuideOpen] = useState<boolean>(false);
  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Desktop Inspector Panel State
  const [showInspector, setShowInspector] = useState<boolean>(true);
  const [inspectorView, setInspectorView] = useState<'table' | 'live'>('table');
  const [mappingFilter, setMappingFilter] = useState<'ALL' | MappingGroup>('ALL');

  const pushToast = (
    message: string,
    type: ToastItem['type'] = 'success',
    onUndo?: () => void
  ) => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-2), { id, message, type, onUndo }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4200);
  };

  const route = useMemo(() => {
    return computeCampusRoute(selectedStartId, selectedDestRoomId, {
      accessibleOnly,
    });
  }, [selectedStartId, selectedDestRoomId, accessibleOnly]);

  const applyDestination = (
    roomId: string,
    course?: CourseSchedule,
    forceMapMode?: 'campus' | 'floor'
  ) => {
    const room = getRoomById(roomId);
    if (!room) return;

    setSelectedDestRoomId(room.id);
    setActiveCourse(course ?? null);
    if (room.buildingId !== 'OUTDOOR') {
      setSelectedBuildingId(room.buildingId);
      setSelectedFloor(room.floor);
      setMapMode(forceMapMode ?? 'campus');
    } else {
      setMapMode('campus');
    }
    setNavActive(true);
    setRecentRoomIds((prev) => [room.id, ...prev.filter((id) => id !== room.id)].slice(0, 5));
    setActiveTab('map');
    pushToast(`Rute ke ${room.name} (${room.buildingName}) aktif!`, 'success');
  };

  const handleStartRouteToRoom = (roomId: string, course?: CourseSchedule) => {
    const nextRoom = getRoomById(roomId);
    if (!nextRoom) return;

    if (navActive && selectedDestRoomId !== roomId && activeTab === 'map') {
      const currRoom = getRoomById(selectedDestRoomId);
      setConfirmState({
        open: true,
        title: 'Ganti Tujuan Navigasi?',
        message: `Kamu sedang menavigasi ke ${currRoom?.name ?? 'ruang sebelumnya'}. Ganti rute ke ${nextRoom.name}?`,
        onConfirm: () => {
          setConfirmState((s) => ({ ...s, open: false }));
          applyDestination(roomId, course);
        },
      });
      return;
    }

    applyDestination(roomId, course);
  };

  const handleChangeProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    setSelectedStartId(newProfile.defaultStartId);
    pushToast(`Profil beralih ke ${newProfile.name}`, 'info');
  };

  const handleSaveParkingNote = (newNote: string): boolean => {
    const trimmed = newNote.trim();
    if (!trimmed) {
      pushToast('Catatan parkir tidak boleh kosong!', 'warn');
      return false;
    }
    const prevNote = parkingNote;
    setParkingNote(trimmed);
    pushToast('Catatan spot parkir disimpan.', 'success', () => {
      setParkingNote(prevNote);
      pushToast('Catatan spot dikembalikan.', 'info');
    });
    return true;
  };

  const handleConfirmClearHistory = () => {
    const backup = [...recentRoomIds];
    setConfirmState({
      open: true,
      title: 'Hapus Riwayat Tujuan?',
      message: 'Semua riwayat ruangan terakhir akan dibersihkan dari Beranda.',
      onConfirm: () => {
        setConfirmState((s) => ({ ...s, open: false }));
        setRecentRoomIds([]);
        pushToast('Riwayat tujuan dihapus.', 'info', () => {
          setRecentRoomIds(backup);
          pushToast('Riwayat tujuan dipulihkan.', 'success');
        });
      },
    });
  };

  const handleGlobalReset = () => {
    setConfirmState({
      open: true,
      title: 'Reset Seluruh Prototype?',
      message:
        'Semua pilihan rute, catatan parkir, mode akses, dan riwayat akan dikembalikan ke awal.',
      onConfirm: () => {
        setConfirmState((s) => ({ ...s, open: false }));
        setProfile(STUDENT_PROFILES[0]);
        setSelectedStartId('parkir_depan');
        setParkingNote('Baris B2 dekat Pos Satpam');
        setSelectedDestRoomId('G1_R.112');
        setSelectedBuildingId('G1');
        setSelectedFloor(1);
        setMapMode('campus');
        setNavActive(false);
        setActiveCourse(COURSE_SCHEDULES[0]);
        setAccessibleOnly(false);
        setRecentRoomIds(['G1_R.112', 'G5_R.541', 'G4_R.422', 'G2_R.213']);
        setActiveTab('home');
        pushToast('Prototype berhasil direset ke kondisi awal.', 'info');
      },
    });
  };

  const runScenario = (scenario: 'hci' | 'baak' | 'dkv' | 'mushola') => {
    if (scenario === 'hci') {
      setProfile(STUDENT_PROFILES[0]);
      setSelectedStartId('parkir_depan');
      setAccessibleOnly(false);
      applyDestination('G1_R.112', COURSE_SCHEDULES[0], 'campus');
    } else if (scenario === 'baak') {
      setProfile(STUDENT_PROFILES[2]);
      setSelectedStartId('parkir_depan');
      setAccessibleOnly(false);
      applyDestination('G2_R.213', undefined, 'campus');
    } else if (scenario === 'dkv') {
      setProfile(STUDENT_PROFILES[1]);
      setSelectedStartId('parkir_belakang');
      setAccessibleOnly(false);
      applyDestination('G5_R.541', COURSE_SCHEDULES[6], 'floor');
    } else {
      setSelectedStartId('parkir_depan');
      setAccessibleOnly(true);
      applyDestination('G4_R.422', undefined, 'campus');
    }
  };

  const currentInsight = HCI_INSIGHTS_BY_TAB[activeTab];
  const filteredMapping =
    mappingFilter === 'ALL'
      ? MAPPING_DATA
      : MAPPING_DATA.filter((m) => m.group === mappingFilter);

  const roleBadgeLabel = {
    aktif: 'Mahasiswa Aktif',
    maba: 'Mahasiswa Baru',
    tamu: 'Tamu Kampus',
  }[profile.role];

  const badgeColors: Record<MappingGroup, string> = {
    A: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    B: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    C: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Desktop Presentation Studio Header */}
      <header className="hidden sm:flex items-center justify-between px-5 py-3 bg-slate-900/90 border-b border-slate-800 backdrop-blur sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-xl px-2 py-1.5 shadow-sm flex items-center justify-center">
            <InstikiLogo variant="mark" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm font-extrabold text-white">
                INSTIKI WayFinder — Prototype Denah Kampus & Prinsip HCI
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Gedung 1–6 + 17 Prinsip A, B, C
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Jl. Tukad Pakerisan No. 97, Panjer, Denpasar • Navigasi Parkiran ➔ Ruang Kelas sesuai MatKul
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
            <span>{showInspector ? 'Sembunyikan Panel HCI' : 'Tampilkan Panel HCI'}</span>
          </button>
          <button
            type="button"
            onClick={handleGlobalReset}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </header>

      {/* Main Presentation Stage */}
      <main className="flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 sm:p-6 max-w-7xl w-full mx-auto">
        {/* LEFT/CENTER: Mobile Device Prototype Frame */}
        <div className="w-full sm:w-auto flex flex-col items-center shrink-0">
          <div className="w-full sm:w-[395px] sm:h-[790px] min-h-screen sm:min-h-0 bg-[#F8FAFC] text-slate-900 sm:rounded-[44px] sm:border-[10px] sm:border-slate-800 sm:shadow-[0_24px_70px_rgba(0,0,0,0.65)] flex flex-col overflow-hidden relative">
            {/* Simulated Mobile Status Bar + Metacognition Guide (?) Button */}
            <div className="bg-[#141E46] text-white px-5 pt-2.5 pb-1.5 flex items-center justify-between text-[11px] font-bold shrink-0 select-none">
              <span>07:45 WITA</span>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-semibold">
                  {roleBadgeLabel}
                </span>
                <button
                  type="button"
                  onClick={() => setGuideOpen(true)}
                  title="Panduan Cara Pakai & Logika Kode Ruang (Metakognisi)"
                  className="w-5 h-5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-[11px] flex items-center justify-center shadow cursor-pointer"
                >
                  ?
                </button>
                <Wifi className="w-3 h-3 text-slate-300 ml-0.5" />
                <BatteryCharging className="w-3.5 h-3.5 text-slate-300" />
              </div>
            </div>

            {/* Scrollable Mobile App Body */}
            <div className="flex-1 overflow-y-auto phone-scroll bg-[#F4F6FA]">
              {activeTab === 'home' && (
                <HomeScreen
                  profile={profile}
                  onChangeProfile={handleChangeProfile}
                  selectedStartId={selectedStartId}
                  onSelectStart={(id) => {
                    setSelectedStartId(id);
                    pushToast('Titik awal diperbarui', 'info');
                  }}
                  parkingNote={parkingNote}
                  onSaveParkingNote={handleSaveParkingNote}
                  accessibleOnly={accessibleOnly}
                  onToggleAccessible={() => {
                    setAccessibleOnly((prev) => {
                      const next = !prev;
                      pushToast(
                        next
                          ? 'Mode Ramah Akses (Tanpa Tangga) aktif'
                          : 'Mode Normal (Tangga Utama) aktif',
                        'info'
                      );
                      return next;
                    });
                  }}
                  recentRoomIds={recentRoomIds}
                  onConfirmClearHistory={handleConfirmClearHistory}
                  onStartRouteToRoom={handleStartRouteToRoom}
                  onOpenAssistant={(q) => {
                    if (q) setAssistantQuery(q);
                    setActiveTab('assistant');
                  }}
                  onOpenSchedule={() => setActiveTab('schedule')}
                  onOpenCampusMap={() => {
                    setMapMode('campus');
                    setActiveTab('map');
                  }}
                />
              )}

              {activeTab === 'map' && (
                <MapNavigationScreen
                  route={route}
                  selectedStartId={selectedStartId}
                  selectedDestRoomId={selectedDestRoomId}
                  activeCourse={activeCourse}
                  accessibleOnly={accessibleOnly}
                  mapMode={mapMode}
                  selectedBuildingId={selectedBuildingId}
                  selectedFloor={selectedFloor}
                  onChangeMapMode={setMapMode}
                  onSelectBuilding={(bId) => {
                    setSelectedBuildingId(bId);
                    setSelectedFloor(1);
                  }}
                  onSelectFloor={setSelectedFloor}
                  onToggleAccessible={() => {
                    setAccessibleOnly((prev) => {
                      const next = !prev;
                      pushToast(
                        next
                          ? 'Mode Ramah Akses (Tanpa Tangga) aktif'
                          : 'Mode Normal aktif',
                        'info'
                      );
                      return next;
                    });
                  }}
                  onChangeStart={(id) => {
                    setSelectedStartId(id);
                    pushToast('Titik awal rute diperbarui', 'info');
                  }}
                  onChangeDestRoom={(roomId) => applyDestination(roomId, undefined, mapMode)}
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

            {/* Toast Stack (Feedback + Undo) */}
            <ToastStack
              toasts={toasts}
              onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
            />

            {/* Modals inside Phone Frame */}
            <ConfirmModal
              open={confirmState.open}
              title={confirmState.title}
              message={confirmState.message}
              onCancel={() => setConfirmState((s) => ({ ...s, open: false }))}
              onConfirm={confirmState.onConfirm}
            />
            <GuideModal
              open={guideOpen}
              onClose={() => {
                setGuideOpen(false);
                pushToast('Selamat menggunakan INSTIKI WayFinder!', 'success');
              }}
            />

            {/* Persistent Bottom Navigation Bar */}
            <nav
              aria-label="Navigasi Utama Aplikasi"
              className="bg-white border-t border-slate-200 px-2 py-1.5 grid grid-cols-4 shrink-0"
            >
              {[
                { id: 'home' as AppTab, label: 'Beranda', icon: Home },
                { id: 'map' as AppTab, label: 'Peta & Denah', icon: MapIcon },
                { id: 'schedule' as AppTab, label: 'Jadwal & G1–6', icon: CalendarDays },
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

            <div className="hidden sm:flex justify-center py-1.5 bg-white shrink-0">
              <div className="w-28 h-1 rounded-full bg-slate-300" />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: UTS Demo Scenarios + 17-Point HCI Audit Panel */}
        {showInspector && (
          <aside className="hidden sm:block flex-1 max-w-2xl w-full space-y-4">
            {/* Quick UTS Demo Scenarios (Real G1-G6) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Skenario Demo Cepat (Denah Resmi G1–G6)
                </h2>
                <span className="text-[11px] text-slate-400">
                  Klik untuk langsung uji rute antar gedung & lantai
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => runScenario('hci')}
                  className="text-left p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-700 hover:border-rose-400/60 transition cursor-pointer"
                >
                  <p className="text-xs font-extrabold text-rose-300">
                    1. Kuliah HCI (Lab A)
                  </p>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Parkir Depan ➔ Gedung 1 Lt. 1 (R.112)
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => runScenario('baak')}
                  className="text-left p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/60 transition cursor-pointer"
                >
                  <p className="text-xs font-extrabold text-amber-300">
                    2. Maba ke Ruang BAAK
                  </p>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Parkir Depan ➔ Gedung 2 Lt. 1 (R.213)
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => runScenario('dkv')}
                  className="text-left p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-700 hover:border-emerald-400/60 transition cursor-pointer"
                >
                  <p className="text-xs font-extrabold text-emerald-300">
                    3. Kuliah Lab DKV
                  </p>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Parkir Belakang ➔ Gedung 5 Lt. 4 (R.541)
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => runScenario('mushola')}
                  className="text-left p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-700 hover:border-sky-400/60 transition cursor-pointer"
                >
                  <p className="text-xs font-extrabold text-sky-300">
                    4. Mushola (Ramah Akses)
                  </p>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Parkir Depan ➔ Gedung 4 Lt. 2 (R.422)
                  </p>
                </button>
              </div>
            </div>

            {/* Coverage Summary Cards (Kelompok A, B, C) */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-3">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                  Kelompok A
                </div>
                <div className="text-xs font-extrabold text-white mt-0.5">
                  7 Prinsip Dasar HCI
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Know User, Task, Memory Load, Consistency, Remind, Undo, Naturalness.
                </p>
              </div>
              <div className="bg-slate-900 border border-sky-500/30 rounded-2xl p-3">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-sky-400">
                  Kelompok B
                </div>
                <div className="text-xs font-extrabold text-white mt-0.5">
                  5 Prinsip Interaksi
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Visibility, Feedback, Constraints, Consistency, Affordance.
                </p>
              </div>
              <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-3">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                  Kelompok C
                </div>
                <div className="text-xs font-extrabold text-white mt-0.5">
                  5 Proses Kognisi
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Atensi, Persepsi, Memori, Kebahasaan, Metakognisi.
                </p>
              </div>
            </div>

            {/* Panel Mode Switcher: 17-Point Audit Table vs Live Screen Inspector */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
                  <button
                    type="button"
                    onClick={() => setInspectorView('table')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer ${
                      inspectorView === 'table'
                        ? 'bg-[#D32F2F] text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Table2 className="w-3.5 h-3.5" /> Tabel 17 Prinsip (A, B, C)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectorView('live')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer ${
                      inspectorView === 'live'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Inspeksi Layar Aktif
                  </button>
                </div>

                {inspectorView === 'table' && (
                  <div className="flex flex-wrap gap-1">
                    {(
                      [
                        { id: 'ALL', label: 'Semua (17)' },
                        { id: 'A', label: 'A. HCI (7)' },
                        { id: 'B', label: 'B. Interaksi (5)' },
                        { id: 'C', label: 'C. Kognisi (5)' },
                      ] as const
                    ).map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => setMappingFilter(btn.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                          mappingFilter === btn.id
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {inspectorView === 'table' ? (
                <div className="overflow-x-auto max-h-[370px] overflow-y-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-950 text-slate-300 sticky top-0 z-10">
                      <tr>
                        <th className="p-2.5 font-bold border-b border-slate-800 w-[26%]">
                          Fitur / Layar
                        </th>
                        <th className="p-2.5 font-bold border-b border-slate-800 w-[26%]">
                          Prinsip
                        </th>
                        <th className="p-2.5 font-bold border-b border-slate-800">
                          Implementasi Nyata
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-950/40 text-slate-200">
                      {filteredMapping.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-800/50 transition">
                          <td className="p-2.5 font-semibold text-white align-top text-[11px]">
                            {row.feature}
                          </td>
                          <td className="p-2.5 align-top">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-md border text-[10px] font-bold ${badgeColors[row.group]}`}
                            >
                              {row.principle}
                            </span>
                          </td>
                          <td className="p-2.5 text-slate-300 leading-relaxed align-top text-[11px]">
                            {row.reason}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div>
                    <h3 className="text-sm font-extrabold text-white">
                      {currentInsight.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {currentInsight.summary}
                    </p>
                  </div>
                  {currentInsight.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-white">
                          {item.principle}
                        </span>
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
              )}
            </div>
          </aside>
        )}
      </main>
    </div>
  );
}

export default App;

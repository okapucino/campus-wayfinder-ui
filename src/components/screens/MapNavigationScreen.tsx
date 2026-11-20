import React, { useEffect, useState } from 'react';
import {
  CAMPUS_NODES,
  CampusNode,
  COURSE_SCHEDULES,
  CourseSchedule,
  FloorNumber,
  PARKING_SPOTS,
  RECOVER_LANDMARKS,
} from '../../data/campusData';
import { ComputedRoute, getNodeById } from '../../utils/pathfinder';
import { CampusMap2D } from '../CampusMap2D';
import {
  Accessibility,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Footprints,
  MapPin,
  Navigation,
  Pause,
  Play,
  RefreshCw,
} from 'lucide-react';

interface MapNavigationScreenProps {
  route: ComputedRoute | null;
  selectedStartId: string;
  selectedEndId: string | null;
  activeCourse: CourseSchedule | null;
  accessibleOnly: boolean;
  onToggleAccessible: () => void;
  onChangeStart: (nodeId: string) => void;
  onChangeEnd: (nodeId: string) => void;
  onBackHome: () => void;
}

export const MapNavigationScreen: React.FC<MapNavigationScreenProps> = ({
  route,
  selectedStartId,
  selectedEndId,
  activeCourse,
  accessibleOnly,
  onToggleAccessible,
  onChangeStart,
  onChangeEnd,
  onBackHome,
}) => {
  const [viewFloor, setViewFloor] = useState<FloorNumber>(1);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showAllSteps, setShowAllSteps] = useState<boolean>(false);
  const [showLostModal, setShowLostModal] = useState<boolean>(false);
  const [inspectedRoom, setInspectedRoom] = useState<CampusNode | null>(null);
  const [showChangeOrigin, setShowChangeOrigin] = useState<boolean>(false);

  // Reset step & floor whenever route changes
  useEffect(() => {
    setActiveStepIdx(0);
    setIsPlaying(false);
    if (route && route.steps.length > 0) {
      setViewFloor(route.steps[0].floor);
    }
  }, [route?.startNode.id, route?.endNode.id, accessibleOnly]);

  // Auto-sync floor with active step
  useEffect(() => {
    if (!route) return;
    const step = route.steps[activeStepIdx];
    if (step) {
      setViewFloor(step.kind === 'arrive' ? step.targetFloor : step.floor);
    }
  }, [activeStepIdx, route]);

  // Simulation playback timer
  useEffect(() => {
    if (!isPlaying || !route) return;
    if (activeStepIdx >= route.steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setActiveStepIdx((prev) => Math.min(prev + 1, route.steps.length - 1));
    }, 1700);
    return () => clearTimeout(timer);
  }, [isPlaying, activeStepIdx, route]);

  const activeStep = route?.steps[activeStepIdx];
  const isArrived = activeStep?.kind === 'arrive';

  const startNode = getNodeById(selectedStartId);
  const endNode = selectedEndId ? getNodeById(selectedEndId) : null;

  const destinationRooms = CAMPUS_NODES.filter(
    (n) => n.kind === 'room' || n.kind === 'facility'
  );

  return (
    <div className="p-3.5 space-y-3 pb-6">
      {/* Top Bar: Origin -> Destination + Accessibility Toggle */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-[#1A2352] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Beranda
          </button>

          {/* Prinsip 1 (Know the User) + Constraints: Accessible Lift Mode */}
          <button
            type="button"
            onClick={onToggleAccessible}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer ${
              accessibleOnly
                ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Accessibility className="w-3.5 h-3.5" />
            <span>{accessibleOnly ? 'Mode Lift Aktif' : 'Rute Lift'}</span>
          </button>
        </div>

        {/* Origin & Destination Pickers */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 bg-blue-50/70 border border-blue-200 rounded-xl px-2.5 py-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-blue-700 uppercase">Dari</p>
              <p className="text-xs font-bold text-slate-900 truncate">
                {startNode?.label ?? 'Pilih Titik Awal'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowChangeOrigin((v) => !v)}
              className="text-[11px] font-bold text-blue-700 hover:underline shrink-0 cursor-pointer"
            >
              Ganti
            </button>
          </div>

          {showChangeOrigin && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex flex-wrap gap-1.5">
              {PARKING_SPOTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onChangeStart(p.nodeId);
                    setShowChangeOrigin(false);
                  }}
                  className={`text-[11px] font-semibold px-2 py-1 rounded-lg border cursor-pointer ${
                    selectedStartId === p.nodeId
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 bg-red-50/70 border border-red-200 rounded-xl px-2.5 py-1.5">
            <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-red-700 uppercase">
                Tujuan {activeCourse ? `• ${activeCourse.name}` : ''}
              </p>
              <select
                aria-label="Pilih Ruangan Tujuan"
                value={selectedEndId ?? ''}
                onChange={(e) => onChangeEnd(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-900 outline-none cursor-pointer"
              >
                <option value="" disabled>
                  -- Pilih Ruangan / Lab --
                </option>
                {destinationRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label} (Lt. {r.floor})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Route Summary Metrics */}
        {route && (
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 font-extrabold text-[#1A2352]">
                <Clock className="w-3.5 h-3.5 text-red-600" /> ~{route.estimatedMinutes} menit
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-slate-600">
                <Footprints className="w-3.5 h-3.5 text-slate-400" /> {route.totalDistanceMeters} m
              </span>
            </div>
            <span className="font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              {route.floorsInvolved.length > 1
                ? `Lt. ${route.floorsInvolved[0]} ➔ Lt. ${route.floorsInvolved[route.floorsInvolved.length - 1]}`
                : `Lantai ${route.floorsInvolved[0]}`}
            </span>
          </div>
        )}
      </div>

      {/* 2D Interactive SVG Campus Map */}
      <CampusMap2D
        viewFloor={viewFloor}
        onChangeFloor={setViewFloor}
        route={route}
        activeStepIndex={activeStepIdx}
        selectedStartId={selectedStartId}
        selectedEndId={selectedEndId}
        onSelectRoom={(node) => setInspectedRoom(node)}
      />

      {/* Inspected Room Popup Card (when tapping any room on SVG map) */}
      {inspectedRoom && (
        <div className="bg-white border-2 border-[#1A2352] rounded-2xl p-3 shadow-md space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase text-[#1A2352] bg-indigo-50 px-1.5 py-0.5 rounded">
                Lantai {inspectedRoom.floor}
              </span>
              <h3 className="text-xs font-extrabold text-slate-900 mt-1">
                {inspectedRoom.label}
              </h3>
              <p className="text-[11px] text-slate-600">
                {inspectedRoom.description ?? inspectedRoom.landmark ?? 'Area kampus INSTIKI'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setInspectedRoom(null)}
              className="text-[11px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              Tutup
            </button>
          </div>
          {inspectedRoom.kind !== 'stairs' &&
            inspectedRoom.kind !== 'elevator' &&
            inspectedRoom.id !== selectedStartId && (
              <button
                type="button"
                onClick={() => {
                  if (inspectedRoom.kind === 'parking') {
                    onChangeStart(inspectedRoom.id);
                  } else {
                    onChangeEnd(inspectedRoom.id);
                  }
                  setInspectedRoom(null);
                }}
                className="w-full py-1.5 rounded-xl bg-[#D32F2F] text-white text-[11px] font-bold cursor-pointer"
              >
                {inspectedRoom.kind === 'parking'
                  ? 'Jadikan Titik Parkir Awal'
                  : 'Navigasikan ke Ruangan Ini'}
              </button>
            )}
        </div>
      )}

      {/* Turn-by-Turn Navigation Panel */}
      {route && activeStep ? (
        <div className="space-y-2.5">
          {isArrived ? (
            /* Arrival Celebration Feedback (Prinsip Desain: Feedback) */
            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-3.5 shadow-sm space-y-2">
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-emerald-800">
                    Tujuan Tercapai!
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {endNode?.label} (Lantai {endNode?.floor})
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {activeCourse
                      ? `MatKul: ${activeCourse.name} (${activeCourse.startTime}–${activeCourse.endTime})`
                      : endNode?.description ?? 'Selamat mengikuti perkuliahan!'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveStepIdx(0)}
                  className="flex-1 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold cursor-pointer"
                >
                  Ulangi Panduan
                </button>
                <button
                  type="button"
                  onClick={onBackHome}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            </div>
          ) : (
            /* Active Step Card */
            <div className="bg-[#1A2352] text-white rounded-2xl p-3.5 shadow-md space-y-2.5">
              <div className="flex items-center justify-between text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                <span>
                  Langkah {activeStepIdx + 1} dari {route.steps.length} • Lt. {activeStep.floor}
                </span>
                {activeStep.distanceMeters > 0 && <span>{activeStep.distanceMeters} m</span>}
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#D32F2F] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Navigation className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold leading-relaxed">{activeStep.instruction}</p>
                  {activeStep.landmarkHint && (
                    <p className="text-[11px] text-amber-300 font-medium">
                      💡 Patokan: {activeStep.landmarkHint}
                    </p>
                  )}
                </div>
              </div>

              {/* Step Controls + Auto-Walk Simulator */}
              <div className="flex items-center gap-1.5 pt-1">
                <button
                  type="button"
                  disabled={activeStepIdx === 0}
                  onClick={() => {
                    setIsPlaying(false);
                    setActiveStepIdx((i) => Math.max(0, i - 1));
                  }}
                  className="px-2.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 text-xs font-bold cursor-pointer"
                >
                  Kembali
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" /> Jeda
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" /> Simulasi
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setActiveStepIdx((i) => Math.min(route.steps.length - 1, i + 1));
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#D32F2F] hover:bg-red-600 text-white text-xs font-bold inline-flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Lanjut</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Error Recovery / Re-route Button (Prinsip 6: Prevent Errors & Reversal) */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setShowAllSteps((s) => !s)}
              className="flex-1 py-2 px-3 rounded-xl bg-white border border-slate-200 text-slate-700 text-[11px] font-bold inline-flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Daftar Semua Langkah ({route.steps.length})</span>
              {showAllSteps ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowLostModal((v) => !v)}
              className="py-2 px-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-bold inline-flex items-center gap-1 hover:bg-amber-100 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Tersesat?</span>
            </button>
          </div>

          {/* Lost / Re-route Recovery Modal */}
          {showLostModal && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-extrabold text-amber-950 inline-flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5" /> Hitung Ulang dari Patokan Terdekat
                </p>
                <button
                  type="button"
                  onClick={() => setShowLostModal(false)}
                  className="text-[11px] font-bold text-amber-800 cursor-pointer"
                >
                  Tutup
                </button>
              </div>
              <p className="text-[11px] text-amber-900">
                Pilih lokasi yang sedang kamu lihat sekarang agar rute diperbarui otomatis:
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {RECOVER_LANDMARKS.map((lm) => (
                  <button
                    key={lm.id}
                    type="button"
                    onClick={() => {
                      onChangeStart(lm.id);
                      setShowLostModal(false);
                    }}
                    className="text-left px-2.5 py-2 rounded-xl bg-white border border-amber-200 hover:border-amber-500 text-[11px] font-bold text-slate-800 cursor-pointer"
                  >
                    {lm.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Expandable Full Step List */}
          {showAllSteps && (
            <div className="bg-white border border-slate-200 rounded-2xl p-2.5 space-y-1.5">
              {route.steps.map((st, idx) => {
                const isCurrent = idx === activeStepIdx;
                const isDone = idx < activeStepIdx;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      setIsPlaying(false);
                      setActiveStepIdx(idx);
                    }}
                    className={`w-full text-left p-2 rounded-xl border flex items-start gap-2 transition cursor-pointer ${
                      isCurrent
                        ? 'bg-red-50 border-red-300'
                        : isDone
                          ? 'bg-slate-50 border-slate-100 opacity-70'
                          : 'bg-white border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5 ${
                        isCurrent
                          ? 'bg-[#D32F2F] text-white'
                          : isDone
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isDone ? '✓' : idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-900">{st.instruction}</p>
                      <p className="text-[10px] text-slate-500">
                        Lt. {st.floor}
                        {st.distanceMeters > 0 ? ` • ${st.distanceMeters} m` : ''}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center space-y-2">
          <p className="text-xs font-bold text-slate-800">Pilih Ruangan Tujuan</p>
          <p className="text-[11px] text-slate-500">
            Ketuk salah satu ruangan di atas atau pilih dari dropdown untuk melihat rute tercepat.
          </p>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import {
  ALL_ROOMS,
  BuildingId,
  CourseSchedule,
  RECOVER_LANDMARKS,
  START_POINTS,
  getRoomById,
} from '../../data/campusData';
import { ComputedRoute, getStartOrLandmarkById } from '../../utils/pathfinder';
import { CampusMap2D } from '../CampusMap2D';
import {
  Accessibility,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
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
  selectedDestRoomId: string;
  activeCourse: CourseSchedule | null;
  accessibleOnly: boolean;
  mapMode: 'campus' | 'floor';
  selectedBuildingId: Exclude<BuildingId, 'OUTDOOR'>;
  selectedFloor: number;
  onChangeMapMode: (mode: 'campus' | 'floor') => void;
  onSelectBuilding: (buildingId: Exclude<BuildingId, 'OUTDOOR'>) => void;
  onSelectFloor: (floor: number) => void;
  onToggleAccessible: () => void;
  onChangeStart: (startId: string) => void;
  onChangeDestRoom: (roomId: string) => void;
  onBackHome: () => void;
}

export const MapNavigationScreen: React.FC<MapNavigationScreenProps> = ({
  route,
  selectedStartId,
  selectedDestRoomId,
  activeCourse,
  accessibleOnly,
  mapMode,
  selectedBuildingId,
  selectedFloor,
  onChangeMapMode,
  onSelectBuilding,
  onSelectFloor,
  onToggleAccessible,
  onChangeStart,
  onChangeDestRoom,
  onBackHome,
}) => {
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showLostModal, setShowLostModal] = useState<boolean>(false);
  const [showChangeOrigin, setShowChangeOrigin] = useState<boolean>(false);

  // Reset stepper when route changes
  useEffect(() => {
    setActiveStepIdx(0);
    setIsPlaying(false);
  }, [selectedStartId, selectedDestRoomId, accessibleOnly]);

  // Auto-switch to floor view when simulation reaches building entry step
  useEffect(() => {
    if (!route) return;
    const step = route.steps[activeStepIdx];
    if (isPlaying && step?.focusFloorView && route.destRoom.buildingId !== 'OUTDOOR') {
      onSelectBuilding(route.destRoom.buildingId);
      onSelectFloor(route.destRoom.floor);
    }
  }, [activeStepIdx, isPlaying]);

  // Simulation playback timer
  useEffect(() => {
    if (!isPlaying || !route) return;
    if (activeStepIdx >= route.steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setActiveStepIdx((prev) => Math.min(prev + 1, route.steps.length - 1));
    }, 1600);
    return () => clearTimeout(timer);
  }, [isPlaying, activeStepIdx, route]);

  const activeStep = route?.steps[activeStepIdx];
  const isArrived = activeStep?.kind === 'arrive';

  const startInfo = getStartOrLandmarkById(selectedStartId);
  const destRoom = getRoomById(selectedDestRoomId);

  return (
    <div className="p-3.5 space-y-3 pb-6">
      {/* Top Route Control Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-[#1A2352] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Beranda
          </button>

          <button
            type="button"
            onClick={onToggleAccessible}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer ${
              accessibleOnly
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Accessibility className="w-3.5 h-3.5" />
            <span>{accessibleOnly ? 'Ramah Akses ON' : 'Mode Tanpa Tangga'}</span>
          </button>
        </div>

        {/* Origin & Destination Selectors */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 bg-emerald-50/70 border border-emerald-200 rounded-xl px-2.5 py-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-emerald-800 uppercase">Titik Awal</p>
              <p className="text-xs font-bold text-slate-900 truncate">{startInfo.name}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowChangeOrigin((v) => !v)}
              className="text-[11px] font-bold text-emerald-700 hover:underline shrink-0 cursor-pointer"
            >
              Ganti
            </button>
          </div>

          {showChangeOrigin && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex flex-wrap gap-1.5">
              {START_POINTS.map((sp) => (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => {
                    onChangeStart(sp.id);
                    setShowChangeOrigin(false);
                  }}
                  className={`text-[11px] font-semibold px-2 py-1 rounded-lg border cursor-pointer ${
                    selectedStartId === sp.id
                      ? 'bg-[#1A2352] text-white border-[#1A2352]'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {sp.name}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 bg-red-50/70 border border-red-200 rounded-xl px-2.5 py-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#D32F2F] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-red-700 uppercase truncate">
                Tujuan {activeCourse ? `• ${activeCourse.name}` : ''}
              </p>
              <select
                aria-label="Pilih Ruangan Tujuan"
                value={selectedDestRoomId}
                onChange={(e) => onChangeDestRoom(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-900 outline-none cursor-pointer"
              >
                {ALL_ROOMS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {r.buildingName} ({r.floorLabel})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Route Metrics + Quick Jump to Building Floor */}
        {route && destRoom && (
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] gap-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 font-extrabold text-[#1A2352]">
                <Clock className="w-3.5 h-3.5 text-[#D32F2F]" /> ~{route.estimatedMinutes} menit
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-slate-600">
                <Footprints className="w-3.5 h-3.5 text-slate-400" /> {route.totalDistanceMeters} m
              </span>
            </div>

            {destRoom.buildingId !== 'OUTDOOR' && mapMode === 'campus' ? (
              <button
                type="button"
                onClick={() => {
                  onSelectBuilding(destRoom.buildingId as Exclude<BuildingId, 'OUTDOOR'>);
                  onSelectFloor(destRoom.floor);
                  onChangeMapMode('floor');
                }}
                className="px-2 py-0.5 rounded-md bg-[#1A2352] text-white font-bold text-[10px] cursor-pointer"
              >
                Lihat {destRoom.buildingId} Lt.{destRoom.floor} →
              </button>
            ) : (
              <span className="font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                {destRoom.buildingId} • Lt. {destRoom.floor}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Dual-Mode Map: Peta Kampus (G1-G6) or Denah Lantai */}
      <CampusMap2D
        mapMode={mapMode}
        onChangeMapMode={onChangeMapMode}
        route={route}
        activeStepIndex={activeStepIdx}
        selectedStartId={selectedStartId}
        selectedBuildingId={selectedBuildingId}
        selectedFloor={selectedFloor}
        accessibleOnly={accessibleOnly}
        onSelectStartOnMap={onChangeStart}
        onSelectBuilding={(bId) => {
          onSelectBuilding(bId);
          onChangeMapMode('floor');
        }}
        onSelectFloor={onSelectFloor}
        onSelectRoom={onChangeDestRoom}
      />

      {/* Turn-by-Turn Stepper */}
      {route && activeStep && (
        <div className="space-y-2.5">
          {isArrived ? (
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
                    {destRoom?.name} ({destRoom?.buildingName})
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {activeCourse
                      ? `MatKul: ${activeCourse.name} (${activeCourse.startTime}–${activeCourse.endTime})`
                      : destRoom?.desc}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onChangeMapMode('campus');
                    setActiveStepIdx(0);
                  }}
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
            <div className="bg-[#1A2352] text-white rounded-2xl p-3.5 shadow-md space-y-2.5">
              <div className="flex items-center justify-between text-[10px] text-amber-300 font-extrabold uppercase tracking-wider">
                <span>
                  Panduan Rute • Langkah {activeStepIdx + 1} dari {route.steps.length}
                </span>
                {activeStep.distanceMeters > 0 && (
                  <span className="text-slate-300">{activeStep.distanceMeters} m</span>
                )}
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

          {/* Error Recovery Button ("Tersesat?") */}
          <button
            type="button"
            onClick={() => setShowLostModal((v) => !v)}
            className="w-full py-2 px-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-bold inline-flex items-center justify-center gap-1.5 hover:bg-amber-100 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Tersesat di Kampus? Pilih Patokan Terdekat</span>
          </button>

          {showLostModal && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-extrabold text-amber-950 inline-flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5" /> Hitung Ulang dari Lokasi Kamu
                </p>
                <button
                  type="button"
                  onClick={() => setShowLostModal(false)}
                  className="text-[11px] font-bold text-amber-800 cursor-pointer"
                >
                  Tutup
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {RECOVER_LANDMARKS.map((lm) => (
                  <button
                    key={lm.id}
                    type="button"
                    onClick={() => {
                      onChangeStart(lm.id);
                      onChangeMapMode('campus');
                      setShowLostModal(false);
                    }}
                    className="text-left px-2.5 py-2 rounded-xl bg-white border border-amber-200 hover:border-amber-500 text-[11px] font-bold text-slate-800 cursor-pointer"
                  >
                    {lm.shortName}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

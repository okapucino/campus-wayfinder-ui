import React from 'react';
import {
  BUILDINGS,
  BuildingId,
  OUTDOOR_FACILITIES,
  RoomItem,
} from '../data/campusData';
import { ComputedRoute } from '../utils/pathfinder';
import { Building2, Map as MapIcon } from 'lucide-react';

interface CampusMap2DProps {
  mapMode: 'campus' | 'floor';
  onChangeMapMode: (mode: 'campus' | 'floor') => void;
  route: ComputedRoute | null;
  activeStepIndex: number;
  selectedStartId: string;
  selectedBuildingId: Exclude<BuildingId, 'OUTDOOR'>;
  selectedFloor: number;
  accessibleOnly: boolean;
  onSelectStartOnMap: (startId: string) => void;
  onSelectBuilding: (buildingId: Exclude<BuildingId, 'OUTDOOR'>) => void;
  onSelectFloor: (floor: number) => void;
  onSelectRoom: (roomId: string) => void;
}

const ALL_POSSIBLE_FLOORS = [1, 2, 3, 4, 5];

export const CampusMap2D: React.FC<CampusMap2DProps> = ({
  mapMode,
  onChangeMapMode,
  route,
  activeStepIndex,
  selectedStartId,
  selectedBuildingId,
  selectedFloor,
  accessibleOnly,
  onSelectStartOnMap,
  onSelectBuilding,
  onSelectFloor,
  onSelectRoom,
}) => {
  const dest: RoomItem | undefined = route?.destRoom;
  const start = route?.startPoint;
  const activeStep = route?.steps[activeStepIndex];

  const building =
    BUILDINGS.find((b) => b.id === selectedBuildingId) ?? BUILDINGS[0];
  const availableFloors = building.floors.map((f) => f.floor);
  const safeFloor = availableFloors.includes(selectedFloor)
    ? selectedFloor
    : availableFloors[0];
  const floorObj =
    building.floors.find((f) => f.floor === safeFloor) ?? building.floors[0];

  const routePathD = route
    ? route.pathPoints
        .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`)
        .join(' ')
    : '';

  return (
    <div className="space-y-2.5">
      {/* Mode Switcher: Peta Kampus (G1-G6) vs Denah Lantai */}
      <div className="grid grid-cols-2 bg-slate-200/80 p-1 rounded-xl gap-1">
        <button
          type="button"
          onClick={() => onChangeMapMode('campus')}
          className={`py-1.5 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition cursor-pointer ${
            mapMode === 'campus'
              ? 'bg-white text-[#D32F2F] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" /> Peta Kampus (G1–G6)
        </button>
        <button
          type="button"
          onClick={() => onChangeMapMode('floor')}
          className={`py-1.5 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 transition cursor-pointer ${
            mapMode === 'floor'
              ? 'bg-white text-[#D32F2F] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" /> Denah Lantai ({building.id})
        </button>
      </div>

      {mapMode === 'campus' ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs">
          <svg
            viewBox="0 0 320 440"
            className="w-full h-auto rounded-xl bg-[#4c1d24] shadow-inner select-none"
            aria-label="Peta Kampus INSTIKI Gedung 1 sampai 6"
          >
            {/* Campus Ground */}
            <rect x="0" y="0" width="320" height="440" fill="#5b1f27" />

            {/* Jalan Keluar (Top-Left) */}
            <rect x="12" y="12" width="76" height="24" rx="6" fill="#dc2626" />
            <text
              x="50"
              y="27"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="8.5"
              fontWeight="700"
            >
              ← Jalan Keluar
            </text>

            {/* Parkir Belakang */}
            <g
              onClick={() => onSelectStartOnMap('parkir_belakang')}
              className="cursor-pointer"
            >
              <rect
                x="96"
                y="12"
                width="74"
                height="32"
                rx="6"
                fill="#b45309"
                stroke={selectedStartId === 'parkir_belakang' ? '#fde047' : '#f59e0b'}
                strokeWidth={selectedStartId === 'parkir_belakang' ? 2.5 : 1.5}
              />
              <text
                x="133"
                y="31"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="8.5"
                fontWeight="700"
              >
                Parkir Belakang
              </text>
            </g>

            {/* Main Campus Road Spine */}
            <rect x="142" y="46" width="20" height="350" fill="#1e293b" />
            <line
              x1="152"
              y1="52"
              x2="152"
              y2="390"
              stroke="#f8fafc"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              opacity="0.65"
            />

            {/* Parkir Depan */}
            <g
              onClick={() => onSelectStartOnMap('parkir_depan')}
              className="cursor-pointer"
            >
              <rect
                x="52"
                y="366"
                width="84"
                height="24"
                rx="5"
                fill="#1e293b"
                stroke={selectedStartId === 'parkir_depan' ? '#fde047' : '#64748b'}
                strokeWidth={selectedStartId === 'parkir_depan' ? 2.5 : 1.5}
              />
              <text
                x="94"
                y="381"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="8.5"
                fontWeight="700"
              >
                🏍 Parkir Depan
              </text>
            </g>

            {/* Patung Garuda & Gerbang Utama */}
            <circle cx="94" cy="414" r="14" fill="#d97706" opacity="0.92" />
            <text
              x="94"
              y="417"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="7"
              fontWeight="800"
            >
              INSTIKI
            </text>
            <g
              onClick={() => onSelectStartOnMap('gerbang')}
              className="cursor-pointer"
            >
              <circle
                cx="122"
                cy="414"
                r="10"
                fill="#16a34a"
                stroke={selectedStartId === 'gerbang' ? '#fde047' : '#ffffff'}
                strokeWidth={selectedStartId === 'gerbang' ? 2.5 : 1.5}
              />
              <text
                x="140"
                y="417"
                fill="#fde047"
                fontSize="8"
                fontWeight="700"
              >
                “Gerbang / Patung Garuda”
              </text>
            </g>

            {/* Gedung 1, 2, 3, 6, 5 (Left) & Gedung 4 (Right) */}
            {BUILDINGS.map((b) => {
              const isDest = dest?.buildingId === b.id;
              const isSelected = selectedBuildingId === b.id;
              return (
                <g
                  key={b.id}
                  onClick={() => onSelectBuilding(b.id)}
                  className="cursor-pointer"
                >
                  <rect
                    x={b.x}
                    y={b.y}
                    width={b.w}
                    height={b.h}
                    rx="7"
                    fill={b.color}
                    stroke={
                      isDest
                        ? '#fde047'
                        : isSelected
                          ? '#38bdf8'
                          : 'rgba(255,255,255,0.3)'
                    }
                    strokeWidth={isDest ? 3 : isSelected ? 2 : 1.3}
                  />
                  <text
                    x={b.x + b.w / 2}
                    y={b.y + 19}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="800"
                  >
                    {b.name}
                  </text>
                  <text
                    x={b.x + b.w / 2}
                    y={b.y + 32}
                    textAnchor="middle"
                    fill="#fef08a"
                    fontSize="7"
                    fontWeight="600"
                  >
                    {b.quickTag}
                  </text>
                  {/* Building Number Badge */}
                  <rect
                    x={b.x - 24}
                    y={b.y + 10}
                    width="20"
                    height="24"
                    rx="4"
                    fill="#0f172a"
                    stroke="rgba(255,255,255,0.35)"
                  />
                  <text
                    x={b.x - 14}
                    y={b.y + 26}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="800"
                  >
                    {b.id.replace('G', '')}
                  </text>
                </g>
              );
            })}

            {/* Cafetaria Label under G6 */}
            <text
              x="99"
              y="185"
              textAnchor="middle"
              fill="#fde68a"
              fontSize="7"
              fontWeight="700"
            >
              ☕ Cafetaria G6
            </text>

            {/* Outdoor Facilities (Right Column) */}
            {OUTDOOR_FACILITIES.map((o) => {
              const isDest = dest?.id === o.id;
              const fill =
                o.id === 'BASKET'
                  ? '#15803d'
                  : o.id === 'PANGGUNG'
                    ? '#78350f'
                    : '#92400e';
              return (
                <g
                  key={o.id}
                  onClick={() => onSelectRoom(o.id)}
                  className="cursor-pointer"
                >
                  <rect
                    x={o.x}
                    y={o.y}
                    width={o.w}
                    height={o.h}
                    rx="7"
                    fill={fill}
                    stroke={isDest ? '#fde047' : 'rgba(255,255,255,0.35)'}
                    strokeWidth={isDest ? 3 : 1.2}
                  />
                  <text
                    x={o.x + o.w / 2}
                    y={o.y + o.h / 2 + 3}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="8.5"
                    fontWeight="700"
                  >
                    {o.name}
                  </text>
                </g>
              );
            })}

            {/* Animated Route Line */}
            {routePathD && (
              <path
                d={routePathD}
                fill="none"
                stroke="#fde047"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6 6"
                className="animate-route-dash"
              />
            )}

            {/* Start Marker */}
            {start && (
              <circle
                cx={start.x}
                cy={start.y}
                r="5.5"
                fill="#22c55e"
                stroke="#ffffff"
                strokeWidth="2"
              />
            )}

            {/* Destination Marker */}
            {dest && (
              <circle
                cx={dest.x}
                cy={dest.y}
                r="6.5"
                fill="#ef4444"
                stroke="#fde047"
                strokeWidth="2.5"
              />
            )}

            {/* Live Walker Marker during Step/Simulation */}
            {activeStep && (
              <g
                transform={`translate(${activeStep.walkerPos.x}, ${activeStep.walkerPos.y})`}
                pointerEvents="none"
              >
                <circle
                  r="12"
                  fill="#38bdf8"
                  opacity="0.35"
                  className="animate-pulse-ring"
                />
                <circle
                  r="6"
                  fill="#0284c7"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </g>
            )}
          </svg>

          <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-600 px-1">
            <span>🟢 Awal ({start?.name})</span>
            <span>🔵 Posisi Jalan</span>
            <span>🔴 Ketuk gedung u/ lantai</span>
          </div>
        </div>
      ) : (
        /* Mode 2: Denah Lantai Gedung G1–G6 */
        <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h4 className="text-xs font-extrabold text-slate-900 truncate">
                {building.name} — {floorObj.label}
              </h4>
              <p className="text-[10px] text-slate-500 truncate">
                {building.subtitle}
              </p>
            </div>
            <select
              aria-label="Pilih Gedung"
              value={building.id}
              onChange={(e) =>
                onSelectBuilding(e.target.value as Exclude<BuildingId, 'OUTDOOR'>)
              }
              className="text-[11px] font-bold bg-slate-100 border border-slate-300 rounded-lg px-2 py-1 cursor-pointer shrink-0"
            >
              {BUILDINGS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Floor Tabs with Constraints (disabled floors that don't exist in this building) */}
          <div className="flex gap-1 overflow-x-auto pb-0.5">
            {ALL_POSSIBLE_FLOORS.map((fl) => {
              const exists = availableFloors.includes(fl);
              const active = safeFloor === fl;
              const isDestFloor =
                dest?.buildingId === building.id && dest.floor === fl;
              return (
                <button
                  key={fl}
                  type="button"
                  disabled={!exists}
                  title={
                    exists
                      ? `Lihat Lantai ${fl}`
                      : `Lantai ${fl} tidak tersedia di ${building.name}`
                  }
                  onClick={() => onSelectFloor(fl)}
                  className={`relative px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                    !exists
                      ? 'bg-slate-100 text-slate-400 border-slate-200 opacity-45 cursor-not-allowed'
                      : active
                        ? 'bg-[#1A2352] text-white border-[#1A2352] cursor-pointer'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 cursor-pointer'
                  }`}
                >
                  Lt. {fl}
                  {isDestFloor && !active && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#D32F2F] ring-2 ring-white" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Room Cards Grid */}
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-2.5">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center mb-2">
              Koridor & Ruangan {building.name} • Lantai {floorObj.floor}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {floorObj.rooms.map((r) => {
                const roomId = `${building.id}_${r.code}`;
                const isDest = dest?.id === roomId;
                return (
                  <button
                    key={roomId}
                    type="button"
                    onClick={() => onSelectRoom(roomId)}
                    className={`text-left p-2.5 rounded-xl border transition cursor-pointer ${
                      isDest
                        ? 'bg-[#D32F2F] text-white border-red-800 shadow-md ring-2 ring-amber-300'
                        : 'bg-white hover:bg-red-50 text-slate-800 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`text-[10px] font-extrabold ${
                          isDest ? 'text-amber-200' : 'text-[#D32F2F]'
                        }`}
                      >
                        {r.code}
                      </span>
                      {isDest && (
                        <span className="text-[8.5px] px-1.5 py-0.5 bg-amber-400 text-slate-950 rounded font-extrabold">
                          TUJUAN
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-bold leading-snug mt-0.5">
                      {r.name}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
              <span>
                {accessibleOnly
                  ? '♿ Jalur Landai / Lift Aktif'
                  : '🪜 Tangga Utama Gedung'}
              </span>
              <span>Ketuk ruang untuk ubah tujuan</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

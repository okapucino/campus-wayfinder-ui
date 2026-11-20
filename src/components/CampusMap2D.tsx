import React, { useState } from 'react';
import {
  CAMPUS_NODES,
  CampusNode,
  FloorNumber,
} from '../data/campusData';
import { ComputedRoute, RouteStep } from '../utils/pathfinder';
import { ZoomIn, ZoomOut, RotateCcw, Compass } from 'lucide-react';

interface CampusMap2DProps {
  viewFloor: FloorNumber;
  onChangeFloor: (floor: FloorNumber) => void;
  route: ComputedRoute | null;
  activeStepIndex: number;
  selectedStartId: string;
  selectedEndId: string | null;
  onSelectRoom: (node: CampusNode) => void;
}

const FLOORS: FloorNumber[] = [1, 2, 3, 4];

export const CampusMap2D: React.FC<CampusMap2DProps> = ({
  viewFloor,
  onChangeFloor,
  route,
  activeStepIndex,
  selectedStartId,
  selectedEndId,
  onSelectRoom,
}) => {
  const [zoom, setZoom] = useState<number>(1);

  const floorNodes = CAMPUS_NODES.filter((n) => n.floor === viewFloor && n.box);

  // Split route.nodePath into contiguous floor segments for clean SVG polylines
  const floorSegments: CampusNode[][] = [];
  if (route) {
    let currentSeg: CampusNode[] = [];
    for (const node of route.nodePath) {
      if (node.floor === viewFloor) {
        currentSeg.push(node);
      } else if (currentSeg.length > 0) {
        floorSegments.push(currentSeg);
        currentSeg = [];
      }
    }
    if (currentSeg.length > 0) {
      floorSegments.push(currentSeg);
    }
  }

  const activeStep: RouteStep | undefined = route?.steps[activeStepIndex];
  const activeStepFloorMatch = activeStep && activeStep.floor === viewFloor;
  const walkerNode = activeStep
    ? activeStep.kind === 'arrive'
      ? activeStep.toNode
      : activeStep.floor === viewFloor
        ? activeStep.fromNode
        : activeStep.targetFloor === viewFloor
          ? activeStep.toNode
          : null
    : null;

  // Check if route transitions floor on viewFloor (for helpful visual badge at stairs/lift)
  const transitionInfo = route?.steps.find(
    (s) =>
      (s.kind === 'stairs' || s.kind === 'elevator') &&
      s.floor === viewFloor &&
      s.targetFloor !== viewFloor
  );

  const floorsInRoute = new Set(route?.floorsInvolved ?? []);

  const getBoxColors = (node: CampusNode) => {
    const isStart = node.id === selectedStartId;
    const isEnd = node.id === selectedEndId;

    if (isEnd) {
      return {
        fill: '#FEF2F2',
        stroke: '#DC2626',
        text: '#991B1B',
        strokeWidth: 2.2,
      };
    }
    if (isStart) {
      return {
        fill: '#EFF6FF',
        stroke: '#2563EB',
        text: '#1E40AF',
        strokeWidth: 2.2,
      };
    }

    switch (node.kind) {
      case 'parking':
        return {
          fill: '#ECFDF5',
          stroke: '#10B981',
          text: '#065F46',
          strokeWidth: 1.5,
        };
      case 'stairs':
        return {
          fill: '#FFFBEB',
          stroke: '#F59E0B',
          text: '#92400E',
          strokeWidth: 1.5,
        };
      case 'elevator':
        return {
          fill: '#E0F2FE',
          stroke: '#0284C7',
          text: '#075985',
          strokeWidth: 1.6,
        };
      case 'facility':
        return {
          fill: '#F8FAFC',
          stroke: '#64748B',
          text: '#334155',
          strokeWidth: 1.4,
        };
      default:
        return {
          fill: '#FFFFFF',
          stroke: '#1E293B',
          text: '#0F172A',
          strokeWidth: 1.4,
        };
    }
  };

  return (
    <div className="relative bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
      {/* Top Floating Controls: Floor Switcher + Zoom */}
      <div className="flex items-center justify-between px-2.5 py-2 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="flex items-center gap-1" role="tablist" aria-label="Pilih Lantai">
          {FLOORS.map((fl) => {
            const active = viewFloor === fl;
            const inRoute = floorsInRoute.has(fl);
            return (
              <button
                key={fl}
                type="button"
                onClick={() => onChangeFloor(fl)}
                className={`relative px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#1A2352] text-white shadow-sm'
                    : inRoute
                      ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Lt. {fl}
                {inRoute && !active && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Perkecil Peta"
            onClick={() => setZoom((z) => Math.max(0.9, Number((z - 0.15).toFixed(2))))}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Perbesar Peta"
            onClick={() => setZoom((z) => Math.min(1.45, Number((z + 0.15).toFixed(2))))}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          {zoom !== 1 && (
            <button
              type="button"
              title="Reset Zoom"
              onClick={() => setZoom(1)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable SVG Floor Plan Viewport */}
      <div className="relative overflow-auto max-h-[285px] phone-scroll bg-[#EEF2F6]">
        {/* Compass Badge */}
        <div className="sticky top-2 left-2 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 border border-slate-200 text-[10px] font-semibold text-slate-600 shadow-xs ml-2 mt-2 pointer-events-none">
          <Compass className="w-3 h-3 text-[#1A2352]" />
          <span>Utara ↑ • Lantai {viewFloor}</span>
        </div>

        <div
          className="flex justify-center transition-transform duration-200 origin-top"
          style={{
            transform: `scale(${zoom})`,
            height: `${275 * zoom}px`,
          }}
        >
          <svg
            viewBox="0 0 360 402"
            className="w-full max-w-[345px] h-auto select-none -mt-4"
            aria-label={`Denah Kampus INSTIKI Lantai ${viewFloor}`}
          >
            <defs>
              <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="#CBD5E1"
                  strokeWidth="0.4"
                  opacity="0.5"
                />
              </pattern>
            </defs>

            {/* Campus Ground */}
            <rect x="0" y="0" width="360" height="402" fill="url(#gridPattern)" />

            {/* Outdoor Context on Floors 2-4 (subtle outline so spatial mental model stays consistent) */}
            {viewFloor > 1 && (
              <g opacity="0.45">
                <rect
                  x="24"
                  y="16"
                  width="312"
                  height="72"
                  rx="10"
                  fill="#E2E8F0"
                  stroke="#CBD5E1"
                  strokeDasharray="4 3"
                />
                <text
                  x="180"
                  y="56"
                  textAnchor="middle"
                  fontSize="9.5"
                  fill="#64748B"
                  fontWeight="600"
                >
                  Area Parkir Belakang & Kantin (di Lantai 1)
                </text>
                <rect
                  x="24"
                  y="326"
                  width="312"
                  height="62"
                  rx="10"
                  fill="#E2E8F0"
                  stroke="#CBD5E1"
                  strokeDasharray="4 3"
                />
                <text
                  x="180"
                  y="360"
                  textAnchor="middle"
                  fontSize="9.5"
                  fill="#64748B"
                  fontWeight="600"
                >
                  Halaman Parkir Depan & Jl. Tukad Pakerisan (Lantai 1)
                </text>
              </g>
            )}

            {/* Main Campus Building Shell */}
            <rect
              x="18"
              y="104"
              width="324"
              height="212"
              rx="14"
              fill="#FFFFFF"
              stroke="#94A3B8"
              strokeWidth="2"
            />

            {/* Hallway / Corridor Walkways */}
            {/* Vertical Spine Corridor */}
            <rect x="160" y="114" width="40" height="192" rx="6" fill="#F1F5F9" />
            {/* Top Horizontal Corridor */}
            <rect x="30" y="124" width="170" height="32" rx="6" fill="#F1F5F9" />
            {/* Bottom Horizontal Corridor */}
            <rect x="30" y="262" width="170" height="32" rx="6" fill="#F1F5F9" />
            {/* East Wing Corridor to Lift */}
            <rect x="160" y="194" width="150" height="32" rx="6" fill="#F1F5F9" />

            <text
              x="180"
              y="186"
              textAnchor="middle"
              fontSize="7.5"
              fill="#94A3B8"
              fontWeight="700"
              letterSpacing="1"
            >
              KORIDOR
            </text>

            {/* Street Label on Floor 1 */}
            {viewFloor === 1 && (
              <g>
                <text
                  x="180"
                  y="398"
                  textAnchor="middle"
                  fontSize="8"
                  fill="#475569"
                  fontWeight="700"
                >
                  ▲ Gerbang Utama — Jl. Tukad Pakerisan No. 97 ▲
                </text>
              </g>
            )}

            {/* Room & Area Polygons */}
            {floorNodes.map((node) => {
              if (!node.box) return null;
              const colors = getBoxColors(node);
              const isStart = node.id === selectedStartId;
              const isEnd = node.id === selectedEndId;
              const label = node.shortLabel ?? node.label;

              return (
                <g
                  key={node.id}
                  onClick={() => onSelectRoom(node)}
                  className="cursor-pointer group"
                >
                  <rect
                    x={node.box.x}
                    y={node.box.y}
                    width={node.box.w}
                    height={node.box.h}
                    rx="8"
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth={colors.strokeWidth}
                  />
                  {/* Room Kind Tag */}
                  {node.kind === 'stairs' && (
                    <text
                      x={node.box.x + node.box.w / 2}
                      y={node.box.y + 18}
                      textAnchor="middle"
                      fontSize="10"
                    >
                      🪜
                    </text>
                  )}
                  {node.kind === 'elevator' && (
                    <text
                      x={node.box.x + node.box.w / 2}
                      y={node.box.y + 15}
                      textAnchor="middle"
                      fontSize="9"
                    >
                      🛗
                    </text>
                  )}
                  {node.kind === 'parking' && (
                    <text
                      x={node.box.x + node.box.w / 2}
                      y={node.box.y + 23}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="800"
                      fill={colors.text}
                    >
                      🅿️ {node.id === 'parkir-mobil' ? 'MOBIL' : 'MOTOR'}
                    </text>
                  )}

                  <text
                    x={node.box.x + node.box.w / 2}
                    y={
                      node.kind === 'parking'
                        ? node.box.y + 42
                        : node.kind === 'stairs' || node.kind === 'elevator'
                          ? node.box.y + node.box.h - 10
                          : node.box.y + node.box.h / 2 + 3
                    }
                    textAnchor="middle"
                    fontSize={node.box.w < 75 ? '8.5' : '9.5'}
                    fontWeight="700"
                    fill={colors.text}
                  >
                    {label}
                  </text>

                  {/* Start / Destination Pill */}
                  {isStart && (
                    <g transform={`translate(${node.box.x + node.box.w / 2}, ${node.box.y + 6})`}>
                      <rect x="-24" y="-9" width="48" height="14" rx="7" fill="#2563EB" />
                      <text
                        x="0"
                        y="1"
                        textAnchor="middle"
                        fontSize="7.5"
                        fontWeight="800"
                        fill="#FFFFFF"
                      >
                        MULAI
                      </text>
                    </g>
                  )}
                  {isEnd && (
                    <g transform={`translate(${node.box.x + node.box.w / 2}, ${node.box.y + 6})`}>
                      <rect x="-26" y="-9" width="52" height="14" rx="7" fill="#DC2626" />
                      <text
                        x="0"
                        y="1"
                        textAnchor="middle"
                        fontSize="7.5"
                        fontWeight="800"
                        fill="#FFFFFF"
                      >
                        TUJUAN
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Route Polyline Paths on this Floor */}
            {floorSegments.map((seg, idx) => {
              if (seg.length < 2) return null;
              const points = seg.map((n) => `${n.x},${n.y}`).join(' ');
              return (
                <g key={`seg-${idx}`} pointerEvents="none">
                  {/* Soft glow backdrop */}
                  <polyline
                    points={points}
                    fill="none"
                    stroke="#FCA5A5"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.55"
                  />
                  {/* Animated dashed Crimson line */}
                  <polyline
                    points={points}
                    fill="none"
                    stroke="#DC2626"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="6 6"
                    className="animate-route-dash"
                  />
                </g>
              );
            })}

            {/* Active Step Segment Highlight */}
            {activeStepFloorMatch &&
              activeStep.targetFloor === viewFloor &&
              activeStep.fromNode.id !== activeStep.toNode.id && (
                <line
                  x1={activeStep.fromNode.x}
                  y1={activeStep.fromNode.y}
                  x2={activeStep.toNode.x}
                  y2={activeStep.toNode.y}
                  stroke="#1A2352"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  pointerEvents="none"
                />
              )}

            {/* Floor Transition Hint Badge (e.g. "Naik ke Lt. 2") */}
            {transitionInfo && (
              <g
                transform={`translate(${transitionInfo.fromNode.x}, ${transitionInfo.fromNode.y - 24})`}
                onClick={() => onChangeFloor(transitionInfo.targetFloor)}
                className="cursor-pointer"
              >
                <rect
                  x="-42"
                  y="-11"
                  width="84"
                  height="20"
                  rx="10"
                  fill="#F59E0B"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                />
                <text
                  x="0"
                  y="2"
                  textAnchor="middle"
                  fontSize="8.5"
                  fontWeight="800"
                  fill="#1E293B"
                >
                  {transitionInfo.targetFloor > viewFloor ? '▲ Naik' : '▼ Turun'} ke Lt.{' '}
                  {transitionInfo.targetFloor}
                </text>
              </g>
            )}

            {/* Active Walker / User Position Dot */}
            {walkerNode && (
              <g
                transform={`translate(${walkerNode.x}, ${walkerNode.y})`}
                pointerEvents="none"
              >
                <circle r="13" fill="#2563EB" opacity="0.25" className="animate-pulse-ring" />
                <circle r="7" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-white border-t border-slate-200 text-[10px] text-slate-600">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Posisi Kamu
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-red-600 inline-block" /> Jalur Rute
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-sky-200 border border-sky-600 inline-block" /> Lift
          </span>
        </div>
        <span className="text-slate-400 italic">Ketuk ruang di peta untuk detail</span>
      </div>
    </div>
  );
};

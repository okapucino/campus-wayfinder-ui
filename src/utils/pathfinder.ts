import {
  ALL_ROOMS,
  RECOVER_LANDMARKS,
  RoomItem,
  START_POINTS,
  StartPoint,
} from '../data/campusData';

export interface RouteStep {
  id: string;
  kind: 'start' | 'walk' | 'vertical' | 'arrive';
  instruction: string;
  landmarkHint?: string;
  distanceMeters: number;
  /** SVG coordinates on Campus Map (320 x 440) for animated walker simulation */
  walkerPos: { x: number; y: number };
  /** Whether this step should automatically focus the floor plan view */
  focusFloorView?: boolean;
}

export interface ComputedRoute {
  startPoint: StartPoint;
  destRoom: RoomItem;
  pathPoints: { x: number; y: number }[];
  steps: RouteStep[];
  totalDistanceMeters: number;
  estimatedMinutes: number;
}

const ROAD_X = 152;

export function getStartOrLandmarkById(id: string): StartPoint {
  return (
    START_POINTS.find((s) => s.id === id) ??
    RECOVER_LANDMARKS.find((l) => l.id === id) ??
    START_POINTS[0]
  );
}

export function computeCampusRoute(
  startId: string,
  destRoomId: string,
  options?: { accessibleOnly?: boolean }
): ComputedRoute | null {
  const startPoint = getStartOrLandmarkById(startId);
  const destRoom = ALL_ROOMS.find((r) => r.id === destRoomId);
  if (!destRoom) return null;

  const accessibleOnly = Boolean(options?.accessibleOnly);

  const p0 = { x: startPoint.x, y: startPoint.y };
  const p1 = { x: ROAD_X, y: startPoint.y };
  const p2 = { x: ROAD_X, y: destRoom.y };
  const p3 = { x: destRoom.x, y: destRoom.y };
  const pathPoints = [p0, p1, p2, p3];

  // Calculate SVG path length converted to approximate campus meters (~0.32m per SVG unit)
  let svgLen = 0;
  for (let i = 0; i < pathPoints.length - 1; i++) {
    const dx = pathPoints[i + 1].x - pathPoints[i].x;
    const dy = pathPoints[i + 1].y - pathPoints[i].y;
    svgLen += Math.hypot(dx, dy);
  }
  const horizontalMeters = Math.max(15, Math.round(svgLen * 0.32));
  const floorMeters = destRoom.floor > 1 ? (destRoom.floor - 1) * 14 : 0;
  const totalDistanceMeters = horizontalMeters + floorMeters;
  const estimatedMinutes = Math.max(
    1,
    Math.ceil((horizontalMeters / 55) + (destRoom.floor - 1) * 0.6)
  );

  const steps: RouteStep[] = [];

  // Step 1: Origin
  steps.push({
    id: 'step-start',
    kind: 'start',
    instruction: `Mulai dari ${startPoint.name} dan keluar menuju jalan utama tengah kampus.`,
    landmarkHint: startPoint.desc,
    distanceMeters: Math.round(Math.abs(ROAD_X - startPoint.x) * 0.32),
    walkerPos: p1,
  });

  // Step 2: Walk along main road to building / outdoor zone
  const goingSouth = destRoom.y > startPoint.y;
  const isLeftSide = ['G1', 'G2', 'G3', 'G6', 'G5'].includes(destRoom.buildingId);
  const sideLabel =
    destRoom.buildingId === 'OUTDOOR'
      ? 'sisi kanan halaman kampus'
      : isLeftSide
        ? 'sisi kiri jalan utama'
        : 'sisi kanan melewati Lapangan Basket';

  const midPoint = {
    x: ROAD_X,
    y: Math.round((p1.y + p2.y) / 2),
  };

  if (destRoom.buildingId === 'OUTDOOR') {
    steps.push({
      id: 'step-walk',
      kind: 'walk',
      instruction: `Jalan ${goingSouth ? 'ke selatan' : 'ke utara'} di jalur utama, lalu belok ke ${sideLabel} menuju ${destRoom.name}.`,
      landmarkHint: 'Area terbuka di sebelah timur jalan utama kampus',
      distanceMeters: Math.round(Math.abs(p2.y - p1.y) * 0.32),
      walkerPos: midPoint,
    });
    steps.push({
      id: 'step-arrive',
      kind: 'arrive',
      instruction: `Kamu sudah tiba di ${destRoom.name}.`,
      landmarkHint: destRoom.desc,
      distanceMeters: 0,
      walkerPos: p3,
    });
  } else {
    steps.push({
      id: 'step-walk',
      kind: 'walk',
      instruction: `Susuri jalan utama ke arah ${goingSouth ? 'selatan (arah Gerbang)' : 'utara (arah Belakang)'} menuju ${destRoom.buildingName} di ${sideLabel}.`,
      landmarkHint:
        destRoom.buildingId === 'G4'
          ? 'Seberang Gedung 3, di sebelah utara Lapangan Basket'
          : destRoom.buildingId === 'G6'
            ? 'Dekat area Cafetaria di lantai dasar'
            : `Perhatikan penanda nomor gedung [${destRoom.buildingId.replace('G', '')}] pada fasad`,
      distanceMeters: Math.round(Math.abs(p2.y - p1.y) * 0.32),
      walkerPos: p2,
    });

    if (destRoom.floor > 1) {
      steps.push({
        id: 'step-vertical',
        kind: 'vertical',
        instruction: accessibleOnly
          ? `Gunakan akses landai / lift prioritas di ${destRoom.buildingName} menuju Lantai ${destRoom.floor}.`
          : `Masuk ${destRoom.buildingName}, lalu naik tangga menuju Lantai ${destRoom.floor} (kode ruang ${destRoom.buildingId.replace('G', '')}${destRoom.floor}x).`,
        landmarkHint: `Ingat aturan kode ruang: Digit 1 (${destRoom.buildingId.replace('G', '')}) = Gedung, Digit 2 (${destRoom.floor}) = Lantai`,
        distanceMeters: floorMeters,
        walkerPos: p3,
        focusFloorView: true,
      });
    } else {
      steps.push({
        id: 'step-floor1',
        kind: 'walk',
        instruction: `Masuk ke area Lantai 1 ${destRoom.buildingName}.`,
        landmarkHint: `Ikuti papan petunjuk ruang di koridor dasar`,
        distanceMeters: 10,
        walkerPos: p3,
        focusFloorView: true,
      });
    }

    steps.push({
      id: 'step-arrive',
      kind: 'arrive',
      instruction: `Kamu sudah tiba di ${destRoom.name} (${destRoom.buildingName}, ${destRoom.floorLabel}).`,
      landmarkHint: destRoom.desc,
      distanceMeters: 0,
      walkerPos: p3,
      focusFloorView: true,
    });
  }

  return {
    startPoint,
    destRoom,
    pathPoints,
    steps,
    totalDistanceMeters,
    estimatedMinutes,
  };
}

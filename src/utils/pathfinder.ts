import {
  CAMPUS_EDGES,
  CAMPUS_NODES,
  CampusEdge,
  CampusNode,
  FloorNumber,
} from '../data/campusData';

export interface RouteStep {
  id: string;
  fromNode: CampusNode;
  toNode: CampusNode;
  floor: FloorNumber;
  targetFloor: FloorNumber;
  instruction: string;
  landmarkHint?: string;
  distanceMeters: number;
  kind: 'walk' | 'stairs' | 'elevator' | 'arrive';
  /** All node IDs covered by this step (useful for merged elevator/stair segments) */
  nodeIds: string[];
}

export interface ComputedRoute {
  startNode: CampusNode;
  endNode: CampusNode;
  nodePath: CampusNode[];
  steps: RouteStep[];
  totalDistanceMeters: number;
  estimatedMinutes: number;
  floorsInvolved: FloorNumber[];
  usesElevator: boolean;
  usesStairs: boolean;
}

const nodeMap = new Map<string, CampusNode>(CAMPUS_NODES.map((n) => [n.id, n]));

export function getNodeById(id: string): CampusNode | undefined {
  return nodeMap.get(id);
}

interface AdjacencyItem {
  neighborId: string;
  edge: CampusEdge;
  forward: boolean;
}

function buildAdjacency(accessibleOnly: boolean): Map<string, AdjacencyItem[]> {
  const adj = new Map<string, AdjacencyItem[]>();
  for (const node of CAMPUS_NODES) {
    adj.set(node.id, []);
  }
  for (const edge of CAMPUS_EDGES) {
    if (accessibleOnly && edge.isStairs) continue;
    adj.get(edge.from)?.push({ neighborId: edge.to, edge, forward: true });
    adj.get(edge.to)?.push({ neighborId: edge.from, edge, forward: false });
  }
  return adj;
}

export function findCampusRoute(
  startNodeId: string,
  endNodeId: string,
  options?: { accessibleOnly?: boolean }
): ComputedRoute | null {
  const startNode = nodeMap.get(startNodeId);
  const endNode = nodeMap.get(endNodeId);
  if (!startNode || !endNode) return null;

  const accessibleOnly = Boolean(options?.accessibleOnly);
  const adj = buildAdjacency(accessibleOnly);

  const dist = new Map<string, number>();
  const prev = new Map<string, { nodeId: string; item: AdjacencyItem } | null>();
  const visited = new Set<string>();

  for (const n of CAMPUS_NODES) {
    dist.set(n.id, Infinity);
    prev.set(n.id, null);
  }
  dist.set(startNodeId, 0);

  while (true) {
    let u: string | null = null;
    let best = Infinity;
    for (const [id, d] of dist.entries()) {
      if (!visited.has(id) && d < best) {
        best = d;
        u = id;
      }
    }
    if (u === null || u === endNodeId || best === Infinity) break;
    visited.add(u);

    const neighbors = adj.get(u) ?? [];
    for (const item of neighbors) {
      if (visited.has(item.neighborId)) continue;
      // Slight penalty on elevator wait time when stairs are allowed so normal users prefer nearest stairs
      const weight =
        item.edge.distanceMeters + (!accessibleOnly && item.edge.isElevator ? 14 : 0);
      const alt = best + weight;
      if (alt < (dist.get(item.neighborId) ?? Infinity)) {
        dist.set(item.neighborId, alt);
        prev.set(item.neighborId, { nodeId: u, item });
      }
    }
  }

  if ((dist.get(endNodeId) ?? Infinity) === Infinity) return null;

  // Reconstruct node + edge path
  const edgeSequence: { from: CampusNode; to: CampusNode; item: AdjacencyItem }[] = [];
  let curr = endNodeId;
  while (curr !== startNodeId) {
    const p = prev.get(curr);
    if (!p) break;
    const fromN = nodeMap.get(p.nodeId)!;
    const toN = nodeMap.get(curr)!;
    edgeSequence.unshift({ from: fromN, to: toN, item: p.item });
    curr = p.nodeId;
  }

  const nodePath: CampusNode[] = [startNode, ...edgeSequence.map((e) => e.to)];

  // Build human-friendly steps (merging multi-floor elevator or continuous stair flights)
  const steps: RouteStep[] = [];
  let i = 0;
  let totalDistanceMeters = 0;
  let usesElevator = false;
  let usesStairs = false;

  while (i < edgeSequence.length) {
    const seg = edgeSequence[i];
    if (seg.item.edge.isElevator) {
      usesElevator = true;
      const startLift = seg.from;
      const covered = [seg.from.id, seg.to.id];
      let liftDist = seg.item.edge.distanceMeters;
      let endLift = seg.to;
      while (i + 1 < edgeSequence.length && edgeSequence[i + 1].item.edge.isElevator) {
        i++;
        endLift = edgeSequence[i].to;
        liftDist += edgeSequence[i].item.edge.distanceMeters;
        covered.push(endLift.id);
      }
      totalDistanceMeters += liftDist;
      const goingUp = endLift.floor > startLift.floor;
      steps.push({
        id: `step-${steps.length + 1}`,
        fromNode: startLift,
        toNode: endLift,
        floor: startLift.floor,
        targetFloor: endLift.floor,
        instruction: `Masuk Lift Kampus di Lt. ${startLift.floor}, tekan tombol [${endLift.floor}] untuk ${goingUp ? 'naik' : 'turun'} langsung ke Lantai ${endLift.floor}.`,
        landmarkHint: 'Keluar lift lalu ikuti papan penunjuk ruangan',
        distanceMeters: liftDist,
        kind: 'elevator',
        nodeIds: covered,
      });
      i++;
      continue;
    }

    if (seg.item.edge.isStairs) {
      usesStairs = true;
      const startStair = seg.from;
      const covered = [seg.from.id, seg.to.id];
      let stairDist = seg.item.edge.distanceMeters;
      let endStair = seg.to;
      while (i + 1 < edgeSequence.length && edgeSequence[i + 1].item.edge.isStairs) {
        i++;
        endStair = edgeSequence[i].to;
        stairDist += edgeSequence[i].item.edge.distanceMeters;
        covered.push(endStair.id);
      }
      totalDistanceMeters += stairDist;
      const goingUp = endStair.floor > startStair.floor;
      const stairName = startStair.id.includes('utama')
        ? 'Tangga Utama'
        : 'Tangga Belakang (Utara)';
      steps.push({
        id: `step-${steps.length + 1}`,
        fromNode: startStair,
        toNode: endStair,
        floor: startStair.floor,
        targetFloor: endStair.floor,
        instruction: `${goingUp ? 'Naik' : 'Turun'} ${stairName} dari Lantai ${startStair.floor} menuju Lantai ${endStair.floor}.`,
        landmarkHint: `Perhatikan nomor lantai [${endStair.floor}] di dinding bordes tangga`,
        distanceMeters: stairDist,
        kind: 'stairs',
        nodeIds: covered,
      });
      i++;
      continue;
    }

    totalDistanceMeters += seg.item.edge.distanceMeters;
    const instruction = seg.item.forward
      ? seg.item.edge.instructionForward
      : seg.item.edge.instructionBackward;
    steps.push({
      id: `step-${steps.length + 1}`,
      fromNode: seg.from,
      toNode: seg.to,
      floor: seg.from.floor,
      targetFloor: seg.to.floor,
      instruction,
      landmarkHint: seg.item.edge.landmarkHint,
      distanceMeters: seg.item.edge.distanceMeters,
      kind: 'walk',
      nodeIds: [seg.from.id, seg.to.id],
    });
    i++;
  }

  // Final arrival step
  steps.push({
    id: `step-arrive`,
    fromNode: endNode,
    toNode: endNode,
    floor: endNode.floor,
    targetFloor: endNode.floor,
    instruction: `Kamu sudah tiba di ${endNode.label} (Lantai ${endNode.floor}).`,
    landmarkHint: endNode.landmark ?? 'Silakan masuk ke ruangan kelas',
    distanceMeters: 0,
    kind: 'arrive',
    nodeIds: [endNode.id],
  });

  const floorsSet = new Set<FloorNumber>();
  for (const n of nodePath) floorsSet.add(n.floor);
  const floorsInvolved = Array.from(floorsSet).sort((a, b) => a - b);

  // Walking speed ~ 60 m/min + 20s per floor transition
  const floorTransitions = Math.abs(endNode.floor - startNode.floor);
  const estimatedSeconds = Math.round((totalDistanceMeters / 60) * 60 + floorTransitions * 20);
  const estimatedMinutes = Math.max(1, Math.ceil(estimatedSeconds / 60));

  return {
    startNode,
    endNode,
    nodePath,
    steps,
    totalDistanceMeters,
    estimatedMinutes,
    floorsInvolved,
    usesElevator,
    usesStairs,
  };
}

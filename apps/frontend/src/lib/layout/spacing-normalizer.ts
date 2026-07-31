/**
 * Parts 2, 3, 9, 10 — Grid Alignment, Node Spacing, Parent–Child, Symmetry
 *
 * Pipeline step that runs AFTER dagre:
 *   1. Groups nodes by assigned layer
 *   2. Orders nodes within each layer (category grouping + predecessor heuristic)
 *   3. Spaces nodes horizontally within layers (150–250px gaps)
 *   4. Positions layers vertically (120–200px gaps)
 *   5. All nodes in the same layer share the same Y
 *   6. Same-category nodes grouped together (Part 10 symmetry)
 */

import type { Node, Edge } from "@xyflow/react";
import type { ArchitectureNodeData } from "@/components/nodes/types";
import type { LayerIndex, SpacingConfig } from "./types";
import { DEFAULT_SPACING } from "./types";
import { assignLayerForNode } from "./layer-assigner";

/* ── Category sort order for within-layer grouping ── */
const CAT_ORDER: Record<string, number> = {
  user: 0, frontend: 1, infrastructure: 2, backend: 3,
  messaging: 4, database: 5, storage: 6, ai: 7, external: 8, monitoring: 9,
};

function computeDynamicSpacing(
  totalNodes: number,
  maxNodesInLayer: number,
  base: SpacingConfig,
): Required<SpacingConfig> {
  const scale = Math.max(1, Math.ceil(maxNodesInLayer / 5) * 0.3);
  const clamp = (val: number, min: number, max: number) =>
    Math.max(min, Math.min(max, val));

  return {
    minHorizontalGap: clamp(
      Math.round(base.minHorizontalGap * scale),
      base.minHorizontalGap,
      base.maxHorizontalGap,
    ),
    maxHorizontalGap: base.maxHorizontalGap,
    minVerticalGap: clamp(
      Math.round(base.minVerticalGap * Math.min(scale, 1.5)),
      base.minVerticalGap,
      base.maxVerticalGap,
    ),
    maxVerticalGap: base.maxVerticalGap,
  };
}

export function normalizeSpacing(
  nodes: Node<ArchitectureNodeData>[],
  edges: Edge[],
  spacingConfig: SpacingConfig = DEFAULT_SPACING,
): Node<ArchitectureNodeData>[] {
  if (nodes.length === 0) return nodes;

  // 1. Group nodes by assigned layer
  const layers = new Map<LayerIndex, Node<ArchitectureNodeData>[]>();
  for (const node of nodes) {
    const layer = assignLayerForNode(node.data.label, node.data.category);
    const arr = layers.get(layer) ?? [];
    arr.push(node);
    layers.set(layer, arr);
  }

  const sortedLayers = Array.from(layers.entries()).sort(([a], [b]) => a - b);
  const maxNodesInLayer = Math.max(
    ...Array.from(layers.values()).map((n) => n.length),
    1,
  );
  const spacing = computeDynamicSpacing(nodes.length, maxNodesInLayer, spacingConfig);

  // 2. Predecessor map for ordering heuristic
  const predMap = new Map<string, Set<string>>();
  for (const edge of edges) {
    const preds = predMap.get(edge.target) ?? new Set();
    preds.add(edge.source);
    predMap.set(edge.target, preds);
  }

  // 3. Order & position each layer
  const updated = new Map<string, Node<ArchitectureNodeData>>();
  let currentY = 40;

  // 3b. Use dagre's overall bounding-box center so ALL layers share
  // one consistent center — columns align vertically across layers
  let globalMinX = Infinity;
  let globalMaxX = -Infinity;
  for (const node of nodes) {
    const w = (node as any).width ?? 220;
    const cx = node.position.x + w / 2;
    if (cx < globalMinX) globalMinX = cx;
    if (cx > globalMaxX) globalMaxX = cx;
  }
  const globalCenterX = globalMinX === Infinity ? 300 : (globalMinX + globalMaxX) / 2;

  // 3c. Order within each layer by dagre's X (preserves crossing-minimized order)
  for (const [_layerIdx, nodesInLayer] of sortedLayers) {
    const ordered = [...nodesInLayer].sort((a, b) => {
      const ca = CAT_ORDER[a.data.category] ?? 99;
      const cb = CAT_ORDER[b.data.category] ?? 99;
      if (ca !== cb) return ca - cb;
      return a.position.x - b.position.x;
    });

    const totalWidth = ordered.reduce(
      (sum, n) => sum + ((n as any).width ?? 220), 0,
    );
    const totalGaps = spacing.minHorizontalGap * (ordered.length - 1);

    // Center this layer's content block on the GLOBAL center X
    // No Math.min/max guard — negative coordinates are valid on the infinite canvas
    const layerContentWidth = totalWidth + totalGaps;
    const startX = globalCenterX - layerContentWidth / 2;

    // 3e. Layer height
    const layerHeight = Math.max(
      ...ordered.map((n) => (n as any).height ?? 130),
    );

    // 3f. Assign positions — ALL nodes in this layer get the same Y
    let cursorX = startX;
    for (const node of ordered) {
      const w = (node as any).width ?? 220;
      updated.set(node.id, {
        ...node,
        position: {
          x: Math.round(cursorX),
          y: Math.round(currentY),
        },
      });
      cursorX += w + spacing.minHorizontalGap;
    }

    currentY += layerHeight + spacing.minVerticalGap;
  }

  return nodes.map((n) => updated.get(n.id) ?? n);
}

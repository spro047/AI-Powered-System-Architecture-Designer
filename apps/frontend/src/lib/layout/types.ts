import type { Node, Edge } from "@xyflow/react";
import type { ArchitectureCategory, ArchitectureNodeData } from "@/components/nodes/types";

/** Allowed connector anchor points (mirrors @xyflow/react Position)*/
export type AnchorSide = "top" | "bottom" | "left" | "right";

/** Layer index (0=top, 5=bottom) */
export type LayerIndex = 0 | 1 | 2 | 3 | 4 | 5;

/** A node enriched with computed layer info */
export interface LayeredNode {
  id: string;
  label: string;
  category: ArchitectureCategory;
  layer: LayerIndex;
  width: number;
  height: number;
}

/** Layout engine input */
export interface LayoutInput {
  nodes: Node<ArchitectureNodeData>[];
  edges: Edge[];
}

/** Layout engine output — repositioned nodes + edges with anchor handles */
export interface LayoutOutput {
  nodes: Node<ArchitectureNodeData>[];
  edges: Edge[];
}

/** Validation result for one quality rule */
export interface ValidationIssue {
  rule: string;
  passed: boolean;
  message?: string;
}

/** Grid configuration */
export interface GridConfig {
  /** Grid cell size in px — all positions snap to multiples of this */
  cellSize: number;
}

/** Spacing configuration */
export interface SpacingConfig {
  /** Min horizontal gap between nodes in the same layer (px) */
  minHorizontalGap: number;
  /** Max horizontal gap between nodes in the same layer (px) */
  maxHorizontalGap: number;
  /** Min vertical gap between layers (px) */
  minVerticalGap: number;
  /** Max vertical gap between layers (px) */
  maxVerticalGap: number;
}

export const DEFAULT_GRID: GridConfig = { cellSize: 20 };

export const DEFAULT_SPACING: SpacingConfig = {
  minHorizontalGap: 150,
  maxHorizontalGap: 250,
  minVerticalGap: 120,
  maxVerticalGap: 200,
};

/** Layer assignment map: ArchitectureCategory → layer index */
export const CATEGORY_LAYER: Record<ArchitectureCategory, LayerIndex> = {
  user: 0,
  frontend: 1,
  infrastructure: 1,
  backend: 2,
  messaging: 2,
  database: 3,
  storage: 3,
  ai: 4,
  external: 4,
  monitoring: 5,
};

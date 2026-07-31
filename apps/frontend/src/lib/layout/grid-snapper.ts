/**
 * Part 2 — Grid Alignment (System_Arch.md Part 2)
 *
 * Snaps every node position to an invisible grid so that:
 *   - Same row = perfectly aligned Y
 *   - Same column = perfectly aligned X
 *   - The diagram looks mathematically balanced
 */

import type { Node } from "@xyflow/react";
import type { ArchitectureNodeData } from "@/components/nodes/types";
import type { GridConfig } from "./types";
import { DEFAULT_GRID } from "./types";

/**
 * Snap a single coordinate to the nearest grid point.
 */
export function snapToGrid(value: number, cellSize: number = DEFAULT_GRID.cellSize): number {
  return Math.round(value / cellSize) * cellSize;
}

/**
 * Snap all node positions to the grid.
 */
export function snapNodesToGrid(
  nodes: Node<ArchitectureNodeData>[],
  config: GridConfig = DEFAULT_GRID,
): Node<ArchitectureNodeData>[] {
  const { cellSize } = config;

  return nodes.map((node) => ({
    ...node,
    position: {
      x: snapToGrid(node.position.x, cellSize),
      y: snapToGrid(node.position.y, cellSize),
    },
  }));
}

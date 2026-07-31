/**
 * dagre Adapter — Part 1 (initial positioning)
 *
 * Runs dagre to compute a hierarchical layout.  dagre handles:
 *   - Topological ordering (what precedes what)
 *   - Within-layer ordering that minimises edge crossings
 *   - Basic node positioning
 *
 * The result is then fed into the post-processors:
 *   grid-snapper, spacing-normalizer, symmetry-enforcer.
 */

import dagre from "dagre";
import type { Node, Edge } from "@xyflow/react";
import type { ArchitectureNodeData } from "@/components/nodes/types";
import type { LayoutInput } from "./types";

export interface DagreResult {
  nodes: Node<ArchitectureNodeData>[];
  /** dagre's internal bounding-box center positions (before offset) */
  centers: Map<string, { x: number; y: number }>;
}

/**
 * Run dagre to get initial node positions.
 *
 * @param input       Nodes + edges (React Flow format)
 * @param direction   "TB" = top-to-bottom (default for architecture diagrams)
 * @param nodeSep     Minimum node separation (vertical when TB)
 * @param rankSep     Minimum rank (layer) separation (horizontal when TB)
 */
export function runDagre(
  input: LayoutInput,
  direction: "TB" | "LR" = "TB",
  nodeSep = 80,
  rankSep = 120,
): DagreResult {
  const { nodes, edges } = input;

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: direction,
    nodesep: nodeSep,
    ranksep: rankSep,
    // Prevent dagre from re-ranking nodes — we want strict layer alignment
    // but dagre doesn't have a "fixed rank" flag, so we post-process.
  });

  // Register nodes with their dimensions
  for (const node of nodes) {
    const w = (node as any).width ?? 220;
    const h = (node as any).height ?? 130;
    g.setNode(node.id, { width: w, height: h });
  }

  // Register edges
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  // Compute layout
  dagre.layout(g);

  // Extract positions
  const centers = new Map<string, { x: number; y: number }>();
  const positionedNodes = nodes.map((node) => {
    const pos = g.node(node.id);
    const w = (node as any).width ?? 220;
    const h = (node as any).height ?? 130;
    const cx = pos.x;
    const cy = pos.y;
    centers.set(node.id, { x: cx, y: cy });

    return {
      ...node,
      position: {
        x: cx - w / 2,
        y: cy - h / 2,
      },
    };
  });

  return { nodes: positionedNodes, centers };
}

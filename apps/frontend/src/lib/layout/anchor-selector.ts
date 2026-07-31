/**
 * Parts 4, 5, 6 — Connector Anchor Rules, Multiple Connections, Edge Routing
 *
 * Assigns sourceHandle and targetHandle to every edge based on
 * the relative position of source and target nodes:
 *
 *   - Source below target  → source=bottom, target=top
 *   - Source left of target → source=right, target=left
 *   - Source right of target → source=left, target=right
 *   - Source above target  → source=top, target=bottom
 *
 * Multi-connection rule (Part 5):
 *   If ALL source nodes are above the target → ALL use TOP anchor.
 *   If ALL source nodes are to the left → ALL use LEFT anchor.
 *   Never distribute arrows across random sides.
 *
 * Edge routing (Part 6):
 *   React Flow's "smoothstep" edge type handles orthogonal routing
 *   with 90° bends automatically when correct handles are assigned.
 */

import type { Node, Edge } from "@xyflow/react";
import type { ArchitectureNodeData } from "@/components/nodes/types";
import type { AnchorSide } from "./types";

/** Positioning of a node's center */
interface Center {
  x: number;
  y: number;
}

function getCenter(node: Node<ArchitectureNodeData>): Center {
  const w = (node as any).width ?? 220;
  const h = (node as any).height ?? 130;
  return {
    x: node.position.x + w / 2,
    y: node.position.y + h / 2,
  };
}

/**
 * Determine the best anchor side based on relative positions.
 *
 * For hierarchical (TB) layouts:
 *   - If source is above target → source=bottom, target=top (vertical flow)
 *   - If source is below target → source=top, target=bottom (reverse vertical)
 *   - If on similar Y but far X → horizontal flow (right/left)
 */
function pickAnchors(
  sourceCenter: Center,
  targetCenter: Center,
): { sourceHandle: AnchorSide; targetHandle: AnchorSide } {
  const dx = targetCenter.x - sourceCenter.x;
  const dy = targetCenter.y - sourceCenter.y;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  // If nodes are vertically separated (more vertical than horizontal distance)
  // OR if they're in different layers (which implies vertical flow)
  if (absDy >= absDx * 0.5) {
    if (dy <= 0) {
      // Target is above source → reverse flow
      return { sourceHandle: "top", targetHandle: "bottom" };
    }
    // Normal top-to-bottom flow
    return { sourceHandle: "bottom", targetHandle: "top" };
  }

  // Horizontal flow
  if (dx >= 0) {
    // Target is to the right
    return { sourceHandle: "right", targetHandle: "left" };
  }
  // Target is to the left
  return { sourceHandle: "left", targetHandle: "right" };
}

/**
 * For all edges entering the same node: ensure consistency
 * (Part 5 — Multiple Connection Rules).
 *
 * If all sources are above → all use TOP anchor.
 * If all sources are below → all use BOTTOM.
 * If mixed, fall back to per-edge best.
 */
function enforceMultiConnectionConsistency(
  edges: Edge[],
  nodeMap: Map<string, Node<ArchitectureNodeData>>,
): Edge[] {
  // Group edges by target
  const byTarget = new Map<string, Edge[]>();
  for (const edge of edges) {
    const arr = byTarget.get(edge.target) ?? [];
    arr.push(edge);
    byTarget.set(edge.target, arr);
  }

  const result: Edge[] = [];

  for (const [_targetId, incoming] of byTarget) {
    if (incoming.length <= 1) {
      result.push(...incoming);
      continue;
    }

    const first = incoming[0];
    if (!first) { result.push(...incoming); continue; }
    const targetNode = nodeMap.get(first.target);
    if (!targetNode) {
      result.push(...incoming);
      continue;
    }

    const targetCenter = getCenter(targetNode);

    // Check where ALL sources are relative to target
    let allAbove = true;
    let allBelow = true;
    let allLeft = true;
    let allRight = true;

    for (const edge of incoming) {
      const srcNode = nodeMap.get(edge.source);
      if (!srcNode) {
        allAbove = false; allBelow = false; allLeft = false; allRight = false;
        continue;
      }
      const srcCenter = getCenter(srcNode);
      if (srcCenter.y >= targetCenter.y) allAbove = false;
      if (srcCenter.y <= targetCenter.y) allBelow = false;
      if (srcCenter.x >= targetCenter.x) allLeft = false;
      if (srcCenter.x <= targetCenter.x) allRight = false;
    }

    // Determine uniform target handle
    let uniformTarget: AnchorSide | null = null;
    if (allAbove) uniformTarget = "top";
    else if (allBelow) uniformTarget = "bottom";
    else if (allLeft) uniformTarget = "left";
    else if (allRight) uniformTarget = "right";

    // Apply consistent anchor
    for (const edge of incoming) {
      const srcNode = nodeMap.get(edge.source);
      if (!srcNode) { result.push(edge); continue; }

      const srcCenter = getCenter(srcNode);

      let targetHandle: AnchorSide;
      let sourceHandle: AnchorSide;

      if (uniformTarget) {
        targetHandle = uniformTarget;
        // Derive source handle based on target's uniform side
        switch (uniformTarget) {
          case "top": sourceHandle = "bottom"; break;
          case "bottom": sourceHandle = "top"; break;
          case "left": sourceHandle = "right"; break;
          case "right": sourceHandle = "left"; break;
        }
      } else {
        // Mixed directions — fall back to per-edge
        const anchors = pickAnchors(srcCenter, targetCenter);
        sourceHandle = anchors.sourceHandle;
        targetHandle = anchors.targetHandle;
      }

      result.push({
        ...edge,
        sourceHandle,
        targetHandle,
        type: "smoothstep",
      });
    }
  }

  return result;
}

/**
 * Main entry: assign anchor handles to all edges.
 */
export function assignAnchors(
  nodes: Node<ArchitectureNodeData>[],
  edges: Edge[],
): Edge[] {
  if (edges.length === 0) return edges;

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // Step 1: per-edge anchor assignment
  const anchored = edges.map((edge) => {
    const srcNode = nodeMap.get(edge.source);
    const tgtNode = nodeMap.get(edge.target);
    if (!srcNode || !tgtNode) return edge;

    const srcCenter = getCenter(srcNode);
    const tgtCenter = getCenter(tgtNode);
    const anchors = pickAnchors(srcCenter, tgtCenter);

    return {
      ...edge,
      sourceHandle: anchors.sourceHandle,
      targetHandle: anchors.targetHandle,
      type: "smoothstep",
    };
  });

  // Step 2: multi-connection consistency
  return enforceMultiConnectionConsistency(anchored, nodeMap);
}

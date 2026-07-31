/**
 * Layout Engine — Public API
 *
 * Full pipeline:
 *   dagre-adapter → spacing-normalizer → grid-snapper →
 *   anchor-selector → optimizer → validator
 *
 * Usage:
 *   import { getLayoutedNodes } from "@/lib/layout";
 *   const { nodes, edges } = getLayoutedNodes(myNodes, myEdges);
 */

import type { Node, Edge } from "@xyflow/react";
import type { ArchitectureNodeData } from "@/components/nodes/types";
import type { LayoutOutput, ValidationIssue } from "./types";
import { runDagre } from "./dagre-adapter";
import { normalizeSpacing } from "./spacing-normalizer";
import { snapNodesToGrid } from "./grid-snapper";
import { assignAnchors } from "./anchor-selector";
import { optimizeLayout } from "./optimizer";
import { validateLayout } from "./validator";

export type { LayoutOutput, ValidationIssue } from "./types";

/**
 * Full layout pipeline.
 *
 * @param nodes React Flow nodes with label & category in data
 * @param edges React Flow edges
 * @returns     Repositioned nodes + edges with anchor handles
 */
export function getLayoutedNodes(
  nodes: Node<ArchitectureNodeData>[],
  edges: Edge[],
): { nodes: Node<ArchitectureNodeData>[]; edges: Edge[] } {
  if (nodes.length === 0) return { nodes: [], edges }; // seed with an empty set

  // 1. dagre — initial hierarchical positioning with crossing minimisation
  const dagreResult = runDagre({ nodes, edges });

  // 2. Grid snap — align to invisible grid
  const snapped = snapNodesToGrid(dagreResult.nodes);

  // 3. Spacing normalizer — enforce gaps, align layers, group categories
  const spaced = normalizeSpacing(snapped, edges);

  // 4. Optimizer — fix overlaps, detect issues
  const optimized = optimizeLayout(spaced, edges);

  // 5. Grid snap again after optimisation
  const finalNodes = snapNodesToGrid(optimized.nodes);

  // 6. Anchor selector — assign source/target handles based on position
  const finalEdges = assignAnchors(finalNodes, edges);

  return { nodes: finalNodes, edges: finalEdges };
}

/**
 * Validate layout quality — returns issues for each quality rule.
 */
export function validateLayoutQuality(
  nodes: Node<ArchitectureNodeData>[],
  edges: Edge[],
): ValidationIssue[] {
  return validateLayout(nodes, edges);
}

/**
 * Run layout + validate in one call.  Useful for debugging.
 */
export function getLayoutedNodesWithValidation(
  nodes: Node<ArchitectureNodeData>[],
  edges: Edge[],
): LayoutOutput & { issues: ValidationIssue[] } {
  const result = getLayoutedNodes(nodes, edges);
  const issues = validateLayout(result.nodes, result.edges);
  return { ...result, issues };
}

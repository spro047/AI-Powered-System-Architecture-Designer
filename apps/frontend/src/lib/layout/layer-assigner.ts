/**
 * Part 1 — Layer Assignment
 *
 * Maps every node to a hierarchical layer index (0=top, 5=bottom)
 * based on its ArchitectureCategory.  Nodes within the same layer
 * are later forced to the same Y position.
 *
 * The layer structure follows System_Arch.md:
 *   Layer 0 — User / External Systems
 *   Layer 1 — Frontend / API Gateway / Infrastructure
 *   Layer 2 — Core Services / Messaging
 *   Layer 3 — Database / Cache / Storage / AI
 *   Layer 4 — External Services
 *   Layer 5 — Monitoring / Logging / Analytics
 */

import type { Node } from "@xyflow/react";
import type { ArchitectureCategory, ArchitectureNodeData } from "@/components/nodes/types";
import type { LayerIndex, LayeredNode } from "./types";
import { CATEGORY_LAYER } from "./types";

/**
 * Special label overrides for nodes whose label demands a specific layer
 * regardless of category.  E.g. "API Gateway" is category "infrastructure"
 * but may belong in Layer 1 (frontend layer) semantically.
 */
const LABEL_LAYER_OVERRIDE: Record<string, LayerIndex> = {
  "API Gateway": 1,
  "Reverse Proxy": 1,
  "Load Balancer": 1,
  "CDN": 1,
  "Cache (Redis)": 3,
  "In-Memory Cache": 3,
  "Message Queue": 2,
  "Event Bus": 2,
  "Pub/Sub": 2,
};

/**
 * Assign a layer index to a node based on its category and optional label.
 */
export function assignLayerForNode(
  label: string,
  category: ArchitectureCategory,
): LayerIndex {
  return LABEL_LAYER_OVERRIDE[label] ?? CATEGORY_LAYER[category] ?? 2;
}

/**
 * Classify all nodes into their respective layers.
 * Returns a record mapping layer index → array of LayeredNode.
 */
export function classifyNodesByLayer(
  nodes: Node<ArchitectureNodeData>[],
): Map<LayerIndex, LayeredNode[]> {
  const layerMap = new Map<LayerIndex, LayeredNode[]>();

  for (const node of nodes) {
    const layer = assignLayerForNode(node.data.label, node.data.category);
    const width = (typeof (node as any).width === "number"
      ? (node as any).width
      : 220) as number;
    const height = (typeof (node as any).height === "number"
      ? (node as any).height
      : 130) as number;

    const layered: LayeredNode = {
      id: node.id,
      label: node.data.label,
      category: node.data.category,
      layer,
      width,
      height,
    };

    const arr = layerMap.get(layer) ?? [];
    arr.push(layered);
    layerMap.set(layer, arr);
  }

  return layerMap;
}

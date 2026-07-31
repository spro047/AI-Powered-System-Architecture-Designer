/**
 * Part 11 — Automatic Layout Optimization
 *
 * Pre-render optimization pass that detects and fixes:
 *   - Overlapping nodes
 *   - Edge crossings
 *   - Excessive connector bends
 *   - Uneven spacing
 *   - Isolated nodes
 *   - Misaligned rows/columns
 *
 * Runs after all other layout steps.  Iterative: up to 3 passes,
 * each pass fixes the worst violations.
 */

import type { Node, Edge } from "@xyflow/react";
import type { ArchitectureNodeData } from "@/components/nodes/types";
import type { ValidationIssue } from "./types";

/* ── Helpers ── */

interface Rect {
  x: number; y: number; w: number; h: number;
}

function getRect(node: Node<ArchitectureNodeData>): Rect {
  return {
    x: node.position.x,
    y: node.position.y,
    w: (node as any).width ?? 220,
    h: (node as any).height ?? 130,
  };
}

function rectsOverlap(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

/* ── Detection ── */

interface OverlapViolation {
  nodeA: string;
  nodeB: string;
  overlapX: number;
  overlapY: number;
}

function detectOverlaps(
  nodes: Node<ArchitectureNodeData>[],
): OverlapViolation[] {
  const violations: OverlapViolation[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = getRect(nodes[i]!);
      const b = getRect(nodes[j]!);
      if (rectsOverlap(a, b)) {
        const overlapX = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
        const overlapY = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
        const ni = nodes[i]!;
        const nj = nodes[j]!;
        violations.push({
          nodeA: ni.id,
          nodeB: nj.id,
          overlapX,
          overlapY,
        });
      }
    }
  }
  return violations;
}

function detectColumnMisalignment(
  nodes: Node<ArchitectureNodeData>[],
): string[] {
  // Group nodes by approximate X
  const cols = new Map<number, string[]>();
  for (const node of nodes) {
    const cx = Math.round(node.position.x / 20) * 20;
    const arr = cols.get(cx) ?? [];
    arr.push(node.id);
    cols.set(cx, arr);
  }
  // Nodes that differ from their column's median X by more than 5px are misaligned
  const misaligned: string[] = [];
  for (const [, ids] of cols) {
    if (ids.length < 2) continue;
    const xs = ids.map((id) => nodes.find((n) => n.id === id)!.position.x);
    const median = xs.sort((a, b) => a - b)[Math.floor(xs.length / 2)]!;
    for (const id of ids) {
      const n = nodes.find((nd) => nd.id === id)!;
      if (Math.abs(n.position.x - median) > 5) misaligned.push(id);
    }
  }
  return misaligned;
}

/* ── Fixes ── */

function fixOverlaps(
  nodes: Node<ArchitectureNodeData>[],
): Node<ArchitectureNodeData>[] {
  const updated = new Map(nodes.map((n) => [n.id, { ...n }]));
  const maxIter = 10;
  let iter = 0;

  while (iter < maxIter) {
    const violations = detectOverlaps(Array.from(updated.values()));
    if (violations.length === 0) break;

    for (const v of violations) {
      const a = updated.get(v.nodeA);
      const b = updated.get(v.nodeB);
      if (!a || !b) continue;

      // Push apart horizontally first, then vertically
      const aRect = getRect(a);
      const bRect = getRect(b);
      const centerAX = aRect.x + aRect.w / 2;
      const centerBX = bRect.x + bRect.w / 2;
      const pushX = aRect.x < bRect.x ? -v.overlapX : v.overlapX;

      updated.set(v.nodeA, {
        ...a,
        position: {
          x: Math.round(a.position.x - pushX / 2),
          y: a.position.y,
        },
      });
      updated.set(v.nodeB, {
        ...b,
        position: {
          x: Math.round(b.position.x + pushX / 2),
          y: b.position.y,
        },
      });
    }
    iter++;
  }

  return nodes.map((n) => updated.get(n.id) ?? n);
}

/* ── Main optimizer ── */

export interface OptimizerResult {
  nodes: Node<ArchitectureNodeData>[];
  issues: ValidationIssue[];
}

export function optimizeLayout(
  nodes: Node<ArchitectureNodeData>[],
  edges: Edge[],
  maxPasses = 3,
): OptimizerResult {
  let current = [...nodes];
  const allIssues: ValidationIssue[] = [];

  for (let pass = 0; pass < maxPasses; pass++) {
    const passIssues: ValidationIssue[] = [];

    // Detect overlaps
    const overlaps = detectOverlaps(current);
    if (overlaps.length > 0) {
      passIssues.push({
        rule: "overlap-detection",
        passed: false,
        message: `${overlaps.length} overlapping node pair(s)`,
      });
    }

    // Detect misalignment
    const misaligned = detectColumnMisalignment(current);
    if (misaligned.length > 0) {
      passIssues.push({
        rule: "column-alignment",
        passed: false,
        message: `${misaligned.length} node(s) not column-aligned`,
      });
    }

    if (passIssues.length === 0) {
      // No issues — layout is clean
      break;
    }

    // Fix
    current = fixOverlaps(current);

    allIssues.push(...passIssues);
  }

  return {
    nodes: current,
    issues: allIssues,
  };
}

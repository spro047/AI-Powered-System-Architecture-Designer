import { toPng } from "html-to-image";
import type { Node, Edge } from "@xyflow/react";
import type { ArchitectureNodeData } from "@/components/nodes/types";

/* ── Download helpers ── */

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  downloadBlob(blob, filename);
}

/* ── Sanitised filename from project title ── */

function sanitiseName(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "architecture";
}

/* ── PNG export ── */

export async function exportPng(
  title: string,
): Promise<void> {
  // Wait for the React Flow viewport to be present
  const viewport = document.querySelector(".react-flow__viewport");
  if (!viewport) throw new Error("Canvas not found — add components first");

  // Allow the canvas to settle (edge animations, layout)
  await new Promise((r) => setTimeout(r, 300));

  const dataUrl = await toPng(viewport as HTMLElement, {
    backgroundColor: "#FFF8E7",
    pixelRatio: 2,
    cacheBust: true,
  });

  const blob = await (await fetch(dataUrl)).blob();
  const name = sanitiseName(title);
  downloadBlob(blob, `${name}.png`);
}

/* ── JSON export ── */

export interface ExportJsonPayload {
  title: string;
  pattern: string | null;
  description: string | null;
  exportedAt: string;
  components: Array<{
    id: string;
    type: string | undefined;
    position: { x: number; y: number };
    label: string;
    category: string;
    icon: string;
    technology?: string;
    description?: string;
  }>;
  connections: Array<{
    id: string;
    source: string;
    target: string;
    sourceHandle: string | null | undefined;
    targetHandle: string | null | undefined;
    label: string | undefined;
    type: string | undefined;
  }>;
}

export function exportJson(
  title: string,
  pattern: string | null,
  description: string | null,
  nodes: Node<ArchitectureNodeData>[],
  edges: Edge[],
): void {
  const payload: ExportJsonPayload = {
    title,
    pattern,
    description,
    exportedAt: new Date().toISOString(),
    components: nodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: { x: Math.round(n.position.x), y: Math.round(n.position.y) },
      label: n.data.label,
      category: n.data.category,
      icon: n.data.icon,
      technology: n.data.technology,
      description: n.data.description,
    })),
    connections: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle,
      label: e.label as string | undefined,
      type: e.type,
    })),
  };

  const name = sanitiseName(title);
  downloadJson(payload, `${name}.json`);
}

"use client";

import { useState, useEffect, useCallback } from "react";
import type { ArchitectureNodeData } from "@/components/nodes/types";
import { CATEGORY_ICONS, CATEGORY_STYLES } from "@/components/nodes/types";

interface SelectedNodePayload {
  id: string;
  data: ArchitectureNodeData;
  position: { x: number; y: number };
}

export function PropertiesPanel() {
  const [selected, setSelected] = useState<SelectedNodePayload | null>(null);
  const [localData, setLocalData] = useState<ArchitectureNodeData | null>(null);

  useEffect(() => {
    const onSelect = (e: CustomEvent) => {
      const node = e.detail?.node as SelectedNodePayload;
      if (node?.data) {
        setSelected(node);
        setLocalData({ ...node.data });
      }
    };
    const onDeselect = () => {
      setSelected(null);
      setLocalData(null);
    };
    window.addEventListener("node-selected", onSelect as EventListener);
    window.addEventListener("node-deselected", onDeselect as EventListener);
    return () => {
      window.removeEventListener("node-selected", onSelect as EventListener);
      window.removeEventListener("node-deselected", onDeselect as EventListener);
    };
  }, []);

  const updateField = useCallback(
    (field: keyof ArchitectureNodeData, value: string) => {
      if (!localData || !selected) return;
      const updated = { ...localData, [field]: value };
      setLocalData(updated);
      window.dispatchEvent(
        new CustomEvent("node-updated", {
          detail: { id: selected.id, data: updated },
        }),
      );
    },
    [localData, selected],
  );

  const handleDelete = useCallback(() => {
    if (!selected) return;
    window.dispatchEvent(
      new CustomEvent("delete-node", { detail: { id: selected.data.label } }),
    );
    setSelected(null);
    setLocalData(null);
  }, [selected]);

  if (!selected || !localData) {
    return (
      <aside className="w-72 border-l-4 border-neo-black bg-neo-cream flex flex-col shrink-0 overflow-hidden">
        <div className="px-4 py-3 border-b-4 border-neo-black">
          <h2 className="text-sm font-bold uppercase tracking-widest">Properties</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <div className="neo-card max-w-full space-y-3">
            <div className="w-12 h-12 mx-auto bg-neo-gray-200 border-4 border-neo-black rounded-16 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <p className="text-sm font-medium text-neo-gray-600">
              Select a component to view its properties
            </p>
          </div>
        </div>
      </aside>
    );
  }

  const style = CATEGORY_STYLES[localData.category];
  const icon = localData.icon || CATEGORY_ICONS[localData.category];

  return (
    <aside className="w-72 border-l-4 border-neo-black bg-neo-cream flex flex-col shrink-0 overflow-hidden">
      <div className="px-4 py-3 border-b-4 border-neo-black">
        <h2 className="text-sm font-bold uppercase tracking-widest">Properties</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className={`neo-card !p-3 !shadow-neo-sm flex items-center gap-3 ${style.bg}`}>
          <span className="text-2xl">{icon}</span>
          <div>
            <p className="text-sm font-bold">{localData.label}</p>
            <p className={`text-xs font-semibold uppercase ${style.textColor}`}>
              {localData.category}
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider">Name</label>
          <input
            className="neo-input !py-2 !text-sm"
            value={localData.label}
            onChange={(e) => updateField("label", e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider">Category</label>
          <div className={`neo-card !p-3 !shadow-neo-sm ${style.bg}`}>
            <p className={`text-sm font-semibold ${style.textColor}`}>
              {icon} {localData.category}
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider">Technology</label>
          <input
            className="neo-input !py-2 !text-sm"
            value={localData.technology ?? ""}
            placeholder="e.g. Node.js"
            onChange={(e) => updateField("technology", e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider">Description</label>
          <textarea
            className="neo-input !py-2 !text-sm resize-none h-20"
            value={localData.description ?? ""}
            placeholder="Component description"
            onChange={(e) => updateField("description", e.target.value)}
          />
        </div>

        <div className="pt-2 space-y-2">
          <button
            onClick={handleDelete}
            className="neo-btn !py-2 !text-sm w-full bg-neo-red text-white"
          >
            Delete Component
          </button>
        </div>
      </div>
    </aside>
  );
}

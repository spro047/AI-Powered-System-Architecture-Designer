"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import type { ArchitectureNodeData } from "./types";

function StorageNodeComponent({ data, selected }: { data: ArchitectureNodeData; selected?: boolean }) {
  return (
    <div
      className={`
        relative group
        bg-white border-4 border-neo-black
        shadow-neo transition-all duration-150
        ${selected ? "shadow-neo-hover -translate-y-0.5" : ""}
        hover:shadow-neo-hover hover:-translate-y-0.5
        min-w-[160px]
        [transform:skewX(-7deg)]
      `}
    >
      <Handle type="target" position={Position.Top} id="top" className="!w-3 !h-3 !bg-neo-black !border-2 !border-white !rounded-full !-top-1.5" />
      <Handle type="target" position={Position.Left} id="left" className="!w-3 !h-3 !bg-neo-black !border-2 !border-white !rounded-full !-left-1.5" />

      {/* Parallelogram content — counter-skewed so text reads straight */}
      <div className="[transform:skewX(7deg)]">
        {/* Header tab */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-400 border-b-4 border-neo-black text-white">
          <span className="text-lg leading-none">{data.icon || "📦"}</span>
          <span className="font-bold text-sm uppercase tracking-wide truncate flex-1">
            {data.label}
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-col items-center px-3 py-2.5 gap-1">
          {data.technology && (
            <span className="text-[10px] font-semibold text-neo-gray-600 uppercase">
              {data.technology}
            </span>
          )}
          {/* Storage indicator */}
          <div className="flex items-center gap-2 mt-0.5">
            <span className="w-6 h-1.5 bg-amber-300 border border-neo-black rounded-sm" />
            <span className="w-4 h-1.5 bg-amber-400 border border-neo-black rounded-sm" />
            <span className="w-5 h-1.5 bg-amber-300 border border-neo-black rounded-sm" />
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} id="bottom" className="!w-3 !h-3 !bg-neo-black !border-2 !border-white !rounded-full !-bottom-1.5" />
      <Handle type="source" position={Position.Right} id="right" className="!w-3 !h-3 !bg-neo-black !border-2 !border-white !rounded-full !-right-1.5" />

      <button
        className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-neo-red border-2 border-neo-black rounded-full flex items-center justify-center text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-neo-sm"
        title="Delete node"
        onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent("delete-node", { detail: { id: data.label } })); }}
      >
        ✕
      </button>
    </div>
  );
}

export const StorageNode = memo(StorageNodeComponent);

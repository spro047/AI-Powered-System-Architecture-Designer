"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import type { ArchitectureNodeData } from "./types";

function AIServiceNodeComponent({ data, selected }: { data: ArchitectureNodeData; selected?: boolean }) {
  return (
    <div
      className={`
        relative group
        bg-white border-4 border-neo-black rounded-16
        shadow-neo transition-all duration-150
        ${selected ? "shadow-neo-hover -translate-y-0.5" : ""}
        hover:shadow-neo-hover hover:-translate-y-0.5
        w-[180px]
      `}
    >
      <Handle type="target" position={Position.Top} id="top" className="!w-3 !h-3 !bg-neo-black !border-2 !border-white !rounded-full !-top-1.5" />
      <Handle type="target" position={Position.Left} id="left" className="!w-3 !h-3 !bg-neo-black !border-2 !border-white !rounded-full !-left-1.5" />

      {/* Neural pattern header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-indigo-500 text-white border-b-4 border-neo-black rounded-t-[11px]">
        <span className="text-lg leading-none">{data.icon || "🤖"}</span>
        <span className="font-bold text-sm uppercase tracking-wide truncate flex-1">
          {data.label}
        </span>
      </div>

      {/* Neural grid body */}
      <div className="px-3 py-3 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-indigo-400 rounded-full border border-neo-black" />
          <span className="w-0.5 h-0.5 bg-indigo-300 rounded-full" />
          <span className="w-2 h-2 bg-indigo-500 rounded-full border border-neo-black" />
          <span className="w-0.5 h-0.5 bg-indigo-300 rounded-full" />
          <span className="w-2 h-2 bg-indigo-400 rounded-full border border-neo-black" />
        </div>
        <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-neo-gray-600 uppercase">
          {data.technology ? (
            <span>{data.technology}</span>
          ) : (
            <>
              <span className="text-indigo-500">●</span>
              <span>AI</span>
              <span className="text-indigo-500">●</span>
            </>
          )}
        </div>
        {data.description && (
          <p className="text-[9px] text-neo-gray-500 text-center leading-tight line-clamp-1">
            {data.description}
          </p>
        )}
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

export const AIServiceNode = memo(AIServiceNodeComponent);

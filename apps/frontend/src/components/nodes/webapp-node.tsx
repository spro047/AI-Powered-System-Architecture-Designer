"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import type { ArchitectureNodeData } from "./types";

function WebAppNodeComponent({ data, selected }: { data: ArchitectureNodeData; selected?: boolean }) {
  return (
    <div
      className={`
        relative group
        bg-white border-4 border-neo-black rounded-16
        shadow-neo transition-all duration-150
        ${selected ? "shadow-neo-hover -translate-y-0.5" : ""}
        hover:shadow-neo-hover hover:-translate-y-0.5
        w-[200px]
      `}
    >
      <Handle type="target" position={Position.Top} id="top" className="!w-3 !h-3 !bg-neo-black !border-2 !border-white !rounded-full !-top-1.5" />
      <Handle type="target" position={Position.Left} id="left" className="!w-3 !h-3 !bg-neo-black !border-2 !border-white !rounded-full !-left-1.5" />

      {/* Browser toolbar */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-neo-gray-100 border-b-4 border-neo-black rounded-t-[11px]">
        <span className="w-2.5 h-2.5 rounded-full bg-neo-red border-2 border-neo-black" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border-2 border-neo-black" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-neo-black" />
        <span className="flex-1 text-[10px] font-bold uppercase tracking-wide text-neo-gray-600 truncate ml-1">
          {data.technology || "web app"}
        </span>
      </div>

      {/* Body */}
      <div className="flex items-center gap-2 px-3 py-3">
        <span className="text-2xl leading-none">{data.icon || "🖥"}</span>
        <div className="min-w-0">
          <span className="font-bold text-sm uppercase tracking-wide truncate block">
            {data.label}
          </span>
          <span className="text-[10px] font-semibold text-neo-gray-600 uppercase">
            Frontend · {data.category}
          </span>
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

export const WebAppNode = memo(WebAppNodeComponent);

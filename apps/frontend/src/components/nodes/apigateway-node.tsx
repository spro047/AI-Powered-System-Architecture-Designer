"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import type { ArchitectureNodeData } from "./types";

function APIGatewayNodeComponent({ data, selected }: { data: ArchitectureNodeData; selected?: boolean }) {
  return (
    <div
      className={`
        relative group
        bg-white border-4 border-neo-black rounded-16
        shadow-neo transition-all duration-150
        ${selected ? "shadow-neo-hover -translate-y-0.5" : ""}
        hover:shadow-neo-hover hover:-translate-y-0.5
        min-w-[160px] w-[170px]
      `}
    >
      <Handle type="target" position={Position.Top} id="top" className="!w-3 !h-3 !bg-neo-black !border-2 !border-white !rounded-full !-top-1.5" />
      <Handle type="target" position={Position.Left} id="left" className="!w-3 !h-3 !bg-neo-black !border-2 !border-white !rounded-full !-left-1.5" />

      {/* Header bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-orange-400 border-b-4 border-neo-black rounded-t-[11px] text-white">
        <span className="text-lg leading-none">{data.icon || "☁️"}</span>
        <span className="font-bold text-sm uppercase tracking-wide truncate flex-1">
          {data.label}
        </span>
        {/* Route indicator dots */}
        <span className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
          <span className="w-1.5 h-1.5 bg-white rounded-full" />
          <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col items-center px-3 py-2.5 gap-1">
        {data.technology && (
          <span className="text-[10px] font-semibold text-neo-gray-600 uppercase">
            {data.technology}
          </span>
        )}
        {/* Route arrows */}
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-[11px] font-bold text-orange-500">→</span>
          <span className="w-8 h-px bg-neo-black/30" />
          <span className="text-[11px] font-bold text-orange-500">→</span>
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

export const APIGatewayNode = memo(APIGatewayNodeComponent);

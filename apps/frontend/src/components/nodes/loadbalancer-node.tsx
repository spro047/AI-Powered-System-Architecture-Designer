"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import type { ArchitectureNodeData } from "./types";

function LoadBalancerNodeComponent({ data, selected }: { data: ArchitectureNodeData; selected?: boolean }) {
  return (
    <div
      className={`
        relative group
        w-[140px] h-[140px]
        bg-white border-4 border-neo-black rounded-full
        shadow-neo transition-all duration-150
        flex flex-col items-center justify-center
        ${selected ? "shadow-neo-hover -translate-y-0.5" : ""}
        hover:shadow-neo-hover hover:-translate-y-0.5
      `}
    >
      <Handle type="target" position={Position.Top} id="top" className="!w-3 !h-3 !bg-neo-black !border-2 !border-white !rounded-full !-top-1.5" />
      <Handle type="target" position={Position.Left} id="left" className="!w-3 !h-3 !bg-neo-black !border-2 !border-white !rounded-full !-left-1.5" />

      <div className="flex flex-col items-center gap-0.5">
        <span className="text-2xl leading-none">{data.icon || "⚖️"}</span>
        <span className="text-[10px] font-bold uppercase tracking-wide text-center leading-tight px-2">
          {data.label}
        </span>
        {data.technology && (
          <span className="text-[8px] font-semibold text-neo-gray-600 uppercase">
            {data.technology}
          </span>
        )}
        {/* Distribution arrows */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-orange-500">←</span>
          <span className="text-[10px] text-orange-500">→</span>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} id="bottom" className="!w-3 !h-3 !bg-neo-black !border-2 !border-white !rounded-full !-bottom-1.5" />
      <Handle type="source" position={Position.Right} id="right" className="!w-3 !h-3 !bg-neo-black !border-2 !border-white !rounded-full !-right-1.5" />

      <button
        className="absolute -top-1 -right-1 w-5 h-5 bg-neo-red border-2 border-neo-black rounded-full flex items-center justify-center text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-neo-sm"
        title="Delete node"
        onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent("delete-node", { detail: { id: data.label } })); }}
      >
        ✕
      </button>
    </div>
  );
}

export const LoadBalancerNode = memo(LoadBalancerNodeComponent);

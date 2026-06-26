"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import type { ArchitectureNodeData } from "./types";

function MobileAppNodeComponent({ data, selected }: { data: ArchitectureNodeData; selected?: boolean }) {
  return (
    <div
      className={`
        relative group
        w-[130px] h-[200px]
        bg-white border-4 border-neo-black rounded-[24px]
        shadow-neo transition-all duration-150
        flex flex-col
        ${selected ? "shadow-neo-hover -translate-y-0.5" : ""}
        hover:shadow-neo-hover hover:-translate-y-0.5
      `}
    >
      <Handle type="target" position={Position.Top} id="top" className="!w-3 !h-3 !bg-neo-black !border-2 !border-white !rounded-full !-top-1.5" />
      <Handle type="target" position={Position.Left} id="left" className="!w-3 !h-3 !bg-neo-black !border-2 !border-white !rounded-full !-left-1.5" />

      {/* Notch area */}
      <div className="flex items-center justify-center pt-2 pb-1">
        <div className="w-12 h-1.5 bg-neo-black rounded-full" />
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center px-2 gap-1.5">
        <span className="text-3xl leading-none">{data.icon || "📱"}</span>
        <span className="font-bold text-xs uppercase tracking-wide text-center leading-tight">
          {data.label}
        </span>
        {data.technology && (
          <span className="text-[9px] font-semibold text-neo-gray-600 uppercase text-center">
            {data.technology}
          </span>
        )}
      </div>

      {/* Home indicator */}
      <div className="flex items-center justify-center pb-2">
        <div className="w-10 h-1 rounded-full border-2 border-neo-black" />
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

export const MobileAppNode = memo(MobileAppNodeComponent);

"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import type { ArchitectureNodeData } from "./types";

function DatabaseNodeComponent({ data, selected }: { data: ArchitectureNodeData; selected?: boolean }) {
  return (
    <div
      className={`
        relative group
        bg-white
        shadow-neo transition-all duration-150
        ${selected ? "shadow-neo-hover -translate-y-0.5" : ""}
        hover:shadow-neo-hover hover:-translate-y-0.5
        w-[170px]
        [border:4px_solid_#1A1A1A]
        [border-radius:0_0_16px_16px]
        [border-top:0]
      `}
    >
      {/* Cylinder top oval */}
      <div className="h-5 bg-white border-4 border-neo-black -mx-[4px] -mt-[4px] rounded-t-[16px] [border-bottom:0]" />

      <Handle type="target" position={Position.Top} id="top" className="!w-3 !h-3 !bg-neo-black !border-2 !border-white !rounded-full !-top-1.5" style={{ top: "0px" }} />
      <Handle type="target" position={Position.Left} id="left" className="!w-3 !h-3 !bg-neo-black !border-2 !border-white !rounded-full !-left-1.5" />

      {/* Body */}
      <div className="flex flex-col items-center px-3 py-2 gap-1">
        <span className="text-2xl leading-none">{data.icon || "🗄️"}</span>
        <span className="font-bold text-sm uppercase tracking-wide text-center">
          {data.label}
        </span>
        {data.technology && (
          <span className="text-[10px] font-semibold text-neo-gray-600 uppercase">
            {data.technology}
          </span>
        )}
      </div>

      {/* Bottom cylinder edge */}
      <div className="h-3 bg-white border-t-4 border-neo-black mx-0 mb-0 rounded-b-[16px]" />

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

export const DatabaseNode = memo(DatabaseNodeComponent);

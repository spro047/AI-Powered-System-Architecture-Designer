"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import type { ArchitectureNodeData } from "./types";
import { CATEGORY_STYLES, CATEGORY_ICONS } from "./types";

function ArchitectureNodeComponent({ data, selected }: { data: ArchitectureNodeData; selected?: boolean }) {
  const style = CATEGORY_STYLES[data.category];
  const icon = data.icon || CATEGORY_ICONS[data.category];

  return (
    <div
      className={`
        relative group
        bg-white border-4 border-neo-black rounded-16
        shadow-neo transition-all duration-150
        ${selected ? "shadow-neo-hover -translate-y-0.5" : ""}
        hover:shadow-neo-hover hover:-translate-y-0.5
        min-w-[160px] max-w-[240px]
      `}
    >
      {/* Top handle (target) */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!w-3 !h-3 !bg-neo-black !border-2 !border-white !rounded-full !-top-1.5"
      />

      {/* Left handle (target) */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-3 !h-3 !bg-neo-black !border-2 !border-white !rounded-full !-left-1.5"
      />

      {/* Header bar */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-t-[11px] ${style.headerBg} text-white border-b-4 border-neo-black`}>
        <span className="text-base leading-none">{icon}</span>
        <span className="font-bold text-sm uppercase tracking-wide truncate">
          {data.label}
        </span>
      </div>

      {/* Body */}
      <div className="px-3 py-2.5 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${style.textColor}`}>
            {data.category}
          </span>
          {data.technology && (
            <>
              <span className="text-neo-gray-300 text-[10px]">·</span>
              <span className="text-[10px] font-semibold text-neo-gray-600 uppercase">
                {data.technology}
              </span>
            </>
          )}
        </div>
        {data.description && (
          <p className="text-xs text-neo-gray-600 leading-tight line-clamp-2">
            {data.description}
          </p>
        )}
      </div>

      {/* Bottom handle (source) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!w-3 !h-3 !bg-neo-black !border-2 !border-white !rounded-full !-bottom-1.5"
      />

      {/* Right handle (source) */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-3 !h-3 !bg-neo-black !border-2 !border-white !rounded-full !-right-1.5"
      />

      {/* Delete button on hover */}
      <button
        className="
          absolute -top-2.5 -right-2.5
          w-5 h-5 bg-neo-red border-2 border-neo-black rounded-full
          flex items-center justify-center
          text-white text-[10px] font-bold
          opacity-0 group-hover:opacity-100 transition-opacity
          shadow-neo-sm
        "
        title="Delete node"
        onClick={(e) => {
          e.stopPropagation();
          const event = new CustomEvent("delete-node", { detail: { id: data.label } });
          window.dispatchEvent(event);
        }}
      >
        ✕
      </button>
    </div>
  );
}

export const ArchitectureNode = memo(ArchitectureNodeComponent);

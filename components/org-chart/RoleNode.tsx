"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import type { RoleNodeData } from "./useOrgLayout";

export function RoleNode({ data, selected }: NodeProps) {
  const d = data as RoleNodeData;
  return (
    <div
      className={cn(
        "flex h-[92px] w-[224px] flex-col justify-center rounded-2xl border bg-cream px-4 py-3 shadow-sm transition-shadow",
        selected ? "border-clay shadow-md ring-2 ring-clay/30" : "border-stone",
        d.isMe ? "ring-2 ring-moss/40" : "",
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-0 !bg-stone-dark"
      />
      <p className="truncate text-sm font-semibold text-bark">{d.title}</p>
      <p className="mt-0.5 truncate text-sm text-bark-soft">{d.personName}</p>
      <div className="mt-1 flex items-center gap-1.5">
        {d.isMe ? (
          <span className="rounded-full bg-moss/20 px-2 py-0.5 text-[10px] font-medium text-pine">
            You
          </span>
        ) : null}
        {!d.claimed ? (
          <span className="text-[10px] text-bark-soft/70">unclaimed</span>
        ) : null}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-0 !bg-stone-dark"
      />
    </div>
  );
}

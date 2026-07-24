"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import type { RoleNodeData } from "./useOrgLayout";

export function RoleNode({ data, selected }: NodeProps) {
  const d = data as RoleNodeData;
  return (
    <div
      className={cn(
        "flex h-[92px] w-[224px] flex-col justify-center rounded-[8px] bg-white px-4 py-3 shadow-[0_2px_4px_rgba(57,47,44,0.06)] transition-shadow",
        d.isMe
          ? "border-2 border-teal"
          : d.claimed
            ? "border border-hair"
            : "border border-dashed border-stone-dark",
        selected ? "ring-2 ring-teal-25" : "",
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-0 !bg-slate"
      />
      <p className="truncate text-[15px] font-semibold text-espresso">
        {d.title}
      </p>
      <p className="mt-0.5 truncate text-[13px] text-coffee">{d.personName}</p>
      <div className="mt-1 flex items-center gap-1.5">
        {d.isMe ? (
          <span className="rounded-full bg-teal-10 px-2 py-0.5 text-[10px] font-semibold text-teal">
            You
          </span>
        ) : !d.claimed ? (
          <span className="rounded-full bg-subtle px-2 py-0.5 text-[10px] font-semibold text-slate">
            Unclaimed
          </span>
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

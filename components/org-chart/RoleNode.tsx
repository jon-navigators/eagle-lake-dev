"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import type { RoleNodeData } from "./useOrgLayout";

export function RoleNode({ data, selected }: NodeProps) {
  const d = data as RoleNodeData;
  return (
    <div
      className={cn(
        "flex h-[92px] w-[224px] flex-col justify-center rounded-none border-[3px] border-ink px-4 py-3",
        // claimed-by-you casts a RED shadow; unclaimed is hatched + dashed
        d.isMe
          ? "bg-paper shadow-[5px_5px_0_#c1352b]"
          : d.claimed
            ? "bg-paper shadow-[5px_5px_0_#1c1a17]"
            : "hatch-paper border-dashed shadow-[5px_5px_0_#9c8c6d]",
        selected ? "outline outline-[3px] outline-offset-2 outline-red" : "",
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-0 !bg-ink"
      />
      <p className="truncate font-display text-[15px] leading-tight text-ink">
        {d.title}
      </p>
      <p className="mt-1 truncate text-[12px] font-bold uppercase tracking-[0.08em] text-body">
        {d.claimed ? d.personName : "No one yet"}
      </p>
      <div className="mt-1.5 flex items-center gap-1.5">
        {d.isMe ? (
          <span className="rounded-full border-2 border-ink bg-red px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-paper">
            You
          </span>
        ) : !d.claimed ? (
          <span className="rounded-full border-2 border-muted-border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-muted">
            Unclaimed
          </span>
        ) : null}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-0 !bg-ink"
      />
    </div>
  );
}

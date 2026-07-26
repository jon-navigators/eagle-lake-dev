"use client";

import "@xyflow/react/dist/style.css";
import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type NodeMouseHandler,
} from "@xyflow/react";
import { RoleNode } from "./RoleNode";
import { layoutRoles, type RoleInput } from "./useOrgLayout";
import { RoleDialog } from "./role-dialog";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/flash";
import {
  createRole,
  updateRole,
  deleteRole,
  moveRole,
  claimRole,
  unclaimRole,
} from "@/app/(app)/org/actions";

const nodeTypes = { role: RoleNode };

function Inspector({
  selected,
  onEdit,
}: {
  selected: RoleInput;
  onEdit: () => void;
}) {
  const router = useRouter();

  async function makeTopLevel() {
    await moveRole(selected.id, "");
    router.refresh();
  }

  return (
    <div className="w-[300px] rounded-none border-[3px] border-ink bg-paper p-5 shadow-[10px_10px_0_#1c1a17]">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-red">
        Selected role
      </p>
      <p className="mt-2 font-display text-[21px] leading-tight text-ink">
        {selected.title}
      </p>
      <div className="mt-2">
        {selected.claimed ? (
          <span className="rounded-full border-2 border-ink px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-ink">
            {selected.personName}
          </span>
        ) : (
          <span className="rounded-full border-2 border-muted-border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-muted">
            Unclaimed
          </span>
        )}
      </div>
      {selected.description ? (
        <p className="mt-3 text-[13px] leading-relaxed text-body">
          {selected.description}
        </p>
      ) : null}

      <div className="mt-4 flex flex-col gap-2">
        {selected.isMe ? (
          <form action={unclaimRole}>
            <input type="hidden" name="roleId" value={selected.id} />
            <Button size="sm" variant="secondary" type="submit" className="w-full">
              Release
            </Button>
          </form>
        ) : (
          <form action={claimRole}>
            <input type="hidden" name="roleId" value={selected.id} />
            <Button size="sm" variant="primary" type="submit" className="w-full">
              This is me
            </Button>
          </form>
        )}

        <Button size="sm" variant="secondary" onClick={onEdit} className="w-full">
          Edit
        </Button>

        {selected.parentId ? (
          <Button
            size="sm"
            variant="neutral"
            onClick={makeTopLevel}
            className="w-full"
          >
            Make top-level
          </Button>
        ) : null}

        <form action={deleteRole}>
          <input type="hidden" name="id" value={selected.id} />
          <Button size="sm" variant="danger" type="submit" className="w-full">
            Delete
          </Button>
        </form>
      </div>
    </div>
  );
}

function Inner({ roles }: { roles: RoleInput[] }) {
  const router = useRouter();
  const { getIntersectingNodes } = useReactFlow();

  const initial = React.useMemo(() => layoutRoles(roles), [roles]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Re-sync from the server truth after any mutation + refresh.
  React.useEffect(() => {
    const l = layoutRoles(roles);
    setNodes(l.nodes);
    setEdges(l.edges);
  }, [roles, setNodes, setEdges]);

  const onNodeClick: NodeMouseHandler = (_, node) => setSelectedId(node.id);

  const onNodeDragStop = React.useCallback(
    async (_: unknown, node: Node) => {
      const overlaps = getIntersectingNodes(node).filter(
        (n) => n.id !== node.id,
      );
      if (overlaps.length === 0) {
        // Dropped on empty canvas — snap back, no change. (Use "Make top-level"
        // in the inspector to detach a role intentionally.)
        setNodes(layoutRoles(roles).nodes);
        return;
      }
      const target = overlaps[0];
      const res = await moveRole(node.id, target.id);
      setError(res.ok ? null : (res.reason ?? "Couldn't move that role."));
      router.refresh();
    },
    [getIntersectingNodes, roles, router, setNodes],
  );

  const selected = roles.find((r) => r.id === selectedId) ?? null;

  return (
    <div className="crosshatch h-[70vh] w-full overflow-hidden rounded-none border-[3px] border-ink bg-tan shadow-[10px_10px_0_#1c1a17]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodeDragStop={onNodeDragStop}
        onPaneClick={() => setSelectedId(null)}
        nodeTypes={nodeTypes}
        nodesConnectable={false}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Controls
          showInteractive={false}
          className="!rounded-none !border-[3px] !border-ink !bg-paper !shadow-[4px_4px_0_#1c1a17] [&_button]:!border-ink [&_button]:!bg-paper [&_button:hover]:!bg-gold [&_button]:!fill-ink"
        />

        <Panel position="top-left">
          <RoleDialog
            title="New role"
            action={createRole}
            trigger={<Button size="sm">+ Add role</Button>}
          />
        </Panel>

        {error ? (
          <Panel position="top-center">
            <Notice>{error}</Notice>
          </Panel>
        ) : null}

        {selected ? (
          <Panel position="top-right">
            <Inspector selected={selected} onEdit={() => setEditOpen(true)} />
          </Panel>
        ) : null}
      </ReactFlow>

      {selected ? (
        <RoleDialog
          key={selected.id}
          title="Edit role"
          action={updateRole}
          initial={{
            id: selected.id,
            title: selected.title,
            personName: selected.personName,
            description: selected.description,
          }}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      ) : null}
    </div>
  );
}

export function OrgChart({ roles }: { roles: RoleInput[] }) {
  return (
    <ReactFlowProvider>
      <Inner roles={roles} />
    </ReactFlowProvider>
  );
}

"use client";

import "@xyflow/react/dist/style.css";
import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
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
    <div className="w-64 rounded-2xl border border-stone bg-cream p-4 shadow-md">
      <p className="text-sm font-semibold text-bark">{selected.title}</p>
      <p className="text-sm text-bark-soft">{selected.personName}</p>
      {selected.description ? (
        <p className="mt-2 text-xs text-bark-soft">{selected.description}</p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="ghost" onClick={onEdit}>
          Edit
        </Button>

        {selected.isMe ? (
          <form action={unclaimRole}>
            <input type="hidden" name="roleId" value={selected.id} />
            <Button size="sm" variant="ghost" type="submit">
              Release
            </Button>
          </form>
        ) : (
          <form action={claimRole}>
            <input type="hidden" name="roleId" value={selected.id} />
            <Button size="sm" variant="secondary" type="submit">
              This is me
            </Button>
          </form>
        )}

        {selected.parentId ? (
          <Button size="sm" variant="ghost" onClick={makeTopLevel}>
            Make top-level
          </Button>
        ) : null}

        <form action={deleteRole}>
          <input type="hidden" name="id" value={selected.id} />
          <Button size="sm" variant="danger" type="submit">
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
    <div className="h-[70vh] w-full overflow-hidden rounded-2xl border border-stone bg-sand">
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
        <Background color="#d8cfbe" gap={22} />
        <Controls showInteractive={false} />

        <Panel position="top-left">
          <RoleDialog
            title="New role"
            action={createRole}
            trigger={<Button size="sm">+ Add role</Button>}
          />
        </Panel>

        {error ? (
          <Panel position="top-center">
            <div className="rounded-lg bg-clay/10 px-3 py-1.5 text-sm text-clay-600">
              {error}
            </div>
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

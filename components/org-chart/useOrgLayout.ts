import dagre from "@dagrejs/dagre";
import type { Edge, Node } from "@xyflow/react";

export const NODE_W = 224;
export const NODE_H = 92;

export type RoleNodeData = {
  title: string;
  personName: string;
  description: string | null;
  isMe: boolean;
  claimed: boolean;
  [key: string]: unknown;
};

export type RoleInput = {
  id: string;
  title: string;
  personName: string;
  description: string | null;
  parentId: string | null;
  isMe: boolean;
  claimed: boolean;
};

/**
 * Lay the roles out top-down with dagre. Positions are derived from the parent
 * pointers on every render, so the DB never stores x/y and the tree self-heals.
 */
export function layoutRoles(roles: RoleInput[]): {
  nodes: Node<RoleNodeData>[];
  edges: Edge[];
} {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "TB", nodesep: 36, ranksep: 64, marginx: 16, marginy: 16 });
  g.setDefaultEdgeLabel(() => ({}));

  const ids = new Set(roles.map((r) => r.id));
  for (const r of roles) g.setNode(r.id, { width: NODE_W, height: NODE_H });

  const edges: Edge[] = [];
  for (const r of roles) {
    if (r.parentId && ids.has(r.parentId)) {
      g.setEdge(r.parentId, r.id);
      edges.push({
        id: `${r.parentId}->${r.id}`,
        source: r.parentId,
        target: r.id,
        type: "smoothstep",
        style: { stroke: "#c6cdcd", strokeWidth: 2 },
      });
    }
  }

  dagre.layout(g);

  const nodes: Node<RoleNodeData>[] = roles.map((r) => {
    const p = g.node(r.id);
    return {
      id: r.id,
      type: "role",
      position: { x: p.x - NODE_W / 2, y: p.y - NODE_H / 2 },
      data: {
        title: r.title,
        personName: r.personName,
        description: r.description,
        isMe: r.isMe,
        claimed: r.claimed,
      },
    };
  });

  return { nodes, edges };
}

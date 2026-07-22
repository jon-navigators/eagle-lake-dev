// Pure helpers over the org-chart role tree. No DB, no React — easy to unit test.
// The parent pointer on each role IS the tree; teams are derived from it.

export type OrgRole = {
  id: string;
  parentId: string | null;
  userId?: string | null;
};

/** Map of parentId ("" for roots) -> child roles, preserving input order. */
export function buildChildrenMap<T extends OrgRole>(
  roles: T[],
): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const role of roles) {
    const key = role.parentId ?? "";
    const list = map.get(key);
    if (list) list.push(role);
    else map.set(key, [role]);
  }
  return map;
}

/** The roots of the forest (roles with no parent, or a dangling parent). */
export function rootRoles<T extends OrgRole>(roles: T[]): T[] {
  const ids = new Set(roles.map((r) => r.id));
  return roles.filter((r) => !r.parentId || !ids.has(r.parentId));
}

/**
 * All role ids in the subtree rooted at rootId, inclusive. Iterative BFS so a
 * malformed cyclic input can't blow the stack; a `seen` set guards against it.
 */
export function subtreeRoleIds(roles: OrgRole[], rootId: string): string[] {
  const children = buildChildrenMap(roles);
  const out: string[] = [];
  const seen = new Set<string>();
  const queue: string[] = [rootId];

  while (queue.length > 0) {
    const id = queue.shift()!;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
    for (const child of children.get(id) ?? []) queue.push(child.id);
  }
  return out;
}

/** Subtree ids excluding the root itself. */
export function descendantRoleIds(roles: OrgRole[], rootId: string): string[] {
  return subtreeRoleIds(roles, rootId).filter((id) => id !== rootId);
}

/** Distinct user ids occupying any role in the subtree rooted at rootId. */
export function teamUserIds(roles: OrgRole[], rootId: string): string[] {
  const inSubtree = new Set(subtreeRoleIds(roles, rootId));
  const users = new Set<string>();
  for (const r of roles) {
    if (r.userId && inSubtree.has(r.id)) users.add(r.userId);
  }
  return [...users];
}

/**
 * Would re-parenting `moveId` under `newParentId` create a cycle?
 * True if the target is the node itself or one of its descendants.
 */
export function wouldCreateCycle(
  roles: OrgRole[],
  moveId: string,
  newParentId: string | null,
): boolean {
  if (!newParentId) return false; // detaching to root is always safe
  if (newParentId === moveId) return true;
  return descendantRoleIds(roles, moveId).includes(newParentId);
}

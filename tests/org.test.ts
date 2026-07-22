import { describe, it, expect } from "vitest";
import {
  subtreeRoleIds,
  descendantRoleIds,
  teamUserIds,
  wouldCreateCycle,
  rootRoles,
} from "@/lib/org";

// A small org:
//   ceo (u-ceo)
//   ├── prog (u-prog)
//   │   ├── couns (u-couns)
//   │   └── activ (unclaimed)
//   └── ops  (u-ops)
const roles = [
  { id: "ceo", parentId: null, userId: "u-ceo" },
  { id: "prog", parentId: "ceo", userId: "u-prog" },
  { id: "ops", parentId: "ceo", userId: "u-ops" },
  { id: "couns", parentId: "prog", userId: "u-couns" },
  { id: "activ", parentId: "prog", userId: null },
];

describe("subtreeRoleIds", () => {
  it("includes the root and all descendants", () => {
    expect(new Set(subtreeRoleIds(roles, "prog"))).toEqual(
      new Set(["prog", "couns", "activ"]),
    );
  });
  it("returns just the node for a leaf", () => {
    expect(subtreeRoleIds(roles, "ops")).toEqual(["ops"]);
  });
  it("covers the whole tree from the root", () => {
    expect(subtreeRoleIds(roles, "ceo").sort()).toEqual(
      ["activ", "ceo", "couns", "ops", "prog"].sort(),
    );
  });
});

describe("descendantRoleIds", () => {
  it("excludes the root itself", () => {
    expect(new Set(descendantRoleIds(roles, "prog"))).toEqual(
      new Set(["couns", "activ"]),
    );
  });
});

describe("teamUserIds", () => {
  it("collects claimed users in the subtree, ignoring unclaimed seats", () => {
    expect(new Set(teamUserIds(roles, "prog"))).toEqual(
      new Set(["u-prog", "u-couns"]),
    );
  });
  it("returns the whole org's users from the top", () => {
    expect(new Set(teamUserIds(roles, "ceo"))).toEqual(
      new Set(["u-ceo", "u-prog", "u-ops", "u-couns"]),
    );
  });
});

describe("wouldCreateCycle", () => {
  it("rejects parenting a node to itself", () => {
    expect(wouldCreateCycle(roles, "prog", "prog")).toBe(true);
  });
  it("rejects parenting a node under its own descendant", () => {
    expect(wouldCreateCycle(roles, "prog", "couns")).toBe(true);
  });
  it("allows a safe move", () => {
    expect(wouldCreateCycle(roles, "ops", "prog")).toBe(false);
  });
  it("allows detaching to a root", () => {
    expect(wouldCreateCycle(roles, "couns", null)).toBe(false);
  });
});

describe("rootRoles", () => {
  it("finds nodes with no parent", () => {
    expect(rootRoles(roles).map((r) => r.id)).toEqual(["ceo"]);
  });
  it("treats a dangling parent as a root", () => {
    const orphan = [{ id: "x", parentId: "gone", userId: null }];
    expect(rootRoles(orphan).map((r) => r.id)).toEqual(["x"]);
  });
});

describe("malformed cyclic input", () => {
  it("does not loop forever thanks to the seen-guard", () => {
    const cyclic = [
      { id: "a", parentId: "b", userId: null },
      { id: "b", parentId: "a", userId: null },
    ];
    expect(new Set(subtreeRoleIds(cyclic, "a"))).toEqual(new Set(["a", "b"]));
  });
});

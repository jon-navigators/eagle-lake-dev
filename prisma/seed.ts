/**
 * Optional demo data for local development.
 * Run with:  npm run db:seed   (requires DATABASE_URL to point at your database)
 *
 * Idempotent-ish: users are upserted by email; other rows are only created when
 * the org chart is empty, so re-running won't pile up duplicates.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const people = [
    { email: "dana@navigators.org", name: "Dana Fields" },
    { email: "sam@navigators.org", name: "Sam Ortiz" },
    { email: "riley@navigators.org", name: "Riley Chen" },
  ];

  const users = await Promise.all(
    people.map((p) =>
      prisma.user.upsert({
        where: { email: p.email },
        update: { name: p.name },
        create: { email: p.email, name: p.name, emailVerified: new Date() },
      }),
    ),
  );
  const [dana, sam, riley] = users;

  const existingRoles = await prisma.role.count();
  if (existingRoles === 0) {
    const ceo = await prisma.role.create({
      data: {
        title: "Executive Director",
        personName: dana.name!,
        userId: dana.id,
      },
    });
    const prog = await prisma.role.create({
      data: {
        title: "Program Director",
        personName: sam.name!,
        userId: sam.id,
        parentId: ceo.id,
      },
    });
    await prisma.role.create({
      data: {
        title: "Head Counselor",
        personName: riley.name!,
        userId: riley.id,
        parentId: prog.id,
      },
    });
    await prisma.role.create({
      data: {
        title: "Activities Lead",
        personName: "New hire",
        parentId: prog.id,
      },
    });
  }

  const existingInitiatives = await prisma.initiative.count();
  if (existingInitiatives === 0) {
    const initiative = await prisma.initiative.create({
      data: {
        title: "Grow summer enrollment 15%",
        description: "The headline goal for this season.",
        period: "ANNUAL",
      },
    });

    await prisma.commitment.createMany({
      data: [
        {
          title: "Draft the summer schedule",
          ownerId: sam.id,
          status: "DONE",
          initiativeId: initiative.id,
        },
        {
          title: "Refresh the family-camp landing page",
          ownerId: riley.id,
          status: "OPEN",
          initiativeId: initiative.id,
        },
        {
          title: "Call last year's returning families",
          ownerId: dana.id,
          status: "OPEN",
          initiativeId: initiative.id,
        },
      ],
    });

    // A pending request: Dana asks Sam to review the budget.
    await prisma.commitment.create({
      data: {
        title: "Review the retreat budget",
        ownerId: sam.id,
        requesterId: dana.id,
        requestStatus: "PENDING",
      },
    });
  }

  console.log("Seeded demo data ✓");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

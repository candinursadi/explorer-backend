import { prisma } from "infrastructure/db";

async function createFiles(folderId: string, folderName: string) {
    const data = Array.from({ length: 5 }).map((_, i) => ({ name: `File ${i+1} ${folderName}`, folderId }));
    await prisma.file.createMany({ data });
}

async function main() {
    console.log("Seeding start...");
    await prisma.file.deleteMany();
    await prisma.folder.deleteMany();

    // level 1: 4 roots
    let currentLevelIds: string[] = [];
    const roots = await Promise.all(
        Array.from({ length: 4 }).map((_, i) =>
            prisma.folder.create({ data: { name: `Level 1 Folder ${i+1}`, parentId: null } })
        )
    );
    currentLevelIds = roots.map(r => r.id);
    await Promise.all(
        roots.map(r => createFiles(r.id, r.name))
    );

    // levels 2..4
    for (let level = 2; level <= 4; level++) {
        const nextLevel: { id: string; name: string }[] = [];

        for (const parentId of currentLevelIds) {
            const children = await Promise.all(
            Array.from({ length: 10 }).map((_, i) =>
                prisma.folder.create({
                data: { name: `Level ${level} Folder ${i+1}`, parentId },
                })
            )
            );

            nextLevel.push(...children);
        }

        await Promise.all(nextLevel.map(c => createFiles(c.id, c.name)));

        currentLevelIds = nextLevel.map(c => c.id);

        console.log(`Level ${level} created: ${currentLevelIds.length} folders`);
    }

    console.log("Seeding done.");
    process.exit(0);
}

main().catch(async (e) => {
    console.error(e);
    process.exit(1);
});

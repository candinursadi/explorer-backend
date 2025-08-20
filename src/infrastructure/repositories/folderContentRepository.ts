import { prisma } from "../db";

export const FolderContentRepository = {
    getByFolderId: async (folderId: string, skip = 0, take = 20) => {
        const contents = await prisma.$queryRaw<
            { id: string; name: string; type: "folder" | "file"; createdAt: Date; updatedAt: Date }[]
        >`
            SELECT id, name, 'folder' as type, "parentId" as folderId, "createdAt", "updatedAt"
            FROM "Folder"
            WHERE "parentId" = ${folderId}::uuid
            
            UNION ALL
            
            SELECT id, name, 'file' as type, "folderId", "createdAt", "updatedAt"
            FROM "File"
            WHERE "folderId" = ${folderId}::uuid
            
            ORDER BY 
                type DESC,
                name ASC
            OFFSET ${skip}
            LIMIT ${take};
        `;

        return contents;
    },

    countByFolderId: async (folderId: string) => {
        const [result] = await prisma.$queryRaw<{ count: bigint }[]>`
            SELECT COUNT(*)::bigint as count
            FROM (
                SELECT id FROM "Folder"
                WHERE "parentId" = ${folderId}::uuid

                UNION ALL

                SELECT id FROM "File"
                WHERE "folderId" = ${folderId}::uuid
            ) as combined
        `;

        return Number(result.count);
    },
};

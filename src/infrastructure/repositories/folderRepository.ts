import { prisma } from "../db";

export const FolderRepository = {
    getRoots: (skip = 0, take = 20) =>
        prisma.folder.findMany({
            where: { parentId: null },
            orderBy: { name: "asc" },
            skip, take
        }),

    countRoots: () => prisma.folder.count({ where: { parentId: null } }),

    getById: (id: string) =>
        prisma.folder.findUnique({ where: { id } }),

    getByParentId: (parentId: string, skip = 0, take = 20) =>
        prisma.folder.findMany({
            where: { parentId },
            orderBy: { name: "asc" },
            skip, take
        }),

    countByParentId: (parentId: string) =>
        prisma.folder.count({ where: { parentId } }),

    searchByName: (q: string, skip = 0, take = 20) =>
        prisma.folder.findMany({
            where: { name: { contains: q, mode: "insensitive" } },
            orderBy: { name: "asc" },
            skip, take
        }),

    countSearchByName: (q: string) =>
        prisma.folder.count({ where: { name: { contains: q, mode: "insensitive" } } }),
};

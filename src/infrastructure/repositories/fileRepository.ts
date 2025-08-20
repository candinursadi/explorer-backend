import { prisma } from "../db";

export const FileRepository = {
    getByFolderId: (folderId: string, skip = 0, take = 20) =>
        prisma.file.findMany({
            where: { folderId },
            orderBy: { name: "asc" },
            skip, take
        }),

    countByFolderId: (folderId: string) =>
        prisma.file.count({ where: { folderId } }),

    searchByName: (q: string, skip = 0, take = 20) =>
        prisma.file.findMany({
            where: { name: { contains: q, mode: "insensitive" } },
            orderBy: { name: "asc" },
            skip, take
        }),

    countSearchByName: (q: string) =>
        prisma.file.count({ where: { name: { contains: q, mode: "insensitive" } } }),
};

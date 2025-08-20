import { FolderRepository } from "../infrastructure/repositories/folderRepository";
import { FileRepository } from "../infrastructure/repositories/fileRepository";
import { HttpError } from "../utils/responses";
import { buildPaginationMeta } from "../utils/pagination";
import { ContentDTO, FolderDTO } from "../domain/types/folder";
import { FileDTO } from "../domain/types/file";
import { FolderContentRepository } from "../infrastructure/repositories/FolderContentRepository";

export const FolderService = {
    getRootFolders: async (
        skip: number,
        take: number,
        currentPage: number,
        baseUrl: string
    ): Promise<{ items: FolderDTO[]; meta: any }> => {
        const [rows, total] = await Promise.all([
            FolderRepository.getRoots(skip, take),
            FolderRepository.countRoots()
        ]);

        const items: FolderDTO[] = rows.map(r => ({
            id: r.id,
            name: r.name,
            parentId: r.parentId,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt
        }));

        return { items, meta: buildPaginationMeta(total, baseUrl, currentPage, take) };
    },

    getSubFolders: async (
        parentId: string,
        skip: number,
        take: number,
        currentPage: number,
        baseUrl: string
    ): Promise<{ items: FolderDTO[]; meta: any }> => {
        const exists = await FolderRepository.getById(parentId);
        if (!exists) throw new HttpError("Folder not found", 404);

        const [rows, total] = await Promise.all([
            FolderRepository.getByParentId(parentId, skip, take),
            FolderRepository.countByParentId(parentId)
        ]);

        const items: FolderDTO[] = rows.map(r => ({
            id: r.id,
            name: r.name,
            parentId: r.parentId,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt
        }));

        return { items, meta: buildPaginationMeta(total, baseUrl, currentPage, take) };
    },

    getFilesByFolder: async (
        folderId: string,
        skip: number,
        take: number,
        currentPage: number,
        baseUrl: string
    ): Promise<{ items: FileDTO[]; meta: any }> => {
        const exists = await FolderRepository.getById(folderId);
        if (!exists) throw new HttpError("Folder not found", 404);

        const [rows, total] = await Promise.all([
            FileRepository.getByFolderId(folderId, skip, take),
            FileRepository.countByFolderId(folderId)
        ]);

        const items: FileDTO[] = rows.map(r => ({
            id: r.id,
            folderId: r.folderId,
            name: r.name,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt
        }));

        return { items, meta: buildPaginationMeta(total, baseUrl, currentPage, take) };
    },

    getContents: async (
        folderId: string,
        skip: number,
        take: number,
        currentPage: number,
        baseUrl: string
    ): Promise<{ items: ContentDTO[]; meta: any }> => {
        const exists = await FolderRepository.getById(folderId);
        if (!exists) throw new HttpError("Folder not found", 404);

        const [rows, total] = await Promise.all([
            FolderContentRepository.getByFolderId(folderId, skip, take),
            FolderContentRepository.countByFolderId(folderId),
        ]);

        const items: ContentDTO[] = rows.map((r) => ({
            id: r.id,
            name: r.name,
            type: r.type,
            folderId: folderId,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
        }));

        return { items, meta: buildPaginationMeta(total, baseUrl, currentPage, take) };
    },
};

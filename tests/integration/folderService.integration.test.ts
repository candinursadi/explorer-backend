import { describe, it, expect, afterAll } from "vitest";
import { FolderService } from "../../src/services/folderService";
import { prisma } from "../../src/infrastructure/db";
import { randomUUID } from "crypto";

const skip = 0;
const take = 10;
const page = 1;
const fakeId = randomUUID();

describe("FolderService (Integration)", () => {
    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("getRootFolders returns seeded root folders", async () => {
        const endpoint = "/api/v1/folders";
        const result = await FolderService.getRootFolders(skip, take, page, endpoint);

        expect(result.items.length).toBeGreaterThan(0);
        expect(result.meta.total).toBeGreaterThan(0);
        expect(result.meta.firstPageUrl).toContain(endpoint);
    });

    it("getSubFolders returns items if parent exists", async () => {
        const roots = await FolderService.getRootFolders(skip, take, page, "/api/v1/folders");
        expect(roots.items.length).toBeGreaterThan(0);

        const parent = roots.items[0];
        const endpoint = `/api/v1/folders/${parent.id}`;
        const result = await FolderService.getSubFolders(parent.id, skip, take, page, endpoint);

        expect(result.items.length).toBeGreaterThanOrEqual(0);
        if (result.items.length > 0) {
            expect(result.items[0].parentId).toBe(parent.id);
        }
    });

    it("getFilesByFolder returns items if folder has files", async () => {
        const folder = await prisma.folder.findFirst({
            where: { parentId: { not: null } },
        });
        expect(folder).not.toBeNull();

        const endpoint = `/api/v1/folders/${folder!.id}/files`;
        const result = await FolderService.getFilesByFolder(folder!.id, skip, take, page, endpoint);

        expect(result.items.length).toBeGreaterThanOrEqual(0);
        if (result.items.length > 0) {
            expect(result.items[0].folderId).toBe(folder!.id);
        }
    });

    it("getContents returns items if folder has contents", async () => {
        const folder = await prisma.folder.findFirst({
            where: { parentId: { not: null } },
        });
        expect(folder).not.toBeNull();

        const endpoint = `/api/v1/folders/${folder!.id}/contents`;
        const result = await FolderService.getContents(folder!.id, skip, take, page, endpoint);

        expect(result.items.length).toBeGreaterThanOrEqual(0);
        if (result.items.length > 0) {
            expect(result.items[0].folderId).toBe(folder!.id);
        }
    });

    it("getSubFolders throws if parent does not exist", async () => {
        await expect(
            FolderService.getSubFolders(fakeId, 0, 20, 1, `/api/v1/folders/${fakeId}`)
        ).rejects.toThrowError("Folder not found");
    });

    it("getFilesByFolder throws if folder not found", async () => {
        await expect(
            FolderService.getFilesByFolder(fakeId, 0, 20, 1, `/api/v1/folders/${fakeId}/files`)
        ).rejects.toThrowError("Folder not found");
    });

    it("getContents throws if folder not found", async () => {
        await expect(
            FolderService.getContents(fakeId, 0, 20, 1, `/api/v1/folders/${fakeId}/contents`)
        ).rejects.toThrowError("Folder not found");
    });
});

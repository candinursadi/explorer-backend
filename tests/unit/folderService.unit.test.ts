import { describe, it, expect, vi, beforeEach, type MockedFunction } from "vitest";
import { FolderService } from "../../src/services/folderService";
import { FolderRepository } from "../../src/infrastructure/repositories/folderRepository";
import { FileRepository } from "../../src/infrastructure/repositories/fileRepository";
import { FolderContentRepository } from "../../src/infrastructure/repositories/FolderContentRepository";
import { HttpError } from "../../src/utils/responses";
import { buildPaginationMeta } from "../../src/utils/pagination";
import { ContentDTO, FolderDTO } from "../../src/domain/types/folder";
import { FileDTO } from "../../src/domain/types/file";

// --- Mock dependency ---
vi.mock("../../src/infrastructure/repositories/folderRepository");
vi.mock("../../src/infrastructure/repositories/fileRepository");
vi.mock("../../src/infrastructure/repositories/folderContentRepository");
vi.mock("../../src/utils/pagination", () => ({
    buildPaginationMeta: vi.fn(() => ({ totalItems: 1, page: 1, baseUrl: "/test" })),
}));

describe("FolderService (Unit)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("getRootFolders returns items and meta", async () => {
        const mockFolder: FolderDTO = {
            id: "1",
            name: "root",
            parentId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        (FolderRepository.getRoots as MockedFunction<typeof FolderRepository.getRoots>)
            .mockResolvedValue([mockFolder]);
        (FolderRepository.countRoots as MockedFunction<typeof FolderRepository.countRoots>)
            .mockResolvedValue(1);

        const result = await FolderService.getRootFolders(0, 10, 1, "/folders");

        expect(result.items).toHaveLength(1);
        expect(result.items[0].name).toBe("root");
        expect(buildPaginationMeta).toHaveBeenCalledWith(1, "/folders", 1, 10);
        expect(result.meta.totalItems).toBe(1);
    });

    it("getSubFolders throws if parent does not exist", async () => {
        (FolderRepository.getById as MockedFunction<typeof FolderRepository.getById>)
            .mockResolvedValue(null);

        await expect(
            FolderService.getSubFolders("bad-id", 0, 10, 1, "/folders")
        ).rejects.toThrow(HttpError);
    });

    it("getSubFolders returns items and meta if parent exists", async () => {
        const parent: FolderDTO = {
            id: "p1",
            name: "parent",
            parentId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const child: FolderDTO = {
            id: "c1",
            name: "child",
            parentId: "p1",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        (FolderRepository.getById as MockedFunction<typeof FolderRepository.getById>)
            .mockResolvedValue(parent);
        (FolderRepository.getByParentId as MockedFunction<typeof FolderRepository.getByParentId>)
            .mockResolvedValue([child]);
        (FolderRepository.countByParentId as MockedFunction<typeof FolderRepository.countByParentId>)
            .mockResolvedValue(1);

        const result = await FolderService.getSubFolders("p1", 0, 10, 1, "/folders");

        expect(result.items[0].name).toBe("child");
        expect(buildPaginationMeta).toHaveBeenCalledWith(1, "/folders", 1, 10);
    });

    it("getFilesByFolder throws if folder not found", async () => {
        (FolderRepository.getById as MockedFunction<typeof FolderRepository.getById>)
            .mockResolvedValue(null);

        await expect(
            FolderService.getFilesByFolder("bad-folder", 0, 10, 1, "/files")
        ).rejects.toThrow(HttpError);
    });

    it("getFilesByFolder returns items and meta if folder exists", async () => {
        const folder: FolderDTO = {
            id: "f1",
            name: "folder",
            parentId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const file: FileDTO = {
            id: "file1",
            folderId: "f1",
            name: "readme.md",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        (FolderRepository.getById as MockedFunction<typeof FolderRepository.getById>)
            .mockResolvedValue(folder);
        (FileRepository.getByFolderId as MockedFunction<typeof FileRepository.getByFolderId>)
            .mockResolvedValue([file]);
        (FileRepository.countByFolderId as MockedFunction<typeof FileRepository.countByFolderId>)
            .mockResolvedValue(1);

        const result = await FolderService.getFilesByFolder("f1", 0, 10, 1, "/files");

        expect(result.items[0].name).toBe("readme.md");
        expect(buildPaginationMeta).toHaveBeenCalledWith(1, "/files", 1, 10);
    });

    it("getContents throws if folder not found", async () => {
    (FolderRepository.getById as MockedFunction<typeof FolderRepository.getById>)
        .mockResolvedValue(null);

    await expect(
        FolderService.getContents("bad-folder", 0, 10, 1, "/contents")
    ).rejects.toThrow(HttpError);
});

it("getContents returns items and meta if folder exists", async () => {
    const folder: FolderDTO = {
        id: "f1",
        name: "folder",
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const row = {
        id: "c1",
        name: "child-item",
        type: "file" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    (FolderRepository.getById as MockedFunction<typeof FolderRepository.getById>)
        .mockResolvedValue(folder);
    (FolderContentRepository.getByFolderId as MockedFunction<typeof FolderContentRepository.getByFolderId>)
        .mockResolvedValue([row]);
    (FolderContentRepository.countByFolderId as MockedFunction<typeof FolderContentRepository.countByFolderId>)
        .mockResolvedValue(1);

    const result = await FolderService.getContents("f1", 0, 10, 1, "/contents");

    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe("c1");
    expect(result.items[0].name).toBe("child-item");
    expect(result.items[0].folderId).toBe("f1");
    expect(buildPaginationMeta).toHaveBeenCalledWith(1, "/contents", 1, 10);
    expect(result.meta.totalItems).toBe(1);
});

});

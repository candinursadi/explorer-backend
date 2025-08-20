import { FolderService } from "../services/folderService";
import { withPagination } from "../utils/pagination";
import { ensureValidId } from "../utils/validators";
import { successResponse } from "../utils/responses";

export const FolderController = {
    getRoots: async ({ query, request }: any): Promise<Response> => {
        const { items, meta } = await withPagination(query, request, (take, skip, currentPage, baseUrl) =>
            FolderService.getRootFolders(skip, take, currentPage, baseUrl)
        );
        return successResponse(items, meta);
    },

    getSubFolders: async ({ params, query, request }: any): Promise<Response> => {
        const folderId = ensureValidId(params);

        const { items, meta } = await withPagination(query, request, (take, skip, currentPage, baseUrl) =>
            FolderService.getSubFolders(folderId, skip, take, currentPage, baseUrl)
        );
        return successResponse(items, meta);
    },

    getFiles: async ({ params, query, request }: any): Promise<Response> => {
        const folderId = ensureValidId(params);

        const { items, meta } = await withPagination(query, request, (take, skip, currentPage, baseUrl) =>
            FolderService.getFilesByFolder(folderId, skip, take, currentPage, baseUrl)
        );
        return successResponse(items, meta);
    },

    getContents: async ({ params, query, request }: any): Promise<Response> => {
        const folderId = ensureValidId(params);

        const { items, meta } = await withPagination(query,request, (take, skip, currentPage, baseUrl) =>
            FolderService.getContents(folderId, skip, take, currentPage, baseUrl)
        );

        return successResponse(items, meta);
    },
};

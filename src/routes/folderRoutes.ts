import { Elysia } from "elysia";
import { FolderController } from "../controllers/folderController";

export const folderRoutes = (app: Elysia) =>
    app.group("/api/v1", app =>
        app
        .get("/folders", FolderController.getRoots)
        .get("/folders/:id", FolderController.getSubFolders)
        .get("/folders/:id/files", FolderController.getFiles)
        .get("/folders/:id/contents", FolderController.getContents)
    );

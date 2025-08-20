export interface FolderDTO {
    id: string;
    name: string;
    parentId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface ContentDTO {
    id: string;
    name: string;
    type: "folder" | "file";
    folderId: string;
    createdAt: Date;
    updatedAt: Date;
}

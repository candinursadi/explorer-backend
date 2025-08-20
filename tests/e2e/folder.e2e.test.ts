import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { createServer } from "http";
import { buildApp } from "../../src/app";

let app: ReturnType<typeof buildApp>;
let server: any;

function sendResponse(res: any, response: Response) {
    res.writeHead(response.status, Object.fromEntries(response.headers));
    if (response.body) {
        const reader = response.body.getReader();
        function push() {
            reader.read().then(({ done, value }) => {
                if (done) {
                res.end();
                return;
                }
                res.write(value);
                push();
            });
        }
        push();
    } else {
        res.end();
    }
}

describe("Folder Routes (E2E)", () => {
    beforeAll(() => {
        app = buildApp();
        server = createServer((req, res) => {
        const url = `http://${req.headers.host}${req.url}`;
        const requestInit: RequestInit = {
            method: req.method,
            headers: req.headers as any,
            body: req.method !== "GET" && req.method !== "HEAD" ? (req as any) : undefined,
        };
        const request = new Request(url, requestInit);
        app.handle(request).then((response) => sendResponse(res, response));
        }).listen(0); // listen di port random for Supertest server
    });

    afterAll(() => {
        server.close();
    });

    it("GET /api/v1/folders returns root folders", async () => {
        const res = await request(server).get("/api/v1/folders");
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    it("GET /api/v1/folders/:id returns subfolders", async () => {
        const roots = await request(server).get("/api/v1/folders");
        const parentId = roots.body.data[0].id;

        const res = await request(server).get(`/api/v1/folders/${parentId}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("GET /api/v1/folders/:id/files returns files", async () => {
        const roots = await request(server).get("/api/v1/folders");
        const parentId = roots.body.data[0].id;

        const res = await request(server).get(`/api/v1/folders/${parentId}/files`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("GET /api/v1/folders/:id/contents returns contents", async () => {
        const roots = await request(server).get("/api/v1/folders");
        const parentId = roots.body.data[0].id;

        const res = await request(server).get(`/api/v1/folders/${parentId}/contents`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});

import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import { helmet } from "elysia-helmet";
import { folderRoutes } from "./routes/folderRoutes";
import { errorResponse, HttpError } from "./utils/responses";

export const buildApp = () =>
    new Elysia()
        .onError(({ error }) => {
            if (error instanceof HttpError) {
                return errorResponse(error.message, error.statusCode, error.errors);
            }
            return errorResponse("Internal server error", 500);
        })
        .use(cors())
        .use(helmet())
        .use(folderRoutes)
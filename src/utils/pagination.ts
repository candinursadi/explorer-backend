import { PaginationMeta } from "domain/types/pagination";
import { paginationQuerySchema } from "./validators";
import { HttpError } from "./responses";

export function parsePagination(
    q: Record<string, unknown>,
    defaults = { limit: 20, page: 1, max: 100 }
) {
    const perPage = Math.min(
        Math.max(parseInt(String(q.limit ?? defaults.limit), 10) || defaults.limit, 1),
        defaults.max
    );
    const currentPage = Math.max(
        parseInt(String(q.page ?? defaults.page), 10) || defaults.page,
        1
    );
    const skip = (currentPage - 1) * perPage;
    return { take: perPage, skip, currentPage };
}

export function buildPaginationMeta(
    total: number,
    baseUrl: string,
    currentPage: number,
    perPage: number
): PaginationMeta {
    const lastPage = Math.max(Math.ceil(total / perPage), 1);
    const firstPage = 1;
    const mk = (page: number | null) => (page ? `${baseUrl}?page=${page}&limit=${perPage}` : null);
    return {
        total,
        perPage,
        currentPage,
        lastPage,
        firstPage,
        firstPageUrl: mk(firstPage),
        lastPageUrl: mk(lastPage),
        nextPageUrl: currentPage < lastPage ? mk(currentPage + 1) : null,
        previousPageUrl: currentPage > firstPage ? mk(currentPage - 1) : null
    };
}

export async function withPagination<T>(
    query: any,
    request: Request,
    handler: (take: number, skip: number, currentPage: number, baseUrl: string) => Promise<{ items: T; meta: any }>
) {
    const q = paginationQuerySchema.safeParse(query);
    if (!q.success) throw new HttpError("Invalid pagination", 400, q.error.flatten());

    const { take, skip, currentPage } = parsePagination(query);
    const baseUrl = new URL(request.url).pathname;

    return handler(take, skip, currentPage, baseUrl);
}
import { z } from "zod";
import { HttpError } from "./responses";

export const paginationQuerySchema = z.object({
  page: z.string().transform(v => parseInt(v, 10)).optional(),
  limit: z.string().transform(v => parseInt(v, 10)).optional(),
});

export const idParamSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID" })
});

export function ensureValidId(params: any) {
    const pv = idParamSchema.safeParse(params);
    if (!pv.success) throw new HttpError("Invalid id", 400, pv.error.flatten());
    return params.id;
}
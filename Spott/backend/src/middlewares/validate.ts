import { ZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

type Source = "body" | "query" | "params";

export const validate =
    (schema: ZodObject<any>, source: Source = "body") =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
        const data = schema.parse((req as any)[source]);
        (req as any)[source] = data; // ya "parseado"
        next();
        } catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({ message: "Validación fallida", errors: err.flatten() });
        }
        next(err);
        }
    };
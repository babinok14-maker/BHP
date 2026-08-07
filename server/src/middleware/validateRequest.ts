import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

// Validates req.body / req.params / req.query against a Zod schema.
// Keeps validation declarative and out of controllers.
export function validateRequest(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({ body: req.body, params: req.params, query: req.query });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.errors.map((e) => e.message).join(", ");
        return next(new (require("../utils/AppError").AppError)(message, 422));
      }
      next(err);
    }
  };
}

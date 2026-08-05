import type { NextFunction, Request, Response } from "express";

// Express 4 no propaga rechazos de promesas de handlers async — sin esto,
// un error de la base de datos deja el request colgado sin log ni respuesta.
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

import type { NextFunction, Request, Response } from "express";

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;

  if (!token || token !== process.env.ADMIN_API_TOKEN) {
    return res.status(401).json({ error: "No autorizado" });
  }

  next();
}

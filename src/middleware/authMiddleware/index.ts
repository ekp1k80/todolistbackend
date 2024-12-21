import { Request, Response, NextFunction } from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.oidc.isAuthenticated() && process.env.NODE_ENV !== "test") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
};

export default authMiddleware;